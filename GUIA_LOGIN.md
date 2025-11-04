# 🔐 Guia do Sistema de Autenticação

## 📋 Visão Geral

O sistema agora possui **autenticação completa com Token JWT**, permitindo que você gere e renove tokens de acesso de forma fácil e automática.

---

## 🎯 Como Funciona

### 1️⃣ **Primeira Vez no Sistema**

Quando você abre o sistema pela primeira vez, verá uma **barra vermelha** no topo:

```
⚠️ Token não configurado
[🔐 Fazer Login]
```

### 2️⃣ **Fazendo Login**

1. Clique no botão **"🔐 Fazer Login"**
2. Um modal elegante aparecerá
3. Digite seu **login** e **senha**
4. Clique em **"Gerar Token"**

**Resposta da API:**
```json
{
  "erro": false,
  "mensagem": "Token gerado com sucesso",
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "expira": "04/11/2025 20:39:53"
}
```

### 3️⃣ **Token Ativo**

Após o login bem-sucedido, a barra ficará **verde**:

```
🟢 Token Ativo
Válido até 04/11/2025 20:39:53
[🔄 Novo Token] [🚪 Logout]
```

---

## ⚡ Funcionalidades

### 🔄 **Renovar Token**

Quando o token estiver perto de expirar ou já expirado:

1. A barra ficará **vermelha** automaticamente
2. Clique em **"🔄 Renovar"**
3. Faça login novamente
4. O novo token será aplicado **automaticamente**

### 🚪 **Logout**

Para remover o token do sistema:

1. Clique em **"🚪 Logout"**
2. Confirme a ação
3. O token será removido e a página recarregará

---

## 🔧 Como o Token é Usado

### **Automático em Todas as Requisições**

O sistema inclui o token **automaticamente** em todas as chamadas à API:

```javascript
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJI...
```

Você **não precisa fazer nada manualmente**! 🎉

### **Atualização Dinâmica**

Quando você gera um novo token:
1. ✅ Salvo no localStorage
2. ✅ Aplicado imediatamente
3. ✅ Todas as próximas requisições usam o novo token
4. ✅ Sem necessidade de recarregar a página

---

## 💾 Armazenamento

### **Onde é Salvo?**

O token é salvo no **localStorage** do navegador:
- `facta_auth_token` → Token JWT
- `facta_token_expiry` → Data de expiração

### **Persistência**

- ✅ Fica salvo mesmo fechando o navegador
- ✅ Disponível em todas as abas
- ✅ Removido apenas com logout ou limpeza manual

---

## 🎨 Estados Visuais

### 🔴 **Token Ausente ou Expirado**
```
⚠️ Token não configurado / Token Expirado
Barra Vermelha
```

### 🟢 **Token Ativo**
```
🟢 Token Ativo
Válido até DD/MM/AAAA HH:MM:SS
Barra Verde
```

---

## 🔑 Endpoint de Autenticação

**URL:** `https://cltoff-homol.facta.com.br/gera-token`

**Método:** GET

**Autenticação:** Basic Auth (login:senha em Base64)

**Headers:**
```
Authorization: Basic base64(login:senha)
```

**Resposta de Sucesso:**
```json
{
  "erro": false,
  "mensagem": "Token gerado com sucesso",
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "expira": "04/11/2025 20:39:53"
}
```

---

## ⚠️ Observações Importantes

### **Expiração**
- O token tem validade limitada
- A data de expiração é mostrada na barra
- Quando expirar, você precisará gerar um novo

### **Segurança**
- O token nunca é exposto no código-fonte
- Salvo apenas no localStorage local
- Use sempre uma conexão segura (HTTPS)

### **Renovação Proativa**
- O sistema **não renova automaticamente** quando expira
- Você deve clicar em "Renovar" manualmente
- Sugestão: Renove antes de expirar para evitar interrupções

---

## 🐛 Solução de Problemas

### **Erro ao gerar token**
- Verifique login e senha
- Confirme que tem conexão com a internet
- Verifique se a API está disponível

### **Token não está funcionando**
- Clique em "Logout" e faça login novamente
- Limpe o cache do navegador
- Verifique se o token não expirou

### **Barra sempre vermelha**
- Faça logout e login novamente
- Limpe o localStorage manualmente (F12 → Application → Local Storage)

---

## 📝 Resumo Rápido

1. **Primeira vez**: Clique em "Fazer Login"
2. **Digite**: Login e senha
3. **Pronto**: Token gerado e salvo automaticamente
4. **Use**: Todas as consultas funcionarão normalmente
5. **Renove**: Quando o token expirar
6. **Logout**: Quando quiser remover o token

---

## 🎯 Vantagens do Sistema

✅ **Fácil de usar** - Interface intuitiva  
✅ **Automático** - Token aplicado em todas as requisições  
✅ **Seguro** - Armazenamento local protegido  
✅ **Visual** - Feedback claro do status  
✅ **Flexível** - Renove quando necessário  

---

**Pronto para usar!** 🚀 

Faça login agora e comece a usar o sistema com autenticação completa.

