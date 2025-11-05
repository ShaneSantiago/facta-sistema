const STORAGE_KEY = 'facta_consultas';
const JOB_STORAGE_KEY = 'facta_job_lote';

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

/**
 * Salva o estado do processamento em lote (planilha, CPFs, progresso, pausa)
 * @param {Object} estado - Objeto contendo arquivoNome, cpfs, limite, progresso, pausado, processando
 */
export const salvarEstadoLote = (estado) => {
  try {
    const payload = {
      arquivoNome: estado.arquivoNome || null,
      cpfs: Array.isArray(estado.cpfs) ? estado.cpfs : [],
      limite: typeof estado.limite === 'number' ? estado.limite : parseInt(estado.limite) || 0,
      progresso: estado.progresso || { current: 0, total: 0 },
      pausado: !!estado.pausado,
      processando: !!estado.processando,
      atualizadoEm: new Date().toISOString()
    };
    localStorage.setItem(JOB_STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch (error) {
    console.error('Erro ao salvar estado de lote no localStorage:', error);
    return false;
  }
};

/**
 * Carrega o estado do processamento em lote
 * @returns {Object|null} - Estado salvo ou null
 */
export const carregarEstadoLote = () => {
  try {
    const dados = localStorage.getItem(JOB_STORAGE_KEY);
    return dados ? JSON.parse(dados) : null;
  } catch (error) {
    console.error('Erro ao carregar estado de lote do localStorage:', error);
    return null;
  }
};

/**
 * Limpa o estado do processamento em lote
 */
export const limparEstadoLote = () => {
  try {
    localStorage.removeItem(JOB_STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Erro ao limpar estado de lote no localStorage:', error);
    return false;
  }
};

