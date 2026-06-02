// Importa o módulo axios para fazer requisições HTTP
const axios = require("axios");

// Função assíncrona para buscar informações de CEP através da API ViaCEP
async function buscarCep(req, res) {
  // Desestrutura o CEP do parâmetro da rota
  const { cep } = req.params;

  // Inicia um bloco try-catch para tratamento de erros
  try {
    // Faz uma requisição GET para a API ViaCEP com o CEP fornecido
    const response = await axios.get(
      `https://viacep.com.br/ws/${cep}/json/`
    );

    // Retorna os dados do endereço recebidos da API
    res.json(response.data);

  } catch {
    // Se houver um erro, retorna status 500 com mensagem de erro
    res.status(500).json({
      erro: "Erro ao buscar CEP"
    });
  }
}

// Exporta a função buscarCep para ser usada nas rotas
module.exports = {
  buscarCep
};