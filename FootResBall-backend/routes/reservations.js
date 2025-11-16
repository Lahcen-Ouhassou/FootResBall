const express = require("express");
const router = express.Router();
const {
  addReservation,
  getReservations,
  getReservationById,
  getReservationPDF,
  updateReservation,
  deleteReservation,
  filterReservations,
  getAvailableSlots,
} = require("../controllers/reservations");

const auth = require("../middleware/auth");

// Routes
router.get("/", auth, getReservations);
router.post("/", auth, addReservation);
router.get("/pdf/:id", auth, getReservationPDF);
router.get("/filter", auth, filterReservations);
router.get("/:id", auth, getReservationById);
router.put("/:id", auth, updateReservation);
router.delete("/:id", auth, deleteReservation);
router.get("/available-slots", auth, getAvailableSlots);

module.exports = router;
