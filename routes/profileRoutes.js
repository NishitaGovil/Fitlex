const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const profileController = require("../controllers/profileController");

router.post("/profile", auth, profileController.saveProfile);

module.exports = router;
