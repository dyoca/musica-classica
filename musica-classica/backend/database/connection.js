// Importa o módulo mysql2 para conectar com o banco de dados MySQL
const mysql = require("mysql2");
// Cria uma conexão com o banco de dados MySQL utilizando as credenciais
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "senai2025",
  database: "musica_classica"
});
// Tenta conectar com o banco de dados e trata possíveis erros de conexão
connection.connect((err) => {
  // Verifica se ocorreu um erro na tentativa de conexão
  if (err) {
    // Exibe mensagem de erro informando qual foi o problema
    console.log("Erro ao conectar ao banco:", err.message);
    // Verifica se o erro é porque o banco de dados não existe
    if (err.code === 'ER_BAD_DB_ERROR') {
      // Exibe mensagem informando que tentará criar o banco
      console.log("Tentando criar o banco de dados...");
      // Cria uma conexão temporária sem especificar o banco para criar o banco de dados
      const tempConnection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "senai2025"
      });
      // Executa o comando SQL para criar o banco se não existir
      tempConnection.query("CREATE DATABASE IF NOT EXISTS musica_classica", (err2) => {
        // Verifica se houve erro ao criar o banco
        if (err2) {
          // Exibe mensagem de erro se não conseguiu criar
          console.log("Erro ao criar banco:", err2.message);
        } else {
          // Exibe mensagem de sucesso ao criar o banco
          console.log("Banco criado com sucesso! Reconectando...");
          // Tenta conectar novamente com o banco agora que foi criado
          connection.connect((err3) => {
            // Verifica se a nova conexão foi bem-sucedida
            if (!err3) {
              // Se conectou com sucesso, chama a função para criar as tabelas
              createTables();
            }
          });
        }
        // Encerra a conexão temporária após usá-la
        tempConnection.end();
      });
    }
  } else {
    // Se não houve erro, exibe mensagem de sucesso na conexão
    console.log("Banco conectado");
    // Chama a função para criar as tabelas no banco
    createTables();
  }
});

// Define a função responsável por criar as tabelas do banco de dados
function createTables() {
  // Define o comando SQL para criar a tabela concerts
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
  // Executa o comando SQL para criar a tabela
  connection.query(createConcertsTable, (err) => {
    // Verifica se ocorreu um erro ao criar a tabela
    if (err) {
      // Exibe mensagem de erro informando qual foi o problema
      console.log("Erro ao criar tabela concerts:", err.message);
    } else {
      // Exibe mensagem de sucesso informando que a tabela foi criada ou já existia
      console.log("Tabela concerts criada/verificada");
    }
  });
}
// Conexão para ser utilizada em outros arquivos do projeto
module.exports = connection;