require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const vaccineRoutes = require("./routes/vaccineRoutes");
const medicineRoutes = require("./routes/medicineRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const { startReminderJob } = require("./jobs/reminderJob");

const app = express();

// middleware
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
  })
);
app.use(express.json());

// connect db
let dbConnected = false;
connectDB().then(result => {
  dbConnected = result;
  // Pass db status to auth routes
  authRoutes.setDbStatus(dbConnected);
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/vaccines", vaccineRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/appointments", appointmentRoutes);

// test route
app.get("/", (req, res) => {
  res.send("Smart Vaccine API running ✅");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  startReminderJob();
});
