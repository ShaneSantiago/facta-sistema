-- ============================================
-- CONFIGURAÇÃO DE SEGURANÇA - SUPABASE
-- ============================================

-- 1. Habilitar Row Level Security (RLS)
ALTER TABLE usuarios_facta ENABLE ROW LEVEL SECURITY;

-- 2. Política: Usuários podem ver apenas seus próprios dados
CREATE POLICY "Usuários podem ver seus próprios dados"
ON usuarios_facta
FOR SELECT
USING (auth.uid() = id);

-- 3. Política: Usuários podem atualizar seus próprios dados
CREATE POLICY "Usuários podem atualizar seus próprios dados"
ON usuarios_facta
FOR UPDATE
USING (auth.uid() = id);

-- 4. Política: Admin pode ver todos os usuários (OPCIONAL)
-- Descomente se quiser ter um super admin
/*
CREATE POLICY "Admin pode ver todos"
ON usuarios_facta
FOR SELECT
USING (
  auth.uid() IN (
    SELECT id FROM usuarios_facta WHERE email = 'admin@example.com'
  )
);
*/

-- ============================================
-- INSERIR PRIMEIRO USUÁRIO (ADMIN)
-- ============================================

-- IMPORTANTE: Primeiro crie o usuário no Supabase Auth (manualmente ou via dashboard)
-- Depois insira os dados aqui usando o UUID gerado

-- Exemplo (substitua os valores):
/*
INSERT INTO usuarios_facta (
  id,
  email,
  nome,
  facta_login,
  facta_senha_encrypted,
  ativo
) VALUES (
  'UUID_DO_USUARIO_AQUI', -- UUID gerado pelo Supabase Auth
  'admin@example.com',
  'Administrador',
  '96788', -- Login do Facta
  'SENHA_CRIPTOGRAFADA_AQUI', -- Será criptografada automaticamente pelo sistema
  true
);
*/

-- ============================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios_facta(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_ativo ON usuarios_facta(ativo);
CREATE INDEX IF NOT EXISTS idx_usuarios_last_login ON usuarios_facta(last_login DESC);

-- ============================================
-- FUNÇÃO PARA ATUALIZAR ÚLTIMO LOGIN
-- ============================================

CREATE OR REPLACE FUNCTION update_last_login()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_login = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TABELA DE LOGS (OPCIONAL)
-- ============================================

CREATE TABLE IF NOT EXISTS logs_consultas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID REFERENCES usuarios_facta(id) ON DELETE CASCADE,
  tipo_consulta TEXT CHECK (tipo_consulta IN ('individual', 'lote')),
  cpf_consultado TEXT,
  quantidade_registros INTEGER DEFAULT 0,
  data_consulta TIMESTAMP DEFAULT NOW(),
  duracao_segundos DECIMAL(10,2),
  sucesso BOOLEAN DEFAULT true,
  mensagem_erro TEXT
);

-- Habilitar RLS para logs
ALTER TABLE logs_consultas ENABLE ROW LEVEL SECURITY;

-- Política: Usuários podem ver apenas seus próprios logs
CREATE POLICY "Usuários podem ver seus logs"
ON logs_consultas
FOR SELECT
USING (auth.uid() = usuario_id);

-- Política: Usuários podem inserir seus próprios logs
CREATE POLICY "Usuários podem criar logs"
ON logs_consultas
FOR INSERT
WITH CHECK (auth.uid() = usuario_id);

-- Índices para logs
CREATE INDEX IF NOT EXISTS idx_logs_usuario ON logs_consultas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_logs_data ON logs_consultas(data_consulta DESC);

-- ============================================
-- INSTRUÇÕES DE USO
-- ============================================

-- 1. Execute este script no Supabase SQL Editor
-- 2. Crie o primeiro usuário no Authentication (Dashboard do Supabase)
-- 3. Copie o UUID do usuário criado
-- 4. Insira os dados na tabela usuarios_facta usando o UUID
-- 5. O sistema já está pronto para uso!

-- Para criar usuário via SQL (após criar no Auth):
-- INSERT INTO usuarios_facta VALUES (...);


