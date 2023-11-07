const express = require("express");
const validationToken = require("../middleware/auth");
const { registerAdmin, loginAdmin, currentAdmin } = require("../controllers/admin")

const router = express.Router();

router.post("/register-admin", registerAdmin);

router.post("/login-admin", loginAdmin);

router.get("/current-admin", validationToken, currentAdmin);


module.exports = router;