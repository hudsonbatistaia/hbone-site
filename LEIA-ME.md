# Site da HbOne Soluções (hbone.com.br)

Página de apresentação profissional da HbOne. É estática (HTML, CSS e um pouco de JavaScript) e não guarda nenhum dado.

## Ver no computador
Dê dois cliques em `index.html`. Para conferir a versão de celular, aperte F12 no navegador e ative o modo celular.

## Arquivos
```
index.html            página inicial
404.html              página de "não encontrada"
css/site.css          cores e layout (as cores ficam no início do arquivo)
js/site.js            animações, luz que segue o mouse e copiar o e-mail ao clicar nos botões
favicon.svg           ícone da aba ("Hb")
apple-touch-icon.png  ícone quando alguém salva o site na tela inicial do celular
og.jpg                imagem da prévia do link (WhatsApp, LinkedIn...), 1200×630
robots.txt, sitemap.xml   ajudam o Google a encontrar a página
```

## Onde mudar o texto
- **E-mail de contato:** procure `hbonesolucoes@gmail.com` em `index.html`. Ele aparece nos dois botões (topo e contato, cada um em 3 lugares: link, data-copiar e texto) e nos dados para o Google.
- **Cores:** as variáveis `--ciano`, `--azul`, `--violeta` e `--marca` no topo de `css/site.css`.
- **Depois de mudar o CSS ou o JS:** aumente o número em `site.css?v=3` e `site.js?v=3` no `index.html` (e no `404.html`, no caso do CSS). Assim quem já visitou o site vê a versão nova.

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
       @estaticos path /css/* /js/* *.png *.jpg *.svg
       header @estaticos Cache-Control "public, max-age=604800"

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
2. **WhatsApp como segundo contato**, ao lado do e-mail.
3. **E-mail com o domínio** (ex.: contato@hbone.com.br), por um serviço gratuito de encaminhamento. Não montar servidor de e-mail.
4. **Revisar duas frases supostas:** "paga um valor fixo e recebe as melhorias sem custo extra" (Produtos próprios) e "hospedagem, segurança e manutenção ficam com a gente" (Por que a HbOne?).
5. **Depois de publicar:** testar no pagespeed.web.dev, cadastrar no Google Search Console e conferir a prévia do link no WhatsApp.

## Conferir depois de publicar
- Prévia do link: cole `https://hbone.com.br` numa conversa do WhatsApp com você mesmo.
- Velocidade e boas práticas: https://pagespeed.web.dev
- Segurança dos cabeçalhos: https://securityheaders.com
- Google: cadastre o site no Google Search Console e envie `https://hbone.com.br/sitemap.xml`.
