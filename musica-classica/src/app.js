const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const compositorRoutes = require("./routes/compositorRoutes");
const obraRoutes = require("./routes/obraRoutes");
const cepRoutes = require("./routes/cepRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/compositores", compositorRoutes);
app.use("/obras", obraRoutes);
app.use("/cep", cepRoutes);

const sequelize = require("./database/connection");

sequelize.sync();

module.exports = app;