// Importa DataTypes do Sequelize para definir os tipos de dados das colunas
const { DataTypes } = require("sequelize");
// Importa a instância do Sequelize conectada ao banco de dados
const sequelize = require("../database/connection");
// Define o modelo User com as colunas e suas propriedades
const User = sequelize.define("User", {
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false
  }
});
// Exporta o modelo User para ser usado em outras partes do projeto
module.exports = User;