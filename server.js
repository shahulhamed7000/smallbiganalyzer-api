const express = require("express");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 10000;

// Home
app.get("/", (req, res) => {
    res.json({
        success: true,
        app: "SmallBigAnalyzer API",
        status: "online",
        message: "API is running successfully"
    });
});

// Health check
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        status: "online"
    });
});

// Latest result - test data
app.get("/api/results/latest", (req, res) => {
    res.json({
        success: true,
        period: "TEST-001",
        number: null,
        size: null,
        message: "No real result connected yet"
    });
});

// Prediction test endpoint
app.post("/api/prediction", (req, res) => {

    const input = req.body || {};

    res.json({
        success: true,
        message: "Prediction API is working",
        input: input,
        prediction: {
            number: null,
            size: null,
            confidence: 0
        }
    });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`SmallBigAnalyzer API running on port ${PORT}`);
});
