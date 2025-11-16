const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    phoneNumber: { type: String },
    idCard: { type: String },
    terrain: { type: String, required: true },
    date: { type: Date, required: true }, // تاريخ المباراة
    timeSlotStart: { type: Date, required: true }, // البداية
    timeSlotEnd: { type: Date, required: true }, // النهاية
    duration: { type: Number, required: true }, // 1 or 2 hours
    price: { type: Number, required: true },
    paid: { type: Boolean, default: false },
    reservationCode: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reservation", reservationSchema);
