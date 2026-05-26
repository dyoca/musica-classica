// Importa o módulo supertest para fazer testes nas rotas HTTP
const request = require("supertest");
// Importa a aplicação Express para testar
const app = require("../app");
// Agrupa os testes relacionados a POST /auth/login
describe("POST /auth/login", () => {
  // Define um teste individual que verifica erro com usuário inválido
  it("Deve retornar erro com usuário inválido", async () => {
    // Faz uma requisição POST para /auth/login com dados inválidos
    const response = await request(app)
      .post("/auth/login")
      .send({
        email: "teste@email.com",
        senha: "123456"
      });
    // Verifica se o status da resposta é maior ou igual a 400 (erro)
    expect(response.statusCode).toBeGreaterThanOrEqual(400);
  });
});