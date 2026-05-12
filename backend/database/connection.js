const mysql = require("mysql2");

// conexão com banco
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "senai2025",
  database: "musica_classica"
});

// testar conexão
connection.connect((err) => {
  if (err) {
    console.log("Erro ao conectar ao banco");
  } else {
    console.log("Banco conectado 🎼");
  }
});

module.exports = connection;