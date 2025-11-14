/**
 * Remove duplicatas de um array de resultados
 * Considera duplicata quando CPF + Matrícula são iguais
 * @param {Array} resultados - Array de resultados para deduplicar
 * @returns {Array} - Array sem duplicatas
 */
export const removerDuplicatas = (resultados) => {
  const resultadosUnicos = [];
  const chavesProcessadas = new Set();

  resultados.forEach(resultado => {
    if (!resultado.success || !resultado.data) {
      resultadosUnicos.push(resultado);
      return;
    }

    // Filtra dados duplicados dentro de cada resultado
    const dadosUnicos = [];
    const chavesUnicas = new Set();

    resultado.data.forEach(item => {
      const chaveUnica = `${item.cpf}-${item.matricula}`;
      
      if (!chavesUnicas.has(chaveUnica) && !chavesProcessadas.has(chaveUnica)) {
        chavesUnicas.add(chaveUnica);
        chavesProcessadas.add(chaveUnica);
        dadosUnicos.push(item);
      }
    });

    // Só adiciona o resultado se tiver dados únicos
    if (dadosUnicos.length > 0) {
      resultadosUnicos.push({
        ...resultado,
        data: dadosUnicos
      });
    }
  });

  return resultadosUnicos;
};

/**
 * Conta quantas duplicatas existem
 * @param {Array} resultados - Array de resultados
 * @returns {number} - Número de duplicatas encontradas
 */
export const contarDuplicatas = (resultados) => {
  let total = 0;
  const chavesVistas = new Set();

  resultados.forEach(resultado => {
    if (resultado.success && resultado.data) {
      resultado.data.forEach(item => {
        const chaveUnica = `${item.cpf}-${item.matricula}`;
        
        if (chavesVistas.has(chaveUnica)) {
          total++;
        } else {
          chavesVistas.add(chaveUnica);
        }
      });
    }
  });

  return total;
};


