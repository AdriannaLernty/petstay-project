const express = require("express");
const router = express.Router();
const { registerUser, loginUser, googleLogin } = require('../controllers/authController');

router.get("/test", (req, res) => {
  res.json({ message: "Auth route working" });
});

router.get("/test-google", (req, res) => {
  console.log("✅ test-google route hit");
  res.send("Google route is working");
});

router.post("/google-login", googleLogin);
// Register route
router.post('/register', registerUser);

//Login route
router.post('/login', loginUser);




module.exports = router;