const axios = require("axios");

async function buscarCep(req, res) {

  const { cep } = req.params;

  try {

    const response = await axios.get(
      `https://viacep.com.br/ws/${cep}/json/`
    );

    res.json(response.data);

  } catch {

    res.status(500).json({
      erro: "Erro ao buscar CEP"
    });

  }
}

module.exports = {
  buscarCep
};