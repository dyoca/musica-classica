// Importa a função body do express-validator para validar campos do corpo da requisição
const { body } = require("express-validator");
// Define um array de validações para o compositor
const compositorValidation = [
  body("nome")
    .notEmpty()
    .withMessage("Nome obrigatório"),
  body("pais")
    .notEmpty()
    .withMessage("País obrigatório"),
  body("periodo")
    .notEmpty()
    .withMessage("Período obrigatório"),
];
// Exporta as validações para ser usadas nas rotas
module.exports = compositorValidation;