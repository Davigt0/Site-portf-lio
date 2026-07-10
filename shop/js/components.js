// components.js — card de produto reutilizado em Home e Catálogo

const FAV_KEY = "favoritos";

function lerFavoritos() {
  try {
    const raw = localStorage.getItem(FAV_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function alternarFavorito(id) {
  let favoritos = lerFavoritos();
  if (favoritos.includes(id)) {
    favoritos = favoritos.filter(f => f !== id);
  } else {
    favoritos.push(id);
  }
  localStorage.setItem(FAV_KEY, JSON.stringify(favoritos));
  return favoritos.includes(id);
}

// Converte hex para luminância relativa (0 escuro — 1 claro), usada para
// decidir se o traço/dobra da ilustração deve ser clara ou escura.
function luminanciaHex(hex) {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16) / 255;
  const g = parseInt(c.substring(2, 4), 16) / 255;
  const b = parseInt(c.substring(4, 6), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Ilustração vetorial própria (sem fotos de terceiros) de cada tipo de peça,
// preenchida com a cor real do produto. viewBox padrão 0 0 200 240.
function ilustracaoRoupa(tipo, corHex) {
  const claro = luminanciaHex(corHex) > 0.55;
  const traco = claro ? "rgba(22,20,15,0.32)" : "rgba(255,255,255,0.38)";
  const dobra = claro ? "rgba(22,20,15,0.16)" : "rgba(255,255,255,0.20)";

  const formas = {
    camisa: `
      <path d="M70 48 L100 66 L130 48 L162 62 L150 96 L134 84 L134 218 L66 218 L66 84 L50 96 L38 62 Z" fill="${corHex}" stroke="${traco}" stroke-width="2"/>
      <path d="M88 48 L100 62 L112 48 L104 44 L100 52 L96 44 Z" fill="${dobra}"/>
      <line x1="100" y1="66" x2="100" y2="214" stroke="${traco}" stroke-width="1.5" stroke-dasharray="4 5"/>
    `,
    camiseta: `
      <path d="M72 46 L100 60 L128 46 L158 60 L148 92 L132 82 L132 216 L68 216 L68 82 L52 92 L42 60 Z" fill="${corHex}" stroke="${traco}" stroke-width="2"/>
      <path d="M86 46 Q100 62 114 46" fill="none" stroke="${dobra}" stroke-width="3"/>
    `,
    casaco: `
      <path d="M62 52 L100 40 L138 52 L166 70 L154 108 L136 94 L136 226 L64 226 L64 94 L46 108 L34 70 Z" fill="${corHex}" stroke="${traco}" stroke-width="2"/>
      <path d="M100 40 L82 70 L92 226" fill="none" stroke="${dobra}" stroke-width="2.5"/>
      <path d="M100 40 L118 70 L108 226" fill="none" stroke="${dobra}" stroke-width="2.5"/>
      <circle cx="100" cy="130" r="3" fill="${traco}"/>
      <circle cx="100" cy="160" r="3" fill="${traco}"/>
      <circle cx="100" cy="190" r="3" fill="${traco}"/>
    `,
    blazer: `
      <path d="M60 50 L100 36 L140 50 L168 68 L156 106 L138 92 L138 228 L62 228 L62 92 L44 106 L32 68 Z" fill="${corHex}" stroke="${traco}" stroke-width="2"/>
      <path d="M100 36 L78 76 L96 228" fill="none" stroke="${dobra}" stroke-width="2.5"/>
      <path d="M100 36 L122 76 L104 228" fill="none" stroke="${dobra}" stroke-width="2.5"/>
      <path d="M78 76 L100 96 L122 76" fill="none" stroke="${traco}" stroke-width="2"/>
    `,
    cardiga: `
      <path d="M64 54 L100 42 L136 54 L162 72 L150 106 L134 94 L134 224 L100 224 L100 78 L66 94 L50 106 L36 72 Z" fill="${corHex}" stroke="${traco}" stroke-width="2"/>
      <path d="M136 54 L100 78 L100 224 L166 224 L166 72 Z" fill="${corHex}" stroke="${traco}" stroke-width="2" opacity="0.001"/>
      <path d="M134 94 L134 224 L166 224 L166 72 L150 106 Z" fill="${corHex}" stroke="${traco}" stroke-width="2"/>
      <line x1="100" y1="90" x2="100" y2="220" stroke="${dobra}" stroke-width="1.5" stroke-dasharray="3 5"/>
      <circle cx="100" cy="120" r="2.6" fill="${traco}"/>
      <circle cx="100" cy="150" r="2.6" fill="${traco}"/>
      <circle cx="100" cy="180" r="2.6" fill="${traco}"/>
    `,
    vestido: `
      <path d="M78 46 L100 58 L122 46 L128 108 L116 108 L150 224 L50 224 L84 108 L72 108 Z" fill="${corHex}" stroke="${traco}" stroke-width="2"/>
      <line x1="82" y1="46" x2="76" y2="30" stroke="${traco}" stroke-width="2"/>
      <line x1="118" y1="46" x2="124" y2="30" stroke="${traco}" stroke-width="2"/>
      <path d="M85 108 Q100 118 115 108" fill="none" stroke="${dobra}" stroke-width="2"/>
    `,
    saia: `
      <rect x="68" y="50" width="64" height="18" rx="2" fill="${corHex}" stroke="${traco}" stroke-width="2"/>
      <path d="M68 68 L132 68 L156 214 L44 214 Z" fill="${corHex}" stroke="${traco}" stroke-width="2"/>
      <line x1="88" y1="80" x2="70" y2="210" stroke="${dobra}" stroke-width="1.5"/>
      <line x1="100" y1="80" x2="100" y2="212" stroke="${dobra}" stroke-width="1.5"/>
      <line x1="112" y1="80" x2="130" y2="210" stroke="${dobra}" stroke-width="1.5"/>
    `,
    calca: `
      <rect x="62" y="42" width="76" height="16" rx="2" fill="${corHex}" stroke="${traco}" stroke-width="2"/>
      <path d="M62 58 L98 58 L94 226 L70 226 L64 130 Z" fill="${corHex}" stroke="${traco}" stroke-width="2"/>
      <path d="M138 58 L102 58 L106 226 L130 226 L136 130 Z" fill="${corHex}" stroke="${traco}" stroke-width="2"/>
      <line x1="100" y1="58" x2="100" y2="110" stroke="${dobra}" stroke-width="2"/>
    `,
    bermuda: `
      <rect x="64" y="46" width="72" height="16" rx="2" fill="${corHex}" stroke="${traco}" stroke-width="2"/>
      <path d="M64 62 L98 62 L94 148 L70 148 L66 100 Z" fill="${corHex}" stroke="${traco}" stroke-width="2"/>
      <path d="M136 62 L102 62 L106 148 L130 148 L134 100 Z" fill="${corHex}" stroke="${traco}" stroke-width="2"/>
      <line x1="100" y1="62" x2="100" y2="105" stroke="${dobra}" stroke-width="2"/>
    `
  };

  const forma = formas[tipo] || formas.camisa;

  return `<svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ilustração de ${tipo}">${forma}</svg>`;
}

function criarCardProduto(produto) {
  const favoritos = lerFavoritos();
  const ehFavorito = favoritos.includes(produto.id);
  const precoFinal = produto.precoPromo ?? produto.preco;

  const card = document.createElement("article");
  card.className = "product-card reveal";
  card.innerHTML = `
    <a href="produto.html?id=${produto.id}" class="product-media">
      <div class="garment-illustration">${ilustracaoRoupa(produto.tipo, produto.corHex)}</div>
      <div class="badge-row">
        ${produto.novo ? '<span class="badge badge-novo">Novo</span>' : ""}
        ${produto.precoPromo ? '<span class="badge badge-promo">Promoção</span>' : ""}
      </div>
      <div class="product-corner-tag">${produto.tecido}</div>
      <button class="product-fav ${ehFavorito ? "ativo" : ""}" data-fav-id="${produto.id}" aria-label="Favoritar" type="button">
        <svg viewBox="0 0 24 24" stroke-width="1.5"><path d="M12 21s-7.5-4.6-10-9.3C.5 8 2 4 6 4c2.2 0 3.8 1.3 6 3.5C14.2 5.3 15.8 4 18 4c4 0 5.5 4 4 7.7C19.5 16.4 12 21 12 21z"/></svg>
      </button>
    </a>
    <div class="product-info">
      <p class="categoria-label">${produto.categoria}</p>
      <a href="produto.html?id=${produto.id}"><h3>${produto.nome}</h3></a>
      <div class="product-price">
        <span class="price-atual">${formatarPreco(precoFinal)}</span>
        ${produto.precoPromo ? `<span class="price-riscado">${formatarPreco(produto.preco)}</span>` : ""}
      </div>
    </div>
  `;

  card.querySelector("[data-fav-id]").addEventListener("click", (e) => {
    e.preventDefault();
    const ativo = alternarFavorito(produto.id);
    e.currentTarget.classList.toggle("ativo", ativo);
  });

  return card;
}

function renderizarGrid(containerId, listaProdutos) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = "";
  if (listaProdutos.length === 0) {
    container.innerHTML = `<p class="grid-vazio">Nenhum produto encontrado com esses filtros.</p>`;
    return;
  }
  listaProdutos.forEach(p => container.appendChild(criarCardProduto(p)));
  observarReveal();
}

function observarReveal() {
  const els = document.querySelectorAll(".reveal:not(.observado)");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  els.forEach(el => {
    el.classList.add("observado");
    observer.observe(el);
  });
}
