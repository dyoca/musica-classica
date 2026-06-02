// Importa a função validationResult do express-validator
const { validationResult } = require("express-validator");
// Função para validar dados da requisição
function validationMiddleware(req, res, next) {
  // Coleta todos os erros de validação da requisição
  const errors = validationResult(req);
  // Verifica se há erros de validação
  if (!errors.isEmpty()) {
    // Se houver erros, retorna status 400 com a lista de erros
    return res.status(400).json({
      sucesso: false,
      erros: errors.array(),
    });
  }
  // Se não houver erros, passa o controle para a próxima função middleware
  next();
}
// Exporta o middleware para ser usado nas rotas
module.exports = validationMiddleware;