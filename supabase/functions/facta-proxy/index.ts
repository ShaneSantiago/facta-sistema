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
    const { action, cpf, login, senha, token } = await req.json();

    if (action === 'gera-token') {
      const credentials = btoa(`${login}:${senha}`);
      const res = await fetch(`${API_BASE}/gera-token`, {
        headers: { 'Authorization': `Basic ${credentials}` }
      });
      const data = await res.json();
      return new Response(JSON.stringify(data), { headers: corsHeaders, status: res.status });
    }

    if (action === 'buscar-cpf') {
      const res = await fetch(`${API_BASE}/clt/base-offline?cpf=${cpf}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      const data = await res.json();
      return new Response(JSON.stringify(data), { headers: corsHeaders, status: res.status });
    }

    return new Response(JSON.stringify({ erro: true, mensagem: 'Ação inválida' }), { headers: corsHeaders, status: 400 });
  } catch (e) {
    return new Response(JSON.stringify({ erro: true, mensagem: e.message }), { headers: corsHeaders, status: 500 });
  }
});