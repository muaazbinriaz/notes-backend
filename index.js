// server/index.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const noteRouter = require("./App/routes/noteRoutes");
const userRouter = require("./App/routes/userRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: "*" })); // You can restrict origin later for security

// Health check
app.get("/health-check", (req, res) => {
  res.status(200).send({ message: "Server is running" });
});

// Routes
app.use("/api/website/notes", noteRouter);
app.use("/api/website/users", userRouter); // ✅ Add this line for auth routes

// Connect to MongoDB
mongoose
  .connect(process.env.DBURL)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT || 3080, () => {
      console.log(`Server is running on port ${process.env.PORT || 3080}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });
