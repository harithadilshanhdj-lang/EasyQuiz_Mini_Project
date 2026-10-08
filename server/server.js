const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "EasyQuiz API is running",
  });
});

// Server
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(` EasyQuiz server running on port ${PORT}`);
});