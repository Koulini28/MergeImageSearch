import express from "express";
import fetch from "node-fetch";
import Search from "../models/Search.js";

const router = express.Router();

// 🧪 Log route load
console.log("✅ searchRoutes.js file loaded successfully");

// ✅ Middleware to check if user is logged in
function isAuthenticated(req, res, next) {
  if (req.user) return next();
  return res.status(401).json({ error: "You must be logged in to search" });
}

// ✅ POST /api/search
router.post("/search", isAuthenticated, async (req, res) => {
  const { term } = req.body;

  if (!term) {
    return res.status(400).json({ error: "Search term is required" });
  }

  try {
    // 🧠 Store search term in MongoDB
    await Search.create({
      userId: req.user._id,
      term,
    });

    // 🌐 Fetch from Unsplash API
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${term}&client_id=${process.env.UNSPLASH_ACCESS_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Unsplash API returned ${response.status}`);
    }

    const data = await response.json();
    res.json({ term, results: data.results });
  } catch (error) {
    console.error("❌ Error fetching images:", error);
    res.status(500).json({ error: "Unsplash API failed" });
  }
});

// ✅ GET /api/top-searches
router.get("/top-searches", async (req, res) => {
  try {
    const topSearches = await Search.aggregate([
      { $group: { _id: "$term", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);
    res.json(topSearches);
  } catch (error) {
    console.error("❌ Error fetching top searches:", error);
    res.status(500).json({ error: "Failed to fetch top searches" });
  }
});

// ✅ GET /api/history
router.get("/history", isAuthenticated, async (req, res) => {
  try {
    const history = await Search.find({ userId: req.user._id }).sort({
      timestamp: -1,
    });
    res.json(history);
  } catch (error) {
    console.error("❌ Error fetching history:", error);
    res.status(500).json({ error: "Failed to fetch user history" });
  }
});

export default router;
