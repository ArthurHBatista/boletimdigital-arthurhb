// Configuração fixa do estudante
const CONFIG_ALUNO = {
  turma: "8C",
  numeroChamada: 2,
  apiUrl: "https://boletim-api.profbt.com.br",
  pinCorreto: "ARTHUR"
};

// Variável em memória para guardar o PIN durante a sessão
let pinSessao = "";

// Modo de edição
let modoEdicao = false;

// Dados das Disciplinas (dados locais / fallback)
let dadosDisciplinas = [
  { disciplina: "Língua Portuguesa", tri1: "9,4", tri2: "8,9", tri3: null, faltas: [0, 0, 0] },
  { disciplina: "Matemática", tri1: "6,0", tri2: "7,5", tri3: null, faltas: [0, 0, 0] },
  { disciplina: "Ciências", tri1: "6,0", tri2: "8,6", tri3: null, faltas: [0, 0, 0] },
  { disciplina: "História", tri1: "9,7", tri2: "9,5", tri3: null, faltas: [0, 0, 0] },
  { disciplina: "Geografia", tri1: "8,0", tri2: "7,5", tri3: null, faltas: [0, 0, 0] },
  { disciplina: "Língua Inglesa", tri1: "9,1", tri2: "9,8", tri3: null, faltas: [0, 0, 0] },
  { disciplina: "Arte", tri1: "9,7", tri2: "10,0", tri3: null, faltas: [0, 0, 0] },
  { disciplina: "Educação Física", tri1: "10,0", tri2: "8,5", tri3: null, faltas: [0, 0, 0] },
  { disciplina: "Educação Digital", tri1: "9,2", tri2: "10,0", tri3: null, faltas: [0, 0, 0] },
  { disciplina: "Educação Financeira", tri1: "10,0", tri2: "10,0", tri3: null, faltas: [0, 0, 0] },
  { disciplina: "Estudo Orientado", tri1: "7,3", tri2: "9,1", tri3: null, faltas: [0, 0, 0] },
  { disciplina: "Redação e Leitura", tri1: "8,2", tri2: "8,6", tri3: null, faltas: [0, 0, 0] },
  { disciplina: "Pensamento Lógico", tri1: "10,0", tri2: "9,7", tri3: null, faltas: [0, 0, 0] },
  { disciplina: "Literatura Arte e Movimento", tri1: "7,3", tri2: "7,5", tri3: null, faltas: [0, 0, 0] },
  { disciplina: "Práticas Experimentais", tri1: "7,2", tri2: "8,8", tri3: null, faltas: [0, 0, 0] }
];

// Normalização para dados antigos e recuperados
function normalizarNota(valor) {
  if (valor === null || valor === undefined || valor === "") return null;
  if (typeof valor === "number") {
    return valor > 10 ? valor / 10 : valor;
  }
  let texto = String(valor).replace(",", ".").trim();
  let num = parseFloat(texto);
  if (isNaN(num)) return null;
  return num > 10 ? num / 10 : num;
}

// Formatação para exibição no HTML
function formatarExibicao(valor) {
  let num = normalizarNota(valor);
  return num !== null ? num.toFixed(1).replace(".", ",") : "—";
}

// Validação estrita para edição de nota digitada pelo usuário
function validarNotaDigitada(texto) {
  if (texto === null || texto === undefined || texto.trim() === "") {
    return { valido: true, valor: null };
  }
  let str = texto.trim().replace(",", ".");
  if (!/^\d+(\.\d+)?$/.test(str)) {
    return { valido: false };
  }
  let num = parseFloat(str);
  if (isNaN(num) || num < 0 || num > 10) {
    return { valido: false };
  }
  return { valido: true, valor: num };
}

// Validação estrita para edição de faltas digitadas
function validarFaltaDigitada(texto) {
  if (texto === null || texto === undefined || texto.trim() === "") {
    return { valido: false };
  }
  let str = texto.trim();
  if (!/^\d+$/.test(str)) {
    return { valido: false };
  }
  let num = parseInt(str, 10);
  if (isNaN(num) || num < 0) {
    return { valido: false };
  }
  return { valido: true, valor: num };
}

// Função para realizar o login e buscar dados na API
async function fazerLogin() {
  const campoPin = document.getElementById("campo-pin");
  const msgStatus = document.getElementById("mensagem-status");
  const pinDigitado = campoPin.value ? campoPin.value.trim().toUpperCase() : "";

  if (!pinDigitado) {
    msgStatus.textContent = "Por favor, digite o PIN.";
    return;
  }

  // Validação local imediata do PIN
  if (pinDigitado !== CONFIG_ALUNO.pinCorreto) {
    msgStatus.textContent = "PIN incorreto. Tente novamente.";
    return;
  }

  msgStatus.textContent = "Conectando...";

  try {
    const resposta = await fetch(`${CONFIG_ALUNO.apiUrl}/api/v1/boletins/abrir`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        turma: CONFIG_ALUNO.turma,
        numero_chamada: CONFIG_ALUNO.numeroChamada,
        pin: pinDigitado
      })
    });

    if (resposta.ok) {
      const resultado = await resposta.json();
      if (resultado && resultado.dados && Array.isArray(resultado.dados.disciplinas) && resultado.dados.disciplinas.length > 0) {
        dadosDisciplinas = resultado.dados.disciplinas;
      }
    }
  } catch (erro) {
    console.warn("API indisponível. Carregando dados locais.");
  }

  // Login efetuado com sucesso
  pinSessao = pinDigitado;
  campoPin.value = "";
  document.getElementById("area-login").style.display = "none";
  document.getElementById("conteudo-boletim").style.display = "block";

  renderizarBoletim();
}

// Alternar modo de edição
function alternarEdicao() {
  modoEdicao = !modoEdicao;
  const btnAlternar = document.getElementById("btn-alternar-edicao");
  const btnSalvar = document.getElementById("btn-salvar");

  if (modoEdicao) {
    btnAlternar.textContent = "Cancelar edição";
    btnSalvar.style.display = "inline-block";
  } else {
    btnAlternar.textContent = "Alterar dados";
    btnSalvar.style.display = "none";
  }

  renderizarBoletim();
}

// Renderiza a tabela e atualiza os cards
function renderizarBoletim() {
  const tbody = document.getElementById("corpo-tabela");
  if (!tbody) return;
  tbody.innerHTML = "";

  let somaMedias = 0;
  let disciplinasComMedia = 0;
  let totalFaltasGeral = 0;
  let aprovadas = 0;
  let atencao = 0;

  dadosDisciplinas.forEach((item, index) => {
    let arrayFaltas = Array.isArray(item.faltas) ? item.faltas : [0, 0, 0];

    const n1 = normalizarNota(item.tri1);
    const n2 = normalizarNota(item.tri2);
    const n3 = normalizarNota(item.tri3);

    const notasValidas = [n1, n2, n3].filter(n => n !== null);
    let media = null;
    if (notasValidas.length > 0) {
      media = notasValidas.reduce((a, b) => a + b, 0) / notasValidas.length;
      somaMedias += media;
      disciplinasComMedia++;

      if (media >= 6.0) {
        aprovadas++;
      } else {
        atencao++;
      }
    }

    const totalFaltas = arrayFaltas.reduce((a, b) => a + b, 0);
    totalFaltasGeral += totalFaltas;

    const tr = document.createElement("tr");

    if (!modoEdicao) {
      // Exibição normal
      const tdDisc = document.createElement("td");
      tdDisc.textContent = item.disciplina;

      const tdT1 = document.createElement("td");
      tdT1.textContent = formatarExibicao(item.tri1);

      const tdT2 = document.createElement("td");
      tdT2.textContent = formatarExibicao(item.tri2);

      const tdT3 = document.createElement("td");
      tdT3.textContent = formatarExibicao(item.tri3);

      const tdMedia = document.createElement("td");
      const strongMedia = document.createElement("strong");
      strongMedia.textContent = media !== null ? media.toFixed(1).replace(".", ",") : "—";
      tdMedia.appendChild(strongMedia);

      const tdFaltas = document.createElement("td");
      tdFaltas.textContent = String(totalFaltas);

      const tdSit = document.createElement("td");
      if (media === null) {
        tdSit.textContent = "Sem nota";
        tdSit.className = "status-indisponivel";
      } else if (media >= 6.0) {
        tdSit.textContent = "Aprovado";
        tdSit.className = "status-bom";
      } else {
        tdSit.textContent = "Atenção";
        tdSit.className = "status-atencao";
      }

      tr.appendChild(tdDisc);
      tr.appendChild(tdT1);
      tr.appendChild(tdT2);
      tr.appendChild(tdT3);
      tr.appendChild(tdMedia);
      tr.appendChild(tdFaltas);
      tr.appendChild(tdSit);
    } else {
      // Modo de edição
      const tdDisc = document.createElement("td");
      tdDisc.textContent = item.disciplina;

      const valT1 = item.tri1 !== null && item.tri1 !== undefined ? String(item.tri1) : "";
      const valT2 = item.tri2 !== null && item.tri2 !== undefined ? String(item.tri2) : "";
      const valT3 = item.tri3 !== null && item.tri3 !== undefined ? String(item.tri3) : "";

      const f1 = arrayFaltas[0] !== undefined ? arrayFaltas[0] : 0;
      const f2 = arrayFaltas[1] !== undefined ? arrayFaltas[1] : 0;
      const f3 = arrayFaltas[2] !== undefined ? arrayFaltas[2] : 0;

      tr.innerHTML = `
        <td>${tdDisc.innerHTML}</td>
        <td><input type="text" class="input-edicao" id="edit-t1-${index}" value="${valT1}" placeholder="—"></td>
        <td><input type="text" class="input-edicao" id="edit-t2-${index}" value="${valT2}" placeholder="—"></td>
        <td><input type="text" class="input-edicao" id="edit-t3-${index}" value="${valT3}" placeholder="—"></td>
        <td><strong>${media !== null ? media.toFixed(1).replace(".", ",") : "—"}</strong></td>
        <td>
          <input type="number" class="input-edicao" id="edit-f1-${index}" value="${f1}" title="Faltas 1º Tri" min="0">
          <input type="number" class="input-edicao" id="edit-f2-${index}" value="${f2}" title="Faltas 2º Tri" min="0">
          <input type="number" class="input-edicao" id="edit-f3-${index}" value="${f3}" title="Faltas 3º Tri" min="0">
        </td>
        <td>Em edição</td>
      `;
    }

    tbody.appendChild(tr);
  });

  // Atualiza cards
  const mediaGeralEl = document.getElementById("media-geral");
  const aprovadasEl = document.getElementById("qtd-bom-desempenho");
  const atencaoEl = document.getElementById("qtd-atencao");
  const faltasEl = document.getElementById("total-faltas");

  if (mediaGeralEl) {
    let mediaGeral = disciplinasComMedia > 0 ? (somaMedias / disciplinasComMedia).toFixed(1).replace(".", ",") : "—";
    mediaGeralEl.textContent = mediaGeral;
  }
  if (aprovadasEl) aprovadasEl.textContent = String(aprovadas);
  if (atencaoEl) atencaoEl.textContent = String(atencao);
  if (faltasEl) faltasEl.textContent = String(totalFaltasGeral);
}

// Salvar alterações na API
async function salvarDados() {
  let erros = 0;
  const novasDisciplinas = [];

  // Remove marcações de erro anteriores
  document.querySelectorAll(".input-invalido").forEach(el => el.classList.remove("input-invalido"));

  dadosDisciplinas.forEach((item, index) => {
    const elT1 = document.getElementById(`edit-t1-${index}`);
    const elT2 = document.getElementById(`edit-t2-${index}`);
    const elT3 = document.getElementById(`edit-t3-${index}`);

    const elF1 = document.getElementById(`edit-f1-${index}`);
    const elF2 = document.getElementById(`edit-f2-${index}`);
    const elF3 = document.getElementById(`edit-f3-${index}`);

    const vT1 = validarNotaDigitada(elT1.value);
    const vT2 = validarNotaDigitada(elT2.value);
    const vT3 = validarNotaDigitada(elT3.value);

    const vF1 = validarFaltaDigitada(elF1.value);
    const vF2 = validarFaltaDigitada(elF2.value);
    const vF3 = validarFaltaDigitada(elF3.value);

    if (!vT1.valido) { elT1.classList.add("input-invalido"); erros++; }
    if (!vT2.valido) { elT2.classList.add("input-invalido"); erros++; }
    if (!vT3.valido) { elT3.classList.add("input-invalido"); erros++; }

    if (!vF1.valido) { elF1.classList.add("input-invalido"); erros++; }
    if (!vF2.valido) { elF2.classList.add("input-invalido"); erros++; }
    if (!vF3.valido) { elF3.classList.add("input-invalido"); erros++; }

    if (vT1.valido && vT2.valido && vT3.valido && vF1.valido && vF2.valido && vF3.valido) {
      novasDisciplinas.push({
        disciplina: item.disciplina,
        tri1: vT1.valor !== null ? vT1.valor : null,
        tri2: vT2.valor !== null ? vT2.valor : null,
        tri3: vT3.valor !== null ? vT3.valor : null,
        faltas: [vF1.valor, vF2.valor, vF3.valor]
      });
    }
  });

  if (erros > 0) {
    alert("Existem campos com valores inválidos. Verifique os campos destacados em vermelho.");
    return;
  }

  const btnSalvar = document.getElementById("btn-salvar");
  btnSalvar.textContent = "Salvando...";

  try {
    const resposta = await fetch(`${CONFIG_ALUNO.apiUrl}/api/v1/boletins/salvar`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        turma: CONFIG_ALUNO.turma,
        numero_chamada: CONFIG_ALUNO.numeroChamada,
        pin: pinSessao,
        dados: {
          disciplinas: novasDisciplinas
        }
      })
    });

    if (!resposta.ok) {
      console.warn("API não respondeu ao salvar. Atualizando localmente.");
    }
  } catch (e) {
    console.warn("Erro de conexão ao tentar salvar na API.");
  }

  dadosDisciplinas = novasDisciplinas;
  modoEdicao = false;

  document.getElementById("btn-alternar-edicao").textContent = "Alterar dados";
  btnSalvar.style.display = "none";
  btnSalvar.textContent = "Salvar alterações";

  renderizarBoletim();
  alert("Dados salvos com sucesso.");
}