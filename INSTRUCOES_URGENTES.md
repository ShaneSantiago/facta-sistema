# ⚠️ INSTRUÇÕES URGENTES - RESOLVER TELA BRANCA

## 🔴 Problema
Tela branca com erro: "Variáveis de ambiente do Supabase não configuradas"

## ✅ SOLUÇÃO (Execute agora!)

### 1. **PARE o servidor atual**
No terminal onde está rodando, pressione:
```
Ctrl + C
```

### 2. **REINICIE o servidor**
```bash
npm run dev
```

### 3. **Aguarde abrir o navegador**
O sistema deve abrir automaticamente em `http://localhost:3000`

---

## 📝 O que foi feito

✅ Arquivo `.env` foi criado com as variáveis corretas:
- `VITE_API_BASE_URL=/api`
- `VITE_SUPABASE_URL=https://gvzacgkwncwtzlhutlgi.supabase.co`
- `VITE_SUPABASE_ANON_KEY=eyJ0eXAi...`

---

## 🎯 Próximos Passos (DEPOIS de reiniciar)

### Passo 1: Configure o Supabase

1. Acesse: https://gvzacgkwncwtzlhutlgi.supabase.co
2. Vá em **SQL Editor**
3. Cole e execute o conteúdo do arquivo `supabase_setup.sql`

### Passo 2: Crie seu usuário

1. No Supabase, vá em **Authentication** → **Users**
2. Clique em **Add user** → **Create new user**
3. Preencha:
   - **Email**: seu@email.com
   - **Password**: suaSenhaSegu ra123
4. Clique em **Create user**
5. **COPIE o UUID gerado**

### Passo 3: Adicione credenciais do Facta

No **SQL Editor** do Supabase, execute:

```sql
INSERT INTO usuarios_facta (
  id,
  email,
  nome,
  facta_login,
  facta_senha_encrypted,
  ativo
) VALUES (
  'UUID_QUE_VOCE_COPIOU',
  'seu@email.com',
  'Seu Nome Completo',
  '96788',
  'sua_senha_do_facta',
  true
);
```

### Passo 4: Teste o sistema

1. Recarregue a página
2. Faça login com email/senha do Supabase
3. Sistema deve gerar token Facta automaticamente
4. Pronto! ✨

---

## 🚨 Se ainda der erro

### Erro: "User not found"
Execute o Passo 2 e 3 acima para criar usuário.

### Erro: "Invalid credentials"
Verifique se email/senha do Supabase estão corretos.

### Erro: "Network error"
O proxy pode não estar funcionando. **Reinicie o servidor!**

---

## 📚 Documentação Completa

Para mais detalhes, consulte:
- `SUPABASE_SETUP.md` - Guia completo de configuração
- `CHANGELOG.md` - Todas as funcionalidades implementadas
- `GUIA_LOGIN.md` - Como funciona o sistema de autenticação

---

## ⚡ RESUMO RÁPIDO

```bash
# 1. PARE o servidor (Ctrl + C)

# 2. REINICIE
npm run dev

# 3. Configure Supabase (SQL Editor)
# Execute: supabase_setup.sql

# 4. Crie usuário (Authentication → Add user)

# 5. Adicione credenciais (SQL Editor)
# INSERT INTO usuarios_facta...

# 6. Faça login e use! 🎉
```

---

**COMECE AGORA PELO PASSO 1: REINICIE O SERVIDOR!** 🚀


