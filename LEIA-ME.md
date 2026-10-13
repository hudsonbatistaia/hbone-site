# Site da HbOne Soluções (hbone.com.br)

Página de apresentação profissional da HbOne. É estática (HTML, CSS e um pouco de JavaScript) e não guarda nenhum dado.

## Ver no computador
Dê dois cliques em `index.html`. Para conferir a versão de celular, aperte F12 no navegador e ative o modo celular.

## Arquivos
```
index.html            página inicial
404.html              página de "não encontrada"
css/site.css          cores e layout (ORIGINAL; vai embutido no index.html pelo montar.mjs)
montar.mjs            copia o css/site.css para dentro do index.html
js/site.js            animações, luz que segue o mouse e copiar o e-mail ao clicar nos botões
favicon.svg           ícone da aba ("Hb")
apple-touch-icon.png  ícone quando alguém salva o site na tela inicial do celular
og.jpg                imagem da prévia do link (WhatsApp, LinkedIn...), 1200×630
robots.txt, sitemap.xml   ajudam o Google a encontrar a página
assinatura/           assinatura de e-mail (https://hbone.com.br/assinatura/): página com botão "Copiar assinatura" e o logo usado nela
```

## Onde mudar o texto
- **E-mail de contato:** procure `contato@hbone.com.br` em `index.html`. Troque todas as ocorrências: ele aparece no balão do botão "Fale com a HbOne" (abertura), no link de e-mail da seção de contato, no rodapé e nos dados para o Google (em `mailto:`, `data-copiar` e no texto).
- **WhatsApp e Instagram:** o WhatsApp está no balão da abertura, no botão "Conversar no WhatsApp" (contato), nos 4 produtos ("Quero conhecer") e no rodapé; o Instagram, no rodapé. Ambos também nos dados para o Google. Procure `5592992005797` e `instagram.com/hbonesolucoes`.
- **Cores:** as variáveis `--ciano`, `--azul`, `--violeta` e `--marca` no topo de `css/site.css`.
- **Depois de mudar o CSS:** edite só o `css/site.css` e rode `node montar.mjs`, que copia o CSS para dentro do `index.html` (assim a página abre mais rápido no celular). Aumente também o `?v=` do CSS no `404.html`.
- **Depois de mudar o JS:** aumente o número em `site.js?v=…` no `index.html`. **É obrigatório:** o navegador guarda o arquivo por 1 ano e só busca o novo quando o número muda.

## Publicar no servidor HB (Oracle)
1. Envie esta pasta para o repositório `hbone-site` no GitHub (conta hudsonbatistaia).
2. No servidor, na primeira vez:
   ```
   sudo git clone https://github.com/hudsonbatistaia/hbone-site.git /var/www/hbone
   ```
3. Blocos do site em `/etc/caddy/Caddyfile`:
   ```
   # www leva para o endereço principal (um só endereço é melhor para o Google)
   www.hbone.com.br {
       redir https://hbone.com.br{uri} permanent
   }

   hbone.com.br {
       root * /var/www/hbone
       encode zstd gzip

       header {
           Strict-Transport-Security "max-age=31536000"
           X-Content-Type-Options "nosniff"
           Referrer-Policy "strict-origin-when-cross-origin"
           X-Frame-Options "DENY"
           Permissions-Policy "camera=(), microphone=(), geolocation=()"
           -Server
       }
       # CSS e JS têm ?v= no endereço: podem ficar 1 ano no cache. Imagens: 30 dias.
       @versionados path /css/* /js/*
       header @versionados Cache-Control "public, max-age=31536000, immutable"
       @imagens path *.png *.jpg *.svg
       header @imagens Cache-Control "public, max-age=2592000"

       file_server {
           hide .git LEIA-ME.md
       }
       handle_errors {
           rewrite * /404.html
           file_server
       }
   }
   ```
   Depois: `sudo caddy validate --config /etc/caddy/Caddyfile` (confere se está tudo certo) e `sudo systemctl reload caddy`. O Caddy cria o HTTPS (cadeado) sozinho.
4. Para atualizar depois de mudar algo: `cd /var/www/hbone && sudo git pull`.

## Melhorias para depois (aprovadas em 12/10/2026)
1. **Depoimentos ou logos de clientes reais** (2 ou 3 frases, com autorização). Nada inventado.
2. **WhatsApp na seção de contato**, ao lado do e-mail (no rodapé já está, desde 12/10/2026).
3. ~~**E-mail com o domínio**~~ Feito em 13/10/2026: contato@hbone.com.br pelo ImprovMX (encaminha para o Gmail hbonesolucoes) e envio pelo Gmail "Enviar e-mail como".
4. **Revisar duas frases supostas:** "paga um valor fixo e recebe as melhorias sem custo extra" (Produtos próprios) e "hospedagem, segurança e manutenção ficam com a gente" (Por que a HbOne?).
5. **Google Search Console:** cadastrar o site e enviar o sitemap.xml (guardado para depois). PageSpeed (100 em tudo) e prévia no WhatsApp já conferidos em 12/10/2026.

## Conferir depois de publicar
- Prévia do link: cole `https://hbone.com.br` numa conversa do WhatsApp com você mesmo.
- Velocidade e boas práticas: https://pagespeed.web.dev
- Segurança dos cabeçalhos: https://securityheaders.com
- Google: cadastre o site no Google Search Console e envie `https://hbone.com.br/sitemap.xml`.
