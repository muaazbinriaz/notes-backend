require("dotenv").config();

const express = require("express");
const cors = require("cors");

const noteRouter = require("./App/routes/noteRoutes");
const authRouter = require("./App/routes/authRoutes");
const productRouter = require("./App/routes/productRouter");

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Health routes FIRST
app.get("/", (req, res) => res.status(200).json({ ok: true }));
app.head("/", (req, res) => res.sendStatus(200));
app.get("/health-check", (req, res) => res.status(200).json({ ok: true }));
app.head("/health-check", (req, res) => res.sendStatus(200));

// ✅ Middleware
app.use(express.json());
app.use(
  cors({
    origin: "https://notes-frontend-rouge.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.options("*", cors());

// ✅ DB connection
require("./App/models/db");

// ✅ App routes
app.use("/api/website/notes", noteRouter);
app.use("/api/website/auth", authRouter);
app.use("/api/website/products", productRouter);

// ✅ Start server
app.listen(PORT, () => {
  console.log("Injected PORT:", process.env.PORT);
  console.log(`Server is running on port ${PORT}`);
});
