import * as XLSX from 'xlsx';

/**
 * Lê um arquivo Excel e extrai CPFs
 * @param {File} file - Arquivo Excel selecionado
 * @returns {Promise<Array<string>>} - Promise com array de CPFs
 */
export const lerArquivoExcel = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Pega a primeira planilha
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Converte para JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        // Extrai CPFs (procura em todas as células)
        const cpfs = extrairCPFs(jsonData);
        
        resolve(cpfs);
      } catch (error) {
        reject(new Error('Erro ao processar arquivo Excel: ' + error.message));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Erro ao ler arquivo'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Extrai CPFs de dados de planilha
 * @param {Array} data - Dados da planilha em formato JSON
 * @returns {Array<string>} - Array de CPFs únicos
 */
const extrairCPFs = (data) => {
  const cpfs = new Set();
  const cpfRegex = /\b\d{11}\b|\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/g;
  
  data.forEach(row => {
    row.forEach(cell => {
      if (cell) {
        const cellStr = String(cell);
        
        // Tenta extrair CPF com regex
        const matches = cellStr.match(cpfRegex);
        if (matches) {
          matches.forEach(cpf => {
            // Remove formatação
            const cpfLimpo = cpf.replace(/\D/g, '');
            
            // Valida tamanho
            if (cpfLimpo.length === 11) {
              cpfs.add(cpfLimpo);
            }
          });
        }
      }
    });
  });
  
  return Array.from(cpfs);
};

/**
 * Formata um CPF para exibição
 * @param {string} cpf - CPF sem formatação
 * @returns {string} - CPF formatado (000.000.000-00)
 */
export const formatarCPF = (cpf) => {
  const cpfLimpo = cpf.replace(/\D/g, '');
  
  if (cpfLimpo.length !== 11) {
    return cpf;
  }
  
  return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

/**
 * Valida se um arquivo é Excel
 * @param {File} file - Arquivo a validar
 * @returns {boolean} - true se for Excel
 */
export const isArquivoExcel = (file) => {
  const excelTypes = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel.sheet.macroEnabled.12',
  ];
  
  const excelExtensions = ['.xls', '.xlsx', '.xlsm'];
  
  return (
    excelTypes.includes(file.type) ||
    excelExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
  );
};


