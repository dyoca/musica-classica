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
    console.log("Erro ao conectar ao banco:", err.message);
    // Tentar criar o banco se não existir
    if (err.code === 'ER_BAD_DB_ERROR') {
      console.log("Tentando criar o banco de dados...");
      const tempConnection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "senai2025"
      });
      tempConnection.query("CREATE DATABASE IF NOT EXISTS musica_classica", (err2) => {
        if (err2) {
          console.log("Erro ao criar banco:", err2.message);
        } else {
          console.log("Banco criado com sucesso! Reconectando...");
          connection.connect((err3) => {
            if (!err3) {
              createTables();
            }
          });
        }
        tempConnection.end();
      });
    }
  } else {
    console.log("Banco conectado 🎼");
    createTables();
  }
});

function createTables() {
  const createConcertsTable = `
    CREATE TABLE IF NOT EXISTS concerts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      date DATETIME NOT NULL,
      location VARCHAR(255),
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  connection.query(createConcertsTable, (err) => {
    if (err) {
      console.log("Erro ao criar tabela concerts:", err.message);
    } else {
      console.log("Tabela concerts criada/verificada ✅");
    }
  });
}

module.exports = connection;