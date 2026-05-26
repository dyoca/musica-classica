// Importa o Express para criar o roteador
const express = require("express");
// Cria uma instância do roteador Express
const router = express.Router();
// Importa o middleware de autenticação
const authMiddleware = require("../middlewares/authMiddleware");
// Importa o middleware de validação de dados
const validationMiddleware = require("../middlewares/validationMiddleware");
// Importa as regras de validação para obras
const obraValidation = require("../validations/obraValidation");
// Importa as funções do controller de obra
const {
  criar,
  listar,
  editar,
  deletar
} = require("../controllers/obraController");
// Define a rota GET / para listar todas as obras (sem autenticação)
router.get("/", listar);
// Define a rota POST / para criar uma nova obra
// Requer autenticação, validação de dados e middleware de validação
router.post(
  "/",
  authMiddleware,
  obraValidation,
  validationMiddleware,
  criar
);
// Define a rota PUT /:id para editar uma obra específica
// Requer autenticação, validação de dados e middleware de validação
router.put(
  "/:id",
  authMiddleware,
  obraValidation,
  validationMiddleware,
  editar
);
// Define a rota DELETE /:id para deletar uma obra específica
// Requer autenticação
router.delete("/:id", authMiddleware, deletar);
// Exporta o roteador para ser usado na aplicação principal
module.exports = router;