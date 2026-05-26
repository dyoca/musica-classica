// Define a URL base da API (vazia para usar a API local)
const API = "";
// Função para exibir a tela de login e esconder a tela de cadastro
function mostrarLogin() {
  // Oculta o elemento com ID telaCadastro
  document
    .getElementById("telaCadastro")
    .classList.add("hidden");
  // Mostra o elemento com ID telaLogin
  document
    .getElementById("telaLogin")
    .classList.remove("hidden");
}
// Função para exibir a tela de cadastro e esconder a tela de login
function mostrarCadastro() {
  // Oculta o elemento com ID telaLogin
  document
    .getElementById("telaLogin")
    .classList.add("hidden");
  // Mostra o elemento com ID telaCadastro
  document
    .getElementById("telaCadastro")
    .classList.remove("hidden");
}
// Função para cadastrar um novo usuário
async function cadastrar() {
  const nome =
    document.getElementById("cadastroNome").value;
  const email =
    document.getElementById("cadastroEmail").value;
  const senha =
    document.getElementById("cadastroSenha").value;
  // Inicia um bloco try para tratamento de erros
  try {
    // Faz uma requisição POST para criar um novo usuário na API
    const response = await fetch(
      `${API}/auth/register`,
      {
        // Define o método HTTP como POST
        method: "POST",
        // Define o corpo da requisição
        headers: {
          // Especifica que o corpo é JSON
          "Content-Type": "application/json"
        },
        // Converte os dados em JSON e os envia no corpo da requisição
        body: JSON.stringify({
          nome,
          email,
          senha
        })
      }
    );
    // Converte a resposta para JSON
    const data = await response.json();
    // Verifica se a resposta não foi bem-sucedida
    if (!response.ok) {
      // Exibe um alerta com a mensagem de erro
      alert(data.erro || "Erro ao cadastrar");
      // Sai da função caso haja erro
      return;
    }
    // Exibe mensagem de sucesso
    alert("Conta criada com sucesso");
    // Redireciona o usuário para a tela de login
    mostrarLogin();
  } catch (error) {
    // Se houver um erro de rede, exibe uma mensagem
    alert("Erro no cadastro");
  }
}
// Função para fazer login de um usuário existente
async function login() {
  const email =
    document.getElementById("loginEmail").value;
  const senha =
    document.getElementById("loginSenha").value;
  // Inicia um bloco try para tratamento de erros
  try {
    // Faz uma requisição POST para criar o token de login
    const response = await fetch(
      `${API}/auth/login`,
      {
        // Define o método HTTP como POST
        method: "POST",
        // Define o corpo da requisição
        headers: {
          // Especifica que o corpo é JSON
          "Content-Type": "application/json"
        },
        // Converte os dados em JSON e os envia no corpo da requisição
        body: JSON.stringify({
          email,
          senha
        })
      }
    );
    // Converte a resposta para JSON
    const data = await response.json();
    // Verifica se a resposta não foi bem-sucedida
    if (!response.ok) {
      // Exibe um alerta com a mensagem de erro
      alert(data.erro || "Erro no login");
      // Sai da função caso haja erro
      return;
    }
    // Armazena o token JWT para usar depois nas requisições autenticadas
    localStorage.setItem(
      "token",
      data.token
    );
    // Oculta a tela de login
    document
      .getElementById("telaLogin")
      .classList.add("hidden");
    // Mostra o painel principal
    document
      .getElementById("painel")
      .classList.remove("hidden");
    // Carrega a lista de compositores do servidor
    listarCompositores();
  } catch (error) {
    // Se houver um erro de rede, exibe uma mensagem
    alert("Erro no login");
  }
}
// Função para cadastrar um novo compositor
async function cadastrarCompositor() {
  const nome =
    document.getElementById("nome").value;
  const pais =
    document.getElementById("pais").value;
  const periodo =
    document.getElementById("periodo").value;
  // Recupera o token JWT
  const token =
    localStorage.getItem("token");
  // Inicia um bloco try para tratamento de erros
  try {
    // Faz uma requisição POST para cadastrar um novo compositor
    const response = await fetch(
      `${API}/compositores`,
      {
        // Define o método HTTP como POST
        method: "POST",
        // Define o corpo da requisição
        headers: {
          // Especifica que o corpo é JSON
          "Content-Type": "application/json",
          // Envia o token de autenticação
          Authorization:
            `Bearer ${token}`
        },
        // Converte os dados em JSON e os envia no corpo da requisição
        body: JSON.stringify({
          nome,
          pais,
          periodo
        })
      }
    );
    // Converte a resposta para JSON
    const data = await response.json();
    // Verifica se a resposta não foi bem-sucedida
    if (!response.ok) {
      // Exibe um alerta com a mensagem de erro
      alert(data.erro || "Erro");
      // Sai da função caso haja erro
      return;
    }
    // Exibe mensagem de sucesso
    alert("Compositor cadastrado com sucesso");
    // Atualiza a lista de compositores na página
    listarCompositores();
  } catch (error) {
    // Se houver um erro de rede, exibe uma mensagem
    alert("Erro ao cadastrar compositor");
  }
}
// Função para carregar e listar todos os compositores
async function listarCompositores() {
  // Obtém a referência do elemento de lista onde os compositores serão exibidos
  const lista =
    document.getElementById(
      "listaCompositores"
    );
  // Limpa o conteúdo anterior da lista
  lista.innerHTML = "";
  // Inicia um bloco try para tratamento de erros
  try {
    // Faz uma requisição GET para obter a lista de compositores
    const response = await fetch(
      `${API}/compositores`
    );
    // Converte a resposta para um JSON de compositores
    const compositores =
      await response.json();
    // Repete cada compositor na lista recebida
    compositores.forEach((compositor) => {
      // Cria um novo elemento de lista
      const item =
        document.createElement("li");
      // Define o conteúdo HTML do item com informações do compositor
      item.innerHTML = `
        <strong>${compositor.nome}</strong>
        <br>
        ${compositor.pais} • ${compositor.periodo}
      `;
      // Adiciona o item à lista
      lista.appendChild(item);
    });
  } catch (error) {
    // Se houver um erro de rede, exibe uma mensagem
    alert("Erro ao listar");
  }
}