// Importa o módulo jsonwebtoken para validar tokens
const jwt = require("jsonwebtoken");
// Função middleware para validar autenticação via token JWT
function authMiddleware(req, res, next) {
  // Obtém o header da requisição
  const authHeader = req.headers.authorization;
  // Verifica se o header foi enviado
  if (!authHeader) {
    // Se não foi enviado, retorna erro 401 (Não autorizado)
    return res.status(401).json({
      erro: "Token não enviado"
    });
  }
  // Extrai o token do header
  const token = authHeader.split(" ")[1];
  // Inicia um bloco try para validar o token
  try {
    // Verifica se o token é válido usando a chave secreta JWT
    jwt.verify(token, process.env.JWT_SECRET);
    // Se o token for válido, passa o controle para a próxima função
    next();
  } catch {
    // Se o token for inválido, retorna erro 401
    return res.status(401).json({
      erro: "Token inválido"
    });
  }
}
// Exporta o middleware para ser usado nas rotas que exigem autenticação
module.exports = authMiddleware;