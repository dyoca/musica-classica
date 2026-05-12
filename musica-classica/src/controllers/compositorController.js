const Compositor = require("../models/Compositor");

async function criar(req, res) {

  const compositor = await Compositor.create(req.body);

  res.status(201).json(compositor);
}

async function listar(req, res) {

  const compositores = await Compositor.findAll();

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