# 🔐 Configuração do Supabase

## 📋 Checklist de Instalação

- [x] Tabela `usuarios_facta` criada
- [x] Dependências instaladas (`@supabase/supabase-js`, `crypto-js`)
- [x] Variáveis de ambiente configuradas
- [ ] Políticas de segurança (RLS) aplicadas
- [ ] Primeiro usuário cadastrado

---

## 🚀 Passo a Passo

### 1. **Executar Script SQL de Segurança**

1. Acesse seu projeto no Supabase
2. Vá em **SQL Editor**
3. Copie todo o conteúdo do arquivo `supabase_setup.sql`
4. Cole e execute no editor

Isso vai:
- ✅ Habilitar Row Level Security (RLS)
- ✅ Criar políticas de acesso
- ✅ Criar índices para performance
- ✅ Criar tabela de logs (opcional)

---

### 2. **Criar Primeiro Usuário**

#### Opção A: Via Dashboard (Recomendado)

1. No Supabase, vá em **Authentication** → **Users**
2. Clique em **Add user** → **Create new user**
3. Preencha:
   - **Email**: seu@email.com
   - **Password**: sua_senha_segura
4. Confirme e copie o **UUID** gerado

#### Opção B: Via SQL

```sql
-- Depois de criar no Authentication, execute:
INSERT INTO usuarios_facta (
  id,
  email,
  nome,
  facta_login,
  facta_senha_encrypted,
  ativo
) VALUES (
  'UUID_COPIADO_AQUI',
  'seu@email.com',
  'Seu Nome',
  '96788',
  'U2FsdGVkX1...',  -- Deixe vazio, o sistema criptografa
  true
);
```

⚠️ **IMPORTANTE**: O sistema criptografa a senha do Facta automaticamente na primeira renovação de token!

---

### 3. **Configurar Credenciais do Facta**

Você tem 2 opções:

#### Opção A: Sistema faz automaticamente (RECOMENDADO)

1. Faça login no sistema com suas credenciais Supabase
2. Na primeira vez, o modal do Facta vai aparecer
3. Digite login e senha do Facta
4. O sistema salva criptografado no banco
5. Nas próximas vezes, gera token automaticamente!

#### Opção B: Inserir manualmente no banco

```sql
-- Atualize o usuário com credenciais Facta:
UPDATE usuarios_facta
SET 
  facta_login = '96788',
  facta_senha_encrypted = 'SUA_SENHA_FACTA'  -- Sistema criptografa automaticamente
WHERE email = 'seu@email.com';
```

---

## 🔒 Segurança

### **Senhas Criptografadas**

O sistema usa **AES-256** para criptografar senhas do Facta:

- ✅ Senha armazenada criptografada no banco
- ✅ Descriptografada apenas durante uso
- ✅ Nunca exposta no frontend
- ✅ Protegida por RLS do Supabase

### **Row Level Security (RLS)**

Políticas aplicadas:
- ✅ Usuários veem apenas seus dados
- ✅ Ninguém acessa dados de outros usuários
- ✅ Proteção em nível de banco de dados

---

## 📝 Como Funciona o Fluxo

```
1. Usuário abre o sistema
   └─> Verifica se está autenticado no Supabase
   
2. Se NÃO autenticado:
   └─> Mostra tela de login Supabase
   └─> Usuário digita email/senha
   └─> Login validado
   
3. Se autenticado:
   └─> Busca credenciais do Facta no banco
   └─> Gera token Facta automaticamente
   └─> Sistema pronto para usar!
   
4. Renovação de Token:
   └─> Automática usando credenciais salvas
   └─> Ou manual via modal se preferir
```

---

## 👥 Adicionar Novos Usuários

### **Via Dashboard (Mais Fácil)**

1. **Authentication** → **Users** → **Add user**
2. Crie email/senha
3. Copie UUID
4. **SQL Editor**:

```sql
INSERT INTO usuarios_facta (
  id, email, nome, facta_login, facta_senha_encrypted, ativo
) VALUES (
  'UUID_AQUI',
  'novo@email.com',
  'Nome do Usuário',
  '96788',
  '',  -- Vazio, sistema pede na primeira vez
  true
);
```

### **Via Código (Futuro)**

Você pode criar uma tela de cadastro no sistema para adicionar usuários automaticamente!

---

## 🔧 Variáveis de Ambiente

Já configuradas no `.env`:

```env
VITE_API_BASE_URL=/api
VITE_SUPABASE_URL=https://gvzacgkwncwtzlhutlgi.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## ✅ Verificar se Está Funcionando

1. **Reinicie o servidor**: `npm run dev`
2. Abra o sistema
3. Deve aparecer tela de login Supabase
4. Faça login com seu email/senha
5. Sistema deve gerar token Facta automaticamente
6. Pronto! ✨

---

## 🐛 Solução de Problemas

### **Erro: "User already registered"**
O usuário já existe no Authentication, só falta adicionar na tabela `usuarios_facta`.

### **Erro: "Invalid login credentials"**
Email ou senha incorretos no Supabase.

### **Token Facta não gera automaticamente**
Verifique se as credenciais do Facta estão corretas na tabela.

### **RLS está bloqueando acesso**
Execute o script SQL para aplicar as políticas corretamente.

---

## 📊 Recursos Opcionais

### **Tabela de Logs**

Se quiser auditar todas as consultas:

```sql
-- Já incluído no script supabase_setup.sql
-- Registra automaticamente cada consulta realizada
```

### **Super Admin**

Para ter um usuário que vê todos os dados:

```sql
-- Descomente no script supabase_setup.sql
CREATE POLICY "Admin pode ver todos" ...
```

---

## 🎉 Pronto!

Seu sistema agora tem:
- ✅ Autenticação segura com Supabase
- ✅ Múltiplos usuários
- ✅ Credenciais criptografadas
- ✅ Geração automática de token Facta
- ✅ Logs de auditoria (opcional)
- ✅ Proteção com RLS

**Qualquer dúvida, consulte este guia!** 📖


