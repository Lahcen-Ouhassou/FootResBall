const express = require("express");
const router = express.Router();
const {
  addReservation,
  getReservations,
} = require("../controllers/reservations");

router.post("/", addReservation); // لإضافة حجز
router.get("/", getReservations); // لجلب كل الحجوزات

module.exports = router;
