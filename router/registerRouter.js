const express = require("express");
const register = require ("../modules/registerModule");

const router = express.Router();


router.post("/logup", register.signup);
router.post("/login", register.signin);

module.exports = router;
