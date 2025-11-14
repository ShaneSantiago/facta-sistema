# 🚀 Guia de Deploy no Netlify

## Passo a Passo para Deploy

### 1️⃣ Preparar o Código

Certifique-se de que todos os arquivos foram commitados:

```bash
git add .
git commit -m "fix: adiciona Netlify Functions para resolver CORS + novo design"
git push origin main
```

### 2️⃣ Criar Site no Netlify

#### Opção A: Via GitHub/GitLab (Recomendado)
1. Acesse [netlify.com](https://netlify.com)
2. Clique em **"Add new site" → "Import an existing project"**
3. Conecte com GitHub/GitLab
4. Selecione o repositório
5. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Functions directory**: `netlify/functions` (auto-detectado)

#### Opção B: Via Netlify CLI
```bash
# Instalar CLI
npm install -g netlify-cli

# Login
netlify login

# Inicializar
netlify init

# Deploy
netlify deploy --prod
```

### 3️⃣ Configurar Variáveis de Ambiente

No Dashboard do Netlify:

1. Vá para **Site Settings → Environment Variables**
2. Clique em **"Add a variable"**
3. Adicione:

```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_supabase
```

4. Clique em **"Save"**
5. **Redeploy** o site para aplicar as variáveis

### 4️⃣ Verificar Deploy

Após o deploy, verifique:

✅ **Build bem-sucedido**: Sem erros no log  
✅ **Functions criadas**: Veja em "Functions" no dashboard  
✅ **Site acessível**: URL do Netlify funcionando  

### 5️⃣ Testar Funcionalidades

Acesse seu site e teste:

1. **Login**: Faça login com suas credenciais do Supabase
2. **Gerar Token**: Sistema deve gerar token automaticamente
3. **Buscar CPF**: Teste busca individual
4. **Upload**: Teste upload de planilha

## 📁 Estrutura do Deploy

```
dist/                       # Build da aplicação React
netlify/
  functions/
    api-proxy.js           # Proxy para API da Facta
    gera-token.js          # Gerador de token
netlify.toml               # Configuração do Netlify
```

## 🔧 Troubleshooting

### Erro: Build Failed

**Problema**: Erro durante npm run build  
**Solução**:
```bash
# Teste localmente
npm run build

# Veja os erros e corrija
# Depois commit e push novamente
```

### Erro: Function not found

**Problema**: Netlify não encontra as functions  
**Solução**:
1. Verifique se `netlify/functions/` está no repositório
2. Confirme que `netlify.toml` está configurado
3. Faça redeploy

### Erro: Environment Variables

**Problema**: VITE_SUPABASE_URL is not defined  
**Solução**:
1. Adicione as variáveis em Site Settings
2. Clique em "Trigger deploy" → "Clear cache and deploy"

### Erro: CORS ainda acontecendo

**Problema**: Ainda há erros de CORS  
**Solução**:
1. Verifique se as Netlify Functions estão ativas
2. Veja os logs: Functions → nome da função → Recent logs
3. Teste a function diretamente: `https://seu-site.netlify.app/.netlify/functions/gera-token`

## 📊 Monitoramento

### Ver Logs das Functions

1. Dashboard → **Functions**
2. Clique na função (api-proxy ou gera-token)
3. Veja **Recent logs**

### Verificar Build

1. Dashboard → **Deploys**
2. Clique no último deploy
3. Veja **Deploy log**

### Analytics

1. Dashboard → **Analytics**
2. Veja uso de banda, visitas, etc.

## 🔒 Segurança

### Headers de Segurança (já configurados)

No `netlify.toml`:
```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "no-referrer"
```

### HTTPS

✅ O Netlify fornece HTTPS automático  
✅ Certificado SSL/TLS gratuito  
✅ Renovação automática  

## 🌐 Custom Domain (Opcional)

Para usar domínio próprio:

1. Dashboard → **Domain settings**
2. Clique em **"Add custom domain"**
3. Digite seu domínio
4. Configure DNS conforme instruções
5. Aguarde propagação (até 48h)

## 💰 Limites do Plano Free

- ✅ 100GB bandwidth/mês
- ✅ 300 minutos de build/mês
- ✅ Netlify Functions: 125k requests/mês
- ✅ Deploys ilimitados

## 📈 Otimizações

### Build Time
Já otimizado com Vite - builds rápidos!

### Performance
- ✅ Compressão Gzip/Brotli automática
- ✅ CDN global do Netlify
- ✅ Cache de assets estáticos

### Functions
- ✅ Cold start otimizado
- ✅ Cache de responses quando possível

## 🎉 Pronto!

Seu sistema está no ar com:
- ✅ CORS resolvido via Netlify Functions
- ✅ Design moderno com nova paleta
- ✅ Ícones profissionais (HeroIcons)
- ✅ HTTPS automático
- ✅ Deploy contínuo

## 📞 Suporte

Problemas? Verifique:
1. [Netlify Docs](https://docs.netlify.com/)
2. [Netlify Community](https://answers.netlify.com/)
3. Logs das Functions no dashboard

---

**Última atualização**: Novembro 2025  
**Status**: ✅ Pronto para produção


