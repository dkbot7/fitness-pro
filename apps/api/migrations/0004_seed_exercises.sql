-- Seed 30 Exercise Catalog
-- Bodyweight (10) + Dumbbells (10) + Gym Equipment (10)

-- BODYWEIGHT EXERCISES (10)
INSERT OR IGNORE INTO exercises (slug, name_pt, muscle_groups, equipment_required, difficulty, description_pt) VALUES
('flexao', 'Flexão de Braço', 'chest,triceps,shoulders', 'bodyweight', 'beginner', 'Deite-se de bruços, mãos na largura dos ombros, empurre o corpo para cima mantendo o core ativado.'),
('agachamento', 'Agachamento Livre', 'legs,glutes,core', 'bodyweight', 'beginner', 'Pés na largura dos ombros, desça como se fosse sentar, joelhos alinhados com os pés.'),
('burpee', 'Burpee', 'full_body,cardio', 'bodyweight', 'intermediate', 'Agachamento, apoie as mãos, salto para prancha, flexão, pule de volta e salte para cima.'),
('prancha', 'Prancha Abdominal', 'core,abs', 'bodyweight', 'beginner', 'Apoie os antebraços e pontas dos pés, mantenha o corpo reto, core contraído.'),
('mountain-climber', 'Mountain Climber', 'core,abs,cardio', 'bodyweight', 'intermediate', 'Posição de prancha alta, alterne trazendo os joelhos em direção ao peito rapidamente.'),
('afundo', 'Afundo', 'legs,glutes', 'bodyweight', 'beginner', 'Dê um passo à frente, desça até o joelho traseiro quase tocar o chão, suba e alterne.'),
('triceps-banco', 'Tríceps no Banco', 'triceps,shoulders', 'bodyweight,bench', 'beginner', 'Apoie as mãos em um banco atrás de você, pernas estendidas, desça flexionando os cotovelos.'),
('abdominal', 'Abdominal Tradicional', 'abs,core', 'bodyweight', 'beginner', 'Deitado, joelhos flexionados, mãos atrás da cabeça, levante o tronco contraindo o abdômen.'),
('polichinelo', 'Polichinelo', 'full_body,cardio', 'bodyweight', 'beginner', 'Salte abrindo pernas e braços simultaneamente, depois volte à posição inicial.'),
('ponte-gluteo', 'Ponte de Glúteo', 'glutes,legs,core', 'bodyweight', 'beginner', 'Deitado de costas, joelhos flexionados, levante o quadril contraindo os glúteos.');

-- DUMBBELL EXERCISES (10)
INSERT OR IGNORE INTO exercises (slug, name_pt, muscle_groups, equipment_required, difficulty, description_pt) VALUES
('supino-halteres', 'Supino com Halteres', 'chest,triceps,shoulders', 'dumbbells,bench', 'intermediate', 'Deitado em banco, halteres ao lado do peito, empurre para cima até estender os braços.'),
('desenvolvimento-halteres', 'Desenvolvimento com Halteres', 'shoulders,triceps', 'dumbbells', 'intermediate', 'Sentado ou em pé, halteres ao lado da cabeça, empurre para cima até estender os braços.'),
('rosca-direta', 'Rosca Direta com Halteres', 'biceps', 'dumbbells', 'beginner', 'Em pé, cotovelos fixos ao lado do corpo, flexione os braços levantando os halteres.'),
('remada-unilateral', 'Remada Unilateral', 'back,biceps', 'dumbbells,bench', 'intermediate', 'Apoie um joelho no banco, puxe o halter em direção ao quadril, cotovelo próximo ao corpo.'),
('elevacao-lateral', 'Elevação Lateral', 'shoulders', 'dumbbells', 'beginner', 'Em pé, braços ao lado do corpo, levante os halteres lateralmente até a altura dos ombros.'),
('triceps-testa', 'Tríceps Testa', 'triceps', 'dumbbells,bench', 'intermediate', 'Deitado, braços estendidos para cima, flexione apenas os cotovelos levando halteres à testa.'),
('agachamento-goblet', 'Agachamento Goblet', 'legs,glutes,core', 'dumbbells', 'beginner', 'Segure um halter na altura do peito, agache mantendo o tronco ereto.'),
('afundo-halteres', 'Afundo com Halteres', 'legs,glutes', 'dumbbells', 'intermediate', 'Halteres nas mãos, execute o afundo tradicional com carga adicional.'),
('crucifixo', 'Crucifixo com Halteres', 'chest', 'dumbbells,bench', 'intermediate', 'Deitado em banco, braços abertos com leve flexão nos cotovelos, junte os halteres acima do peito.'),
('remada-curvada', 'Remada Curvada com Halteres', 'back,biceps', 'dumbbells', 'intermediate', 'Inclinado para frente, puxe os halteres em direção ao abdômen, cotovelos próximos ao corpo.');

-- GYM EQUIPMENT EXERCISES (10)
INSERT OR IGNORE INTO exercises (slug, name_pt, muscle_groups, equipment_required, difficulty, description_pt) VALUES
('supino-barra', 'Supino Reto com Barra', 'chest,triceps,shoulders', 'barbell,bench', 'intermediate', 'Deitado em banco, desça a barra até o peito e empurre para cima.'),
('agachamento-barra', 'Agachamento com Barra', 'legs,glutes,core', 'barbell,squat_rack', 'advanced', 'Barra nas costas, pés na largura dos ombros, agache mantendo a coluna neutra.'),
('levantamento-terra', 'Levantamento Terra', 'back,legs,glutes,core', 'barbell', 'advanced', 'Pegada na barra, levante mantendo a coluna reta, quadril e joelhos estendidos.'),
('puxada-frontal', 'Puxada Frontal', 'back,biceps', 'cable_machine', 'beginner', 'Segure a barra acima da cabeça, puxe até a altura do peito contraindo as costas.'),
('remada-sentado', 'Remada Sentada', 'back,biceps', 'cable_machine', 'beginner', 'Sentado, puxe o cabo em direção ao abdômen, ombros para trás.'),
('leg-press', 'Leg Press', 'legs,glutes', 'leg_press_machine', 'beginner', 'Sentado na máquina, empurre a plataforma com os pés, joelhos alinhados.'),
('rosca-polia', 'Rosca Bíceps na Polia', 'biceps', 'cable_machine', 'beginner', 'De frente para a polia baixa, puxe a barra flexionando os cotovelos.'),
('triceps-polia', 'Tríceps na Polia', 'triceps', 'cable_machine', 'beginner', 'De frente para a polia alta, empurre a barra para baixo estendendo os cotovelos.'),
('desenvolvimento-maquina', 'Desenvolvimento na Máquina', 'shoulders,triceps', 'shoulder_press_machine', 'beginner', 'Sentado na máquina, empurre as alças para cima até estender os braços.'),
('cadeira-extensora', 'Cadeira Extensora', 'legs', 'leg_extension_machine', 'beginner', 'Sentado na máquina, estenda as pernas levantando o peso com os quadríceps.');
