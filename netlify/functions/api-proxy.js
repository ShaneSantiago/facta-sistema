const axios = require('axios');

// URL base da API Facta
const API_BASE_URL = 'https://cltoff-homol.facta.com.br';

exports.handler = async (event, context) => {
  // Permitir apenas métodos HTTP específicos
  const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'];
  
  if (!allowedMethods.includes(event.httpMethod)) {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  // Responder a requisições OPTIONS (preflight CORS)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
      },
      body: ''
    };
  }

  try {
    // Extrair o path da requisição
    const path = event.path.replace('/.netlify/functions/api-proxy', '');
    const url = `${API_BASE_URL}${path}${event.rawQuery ? '?' + event.rawQuery : ''}`;

    // Preparar headers
    const headers = {
      'Content-Type': 'application/json'
    };

    // Adicionar token de autorização se presente
    if (event.headers.authorization) {
      headers['Authorization'] = event.headers.authorization;
    }

    // Fazer a requisição para a API real
    const response = await axios({
      method: event.httpMethod,
      url: url,
      headers: headers,
      data: event.body ? JSON.parse(event.body) : undefined,
      timeout: 30000
    });

    // Retornar resposta com headers CORS
    return {
      statusCode: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(response.data)
    };

  } catch (error) {
    console.error('Erro no proxy:', error.message);
    
    // Retornar erro com detalhes
    return {
      statusCode: error.response?.status || 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        erro: true,
        mensagem: error.response?.data?.mensagem || error.message || 'Erro ao acessar API',
        detalhes: error.response?.data || {}
      })
    };
  }
};


