const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// فقط هذا السطر
const reservationRoutes = require("./routes/reservations");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/footresball")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use("/api/reservations", reservationRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
