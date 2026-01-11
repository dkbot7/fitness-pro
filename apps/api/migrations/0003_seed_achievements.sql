-- Seed Achievements Data
-- 20 achievements across 3 categories

-- STREAK ACHIEVEMENTS (6)
INSERT OR IGNORE INTO achievements (slug, name_pt, description_pt, icon_name, category, requirement, rarity) VALUES
('streak-3', 'Aquecendo', 'Complete 3 dias consecutivos de treino', 'Flame', 'streak', 3, 'common'),
('streak-7', 'Semana Completa', 'Mantenha uma sequência de 7 dias', 'Trophy', 'streak', 7, 'rare'),
('streak-14', 'Duas Semanas Fortes', 'Sequência de 14 dias de dedicação', 'Zap', 'streak', 14, 'rare'),
('streak-30', 'Mês de Ferro', 'Um mês inteiro de consistência', 'Award', 'streak', 30, 'epic'),
('streak-60', 'Maratonista', '60 dias de treino consecutivo', 'Medal', 'streak', 60, 'epic'),
('streak-100', 'Lenda Viva', '100 dias de sequência imbatível', 'Crown', 'streak', 100, 'legendary');

-- MILESTONE ACHIEVEMENTS (8)
INSERT OR IGNORE INTO achievements (slug, name_pt, description_pt, icon_name, category, requirement, rarity) VALUES
('workouts-1', 'Primeiro Passo', 'Complete seu primeiro treino', 'Check', 'milestone', 1, 'common'),
('workouts-5', 'Ganhando Ritmo', 'Complete 5 treinos no total', 'Heart', 'milestone', 5, 'common'),
('workouts-10', 'Compromisso Firme', '10 treinos completados', 'Target', 'milestone', 10, 'common'),
('workouts-25', 'Guerreiro em Formação', '25 treinos na sua jornada', 'Sword', 'milestone', 25, 'rare'),
('workouts-50', 'Meio Século', '50 treinos de pura dedicação', 'Star', 'milestone', 50, 'rare'),
('workouts-100', 'Centurião', '100 treinos completados', 'Shield', 'milestone', 100, 'epic'),
('workouts-250', 'Elite', '250 treinos - Você é Elite!', 'Gem', 'milestone', 250, 'epic'),
('workouts-500', 'Lendário', '500 treinos - Status de Lenda', 'Sparkles', 'milestone', 500, 'legendary');

-- SPECIAL ACHIEVEMENTS (6)
INSERT OR IGNORE INTO achievements (slug, name_pt, description_pt, icon_name, category, requirement, rarity) VALUES
('perfect-week', 'Semana Perfeita', 'Complete todos os treinos da semana', 'CalendarCheck', 'special', 1, 'epic'),
('early-bird', 'Madrugador', 'Complete um treino antes das 7h', 'Sunrise', 'special', 1, 'rare'),
('night-owl', 'Coruja Noturna', 'Complete um treino depois das 22h', 'Moon', 'special', 1, 'rare'),
('comeback', 'Retorno Triunfante', 'Volte a treinar após 30 dias parado', 'ArrowBigUp', 'special', 1, 'rare'),
('speed-demon', 'Demônio da Velocidade', 'Complete um treino em menos de 20min', 'Rocket', 'special', 1, 'epic'),
('iron-will', 'Vontade de Ferro', 'Complete 10 treinos seguidos sem pular', 'Dumbbell', 'special', 10, 'legendary');
