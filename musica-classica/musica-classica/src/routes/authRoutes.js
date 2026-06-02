// Importa o Express para criar o roteador
const express = require("express");
// Cria uma instância do roteador Express
const router = express.Router();
// Importa as funções de cadastro e login do controller de autenticação
const {
  cadastro,
  login
} = require("../controllers/authController");
// Define a rota POST /register que chama a função cadastro
router.post("/register", cadastro);
// Define a rota POST /login que chama a função login
router.post("/login", login);
// Exporta o roteador para ser usado na aplicação principal
module.exports = router;