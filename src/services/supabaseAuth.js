import { supabase } from '../config/supabase';
import CryptoJS from 'crypto-js';

// Chave de criptografia (em produção, use uma variável de ambiente)
const ENCRYPTION_KEY = 'facta_secure_key_2025';

/**
 * Criptografa uma string
 */
const encrypt = (text) => {
  return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
};

/**
 * Descriptografa uma string
 */
const decrypt = (encryptedText) => {
  const bytes = CryptoJS.AES.decrypt(encryptedText, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

/**
 * Faz login no Supabase
 * @param {string} email - Email do usuário
 * @param {string} password - Senha do usuário
 * @returns {Promise} - Promise com resultado do login
 */
export const loginSupabase = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw error;
    }

    return {
      success: true,
      user: data.user,
      session: data.session
    };
  } catch (error) {
    console.error('Erro no login Supabase:', error);
    return {
      success: false,
      message: error.message || 'Erro ao fazer login'
    };
  }
};

/**
 * Registra novo usuário no Supabase
 * @param {string} email - Email
 * @param {string} password - Senha
 * @param {string} nome - Nome completo
 * @param {string} factaLogin - Login do Facta
 * @param {string} factaSenha - Senha do Facta
 * @returns {Promise}
 */
export const registrarUsuario = async (email, password, nome, factaLogin, factaSenha) => {
  try {
    // 1. Cria usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password
    });

    if (authError) {
      throw authError;
    }

    // 2. Insere dados na tabela usuarios_facta
    const { error: insertError } = await supabase
      .from('usuarios_facta')
      .insert([{
        id: authData.user.id,
        email,
        nome,
        facta_login: factaLogin,
        facta_senha_encrypted: encrypt(factaSenha),
        ativo: true
      }]);

    if (insertError) {
      throw insertError;
    }

    return {
      success: true,
      message: 'Usuário registrado com sucesso!'
    };
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    return {
      success: false,
      message: error.message || 'Erro ao registrar usuário'
    };
  }
};

/**
 * Obtém credenciais do Facta do usuário logado
 * @returns {Promise} - Promise com credenciais
 */
export const obterCredenciaisFacta = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    const { data, error } = await supabase
      .from('usuarios_facta')
      .select('facta_login, facta_senha_encrypted')
      .eq('id', user.id)
      .eq('ativo', true)
      .single();

    if (error) {
      throw error;
    }

    return {
      success: true,
      login: data.facta_login,
      senha: decrypt(data.facta_senha_encrypted)
    };
  } catch (error) {
    console.error('Erro ao obter credenciais:', error);
    return {
      success: false,
      message: error.message
    };
  }
};

/**
 * Atualiza último login do usuário
 */
export const atualizarUltimoLogin = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      await supabase
        .from('usuarios_facta')
        .update({ last_login: new Date().toISOString() })
        .eq('id', user.id);
    }
  } catch (error) {
    console.error('Erro ao atualizar último login:', error);
  }
};

/**
 * Faz logout do Supabase
 */
export const logoutSupabase = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Erro no logout:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Obtém usuário atual
 */
export const obterUsuarioAtual = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, user: null };
    }

    const { data, error } = await supabase
      .from('usuarios_facta')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;

    return {
      success: true,
      user: {
        ...user,
        nome: data.nome,
        ativo: data.ativo
      }
    };
  } catch (error) {
    return { success: false, user: null };
  }
};

/**
 * Verifica se usuário está autenticado no Supabase
 */
export const estaAutenticadoSupabase = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  } catch (error) {
    return false;
  }
};

/**
 * Altera a senha do usuário no Supabase
 * - Verifica credenciais com signIn
 * - Atualiza a senha via updateUser
 * @param {string} email
 * @param {string} senhaAtual
 * @param {string} novaSenha
 */
export const alterarSenhaSupabase = async (email, senhaAtual, novaSenha) => {
  try {
    // Garante sessão válida validando senha atual
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password: senhaAtual
    });
    if (loginError) throw loginError;

    const { error: updateError } = await supabase.auth.updateUser({
      password: novaSenha
    });
    if (updateError) throw updateError;

    return { success: true, message: 'Senha atualizada com sucesso' };
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    return { success: false, message: error.message || 'Erro ao alterar senha' };
  }
};


