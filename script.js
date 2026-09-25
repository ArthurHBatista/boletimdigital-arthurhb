// DADOS FICTÍCIOS PADRONIZADOS - 8º ANO
const dadosDisciplinas = [
  { disciplina: "Língua Portuguesa", tri1: 82, tri2: "7,8", tri3: 85, faltas: [2, 1, 1] },
  { disciplina: "Matemática", tri1: 52, tri2: "5,8", tri3: null, faltas: [3, 2, 1] },
  { disciplina: "Ciências", tri1: "8,1", tri2: 76, tri3: 8.0, faltas: [1, 2, 0] },
  { disciplina: "História", tri1: 7.0, tri2: 84, tri3: null, faltas: [1, 1, 1] },
  { disciplina: "Geografia", tri1: 68, tri2: 7.3, tri3: "7,9", faltas: [0, 1, 1] },
  { disciplina: "Língua Inglesa", tri1: 86, tri2: "8,1", tri3: 8.7, faltas: [1, 0, 0] },
  { disciplina: "Arte", tri1: 9.0, tri2: 92, tri3: null, faltas: [1, 1, 0] },
  { disciplina: "Educação Física", tri1: 95, tri2: 9.0, tri3: "9,4", faltas: [0, 1, 0] },
  { disciplina: "Educação Digital", tri1: 88, tri2: 9.1, tri3: 93, faltas: [1, 0, 1] },
  { disciplina: "Educação Financeira", tri1: 74, tri2: "7,8", tri3: null, faltas: [1, 1, 1] },
  { disciplina: "Estudo Orientado", tri1: 8.0, tri2: 83, tri3: "8,5", faltas: [0, 1, 0] },
  { disciplina: "Redação e Leitura", tri1: 62, tri2: "6,8", tri3: null, faltas: [2, 1, 1] },
  { disciplina: "Pensamento Lógico", tri1: 48, tri2: 5.6, tri3: "6,0", faltas: [2, 2, 1] },
  { disciplina: "Literatura Arte e Movimento", tri1: "7,7", tri2: 80, tri3: null, faltas: [1, 0, 1] },
  { disciplina: "Práticas Experimentais", tri1: 58, tri2: "6,2", tri3: 6.4, faltas: [1, 1, 1] }
];

// NOTA: A frequência abaixo de 92% é APENAS FICTÍCIA/DEMONSTRATIVA para esta etapa.
// Ela não é calculada a partir das faltas e será tratada de outra forma no futuro.

// Função para normalizar qualquer formato de nota para a escala de 0 a 10
function normalizarNota(valor) {
  if (valor === null || valor === undefined || valor === "") {
    return null; // Nota ainda não lançada
  }

  // Converte texto com vírgula para ponto (ex: "7,8" vira "7.8")
  if (typeof valor === "string") {
    valor = valor.replace(",", ".");
  }

  let num = Number(valor);

  // Se não for um número válido, descarta
  if (isNaN(num)) {
    return null;
  }

  // Regra: valores entre 0 e 10 continuam iguais
  if (num >= 0 && num <= 10) {
    return num;
  }

  // Regra: valores maiores que 10 e até 100 devem ser divididos por 10 (ex: 82 vira 8.2)
  if (num > 10 && num <= 100) {
    return num / 10;
  }

  // Valores fora dessas regras são inválidos
  return null;
}

// Função para formatar a exibição da nota na tabela
function formatarNotaExibicao(nota) {
  if (nota === null) {
    return "—";
  }
  return nota.toFixed(1).replace(".", ",");
}

// Função principal que processa os dados e constrói o boletim
function construirBoletim() {
  const corpoTabela = document.getElementById("corpo-tabela");
  corpoTabela.innerHTML = ""; // Limpa a tabela antes de preencher

  let somaMediasValidas = 0;
  let qtdDisciplinasComMedia = 0;
  let totalFaltasGeral = 0;
  let qtdBomDesempenho = 0;
  let qtdAtencao = 0;

  // Passa por cada disciplina da lista
  dadosDisciplinas.forEach(item => {
    // Normaliza as notas dos 3 trimestres
    const n1 = normalizarNota(item.tri1);
    const n2 = normalizarNota(item.tri2);
    const n3 = normalizarNota(item.tri3);

    // Soma as faltas dos trimestres
    const totalFaltasDisciplina = item.faltas.reduce((acc, curr) => acc + curr, 0);
    totalFaltasGeral += totalFaltasDisciplina;

    // Calcula a média ignorando notas ausentes (null)
    const notasValidas = [n1, n2, n3].filter(n => n !== null);
    let media = null;
    let situacaoTexto = "Nota ainda não disponível";
    let classeStatus = "status-indisponivel";

    if (notasValidas.length > 0) {
      const soma = notasValidas.reduce((acc, curr) => acc + curr, 0);
      media = soma / notasValidas.length;

      somaMediasValidas += media;
      qtdDisciplinasComMedia++;

      if (media >= 6.0) {
        situacaoTexto = "Bom desempenho";
        classeStatus = "status-bom";
        qtdBomDesempenho++;
      } else {
        situacaoTexto = "Atenção";
        classeStatus = "status-atencao";
        qtdAtencao++;
      }
    }

    // Cria a linha HTML da tabela
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${item.disciplina}</strong></td>
      <td>${formatarNotaExibicao(n1)}</td>
      <td>${formatarNotaExibicao(n2)}</td>
      <td>${formatarNotaExibicao(n3)}</td>
      <td><strong>${media !== null ? media.toFixed(1).replace(".", ",") : "—"}</strong></td>
      <td>${totalFaltasDisciplina}</td>
      <td class="${classeStatus}">${situacaoTexto}</td>
    `;

    corpoTabela.appendChild(tr);
  });

  // Atualiza os Cards de Resumo no topo
  const mediaGeralCalculada = qtdDisciplinasComMedia > 0 
    ? (somaMediasValidas / qtdDisciplinasComMedia).toFixed(1).replace(".", ",") 
    : "—";

  document.getElementById("media-geral").innerText = mediaGeralCalculada;
  document.getElementById("total-faltas").innerText = totalFaltasGeral;
  document.getElementById("qtd-bom-desempenho").innerText = qtdBomDesempenho;
  document.getElementById("qtd-atencao").innerText = qtdAtencao;
}

// Executa a função assim que a página carrega
construirBoletim();