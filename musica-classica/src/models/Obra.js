const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

const Obra = sequelize.define("Obra", {
  titulo: {
    type: DataTypes.STRING,
    allowNull: false
  },

  ano: {
    type: DataTypes.INTEGER
  }
});

module.exports = Obra;