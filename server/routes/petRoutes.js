const express = require("express");
const router = express.Router();
const db = require("../db");

// Save pet info
router.post("/save-pets", async (req, res) => {
  const { userId, pets } = req.body;

  console.log("🔧 Incoming pet data:", { userId, pets });

  try {
    await db.query("DELETE FROM pets WHERE user_id = ?", [userId]);

    for (let pet of pets) {
      console.log("💾 Saving pet:", pet);
      await db.query(
        "INSERT INTO pets (user_id, name, age, breed, medical_history) VALUES (?, ?, ?, ?, ?)",
        [userId, pet.name, pet.age, pet.breed, pet.medicalHistory]
      );
    }

    res.json({ message: "Pet information saved successfully" });
  } catch (error) {
    console.error("❌ Error saving pets:", error);
    res.status(500).json({ message: "Failed to save pet information" });
  }
});


module.exports = router;
