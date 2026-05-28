const Compositor = require("../models/Compositor");
const Obra = require("../models/Obra");
const { Op } = require("sequelize");

const compositoresClassicos = [
  "bach", "mozart", "beethoven", "vivaldi",
  "chopin", "liszt", "handel", "haydn",
  "schubert", "debussy", "brahms", "tchaikovsky"
];

// CREATE
async function criar(req, res) {
  try {
    const { nome } = req.body;

    const existe = await Compositor.findOne({ where: { nome } });
    if (existe) return res.status(400).json({ erro: "Já existe esse compositor" });

    const compositor = await Compositor.create(req.body);
    res.status(201).json(compositor);

  } catch (err) {
    res.status(500).json({ erro: "Erro ao criar compositor" });
  }
}

// LISTAR
async function listar(req, res) {
  try {
    const compositores = await Compositor.findAll();

    const resultado = compositores.map(c => ({
      ...c.toJSON(),
      classico: compositoresClassicos.some(k =>
        c.nome.toLowerCase().includes(k)
      )
    }));

    res.json(resultado);

  } catch {
    res.status(500).json({ erro: "Erro ao listar compositores" });
  }
}

// SEARCH (🔥 autocomplete de verdade)
async function search(req, res) {
  try {
    const { query } = req.query;

    if (!query) return res.json([]);

    const compositores = await Compositor.findAll({
      where: {
        nome: { [Op.like]: `%${query}%` }
      },
      limit: 10
    });

    const resultado = compositores.map(c => ({
      ...c.toJSON(),
      classico: compositoresClassicos.some(k =>
        c.nome.toLowerCase().includes(k)
      )
    }));

    const obras = await Obra.findAll({
      where: {
        titulo: { [Op.like]: `%${query}%` }
      },
      limit: 10
    });

    res.json({ compositores: resultado, obras });

  } catch (err) {
    res.status(500).json({ erro: "Erro na busca" });
  }
}

// 🔥 OBRAS POR COMPOSITOR
async function listarObrasPorCompositor(req, res) {
  try {
    const { id } = req.params;

    const obras = await Obra.findAll({
      where: { compositorId: id }
    });

    res.json(obras);
  } catch {
    res.status(500).json({ erro: "Erro ao buscar obras" });
  }
}

// EDIT
async function editar(req, res) {
  try {
    const { id } = req.params;
    await Compositor.update(req.body, { where: { id } });
    res.json({ mensagem: "Atualizado" });
  } catch {
    res.status(500).json({ erro: "Erro ao editar" });
  }
}

// DELETE
async function deletar(req, res) {
  try {
    const { id } = req.params;
    await Compositor.destroy({ where: { id } });
    res.json({ mensagem: "Deletado" });
  } catch {
    res.status(500).json({ erro: "Erro ao deletar" });
  }
}

module.exports = {
  criar, listar, search,
  listarObrasPorCompositor,
  editar, deletar
};