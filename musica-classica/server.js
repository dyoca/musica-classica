// Carrega as variáveis de ambiente do arquivo .env para o processo
require("dotenv").config();
// Exibe no console o valor da chave secreta JWT para verificação (use com cuidado em produção)
console.log(process.env.JWT_SECRET);
// Importa a aplicação Express configurada do arquivo app.js
const app = require("./src/app");
// Define a porta em que o servidor rodará, usando a variável de ambiente PORT ou 3000 como padrão
const API = window.location.origin;
// Inicia o servidor e coloca-o em escuta na porta especificada
app.listen(PORT, () => {
  // Exibe mensagem no console informando que o servidor está rodando
  console.log(`Servidor rodando na porta ${PORT}`);
});