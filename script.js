/* =========================================================
   GAMEHUB - SISTEMA DE CADASTRO E LOGIN
   ========================================================= */

/* ---------- FUNÇÕES DE VALIDAÇÃO ---------- */

// Valida email com regex
function validatorEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

// Valida nickname (mínimo 4 caracteres, sem espaços)
function validatorNickname(nick) {
  return nick.trim().length >= 4 && !nick.includes(" ");
}

// Valida senha (mínimo 6 caracteres e pelo menos 1 número)
function validatorSenha(senha) {
  return senha.length >= 6 && /\d/.test(senha);
}

// Valida data de nascimento (idade mínima 10 anos)
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

// Valida jogo favorito (deve ser escolhido)
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

/* ---------- FUNÇÃO: CADASTRAR ---------- */
function cadastrar() {
  const nickname = document.getElementById("nickname");
  const email = document.getElementById("email");
  const dataNasc = document.getElementById("dataNasc");
  const jogoFav = document.getElementById("jogoFav");
  const senha = document.getElementById("senha");
  const confirmar = document.getElementById("confirmar");

  let valido = true;

  // Limpa classes anteriores
  document.querySelectorAll("input, select").forEach(i => {
    i.classList.remove("erro", "success");
  });

  // Nickname
  if (!validatorNickname(nickname.value)) {
    nickname.classList.add("erro");
    valido = false;
  } else nickname.classList.add("success");

  // Email
  if (!validatorEmail(email.value)) {
    email.classList.add("erro");
    valido = false;
  } else email.classList.add("success");

  // Data de Nascimento
  if (!validatorData(dataNasc.value)) {
    dataNasc.classList.add("erro");
    valido = false;
  } else dataNasc.classList.add("success");

  // Jogo Favorito
  if (!validatorJogo(jogoFav.value)) {
    jogoFav.classList.add("erro");
    valido = false;
  } else jogoFav.classList.add("success");

  // Senha
  if (!validatorSenha(senha.value)) {
    senha.classList.add("erro");
    valido = false;
  } else senha.classList.add("success");

  // Confirmação
  if (senha.value !== confirmar.value || confirmar.value === "") {
    confirmar.classList.add("erro");
    valido = false;
  } else confirmar.classList.add("success");

  // Se algo falhou
  if (!valido) {
    mostrarMensagem("❌ Verifique os campos obrigatórios!", "#ff3b5c");
    return;
  }

  // Verifica se email já existe
  const existente = JSON.parse(localStorage.getItem("gamerGameHub"));
  if (existente && existente.email === email.value.trim()) {
    mostrarMensagem("❌ Este email já está cadastrado!", "#ff3b5c");
    return;
  }

  // Cria objeto do gamer
  const gamer = {
    nickname: nickname.value.trim(),
    email: email.value.trim(),
    dataNasc: dataNasc.value,
    jogoFav: jogoFav.value,
    senha: senha.value
  };

  // Salva no localStorage
  localStorage.setItem("gamerGameHub", JSON.stringify(gamer));
  mostrarMensagem("✅ Conta criada com sucesso! Bem-vindo, " + gamer.nickname + " 🎮", "#00e676");

  // Limpa o formulário
  setTimeout(() => {
    document.getElementById("formCadastro").reset();
    document.querySelectorAll("input, select").forEach(i => {
      i.classList.remove("erro", "success");
    });
  }, 2000);
}

/* ---------- FUNÇÃO: LOGIN ---------- */
function login() {
  const email = document.getElementById("loginEmail").value.trim();
  const senha = document.getElementById("loginSenha").value;

  const gamerSalvo = JSON.parse(localStorage.getItem("gamerGameHub"));

  // Nenhum usuário cadastrado
  if (!gamerSalvo) {
    mostrarMensagem("❌ Nenhum gamer cadastrado. Crie uma conta primeiro!", "#ff3b5c");
    return;
  }

  // Email inválido
  if (!validatorEmail(email)) {
    mostrarMensagem("❌ Email em formato inválido!", "#ff3b5c");
    return;
  }

  // Login válido
  if (gamerSalvo.email === email && gamerSalvo.senha === senha) {
    mostrarMensagem(
      "🎯 Login OK! Bem-vindo de volta, " + gamerSalvo.nickname + "! Jogo fav: " + gamerSalvo.jogoFav,
      "#00e676"
    );
  } else {
    mostrarMensagem("❌ Credenciais inválidas!", "#ff3b5c");
  }
}

/* =========================================================
   TESTES DE UNIDADE (console.assert)
   ========================================================= */
console.log("🧪 Iniciando Testes de Unidade - GameHub...");

// ----- Email -----
console.assert(validatorEmail("gamer@email.com") === true, "❌ Email válido falhou");
console.assert(validatorEmail("gamer@") === false, "❌ Email inválido passou");
console.assert(validatorEmail("gamer.com") === false, "❌ Email sem @ passou");
console.assert(validatorEmail("") === false, "❌ Email vazio passou");

// ----- Nickname -----
console.assert(validatorNickname("ProGamer") === true, "❌ Nick válido falhou");
console.assert(validatorNickname("Pro") === false, "❌ Nick curto passou");
console.assert(validatorNickname("Pro Gamer") === false, "❌ Nick com espaço passou");
console.assert(validatorNickname("") === false, "❌ Nick vazio passou");

// ----- Senha -----
console.assert(validatorSenha("abc123") === true, "❌ Senha válida falhou");
console.assert(validatorSenha("abc") === false, "❌ Senha curta passou");
console.assert(validatorSenha("abcdef") === false, "❌ Senha sem número passou");
console.assert(validatorSenha("123456") === true, "❌ Senha numérica falhou");

// ----- Data de Nascimento -----
console.assert(validatorData("2000-05-10") === true, "❌ Data válida falhou");
console.assert(validatorData("2020-05-10") === false, "❌ Menor de 10 passou");
console.assert(validatorData("") === false, "❌ Data vazia passou");

// ----- Jogo Favorito -----
console.assert(validatorJogo("FPS") === true, "❌ Jogo válido falhou");
console.assert(validatorJogo("") === false, "❌ Jogo vazio passou");

console.log("✅ Todos os testes executados! Verifique se houve erros acima.");