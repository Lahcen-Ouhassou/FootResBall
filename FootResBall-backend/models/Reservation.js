const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    phoneNumber: { type: String },
    terrain: {
      type: String,
      enum: ["Terrain A", "Terrain B", "Terrain C"],
      required: true,
    },
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true }, // 08:00-09:00 ...
    duration: { type: Number, enum: [1, 2], required: true },
    price: { type: Number, required: true },
    paid: { type: Boolean, default: false },
    reservationCode: { type: String, unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reservation", reservationSchema);
