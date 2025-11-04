const STORAGE_KEY = 'facta_consultas';

/**
 * Salva resultados no localStorage
 * @param {Array} dados - Array de resultados para salvar
 */
export const salvarResultados = (dados) => {
  try {
    const dadosExistentes = carregarResultados();
    const todosOsDados = [...dadosExistentes, ...dados];
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todosOsDados));
    return true;
  } catch (error) {
    console.error('Erro ao salvar no localStorage:', error);
    return false;
  }
};

/**
 * Carrega resultados do localStorage
 * @returns {Array} - Array de resultados salvos
 */
export const carregarResultados = () => {
  try {
    const dados = localStorage.getItem(STORAGE_KEY);
    return dados ? JSON.parse(dados) : [];
  } catch (error) {
    console.error('Erro ao carregar do localStorage:', error);
    return [];
  }
};

/**
 * Limpa todos os resultados do localStorage
 */
export const limparResultados = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Erro ao limpar localStorage:', error);
    return false;
  }
};

/**
 * Atualiza resultados existentes (substitui tudo)
 * @param {Array} dados - Novos dados para substituir
 */
export const atualizarResultados = (dados) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dados));
    return true;
  } catch (error) {
    console.error('Erro ao atualizar localStorage:', error);
    return false;
  }
};

/**
 * Remove um resultado específico pelo CPF e timestamp
 * @param {string} cpf - CPF do resultado a remover
 * @param {string} timestamp - Timestamp do resultado
 */
export const removerResultado = (cpf, timestamp) => {
  try {
    const dados = carregarResultados();
    const novosDados = dados.filter(
      item => !(item.cpf === cpf && item.timestamp === timestamp)
    );
    atualizarResultados(novosDados);
    return true;
  } catch (error) {
    console.error('Erro ao remover resultado:', error);
    return false;
  }
};

