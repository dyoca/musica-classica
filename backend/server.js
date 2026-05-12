const express = require("express");
const cors = require("cors");
const connection = require("./database/connection");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Servidor de Música Clássica rodando 🎼");
});

app.listen(3000, () => {
  console.log("Servidor iniciado na porta 3000");
});