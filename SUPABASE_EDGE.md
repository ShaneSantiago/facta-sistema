# ⚙️ Proxy de CORS via Supabase Edge Functions

Este guia mostra como criar uma **Supabase Edge Function** que atua como proxy para a API da Facta, eliminando erros de CORS em produção.

## Visão Geral

- Frontend chama `supabase.functions.invoke('facta-proxy')`
- A Edge Function faz a requisição server-side para a API da Facta
- Responde ao frontend com JSON e cabeçalhos CORS adequados

## Pré-requisitos

- Supabase CLI instalado: `npm i -g supabase`
- Projeto Supabase vinculado ao seu workspace
- Variáveis de ambiente configuradas no Netlify (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)

## Passo a Passo

### 1) Criar a função

```bash
supabase functions new facta-proxy
```

Isso cria `supabase/functions/facta-proxy/index.ts`.

### 2) Código da função (index.ts)

```ts
// supabase/functions/facta-proxy/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const API_BASE = 'https://cltoff-homol.facta.com.br';
const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('', { headers: corsHeaders });
  }

  try {
    const { action, cpf, login, senha } = await req.json();

    if (action === 'gera-token') {
      const credentials = btoa(`${login}:${senha}`);
      const res = await fetch(`${API_BASE}/gera-token`, {
        headers: { 'Authorization': `Basic ${credentials}` }
      });
      const data = await res.json();
      return new Response(JSON.stringify(data), { headers: corsHeaders, status: res.status });
    }

    if (action === 'buscar-cpf') {
      const res = await fetch(`${API_BASE}/clt/base-offline?cpf=${cpf}`);
      const data = await res.json();
      return new Response(JSON.stringify(data), { headers: corsHeaders, status: res.status });
    }

    return new Response(JSON.stringify({ erro: true, mensagem: 'Ação inválida' }), { headers: corsHeaders, status: 400 });
  } catch (e) {
    return new Response(JSON.stringify({ erro: true, mensagem: e.message }), { headers: corsHeaders, status: 500 });
  }
});
```

### 3) Rodar localmente

```bash
supabase start
supabase functions serve facta-proxy --env-file .env
```

### 4) Deploy da função

```bash
supabase functions deploy facta-proxy --project-ref <SEU_PROJECT_REF>
```

### 5) Usar no frontend

- Defina `VITE_USE_SUPABASE_PROXY=true` no ambiente de produção.
- O código já está preparado para usar Supabase Functions quando essa flag estiver ativa.

### 6) Testes

- `gera-token`: deve retornar `{ token, expira }`
- `buscar-cpf`: deve retornar `{ dados, mensagem }`

## Observações

- Ao usar `supabase.functions.invoke`, o Supabase gerencia CORS para você.
- Se chamar o endpoint diretamente via `fetch`, mantenha os `corsHeaders` acima.

---

Pronto: com Supabase Edge Functions você elimina CORS sem depender de mudanças na API da Facta e sem precisar de proxy no Netlify.