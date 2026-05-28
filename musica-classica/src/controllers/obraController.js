// Importa o modelo Obra do banco de dados
const Obra = require("../models/Obra");
// Importa o modelo Compositor para buscar o autor da obra
const Compositor = require("../models/Compositor");
// Importa axios para consultar APIs externas de áudio
const axios = require("axios");
// Importa operadores do Sequelize para buscas parciais
const { Op } = require("sequelize");

// Função para criar uma nova obra
async function criar(req, res) {
  // Cria uma nova obra
  const obra = await Obra.create(req.body);
  // Retorna a obra criada com status 201
  res.status(201).json(obra);
}
// Função para listar todas as obras
async function listar(req, res) {
  // Busca todas as obras no banco de dados
  const obras = await Obra.findAll({
  include: Compositor
  });
  const compositorIds = obras.map((obra) => obra.compositorId);
  const compositores = await Compositor.findAll({
    where: {
      id: compositorIds
    }
  });
  const obrasComAutor = obras.map((obra) => {
    const compositor = compositores.find(
      (item) => item.id === obra.compositorId
    );
    return {
      id: obra.id,
      titulo: obra.titulo,
      ano: obra.ano,
      compositorId: obra.compositorId,
      compositorNome: compositor ? compositor.nome : "Desconhecido"
    };
  });
  // Retorna a lista de obras com o nome do compositor
  res.json(obrasComAutor);
}

// Função para buscar obras por nome de compositor
async function buscarPorCompositor(req, res) {
  const { nome } = req.query;
  if (!nome) {
    return res.status(400).json({ erro: "Nome do compositor obrigatório" });
  }

  const compositores = await Compositor.findAll({
    where: {
      nome: {
        [Op.like]: `%${nome}%`
      }
    }
  });

  if (!compositores.length) {
    return res.json([]);
  }

  const compositorIds = compositores.map((c) => c.id);
  const obras = await Obra.findAll({
    where: {
      compositorId: compositorIds
    }
  });

  const obrasComAutor = obras.map((obra) => {
    const compositor = compositores.find(
      (item) => item.id === obra.compositorId
    );
    return {
      id: obra.id,
      titulo: obra.titulo,
      ano: obra.ano,
      compositorId: obra.compositorId,
      compositorNome: compositor ? compositor.nome : "Desconhecido"
    };
  });

  res.json(obrasComAutor);
}

// Função para buscar obras por título ou autor parcial
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
  const compositorIds = compositores.map((c) => c.id);

  const obras = await Obra.findAll({
    where: {
      [Op.or]: [
        { titulo: { [Op.like]: `%${query}%` } },
        compositorIds.length
          ? { compositorId: compositorIds }
          : null
      ].filter(Boolean)
    }
  });

  const obrasComAutor = obras.map((obra) => {
    const compositor = compositores.find(
      (item) => item.id === obra.compositorId
    );
    return {
      id: obra.id,
      titulo: obra.titulo,
      ano: obra.ano,
      compositorId: obra.compositorId,
      compositorNome: compositor ? compositor.nome : "Desconhecido"
    };
  });

  res.json(obrasComAutor);
}

// Função para buscar compositores e obras em um único endpoint usando API externa
async function buscarGlobal(req, res) {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ erro: "Query obrigatória" });
  }

  try {
    const response = await axios.get(
      `https://itunes.apple.com/search?term=${encodeURIComponent(
        query
      )}&media=music&limit=30`
    );

    const results = Array.isArray(response.data.results)
      ? response.data.results
      : [];

    const compositores = [...new Map(
      results
        .filter((item) => item.artistName)
        .map((item) => [
          item.artistName,
          {
            nome: item.artistName,
            genero: item.primaryGenreName || "Não informado",
            pais: item.country || "Não informado"
          }
        ])
    )].map(([, compositor]) => compositor);

    const obras = results.map((item) => ({
      titulo: item.trackName || item.collectionName || "Título não disponível",
      compositorNome: item.artistName || "Artista não disponível",
      ano: item.releaseDate ? item.releaseDate.slice(0, 4) : "Não informado",
      previewUrl: item.previewUrl || null,
      collectionName: item.collectionName || "",
      trackViewUrl: item.trackViewUrl || ""
    }));

    res.json({ compositores, obras });
  } catch (error) {
    console.error(error.message || error);
    res.status(500).json({ erro: "Erro ao buscar na internet" });
  }
}

// Função para buscar áudio de uma obra via API externa
async function buscarAudio(req, res) {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ erro: "Query de busca obrigatória" });
  }

  try {
    const response = await axios.get(
      `https://itunes.apple.com/search?term=${encodeURIComponent(
        query
      )}&media=music&limit=5`
    );

    const previews = (response.data.results || [])
      .filter((item) => item.previewUrl)
      .map((item) => ({
        previewUrl: item.previewUrl,
        trackName: item.trackName,
        artistName: item.artistName,
        collectionName: item.collectionName
      }));

    res.json(previews);
  } catch (error) {
    console.error(error.message || error);
    res.status(500).json({
      erro: "Não foi possível consultar o serviço de áudio"
    });
  }
}

// Função para editar uma obra existente
async function editar(req, res) {
  // Desestrutura o ID do parâmetro da rota
  const { id } = req.params;
  // Atualiza a obra com o ID fornecido com os dados do corpo da requisição
  await Obra.update(req.body, {
    where: { id }
  });
  // Retorna mensagem de sucesso
  res.json({
    mensagem: "Obra atualizada"
  });
}
// Função para deletar uma obra
async function deletar(req, res) {
  // Desestrutura o ID do parâmetro da rota
  const { id } = req.params;
  // Deleta a obra com o ID fornecido do banco de dados
  await Obra.destroy({
    where: { id }
  });
  // Retorna mensagem de sucesso
  res.json({
    mensagem: "Obra deletada"
  });
}
// Exporta todas as funções do controller
module.exports = {
  criar,
  listar,
  search,
  buscarGlobal,
  buscarPorCompositor,
  buscarAudio,
  editar,
  deletar
};