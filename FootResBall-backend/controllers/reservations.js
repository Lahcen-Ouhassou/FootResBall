const Reservation = require("../models/Reservation");
const { v4: uuidv4 } = require("uuid");
const generateReservationPDF = require("../utils/pdfGenerator");

// =======================
// SETTINGS All
// =======================

const MIN_TIME = "08:00";
const MAX_TIME = "23:00";

// HH:MM → minutes  ,
//           "08:30" إلى 510 minutes
function toMinutes(time) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

// Add hours to a date
// addHours(new Date("2025-11-20T18:00"), 2) =>  20:00
function addHours(date, hours) {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

// Base price
function getBasePrice(duration) {
  return duration * 150; // 150 dh per hour
}

// Extra price per terrain
function getTerrainExtra(terrain) {
  if (terrain === "B") return 10;
  if (terrain === "C") return 20;
  return 0; // terrain A
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

    // Convert start to Date
    const start = new Date(`${date}T${timeSlotStart}:00`);
    if (isNaN(start.getTime())) {
      return res.status(400).json({ message: "Invalid start Time." });
    }

    // Calculate end
    const end = addHours(start, duration);

    // Check conflict (FIXED ✔)
    const conflict = await Reservation.findOne({
      terrain,
      date: new Date(date),
      timeSlotStart: { $lt: end },
      timeSlotEnd: { $gt: start },
    });

    if (conflict) {
      return res.status(400).json({
        message: "This time is already Booked.",
      });
    }

    const startHour = String(start.getHours()).padStart(2, "0"); //0 → "00" , 14 → "14"
    const startMin = String(start.getMinutes()).padStart(2, "0"); //0 → "00" , 30 → "30"

    const endHour = String(end.getHours()).padStart(2, "0");
    const endMin = String(end.getMinutes()).padStart(2, "0");

    const timeSlotString = `${startHour}:${startMin}-${endHour}:${endMin}`;
    // PRICE SYSTEM
    const price = getBasePrice(duration) + getTerrainExtra(terrain);

    // Create reservation
    const reservation = new Reservation({
      customerName,
      phoneNumber,
      idCard,
      terrain,
      date: new Date(date),
      timeSlotStart: start,
      timeSlotEnd: end,
      timeSlot: timeSlotString,
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

// =======================
// Get Available Slots
// =======================
exports.getAvailableSlots = async (req, res) => {
  try {
    const { date, terrain, duration = 1 } = req.query;

    if (!date || !terrain) {
      return res
        .status(400)
        .json({ message: "Please provide date and terrain." });
    }

    const dur = parseInt(duration);

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
      "22:00",
    ];

    const reservations = await Reservation.find({ date, terrain });

    const parsedReservations = reservations.map((r) => ({
      start: new Date(r.timeSlotStart),
      end: new Date(r.timeSlotEnd),
    }));

    const availableSlots = [];

    for (let i = 0; i < TIME_SLOTS.length; i++) {
      const blockStart = new Date(`${date}T${TIME_SLOTS[i]}:00`);

      // blockEnd = blockStart + duration(hours)
      const blockEnd = new Date(blockStart.getTime() + dur * 60 * 60 * 1000);

      // check conflict
      const conflict = parsedReservations.some((r) => {
        return blockStart < r.end && blockEnd > r.start;
      });

      if (!conflict) availableSlots.push(TIME_SLOTS[i]);
    }

    res.json({
      date,
      terrain,
      duration: dur,
      availableSlots,
    });
  } catch (err) {
    console.log(err);
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
// GET RESERVATION BY ID
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

    const reservation = await Reservation.findById(id);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    // ============================
    // 1️⃣ Convert start → Date()
    // ============================
    const start = new Date(`${date}T${timeSlotStart}:00`);
    if (isNaN(start.getTime())) {
      return res.status(400).json({ message: "Invalid start time." });
    }

    // END TIME
    const end = new Date(start.getTime() + duration * 60 * 60 * 1000);

    // ============================
    // 2️⃣ RE-CHECK conflict
    // ============================
    const conflict = await Reservation.findOne({
      _id: { $ne: id },
      terrain,
      date,
      $or: [{ timeSlotStart: { $lt: end } }, { timeSlotEnd: { $gt: start } }],
    });

    if (conflict) {
      return res.status(400).json({ message: "This time is already booked." });
    }

    // ============================
    // 3️⃣ RE-CALCULATE PRICE
    // ============================
    const basePrice = getBasePrice(duration);
    const extra = getTerrainExtra(terrain);
    const finalPrice = basePrice + extra;

    // ============================
    // 4️⃣ UPDATE FIELDS
    // ============================
    reservation.customerName = customerName;
    reservation.phoneNumber = phoneNumber;
    reservation.idCard = idCard;
    reservation.terrain = terrain;
    reservation.date = date;
    reservation.timeSlotStart = start;
    reservation.timeSlotEnd = end;
    reservation.duration = duration;
    reservation.price = finalPrice;
    reservation.paid = paid;

    await reservation.save();

    res.json(reservation);
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
