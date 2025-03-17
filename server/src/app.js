const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const router = require("./routes");

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).send("<h1>Hello! I am alive and well.</h1>");
});

app.use("/api/blackjack", router());

app.use((err, req, res, next) => {
  console.error("Error stack:", err.stack);
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    error: {
      message: err.message || "Internal Server Error",
    },
  });
});

module.exports = app;
