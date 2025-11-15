const Reservation = require("../models/Reservation");
const { v4: uuidv4 } = require("uuid");

exports.addReservation = async (req, res) => {
  try {
    const {
      customerName,
      phoneNumber,
      terrain,
      date,
      timeSlot,
      duration,
      paid,
    } = req.body;

    // حساب الثمن
    const price = duration === 1 ? 150 : 300;

    // تحقق واش الوقت فارغ
    const existing = await Reservation.findOne({ terrain, date, timeSlot });
    if (existing) return res.status(400).json({ message: "هذا الوقت محجوز" });

    const reservation = new Reservation({
      customerName,
      phoneNumber,
      terrain,
      date,
      timeSlot,
      duration,
      price,
      paid,
      reservationCode: uuidv4().slice(0, 8), // 8 حروف فقط
    });

    await reservation.save();
    res.status(201).json(reservation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

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
