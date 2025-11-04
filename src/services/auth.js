import axios from 'axios';

const TOKEN_STORAGE_KEY = 'facta_auth_token';
const TOKEN_EXPIRY_KEY = 'facta_token_expiry';

/**
 * Gera um novo token de autenticação
 * @param {string} login - Login do usuário
 * @param {string} senha - Senha do usuário
 * @returns {Promise} - Promise com o token e data de expiração
 */
export const gerarToken = async (login, senha) => {
  try {
    // Em desenvolvimento usa proxy, em produção usa Netlify Function
    const url = import.meta.env.DEV 
      ? '/gera-token' 
      : '/.netlify/functions/gera-token';
    
    // Em produção, enviar credenciais no body via POST
    // Em desenvolvimento, usar Basic Auth
    const response = import.meta.env.DEV
      ? await axios.get(url, {
          headers: {
            'Authorization': `Basic ${btoa(`${login}:${senha}`)}`
          }
        })
      : await axios.post(url, {
          login,
          senha
        });

    if (response.data.erro) {
      throw new Error(response.data.mensagem || 'Erro ao gerar token');
    }

    const { token, expira } = response.data;

    // Salva token e data de expiração no localStorage
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    localStorage.setItem(TOKEN_EXPIRY_KEY, expira);

    return {
      success: true,
      token,
      expira,
      message: response.data.mensagem
    };
  } catch (error) {
    console.error('Erro ao gerar token:', error);
    
    return {
      success: false,
      message: error.response?.data?.mensagem || error.message || 'Erro ao gerar token'
    };
  }
};

/**
 * Obtém o token salvo no localStorage
 * @returns {string|null} - Token salvo ou null
 */
export const obterToken = () => {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
};

/**
 * Obtém a data de expiração do token
 * @returns {string|null} - Data de expiração ou null
 */
export const obterDataExpiracao = () => {
  return localStorage.getItem(TOKEN_EXPIRY_KEY);
};

/**
 * Verifica se o token está expirado
 * @returns {boolean} - true se expirado
 */
export const tokenExpirado = () => {
  const expira = obterDataExpiracao();
  if (!expira) return true;

  // Converte string "04/11/2025 20:39:53" para Date
  const [data, hora] = expira.split(' ');
  const [dia, mes, ano] = data.split('/');
  const dataExpiracao = new Date(`${ano}-${mes}-${dia} ${hora}`);
  
  return new Date() > dataExpiracao;
};

/**
 * Remove token do localStorage (logout)
 */
export const removerToken = () => {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
};

/**
 * Verifica se usuário está autenticado
 * @returns {boolean} - true se autenticado e token válido
 */
export const estaAutenticado = () => {
  const token = obterToken();
  return token && !tokenExpirado();
};

