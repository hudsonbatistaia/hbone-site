// Detalhes visuais: topo escurece ao rolar e as seções aparecem suavemente.
// Sem JavaScript a página funciona igual, só sem as animações.
document.documentElement.classList.add('js');

// Topo escurece depois de rolar 20px. Usa um marcador invisível em vez de ler
// a posição da rolagem, para não forçar o navegador a recalcular a página.
const topo = document.querySelector('.topo');
const marcador = document.createElement('div');
marcador.style.cssText = 'position:absolute;top:20px;left:0;width:1px;height:1px;pointer-events:none';
marcador.setAttribute('aria-hidden', 'true');
document.body.prepend(marcador);
if ('IntersectionObserver' in window) {
  new IntersectionObserver(([e]) => topo.classList.toggle('rolou', !e.isIntersecting)).observe(marcador);
} else {
  topo.classList.add('rolou');
}

// Serviços e diferenciais: a luz do cartão segue o mouse
for (const cartao of document.querySelectorAll('.cartao, .produto, .motivos li')) {
  cartao.addEventListener('pointermove', (e) => {
    const caixa = cartao.getBoundingClientRect();
    cartao.style.setProperty('--x', `${e.clientX - caixa.left}px`);
    cartao.style.setProperty('--y', `${e.clientY - caixa.top}px`);
  });
}

// Menu: acende o link da seção que está no meio da tela
const linksMenu = [...document.querySelectorAll('.topo nav a:not(.topo__contato)')];
if ('IntersectionObserver' in window && linksMenu.length) {
  const visiveis = new Set();
  const atualizarMenu = () => {
    for (const link of linksMenu) link.classList.toggle('atual', visiveis.has(link.hash.slice(1)));
  };
  const espiao = new IntersectionObserver((entradas) => {
    for (const e of entradas) e.isIntersecting ? visiveis.add(e.target.id) : visiveis.delete(e.target.id);
    atualizarMenu();
  }, { rootMargin: '-45% 0px -50% 0px' });
  for (const link of linksMenu) {
    const secao = document.querySelector(link.hash);
    if (secao) espiao.observe(secao);
  }
}

// Botões de e-mail: além de abrir o programa de e-mail, copiam o endereço
// (muita gente não tem programa de e-mail configurado no computador)
const aviso = document.querySelector('.aviso');
let tempoAviso;
const mostrarAviso = (texto) => {
  aviso.textContent = texto;
  aviso.classList.add('aviso--visivel');
  clearTimeout(tempoAviso);
  tempoAviso = setTimeout(() => aviso.classList.remove('aviso--visivel'), 4500);
};
for (const botao of document.querySelectorAll('[data-copiar]')) {
  botao.addEventListener('click', async () => {
    const email = botao.dataset.copiar;
    try {
      await navigator.clipboard.writeText(email);
      mostrarAviso(`E-mail copiado: ${email}`);
    } catch {
      mostrarAviso(`Nosso e-mail: ${email}`);
    }
  });
}

const itens = document.querySelectorAll('.revelar');
if ('IntersectionObserver' in window) {
  const observador = new IntersectionObserver((entradas) => {
    for (const entrada of entradas) {
      if (!entrada.isIntersecting) continue;
      entrada.target.classList.add('visivel');
      // depois de aparecer, o atraso não pode deixar o passar do mouse lento
      setTimeout(() => { entrada.target.style.transitionDelay = ''; }, 1200);
      observador.unobserve(entrada.target);
    }
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  // Linha dos passos: desenha e acende os números quando a seção aparece
  const passos = document.querySelector('.passos');
  if (passos) {
    new IntersectionObserver(([entrada], obs) => {
      if (!entrada.isIntersecting) return;
      passos.classList.add('ativo');
      obs.disconnect();
    }, { threshold: 0.4 }).observe(passos);
  }

  // Pausa as animações que repetem sem parar enquanto estão fora da tela
  const vigia = new IntersectionObserver((entradas) => {
    for (const e of entradas) e.target.classList.toggle('pausado', !e.isIntersecting);
  });
  document.querySelectorAll('.abertura, .cartoes, .produtos, .passos, .contato').forEach((el) => vigia.observe(el));

  itens.forEach((item, i) => {
    item.style.transitionDelay = `${(i % 4) * 80}ms`;
    observador.observe(item);
  });
} else {
  itens.forEach((item) => item.classList.add('visivel'));
}
