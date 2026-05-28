// Importa DataTypes do Sequelize para definir os tipos de dados das colunas
const { DataTypes } = require("sequelize");
// Importa a instância do Sequelize conectada ao banco de dados
const sequelize = require("../database/connection");
// Define o modelo Obra com as colunas e suas propriedades
const Obra = sequelize.define("Obra", {
  titulo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ano: {
    type: DataTypes.INTEGER
  },
  compositorId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});
// Exporta o modelo para ser usado em outros arquivos, como controllers e rotas
module.exports = Obra;