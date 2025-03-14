const express = require("express");
const morgan = require("morgan");

const app = express();

// Use morgan for request logging
// You can switch "dev" to another format like "combined" or "tiny"
app.use(morgan("dev"));

// Built-in middleware to parse JSON payloads
app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

// Example of a route that triggers an error
app.get("/error", (req, res, next) => {
  const error = new Error("Something went wrong!");
  error.status = 400; // Set an HTTP status code (e.g., 400 for Bad Request)
  next(error);
});

// Custom error-handling middleware
// Notice the 4 parameters: (err, req, res, next)
app.use((err, req, res, next) => {
  console.error("Error stack:", err.stack);
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    error: {
      message: err.message || "Internal Server Error",
      // For debugging: you might return stack in development,
      // but typically you would omit it in production.
      stack: process.env.NODE_ENV === "development" ? err.stack : {},
    },
  });
});

module.exports = app;
