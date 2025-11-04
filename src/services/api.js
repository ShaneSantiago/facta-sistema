import axios from 'axios';
import { obterToken } from './auth';
import { supabase } from '../config/supabase';

// Em desenvolvimento usa proxy (/api), em produção usa URL direta da API Facta
const API_BASE_URL = import.meta.env.DEV
  ? '/api'
  : 'https://cltoff-homol.facta.com.br';

// Flag opcional para usar Supabase Edge Functions como proxy em produção
const USE_SUPABASE_PROXY = import.meta.env.VITE_USE_SUPABASE_PROXY === 'true';

// Instância do Axios configurada
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar token dinamicamente em cada requisição
api.interceptors.request.use(
  (config) => {
    const token = obterToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Busca dados de um CPF na API da Facta
 * @param {string} cpf - CPF para consulta (apenas números)
 * @returns {Promise} - Promise com os dados retornados
 */
export const buscarPorCPF = async (cpf) => {
  try {
    // Remove qualquer formatação do CPF (pontos, hífen)
    const cpfLimpo = cpf.replace(/\D/g, '');
    
    // Se estiver habilitado, chama Supabase Function para contornar CORS
    if (!import.meta.env.DEV && USE_SUPABASE_PROXY) {
      const token = obterToken();
      const { data, error } = await supabase.functions.invoke('facta-proxy', {
        body: { action: 'buscar-cpf', cpf: cpfLimpo, token }
      });

      if (error) {
        throw new Error(error.message || 'Erro na função Supabase');
      }

      if (data?.erro) {
        throw new Error(data?.mensagem || 'Erro ao buscar dados');
      }

      return {
        success: true,
        data: data?.dados || [],
        message: data?.mensagem
      };
    }

    const response = await api.get(`/base-offline?cpf=${cpfLimpo}`);
    
    if (response.data.erro) {
      throw new Error(response.data.mensagem || 'Erro ao buscar dados');
    }
    
    return {
      success: true,
      data: response.data.dados || [],
      message: response.data.mensagem
    };
  } catch (error) {
    console.error('Erro ao buscar CPF:', cpf, error);
    
    return {
      success: false,
      data: [],
      message: error.response?.data?.mensagem || error.message || 'Erro ao consultar API'
    };
  }
};

/**
 * Busca múltiplos CPFs com controle de concorrência
 * @param {Array<string>} cpfs - Array de CPFs para consulta
 * @param {Function} onProgress - Callback chamado a cada CPF processado
 * @param {Function} shouldContinue - Função que retorna se deve continuar processando
 * @returns {Promise<Array>} - Array com todos os resultados
 */
export const buscarMultiplosCPFs = async (cpfs, onProgress, shouldContinue) => {
  const resultados = [];
  
  for (let i = 0; i < cpfs.length; i++) {
    // Verifica se deve continuar (para pausar/cancelar)
    if (shouldContinue && !shouldContinue()) {
      break;
    }
    
    const cpf = cpfs[i];
    const resultado = await buscarPorCPF(cpf);
    
    // Adiciona o CPF ao resultado para referência
    const resultadoComCPF = {
      cpf,
      ...resultado,
      timestamp: new Date().toISOString()
    };
    
    resultados.push(resultadoComCPF);
    
    // Chama callback de progresso
    if (onProgress) {
      onProgress({
        current: i + 1,
        total: cpfs.length,
        cpf,
        resultado: resultadoComCPF
      });
    }
    
    // Delay de 5 segundos entre requisições para não sobrecarregar a API
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
  
  return resultados;
};

export default api;

