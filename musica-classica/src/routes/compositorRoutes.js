const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");

const {
  criar,
  listar,
  editar,
  deletar
} = require("../controllers/compositorController");

router.get("/", listar);

router.post("/", authMiddleware, criar);

router.put("/:id", authMiddleware, editar);

router.delete("/:id", authMiddleware, deletar);

module.exports = router;