const Reservation = require("../models/Reservation");
const { v4: uuidv4 } = require("uuid");
const generateReservationPDF = require("../utils/pdfGenerator");

// Time slots الثابتة
const TIME_SLOTS = [
  "08:00-09:00",
  "09:15-10:15",
  "10:30-11:30",
  "11:45-12:45",
  "14:00-15:00",
  "15:15-16:15",
  "16:30-17:30",
  "17:45-18:45",
];

// Function باش تشيك الوقت
function canReserve(selectedSlot, date) {
  const [startTime] = selectedSlot.split("-"); // "08:00"
  const now = new Date();
  const reservationDate = new Date(date + " " + startTime);

  // ممنوع يحجز على وقت فات
  if (reservationDate <= now) {
    return { ok: false, message: "هذا الوقت داز، مايمكنش تدير reservation." };
  }

  // خاص يكون باقي على الأقل 2 ساعات قبل الوقت
  const diffMs = reservationDate - now;
  const diffHours = diffMs / (1000 * 60 * 60);
  if (diffHours < 2) {
    return {
      ok: false,
      message: "خاص تبقى على الأقل 2 ساعات قبل بداية المباراة.",
    };
  }

  return { ok: true };
}

// إضافة حجز جديد
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

    // Convert start time to Date object
    const start = new Date(`${date}T${timeSlotStart}:00`);
    const end = new Date(start.getTime() + duration * 60 * 60 * 1000);

    // Check for conflicting reservations
    const conflict = await Reservation.findOne({
      terrain,
      date,
      $or: [{ timeSlotStart: { $lt: end }, timeSlotEnd: { $gt: start } }],
    });

    if (conflict) {
      return res
        .status(400)
        .json({ message: "This time slot is already booked" });
    }

    // Calculate price
    const price = duration === 1 ? 150 : 300;

    // Create reservation
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

// جلب جميع الحجوزات
exports.getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({
      date: 1,
      timeSlot: 1,
    });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// جلب حجز واحد حسب ID
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

exports.getReservationPDF = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findById(id);
    if (!reservation)
      return res.status(404).json({ message: "Reservation not found" });

    // استعمل utils/pdfGeneration
    generateReservationPDF(reservation, res);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// تعديل Reservation
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

// حذف Reservation
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

// التصفية حسب التيران أو التاريخ
exports.filterReservations = async (req, res) => {
  try {
    const { terrain, date } = req.query;

    const query = {};

    if (terrain) query.terrain = terrain;
    if (date) query.date = date;

    const results = await Reservation.find(query).sort({
      date: 1,
      timeSlot: 1,
    });

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
