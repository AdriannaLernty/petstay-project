const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("../db");

router.get("/test-direct", (req, res) => {
  res.send("✅ Payment test route is working.");
});

// Ensure directory exists
const uploadDir = path.join(__dirname, "../uploads/payments");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// ✅ Upload payment proof
router.post("/upload", upload.single("proof"), (req, res) => {
  const { userId, bookingIds = "manual_upload" } = req.body;
  const file = req.file;

  if (!userId || !file) {
    return res.status(400).json({ message: "Missing fields or file" });
  }

  const filePath = `/uploads/payments/${file.filename}`;
  const sql = `
    INSERT INTO payments (user_id, booking_ids, file_path, original_name, file_type, submitted_at)
    VALUES (?, ?, ?, ?, ?, NOW())
  `;

  db.query(
    sql,
    [userId, bookingIds, filePath, file.originalname, file.mimetype],
    (err, result) => {
      if (err) {
        console.error("❌ Upload DB error:", err);
        return res.status(500).json({ message: "Upload failed" });
      }

      console.log("✅ Payment uploaded:", file.originalname);
      return res.json({
        message: "Payment uploaded",
        filePath,
        fileName: file.originalname,
      });
    }
  );
});

// ✅ Get payment history
router.get("/:userId", (req, res) => {
  console.log("🧪 Received GET /api/payments/", req.params.userId);

  const userId = req.params.userId;
  console.log("▶️ Fetching payment records for user ID:", userId);

  if (!userId || isNaN(userId)) {
    return res.status(400).json({ message: "Invalid or missing user ID" });
  }

  db.query(
    "SELECT * FROM payments WHERE user_id = ? ORDER BY submitted_at DESC",
    [userId],
    (err, results) => {
      if (err) {
        console.error("❌ Payment fetch error:", err);
        return res.status(500).json({ message: "Server error" });
      }

      console.log("▶️ Sending payment data to frontend..."); // <- ✅ Must show this!
      res.json(results);
    }
  );
});


module.exports = router;
