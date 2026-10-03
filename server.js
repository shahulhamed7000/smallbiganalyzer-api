const express = require("express");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 10000;

// Basic API test
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "SmallBigAnalyzer API is running"
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "online"
  });
});

// Test result endpoint
app.get("/api/results/latest", (req, res) => {
  res.json({
    success: true,
    message: "API connection working",
    result: null
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`SmallBigAnalyzer API running on port ${PORT}`);
});
