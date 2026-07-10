// produtos.js — filtros, ordenação e leitura de parâmetros da URL

function lerFiltrosAtivos() {
  const categorias = Array.from(document.querySelectorAll('input[name="categoria"]:checked')).map(el => el.value);
  const cores = Array.from(document.querySelectorAll('input[name="cor"]:checked')).map(el => el.value);
  const precoSelecionado = document.querySelector('input[name="preco"]:checked')?.value || "all";
  const somentePromo = document.getElementById("filtro-promo").checked;
  const somenteNovo = document.getElementById("filtro-novo").checked;

  return { categorias, cores, precoSelecionado, somentePromo, somenteNovo };
}

function aplicarFiltros(produtos, filtros) {
  return produtos.filter(p => {
    if (filtros.categorias.length && !filtros.categorias.includes(p.categoria)) return false;
    if (filtros.cores.length && !filtros.cores.includes(p.cor)) return false;
    if (filtros.somentePromo && !p.precoPromo) return false;
    if (filtros.somenteNovo && !p.novo) return false;

    if (filtros.precoSelecionado !== "all") {
      const [min, max] = filtros.precoSelecionado.split("-").map(Number);
      const precoFinal = p.precoPromo ?? p.preco;
      if (precoFinal < min || precoFinal > max) return false;
    }
    return true;
  });
}

function ordenarProdutos(produtos, criterio) {
  const lista = [...produtos];
  const preco = p => p.precoPromo ?? p.preco;

  switch (criterio) {
    case "menor-preco":
      return lista.sort((a, b) => preco(a) - preco(b));
    case "maior-preco":
      return lista.sort((a, b) => preco(b) - preco(a));
    case "avaliacao":
      return lista.sort((a, b) => b.avaliacao - a.avaliacao);
    default:
      return lista;
  }
}

function atualizarResultados() {
  const filtros = lerFiltrosAtivos();
  let lista = aplicarFiltros(PRODUCTS, filtros);
  lista = ordenarProdutos(lista, document.getElementById("ordenar").value);

  renderizarGrid("grid-catalogo", lista);
  document.getElementById("contador-resultados").textContent =
    `${lista.length} produto${lista.length !== 1 ? "s" : ""}`;
}

function aplicarFiltrosDaURL() {
  const params = new URLSearchParams(window.location.search);

  const categoria = params.get("categoria");
  if (categoria) {
    const checkbox = document.querySelector(`input[name="categoria"][value="${categoria}"]`);
    if (checkbox) checkbox.checked = true;
    document.getElementById("titulo-catalogo").textContent =
      categoria === "masculino" ? "Coleção Masculina" : "Coleção Feminina";
  }

  if (params.get("promo") === "1") {
    document.getElementById("filtro-promo").checked = true;
    document.getElementById("titulo-catalogo").textContent = "Promoções";
  }

  if (params.get("novo") === "1") {
    document.getElementById("filtro-novo").checked = true;
    document.getElementById("titulo-catalogo").textContent = "Lançamentos";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  aplicarFiltrosDaURL();
  atualizarResultados();

  document.querySelectorAll('.filtros input').forEach(input => {
    input.addEventListener("change", atualizarResultados);
  });
  document.getElementById("ordenar").addEventListener("change", atualizarResultados);

  document.getElementById("btn-limpar-filtros").addEventListener("click", () => {
    document.querySelectorAll('.filtros input[type="checkbox"]').forEach(el => el.checked = false);
    document.querySelector('input[name="preco"][value="all"]').checked = true;
    document.getElementById("titulo-catalogo").textContent = "Todas as peças";
    atualizarResultados();
  });
});
