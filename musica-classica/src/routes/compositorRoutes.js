// Importa o Express para criar o roteador
const express = require("express");
// Cria uma instância do roteador Express
const router = express.Router();
// Importa o middleware de validação de dados
const validationMiddleware = require("../middlewares/validationMiddleware");
// Importa as regras de validação para compositors
const compositorValidation = require("../validations/compositorValidation");
// Importa as funções do controller de compositor
const {
  criar,
  listar,
  editar,
  deletar
} = require("../controllers/compositorController");
// Define a rota POST / para criar um novo compositor
// Aplica validação e middleware de validação antes de executar a função criar
router.post(
  "/",
  compositorValidation,
  validationMiddleware,
  criar
);
// Define a rota GET / para listar todos os compositores
router.get("/", listar);
// Define a rota PUT /:id para editar um compositor específico
// Aplica validação e middleware de validação antes de executar a função editar
router.put(
  "/:id",
  compositorValidation,
  validationMiddleware,
  editar
);
// Define a rota DELETE /:id para deletar um compositor específico
router.delete("/:id", deletar);
// Exporta o roteador para ser usado na aplicação principal
module.exports = router;