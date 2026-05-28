const Compositor = require("../models/Compositor");
const { Op } = require("sequelize");

async function criar(req, res) {
  try {
    const { nome } = req.body;

    const compositorExistente =
      await Compositor.findOne({
        where: { nome }
      });

    if (compositorExistente) {
      return res.status(400).json({
        mensagem: "Esse compositor já existe"
      });
    }

    const compositor =
      await Compositor.create(req.body);

    res.status(201).json(compositor);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      erro: "Erro ao criar compositor"
    });
  }
}

async function listar(req, res) {
  try {
    const { nome } = req.query;

    const where = {};

    if (nome) {
      where.nome = {
        [Op.like]: `%${nome}%`
      };
    }

    const compositores =
      await Compositor.findAll({
        where
      });

    res.json(compositores);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      erro: "Erro ao listar compositores"
    });
  }
}

async function search(req, res) {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        erro: "Query obrigatória"
      });
    }

    const compositores =
      await Compositor.findAll({
        where: {
          nome: {
            [Op.like]: `%${query}%`
          }
        }
      });

    res.json(compositores);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      erro: "Erro na busca"
    });
  }
}

async function editar(req, res) {
  try {
    const { id } = req.params;

    await Compositor.update(
      req.body,
      {
        where: { id }
      }
    );

    res.json({
      mensagem: "Compositor atualizado"
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      erro: "Erro ao atualizar compositor"
    });
  }
}

async function deletar(req, res) {
  try {
    const { id } = req.params;

    await Compositor.destroy({
      where: { id }
    });

    res.json({
      mensagem: "Compositor deletado"
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      erro: "Erro ao deletar compositor"
    });
  }
}

module.exports = {
  criar,
  listar,
  search,
  editar,
  deletar
};