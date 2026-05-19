const express = require("express");

const router = express.Router();

const {
  buscarCep
} = require("../controllers/cepController");

router.get("/:cep", buscarCep);

module.exports = router;