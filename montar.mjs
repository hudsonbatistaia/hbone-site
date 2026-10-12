// Copia o css/site.css para dentro do index.html (entre os marcadores css:inicio e css:fim).
// Assim a página não espera baixar o CSS antes de aparecer, o que deixa o celular mais rápido.
// Uso, depois de mudar o CSS: node montar.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const pasta = dirname(fileURLToPath(import.meta.url));
const css = readFileSync(join(pasta, 'css', 'site.css'), 'utf8')
  .replace(/\/\*[\s\S]*?\*\//g, '')   // tira os comentários
  .split('\n').map((l) => l.trim()).filter(Boolean).join('\n');

const arquivo = join(pasta, 'index.html');
const html = readFileSync(arquivo, 'utf8');
const marcas = /<!-- css:inicio -->[\s\S]*?<!-- css:fim -->/;
if (!marcas.test(html)) throw new Error('Marcadores css:inicio / css:fim não encontrados no index.html');
writeFileSync(arquivo, html.replace(marcas, `<!-- css:inicio -->\n  <style>\n${css}\n  </style>\n  <!-- css:fim -->`));
console.log(`CSS embutido no index.html (${(css.length / 1024).toFixed(1)} KB).`);
