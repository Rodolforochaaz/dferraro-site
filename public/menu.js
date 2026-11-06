/* Cardápio D'Ferraro — fonte: cardápio digital DGuests (nov/2026) */
window.DF_MENU = {
  executivo: {
    price: "R$ 73,00",
    note: "Entrada do dia, prato principal e sobremesa do dia",
    when: "Segunda a sexta, das 11h30 às 15h, exceto feriados",
    pratos: [
      { name: "Arroz de Costela", desc: "Arroz puxado no próprio caldo da costela desfiada, servido com ovo frito de gema mole." },
      { name: "Gnocchi de Mandioquinha", desc: "Massa à base de mandioquinha, servida ao molho rústico de tomates ao sugo e manjericão." },
      { name: "Fettuccine ao Alfredo", desc: "Massa ao clássico molho italiano de parmesão, pimenta-do-reino e manteiga. Acompanha tiras de filé mignon no molho.", img: "fettuccine-alfredo" },
      { name: "Filé Parmegiana", desc: "Clássico bife à milanesa coberto com molho de tomates e muçarela. Acompanha arroz e batatas fritas." },
      { name: "Filé à Camões", desc: "Bife de alcatra grelhado com ovo frito, arroz, feijão e batatas portuguesas. Homenagem ao poeta Luís Vaz de Camões." }
    ]
  },
  categories: [
    { id: "petiscos", name: "Petiscos", lead: "Para dividir, do couvert ao happy hour.", items: [
      { name: "Tapas no Tomate", desc: "Fatias de baguete, tomates frescos ralados ao azeite e sal.", price: "R$ 33,00" },
      { name: "Tapas de Jamón", desc: "Fatias de baguete, tomates frescos, queijo de cabra e jamón serrano.", price: "R$ 49,00", img: "tapas-jamon" },
      { name: "Ceviche", desc: "Fatias de tilápia fresca ao leche de tigre, cebola roxa e coentro. Uma expressão clássica da cozinha peruana.", price: "R$ 48,00" },
      { name: "Camarões al Ajillo", desc: "Camarões ao alho, azeite, tomate cereja e salsa fresca, com fatias de pão francês. Uma das tapas mais tradicionais da Espanha.", price: "R$ 85,00", img: "camaroes-al-ajillo", signature: true },
      { name: "Mignon al Formaggi", desc: "Grelhado e suculento, servido com molho de gorgonzola e parmesão. Acompanha batatas bolinha e pão francês.", price: "R$ 109,00" },
      { name: "Tulipinhas ao Chimichurri", desc: "Marinadas em temperos especiais e fritas até ficarem crocantes por fora e suculentas por dentro.", price: "R$ 48,00", img: "tulipinhas" },
      { name: "Croquetes de Jamón ou Costela Desfiada", desc: "Servidos com a nossa maionese artesanal.", price: "R$ 38,00 a R$ 68,00" },
      { name: "Tábua de Frios", desc: "Seleção de queijos com geleia de frutas vermelhas, copa espanhola e jamón serrano fatiados, caponata de berinjela, azeitonas e pão italiano.", price: "R$ 78,00 a R$ 128,00" },
      { name: "Jamón Serrano Fatiado", desc: "Acompanha fatias de pão francês.", price: "R$ 68,00" },
      { name: "Parmegiana Aperitivo", desc: "Mignon à parmegiana cortado em cubos suculentos.", price: "R$ 89,00" },
      { name: "Picanha Fatiada", desc: "Acompanha farofa, vinagrete e pão francês.", price: "R$ 95,00 a R$ 175,00" }
    ]},
    { id: "carnes", name: "Carnes", lead: "Cortes nobres, pontos precisos.", items: [
      { name: "Baby Beef", desc: "Corte nobre e macio do miolo da alcatra. Acompanha arroz biro-biro com ovos mexidos, cubos de bacon e batata palha.", price: "R$ 75,00" },
      { name: "Entrecôte ao Dijon", desc: "Corte macio e fatiado ao molho cremoso de mostarda Dijon, pimenta-do-reino e ervas finas. Acompanha batatas fritas douradas.", price: "R$ 95,00" },
      { name: "Filé Chateaubriand ao Rôti", desc: "Corte francês do filé mignon grelhado, servido com fettuccine ao molho de parmesão. Homenagem ao escritor François-René de Chateaubriand.", price: "R$ 98,00", signature: true },
      { name: "Filé à Camões", desc: "Bife de alcatra grelhado com ovo frito, arroz, feijão e batatas portuguesas. Homenagem ao poeta Luís Vaz de Camões.", price: "R$ 75,00" },
      { name: "Filé Parmegiana", desc: "Clássico bife à milanesa coberto com molho de tomate e muçarela. Acompanha arroz e batatas fritas.", price: "R$ 73,00" },
      { name: "Picanha à Delon Seixas", desc: "Corte nobre brasileiro grelhado. Acompanha arroz, farofa e vinagrete.", price: "R$ 108,00", signature: true },
      { name: "Filé Paris-Milão", desc: "Medalhão de filé mignon grelhado na manteiga noisette infusionada com ervas finas. Acompanha risoto cremoso de brie com aspargos salteados.", price: "R$ 89,00" },
      { name: "Arroz de Costela", desc: "Arroz cremoso puxado no próprio caldo, costela bovina desfiada e ovo frito de gema mole.", price: "R$ 65,00", img: "arroz-de-costela" }
    ]},
    { id: "pescados", name: "Pescados", lead: "Do Mediterrâneo à costa valenciana.", items: [
      { name: "Saint Peter à Belle Meunière", desc: "Filé de tilápia ao estilo clássico francês, camarões na manteiga noisette, champignons e alcaparras. Acompanha batatas, cogumelos e aspargos grelhados.", price: "R$ 72,00", img: "saint-peter" },
      { name: "Salmão à Riviera", desc: "Grelhado com crosta de ervas finas, acompanhado de risoto cremoso de limão siciliano.", price: "R$ 89,00" },
      { name: "Paella de Frutos do Mar", desc: "Arroz cozido lentamente em caldo de peixe e açafrão, coroado com camarões graúdos, anéis de lula, mexilhões e mariscos. Finalizada com pimentões e limão.", price: "R$ 119,00", img: "paella", signature: true }
    ]},
    { id: "classicos", name: "Clássicos e Pastas", lead: "Massas artesanais e clássicos reinterpretados.", items: [
      { name: "Salada Caesar", desc: "Mix de folhas, croutons, parmesão laminado e molho Caesar, com filé de frango empanado ou grelhado.", price: "R$ 54,00" },
      { name: "Steak Tartare", desc: "Mignon extrafresco picado à mão e temperado na hora, finalizado com gema crua e azeite trufado na salada de rúcula. Acompanha torradas.", price: "R$ 55,00", img: "steak-tartare", signature: true },
      { name: "Risoto à Milanese", desc: "Clássico italiano à base de parmesão e açafrão, servido com tiras de filé de frango empanado.", price: "R$ 65,00" },
      { name: "Fettuccine à Genovese", desc: "Massa ao azeite salteada com camarões, molho pesto, tomates cereja e aspargos frescos.", price: "R$ 79,00" },
      { name: "Penne al Baccalà", desc: "Receita leve que combina penne com lascas de bacalhau, azeite de oliva, tomates cereja, brócolis e azeitonas.", price: "R$ 89,00" },
      { name: "Ravioli di Verdure e Noci", desc: "Massa vegana artesanal recheada com legumes grelhados, ao pesto de manjericão fresco e farofa de nozes.", price: "R$ 78,00", vegan: true }
    ]},
    { id: "sobremesas", name: "Sobremesas", lead: "Um final doce.", items: [
      { name: "Gelatos", desc: "Pistache, coco com castanhas ou baunilha com calda de chocolate.", price: "R$ 18,00" },
      { name: "Pudim de Pistache", desc: "Cremoso e aveludado, feito com pistaches selecionados de sabor marcante e delicado.", price: "R$ 29,00", signature: true },
      { name: "Brownie de Chocolate", desc: "Denso e intenso, servido ainda morno com sorvete de baunilha.", price: "R$ 28,00" },
      { name: "Creme de Papaya", desc: "Papaya batida com sorvete de creme. Acompanha licor de cassis.", price: "R$ 26,00" },
      { name: "Crepe de Doce de Leite e Gelato de Baunilha", desc: "Massa leve de fermentação natural com levain, recheada com doce de leite artesanal e crosta caramelizada.", price: "R$ 32,00" },
      { name: "Fruta da Estação", desc: "Seleção fresca das melhores frutas do dia, em cortes delicados.", price: "R$ 15,00" },
      { name: "Cheesecake de Frutas Vermelhas", desc: "Farofa de biscoito, creme de queijo gelado e cobertura de frutas vermelhas em calda.", price: "R$ 25,00" }
    ]},
    { id: "drinks", name: "Drinks e Especiais", lead: "Coquetelaria clássica e criações da casa.", items: [
      { name: "Caipirinha do Amor", desc: "Morango, maracujá e cachaça Espírito de Minas envelhecida em carvalho.", price: "R$ 36,00", house: true },
      { name: "Caipiroska Siciliana", desc: "Limão siciliano, uvas negras e vodka Smirnoff.", price: "R$ 35,00", house: true },
      { name: "Caipiroska do Patrão", desc: "Tangerina, tomilho e vodka Grey Goose.", price: "R$ 46,00", house: true },
      { name: "Caipirinha de Steinhaeger", desc: "Jabuticaba, hortelã e Steinhaeger.", price: "R$ 33,00", house: true },
      { name: "Aperol Spritz", desc: "Espumante, Aperol e laranja.", price: "R$ 33,00", img: "aperol-spritz" },
      { name: "Cello Spritz", desc: "Nossa versão com espumante, vinho branco e limão siciliano.", price: "R$ 31,00" },
      { name: "Clericot", desc: "Espumante, seleção de frutas, Cointreau e soda.", price: "R$ 37,00", img: "clericot" },
      { name: "G&T", desc: "Tanqueray, tônica e limão.", price: "R$ 39,00" },
      { name: "G&T Red", desc: "Tanqueray, tônica, xarope de framboesa e frutas vermelhas.", price: "R$ 39,00" },
      { name: "Negroni", desc: "Tanqueray, Campari e vermute.", price: "R$ 43,00" },
      { name: "Fitzgerald", desc: "Bombay, Angostura bitter e limão siciliano.", price: "R$ 45,00" },
      { name: "Margarita", desc: "Tequila, Cointreau, suco de limão e sal.", price: "R$ 38,00", img: "margarita" },
      { name: "Mojito", desc: "Bacardi, hortelã, limão e xarope de açúcar.", price: "R$ 38,00" },
      { name: "Moscow Mule", desc: "Vodka, espuma de gengibre, raspas e suco de limão.", price: "R$ 43,00", img: "moscow-mule" },
      { name: "Old Fashioned", desc: "Whisky bourbon, Angostura bitter e açúcar.", price: "R$ 45,00" },
      { name: "Passion Mule", desc: "Cachaça Santa Capela Bálsamo, maracujá, espuma de gengibre e limão.", price: "R$ 43,00" },
      { name: "Espresso Martini", desc: "Vodka, licor de café e café expresso.", price: "R$ 45,00" },
      { name: "Caipirinhas", desc: "Velho Barreiro R$ 27,00 · Espírito de Minas R$ 34,00. Sabores sob consulta.", price: "a partir de R$ 27,00" },
      { name: "Caipiroskas", desc: "Smirnoff R$ 33,00 · Absolut R$ 37,00 · Grey Goose R$ 44,00. Sabores sob consulta.", price: "a partir de R$ 33,00" }
    ]},
    { id: "bar", name: "Chopp, Cervejas e Destilados", lead: "Chopp artesanal Paulistânia e rótulos selecionados.", items: [
      { name: "Chopp Artesanal Lager/Pilsen", desc: "Paulistânia. 300 ml R$ 15,00 · 500 ml R$ 19,00.", price: "a partir de R$ 15,00" },
      { name: "Chopp Artesanal IPA", desc: "Paulistânia. 300 ml R$ 17,00 · 500 ml R$ 23,00.", price: "a partir de R$ 17,00" },
      { name: "Long Neck 330 ml", desc: "Heineken, Corona ou Stella Artois Pure Gold. Versões zero: Heineken ou Corona.", price: "R$ 16,00" },
      { name: "Heineken 600 ml", desc: "", price: "R$ 22,00" },
      { name: "Original 600 ml", desc: "", price: "R$ 19,00" },
      { name: "Paulaner Weiss 500 ml", desc: "", price: "R$ 38,00" },
      { name: "Whisky", desc: "Red Label R$ 25 · Jack Daniel's R$ 26 · Chivas 12 R$ 29 · Buchanan's 12 R$ 29 · Black Label R$ 33 · Woodford Bourbon R$ 35 · Green Label R$ 55 · Chivas 18 R$ 89. Dose; garrafa sob consulta.", price: "dose a partir de R$ 25,00" },
      { name: "Destilados", desc: "Smirnoff R$ 19 · Tequila R$ 25 · Campari R$ 25 · Steinhaeger R$ 25 · Absolut, Tanqueray e Bombay R$ 29 · Grey Goose R$ 35 · Cognac Hennessy R$ 58. Dose; garrafa sob consulta.", price: "dose a partir de R$ 19,00" },
      { name: "Licores", desc: "Licor de Doce de Leite R$ 19 · Jägermeister R$ 22 · Licor 43, Bailey's e Licor de Café R$ 25. Dose; garrafa sob consulta.", price: "dose a partir de R$ 19,00" },
      { name: "Cachaças", desc: "Porto do Vianna Amburana, Salinas Bálsamo e Santa Capela R$ 18 · Espírito de Minas R$ 20 · Wiba! Reserva Especial R$ 25 · Santa Capela Premium (carvalho francês) R$ 35.", price: "dose a partir de R$ 18,00" }
    ]},
    { id: "sem-alcool", name: "Cafés e Sem Álcool", lead: "Do expresso à soda italiana.", items: [
      { name: "Café Expresso", desc: "", price: "R$ 11,00" },
      { name: "Cappuccino", desc: "", price: "R$ 12,00" },
      { name: "Chá Twinings", desc: "Sabores sob consulta.", price: "R$ 12,00" },
      { name: "Suco Natural", desc: "Laranja, abacaxi, limão ou melancia.", price: "R$ 13,00" },
      { name: "Soda Italiana", desc: "Maçã verde, frutas vermelhas ou tangerina.", price: "R$ 19,00" },
      { name: "Água San Pellegrino ou Panna 500 ml", desc: "Borbulhas finas e persistentes, mineralidade equilibrada.", price: "R$ 28,00" },
      { name: "Água com ou sem gás 310 ml", desc: "", price: "R$ 10,00" },
      { name: "Água de Coco 330 ml", desc: "", price: "R$ 12,00" },
      { name: "Água Tônica 350 ml", desc: "Normal ou zero.", price: "R$ 12,00" },
      { name: "Coca-Cola 350 ml", desc: "Normal ou zero.", price: "R$ 12,00" }
    ]}
  ],
  wines: [
    { group: "Espumantes", items: [
      { name: "Villa Sandi Fresco Prosecco Rosé Millesimato", origin: "Itália", desc: "Elegante e frutado, notas de frutas vermelhas e frescor vibrante.", price: "R$ 299,00" },
      { name: "Victoria Geisse Extra Brut", origin: "Brasil", desc: "O \"champagne brasileiro\" da crítica internacional: elegância, complexidade e notas de levedura.", price: "R$ 266,00" },
      { name: "Bottega Millesimato Brut", origin: "Itália", desc: "Seco e harmonioso, perlage persistente e notas florais.", price: "R$ 182,00" },
      { name: "Fausto Pizzato Brut", origin: "Brasil", desc: "Fresco e equilibrado, frutas brancas e pão tostado.", price: "R$ 135,00" },
      { name: "Fausto Pizzato Demi Sec", origin: "Brasil", desc: "Suave e delicado, doçura e acidez em equilíbrio. Ideal para sobremesas.", price: "R$ 135,00" }
    ]},
    { group: "Rosés", items: [
      { name: "Nederburg Rosé", origin: "África do Sul", desc: "Leve, limpo e refrescante, aromas de morangos frescos.", price: "R$ 158,00" },
      { name: "Leyda Rosé Pinot Noir", origin: "Chile", desc: "Expressivo e suculento, notas cítricas, herbáceas e de frutas vermelhas.", price: "R$ 187,00" },
      { name: "Estandon Brise Maritime Méditerranée Rosé", origin: "França", desc: "O frescor da Provence: seco, leve e frutado.", price: "R$ 197,00" }
    ]},
    { group: "Brancos", items: [
      { name: "Ventus White Blend", origin: "Argentina", desc: "Refrescante e jovem, paladar frutado e leve.", price: "R$ 149,00" },
      { name: "Pizzato Allumé Chardonnay", origin: "Brasil", desc: "Expressivo e mineral, frutas tropicais e ótima acidez.", price: "R$ 158,00" },
      { name: "Stemmari Pinot Grigio", origin: "Itália", desc: "Delicadeza siciliana, aromas florais e toque cítrico.", price: "R$ 165,00" },
      { name: "Luccarelli Bianco", origin: "Itália", desc: "Mineral e equilibrado, da Puglia. Companhia perfeita para frutos do mar.", price: "R$ 187,00" },
      { name: "J. Meyer Moselland Riesling", origin: "Alemanha", desc: "Aromático e levemente adocicado, acidez equilibrada.", price: "R$ 196,00" },
      { name: "Matetic Corralillo Sauvignon Blanc", origin: "Chile", desc: "Intenso e vibrante, ervas frescas e frutas cítricas.", price: "R$ 266,00" }
    ]},
    { group: "Tintos · Brasil", items: [
      { name: "Pizzato Allumé Pinot Noir", origin: "Brasil", desc: "Leve, sedoso e repleto de frutas vermelhas frescas.", price: "R$ 158,00" },
      { name: "Basco Loco Iribarrem Cabernet Franc", origin: "Brasil", desc: "Exótico e autêntico, especiarias e frutas negras.", price: "R$ 179,00" },
      { name: "Pizzato DNA 99 Merlot", origin: "Brasil", desc: "Ícone da viticultura brasileira, elaborado apenas em safras excepcionais. Frutas negras, tabaco e couro.", price: "R$ 491,00" }
    ]},
    { group: "Tintos · Chile", items: [
      { name: "Mancura Etnia Merlot", origin: "Chile", desc: "Macio e frutado, taninos aveludados.", price: "R$ 146,00" },
      { name: "Leyda Reserva Pinot Noir", origin: "Chile", desc: "Expressivo e mineral, focado na pureza da fruta.", price: "R$ 187,00" },
      { name: "Caliterra Tributo Gran Reserva Carmenère", origin: "Chile", desc: "Sedoso e equilibrado, pimenta preta e frutas maduras.", price: "R$ 196,00" },
      { name: "Tabalí Pedregoso Gran Reserva Cabernet Sauvignon", origin: "Chile", desc: "Potente e mineral, taninos firmes e notas de chocolate.", price: "R$ 198,00" },
      { name: "San Pedro 1865 Selected Gran Reserva Syrah", origin: "Chile", desc: "Intenso e especiado, corpo robusto e final longo.", price: "R$ 309,00" },
      { name: "Matetic Corralillo Winemaker's Blend", origin: "Chile", desc: "Frutas negras maduras, pimenta e chocolate amargo. Potência e elegância.", price: "R$ 379,00" }
    ]},
    { group: "Tintos · Argentina", items: [
      { name: "Alfredo Roca Alma Inquieta Blend", origin: "Argentina", desc: "Criativo e surpreendente, aromas intensos e paladar persistente.", price: "R$ 139,00" },
      { name: "Ventus Malbec", origin: "Argentina", desc: "Jovem e vibrante, fruta negra e taninos macios.", price: "R$ 158,00" },
      { name: "Pulenta La Flor Red Blend", origin: "Argentina", desc: "Elegante e equilibrado, frescor de frutas vermelhas.", price: "R$ 271,00" },
      { name: "Felino Cobos Cabernet Sauvignon", origin: "Argentina", desc: "Potente e refinado, com a assinatura de Paul Hobbs.", price: "R$ 289,00" },
      { name: "Norton Altura Cabernet Franc", origin: "Argentina", desc: "Rubi intenso, toques de menta e especiarias, taninos sedosos.", price: "R$ 296,00" },
      { name: "Zuccardi Polígonos Paraje Altamira Malbec", origin: "Argentina", desc: "Malbec puro, sem madeira: violetas, frutas silvestres e mineralidade profunda.", price: "R$ 491,00" }
    ]},
    { group: "Tintos · Uruguai", items: [
      { name: "Elegido Montes Toscanini Blend", origin: "Uruguai", desc: "A Merlot suaviza a força do Tannat.", price: "R$ 135,00" },
      { name: "Montes Toscanini Reserva Familiar", origin: "Uruguai", desc: "O ícone uruguaio: potente e robusto, ideal para carnes.", price: "R$ 149,00" },
      { name: "Pizzorno Reserva Cabernet Sauvignon", origin: "Uruguai", desc: "Estruturado e elegante, frutas maduras e especiarias.", price: "R$ 229,00" }
    ]},
    { group: "Tintos · Portugal", items: [
      { name: "Carmim Monsaraz", origin: "Portugal", desc: "Frutado e macio, clássico alentejano.", price: "R$ 142,00" },
      { name: "Vallado Quadrifolia", origin: "Portugal", desc: "Moderno e refrescante, a tipicidade do Douro.", price: "R$ 213,00" },
      { name: "Carmim Reguengos Reserva", origin: "Portugal", desc: "Estruturado e complexo, madeira e frutas maduras.", price: "R$ 223,00" },
      { name: "Niepoort Conversa", origin: "Portugal", desc: "Clássico do Douro: frutas silvestres, especiarias e taninos macios.", price: "R$ 293,00" }
    ]},
    { group: "Tintos · Espanha", items: [
      { name: "Dominio Vega Linde Garnacha", origin: "Espanha", desc: "Elegante e mineral, a força da Ribera del Duero.", price: "R$ 171,00" },
      { name: "Petit Vega Cosecha Tempranillo", origin: "Espanha", desc: "Jovem, frutado e expressivo.", price: "R$ 193,00" },
      { name: "Marqués de Tomares Crianza", origin: "Espanha", desc: "Clássico de Rioja, envelhecido em carvalho.", price: "R$ 252,00" }
    ]},
    { group: "Tintos · França", items: [
      { name: "Cairanne Secret de Campane", origin: "França", desc: "Um Rhône rico e especiado, ervas selvagens e frutas negras.", price: "R$ 197,00" },
      { name: "Maison Castel Médoc", origin: "França", desc: "Elegante e estruturado, o toque clássico de Bordeaux.", price: "R$ 275,00" },
      { name: "Domaine Lafage Côté", origin: "França", desc: "Fresco e frutado, leveza e intensidade aromática.", price: "R$ 308,00" }
    ]},
    { group: "Tintos · Itália", items: [
      { name: "Corbelli Primitivo", origin: "Itália", desc: "Macio e envolvente, frutas passas e especiarias doces.", price: "R$ 148,00" },
      { name: "Forte Ambroni Rosso", origin: "Itália", desc: "Intenso e persistente, frutas maduras e corpo médio.", price: "R$ 169,00" },
      { name: "Maturo Montepulciano d'Abruzzo", origin: "Itália", desc: "Equilibrado e rústico na medida certa.", price: "R$ 179,00" },
      { name: "Palagetto Chianti Senesi", origin: "Itália", desc: "O clássico da Toscana, notas de cereja ácida.", price: "R$ 211,00" },
      { name: "Araldica Barbera Superiore", origin: "Itália", desc: "Vibrante e frutado, acidez marcante.", price: "R$ 271,00" },
      { name: "Masi Bonacosta Valpolicella", origin: "Itália", desc: "Leve, fresco e sedoso, histórico do Vêneto.", price: "R$ 349,00" },
      { name: "Luccarelli Signature Collection", origin: "Itália", desc: "A expressão máxima da Puglia: denso, potente e aveludado.", price: "R$ 396,00" }
    ]},
    { group: "Tintos · Giro pelo Mundo", items: [
      { name: "Jacob's Creek Blend", origin: "Austrália", desc: "Potente e frutado, especiarias e chocolate.", price: "R$ 173,00" },
      { name: "Nederburg Pinotage", origin: "África do Sul", desc: "Estruturado e equilibrado, cassis e tabaco.", price: "R$ 219,00" },
      { name: "Chateau Ste. Michelle Merlot Columbia Valley", origin: "Estados Unidos", desc: "Rico, frutado, macio e persistente, de uma das vinícolas mais aclamadas dos EUA.", price: "R$ 349,00" }
    ]},
    { group: "Meia garrafa · 375 ml", items: [
      { name: "Alfredo Roca Chardonnay", origin: "Argentina", desc: "Frescor e fruta na medida certa.", price: "R$ 67,00" },
      { name: "Mancura Etnia Cabernet Sauvignon", origin: "Chile", desc: "O clássico chileno em formato prático.", price: "R$ 77,00" },
      { name: "Alfredo Roca Malbec", origin: "Argentina", desc: "A intensidade da Malbec em porção individual.", price: "R$ 87,00" }
    ]},
    { group: "Em taça", items: [
      { name: "Mancura Sauvignon Blanc 187 ml", origin: "Chile", desc: "Frutas tropicais e flores brancas, final refrescante.", price: "R$ 37,00" },
      { name: "Mancura Cabernet Sauvignon 187 ml", origin: "Chile", desc: "Tinto clássico e frutado em porção individual.", price: "R$ 37,00" },
      { name: "Porto Taylor's 60 ml", origin: "Portugal", desc: "O rei dos vinhos de sobremesa: intenso, doce e complexo.", price: "R$ 26,00" }
    ]}
  ]
};
