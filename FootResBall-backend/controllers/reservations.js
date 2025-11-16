const Reservation = require("../models/Reservation");
const { v4: uuidv4 } = require("uuid");
const generateReservationPDF = require("../utils/pdfGenerator");

// Working hours
const MIN_TIME = "08:00";
const MAX_TIME = "22:00";

// تحويل HH:MM إلى دقائق
function toMinutes(time) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

// إضافة ساعات إلى تاريخ
function addHours(date, hours) {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

// حساب الثمن الأساسي
function getBasePrice(duration) {
  return duration === 1 ? 150 : 300;
}

// حساب الزيادة حسب التيران
function getTerrainExtra(terrain) {
  if (terrain === "B") return 10;
  if (terrain === "C") return 20;
  return 0; // Terrain A
}

// =======================
// ADD RESERVATION
// =======================
exports.addReservation = async (req, res) => {
  try {
    const {
      customerName,
      phoneNumber,
      idCard,
      terrain,
      date,
      timeSlotStart,
      duration,
      paid,
    } = req.body;

    // START TIME
    const start = new Date(`${date}T${timeSlotStart}:00`);
    if (isNaN(start.getTime())) {
      return res.status(400).json({ message: "Invalid start time format." });
    }

    // END TIME
    const end = addHours(start, duration);

    // Working hours check
    const startMinutes = toMinutes(timeSlotStart);
    const endMinutes = startMinutes + duration * 60;

    if (startMinutes < toMinutes(MIN_TIME)) {
      return res.status(400).json({ message: "Matches start at 08:00." });
    }

    if (endMinutes > toMinutes(MAX_TIME)) {
      return res.status(400).json({ message: "Match must end before 22:00." });
    }

    // Cannot reserve past time
    const now = new Date();
    if (start <= now) {
      return res
        .status(400)
        .json({ message: "Cannot reserve a past time slot." });
    }

    // Must reserve at least 2 hours before
    const diffHours = (start - now) / (1000 * 60 * 60);
    if (diffHours < 2) {
      return res.status(400).json({
        message: "Reservation must be made at least 2 hours before.",
      });
    }

    // Check conflict
    const conflict = await Reservation.findOne({
      terrain,
      date,
      $or: [{ timeSlotStart: { $lt: end } }, { timeSlotEnd: { $gt: start } }],
    });

    if (conflict) {
      return res.status(400).json({ message: "This time is already booked." });
    }

    // PRICE
    const basePrice = getBasePrice(duration);
    const extra = getTerrainExtra(terrain);
    const price = basePrice + extra;

    // CREATE RESERVATION
    const reservation = new Reservation({
      customerName,
      phoneNumber,
      idCard,
      terrain,
      date,
      timeSlotStart: start,
      timeSlotEnd: end,
      duration,
      price,
      paid,
      reservationCode: uuidv4().slice(0, 8),
    });

    await reservation.save();

    res.status(201).json(reservation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET available time slots for a given date, terrain, and duration
exports.getAvailableSlots = async (req, res) => {
  try {
    const { date, terrain, duration = 1 } = req.query;

    if (!date || !terrain) {
      return res
        .status(400)
        .json({ message: "Please provide date and terrain." });
    }

    const dur = parseInt(duration); // تحويل duration لرقم

    // All possible 1h slots (يمكن توسيع حسب الحاجة)
    const TIME_SLOTS = [
      "08:00",
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
      "18:00",
      "19:00",
      "20:00",
      "21:00",
    ];

    // جلب جميع الحجوزات فهاد اليوم وهاد التيران
    const reservations = await Reservation.find({ date, terrain });

    const availableSlots = [];

    for (let i = 0; i <= TIME_SLOTS.length - dur; i++) {
      // كل block من slots حسب duration
      const block = TIME_SLOTS.slice(i, i + dur);
      const blockStart = new Date(`${date}T${block[0]}:00`);
      const blockEnd = new Date(`${date}T${block[block.length - 1]}:00`);
      blockEnd.setHours(blockEnd.getHours() + 1); // duration تتحسب على آخر slot

      // Check conflict
      const conflict = reservations.some((r) => {
        const rStart = new Date(r.timeSlotStart);
        const rEnd = new Date(r.timeSlotEnd);
        return blockStart < rEnd && blockEnd > rStart;
      });

      if (!conflict) availableSlots.push(block[0]); // Add starting time of block
    }

    res.json({ date, terrain, duration: dur, availableSlots });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =======================
// GET ALL RESERVATIONS
// =======================
exports.getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({
      date: 1,
      timeSlotStart: 1,
    });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =======================
// GET ONE BY ID
// =======================
exports.getReservationById = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findById(id);
    if (!reservation)
      return res.status(404).json({ message: "Reservation not found" });

    res.json(reservation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =======================
// GET PDF
// =======================
exports.getReservationPDF = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findById(id);

    if (!reservation)
      return res.status(404).json({ message: "Reservation not found" });

    generateReservationPDF(reservation, res);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =======================
// UPDATE RESERVATION
// =======================
exports.updateReservation = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Reservation.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updated)
      return res.status(404).json({ message: "Reservation not found" });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =======================
// DELETE
// =======================
exports.deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Reservation.findByIdAndDelete(id);
    if (!deleted)
      return res.status(404).json({ message: "Reservation not found" });

    res.json({ message: "Reservation deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =======================
// FILTER
// =======================
exports.filterReservations = async (req, res) => {
  try {
    const { terrain, date } = req.query;

    const query = {};
    if (terrain) query.terrain = terrain;
    if (date) query.date = date;

    const results = await Reservation.find(query).sort({
      date: 1,
      timeSlotStart: 1,
    });

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
