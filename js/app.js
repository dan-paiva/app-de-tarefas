/* ============================================================
   APP DE TAREFAS — js/app.js

   Como o programa funciona, em resumo:
   1. Guardamos as tarefas numa lista (array) chamada `tarefas`.
   2. Cada tarefa é um objeto: { id, texto, concluida }.
   3. Sempre que a lista muda, chamamos `renderizar()` para
      redesenhar a tela e `salvarTarefas()` para gravar no navegador.
   ============================================================ */

/* ===== ESTADO =====
   "Estado" são os dados que o app precisa lembrar enquanto roda. */
let tarefas = [];          // a lista de tarefas
let filtroAtual = "todas"; // pode ser: "todas", "ativas" ou "concluidas"

/* ===== ELEMENTOS DA PÁGINA =====
   Pegamos referências aos elementos do HTML para poder usá-los. */
const form = document.getElementById("form-tarefa");
const input = document.getElementById("input-tarefa");
const lista = document.getElementById("lista-tarefas");
const contador = document.getElementById("contador");
const botoesFiltro = document.querySelectorAll(".filtro");
const botaoLimpar = document.getElementById("limpar-concluidas");


/* ============================================================
   FUNÇÕES PRONTAS — já implementadas para você (estude-as!)
   ============================================================ */

/* Grava a lista de tarefas no navegador, para não perder ao recarregar.
   O localStorage só guarda texto, então convertemos com JSON.stringify. */
function salvarTarefas() {
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

/* Lê as tarefas salvas no navegador quando o app abre. */
function carregarTarefas() {
  const salvas = localStorage.getItem("tarefas");
  if (salvas) {
    tarefas = JSON.parse(salvas); // converte o texto de volta para array
  }
}

/* Decide quais tarefas mostrar, conforme o filtro selecionado. */
function tarefasFiltradas() {
  if (filtroAtual === "ativas") {
    return tarefas.filter((t) => !t.concluida);
  }
  if (filtroAtual === "concluidas") {
    return tarefas.filter((t) => t.concluida);
  }
  return tarefas; // "todas"
}

/* Desenha a lista de tarefas na tela. É chamada toda vez que algo muda. */
function renderizar() {
  lista.innerHTML = ""; // limpa a lista antes de redesenhar

  const visiveis = tarefasFiltradas();

  if (visiveis.length === 0) {
    lista.innerHTML = '<li class="vazio">Nenhuma tarefa por aqui 🎉</li>';
  }

  visiveis.forEach((tarefa) => {
    const li = document.createElement("li");
    li.className = "tarefa" + (tarefa.concluida ? " concluida" : "");

    // Caixinha de marcar (checkbox)
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = tarefa.concluida;
    checkbox.addEventListener("change", () => alternarTarefa(tarefa.id));

    // Texto da tarefa
    const span = document.createElement("span");
    span.textContent = tarefa.texto;

    // Botão de remover
    const botao = document.createElement("button");
    botao.textContent = "✕";
    botao.addEventListener("click", () => removerTarefa(tarefa.id));

    li.append(checkbox, span, botao);
    lista.appendChild(li);
  });

  // Atualiza o contador de tarefas que ainda faltam
  const restantes = tarefas.filter((t) => !t.concluida).length;
  contador.textContent =
    restantes === 1 ? "1 tarefa restante" : `${restantes} tarefas restantes`;

  salvarTarefas(); // grava o estado atual no navegador
}

/* Remove todas as tarefas já concluídas. */
function limparConcluidas() {
  tarefas = tarefas.filter((t) => !t.concluida);
  renderizar();
}


/* ============================================================
   AÇÕES — as operações que mudam a lista de tarefas (criar,
   alternar e remover). Toda ação termina chamando renderizar().
   ============================================================ */

/* Cria uma tarefa nova a partir de um texto e a adiciona à lista.
   - id: Date.now() devolve um número único baseado na hora atual.
   - concluida: começa como false (tarefa recém-criada não foi feita). */
function adicionarTarefa(texto) {
  const novaTarefa = {
    id: Date.now(),
    texto: texto,
    concluida: false,
  };
  tarefas.push(novaTarefa);
  renderizar();
}

/* Marca/desmarca uma tarefa como concluída.
   .find() localiza a tarefa pelo id; o operador ! inverte o valor. */
function alternarTarefa(id) {
  const tarefa = tarefas.find((t) => t.id === id);
  if (tarefa) {
    tarefa.concluida = !tarefa.concluida;
    renderizar();
  }
}

/* Remove uma tarefa da lista.
   .filter() cria uma nova lista mantendo só as tarefas com id diferente. */
function removerTarefa(id) {
  tarefas = tarefas.filter((t) => t.id !== id);
  renderizar();
}


/* ============================================================
   EVENTOS — ligam as ações do usuário às funções acima.
   (Esta parte já está pronta.)
   ============================================================ */

/* Quando o usuário envia o formulário (clica em "Adicionar" ou tecla Enter). */
form.addEventListener("submit", (evento) => {
  evento.preventDefault(); // impede a página de recarregar
  const texto = input.value.trim(); // .trim() remove espaços das pontas
  if (texto !== "") {
    adicionarTarefa(texto);
    input.value = ""; // limpa o campo de digitação
  }
});

/* Quando o usuário clica em um botão de filtro. */
botoesFiltro.forEach((botao) => {
  botao.addEventListener("click", () => {
    filtroAtual = botao.dataset.filtro; // lê o atributo data-filtro do HTML
    botoesFiltro.forEach((b) => b.classList.remove("ativo"));
    botao.classList.add("ativo");
    renderizar();
  });
});

/* Quando o usuário clica em "Limpar concluídas". */
botaoLimpar.addEventListener("click", limparConcluidas);


/* ===== INÍCIO =====
   Ao abrir a página: carrega o que estava salvo e desenha a tela. */
carregarTarefas();
renderizar();
