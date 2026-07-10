// cart.js — carrinho lateral compartilhado entre todas as páginas
// Persiste em localStorage sob a chave "carrinho"

const CART_KEY = "carrinho";

function lerCarrinho() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Erro ao ler carrinho:", e);
    return [];
  }
}

function salvarCarrinho(itens) {
  localStorage.setItem(CART_KEY, JSON.stringify(itens));
  atualizarContadorCarrinho();
}

function adicionarAoCarrinho(produto, tamanho, quantidade = 1) {
  const itens = lerCarrinho();
  const precoUnit = produto.precoPromo ?? produto.preco;

  const existente = itens.find(
    item => item.id === produto.id && item.tamanho === tamanho
  );

  if (existente) {
    existente.quantidade += quantidade;
  } else {
    itens.push({
      id: produto.id,
      nome: produto.nome,
      corHex: produto.corHex,
      preco: precoUnit,
      tamanho,
      quantidade
    });
  }

  salvarCarrinho(itens);
  abrirCarrinho();
}

function removerDoCarrinho(id, tamanho) {
  let itens = lerCarrinho();
  itens = itens.filter(item => !(item.id === id && item.tamanho === tamanho));
  salvarCarrinho(itens);
  renderizarCarrinho();
}

function atualizarQuantidade(id, tamanho, delta) {
  const itens = lerCarrinho();
  const item = itens.find(i => i.id === id && i.tamanho === tamanho);
  if (!item) return;
  item.quantidade += delta;
  if (item.quantidade <= 0) {
    removerDoCarrinho(id, tamanho);
    return;
  }
  salvarCarrinho(itens);
  renderizarCarrinho();
}

function calcularSubtotal(itens) {
  return itens.reduce((soma, item) => soma + item.preco * item.quantidade, 0);
}

function atualizarContadorCarrinho() {
  const contador = document.getElementById("carrinho-contador");
  if (!contador) return;
  const itens = lerCarrinho();
  const total = itens.reduce((soma, item) => soma + item.quantidade, 0);
  contador.textContent = total;
  contador.style.display = total > 0 ? "flex" : "none";
}

function renderizarCarrinho() {
  const lista = document.getElementById("carrinho-lista");
  const vazio = document.getElementById("carrinho-vazio");
  const subtotalEl = document.getElementById("carrinho-subtotal");
  if (!lista) return;

  const itens = lerCarrinho();
  lista.innerHTML = "";

  if (itens.length === 0) {
    vazio.style.display = "block";
    subtotalEl.textContent = formatarPreco(0);
    return;
  }

  vazio.style.display = "none";

  itens.forEach(item => {
    const linha = document.createElement("div");
    linha.className = "carrinho-item";
    linha.innerHTML = `
      <div class="carrinho-item-swatch" style="background:${item.corHex}"></div>
      <div class="carrinho-item-info">
        <p class="carrinho-item-nome">${item.nome}</p>
        <p class="carrinho-item-meta">Tam. ${item.tamanho} · ${formatarPreco(item.preco)}</p>
        <div class="carrinho-item-qtd">
          <button class="qtd-btn" data-acao="menos">−</button>
          <span>${item.quantidade}</span>
          <button class="qtd-btn" data-acao="mais">+</button>
          <button class="carrinho-item-remover" data-acao="remover">Remover</button>
        </div>
      </div>
    `;
    linha.querySelector('[data-acao="menos"]').addEventListener("click", () =>
      atualizarQuantidade(item.id, item.tamanho, -1)
    );
    linha.querySelector('[data-acao="mais"]').addEventListener("click", () =>
      atualizarQuantidade(item.id, item.tamanho, 1)
    );
    linha.querySelector('[data-acao="remover"]').addEventListener("click", () =>
      removerDoCarrinho(item.id, item.tamanho)
    );
    lista.appendChild(linha);
  });

  subtotalEl.textContent = formatarPreco(calcularSubtotal(itens));
}

function abrirCarrinho() {
  const drawer = document.getElementById("carrinho-drawer");
  const overlay = document.getElementById("carrinho-overlay");
  if (!drawer) return;
  renderizarCarrinho();
  drawer.classList.add("aberto");
  overlay.classList.add("aberto");
  document.body.style.overflow = "hidden";
}

function fecharCarrinho() {
  const drawer = document.getElementById("carrinho-drawer");
  const overlay = document.getElementById("carrinho-overlay");
  if (!drawer) return;
  drawer.classList.remove("aberto");
  overlay.classList.remove("aberto");
  document.body.style.overflow = "";
}

document.addEventListener("DOMContentLoaded", () => {
  atualizarContadorCarrinho();

  const btnAbrir = document.getElementById("btn-abrir-carrinho");
  const btnFechar = document.getElementById("btn-fechar-carrinho");
  const overlay = document.getElementById("carrinho-overlay");

  if (btnAbrir) btnAbrir.addEventListener("click", abrirCarrinho);
  if (btnFechar) btnFechar.addEventListener("click", fecharCarrinho);
  if (overlay) overlay.addEventListener("click", fecharCarrinho);
});
