import * as XLSX from 'xlsx';

/**
 * Exporta dados para arquivo Excel
 * @param {Array} dados - Array de dados para exportar
 * @param {string} nomeArquivo - Nome do arquivo (sem extensão)
 */
export const exportarParaExcel = (dados, nomeArquivo = 'export') => {
  if (!dados || dados.length === 0) {
    alert('Nenhum dado para exportar');
    return;
  }

  // Formata os dados para o Excel
  const dadosFormatados = dados.map(item => ({
    'CPF': formatarCPF(item.cpf),
    'Nome': item.nome || '-',
    'Matrícula': item.matricula || '-',
    'Sexo': item.sexo_descricao || '-',
    'Data Nascimento': formatarData(item.dataNascimento),
    'Nome da Mãe': item.nomeMae || '-',
    'Elegível': item.elegivel === '1' ? 'Sim' : 'Não',
    'Empregador': item.nomeEmpregador || '-',
    'CNPJ Empregador': item.numeroInscricaoEmpregador || '-',
    'Data Admissão': formatarData(item.dataAdmissao),
    'Data Desligamento': formatarData(item.dataDesligamento),
    'CBO Código': item.cbo_codigo || '-',
    'CBO Descrição': item.cbo_descricao || '-',
    'CNAE Código': item.cnae_codigo || '-',
    'CNAE Descrição': item.cnae_descricao || '-',
    'Valor Total Vencimentos': formatarValor(item.valorTotalVencimentos),
    'Valor Base Margem': formatarValor(item.valorBaseMargem),
    'Valor Margem Disponível': formatarValor(item.valorMargemDisponivel),
    'Categoria Trabalhador': item.codigoCategoriaTrabalhador || '-',
    'PEP': item.pessoaExpostaPoliticamente_descricao || '-',
    'Motivo Inelegibilidade': item.motivoInelegibilidade_descricao || '-',
    'Possui Alertas': item.possuiAlertas || '-',
    'Qtd Empréstimos Ativos': item.qtdEmprestimosAtivosSuspensos || '0',
    'Empréstimos Legados': item.emprestimosLegados === 'S' ? 'Sim' : 'Não',
    'País Nacionalidade': item.paisNacionalidade_descricao || '-',
    'Data Início Atividade Empregador': formatarData(item.dataInicioAtividadeEmpregador),
  }));

  // Cria a planilha
  const worksheet = XLSX.utils.json_to_sheet(dadosFormatados);
  
  // Define largura das colunas
  const colunas = [
    { wch: 15 },  // CPF
    { wch: 35 },  // Nome
    { wch: 20 },  // Matrícula
    { wch: 12 },  // Sexo
    { wch: 15 },  // Data Nascimento
    { wch: 35 },  // Nome da Mãe
    { wch: 10 },  // Elegível
    { wch: 40 },  // Empregador
    { wch: 15 },  // CNPJ
    { wch: 15 },  // Data Admissão
    { wch: 15 },  // Data Desligamento
    { wch: 12 },  // CBO Código
    { wch: 40 },  // CBO Descrição
    { wch: 12 },  // CNAE Código
    { wch: 50 },  // CNAE Descrição
    { wch: 20 },  // Valor Total Vencimentos
    { wch: 18 },  // Valor Base Margem
    { wch: 22 },  // Valor Margem Disponível
    { wch: 20 },  // Categoria Trabalhador
    { wch: 35 },  // PEP
    { wch: 40 },  // Motivo Inelegibilidade
    { wch: 15 },  // Possui Alertas
    { wch: 22 },  // Qtd Empréstimos
    { wch: 18 },  // Empréstimos Legados
    { wch: 20 },  // País
    { wch: 30 },  // Data Início Atividade
  ];
  worksheet['!cols'] = colunas;

  // Cria o workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Dados CLT');

  // Gera o arquivo e faz download
  const dataAtual = new Date().toISOString().split('T')[0];
  XLSX.writeFile(workbook, `${nomeArquivo}_${dataAtual}.xlsx`);
};

/**
 * Exporta apenas os registros elegíveis
 * @param {Array} resultados - Array de resultados completos
 */
export const exportarElegiveis = (resultados) => {
  // Achata os resultados e filtra apenas elegíveis
  const elegiveis = [];
  
  resultados.forEach(resultado => {
    if (resultado.success && resultado.data) {
      resultado.data.forEach(item => {
        if (item.elegivel === '1') {
          elegiveis.push(item);
        }
      });
    }
  });

  if (elegiveis.length === 0) {
    alert('Nenhum registro elegível encontrado');
    return;
  }

  exportarParaExcel(elegiveis, 'elegiveis');
  alert(`${elegiveis.length} registro(s) elegível(is) exportado(s) com sucesso!`);
};

/**
 * Exporta apenas os registros não elegíveis
 * @param {Array} resultados - Array de resultados completos
 */
export const exportarNaoElegiveis = (resultados) => {
  // Achata os resultados e filtra apenas não elegíveis
  const naoElegiveis = [];
  
  resultados.forEach(resultado => {
    if (resultado.success && resultado.data) {
      resultado.data.forEach(item => {
        if (item.elegivel === '0') {
          naoElegiveis.push(item);
        }
      });
    }
  });

  if (naoElegiveis.length === 0) {
    alert('Nenhum registro não elegível encontrado');
    return;
  }

  exportarParaExcel(naoElegiveis, 'nao_elegiveis');
  alert(`${naoElegiveis.length} registro(s) não elegível(is) exportado(s) com sucesso!`);
};

/**
 * Exporta todos os registros
 * @param {Array} resultados - Array de resultados completos
 */
export const exportarTodos = (resultados) => {
  // Achata todos os resultados
  const todos = [];
  
  resultados.forEach(resultado => {
    if (resultado.success && resultado.data) {
      resultado.data.forEach(item => {
        todos.push(item);
      });
    }
  });

  if (todos.length === 0) {
    alert('Nenhum registro para exportar');
    return;
  }

  exportarParaExcel(todos, 'todos_registros');
  alert(`${todos.length} registro(s) exportado(s) com sucesso!`);
};

// Funções auxiliares de formatação
const formatarCPF = (cpf) => {
  if (!cpf) return '-';
  const cpfLimpo = cpf.replace(/\D/g, '');
  if (cpfLimpo.length !== 11) return cpf;
  return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

const formatarData = (data) => {
  if (!data) return '-';
  const [ano, mes, dia] = data.split('-');
  if (!ano || !mes || !dia) return data;
  return `${dia}/${mes}/${ano}`;
};

const formatarValor = (valor) => {
  if (!valor) return 'R$ 0,00';
  return `R$ ${parseFloat(valor).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};


