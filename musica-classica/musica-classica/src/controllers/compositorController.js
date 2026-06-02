// Importa o modelo Compositor do banco de dados
const Compositor = require("../models/Compositor");
// Importa operadores do Sequelize para buscas parciais
const { Op } = require("sequelize");
// Função para criar um novo compositor
async function criar(req, res) {
  // Desestrutura o nome
  const { nome } = req.body;
  // Procura se já existe um compositor com esse nome
  const compositorExistente = await Compositor.findOne({
    where: {
      nome
    }
  });
  // Se o compositor já existe, retorna erro 400
  if (compositorExistente) {
    // Retorna mensagem de erro informando que o compositor já existe
    return res.status(400).json({
      mensagem: "Esse compositor já existe"
    });
  }
  // Cria um novo compositor
  const compositor = await Compositor.create(req.body);
  // Retorna o compositor criado com status 201
  res.status(201).json(compositor);
}
// Função para listar todos os compositores
async function listar(req, res) {
  const { nome } = req.query;
  const where = {};
  if (nome) {
    where.nome = {
      [Op.like]: `%${nome}%`
    };
  }

  const compositores = await Compositor.findAll({
    where
  });

  res.json(compositores);
}

// Função para buscar compositores por nome parcial
async function search(req, res) {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ erro: "Query obrigatória" });
  }

  const compositores = await Compositor.findAll({
    where: {
      nome: {
        [Op.like]: `%${query}%`
      }
    }
  });

  res.json(compositores);
}
// Função para editar um compositor existente
async function editar(req, res) {
  // Desestrutura o ID do parâmetro da rota
  const { id } = req.params;
  // Atualiza o compositor com o ID fornecido com os dados do corpo da requisição
  await Compositor.update(req.body, {
    where: { id }
  });
  // Retorna mensagem de sucesso
  res.json({
    mensagem: "Compositor atualizado"
  });
}
// Função para deletar um compositor
async function deletar(req, res) {
  // Desestrutura o ID do parâmetro da rota
  const { id } = req.params;
  // Deleta o compositor com o ID fornecido do banco de dados
  await Compositor.destroy({
    where: { id }
  });
  // Retorna mensagem de sucesso
  res.json({
    mensagem: "Compositor deletado"
  });
}
// Exporta todas as funções do controller
module.exports = {
  criar,
  listar,
  search,
  editar,
  deletar
};