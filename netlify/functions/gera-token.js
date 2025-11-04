const axios = require('axios');

// URL base da API Facta
const API_BASE_URL = 'https://cltoff-homol.facta.com.br';

exports.handler = async (event, context) => {
  // Permitir apenas POST e OPTIONS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    // Extrair credenciais do body
    const { login, senha } = JSON.parse(event.body);

    if (!login || !senha) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          erro: true,
          mensagem: 'Login e senha são obrigatórios'
        })
      };
    }

    // Criar credencial Basic Auth
    const credentials = Buffer.from(`${login}:${senha}`).toString('base64');

    // Fazer requisição GET com Basic Auth para gerar token
    const response = await axios.get(
      `${API_BASE_URL}/gera-token`,
      {
        headers: {
          'Authorization': `Basic ${credentials}`
        },
        timeout: 30000
      }
    );

    // Retornar resposta com headers CORS
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(response.data)
    };

  } catch (error) {
    console.error('Erro ao gerar token:', error.message);
    
    return {
      statusCode: error.response?.status || 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        erro: true,
        mensagem: error.response?.data?.mensagem || 'Erro ao gerar token',
        detalhes: error.response?.data || {}
      })
    };
  }
};
