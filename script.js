/* =========================================================
   GAMEHUB - SISTEMA DE CADASTRO E LOGIN (v2)
   Com mensagens de erro específicas por campo
   ========================================================= */

/* ---------- FUNÇÕES DE VALIDAÇÃO ---------- */

function validatorEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

function validatorNickname(nick) {
  return nick.trim().length >= 4 && !nick.includes(" ");
}

function validatorSenha(senha) {
  return senha.length >= 6 && /\d/.test(senha);
}

function validatorData(dataStr) {
  if (!dataStr) return false;
  const hoje = new Date();
  const nasc = new Date(dataStr);
  const idade = hoje.getFullYear() - nasc.getFullYear();
  const mes = hoje.getMonth() - nasc.getMonth();

  if (mes < 0 || (mes === 0 && hoje.getDate() < nasc.getDate())) {
    return idade - 1 >= 10;
  }
  return idade >= 10;
}

function validatorJogo(jogo) {
  return jogo !== "";
}

/* ---------- FUNÇÃO AUXILIAR ---------- */
function mostrarMensagem(msg, cor) {
  const el = document.getElementById("mensagem");
  if (!el) return;
  el.textContent = msg;
  el.style.color = cor;
}

/* =========================================================
   FUNÇÃO: CADASTRAR (COM MENSAGENS ESPECÍFICAS)
   ========================================================= */
function cadastrar() {
  const nickname = document.getElementById("nickname");
  const email = document.getElementById("email");
  const dataNasc = document.getElementById("dataNasc");
  const jogoFav = document.getElementById("jogoFav");
  const senha = document.getElementById("senha");
  const confirmar = document.getElementById("confirmar");

  // Limpa classes anteriores
  document.querySelectorAll("input, select").forEach(i => {
    i.classList.remove("erro", "success");
  });

  /* =========================================
     VALIDAÇÕES EM ORDEM (para na primeira que falhar)
     ========================================= */

  // 1️⃣ NICKNAME
  if (nickname.value.trim() === "") {
    nickname.classList.add("erro");
    mostrarMensagem("❌ Nickname é obrigatório!", "#ff3b5c");
    return;
  }
  if (nickname.value.trim().length < 4) {
    nickname.classList.add("erro");
    mostrarMensagem("❌ Nickname deve ter no mínimo 4 caracteres!", "#ff3b5c");
    return;
  }
  if (nickname.value.includes(" ")) {
    nickname.classList.add("erro");
    mostrarMensagem("❌ Nickname não pode conter espaços!", "#ff3b5c");
    return;
  }
  nickname.classList.add("success");

  // 2️⃣ EMAIL
  if (email.value.trim() === "") {
    email.classList.add("erro");
    mostrarMensagem("❌ Email é obrigatório!", "#ff3b5c");
    return;
  }
  if (!validatorEmail(email.value)) {
    email.classList.add("erro");
    mostrarMensagem("❌ Email em formato inválido! Use: nome@dominio.com", "#ff3b5c");
    return;
  }
  email.classList.add("success");

  // 3️⃣ DATA DE NASCIMENTO
  if (dataNasc.value === "") {
    dataNasc.classList.add("erro");
    mostrarMensagem("❌ Data de nascimento é obrigatória!", "#ff3b5c");
    return;
  }
  if (!validatorData(dataNasc.value)) {
    dataNasc.classList.add("erro");
    mostrarMensagem("❌ Você precisa ter pelo menos 10 anos para se cadastrar!", "#ff3b5c");
    return;
  }
  dataNasc.classList.add("success");

  // 4️⃣ JOGO FAVORITO
  if (!validatorJogo(jogoFav.value)) {
    jogoFav.classList.add("erro");
    mostrarMensagem("❌ Selecione seu jogo favorito!", "#ff3b5c");
    return;
  }
  jogoFav.classList.add("success");

  // 5️⃣ SENHA — CT03 (SENHA FRACA)
  if (senha.value === "") {
    senha.classList.add("erro");
    mostrarMensagem("❌ Senha é obrigatória!", "#ff3b5c");
    return;
  }
  if (senha.value.length < 6) {
    senha.classList.add("erro");
    mostrarMensagem("❌ Senha fraca! Deve ter no mínimo 6 caracteres.", "#ff3b5c");
    return;
  }
  if (!/\d/.test(senha.value)) {
    senha.classList.add("erro");
    mostrarMensagem("❌ Senha fraca! Deve conter pelo menos 1 número.", "#ff3b5c");
    return;
  }
  senha.classList.add("success");

  // 6️⃣ CONFIRMAÇÃO DE SENHA — CT04 (SENHAS DIFERENTES)
  if (confirmar.value === "") {
    confirmar.classList.add("erro");
    mostrarMensagem("❌ Confirmação de senha é obrigatória!", "#ff3b5c");
    return;
  }
  if (senha.value !== confirmar.value) {
    confirmar.classList.add("erro");
    mostrarMensagem("❌ As senhas não coincidem! Digite a mesma senha nos dois campos.", "#ff3b5c");
    return;
  }
  confirmar.classList.add("success");

  /* =========================================
     VERIFICA DUPLICIDADE DE EMAIL
     ========================================= */
  const existente = JSON.parse(localStorage.getItem("gamerGameHub"));
  if (existente && existente.email === email.value.trim()) {
    email.classList.add("erro");
    mostrarMensagem("❌ Este email já está cadastrado!", "#ff3b5c");
    return;
  }

  /* =========================================
     SUCESSO - SALVA NO LOCALSTORAGE
     ========================================= */
  const gamer = {
    nickname: nickname.value.trim(),
    email: email.value.trim(),
    dataNasc: dataNasc.value,
    jogoFav: jogoFav.value,
    senha: senha.value
  };

  localStorage.setItem("gamerGameHub", JSON.stringify(gamer));
  mostrarMensagem("✅ Conta criada com sucesso! Bem-vindo, " + gamer.nickname + " 🎮", "#00e676");

  // Limpa o formulário após 2s
  setTimeout(() => {
    document.getElementById("formCadastro").reset();
    document.querySelectorAll("input, select").forEach(i => {
      i.classList.remove("erro", "success");
    });
  }, 2000);
}

/* =========================================================
   FUNÇÃO: LOGIN (COM MENSAGENS ESPECÍFICAS)
   ========================================================= */
function login() {
  const email = document.getElementById("loginEmail");
  const senha = document.getElementById("loginSenha");

  // Limpa classes
  document.querySelectorAll("input").forEach(i => {
    i.classList.remove("erro", "success");
  });

  // 1️⃣ EMAIL VAZIO
  if (email.value.trim() === "") {
    email.classList.add("erro");
    mostrarMensagem("❌ Email é obrigatório!", "#ff3b5c");
    return;
  }

  // 2️⃣ EMAIL INVÁLIDO
  if (!validatorEmail(email.value)) {
    email.classList.add("erro");
    mostrarMensagem("❌ Email em formato inválido!", "#ff3b5c");
    return;
  }
  email.classList.add("success");

  // 3️⃣ SENHA VAZIA
  if (senha.value === "") {
    senha.classList.add("erro");
    mostrarMensagem("❌ Senha é obrigatória!", "#ff3b5c");
    return;
  }
  senha.classList.add("success");

  // 4️⃣ VERIFICA SE EXISTE USUÁRIO
  const gamerSalvo = JSON.parse(localStorage.getItem("gamerGameHub"));
  if (!gamerSalvo) {
    mostrarMensagem("❌ Nenhum gamer cadastrado. Crie uma conta primeiro!", "#ff3b5c");
    return;
  }

  // 5️⃣ VERIFICA CREDENCIAIS
  if (gamerSalvo.email === email.value.trim() && gamerSalvo.senha === senha.value) {
    mostrarMensagem(
      "🎯 Login OK! Bem-vindo de volta, " + gamerSalvo.nickname + "! 🎮",
      "#00e676"
    );
  } else if (gamerSalvo.email === email.value.trim() && gamerSalvo.senha !== senha.value) {
    senha.classList.add("erro");
    mostrarMensagem("❌ Senha incorreta! Tente novamente.", "#ff3b5c");
  } else {
    email.classList.add("erro");
    mostrarMensagem("❌ Email não encontrado. Verifique ou crie uma conta.", "#ff3b5c");
  }
}

/* =========================================================
   TESTES DE UNIDADE (console.assert)
   ========================================================= */
console.log("🧪 Iniciando Testes de Unidade - GameHub v2...");

// Email
console.assert(validatorEmail("gamer@email.com") === true, "❌ Email válido falhou");
console.assert(validatorEmail("gamer@") === false, "❌ Email inválido passou");
console.assert(validatorEmail("gamer.com") === false, "❌ Email sem @ passou");
console.assert(validatorEmail("") === false, "❌ Email vazio passou");

// Nickname
console.assert(validatorNickname("ProGamer") === true, "❌ Nick válido falhou");
console.assert(validatorNickname("Pro") === false, "❌ Nick curto passou");
console.assert(validatorNickname("Pro Gamer") === false, "❌ Nick com espaço passou");
console.assert(validatorNickname("") === false, "❌ Nick vazio passou");

// Senha — CT03
console.assert(validatorSenha("abc123") === true, "❌ Senha válida falhou");
console.assert(validatorSenha("abc") === false, "❌ Senha curta passou (CT03)");
console.assert(validatorSenha("abcdef") === false, "❌ Senha sem número passou (CT03)");
console.assert(validatorSenha("123456") === true, "❌ Senha numérica falhou");

// Data
console.assert(validatorData("2000-05-10") === true, "❌ Data válida falhou");
console.assert(validatorData("2020-05-10") === false, "❌ Menor de 10 passou");
console.assert(validatorData("") === false, "❌ Data vazia passou");

// Jogo
console.assert(validatorJogo("FPS") === true, "❌ Jogo válido falhou");
console.assert(validatorJogo("") === false, "❌ Jogo vazio passou");

console.log("✅ Todos os testes executados! Verifique se houve erros acima.");