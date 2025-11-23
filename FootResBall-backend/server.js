const cron = require("node-cron");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const reservationRoutes = require("./routes/reservations");
const Reservation = require("./models/Reservation");

const app = express();
app.use(cors());
app.use(express.json());

// وصل لMongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/footresball")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/reservations", reservationRoutes);

// JOB: Delete old reservations automatically
cron.schedule("0 0 * * *", async () => {
  // Runs every day at 00:00 = "0 0 * * *" , 10min = "*/10 * * * *"    , 1h="0 * * * *", 10seconnd="*/10 * * * * *"
  try {
    const now = new Date();
    const limit = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000); // now - 3 days

    await Reservation.deleteMany({
      timeSlotEnd: { $lt: limit },
    });

    console.log("Old reservations deleted automatically");
  } catch (err) {
    console.error("Cron Error:", err);
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
