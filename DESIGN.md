# D'Ferraro — direção de design

**Assunto.** Restaurante de cozinha contemporânea no térreo do Complexo 17007 Nações (Torre Alpha, Nações Open Mall), Santo Amaro. Público: executivos do complexo (almoço, reuniões, happy hour), casais (jantar), organizadores de eventos. Trabalho principal do site: levar à reserva (DGuests), deixar o cardápio fácil de consultar e transmitir confiança.

**Mundo visual real (Instagram/Drive).** Ripado de madeira âmbar, luz quente baixa, fachada de vidro com folhagem, jogo americano de couro vinho, porcelana branca, logo em script dourado sobre marrom.

## Tokens

Cor
- Espresso `#1A0F08` — base escura (marrom-preto quente; nunca cinza-preto)
- Mogno `#3E2314` — superfícies, ripado
- Ouro envelhecido `#C7A35B` / brilho `#EBD39A` — acento (o script da logo)
- Vinho `#6E2430` — segundo acento, raro (happy hour, reservas)
- Linho `#F1E8D8` — seções "papel" (cardápio impresso)
- Tinta `#2A1A10` — texto sobre linho

Tipo
- Cormorant Garamond (display, itálico como voz; nunca uma palavra isolada em itálico)
- Jost (interface, preços, horários; geométrica, ar anos 30 italiano)

Layout
- Alternância noite/papel: seções escuras com textura de ripado sutil ↔ cardápio em linho como um menu impresso (nome … preço com pontilhado líder, 2 colunas no desktop).
- Alinhamento à esquerda em texto corrido; centralizado apenas no hero e nos números de avaliação.
- Zero cards. Separação por espaço, filetes de 1px e ritmo tipográfico.

Movimento (um momento orquestrado)
- Abertura: brilho atravessa a logo → logo sobe → hero revela. Depois só micro-interações que respondem a ação (âncora do prato pulsa, chat abre, nav muda com scroll).

## Revisão contra defaults genéricos
- Risco: "preto + dourado de restaurante de luxo". Mitigado por base marrom quente (não preta), vinho como contraponto e seções de papel/linho com pontilhado de menu — a página parece a casa, não um template.
- Sem eyebrow em caixa alta, sem "01/02/03", sem setas em botões, sem grid de cards.
- A sequência do dia (Café 7h → Almoço → Happy hour → Jantar) é uma sequência real, então pode ter linha do tempo.
