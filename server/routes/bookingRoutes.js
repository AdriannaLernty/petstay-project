const express = require('express');
const router = express.Router();
const db = require('../db');

// ✅ Save multiple bookings (checkout)
router.post("/bookings", async (req, res) => {
  const { userId, cart } = req.body;

  console.log("📥 Received booking request");
  console.log("User ID:", userId);
  console.log("Cart:", cart);

  if (!userId || !Array.isArray(cart)) {
    console.error("❌ Invalid booking data");
    return res.status(400).json({ error: "Invalid booking data" });
  }

  try {
    const saved = [];

    for (const item of cart) {
      console.log("📦 Processing item:", item);

      const [result] = await db.query(
        "INSERT INTO bookings (user_id, service, dates, add_on, total, quantity, pet_name, notes, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          userId,
          item.serviceName,
          JSON.stringify(item.dates),
          item.addOn,
          item.total,
          item.quantity,
          item.petName,
          item.notes,
          "Confirmed" // Automatically confirm on checkout
        ]
      );

      saved.push({ ...item, id: result.insertId, status: "Confirmed" });
    }

    console.log("✅ Bookings saved:", saved);
    res.status(200).json(saved);
  } catch (err) {
    console.error("❌ Error saving bookings:", err);
    res.status(500).json({ error: "Booking failed." });
  }
});

// ✅ Update a single booking
router.put("/bookings/:id", async (req, res) => {
  const bookingId = req.params.id;
  const { petName, quantity, notes, total } = req.body;

  try {
    await db.query(
      "UPDATE bookings SET pet_name = ?, quantity = ?, notes = ?, total = ? WHERE id = ?",
      [petName, quantity, notes, total, bookingId]
    );

    res.status(200).json({ message: "Booking updated." });
  } catch (err) {
    console.error("❌ Error updating booking:", err);
    res.status(500).json({ error: "Failed to update booking." });
  }
});

// ✅ Get all bookings for a specific user
router.get("/bookings/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const [results] = await db.query(
      "SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );

    if (!Array.isArray(results)) {
      console.error("❌ Query did not return an array:", results);
      return res.status(500).json({ error: "Unexpected result from database." });
    }

    res.status(200).json(results);
  } catch (err) {
    console.error("❌ Error fetching bookings:", err);
    res.status(500).json({ error: "Failed to retrieve bookings." });
  }
});

// ✅ Get feedback for a specific booking
router.get("/feedback/:bookingId", async (req, res) => {
  const { bookingId } = req.params;

  try {
    const [feedback] = await db.query(
      "SELECT * FROM feedback WHERE booking_id = ?",
      [bookingId]
    );

    res.status(200).json(feedback);
  } catch (err) {
    console.error("❌ Error fetching feedback:", err);
    res.status(500).json({ error: "Failed to fetch feedback." });
  }
});

// ✅ Get available slots per day for a given service
router.get("/slots/:serviceName/:month/:year", async (req, res) => {
  const { serviceName, month, year } = req.params;

  try {
    // 1. Fetch slot limits from service_slots
    const [slots] = await db.query(
      "SELECT date, available_slots FROM service_slots WHERE service_name = ? AND MONTH(date) = ? AND YEAR(date) = ?",
      [serviceName, month, year]
    );

    // 2. Count bookings per date
    const [bookings] = await db.query(
      "SELECT dates FROM bookings WHERE service = ?",
      [serviceName]
    );

    const used = {};
    bookings.forEach((row) => {
      let dates = [];
      try {
        dates = JSON.parse(row.dates);
      } catch {}
      dates.forEach((d) => {
        used[d] = (used[d] || 0) + 1;
      });
    });

    // 3. Calculate availability
    const availability = {};
    slots.forEach((slot) => {
      const dateStr = slot.date.toISOString().split("T")[0];
      const available = Math.max(0, slot.available_slots - (used[dateStr] || 0));
      availability[dateStr] = available;
    });

    res.json(availability);
  } catch (err) {
    console.error("❌ Slot availability error:", err);
    res.status(500).json({ error: "Failed to load slot data" });
  }
});


module.exports = router;
