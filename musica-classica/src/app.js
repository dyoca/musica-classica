// Importa o módulo Express para criar a aplicação web
const express = require("express");
// Importa o middleware CORS para permitir requisições de diferentes origens
const cors = require("cors");
// Importa o módulo path para trabalhar com caminhos de arquivos
const path = require("path");
// Importa as rotas de autenticação
const authRoutes = require("./routes/authRoutes");
// Importa as rotas de compositores
const compositorRoutes = require("./routes/compositorRoutes");
// Importa as rotas de obras
const obraRoutes = require("./routes/obraRoutes");
// Importa as rotas de CEP
const cepRoutes = require("./routes/cepRoutes");
// Importa a conexão com o banco de dados (Sequelize)
const sequelize = require("./database/connection");
// Importa o middleware de tratamento de erros
const errorMiddleware = require("./middlewares/errorMiddleware");
// Cria uma instância da aplicação Express
const app = express();
// Importa o módulo Swagger UI para servir a documentação da API
const swaggerUi = require("swagger-ui-express");
// Importa a especificação Swagger gerada pelo swagger-jsdoc
const swaggerSpec = require("./docs/swagger");
// Habilita CORS para aceitar requisições de diferentes origens
app.use(cors());
// Middleware para processar requisições com corpo JSON
app.use(express.json());
// Serve arquivos estáticos da pasta public
app.use(
  express.static(
    path.join(__dirname, "../public")
  )
);
// Define as rotas de autenticação com prefixo /auth
app.use("/auth", authRoutes);
// Define as rotas de compositores com prefixo /compositores
app.use("/compositores", compositorRoutes);
// Define as rotas de obras com prefixo /obras
app.use("/obras", obraRoutes);
// Define as rotas de CEP com prefixo /cep
app.use("/cep", cepRoutes);
// Sincroniza os modelos Sequelize com o banco de dados
sequelize.sync();
// Aplica o middleware de tratamento de erros (deve ser o último)
app.use(errorMiddleware);
// Configura a rota para servir a documentação Swagger UI na URL /docs
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);
// Exporta a aplicação para ser usada no server.js
module.exports = app;