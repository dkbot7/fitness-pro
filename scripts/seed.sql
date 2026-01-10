-- ============================================================
-- SEED DATA FOR FITNESS PRO - Cloudflare D1 (SQLite)
-- Created: 2026-01-10
-- ============================================================

-- ============================================================
-- EXERCISES - HOME (No Equipment)
-- ============================================================

-- CHEST & TRICEPS (Home)
INSERT INTO exercises (slug, name_pt, muscle_groups, equipment_required, difficulty, description_pt, contraindications, is_active) VALUES
('push-ups-beginner', 'Flexão de Joelhos', '["peito","triceps","ombros"]', '[]', 'beginner', 'Flexão com os joelhos apoiados no chão, ideal para iniciantes desenvolverem força no peito e tríceps.', '["lesao_ombro","lesao_pulso"]', 1),
('push-ups', 'Flexão de Braço', '["peito","triceps","ombros"]', '[]', 'intermediate', 'Exercício clássico de peso corporal para peito, tríceps e ombros. Mantenha o corpo reto e desça até o peito quase tocar o chão.', '["lesao_ombro","lesao_pulso"]', 1),
('diamond-push-ups', 'Flexão Diamante', '["triceps","peito"]', '[]', 'advanced', 'Variação avançada de flexão com mãos próximas formando diamante, foca mais nos tríceps.', '["lesao_ombro","lesao_pulso","lesao_cotovelo"]', 1),
('pike-push-ups', 'Flexão Pike', '["ombros","triceps"]', '[]', 'intermediate', 'Flexão com quadril elevado formando V invertido, focando nos ombros. Excelente progressão para handstand push-ups.', '["lesao_ombro","lesao_pulso"]', 1),
('tricep-dips-chair', 'Mergulho em Cadeira', '["triceps","ombros"]', '["cadeira"]', 'beginner', 'Apoie as mãos na borda de uma cadeira e desça o corpo, focando nos tríceps. Pés no chão ou elevados para mais dificuldade.', '["lesao_ombro","lesao_cotovelo"]', 1);

-- BACK & BICEPS (Home)
INSERT INTO exercises (slug, name_pt, muscle_groups, equipment_required, difficulty, description_pt, contraindications, is_active) VALUES
('superman', 'Superman', '["costas_inferior","core"]', '[]', 'beginner', 'Deitado de barriga para baixo, levante braços e pernas simultaneamente, fortalecendo a lombar.', '["lesao_lombar"]', 1),
('reverse-snow-angels', 'Anjo Reverso', '["costas_superior","ombros_posterior"]', '[]', 'beginner', 'Deitado de barriga para baixo, mova os braços como fazendo um anjo na neve, ativando trapézio e deltoide posterior.', '["lesao_ombro"]', 1),
('inverted-rows-table', 'Remada Invertida em Mesa', '["costas","biceps"]', '["mesa"]', 'intermediate', 'Deite-se embaixo de uma mesa resistente, segure a borda e puxe o peito em direção à mesa.', '["lesao_ombro","lesao_lombar"]', 1),
('plank-rows', 'Remada em Prancha', '["costas","core"]', '[]', 'intermediate', 'Em posição de prancha, puxe um cotovelo para trás alternadamente, simulando uma remada.', '["lesao_ombro","lesao_lombar"]', 1);

-- LEGS (Home)
INSERT INTO exercises (slug, name_pt, muscle_groups, equipment_required, difficulty, description_pt, contraindications, is_active) VALUES
('bodyweight-squats', 'Agachamento Livre', '["pernas","gluteos"]', '[]', 'beginner', 'Agachamento clássico com peso corporal. Desça até coxas paralelas ao chão, mantendo joelhos alinhados com os pés.', '["lesao_joelho","lesao_quadril"]', 1),
('jump-squats', 'Agachamento com Salto', '["pernas","gluteos","cardio"]', '[]', 'intermediate', 'Agachamento explosivo com salto. Excelente para potência e condicionamento cardiovascular.', '["lesao_joelho","lesao_tornozelo","lesao_lombar"]', 1),
('lunges', 'Afundo', '["pernas","gluteos"]', '[]', 'beginner', 'Dê um passo à frente e flexione ambos os joelhos até 90 graus. Alterna as pernas.', '["lesao_joelho","lesao_quadril"]', 1),
('bulgarian-split-squat', 'Agachamento Búlgaro', '["pernas","gluteos"]', '["cadeira"]', 'intermediate', 'Apoie um pé em uma cadeira atrás de você e agache com a perna da frente. Excelente para glúteos e quadríceps.', '["lesao_joelho","lesao_quadril"]', 1),
('glute-bridges', 'Ponte de Glúteo', '["gluteos","posterior_coxa"]', '[]', 'beginner', 'Deitado de costas, joelhos flexionados, eleve o quadril contraindo os glúteos no topo.', '["lesao_lombar"]', 1),
('single-leg-glute-bridge', 'Ponte de Glúteo Unilateral', '["gluteos","posterior_coxa","core"]', '[]', 'intermediate', 'Variação da ponte com uma perna estendida, aumentando a dificuldade e trabalhando estabilidade.', '["lesao_lombar","lesao_quadril"]', 1),
('wall-sit', 'Cadeira na Parede', '["pernas","gluteos"]', '[]', 'beginner', 'Costas na parede, desça até coxas paralelas ao chão e segure a posição. Excelente isométrico para quadríceps.', '["lesao_joelho"]', 1),
('calf-raises', 'Elevação de Panturrilha', '["panturrilha"]', '[]', 'beginner', 'Em pé, eleve-se na ponta dos pés e desça controladamente. Pode ser feito em um degrau para maior amplitude.', '["lesao_tornozelo"]', 1);

-- CORE (Home)
INSERT INTO exercises (slug, name_pt, muscle_groups, equipment_required, difficulty, description_pt, contraindications, is_active) VALUES
('plank', 'Prancha', '["core","ombros"]', '[]', 'beginner', 'Apoio de antebraços em linha reta dos ombros aos calcanhares. Contraia abdômen e glúteos.', '["lesao_lombar","lesao_ombro"]', 1),
('side-plank', 'Prancha Lateral', '["core_obliquo","ombros"]', '[]', 'intermediate', 'Apoio lateral em um antebraço, corpo em linha reta. Trabalha intensamente os oblíquos.', '["lesao_lombar","lesao_ombro","lesao_quadril"]', 1),
('crunches', 'Abdominal Tradicional', '["core"]', '[]', 'beginner', 'Deitado de costas, joelhos flexionados, eleve o tronco contraindo o abdômen. Não puxe o pescoço.', '["lesao_lombar","lesao_pescoco"]', 1),
('bicycle-crunches', 'Abdominal Bicicleta', '["core","core_obliquo"]', '[]', 'intermediate', 'Alterne cotovelo com joelho oposto em movimento de pedalada. Excelente para core e oblíquos.', '["lesao_lombar","lesao_pescoco"]', 1),
('leg-raises', 'Elevação de Pernas', '["core_inferior"]', '[]', 'intermediate', 'Deitado de costas, eleve as pernas estendidas mantendo lombar no chão. Foca no abdômen inferior.', '["lesao_lombar"]', 1),
('mountain-climbers', 'Alpinista', '["core","cardio","ombros"]', '[]', 'intermediate', 'Em posição de prancha, alterne joelhos ao peito rapidamente. Ótimo para core e cardio.', '["lesao_lombar","lesao_ombro","lesao_pulso"]', 1),
('russian-twists', 'Torção Russa', '["core_obliquo"]', '[]', 'intermediate', 'Sentado com pés elevados, gire o tronco de um lado para outro. Trabalha oblíquos intensamente.', '["lesao_lombar"]', 1),
('dead-bug', 'Inseto Morto', '["core","estabilidade"]', '[]', 'beginner', 'Deitado de costas, alterne braço e perna oposta mantendo lombar colada no chão. Ótimo para estabilidade do core.', '["lesao_lombar"]', 1);

-- CARDIO (Home)
INSERT INTO exercises (slug, name_pt, muscle_groups, equipment_required, difficulty, description_pt, contraindications, is_active) VALUES
('jumping-jacks', 'Polichinelo', '["cardio","corpo_todo"]', '[]', 'beginner', 'Salte abrindo pernas e braços simultaneamente. Clássico exercício cardiovascular.', '["lesao_joelho","lesao_tornozelo"]', 1),
('high-knees', 'Joelho Alto', '["cardio","pernas"]', '[]', 'beginner', 'Corra no lugar elevando os joelhos ao máximo. Excelente para frequência cardíaca.', '["lesao_joelho","lesao_quadril"]', 1),
('burpees', 'Burpee', '["cardio","corpo_todo"]', '[]', 'advanced', 'Agache, apoie mãos, pule para prancha, faça flexão, pule pés para mãos, salte com braços elevados. Exercício completo de alta intensidade.', '["lesao_joelho","lesao_ombro","lesao_lombar","lesao_pulso"]', 1),
('butt-kicks', 'Chute ao Glúteo', '["cardio","posterior_coxa"]', '[]', 'beginner', 'Corra no lugar levando calcanhares ao glúteo. Trabalha cardio e alongamento de quadríceps.', '["lesao_joelho"]', 1),
('skater-hops', 'Salto do Patinador', '["cardio","pernas","gluteos"]', '[]', 'intermediate', 'Salte lateralmente de uma perna para outra, imitando movimento de patinação. Trabalha potência lateral.', '["lesao_joelho","lesao_tornozelo"]', 1);

-- ============================================================
-- EXERCISES - GYM (With Equipment)
-- ============================================================

-- CHEST (Gym)
INSERT INTO exercises (slug, name_pt, muscle_groups, equipment_required, difficulty, description_pt, contraindications, is_active) VALUES
('barbell-bench-press', 'Supino Reto com Barra', '["peito","triceps","ombros"]', '["barra","banco"]', 'intermediate', 'Exercício fundamental para peito. Deite no banco, abaixe barra até peito e empurre para cima.', '["lesao_ombro","lesao_pulso","lesao_cotovelo"]', 1),
('incline-bench-press', 'Supino Inclinado', '["peito_superior","ombros","triceps"]', '["barra","banco_inclinado"]', 'intermediate', 'Supino em banco inclinado (30-45°), focando na parte superior do peito.', '["lesao_ombro","lesao_pulso"]', 1),
('dumbbell-bench-press', 'Supino com Halteres', '["peito","triceps","ombros"]', '["halteres","banco"]', 'intermediate', 'Supino com halteres permite maior amplitude de movimento e trabalho de estabilização.', '["lesao_ombro","lesao_pulso"]', 1),
('dumbbell-flyes', 'Crucifixo com Halteres', '["peito"]', '["halteres","banco"]', 'intermediate', 'Abra os braços em arco com halteres, focando no alongamento e contração do peito.', '["lesao_ombro","lesao_cotovelo"]', 1),
('cable-crossover', 'Crossover no Cabo', '["peito"]', '["cabo"]', 'intermediate', 'Cruze os cabos à frente do corpo em movimento de abraço, trabalhando contração máxima do peito.', '["lesao_ombro"]', 1),
('chest-dips', 'Mergulho no Paralelo (Peito)', '["peito","triceps"]', '["paralelas"]', 'advanced', 'Mergulho com inclinação para frente, focando no peito. Exercício avançado de peso corporal.', '["lesao_ombro","lesao_cotovelo"]', 1);

-- BACK (Gym)
INSERT INTO exercises (slug, name_pt, muscle_groups, equipment_required, difficulty, description_pt, contraindications, is_active) VALUES
('deadlift', 'Levantamento Terra', '["costas","pernas","gluteos","posterior_coxa"]', '["barra"]', 'advanced', 'Rei dos exercícios compostos. Levante barra do chão até posição ereta mantendo costas retas.', '["lesao_lombar","lesao_joelho"]', 1),
('barbell-rows', 'Remada Curvada com Barra', '["costas","biceps"]', '["barra"]', 'intermediate', 'Incline tronco e puxe barra em direção ao abdômen, contraindo as costas.', '["lesao_lombar","lesao_ombro"]', 1),
('lat-pulldown', 'Puxada na Polia Alta', '["costas","biceps"]', '["polia"]', 'beginner', 'Puxe barra da polia em direção ao peito, focando em contrair as costas (latíssimo do dorso).', '["lesao_ombro"]', 1),
('cable-rows', 'Remada no Cabo Sentado', '["costas","biceps"]', '["cabo"]', 'beginner', 'Sentado, puxe cabo em direção ao abdômen, mantendo costas eretas.', '["lesao_lombar","lesao_ombro"]', 1),
('pull-ups', 'Barra Fixa', '["costas","biceps"]', '["barra_fixa"]', 'advanced', 'Puxe-se na barra até queixo passar a barra. Exercício clássico de peso corporal para costas.', '["lesao_ombro","lesao_cotovelo"]', 1),
('t-bar-rows', 'Remada T', '["costas","biceps"]', '["barra_t"]', 'intermediate', 'Remada com barra T, excelente para espessura das costas.', '["lesao_lombar","lesao_ombro"]', 1),
('face-pulls', 'Puxada para o Rosto', '["ombros_posterior","costas_superior"]', '["cabo"]', 'beginner', 'Puxe cabo em direção ao rosto, separando mãos. Excelente para deltoide posterior e saúde dos ombros.', '["lesao_ombro"]', 1);

-- SHOULDERS (Gym)
INSERT INTO exercises (slug, name_pt, muscle_groups, equipment_required, difficulty, description_pt, contraindications, is_active) VALUES
('overhead-press', 'Desenvolvimento com Barra', '["ombros","triceps"]', '["barra"]', 'intermediate', 'Em pé ou sentado, empurre barra acima da cabeça. Fundamental para ombros.', '["lesao_ombro","lesao_lombar"]', 1),
('dumbbell-shoulder-press', 'Desenvolvimento com Halteres', '["ombros","triceps"]', '["halteres"]', 'intermediate', 'Empurre halteres acima da cabeça, permite maior amplitude e trabalho unilateral.', '["lesao_ombro"]', 1),
('lateral-raises', 'Elevação Lateral', '["ombros_lateral"]', '["halteres"]', 'beginner', 'Eleve halteres lateralmente até ombros, focando no deltoide lateral.', '["lesao_ombro"]', 1),
('front-raises', 'Elevação Frontal', '["ombros_frontal"]', '["halteres"]', 'beginner', 'Eleve halteres à frente até altura dos ombros, trabalhando deltoide frontal.', '["lesao_ombro"]', 1),
('rear-delt-flyes', 'Crucifixo Inverso', '["ombros_posterior"]', '["halteres","banco"]', 'beginner', 'Inclinado no banco, abra halteres lateralmente, focando no deltoide posterior.', '["lesao_ombro"]', 1);

-- ARMS (Gym)
INSERT INTO exercises (slug, name_pt, muscle_groups, equipment_required, difficulty, description_pt, contraindications, is_active) VALUES
('barbell-curls', 'Rosca Direta com Barra', '["biceps"]', '["barra"]', 'beginner', 'Flexione cotovelos levantando barra em direção aos ombros. Clássico para bíceps.', '["lesao_cotovelo","lesao_pulso"]', 1),
('dumbbell-curls', 'Rosca Direta com Halteres', '["biceps"]', '["halteres"]', 'beginner', 'Rosca com halteres permite rotação natural do punho e trabalho unilateral.', '["lesao_cotovelo","lesao_pulso"]', 1),
('hammer-curls', 'Rosca Martelo', '["biceps","antebraco"]', '["halteres"]', 'beginner', 'Rosca com pegada neutra (palmas se olhando), trabalha bíceps e braquial.', '["lesao_cotovelo"]', 1),
('tricep-pushdown', 'Tríceps na Polia', '["triceps"]', '["cabo"]', 'beginner', 'Empurre corda ou barra para baixo na polia, estendendo cotovelos.', '["lesao_cotovelo","lesao_ombro"]', 1),
('overhead-tricep-extension', 'Tríceps Testa', '["triceps"]', '["halteres"]', 'beginner', 'Deite e abaixe halteres em direção à testa, focando nos tríceps.', '["lesao_cotovelo","lesao_ombro"]', 1),
('preacher-curls', 'Rosca Scott', '["biceps"]', '["barra","banco_scott"]', 'intermediate', 'Rosca no banco Scott isola bíceps, eliminando impulso.', '["lesao_cotovelo","lesao_pulso"]', 1);

-- LEGS (Gym)
INSERT INTO exercises (slug, name_pt, muscle_groups, equipment_required, difficulty, description_pt, contraindications, is_active) VALUES
('barbell-squats', 'Agachamento com Barra', '["pernas","gluteos"]', '["barra","rack"]', 'intermediate', 'Rei dos exercícios para pernas. Barra nas costas, agache até coxas paralelas ou abaixo.', '["lesao_joelho","lesao_lombar","lesao_quadril"]', 1),
('front-squats', 'Agachamento Frontal', '["pernas","gluteos","core"]', '["barra","rack"]', 'advanced', 'Barra na frente dos ombros, mantém tronco mais ereto, trabalha mais quadríceps.', '["lesao_joelho","lesao_lombar","lesao_pulso"]', 1),
('leg-press', 'Leg Press', '["pernas","gluteos"]', '["leg_press"]', 'beginner', 'Empurre plataforma com pés, exercício fundamental para pernas com menor demanda técnica.', '["lesao_joelho","lesao_lombar"]', 1),
('leg-extension', 'Cadeira Extensora', '["quadriceps"]', '["cadeira_extensora"]', 'beginner', 'Isolamento de quadríceps. Estenda joelhos contra resistência.', '["lesao_joelho"]', 1),
('leg-curl', 'Mesa Flexora', '["posterior_coxa"]', '["mesa_flexora"]', 'beginner', 'Isolamento de posterior de coxa. Flexione joelhos contra resistência.', '["lesao_joelho"]', 1),
('romanian-deadlift', 'Levantamento Terra Romeno', '["posterior_coxa","gluteos","lombar"]', '["barra"]', 'intermediate', 'Variação do terra focando posterior de coxa. Desça barra mantendo joelhos levemente flexionados.', '["lesao_lombar","lesao_posterior_coxa"]', 1),
('walking-lunges', 'Afundo Caminhando', '["pernas","gluteos"]', '["halteres"]', 'intermediate', 'Afundos alternados caminhando para frente com halteres. Excelente funcional.', '["lesao_joelho","lesao_quadril"]', 1),
('hack-squat', 'Hack Squat', '["pernas","gluteos"]', '["hack_squat"]', 'intermediate', 'Agachamento em máquina hack, focando quadríceps com costas apoiadas.', '["lesao_joelho"]', 1),
('standing-calf-raises', 'Elevação de Panturrilha em Pé', '["panturrilha"]', '["smith_machine"]', 'beginner', 'Elevação de panturrilha com carga, em pé na máquina ou Smith.', '["lesao_tornozelo"]', 1);

-- CORE (Gym)
INSERT INTO exercises (slug, name_pt, muscle_groups, equipment_required, difficulty, description_pt, contraindications, is_active) VALUES
('cable-crunches', 'Abdominal na Polia', '["core"]', '["cabo"]', 'intermediate', 'Ajoelhado, puxe corda da polia contraindo abdômen. Permite progressão de carga.', '["lesao_lombar"]', 1),
('hanging-leg-raises', 'Elevação de Pernas Suspensa', '["core"]', '["barra_fixa"]', 'advanced', 'Pendurado na barra, eleve pernas estendidas. Exercício avançado para core.', '["lesao_lombar","lesao_ombro"]', 1),
('ab-wheel-rollout', 'Roda Abdominal', '["core","ombros"]', '["roda_abdominal"]', 'advanced', 'Role a roda para frente mantendo core contraído. Exercício muito desafiador.', '["lesao_lombar","lesao_ombro"]', 1),
('decline-crunches', 'Abdominal Declinado', '["core"]', '["banco_declinado"]', 'intermediate', 'Abdominal em banco declinado aumenta dificuldade pela gravidade.', '["lesao_lombar"]', 1);

-- ============================================================
-- ACHIEVEMENTS
-- ============================================================

-- STREAK ACHIEVEMENTS
INSERT INTO achievements (slug, name_pt, description_pt, icon_name, category, requirement, rarity, is_active) VALUES
('first-workout', 'Primeiro Passo', 'Complete seu primeiro treino', 'Footprints', 'milestone', 1, 'common', 1),
('week-streak', 'Semana Completa', 'Treine por 7 dias seguidos', 'Calendar', 'streak', 7, 'common', 1),
('two-week-streak', 'Duas Semanas Forte', 'Treine por 14 dias seguidos', 'CalendarCheck2', 'streak', 14, 'rare', 1),
('month-streak', 'Mês Dedicado', 'Treine por 30 dias seguidos', 'CalendarDays', 'streak', 30, 'epic', 1),
('two-month-streak', 'Imparável', 'Treine por 60 dias seguidos', 'Flame', 'streak', 60, 'epic', 1),
('hundred-day-streak', 'Centenário', 'Treine por 100 dias seguidos', 'Trophy', 'streak', 100, 'legendary', 1);

-- MILESTONE ACHIEVEMENTS
INSERT INTO achievements (slug, name_pt, description_pt, icon_name, category, requirement, rarity, is_active) VALUES
('5-workouts', 'Pegando Ritmo', 'Complete 5 treinos', 'Target', 'milestone', 5, 'common', 1),
('10-workouts', 'Consistência', 'Complete 10 treinos', 'TrendingUp', 'milestone', 10, 'common', 1),
('25-workouts', 'Comprometido', 'Complete 25 treinos', 'Award', 'milestone', 25, 'rare', 1),
('50-workouts', 'Guerreiro', 'Complete 50 treinos', 'Swords', 'milestone', 50, 'rare', 1),
('100-workouts', 'Atleta', 'Complete 100 treinos', 'Medal', 'milestone', 100, 'epic', 1),
('250-workouts', 'Lenda Viva', 'Complete 250 treinos', 'Crown', 'milestone', 250, 'epic', 1),
('500-workouts', 'Imortal', 'Complete 500 treinos', 'Gem', 'milestone', 500, 'legendary', 1);

-- SPECIAL ACHIEVEMENTS
INSERT INTO achievements (slug, name_pt, description_pt, icon_name, category, requirement, rarity, is_active) VALUES
('morning-warrior', 'Guerreiro Matinal', 'Complete 10 treinos antes das 8h', 'Sunrise', 'special', 10, 'rare', 1),
('night-owl', 'Coruja Noturna', 'Complete 10 treinos após 20h', 'Moon', 'special', 10, 'rare', 1),
('weekend-warrior', 'Guerreiro de Fim de Semana', 'Complete 20 treinos em finais de semana', 'PartyPopper', 'special', 20, 'rare', 1),
('perfect-week', 'Semana Perfeita', 'Complete todos os treinos programados em uma semana', 'Star', 'special', 1, 'epic', 1),
('comeback-king', 'Rei do Retorno', 'Retome os treinos após 30 dias de pausa', 'Undo2', 'special', 1, 'rare', 1),
('consistency-master', 'Mestre da Consistência', 'Treine 4x por semana durante 4 semanas seguidas', 'CheckCheck', 'special', 16, 'epic', 1),
('early-bird', 'Madrugador', 'Complete um treino antes das 6h', 'AlarmClock', 'special', 1, 'rare', 1);

-- ============================================================
-- END OF SEED DATA
-- ============================================================
