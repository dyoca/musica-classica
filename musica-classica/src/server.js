// Carrega as variáveis de ambiente do arquivo .env
require("dotenv").config();
// Importa a aplicação Express configurada do arquivo app.js
const app = require("./app");
// Define a porta em que o servidor rodará
const PORT = 3000;
// Inicia o servidor e coloca-o em escuta na porta especificada
app.listen(PORT, () => {
  // Exibe a URL para acessar o servidor no console
  console.log(`http://localhost:${PORT}`);
});