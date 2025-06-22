const express = require('express');
const router = express.Router();
const db = require('../db');

// POST: Submit feedback
router.post('/feedback', async (req, res) => {
  const { user_id, booking_id, service, rating, comment } = req.body;

  try {
    await db.query(
      "INSERT INTO feedback (user_id, booking_id, service, rating, comment) VALUES (?, ?, ?, ?, ?)",
      [user_id, booking_id, service, rating, comment]
    );
    res.status(201).json({ message: "Feedback submitted successfully." });
  } catch (err) {
    console.error("Error submitting feedback:", err);
    res.status(500).json({ error: "Failed to submit feedback." });
  }
});

// GET: Get feedback by user
router.get('/feedback/user/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const [feedback] = await db.query(
      "SELECT * FROM feedback WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );
    res.status(200).json(feedback);
  } catch (err) {
    console.error("Error fetching feedback:", err);
    res.status(500).json({ error: "Failed to retrieve feedback." });
  }
});

// GET: Get all feedback (for public display)
router.get('/feedback', async (req, res) => {
  try {
    const [allFeedback] = await db.query(
      "SELECT f.*, u.name FROM feedback f JOIN users u ON f.user_id = u.id ORDER BY f.created_at DESC"
    );
    res.status(200).json(allFeedback);
  } catch (err) {
    console.error("Error retrieving all feedback:", err);
    res.status(500).json({ error: "Failed to retrieve feedback." });
  }
});

module.exports = router;
