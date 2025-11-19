const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    customerName: String,
    phoneNumber: String,
    idCard: String,
    terrain: String,

    date: { type: Date, required: true },

    timeSlotStart: { type: String, required: true }, // ex: "08:00"
    timeSlotEnd: { type: String, required: true }, // ex: "09:00"

    duration: Number,
    price: Number,
    paid: Boolean,
    reservationCode: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reservation", reservationSchema);
