// Dados exatos da tabela enviada
const dadosDisciplinas = [
  { disciplina: "Língua Portuguesa", tri1: "9,4", tri2: "8,9", tri3: null, total: "18,3", media: "9,2", faltas: [0, 0, 0] },
  { disciplina: "Matemática", tri1: "6,0", tri2: "7,5", tri3: null, total: "13,5", media: "6,8", faltas: [0, 0, 0] },
  { disciplina: "Ciências", tri1: "6,0", tri2: "8,6", tri3: null, total: "14,6", media: "7,3", faltas: [0, 0, 0] },
  { disciplina: "História", tri1: "9,7", tri2: "9,5", tri3: null, total: "19,2", media: "9,6", faltas: [0, 0, 0] },
  { disciplina: "Geografia", tri1: "8,0", tri2: "7,5", tri3: null, total: "15,5", media: "7,8", faltas: [0, 0, 0] },
  { disciplina: "Língua Inglesa", tri1: "9,1", tri2: "9,8", tri3: null, total: "18,9", media: "9,5", faltas: [0, 0, 0] },
  { disciplina: "Arte", tri1: "9,7", tri2: "10,0", tri3: null, total: "19,7", media: "9,9", faltas: [0, 0, 0] },
  { disciplina: "Educação Física", tri1: "10,0", tri2: "8,5", tri3: null, total: "18,5", media: "9,3", faltas: [0, 0, 0] },
  { disciplina: "Educação Digital", tri1: "9,2", tri2: "10,0", tri3: null, total: "19,2", media: "9,6", faltas: [0, 0, 0] },
  { disciplina: "Educação Financeira", tri1: "10,0", tri2: "10,0", tri3: null, total: "20,0", media: "10,0", faltas: [0, 0, 0] },
  { disciplina: "Estudo Orientado", tri1: "7,3", tri2: "9,1", tri3: null, total: "16,4", media: "8,2", faltas: [0, 0, 0] },
  { disciplina: "Redação e Leitura", tri1: "8,2", tri2: "8,6", tri3: null, total: "16,8", media: "8,4", faltas: [0, 0, 0] },
  { disciplina: "Pensamento Lógico", tri1: "10,0", tri2: "9,7", tri3: null, total: "19,7", media: "9,9", faltas: [0, 0, 0] },
  { disciplina: "Literatura Arte e Movimento", tri1: "7,3", tri2: "7,5", tri3: null, total: "14,8", media: "7,4", faltas: [0, 0, 0] },
  { disciplina: "Práticas Experimentais", tri1: "7,2", tri2: "8,8", tri3: null, total: "16,0", media: "8,0", faltas: [0, 0, 0] }
];

// Função para normalizar e converter notas
function normalizarNota(valor) {
  if (valor === null || valor === undefined || valor === "") return null;
  if (typeof valor === "number") return valor > 10 ? valor / 10 : valor;
  let texto = String(valor).replace(",", ".").trim();
  let num = parseFloat(texto);
  if (isNaN(num)) return null;
  return num > 10 ? num / 10 : num;
}

// Formatação para exibição no HTML
function formatarExibicao(valor) {
  if (valor === null || valor === undefined || valor === "") return "—";
  return String(valor);
}

// Renderiza a tabela e atualiza os cards de resumo
function renderizarBoletim() {
  const tbody = document.getElementById("corpo-tabela");
  if (!tbody) return;
  tbody.innerHTML = "";

  let somaMedias = 0;
  let totalDisciplinas = dadosDisciplinas.length;
  let aprovadas = 0;
  let atencao = 0;
  let totalFaltasGeral = 0;

  dadosDisciplinas.forEach(item => {
    // Converte a média em número para o cálculo dos cards
    let medNum = parseFloat(item.media.replace(",", "."));
    somaMedias += medNum;

    if (medNum >= 6.0) {
      aprovadas++;
    } else {
      atencao++;
    }

    const totalFaltas = item.faltas.reduce((a, b) => a + b, 0);
    totalFaltasGeral += totalFaltas;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.disciplina}</td>
      <td>${formatarExibicao(item.tri1)}</td>
      <td>${formatarExibicao(item.tri2)}</td>
      <td>${formatarExibicao(item.tri3)}</td>
      <td><strong>${item.media}</strong></td>
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
    // Média Geral baseada no acumulado dos 15 componentes curriculares
    let mediaGeral = (somaMedias / totalDisciplinas).toFixed(1).replace(".", ",");
    mediaGeralEl.innerText = mediaGeral;
  }
  if (aprovadasEl) aprovadasEl.innerText = aprovadas;
  if (atencaoEl) atencaoEl.innerText = atencao;
  if (faltasEl) faltasEl.innerText = totalFaltasGeral;
}

document.addEventListener("DOMContentLoaded", renderizarBoletim);