# 🔧 Solução de CORS para Produção

## Problema
Ao fazer deploy no Netlify, a aplicação estava enfrentando erros de CORS ao tentar acessar a API da Facta (`https://cltoff-homol.facta.com.br`).

```
Access to XMLHttpRequest at 'https://cltoff-homol.facta.com.br/gera-token' 
from origin 'https://facta-production.netlify.app' 
has been blocked by CORS policy
```

## Solução: Netlify Functions como Proxy

Criamos **Netlify Functions** (serverless) para fazer proxy das requisições e contornar o CORS.

### Arquivos Criados

#### 1. `netlify.toml`
Configuração do Netlify com build settings e headers de segurança.

#### 2. `netlify/functions/api-proxy.js`
Função serverless que faz proxy de todas as chamadas da API:
- Recebe requisições do frontend
- Encaminha para `https://cltoff-homol.facta.com.br`
- Adiciona headers CORS adequados
- Retorna resposta para o frontend

#### 3. `netlify/functions/gera-token.js`
Função serverless específica para geração de token:
- Recebe login e senha via POST
- Faz requisição para a API da Facta
- Retorna token com headers CORS

### Mudanças no Código

#### `src/services/api.js`
```javascript
// Antes (com CORS error)
const API_BASE_URL = '/api'; // Não funciona em produção

// Depois (solução com proxy)
const API_BASE_URL = import.meta.env.DEV 
  ? '/api'  // Desenvolvimento: usa proxy do Vite
  : '/.netlify/functions/api-proxy'; // Produção: usa Netlify Function
```

#### `src/services/auth.js`
```javascript
// Usa Netlify Function para gerar token em produção
const url = import.meta.env.DEV 
  ? '/gera-token' 
  : '/.netlify/functions/gera-token';
```

## Como Fazer Deploy

### 1. Commit e Push
```bash
git add .
git commit -m "fix: adiciona Netlify Functions para resolver CORS"
git push origin main
```

### 2. Configurar Variáveis de Ambiente no Netlify

Acesse: **Site Settings → Environment Variables**

Adicione:
```
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_supabase
```

### 3. Deploy Automático
O Netlify vai:
1. Detectar o push
2. Executar `npm run build`
3. Criar as Netlify Functions automaticamente
4. Fazer deploy

## Fluxo de Requisições

### Desenvolvimento (Local)
```
Frontend → Vite Proxy (/api) → API Facta
```

### Produção (Netlify)
```
Frontend → Netlify Function (/.netlify/functions/api-proxy) → API Facta
                  ↓
            Adiciona CORS
                  ↓
              Frontend
```

## Vantagens

✅ **Sem CORS**: As requisições são feitas server-side  
✅ **Segurança**: Credenciais não expostas no client  
✅ **Compatibilidade**: Funciona em dev e produção  
✅ **Simples**: Não precisa modificar backend da Facta  

## Testes

Após deploy, teste:

1. **Login**: Deve gerar token com sucesso
2. **Busca de CPF**: Deve consultar normalmente
3. **Upload de planilha**: Deve processar em lote

## Troubleshooting

### Erro: Function not found
- Verifique se a pasta `netlify/functions` foi commitada
- Confirme que o `netlify.toml` está configurado

### Erro: 500 Internal Server Error
- Verifique os logs no Netlify: **Functions → Logs**
- API da Facta pode estar fora do ar

### Token não gerado
- Verifique se as credenciais estão corretas
- Teste a API diretamente: `https://cltoff-homol.facta.com.br/gera-token`

## Monitoramento

Acesse os logs das funções:
1. Vá para o Dashboard do Netlify
2. Site → **Functions**
3. Clique na função
4. Veja os logs em tempo real

---

**Status**: ✅ Implementado e pronto para deploy  
**Data**: Novembro 2025

