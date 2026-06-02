// Importa a função body do express-validator para validar campos do corpo da requisição
const { body } = require("express-validator");
// Define um array de validações para a obra
const obraValidation = [
  body("titulo")
    .notEmpty()
    .withMessage("Título obrigatório"),
  body("ano")
    .notEmpty()
    .withMessage("Ano obrigatório")
    .isNumeric()
    .withMessage("Ano inválido"),
  body("compositorId")
    .notEmpty()
    .withMessage("Compositor obrigatório")
    .isInt()
    .withMessage("Compositor inválido"),
];
// Exporta as validações para ser usadas nas rotas
module.exports = obraValidation;