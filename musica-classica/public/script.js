const API = "http://localhost:3000";

let compositorAtual = null;
let audioAtual = null;

/* =========================
   UI HELPERS
========================= */

function mostrar(tela) {
  ["telaLogin", "telaCadastro", "painel", "paginaCompositor"]
    .forEach(id => document.getElementById(id).classList.add("hidden"));

  document.getElementById(tela).classList.remove("hidden");
}

/* =========================
   LOGIN
========================= */

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

    document.getElementById("telaLogin").classList.add("hidden");
    document.getElementById("painel").classList.remove("hidden");

    listarCompositores();
    listarObras();

  } catch (err) {
    console.error(err);
    alert("Erro no servidor (login)");
  }
}

/* =========================
   COMPOSITORES
========================= */

async function listarCompositores() {
  const res = await fetch(`${API}/compositores`);
  const data = await res.json();

  listaCompositores.innerHTML = "";

  data.forEach(c => {
    const li = document.createElement("li");

    li.innerHTML = `
      <b>${c.nome}</b> ${c.classico ? "🎼" : "🎵"}
      <br>
      <button onclick="abrirCompositor(${c.id}, '${c.nome}')">
        ver obras
      </button>
    `;

    listaCompositores.appendChild(li);
  });
}

/* =========================
   ABRIR COMPOSITOR (PÁGINA)
========================= */

async function abrirCompositor(id, nome) {
  compositorAtual = id;

  mostrar("paginaCompositor");
  nomeCompositor.innerText = nome;

  const res = await fetch(`${API}/compositores/${id}/obras`);
  const obras = await res.json();

  listaObras.innerHTML = "";

  obras.forEach(o => {
    const li = document.createElement("li");

    li.innerHTML = `
      <b>${o.titulo}</b>
      <button onclick="tocar('${o.titulo}', '${nome}')">▶</button>
    `;

    listaObras.appendChild(li);
  });
}

/* =========================
   BUSCA (AUTOCOMPLETE REAL)
========================= */

let timeout = null;

function buscarSugestoes() {
  clearTimeout(timeout);

  timeout = setTimeout(async () => {
    const q = buscaGlobal.value.trim();
    if (!q) return (listaSugestoes.innerHTML = "");

    const res = await fetch(`${API}/compositores/search?query=${q}`);
    const data = await res.json();

    listaSugestoes.innerHTML = "";

    data.compositores.forEach(c => {
      const li = document.createElement("li");

      li.innerHTML = `
        🎼 <b>${c.nome}</b>
        <button onclick="abrirCompositor(${c.id}, '${c.nome}')">abrir</button>
      `;

      listaSugestoes.appendChild(li);
    });

    data.obras.forEach(o => {
      const li = document.createElement("li");

      li.innerHTML = `
        🎵 ${o.titulo}
        <button onclick="tocar('${o.titulo}', '${o.compositorNome}')">▶</button>
      `;

      listaSugestoes.appendChild(li);
    });
  }, 200);
}

/* =========================
   PLAYER FIXO (CORRIGIDO)
========================= */

function tocar(titulo, compositor) {
  const player = document.getElementById("player");
  const box = document.getElementById("audioPlayer");

  box.classList.remove("hidden");

  audioTitulo.innerText = `${titulo} — ${compositor}`;

  if (!audioAtual) {
    audioAtual = player;
  }

  player.src = `https://example.com/audio/${encodeURIComponent(titulo)}.mp3`;

  player.load();
  player.play();
}