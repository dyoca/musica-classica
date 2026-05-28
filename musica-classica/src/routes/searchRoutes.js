const express = require("express");
const router = express.Router();
const { buscarGlobal } = require("../controllers/obraController");
where: {
  categoria: "classico"
}

router.get("/", buscarGlobal);


module.exports = router;
