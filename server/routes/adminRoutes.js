const express = require("express");
const router = express.Router();
const db = require("../db");

// ✅ GET all services (fixed to use async/await)
router.get("/services", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM services");
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching services:", err);
    res.status(500).json({ message: "Error fetching services" });
  }
});

// ADD a new service
router.post("/services", async (req, res) => {
  const { title, description, price_min, price_max, image_url } = req.body;
  try {
    const query = `
      INSERT INTO services (title, description, price_min, price_max, image_url)
      VALUES (?, ?, ?, ?, ?)
    `;
    await db.query(query, [title, description, price_min, price_max, image_url]);
    res.status(201).json({ message: "Service added successfully" });
  } catch (err) {
    console.error("❌ Error adding service:", err);
    res.status(500).json({ message: "Failed to add service" });
  }
});

// UPDATE a service
router.put("/services/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, price_min, price_max, image_url } = req.body;
  try {
    const query = `
      UPDATE services
      SET title = ?, description = ?, price_min = ?, price_max = ?, image_url = ?
      WHERE id = ?
    `;
    await db.query(query, [title, description, price_min, price_max, image_url, id]);
    res.json({ message: "Service updated successfully" });
  } catch (err) {
    console.error("❌ Error updating service:", err);
    res.status(500).json({ message: "Failed to update service" });
  }
});

// DELETE a service
router.delete("/services/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM services WHERE id = ?", [id]);
    res.json({ message: "Service deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting service:", err);
    res.status(500).json({ message: "Failed to delete service" });
  }
});

module.exports = router;
