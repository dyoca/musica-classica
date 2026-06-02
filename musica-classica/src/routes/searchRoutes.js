const express = require("express");
const router = express.Router();
const { buscarGlobal } = require("../controllers/obraController");

router.get("/", buscarGlobal);

module.exports = router;
