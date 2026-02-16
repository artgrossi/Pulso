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
