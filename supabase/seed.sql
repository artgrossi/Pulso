-- ============================================================================
-- Pulso - Seed Data
-- Run after migration to populate tracks, sample content, and achievements
-- ============================================================================

-- ============================================================================
-- TRACKS
-- ============================================================================
insert into public.tracks (slug, name, description, icon, sort_order, coins_convertible) values
  ('retomada', 'Retomada', 'Para quem precisa organizar dívidas e retomar o controle financeiro. Aqui você vai construir a base para uma vida financeira saudável.', '🔄', 1, false),
  ('fundacao', 'Fundação', 'Para quem já paga as contas em dia mas precisa construir uma reserva de emergência e entender seus investimentos.', '🏗️', 2, true),
  ('crescimento', 'Crescimento', 'Para quem já investe e quer otimizar sua estratégia, entender melhor previdência e diversificar.', '📈', 3, true),
  ('expertise', 'Expertise', 'Para quem domina finanças pessoais e busca conteúdo avançado, ferramentas sofisticadas e comunidade.', '🎓', 4, true);

-- ============================================================================
-- DAILY CONTENT - Trilha Retomada (primeiros 7 dias)
-- ============================================================================
insert into public.daily_content (track_id, day_number, title, subtitle, content_type, body, coins_reward, duration_minutes, is_published) values
  ((select id from public.tracks where slug = 'retomada'), 1, 'Entendendo o juro rotativo do cartão', 'Por que sua dívida cresce tão rápido', 'micro_lesson',
   '{"blocks": [{"type": "text", "content": "O juro rotativo do cartão de crédito é um dos mais altos do mercado financeiro brasileiro, podendo ultrapassar 400% ao ano. Quando você paga apenas o valor mínimo da fatura, o restante entra no rotativo."}, {"type": "tip", "content": "Mesmo que pareça pouco, pagar apenas o mínimo pode fazer uma dívida de R$ 1.000 virar R$ 5.000 em poucos meses."}, {"type": "text", "content": "A boa notícia: existem alternativas mais baratas. Parcelamento da fatura, empréstimo pessoal ou portabilidade de crédito podem reduzir significativamente os juros que você paga."}]}',
   10, 3, true),
  ((select id from public.tracks where slug = 'retomada'), 1, 'Quanto você deve?', 'Mapeie suas dívidas', 'practical_action',
   '{"blocks": [{"type": "text", "content": "Abra um bloco de notas e liste todas as suas dívidas. Para cada uma, anote: credor, valor total, taxa de juros e valor da parcela mensal."}, {"type": "tip", "content": "Não se assuste com o total. Saber exatamente quanto você deve é o primeiro passo para sair dessa situação."}]}',
   20, 5, true),
  ((select id from public.tracks where slug = 'retomada'), 2, 'Como priorizar qual dívida pagar primeiro', 'Estratégias: avalanche vs. bola de neve', 'micro_lesson',
   '{"blocks": [{"type": "text", "content": "Existem duas estratégias principais para quitar dívidas:"}, {"type": "text", "content": "**Método Avalanche:** Pague primeiro a dívida com maior taxa de juros. Matematicamente, é a opção mais eficiente — você paga menos juros no total."}, {"type": "text", "content": "**Método Bola de Neve:** Pague primeiro a menor dívida. É menos eficiente matematicamente, mas a sensação de quitar uma dívida rapidamente pode ser muito motivadora."}, {"type": "tip", "content": "Para a maioria das pessoas, o Método Bola de Neve funciona melhor na prática. A motivação de ver dívidas sendo eliminadas mantém você no caminho."}]}',
   10, 3, true),
  ((select id from public.tracks where slug = 'retomada'), 2, 'Organize suas dívidas por prioridade', 'Aplique o que aprendeu', 'practical_action',
   '{"blocks": [{"type": "text", "content": "Usando a lista que você criou ontem, ordene suas dívidas usando uma das estratégias (Avalanche ou Bola de Neve). Identifique qual será a primeira dívida que você vai atacar."}, {"type": "tip", "content": "Se não sabe qual escolher, comece pela Bola de Neve. Pagar a menor dívida primeiro vai te dar impulso."}]}',
   20, 3, true),
  ((select id from public.tracks where slug = 'retomada'), 3, 'Técnicas de negociação com credores', 'Como conseguir descontos reais', 'micro_lesson',
   '{"blocks": [{"type": "text", "content": "Credores preferem receber algo a não receber nada. Isso te dá poder de negociação. Algumas dicas:"}, {"type": "text", "content": "1. **Ligue no momento certo:** Feirões de renegociação (Serasa Limpa Nome, por ex.) oferecem os melhores descontos.\n2. **Tenha uma proposta clara:** Saiba exatamente quanto pode pagar por mês.\n3. **Peça desconto à vista:** Pagamentos à vista podem ter descontos de 50-90%.\n4. **Compare canais:** Às vezes a negociação online oferece condições melhores que a por telefone."}, {"type": "tip", "content": "Nunca aceite a primeira proposta. Diga que o valor está acima do que consegue pagar e peça condições melhores."}]}',
   10, 4, true),
  ((select id from public.tracks where slug = 'retomada'), 4, 'Como montar um orçamento mínimo viável', 'Controle básico que funciona', 'micro_lesson',
   '{"blocks": [{"type": "text", "content": "Esqueça planilhas complexas. O orçamento mínimo viável tem apenas 3 categorias:"}, {"type": "text", "content": "1. **Essenciais** (moradia, alimentação, transporte, saúde): tente manter em até 50-60% da renda.\n2. **Dívidas:** parcelas de negociação + pagamento mínimo das demais.\n3. **Variáveis:** todo o resto."}, {"type": "tip", "content": "O segredo não é anotar cada centavo, mas sim saber no início do mês quanto pode gastar em cada categoria e respeitar esse limite."}]}',
   10, 3, true),
  ((select id from public.tracks where slug = 'retomada'), 5, 'Armadilhas de crédito para evitar', 'Não caia nessas ciladas', 'micro_lesson',
   '{"blocks": [{"type": "text", "content": "Enquanto você está saindo das dívidas, evite estas armadilhas:"}, {"type": "text", "content": "- **Crédito consignado para pagar cartão:** Pode parecer lógico (juros menores), mas compromete sua renda fixa por anos.\n- **Empréstimo para pagar empréstimo:** Cria uma espiral perigosa.\n- **Parcelamento ''sem juros'':** Na prática, o desconto à vista quase sempre existe — parcelar é pagar mais.\n- **Cheque especial ''só por uns dias'':** Os juros são diários e altíssimos."}, {"type": "warning", "content": "Se alguém oferecer ''limpar seu nome'' mediante pagamento antecipado, desconfie. Golpes de renegociação são comuns."}]}',
   10, 3, true);

-- ============================================================================
-- DAILY CONTENT - Trilha Fundação (primeiros 5 dias)
-- ============================================================================
insert into public.daily_content (track_id, day_number, title, subtitle, content_type, body, coins_reward, duration_minutes, is_published) values
  ((select id from public.tracks where slug = 'fundacao'), 1, 'Poupar vs. Investir: qual a diferença?', 'Entenda de vez esses dois conceitos', 'micro_lesson',
   '{"blocks": [{"type": "text", "content": "Poupar e investir são coisas diferentes, e entender a diferença é fundamental:"}, {"type": "text", "content": "**Poupar** é guardar dinheiro — tirá-lo do fluxo de gastos. Poupança, CDB de liquidez diária, conta remunerada. O foco é segurança e acesso rápido."}, {"type": "text", "content": "**Investir** é colocar dinheiro para trabalhar com foco em rentabilidade. Ações, fundos, previdência. O foco é crescimento no longo prazo."}, {"type": "tip", "content": "Primeiro você poupa (reserva de emergência), depois você investe (previdência, ações, etc). Não pule etapas."}]}',
   10, 3, true),
  ((select id from public.tracks where slug = 'fundacao'), 2, 'Reserva de emergência: quanto guardar?', 'A base da sua segurança financeira', 'micro_lesson',
   '{"blocks": [{"type": "text", "content": "A reserva de emergência é o dinheiro que vai te proteger de imprevistos sem precisar recorrer a dívidas."}, {"type": "text", "content": "**Quanto guardar?** A recomendação é de 3 a 6 meses dos seus gastos essenciais mensais. Se você gasta R$ 3.000/mês, sua meta é entre R$ 9.000 e R$ 18.000."}, {"type": "text", "content": "**Onde guardar?** Em investimentos de liquidez diária e baixo risco: Tesouro Selic, CDB de liquidez diária, ou conta remunerada de banco digital."}, {"type": "tip", "content": "Não precisa juntar tudo de uma vez. Comece guardando o que conseguir — mesmo R$ 50/mês já é um começo."}]}',
   10, 3, true),
  ((select id from public.tracks where slug = 'fundacao'), 3, 'Entenda a previdência que você já tem', 'O que sua empresa contratou para você', 'micro_lesson',
   '{"blocks": [{"type": "text", "content": "Se sua empresa oferece previdência corporativa, você já tem uma vantagem enorme. Mas precisa entender o que tem."}, {"type": "text", "content": "**Verifique:** Qual é o plano (PGBL ou VGBL)? Qual a taxa de administração? Existe contrapartida da empresa (match)? Qual o fundo investido?"}, {"type": "text", "content": "**Contrapartida (match):** Muitas empresas contribuem junto com você. Se a empresa dá 100% de match, cada R$ 100 que você aporta vira R$ 200. É o investimento mais eficiente que existe."}, {"type": "tip", "content": "Se sua empresa oferece match e você não está aproveitando ao máximo, está literalmente deixando dinheiro na mesa."}]}',
   10, 4, true),
  ((select id from public.tracks where slug = 'fundacao'), 4, 'PGBL: o benefício fiscal que pouca gente usa', 'Como pagar menos IR e investir mais', 'micro_lesson',
   '{"blocks": [{"type": "text", "content": "Se você faz declaração completa do IR, o PGBL permite deduzir até 12% da sua renda bruta tributável."}, {"type": "text", "content": "**Exemplo prático:** Renda bruta de R$ 100.000/ano. Aporte de R$ 12.000 no PGBL. Na faixa de 27.5% do IR, você economiza R$ 3.300 em impostos. É como se o governo pagasse parte da sua aposentadoria."}, {"type": "tip", "content": "Esse benefício é anual. Se não usou em 2025, não pode recuperar. Planeje-se para aproveitar ao máximo em 2026."}]}',
   10, 3, true),
  ((select id from public.tracks where slug = 'fundacao'), 5, 'Simulador: quanto teria se aportasse mais?', 'Veja o poder dos juros compostos', 'micro_lesson',
   '{"blocks": [{"type": "text", "content": "Vamos ver o poder do tempo + aportes regulares:"}, {"type": "text", "content": "**Cenário 1:** R$ 200/mês por 30 anos a 10% a.a. = R$ 452.000\n**Cenário 2:** R$ 500/mês por 30 anos a 10% a.a. = R$ 1.130.000\n**Cenário 3:** R$ 200/mês por 20 anos a 10% a.a. = R$ 153.000"}, {"type": "tip", "content": "Note que 10 anos a menos (Cenário 3 vs 1) reduz o resultado em quase 66%. O tempo é seu maior aliado — comece o quanto antes, mesmo com pouco."}]}',
   10, 3, true);

-- ============================================================================
-- DAILY CONTENT - Trilha Crescimento (primeiros 5 dias)
-- ============================================================================
insert into public.daily_content (track_id, day_number, title, subtitle, content_type, body, coins_reward, duration_minutes, is_published) values
  ((select id from public.tracks where slug = 'crescimento'), 1, 'Diversificacao: por que nao colocar tudo no mesmo lugar', 'Proteja seu patrimonio', 'micro_lesson',
   '{"blocks": [{"type": "text", "content": "Diversificar e distribuir seus investimentos entre diferentes classes de ativos para reduzir riscos."}, {"type": "text", "content": "**Classes principais:**\n- Renda Fixa (Tesouro, CDB, LCI/LCA)\n- Renda Variavel (Acoes, FIIs)\n- Previdencia (PGBL/VGBL)\n- Internacional (BDRs, ETFs globais)"}, {"type": "tip", "content": "Uma regra simples: subtraia sua idade de 100. O resultado e a porcentagem sugerida em renda variavel. 30 anos = 70% variavel, 50 anos = 50% variavel."}]}',
   15, 4, true),
  ((select id from public.tracks where slug = 'crescimento'), 1, 'Revise sua alocacao atual', 'Onde esta seu dinheiro hoje?', 'practical_action',
   '{"blocks": [{"type": "text", "content": "Liste todos os seus investimentos e calcule a porcentagem de cada classe de ativo no seu patrimonio total."}, {"type": "tip", "content": "Inclua previdencia corporativa, FGTS, poupanca e qualquer outro investimento. Muita gente esquece de considerar a previdencia da empresa."}]}',
   25, 5, true),
  ((select id from public.tracks where slug = 'crescimento'), 2, 'Fundos Imobiliarios: renda passiva mensal', 'Como funcionam os FIIs', 'micro_lesson',
   '{"blocks": [{"type": "text", "content": "Fundos Imobiliarios (FIIs) sao uma forma acessivel de investir em imoveis e receber renda mensal."}, {"type": "text", "content": "**Vantagens:**\n- Dividendos mensais isentos de IR para pessoa fisica\n- Investimento a partir de R$ 10-100\n- Diversificacao em varios imoveis com pouco dinheiro\n- Liquidez (compra e vende na bolsa)"}, {"type": "warning", "content": "FIIs tem risco de mercado. O preco da cota pode cair, e os dividendos podem variar. Nao invista o dinheiro da reserva de emergencia em FIIs."}]}',
   15, 4, true),
  ((select id from public.tracks where slug = 'crescimento'), 3, 'Tesouro IPCA+ vs Tesouro Selic', 'Quando usar cada um', 'micro_lesson',
   '{"blocks": [{"type": "text", "content": "**Tesouro Selic:** Liquidez diaria, baixa volatilidade. Ideal para reserva de emergencia e objetivos de curto prazo."}, {"type": "text", "content": "**Tesouro IPCA+:** Protege contra inflacao, mas tem volatilidade no curto prazo. Ideal para objetivos de longo prazo (aposentadoria, educacao dos filhos)."}, {"type": "tip", "content": "Se voce precisa do dinheiro em menos de 2 anos, prefira Tesouro Selic. Para prazos maiores, IPCA+ tende a render mais em termos reais."}]}',
   15, 3, true),
  ((select id from public.tracks where slug = 'crescimento'), 4, 'Previdencia: quando vale a pena aportar mais', 'Otimize sua aposentadoria', 'micro_lesson',
   '{"blocks": [{"type": "text", "content": "Se sua empresa oferece match na previdencia, aportar o maximo que a empresa acompanha e a melhor decisao financeira que existe."}, {"type": "text", "content": "**Exemplo:** Empresa faz match de 100% ate 5% do salario.\nSalario: R$ 10.000\nSeu aporte: R$ 500 (5%)\nMatch da empresa: +R$ 500\nTotal mensal: R$ 1.000 investidos, sendo que voce so tirou R$ 500 do bolso."}, {"type": "tip", "content": "Alem do match, lembre que PGBL permite deduzir ate 12% da renda bruta no IR. Se voce esta na faixa de 27.5%, sao quase 3 meses de aporte de volta."}]}',
   15, 4, true),
  ((select id from public.tracks where slug = 'crescimento'), 5, 'Rebalanceamento: quando e como ajustar', 'Mantenha sua estrategia no trilho', 'micro_lesson',
   '{"blocks": [{"type": "text", "content": "Com o tempo, seus investimentos crescem em ritmos diferentes. Acoes podem subir mais que renda fixa, mudando sua alocacao original."}, {"type": "text", "content": "**Rebalancear** e voltar a alocacao planejada. Voce pode:\n1. Direcionar novos aportes para a classe defasada\n2. Vender o que cresceu demais e comprar o que ficou abaixo\n3. Fazer isso 1-2x por ano (nao precisa ser mensal)"}, {"type": "tip", "content": "A forma mais simples: a cada novo aporte, invista na classe que esta mais abaixo da sua meta. Assim voce rebalanceia naturalmente sem vender nada."}]}',
   15, 3, true);

-- ============================================================================
-- DAILY CONTENT - Trilha Expertise (primeiros 5 dias)
-- ============================================================================
insert into public.daily_content (track_id, day_number, title, subtitle, content_type, body, coins_reward, duration_minutes, is_published) values
  ((select id from public.tracks where slug = 'expertise'), 1, 'Come-cotas: o imposto silencioso dos fundos', 'Entenda o impacto real no longo prazo', 'micro_lesson',
   '{"blocks": [{"type": "text", "content": "O come-cotas e a antecipacao de IR que ocorre em maio e novembro nos fundos de investimento abertos. Ele come suas cotas mesmo que voce nao resgate."}, {"type": "text", "content": "**Impacto real:**\nR$ 100.000 investidos por 20 anos a 10% a.a.\n- Sem come-cotas: R$ 672.749\n- Com come-cotas (15%): R$ 592.893\n- Diferenca: R$ 79.856 (quase 12% do resultado!)"}, {"type": "tip", "content": "ETFs e previdencia (PGBL/VGBL) NAO tem come-cotas. Por isso podem ser mais eficientes para o longo prazo."}]}',
   20, 5, true),
  ((select id from public.tracks where slug = 'expertise'), 1, 'Calcule o impacto do come-cotas nos seus fundos', 'Quanto voce esta perdendo?', 'practical_action',
   '{"blocks": [{"type": "text", "content": "Se voce tem dinheiro em fundos de investimento abertos, use a calculadora de juros compostos do Pulso para simular o impacto do come-cotas no seu patrimonio."}, {"type": "tip", "content": "Compare: simule com a taxa cheia e depois com a taxa descontando 15% semestral. A diferenca e o custo do come-cotas."}]}',
   30, 5, true),
  ((select id from public.tracks where slug = 'expertise'), 2, 'Portabilidade de previdencia sem impostos', 'Troque de fundo sem pagar IR', 'micro_lesson',
   '{"blocks": [{"type": "text", "content": "A portabilidade de previdencia permite mudar de administradora, fundo ou plano sem pagar impostos. E um direito garantido por lei."}, {"type": "text", "content": "**Quando fazer:**\n- Taxa de administracao acima de 1% a.a.\n- Fundo com baixa rentabilidade historica\n- Plano sem opcoes de fundos diversificados\n- Transferencia de VGBL para VGBL ou PGBL para PGBL"}, {"type": "warning", "content": "Portabilidade de PGBL para VGBL (ou vice-versa) NAO e permitida. Planeje com cuidado."}]}',
   20, 4, true),
  ((select id from public.tracks where slug = 'expertise'), 3, 'Investimentos internacionais: BDRs e ETFs globais', 'Diversifique alem do Brasil', 'micro_lesson',
   '{"blocks": [{"type": "text", "content": "Investir internacionalmente reduz o risco-pais e da acesso a empresas e economias que nao existem no Brasil."}, {"type": "text", "content": "**Opcoes acessiveis:**\n- BDRs: Recibos de acoes estrangeiras negociados na B3 (Apple, Google, etc)\n- ETFs internacionais: IVVB11 (S&P 500), NASD11 (Nasdaq), EURP11 (Europa)\n- ETFs no exterior: Via corretora internacional (mais opcoes, menor custo)"}, {"type": "tip", "content": "Uma alocacao de 10-30% em ativos internacionais ja traz beneficios significativos de diversificacao. Comece com ETFs de indice amplo."}]}',
   20, 5, true),
  ((select id from public.tracks where slug = 'expertise'), 4, 'Planejamento sucessorio e tributario', 'Proteja seu patrimonio para a familia', 'micro_lesson',
   '{"blocks": [{"type": "text", "content": "Previdencia privada (PGBL/VGBL) tem uma vantagem unica: nao entra em inventario. Em caso de falecimento, o beneficiario recebe diretamente, sem custos de ITCMD em muitos estados."}, {"type": "text", "content": "**Estrategia tributaria:**\n- VGBL com tabela regressiva: apos 10 anos, so 10% de IR sobre os rendimentos\n- PGBL: IR sobre o total, mas com deducao na entrada\n- Combinacao ideal depende da sua faixa de IR e horizonte"}, {"type": "tip", "content": "Se voce tem dependentes, considere ter pelo menos uma parte do patrimonio em previdencia. A liquidez para a familia em caso de emergencia e muito mais rapida que inventario."}]}',
   20, 5, true),
  ((select id from public.tracks where slug = 'expertise'), 5, 'Construindo renda passiva sustentavel', 'Monte sua estrategia de independencia financeira', 'micro_lesson',
   '{"blocks": [{"type": "text", "content": "Renda passiva sustentavel vem de multiplas fontes que se complementam:"}, {"type": "text", "content": "**Fontes de renda passiva:**\n1. Dividendos de FIIs (mensal, isento de IR)\n2. Dividendos de acoes (trimestral/anual)\n3. Previdencia privada (renda mensal na aposentadoria)\n4. Tesouro IPCA+ com cupom (semestral)\n5. Alugueis (se aplicavel)"}, {"type": "text", "content": "**Regra dos 4%:** Para manter uma renda de R$ 10.000/mes, voce precisa de aproximadamente R$ 3.000.000 investidos (sacando 4% ao ano, ajustado pela inflacao)."}, {"type": "tip", "content": "Nao espere ter o valor total para comecar. Construa cada fonte gradualmente. Ate R$ 500/mes de FIIs ja e um começo real."}]}',
   20, 5, true);

-- ============================================================================
-- QUIZZES - Sample quizzes for each track
-- ============================================================================

-- Retomada Quiz Day 1
insert into public.quizzes (track_id, content_id, title, description, coins_reward) values
  ((select id from public.tracks where slug = 'retomada'),
   (select id from public.daily_content where track_id = (select id from public.tracks where slug = 'retomada') and day_number = 1 and content_type = 'micro_lesson'),
   'Quiz: Juro Rotativo', 'Teste seus conhecimentos sobre juros do cartão', 15);

insert into public.quiz_questions (quiz_id, question_text, options, correct_option_index, explanation, sort_order) values
  ((select id from public.quizzes where title = 'Quiz: Juro Rotativo'),
   'O que acontece quando você paga apenas o valor mínimo da fatura do cartão?',
   '["O restante é perdoado pelo banco", "O restante entra no rotativo com juros altíssimos", "O restante é parcelado automaticamente sem juros"]',
   1, 'O restante da fatura entra no crédito rotativo, que pode ter juros acima de 400% ao ano.', 1),
  ((select id from public.quizzes where title = 'Quiz: Juro Rotativo'),
   'Qual dessas alternativas costuma ter juros mais baixos que o rotativo do cartão?',
   '["Cheque especial", "Empréstimo pessoal", "Todos têm juros iguais"]',
   1, 'O empréstimo pessoal geralmente tem taxas muito menores que o rotativo do cartão. Pode ser uma opção para trocar dívida cara por mais barata.', 2),
  ((select id from public.quizzes where title = 'Quiz: Juro Rotativo'),
   'Uma dívida de R$ 1.000 no rotativo pode virar quanto em poucos meses?',
   '["R$ 1.100", "R$ 5.000 ou mais", "R$ 1.500 no máximo"]',
   1, 'Com juros compostos acima de 400% ao ano, uma dívida de R$ 1.000 pode ultrapassar R$ 5.000 rapidamente.', 3);

-- Fundação Quiz Day 1
insert into public.quizzes (track_id, content_id, title, description, coins_reward) values
  ((select id from public.tracks where slug = 'fundacao'),
   (select id from public.daily_content where track_id = (select id from public.tracks where slug = 'fundacao') and day_number = 1 and content_type = 'micro_lesson'),
   'Quiz: Poupar vs. Investir', 'Você sabe a diferença?', 15);

insert into public.quiz_questions (quiz_id, question_text, options, correct_option_index, explanation, sort_order) values
  ((select id from public.quizzes where title = 'Quiz: Poupar vs. Investir'),
   'Qual a principal diferença entre poupar e investir?',
   '["Não há diferença", "Poupar foca em segurança, investir foca em crescimento", "Investir é sempre melhor que poupar"]',
   1, 'Poupar é guardar com foco em segurança e liquidez. Investir é buscar rentabilidade no longo prazo. Os dois são importantes em momentos diferentes.', 1),
  ((select id from public.quizzes where title = 'Quiz: Poupar vs. Investir'),
   'O que deve vir primeiro na sua jornada financeira?',
   '["Investir em ações", "Montar a reserva de emergência", "Contratar previdência privada"]',
   1, 'A reserva de emergência é a base da segurança financeira. Sem ela, qualquer imprevisto pode te jogar de volta para as dívidas.', 2);

-- Crescimento Quiz
insert into public.quizzes (track_id, content_id, title, description, coins_reward) values
  ((select id from public.tracks where slug = 'crescimento'),
   (select id from public.daily_content where track_id = (select id from public.tracks where slug = 'crescimento') and day_number = 1 and content_type = 'micro_lesson'),
   'Quiz: Diversificacao', 'Teste seus conhecimentos sobre diversificacao de investimentos', 15);

insert into public.quiz_questions (quiz_id, question_text, options, correct_option_index, explanation, sort_order) values
  ((select id from public.quizzes where title = 'Quiz: Diversificacao'),
   'Qual o principal objetivo da diversificacao?',
   '["Ganhar mais dinheiro rapidamente", "Reduzir o risco total da carteira", "Evitar pagar impostos"]',
   1, 'Diversificar distribui o risco entre diferentes ativos. Se um cai, outros podem compensar.', 1),
  ((select id from public.quizzes where title = 'Quiz: Diversificacao'),
   'Uma pessoa de 30 anos, pela regra idade-100, deveria ter quanto em renda variavel?',
   '["30%", "70%", "50%"]',
   1, 'Pela regra 100 menos idade: 100 - 30 = 70% em renda variavel. E uma referencia, nao uma regra absoluta.', 2),
  ((select id from public.quizzes where title = 'Quiz: Diversificacao'),
   'Qual a frequencia ideal de rebalanceamento para a maioria dos investidores?',
   '["Diariamente", "1-2 vezes por ano", "Nunca, o mercado se ajusta sozinho"]',
   1, 'Rebalancear 1-2x por ano e suficiente. Rebalancear demais gera custos e impostos desnecessarios.', 3);

-- Expertise Quiz
insert into public.quizzes (track_id, content_id, title, description, coins_reward) values
  ((select id from public.tracks where slug = 'expertise'),
   (select id from public.daily_content where track_id = (select id from public.tracks where slug = 'expertise') and day_number = 1 and content_type = 'micro_lesson'),
   'Quiz: Eficiencia Tributaria', 'Teste seus conhecimentos sobre come-cotas e previdencia', 20);

insert into public.quiz_questions (quiz_id, question_text, options, correct_option_index, explanation, sort_order) values
  ((select id from public.quizzes where title = 'Quiz: Eficiencia Tributaria'),
   'O que e o come-cotas?',
   '["Taxa de administracao cobrada semestralmente", "Antecipacao de IR em maio e novembro", "Imposto sobre dividendos de fundos"]',
   1, 'O come-cotas e a antecipacao semestral de IR que reduz a quantidade de cotas do investidor, mesmo sem resgate.', 1),
  ((select id from public.quizzes where title = 'Quiz: Eficiencia Tributaria'),
   'Qual desses investimentos NAO tem come-cotas?',
   '["Fundo multimercado", "ETF de renda variavel", "Fundo de renda fixa"]',
   1, 'ETFs nao sofrem come-cotas. Previdencia privada tambem nao. Isso pode fazer grande diferenca no longo prazo.', 2),
  ((select id from public.quizzes where title = 'Quiz: Eficiencia Tributaria'),
   'E possivel fazer portabilidade de PGBL para VGBL?',
   '["Sim, a qualquer momento", "Nao, sao modalidades diferentes", "Sim, mas so apos 10 anos"]',
   1, 'Portabilidade so e permitida dentro da mesma modalidade: PGBL para PGBL ou VGBL para VGBL.', 3);

-- ============================================================================
-- ACHIEVEMENTS
-- ============================================================================
insert into public.achievements (track_id, slug, title, description, icon, coins_reward, aporte_value_brl, criteria, sort_order) values
  -- Global achievements
  (null, 'first_login', 'Primeiro Passo', 'Fez login pela primeira vez na plataforma', '👣', 10, null, '{"type": "custom", "description": "first_login"}', 1),
  (null, 'diagnosis_complete', 'Autoconhecimento', 'Completou o diagnóstico financeiro', '🔍', 25, null, '{"type": "custom", "description": "diagnosis_complete"}', 2),
  (null, 'streak_7', 'Uma Semana Focado', 'Manteve 7 dias consecutivos de atividade', '🔥', 50, null, '{"type": "streak", "value": 7}', 3),
  (null, 'streak_30', 'Mês de Disciplina', 'Manteve 30 dias consecutivos de atividade', '💪', 200, null, '{"type": "streak", "value": 30}', 4),
  (null, 'streak_90', 'Trimestre de Ouro', 'Manteve 90 dias consecutivos de atividade', '⭐', 500, null, '{"type": "streak", "value": 90}', 5),

  -- Retomada achievements
  ((select id from public.tracks where slug = 'retomada'), 'mapped_debts', 'Mapeei Todas as Dívidas', 'Registrou todas as suas dívidas na plataforma', '📋', 50, null, '{"type": "custom", "description": "mapped_all_debts"}', 1),
  ((select id from public.tracks where slug = 'retomada'), 'negotiated_debt', 'Negociador', 'Negociou uma dívida com sucesso', '🤝', 100, null, '{"type": "custom", "description": "negotiated_debt"}', 2),
  ((select id from public.tracks where slug = 'retomada'), 'budget_30_days', '30 Dias no Orçamento', 'Ficou 30 dias dentro do orçamento planejado', '🎯', 150, null, '{"type": "custom", "description": "budget_30_days"}', 3),
  ((select id from public.tracks where slug = 'retomada'), 'score_improved', 'Score em Alta', 'Seu Score Serasa melhorou na verificação', '📊', 200, null, '{"type": "custom", "description": "serasa_score_improved"}', 4),

  -- Fundação achievements
  ((select id from public.tracks where slug = 'fundacao'), 'emergency_target_set', 'Meta Definida', 'Definiu o valor da reserva de emergência', '🎯', 50, null, '{"type": "custom", "description": "emergency_fund_target_set"}', 1),
  ((select id from public.tracks where slug = 'fundacao'), 'emergency_1_month', '1 Mês de Reserva', 'Atingiu 1 mês de reserva de emergência', '🛡️', 200, 15.00, '{"type": "custom", "description": "emergency_fund_1_month"}', 2),
  ((select id from public.tracks where slug = 'fundacao'), 'used_simulator', 'Simulador Explorado', 'Usou o simulador de aposentadoria', '🧮', 75, null, '{"type": "custom", "description": "used_retirement_simulator"}', 3),
  ((select id from public.tracks where slug = 'fundacao'), 'extra_contribution', 'Aporte Extra', 'Fez um aporte extra voluntário na previdência', '💰', 300, 25.00, '{"type": "custom", "description": "voluntary_extra_contribution"}', 4),

  -- Crescimento achievements
  ((select id from public.tracks where slug = 'crescimento'), 'allocation_review', 'Alocação Revisada', 'Revisou a alocação da sua previdência', '⚖️', 100, 10.00, '{"type": "custom", "description": "reviewed_allocation"}', 1),
  ((select id from public.tracks where slug = 'crescimento'), 'portability_done', 'Portabilidade Estratégica', 'Fez portabilidade para fundo mais eficiente', '🔄', 500, 50.00, '{"type": "custom", "description": "portability_completed"}', 2),
  ((select id from public.tracks where slug = 'crescimento'), 'pgbl_maximized', 'PGBL Maximizado', 'Maximizou a dedução de 12% do PGBL', '💎', 400, 40.00, '{"type": "custom", "description": "pgbl_12_percent_maximized"}', 3),
  ((select id from public.tracks where slug = 'crescimento'), 'referral_converted', 'Embaixador', 'Indicou um novo cliente que contratou', '🌟', 1000, 100.00, '{"type": "custom", "description": "referral_converted"}', 4);
