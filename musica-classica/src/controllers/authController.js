const User = require("../models/User");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

async function cadastro(req, res) {

  const { nome, email, senha } = req.body;

  const hash = await bcrypt.hash(senha, 10);

  const usuario = await User.create({
    nome,
    email,
    senha: hash
  });

  res.status(201).json(usuario);
}

async function login(req, res) {

  const { email, senha } = req.body;

  const usuario = await User.findOne({
    where: { email }
  });

  if (!usuario) {
    return res.status(404).json({
      erro: "Usuário não encontrado"
    });
  }

  const senhaValida = await bcrypt.compare(
    senha,
    usuario.senha
  );

  if (!senhaValida) {
    return res.status(401).json({
      erro: "Senha inválida"
    });
  }

  const token = jwt.sign(
    { id: usuario.id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token });
}

module.exports = {
  cadastro,
  login
};