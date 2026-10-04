const express = require("express");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 10000;

// Store results in memory
let results = [];

// ===============================
// HOME
// ===============================

app.get("/", (req, res) => {
    res.json({
        success: true,
        app: "SmallBigAnalyzer API",
        status: "online",
        message: "SmallBigAnalyzer API is running successfully"
    });
});

// ===============================
// HEALTH
// ===============================

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        status: "online"
    });
});

// ===============================
// ADD RESULT
// ===============================

app.post("/api/results", (req, res) => {

    const { period, number } = req.body;

    if (period === undefined || number === undefined) {
        return res.status(400).json({
            success: false,
            message: "period and number are required"
        });
    }

    const n = Number(number);

    if (!Number.isInteger(n) || n < 0 || n > 9) {
        return res.status(400).json({
            success: false,
            message: "number must be between 0 and 9"
        });
    }

    const size = n >= 5 ? "BIG" : "SMALL";

    const result = {
        period: String(period),
        number: n,
        size: size,
        time: new Date().toISOString()
    };

    results.unshift(result);

    // Keep latest 100 results
    if (results.length > 100) {
        results = results.slice(0, 100);
    }

    res.json({
        success: true,
        message: "Result saved",
        result: result
    });
});

// ===============================
// LATEST RESULT
// ===============================

app.get("/api/results/latest", (req, res) => {

    if (results.length === 0) {
        return res.json({
            success: true,
            message: "No results available",
            result: null
        });
    }

    res.json({
        success: true,
        result: results[0]
    });
});

// ===============================
// HISTORY
// ===============================

app.get("/api/results/history", (req, res) => {

    res.json({
        success: true,
        count: results.length,
        results: results
    });
});

// ===============================
// STATISTICS
// ===============================

app.get("/api/stats", (req, res) => {

    const total = results.length;

    let bigCount = 0;
    let smallCount = 0;

    results.forEach((item) => {

        if (item.size === "BIG") {
            bigCount++;
        } else if (item.size === "SMALL") {
            smallCount++;
        }

    });

    const bigPercentage =
        total > 0
            ? Number(((bigCount / total) * 100).toFixed(2))
            : 0;

    const smallPercentage =
        total > 0
            ? Number(((smallCount / total) * 100).toFixed(2))
            : 0;

    res.json({
        success: true,
        total: total,
        big: {
            count: bigCount,
            percentage: bigPercentage
        },
        small: {
            count: smallCount,
            percentage: smallPercentage
        }
    });
});

// ===============================
// TREND
// ===============================

app.get("/api/trend", (req, res) => {

    if (results.length === 0) {
        return res.json({
            success: true,
            trend: "NOT_ENOUGH_DATA",
            message: "Not enough result data"
        });
    }

    let bigCount = 0;
    let smallCount = 0;

    results.forEach((item) => {

        if (item.size === "BIG") {
            bigCount++;
        } else {
            smallCount++;
        }

    });

    let trend = "BALANCED";

    if (bigCount > smallCount) {
        trend = "BIG_TREND";
    } else if (smallCount > bigCount) {
        trend = "SMALL_TREND";
    }

    res.json({
        success: true,
        trend: trend,
        bigCount: bigCount,
        smallCount: smallCount,
        note: "Trend is statistical information, not a guaranteed next result."
    });
});

// ===============================
// START SERVER
// ===============================

app.listen(PORT, "0.0.0.0", () => {
    console.log(
        `SmallBigAnalyzer API running on port ${PORT}`
    );
});
