const Compositor = require("../models/Compositor");

async function criar(req, res) {

  const { nome } = req.body;

  const compositorExistente = await Compositor.findOne({
    where: {
      nome
    }
  });

  if (compositorExistente) {

    return res.status(400).json({
      mensagem: "Esse compositor já existe"
    });

  }

  const compositor = await Compositor.create(req.body);

  res.status(201).json(compositor);
}

async function listar(req, res) {

  const { nome } = req.query;

  const page = parseInt(req.query.page) || 1;

  const limit = 2;

  const offset = (page - 1) * limit;

  let where = {};

  if (nome) {

    where.nome = nome;

  }

  const compositores = await Compositor.findAll({
    where,
    limit,
    offset
  });

  res.json(compositores);
}

async function editar(req, res) {

  const { id } = req.params;

  await Compositor.update(req.body, {
    where: { id }
  });

  res.json({
    mensagem: "Compositor atualizado"
  });
}

async function deletar(req, res) {

  const { id } = req.params;

  await Compositor.destroy({
    where: { id }
  });

  res.json({
    mensagem: "Compositor deletado"
  });
}

module.exports = {
  criar,
  listar,
  editar,
  deletar
};