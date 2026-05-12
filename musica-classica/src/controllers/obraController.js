const Obra = require("../models/Obra");

async function criar(req, res) {

  const obra = await Obra.create(req.body);

  res.status(201).json(obra);
}

async function listar(req, res) {

  const obras = await Obra.findAll();

  res.json(obras);
}

async function editar(req, res) {

  const { id } = req.params;

  await Obra.update(req.body, {
    where: { id }
  });

  res.json({
    mensagem: "Obra atualizada"
  });
}

async function deletar(req, res) {

  const { id } = req.params;

  await Obra.destroy({
    where: { id }
  });

  res.json({
    mensagem: "Obra deletada"
  });
}

module.exports = {
  criar,
  listar,
  editar,
  deletar
};