// Importa o modelo User do banco de dados
const User = require("../models/User");
// Importa o módulo bcrypt para criptografia de senhas
const bcrypt = require("bcrypt");
// Importa o módulo jsonwebtoken para criar tokens de autenticação
const jwt = require("jsonwebtoken");
// Função para cadastrar um novo usuário
async function cadastro(req, res) {
  // Desestrutura nome, email e senha
  const { nome, email, senha } = req.body;
  // Criptografa a senha com bcrypt usando 10 codigos
  const hash = await bcrypt.hash(senha, 10);
  // Cria um novo usuário no banco de dados com nome, email e senha criptografada
  const usuario = await User.create({
    nome,
    email,
    senha: hash
  });
  // Retorna o usuário criado com status 201
  res.status(201).json(usuario);
}
// Função para fazer login de um usuário
async function login(req, res) {
  // Desestrutura email e senha do corpo da requisição
  const { email, senha } = req.body;
  // Procura um usuário com o email fornecido no banco de dados
  const usuario = await User.findOne({
    where: { email }
  });
  // Se o usuário não existir, retorna erro 404
  if (!usuario) {
    return res.status(404).json({
      erro: "Usuário não encontrado"
    });
  }
  // Compara a senha fornecida com a senha criptografada do usuário
  const senhaValida = await bcrypt.compare(
    senha,
    usuario.senha
  );
  // Se a senha for inválida, retorna erro 401
  if (!senhaValida) {
    return res.status(401).json({
      erro: "Senha inválida"
    });
  }
  // Cria um token JWT com o ID do usuário, válido por 1 dia
  const token = jwt.sign(
    { id: usuario.id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
  // Retorna o token para o cliente
  res.json({ token });
}
// Exporta as funções de cadastro e login
module.exports = {
  cadastro,
  login
};