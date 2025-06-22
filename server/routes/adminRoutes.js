const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all bookings
router.get('/bookings', async (req, res) => {
  try {
    const [bookings] = await db.query("SELECT * FROM bookings ORDER BY created_at DESC");
    res.json(bookings);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update booking status
router.put('/bookings/:id/status', async (req, res) => {
  const bookingId = req.params.id;
  const { status } = req.body;

  try {
    await db.query("UPDATE bookings SET status = ? WHERE id = ?", [status, bookingId]);
    res.json({ message: "Booking status updated" });
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ message: "Failed to update booking status" });
  }
});

module.exports = router;
