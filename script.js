// Dados das Disciplinas com as notas informadas
const dadosDisciplinas = [
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

// Função para normalizar e converter as notas para número
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

// Função para formatar a exibição no HTML (ex: 8.5 vira "8,5" e null vira "—")
function formatarExibicao(valor) {
  let num = normalizarNota(valor);
  return num !== null ? num.toFixed(1).replace(".", ",") : "—";
}

// Função para renderizar a tabela e os cards de resumo
function renderizarBoletim() {
  const tbody = document.getElementById("corpo-tabela");
  if (!tbody) return;
  tbody.innerHTML = "";

  let somaMedias = 0;
  let disciplinasComMedia = 0;
  let totalFaltasGeral = 0;
  let aprovadas = 0;
  let atencao = 0;

  dadosDisciplinas.forEach(item => {
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

    const totalFaltas = item.faltas.reduce((a, b) => a + b, 0);
    totalFaltasGeral += totalFaltas;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.disciplina}</td>
      <td>${formatarExibicao(item.tri1)}</td>
      <td>${formatarExibicao(item.tri2)}</td>
      <td>${formatarExibicao(item.tri3)}</td>
      <td><strong>${media !== null ? media.toFixed(1).replace(".", ",") : "—"}</strong></td>
      <td>${totalFaltas}</td>
    `;
    tbody.appendChild(tr);
  });

  // Atualiza os cards superiores
  const mediaGeralEl = document.getElementById("media-geral");
  const aprovadasEl = document.getElementById("disciplinas-aprovadas");
  const atencaoEl = document.getElementById("disciplinas-atencao");
  const faltasEl = document.getElementById("total-faltas");

  if (mediaGeralEl) {
    let mediaGeral = disciplinasComMedia > 0 ? (somaMedias / disciplinasComMedia).toFixed(1).replace(".", ",") : "—";
    mediaGeralEl.innerText = mediaGeral;
  }
  if (aprovadasEl) aprovadasEl.innerText = aprovadas;
  if (atencaoEl) atencaoEl.innerText = atencao;
  if (faltasEl) faltasEl.innerText = totalFaltasGeral;
}

// Executa ao carregar a página
document.addEventListener("DOMContentLoaded", renderizarBoletim);