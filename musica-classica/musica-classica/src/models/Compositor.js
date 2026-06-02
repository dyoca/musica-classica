// Importa DataTypes do Sequelize para definir os tipos de dados das colunas
const { DataTypes } = require("sequelize");
// Importa a instância do Sequelize conectada ao banco de dados
const sequelize = require("../database/connection");
// Define o modelo Compositor com as colunas e suas propriedades
//Colunas
const Compositor = sequelize.define("Compositor", {
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  pais: {
    type: DataTypes.STRING,
    allowNull: false
  },
  periodo: {
    type: DataTypes.STRING,
    allowNull: false
  }
});
// Exporta o modelo Compositor para ser usado em outras partes do projeto
module.exports = Compositor;