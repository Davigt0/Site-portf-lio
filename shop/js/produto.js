// produto.js — monta a página de produto a partir do parâmetro ?id= da URL

function renderEstrelas(nota) {
  const cheias = Math.round(nota);
  return "★".repeat(cheias) + "☆".repeat(5 - cheias);
}

function montarPaginaProduto() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const produto = getProdutoPorId(id);
  const container = document.getElementById("produto-container");

  if (!produto) {
    container.innerHTML = `
      <div class="produto-nao-encontrado">
        <h2>Produto não encontrado</h2>
        <p>O item que você procura não existe ou foi removido.</p>
        <a href="produtos.html" class="btn btn-primary">Voltar ao catálogo</a>
      </div>`;
    return;
  }

  document.getElementById("titulo-pagina").textContent = `${produto.nome} — OSSO`;
  document.getElementById("breadcrumb").innerHTML = `
    <a href="index.html">Home</a> / <a href="produtos.html?categoria=${produto.categoria}">${produto.categoria === "masculino" ? "Masculino" : "Feminino"}</a> / ${produto.nome}
  `;

  const precoFinal = produto.precoPromo ?? produto.preco;
  const favoritos = lerFavoritos();
  const ehFavorito = favoritos.includes(produto.id);

  container.innerHTML = `
    <div class="galeria">
      <div class="galeria-principal">
        <div class="garment-illustration">${ilustracaoRoupa(produto.tipo, produto.corHex)}</div>
        <span class="galeria-zoom-hint">🔍 Passe o mouse para dar zoom</span>
      </div>
      <div class="galeria-thumbs">
        ${[0, 1, 2, 3].map((i) => `
          <div class="galeria-thumb ${i === 0 ? "ativo" : ""}" data-thumb="${i}">
            <div class="garment-illustration" style="opacity:${1 - i * 0.14}">${ilustracaoRoupa(produto.tipo, produto.corHex)}</div>
          </div>`).join("")}
      </div>
    </div>

    <div class="produto-info-principal">
      <p class="categoria-label">${produto.categoria} · ${produto.cor}</p>
      <h1>${produto.nome}</h1>

      <div class="produto-avaliacao">
        <span class="estrelas">${renderEstrelas(produto.avaliacao)}</span>
        <span>${produto.avaliacao} (${produto.numAvaliacoes} avaliações)</span>
      </div>

      <div class="produto-preco-bloco">
        <span class="price-atual">${formatarPreco(precoFinal)}</span>
        ${produto.precoPromo ? `<span class="price-riscado">${formatarPreco(produto.preco)}</span>` : ""}
      </div>
      <p class="parcelamento">até 6x de ${formatarPreco(precoFinal / 6)} sem juros</p>

      <p class="produto-descricao">${produto.descricao}</p>

      <div class="selecao-grupo">
        <h4><span>Tamanho</span><a href="#" onclick="alert('Guia de tamanhos simulado.'); return false;">Guia de tamanhos</a></h4>
        <div class="tamanhos-lista" id="lista-tamanhos">
          ${produto.tamanhos.map((t, i) => `<button class="tamanho-btn ${i === 0 ? "selecionado" : ""}" data-tamanho="${t}">${t}</button>`).join("")}
        </div>
      </div>

      <div class="tecido-info">🧵 Composição: ${produto.tecido}</div>

      <div class="selecao-grupo">
        <h4>Quantidade</h4>
        <div class="qtd-seletor">
          <button class="qtd-btn" id="qtd-menos">−</button>
          <span id="qtd-valor">1</span>
          <button class="qtd-btn" id="qtd-mais">+</button>
        </div>
      </div>

      <div class="acoes-produto">
        <button id="btn-add-carrinho" class="btn btn-primary">Adicionar ao carrinho</button>
        <button id="btn-fav-produto" class="btn-fav-produto ${ehFavorito ? "ativo" : ""}" aria-label="Favoritar">
          <svg viewBox="0 0 24 24" stroke-width="1.5"><path d="M12 21s-7.5-4.6-10-9.3C.5 8 2 4 6 4c2.2 0 3.8 1.3 6 3.5C14.2 5.3 15.8 4 18 4c4 0 5.5 4 4 7.7C19.5 16.4 12 21 12 21z"/></svg>
        </button>
      </div>

      <div class="compartilhar">
        <span>Compartilhar:</span>
        <div class="compartilhar-icones">
          <button onclick="alert('Compartilhamento simulado — WhatsApp')">W</button>
          <button onclick="alert('Compartilhamento simulado — Instagram')">I</button>
          <button onclick="alert('Compartilhamento simulado — Copiar link')">🔗</button>
        </div>
      </div>
    </div>
  `;

  document.querySelectorAll(".galeria-thumb").forEach(thumb => {
    thumb.addEventListener("click", () => {
      document.querySelectorAll(".galeria-thumb").forEach(t => t.classList.remove("ativo"));
      thumb.classList.add("ativo");
    });
  });

  let tamanhoSelecionado = produto.tamanhos[0];
  let quantidade = 1;

  document.querySelectorAll(".tamanho-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tamanho-btn").forEach(b => b.classList.remove("selecionado"));
      btn.classList.add("selecionado");
      tamanhoSelecionado = btn.dataset.tamanho;
    });
  });

  document.getElementById("qtd-mais").addEventListener("click", () => {
    quantidade++;
    document.getElementById("qtd-valor").textContent = quantidade;
  });
  document.getElementById("qtd-menos").addEventListener("click", () => {
    if (quantidade <= 1) return;
    quantidade--;
    document.getElementById("qtd-valor").textContent = quantidade;
  });

  document.getElementById("btn-add-carrinho").addEventListener("click", () => {
    adicionarAoCarrinho(produto, tamanhoSelecionado, quantidade);
  });

  document.getElementById("btn-fav-produto").addEventListener("click", (e) => {
    const ativo = alternarFavorito(produto.id);
    e.currentTarget.classList.toggle("ativo", ativo);
  });

  renderizarGrid("grid-relacionados", getProdutosRelacionados(produto));
}

document.addEventListener("DOMContentLoaded", montarPaginaProduto);
