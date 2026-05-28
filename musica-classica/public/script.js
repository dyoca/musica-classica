// Define uma URL base da API usando a origem atual do site.
// Se o HTML for aberto diretamente como arquivo local, tenta usar localhost:3000.
const API =
  window.location.origin && window.location.origin !== "null"
    ? window.location.origin
    : "http://localhost:3000";

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
    // Carrega a lista de compositores e obras do servidor
    listarCompositores();
  } catch (error) {
    // Se houver um erro de rede, exibe uma mensagem
    alert("Erro no login");
  }
}
// Função para cadastrar um novo compositor
  async function cadastrarCompositor() {
    const compositoresClassicos = [
    "bach",
    "mozart",
    "beethoven",
    "vivaldi",
    "chopin",
    "liszt",
    "handel",
    "schubert",
    "haydn",
    "tchaikovsky",
    "debussy",
    "ravel",
    "brahms",
    "paganini",
    "rossini",
    "verdi",
    "mahler",
    "wagner",
    "stravinsky"
  ];

  if (
    !compositoresClassicos.some(nomeClassico =>
      nome.toLowerCase().includes(nomeClassico)
    )
  ) {
    alert(
      "Cadastre apenas compositores de música clássica."
    );
    return;
  }
  const nome =
    document.getElementById("nome").value.trim();
  const pais =
    document.getElementById("pais").value.trim();
  const periodo =
    document.getElementById("periodo").value.trim();
  if (!nome || !pais || !periodo) {
    alert("Preencha todos os campos de compositor");
    return;
  }
  // Recupera o token JWT
  const token =
    localStorage.getItem("token");
  if (!token) {
    alert("Você precisa estar logado para cadastrar compositores");
    return;
  }
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
      const message =
        (data.erros && data.erros[0] && data.erros[0].msg) ||
        data.erro ||
        data.mensagem ||
        "Erro ao cadastrar compositor";
      alert(message);
      // Sai da função caso haja erro
      return;
    }
    // Exibe mensagem de sucesso
    alert("Compositor cadastrado com sucesso");
    document.getElementById("nome").value = "";
    document.getElementById("pais").value = "";
    document.getElementById("periodo").value = "";
    // Atualiza a lista de compositores na página
    listarCompositores();
  } catch (error) {
    // Se houver um erro de rede, exibe uma mensagem
    alert(error.message || "Erro ao cadastrar compositor");
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
    if (!response.ok) {
      const message =
        (compositores.erros && compositores.erros[0] && compositores.erros[0].msg) ||
        compositores.erro ||
        compositores.mensagem ||
        "Erro ao listar compositores";
      alert(message);
      return;
    }
    // Repete cada compositor na lista recebida
    if (!Array.isArray(compositores)) {
      alert("Erro ao listar compositores");
      return;
    }
    compositores.forEach((compositor) => {
      // Cria um novo elemento de lista
      const item =
        document.createElement("li");
      // Define o conteúdo HTML do item com informações do compositor
      item.innerHTML = `
        <strong>${compositor.nome}</strong>
        <br>
        ID: ${compositor.id}
        <br>
        ${compositor.pais} • ${compositor.periodo}
        <br>
        <button onclick="deletarCompositor(${compositor.id})">
          Deletar compositor
        </button>
      `;
      // Adiciona o item à lista
      lista.appendChild(item);
    });
  } catch (error) {
    // Se houver um erro de rede, exibe uma mensagem
    alert(error.message || "Erro ao listar compositores");
  }
}

// Função para deletar um compositor existente
async function deletarCompositor(id) {
  try {
    const response = await fetch(
      `${API}/compositores/${id}`,
      {
        method: "DELETE"
      }
    );
    const data = await response.json();
    if (!response.ok) {
      alert(data.erro || data.mensagem || "Erro ao deletar compositor");
      return;
    }
    alert(data.mensagem || "Compositor deletado");
    listarCompositores();
  } catch (error) {
    alert(error.message || "Erro ao deletar compositor");
  }
}

// Função para cadastrar uma nova obra
async function cadastrarObra() {
  const titulo = document.getElementById("titulo").value.trim();
  const ano = parseInt(document.getElementById("ano").value, 10);
  const compositorId = parseInt(
    document.getElementById("compositorId").value,
    10
  );
  const token = localStorage.getItem("token");

  if (!titulo) {
    alert("Título obrigatório");
    return;
  }
  if (!ano || Number.isNaN(ano)) {
    alert("Ano obrigatório e deve ser numérico");
    return;
  }
  if (!compositorId || Number.isNaN(compositorId)) {
    alert("ID do compositor obrigatório e deve ser numérico");
    return;
  }
  if (!token) {
    alert("Você precisa estar logado para cadastrar obras");
    return;
  }

  try {
    const response = await fetch(
      `${API}/obras`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          titulo,
          ano,
          compositorId
        })
      }
    );
    const data = await response.json();
    if (!response.ok) {
      const message =
        (data.erros && data.erros[0] && data.erros[0].msg) ||
        data.erro ||
        data.mensagem ||
        "Erro ao cadastrar obra";
      alert(message);
      return;
    }
    alert("Obra cadastrada com sucesso");
    document.getElementById("titulo").value = "";
    document.getElementById("ano").value = "";
    document.getElementById("compositorId").value = "";
    listarObras();
  } catch (error) {
    alert(error.message || "Erro ao cadastrar obra");
  }
}

// Função para listar todas as obras
async function listarObras() {
  const lista = document.getElementById("listaObras");
  lista.innerHTML = "";
  try {
    const response = await fetch(`${API}/obras`);
    const obras = await response.json();
    if (!response.ok) {
      alert(
        (obras.erros && obras.erros[0] && obras.erros[0].msg) ||
          obras.erro ||
          obras.mensagem ||
          "Erro ao listar obras"
      );
      return;
    }
    if (!Array.isArray(obras)) {
      alert("Erro ao listar obras");
      return;
    }
    obras.forEach((obra) => {
      const item = document.createElement("li");
      item.innerHTML = `
        <strong>${obra.titulo}</strong>
        <br>
        Ano: ${obra.ano || "não informado"}
        <br>
        Autor: ${obra.compositorNome || "Desconhecido"}
        <br>
        <button onclick="deletarObra(${obra.id})">
          Deletar obra
        </button>
      `;
      lista.appendChild(item);
    });
  } catch (error) {
    alert(error.message || "Erro ao listar obras");
  }
}

// Função para buscar sugestões enquanto digita
async function buscarSugestoes() {
  const termo = document
    .getElementById("buscaGlobal")
    .value.trim();
  const lista = document.getElementById("listaSugestoes");
  lista.innerHTML = "";
  document.getElementById("audioPlayer").classList.add("hidden");

  if (!termo) {
    return;
  }

  try {
    lista.innerHTML = "<li>Carregando...</li>";

    const response = await fetch(
      `${API}/search?query=${encodeURIComponent(termo)}`
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      lista.innerHTML = `<li>Erro: ${errorData.erro || "Falha na busca"}</li>`;
      return;
    }

    const data = await response.json();
    const compositores = Array.isArray(data.compositores) ? data.compositores : [];
    const obras = Array.isArray(data.obras) ? data.obras : [];

    lista.innerHTML = "";

    if (compositores.length) {
      const header = document.createElement("li");
      header.innerHTML = "<strong>Autores</strong>";
      lista.appendChild(header);
      compositores.forEach((compositor) => {
        const item = document.createElement("li");
        item.innerHTML = `
          <strong>${compositor.nome}</strong>
          <br>
          ${compositor.pais || "País não informado"} • ${compositor.periodo || "Período não informado"}
        `;
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = "Ver obras";
        button.addEventListener("click", () => {
          document.getElementById("buscaGlobal").value = compositor.nome;
          buscarSugestoes();
        });
        item.appendChild(document.createElement("br"));
        item.appendChild(button);
        lista.appendChild(item);
      });
    }

    if (obras.length) {
      const header = document.createElement("li");
      header.innerHTML = "<strong>Obras</strong>";
      lista.appendChild(header);
      obras.forEach((obra) => {
        const item = document.createElement("li");
        item.innerHTML = `
          <strong>${obra.titulo}</strong>
          <br>
          Autor: ${obra.compositorNome}
          <br>
          Ano: ${obra.ano || "não informado"}
        `;
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = "Ouvir obra";
        button.addEventListener("click", () => {
          ouvirObra(obra.titulo, obra.compositorNome, obra.previewUrl);
        });
        item.appendChild(document.createElement("br"));
        item.appendChild(button);
        lista.appendChild(item);
      });
    }

    if (!lista.childElementCount) {
      lista.innerHTML = "<li>Nenhuma sugestão encontrada.</li>";
    }
  } catch (error) {
    console.error(error);
    lista.innerHTML = "<li>Erro ao carregar sugestões.</li>";
  }
}

// Função para buscar e reproduzir áudio da obra selecionada
async function ouvirObra(titulo, compositorNome, previewUrl = null) {
  if (!titulo || !compositorNome) {
    alert("Não foi possível localizar a obra selecionada");
    return;
  }

  const player = document.getElementById("player");
  const audioTitulo = document.getElementById("audioTitulo");
  const audioInfo = document.getElementById("audioInfo");

  const audioUrlLink = document.getElementById("audioUrl");
  audioUrlLink.classList.add("hidden");
  audioUrlLink.href = "#";

  if (previewUrl) {
    player.pause();
    player.currentTime = 0;
    player.src = previewUrl;
    player.muted = false;
    player.volume = 1.0;
    audioTitulo.textContent = `${titulo} — ${compositorNome}`;
    audioInfo.textContent = "Preview disponível";
    audioUrlLink.href = previewUrl;
    audioUrlLink.classList.remove("hidden");
    document.getElementById("audioPlayer").classList.remove("hidden");
    player.load();
    try {
      await player.play();
    } catch (playError) {
      console.error(playError);
      alert("Áudio carregado, mas não foi possível reproduzir automaticamente. Clique no botão de play no player.");
    }
    return;
  }

  const query = `${titulo} ${compositorNome}`;

  try {
    const response = await fetch(
      `${API}/obras/audio?query=${encodeURIComponent(query)}`
    );
    const previews = await response.json();
    if (!response.ok) {
      alert(
        (previews.erros && previews.erros[0] && previews.erros[0].msg) ||
          previews.erro ||
          previews.mensagem ||
          "Erro ao buscar áudio"
      );
      return;
    }

    if (!Array.isArray(previews) || previews.length === 0) {
      alert("Nenhum áudio disponível para esta obra.");
      return;
    }

    const preview = previews[0];

    player.src = preview.previewUrl;
    player.muted = false;
    player.volume = 1.0;
    audioTitulo.textContent = `${titulo} — ${compositorNome}`;
    audioInfo.textContent = `${preview.trackName} • ${preview.artistName} — ${preview.collectionName}`;
    audioUrlLink.href = preview.previewUrl;
    audioUrlLink.classList.remove("hidden");
    document.getElementById("audioPlayer").classList.remove("hidden");
    player.load();
    try {
      await player.play();
    } catch (playError) {
      console.error(playError);
      alert("Áudio carregado, mas não foi possível reproduzir automaticamente. Clique no botão de play no player.");
    }
  } catch (error) {
    alert(error.message || "Erro ao buscar áudio");
  }
}

// Função para deletar uma obra existente
async function deletarObra(id) {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Você precisa estar logado para deletar obras");
    return;
  }
  try {
    const response = await fetch(
      `${API}/obras/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    const data = await response.json();
    if (!response.ok) {
      const message =
        (data.erros && data.erros[0] && data.erros[0].msg) ||
        data.erro ||
        data.mensagem ||
        "Erro ao deletar obra";
      alert(message);
      return;
    }
    alert(data.mensagem || "Obra deletada");
    listarObras();
  } catch (error) {
    alert(error.message || "Erro ao deletar obra");
  }
}
