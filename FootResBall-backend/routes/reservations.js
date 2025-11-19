const express = require("express");
const router = express.Router();
const {
  getReservations,
  addReservation,
  getReservationPDF,
  filterReservations,
  getReservationById,
  updateReservation,
  deleteReservation,
  getAvailableSlots
} = require("../controllers/reservations");

const auth = require("../middleware/auth");

// ⚠ مهم: available-slots خاص تكون قبل :id
router.get("/available-slots", auth, getAvailableSlots);

// CRUD
router.get("/", auth, getReservations);
router.post("/", auth, addReservation);
router.get("/pdf/:id", auth, getReservationPDF);
router.get("/filter", auth, filterReservations);

// routes اللي فيها :id خص تكون فالأخير
router.get("/:id", auth, getReservationById);
router.put("/:id", auth, updateReservation);
router.delete("/:id", auth, deleteReservation);

module.exports = router;
