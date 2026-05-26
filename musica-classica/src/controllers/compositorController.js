// Importa o modelo Compositor do banco de dados
const Compositor = require("../models/Compositor");
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
  // Desestrutura o nome para filtrar resultados
  const { nome } = req.query;
  // Obtém o número da página
  const page = parseInt(req.query.page) || 1;
  // Define quantos compositores serão retornados por página
  const limit = 2;
  // Calcula quantos compositores pular
  const offset = (page - 1) * limit;
  // Armazena condições de filtro
  let where = {};
  // Se um nome foi fornecido, adiciona ao filtro
  if (nome) {
    where.nome = nome;
  }
  // Busca todos os compositores com os filtros, paginação e limite
  const compositores = await Compositor.findAll({
    where,
    limit,
    offset
  });
  // Retorna a lista de compositores
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
  editar,
  deletar
};