const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

const Compositor = sequelize.define("Compositor", {
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },

  pais: {
    type: DataTypes.STRING
  },

  epoca: {
    type: DataTypes.STRING
  }
});

module.exports = Compositor;