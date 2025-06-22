const express = require("express");
const router = express.Router();
const db = require("../db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `profile_${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage });

/** ✅ GET: Load user profile image + pet info */
router.get("/profile/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const [userRows] = await db.query(
      "SELECT profile_image FROM users WHERE id = ?",
      [userId]
    );
    const [petRows] = await db.query(
      "SELECT id, name, age, breed, medical_history FROM pets WHERE user_id = ?",
      [userId]
    );

    const profileImage = userRows[0]?.profile_image || "";

    const pets = petRows.map((p) => ({
      id: p.id,
      name: p.name,
      age: p.age,
      breed: p.breed,
      medicalHistory: p.medical_history,
    }));

    res.status(200).json({ profileImage, pets });
  } catch (err) {
    console.error("❌ Error fetching profile:", err);
    res.status(500).json({ message: "Failed to load profile" });
  }
});

/** 🖼 Upload profile image */
router.post("/profile/upload-image", upload.single("image"), async (req, res) => {
  const { userId } = req.body;
  const imageUrl = `/uploads/${req.file.filename}`;

  try {
    await db.query(
      "UPDATE users SET profile_image = ? WHERE id = ?",
      [imageUrl, userId]
    );
    res.json({ imageUrl });
  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).json({ message: "Failed to upload image" });
  }
});

/** 💾 Save profile and pets (without resetting all IDs) */
router.post("/profile/save", async (req, res) => {
  const { userId, profileImage, pets } = req.body;

  try {
    // ✅ Update profile image
    await db.query(
      "UPDATE users SET profile_image = ? WHERE id = ?",
      [profileImage, userId]
    );

    // ✅ Get current pet IDs from database
    const [existingPets] = await db.query(
      "SELECT id FROM pets WHERE user_id = ?",
      [userId]
    );
    const existingIds = existingPets.map((p) => p.id);

    const incomingIds = pets.filter((p) => p.id).map((p) => p.id);

    // ✅ Delete only pets that are missing from incoming data
    const idsToDelete = existingIds.filter(id => !incomingIds.includes(id));
    if (idsToDelete.length > 0) {
      await db.query(
        `DELETE FROM pets WHERE id IN (${idsToDelete.map(() => '?').join(',')})`,
        idsToDelete
      );
    }

    // ✅ Update or insert pets
    for (const pet of pets) {
      if (pet.id) {
        await db.query(
          "UPDATE pets SET name = ?, age = ?, breed = ?, medical_history = ? WHERE id = ? AND user_id = ?",
          [pet.name, pet.age, pet.breed, pet.medicalHistory, pet.id, userId]
        );
      } else {
        await db.query(
          "INSERT INTO pets (user_id, name, age, breed, medical_history) VALUES (?, ?, ?, ?, ?)",
          [userId, pet.name, pet.age, pet.breed, pet.medicalHistory]
        );
      }
    }

    // ✅ Refetch pets with their real IDs
    const [updatedPets] = await db.query(
      "SELECT id, name, age, breed, medical_history FROM pets WHERE user_id = ?",
      [userId]
    );

    const updatedPetData = updatedPets.map((p) => ({
      id: p.id,
      name: p.name,
      age: p.age,
      breed: p.breed,
      medicalHistory: p.medical_history,
    }));

    res.json({ message: "Profile saved successfully", pets: updatedPetData });
  } catch (err) {
    console.error("❌ Save profile error:", err);
    res.status(500).json({ message: "Failed to save profile" });
  }
});



/** 🗑 Delete profile */
router.delete("/profile/delete/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    await db.query("DELETE FROM bookings WHERE user_id = ?", [userId]);
    await db.query("DELETE FROM feedback WHERE user_id = ?", [userId]);
    await db.query("DELETE FROM users WHERE id = ?", [userId]);

    res.json({ message: "Profile deleted" });
  } catch (err) {
    console.error("❌ Delete error:", err);
    res.status(500).json({ message: "Failed to delete profile" });
  }
});

module.exports = router;
