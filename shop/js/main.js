// main.js — lógica específica da Home

document.addEventListener("DOMContentLoaded", () => {
  const maisVendidos = PRODUCTS.filter(p => p.maisVendido).slice(0, 4);
  const novos = PRODUCTS.filter(p => p.novo).slice(0, 4);

  renderizarGrid("grid-mais-vendidos", maisVendidos);
  renderizarGrid("grid-novos", novos);

  observarReveal();
});
