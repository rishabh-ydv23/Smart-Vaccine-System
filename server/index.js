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
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5176'],
    credentials: true,
  })
);
app.use(express.json());

// connect db with retry mechanism
let dbConnected = false;
let retryCount = 0;
const maxRetries = 5;

const initializeDB = async () => {
  try {
    console.log(`Attempting to connect to MongoDB (attempt ${retryCount + 1}/${maxRetries})...`);
    const result = await connectDB();
    dbConnected = result;
    
    // Pass db status to auth routes
    authRoutes.setDbStatus(dbConnected);
    
    if (dbConnected) {
      console.log("✅ Database connection established");
      retryCount = 0; // Reset retry count on success
    } else {
      throw new Error("Database connection failed");
    }
  } catch (err) {
    console.error("❌ Database connection error:", err.message);
    retryCount++;
    
    if (retryCount < maxRetries) {
      console.log(`🔁 Retrying in 5 seconds... (${retryCount}/${maxRetries})`);
      setTimeout(initializeDB, 5000);
    } else {
      console.log("⚠️  Max retries reached. Running in offline mode - authentication will not work");
    }
  }
};

// Initialize database connection
initializeDB();

// Periodically check database connection
setInterval(async () => {
  if (!dbConnected) {
    console.log("🔄 Checking database connection...");
    await initializeDB();
  }
}, 30000); // Check every 30 seconds

// routes
app.use("/api/auth", authRoutes);
app.use("/api/vaccines", vaccineRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/appointments", appointmentRoutes);

// test route
app.get("/", (req, res) => {
  res.send("Smart Vaccine API running ✅");
});

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    dbConnected,
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  startReminderJob();
});