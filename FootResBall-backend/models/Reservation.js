const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    phoneNumber: { type: String },
    idCard: { type: String }, // رقم بطاقة الهوية
    terrain: { type: String, enum: ["A", "B", "C"], required: true },
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    duration: { type: Number, enum: [1, 2], required: true },
    price: { type: Number, required: true },
    paid: { type: Boolean, default: false },
    reservationCode: { type: String, unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reservation", reservationSchema);
