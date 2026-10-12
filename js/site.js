// Detalhes visuais: topo escurece ao rolar e as seções aparecem suavemente.
// Sem JavaScript a página funciona igual, só sem as animações.
document.documentElement.classList.add('js');

const topo = document.querySelector('.topo');
const marcarTopo = () => topo.classList.toggle('rolou', window.scrollY > 20);
marcarTopo();
window.addEventListener('scroll', marcarTopo, { passive: true });

// Serviços e diferenciais: a luz do cartão segue o mouse
for (const cartao of document.querySelectorAll('.cartao, .motivos li')) {
  cartao.addEventListener('pointermove', (e) => {
    const caixa = cartao.getBoundingClientRect();
    cartao.style.setProperty('--x', `${e.clientX - caixa.left}px`);
    cartao.style.setProperty('--y', `${e.clientY - caixa.top}px`);
  });
}

// Botão "Copiar e-mail": útil quando o computador não tem programa de e-mail configurado
const copiar = document.querySelector('[data-copiar]');
const aviso = document.querySelector('.copiar__aviso');
if (copiar && navigator.clipboard) {
  copiar.hidden = false;
  copiar.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(copiar.dataset.copiar);
      aviso.textContent = 'E-mail copiado! É só colar no seu e-mail.';
    } catch {
      aviso.textContent = `Não deu para copiar. O e-mail é ${copiar.dataset.copiar}`;
    }
    clearTimeout(copiar.timer);
    copiar.timer = setTimeout(() => { aviso.textContent = ''; }, 5000);
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
  document.querySelectorAll('.abertura, .cartoes, .passos, .contato').forEach((el) => vigia.observe(el));

  itens.forEach((item, i) => {
    item.style.transitionDelay = `${(i % 4) * 80}ms`;
    observador.observe(item);
  });
} else {
  itens.forEach((item) => item.classList.add('visivel'));
}
