// Importa a classe Sequelize do módulo sequelize
const { Sequelize } = require("sequelize");
// Cria uma instância do Sequelize
const sequelize = new Sequelize({
  // Define o dialect do banco de dados como SQLite
  dialect: "sqlite",
  // Define o caminho do arquivo do banco de dados
  storage: "./database.sqlite"
});
// Exporta a instância para ser usada em outros arquivos
module.exports = sequelize;