// Função middleware para tratamento centralizado de erros
function errorMiddleware(err, req, res, next) {
  // Registra o erro no console
  console.error(err);
  // Retorna a resposta de erro com status HTTP e mensagem
  res.status(err.status || 500).json({
    sucesso: false,
    mensagem: err.message || "Erro interno do servidor",
  });
}
// Exporta o middleware para ser usado na aplicação principal
module.exports = errorMiddleware;