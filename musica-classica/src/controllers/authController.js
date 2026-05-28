const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function cadastro(req, res) {
  try {
    const { nome, email, senha } = req.body;

    const usuarioExistente = await User.findOne({
      where: { email }
    });

    if (usuarioExistente) {
      return res.status(400).json({
        erro: "E-mail já cadastrado"
      });
    }

    const hash = await bcrypt.hash(senha, 10);

    const usuario = await User.create({
      nome,
      email,
      senha: hash
    });

    res.status(201).json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      erro: "Erro ao cadastrar usuário"
    });
  }
}

async function login(req, res) {
  try {
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
  } catch (error) {
    console.error(error);

    res.status(500).json({
      erro: "Erro ao realizar login"
    });
  }
}

module.exports = {
  cadastro,
  login
};