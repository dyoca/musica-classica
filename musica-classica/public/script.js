const API = "http://localhost:3000";

let audioAtual = null;

window.addEventListener("DOMContentLoaded", () => {
  mostrar("telaLogin");
});

function mostrar(tela) {
  ["telaLogin", "telaCadastro", "painel", "paginaCompositor"]
    .forEach(id => document.getElementById(id).classList.add("hidden"));

  document.getElementById(tela).classList.remove("hidden");
}

function mostrarLogin() {
  mostrar("telaLogin");
}

function mostrarCadastro() {
  mostrar("telaCadastro");
}

async function cadastrar() {
  const nome = document.getElementById("cadastroNome").value.trim();
  const email = document.getElementById("cadastroEmail").value.trim();
  const senha = document.getElementById("cadastroSenha").value.trim();

  if (!nome || !email || !senha) {
    alert("Preencha todos os campos do cadastro");
    return;
  }

  try {
    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, senha })
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.erro || "Erro no cadastro");
      return;
    }

    alert("Cadastro realizado com sucesso! Faça login.");
    mostrarLogin();
  } catch (err) {
    console.error(err);
    alert("Erro no servidor (cadastro)");
  }
}

async function login() {
  const email = document.getElementById("loginEmail").value.trim();
  const senha = document.getElementById("loginSenha").value.trim();

  if (!email || !senha) {
    alert("Preencha email e senha");
    return;
  }

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha })
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.erro || "Erro no login");
      return;
    }

    if (!data.token) {
      alert("Login inválido: sem token");
      return;
    }

    localStorage.setItem("token", data.token);
    mostrar("painel");
    await listarCompositores();
    await listarObras();
  } catch (err) {
    console.error(err);
    alert("Erro no servidor (login)");
  }
}

async function cadastrarCompositor() {
  const nome = document.getElementById("nome").value.trim();
  const pais = document.getElementById("pais").value.trim();
  const periodo = document.getElementById("periodo").value.trim();

  if (!nome || !pais || !periodo) {
    alert("Preencha todos os campos do compositor");
    return;
  }

  try {
    const res = await fetch(`${API}/compositores`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, pais, periodo })
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.erro || "Erro ao cadastrar compositor");
      return;
    }

    alert("Compositor cadastrado com sucesso");
    document.getElementById("nome").value = "";
    document.getElementById("pais").value = "";
    document.getElementById("periodo").value = "";
    await listarCompositores();
    await preencherCompositorSelect();
  } catch (err) {
    console.error(err);
    alert("Erro no servidor (cadastro compositor)");
  }
}

async function cadastrarObra() {
  const titulo = document.getElementById("obraTitulo").value.trim();
  const ano = Number(document.getElementById("obraAno").value);
  const compositorId = Number(document.getElementById("compositorSelect").value);
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Faça login antes de cadastrar uma obra");
    return;
  }

  if (!titulo || !compositorId) {
    alert("Preencha título e selecione um compositor");
    return;
  }

  try {
    const res = await fetch(`${API}/obras`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ titulo, ano, compositorId })
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.erro || "Erro ao cadastrar obra");
      return;
    }

    alert("Obra cadastrada com sucesso");
    document.getElementById("obraTitulo").value = "";
    document.getElementById("obraAno").value = "";
    document.getElementById("compositorSelect").value = "";
    await listarObras();
  } catch (err) {
    console.error(err);
    alert("Erro no servidor (cadastro obra)");
  }
}

async function listarCompositores() {
  const res = await fetch(`${API}/compositores`);
  const data = await res.json();

  const lista = document.getElementById("listaCompositores");
  lista.innerHTML = "";

  data.forEach(c => {
    const li = document.createElement("li");
    const button = document.createElement("button");
    button.textContent = "Ver obras";
    button.addEventListener("click", () => abrirCompositor(c.id, c.nome));

    li.innerHTML = `
      <b>${c.nome}</b> ${c.classico ? "🎼" : "🎵"}
      <br>
    `;
    li.appendChild(button);
    lista.appendChild(li);
  });

  await preencherCompositorSelect(data);
}

async function preencherCompositorSelect(compositores = null) {
  const select = document.getElementById("compositorSelect");
  const lista = compositores || [];

  if (!compositores) {
    const res = await fetch(`${API}/compositores`);
    if (res.ok) {
      compositores = await res.json();
    } else {
      compositores = [];
    }
  }

  select.innerHTML = `<option value="">Escolha um compositor</option>`;
  compositores.forEach(c => {
    const option = document.createElement("option");
    option.value = c.id;
    option.textContent = c.nome;
    select.appendChild(option);
  });
}

async function listarObras() {
  const res = await fetch(`${API}/obras`);
  const data = await res.json();

  const lista = document.getElementById("listaObrasPanel");
  lista.innerHTML = "";

  if (!data.length) {
    lista.innerHTML = "<li>Nenhuma obra cadastrada ainda.</li>";
    return;
  }

  data.forEach(o => {
    const li = document.createElement("li");
    const button = document.createElement("button");
    button.textContent = "▶ Ouvir";
    button.addEventListener("click", () => tocar(o.titulo, o.compositorNome || "Desconhecido"));

    li.innerHTML = `
      <b>${o.titulo}</b> — ${o.ano || "Ano não informado"}
      <br>
      <small>${o.compositorNome || "Compositor desconhecido"}</small>
    `;
    li.appendChild(button);
    lista.appendChild(li);
  });
}

async function abrirCompositor(id, nome) {
  document.getElementById("nomeCompositor").innerText = nome;
  mostrar("paginaCompositor");

  const res = await fetch(`${API}/compositores/${id}/obras`);
  const obras = await res.json();
  const lista = document.getElementById("listaObras");
  lista.innerHTML = "";

  if (!obras.length) {
    lista.innerHTML = "<li>Nenhuma obra cadastrada para este compositor.</li>";
    return;
  }

  obras.forEach(o => {
    const li = document.createElement("li");
    const button = document.createElement("button");
    button.textContent = "▶";
    button.addEventListener("click", () => tocar(o.titulo, nome));

    li.innerHTML = `<b>${o.titulo}</b>`;
    li.appendChild(button);
    lista.appendChild(li);
  });
}

function iniciarBuscaLive() {
  if (window.timeout) clearTimeout(window.timeout);
  window.timeout = setTimeout(buscarSugestoes, 250);
}

async function buscarSugestoes() {
  const q = document.getElementById("buscaGlobal").value.trim();
  const listaSugestoes = document.getElementById("listaSugestoes");
  listaSugestoes.innerHTML = "";

  if (!q) return;

  try {
    const res = await fetch(`${API}/search?query=${encodeURIComponent(q)}`);
    const data = await res.json();

    if (Array.isArray(data.compositores)) {
      data.compositores.forEach(c => {
        const li = document.createElement("li");
        const button = document.createElement("button");
        button.textContent = "Abrir";
        button.addEventListener("click", () => abrirCompositor(c.id, c.nome));
        const label = c.classico ? " — Clássico" : "";
        li.innerHTML = `🎼 <strong>${c.nome}</strong>${label}`;
        li.appendChild(button);
        listaSugestoes.appendChild(li);
      });
    }

    if (Array.isArray(data.obras)) {
      data.obras.forEach(o => {
        const li = document.createElement("li");
        const button = document.createElement("button");
        button.textContent = "▶";
        button.addEventListener("click", () => tocar(o.titulo, o.compositorNome || "Desconhecido", o.previewUrl));
        const label = o.classico ? " — Clássico" : "";
        li.innerHTML = `🎵 ${o.titulo}${label} <br> <small>${o.compositorNome || "Desconhecido"}</small>`;
        li.appendChild(button);
        listaSugestoes.appendChild(li);
      });
    }
  } catch (err) {
    console.error(err);
    listaSugestoes.innerHTML = "<li>Erro ao buscar sugestões.</li>";
  }
}

async function tocar(titulo, compositor, previewUrl = null) {
  const player = document.getElementById("player");
  const box = document.getElementById("audioPlayer");
  const info = document.getElementById("audioInfo");
  const audioTitulo = document.getElementById("audioTitulo");

  box.classList.remove("hidden");
  audioAtual = player;
  audioTitulo.innerText = `${titulo} — ${compositor}`;
  info.textContent = "Carregando áudio...";

  try {
    let preview = previewUrl;
    if (!preview) {
      const res = await fetch(`${API}/obras/audio?query=${encodeURIComponent(`${titulo} ${compositor}`)}`);
      const data = await res.json();
      if (!Array.isArray(data) || !data.length) {
        info.textContent = "Nenhum preview de áudio encontrado para esta busca.";
        player.removeAttribute("src");
        return;
      }
      preview = data[0].previewUrl;
    }

    if (!preview) {
      info.textContent = "Preview de áudio indisponível.";
      player.removeAttribute("src");
      return;
    }

    player.src = preview;
    player.load();
    await player.play();
    info.textContent = "Preview carregado.";
  } catch (err) {
    console.error(err);
    info.textContent = "Não foi possível reproduzir o áudio.";
    player.removeAttribute("src");
  }
}

function voltarParaPainel() {
  mostrar("painel");
}
