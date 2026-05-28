const express = require("express");
const router = express.Router();

const validationMiddleware = require("../middlewares/validationMiddleware");
const compositorValidation = require("../validations/compositorValidation");

const {
  criar,
  listar,
  search,
  listarObrasPorCompositor,
  editar,
  deletar
} = require("../controllers/compositorController");

router.post("/", compositorValidation, validationMiddleware, criar);
router.get("/", listar);
router.get("/search", search);

// 🔥 NOVO: obras por compositor
router.get("/:id/obras", listarObrasPorCompositor);

router.put("/:id", compositorValidation, validationMiddleware, editar);
router.delete("/:id", deletar);

module.exports = router;