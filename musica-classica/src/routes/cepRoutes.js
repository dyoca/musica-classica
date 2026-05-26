// Importa o Express para criar o roteador
const express = require("express");

// Cria uma instância do roteador Express
const router = express.Router();

// Importa a função buscarCep do controller de CEP
const {
  buscarCep
} = require("../controllers/cepController");

// Define a rota GET /:cep para buscar informações de um CEP específico
router.get("/:cep", buscarCep);

// Exporta o roteador para ser usado na aplicação principal
module.exports = router;