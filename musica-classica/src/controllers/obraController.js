// Importa o modelo Obra do banco de dados
const Obra = require("../models/Obra");
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
  const obras = await Obra.findAll();
  // Retorna a lista de obras
  res.json(obras);
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
  editar,
  deletar
};