import { useState, useMemo } from 'react';
import styled from 'styled-components';
import { formatarCPF } from '../utils/excelParser';
import { exportarElegiveis, exportarNaoElegiveis, exportarTodos } from '../utils/excelExport';
import { 
  HiTable, 
  HiDownload, 
  HiTrash, 
  HiRefresh, 
  HiChevronDown, 
  HiChevronUp,
  HiCheckCircle,
  HiXCircle,
  HiSearch,
  HiFilter,
  HiChevronLeft,
  HiChevronRight,
  HiChevronDoubleLeft,
  HiChevronDoubleRight,
  HiDocumentText
} from 'react-icons/hi';

const Container = styled.div`
  background: white;
  padding: 28px;
  border-radius: 16px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  border: 1px solid #E5E7EB;
  animation: slideUp 0.4s ease;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
  flex-wrap: wrap;
  gap: 16px;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const TitleIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    color: white;
    font-size: 20px;
  }
`;

const Title = styled.h2`
  color: #111827;
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.3px;
`;

const CountBadge = styled.span`
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 700;
  margin-left: 8px;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: 10px 18px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  
  svg {
    font-size: 16px;
  }
  
  ${props => props.$danger && `
    background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
    color: white;
    box-shadow: 0 4px 6px -1px rgba(239, 68, 68, 0.3);
    
    &:hover:not(:disabled) {
      background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%);
      box-shadow: 0 6px 12px -2px rgba(239, 68, 68, 0.4);
      transform: translateY(-2px);
    }
  `}
  
  ${props => props.$success && `
    background: linear-gradient(135deg, #10B981 0%, #059669 100%);
    color: white;
    box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.3);
    
    &:hover:not(:disabled) {
      background: linear-gradient(135deg, #059669 0%, #047857 100%);
      box-shadow: 0 6px 12px -2px rgba(16, 185, 129, 0.4);
      transform: translateY(-2px);
    }
  `}
  
  ${props => props.$warning && `
    background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
    color: white;
    box-shadow: 0 4px 6px -1px rgba(245, 158, 11, 0.3);
    
    &:hover:not(:disabled) {
      background: linear-gradient(135deg, #D97706 0%, #B45309 100%);
      box-shadow: 0 6px 12px -2px rgba(245, 158, 11, 0.4);
      transform: translateY(-2px);
    }
  `}
  
  ${props => !props.$danger && !props.$success && !props.$warning && `
    background: linear-gradient(135deg, #2563EB 0%, #1E40AF 100%);
    color: white;
    box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.3);
    
    &:hover:not(:disabled) {
      background: linear-gradient(135deg, #1D4ED8 0%, #1E3A8A 100%);
      box-shadow: 0 6px 12px -2px rgba(37, 99, 235, 0.4);
      transform: translateY(-2px);
    }
  `}
`;

const FiltersArea = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
  padding: 20px;
  background: #F9FAFB;
  border-radius: 12px;
  border: 1px solid #E5E7EB;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #374151;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 6px;
  
  svg {
    font-size: 14px;
    color: #6B7280;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 14px;
  border: 2px solid #E5E7EB;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
  background: white;
  color: #111827;
  font-weight: 500;

  &:focus {
    border-color: #2563EB;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
  
  &::placeholder {
    color: #9CA3AF;
    font-weight: 400;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 14px;
  border: 2px solid #E5E7EB;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: white;
  color: #111827;
  font-weight: 500;

  &:focus {
    border-color: #2563EB;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
`;

const TableContainer = styled.div`
  overflow-x: auto;
  margin-bottom: 24px;
  border-radius: 12px;
  border: 1px solid #E5E7EB;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 900px;
`;

const Thead = styled.thead`
  background: linear-gradient(135deg, #2563EB 0%, #1E40AF 100%);
  color: white;
`;

const Th = styled.th`
  padding: 16px 14px;
  text-align: left;
  font-weight: 700;
  font-size: 13px;
  white-space: nowrap;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Tbody = styled.tbody`
  tr:nth-child(even) {
    background: #F9FAFB;
  }

  tr:hover {
    background: #DBEAFE;
  }
`;

const Td = styled.td`
  padding: 14px;
  font-size: 14px;
  border-bottom: 1px solid #E5E7EB;
  color: #374151;
  font-weight: 500;
`;

const Badge = styled.span`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  
  svg {
    font-size: 14px;
  }
  
  ${props => props.$type === 'success' && `
    background: #D1FAE5;
    color: #065F46;
    
    svg {
      color: #10B981;
    }
  `}
  
  ${props => props.$type === 'danger' && `
    background: #FEE2E2;
    color: #991B1B;
    
    svg {
      color: #EF4444;
    }
  `}
  
  ${props => props.$type === 'warning' && `
    background: #FEF3C7;
    color: #92400E;
    
    svg {
      color: #F59E0B;
    }
  `}
`;

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  padding-top: 20px;
  border-top: 1px solid #E5E7EB;
`;

const PaginationInfo = styled.div`
  font-size: 14px;
  color: #6B7280;
  font-weight: 600;
`;

const PaginationControls = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const PageButton = styled.button`
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  background: ${props => props.$active ? 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)' : 'white'};
  color: ${props => props.$active ? 'white' : '#374151'};
  border: 2px solid ${props => props.$active ? '#2563EB' : '#E5E7EB'};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;
  
  svg {
    font-size: 16px;
  }
  
  &:hover:not(:disabled) {
    background: ${props => props.$active ? 'linear-gradient(135deg, #1D4ED8 0%, #1E3A8A 100%)' : '#F3F4F6'};
    border-color: ${props => props.$active ? '#1D4ED8' : '#D1D5DB'};
  }
  
  &:disabled {
    opacity: 0.4;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
  color: #6B7280;
`;

const EmptyIcon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  background: linear-gradient(135deg, #E5E7EB 0%, #D1D5DB 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    font-size: 40px;
    color: #9CA3AF;
  }
`;

const EmptyText = styled.p`
  font-size: 20px;
  font-weight: 700;
  color: #374151;
  margin-bottom: 8px;
`;

const EmptySubtext = styled.p`
  font-size: 14px;
  color: #9CA3AF;
`;

const ExpandButton = styled.button`
  background: none;
  color: #2563EB;
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  border-radius: 6px;
  
  svg {
    font-size: 16px;
  }
  
  &:hover {
    background: #DBEAFE;
    color: #1D4ED8;
  }
`;

const DetailsRow = styled.tr`
  background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%) !important;
`;

const DetailsCell = styled.td`
  padding: 24px !important;
`;

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
`;

const DetailItem = styled.div`
  background: white;
  padding: 14px;
  border-radius: 10px;
  border-left: 4px solid #2563EB;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
`;

const DetailLabel = styled.div`
  font-size: 11px;
  color: #6B7280;
  font-weight: 700;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DetailValue = styled.div`
  font-size: 14px;
  color: #111827;
  font-weight: 600;
`;

const ResultsTable = ({ resultados, onLimpar, onRemoverDuplicatas }) => {
  const [filtros, setFiltros] = useState({
    cpf: '',
    nome: '',
    empregador: '',
    elegivel: ''
  });
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina] = useState(10);
  const [expandedRows, setExpandedRows] = useState(new Set());

  // Achata os resultados (cada resultado pode ter múltiplos dados)
  const dadosAchatados = useMemo(() => {
    const achatados = [];
    const chavesUnicas = new Set(); // Para evitar duplicatas
    
    resultados.forEach(resultado => {
      if (resultado.success && resultado.data) {
        resultado.data.forEach(item => {
          // Cria uma chave única baseada em CPF + Matrícula
          const chaveUnica = `${item.cpf}-${item.matricula}`;
          
          // Só adiciona se não for duplicata
          if (!chavesUnicas.has(chaveUnica)) {
            chavesUnicas.add(chaveUnica);
            achatados.push({
              ...item,
              cpfConsulta: resultado.cpf,
              timestamp: resultado.timestamp
            });
          }
        });
      }
    });
    return achatados;
  }, [resultados]);

  // Aplica filtros
  const dadosFiltrados = useMemo(() => {
    return dadosAchatados.filter(item => {
      const cpfMatch = !filtros.cpf || 
        item.cpf.includes(filtros.cpf.replace(/\D/g, ''));
      
      const nomeMatch = !filtros.nome || 
        item.nome?.toLowerCase().includes(filtros.nome.toLowerCase());
      
      const empregadorMatch = !filtros.empregador || 
        item.nomeEmpregador?.toLowerCase().includes(filtros.empregador.toLowerCase());
      
      const elegivelMatch = !filtros.elegivel || 
        item.elegivel === filtros.elegivel;

      return cpfMatch && nomeMatch && empregadorMatch && elegivelMatch;
    });
  }, [dadosAchatados, filtros]);

  // Paginação
  const totalPaginas = Math.ceil(dadosFiltrados.length / itensPorPagina);
  const indiceInicio = (paginaAtual - 1) * itensPorPagina;
  const indiceFim = indiceInicio + itensPorPagina;
  const dadosPaginados = dadosFiltrados.slice(indiceInicio, indiceFim);

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
    setPaginaAtual(1); // Reset para primeira página ao filtrar
  };

  const toggleExpandRow = (index) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const formatarData = (data) => {
    if (!data) return '-';
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  const formatarMoeda = (valor) => {
    if (!valor) return 'R$ 0,00';
    return `R$ ${parseFloat(valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  };

  if (resultados.length === 0) {
    return (
      <Container>
        <Header>
          <TitleWrapper>
            <TitleIcon>
              <HiTable />
            </TitleIcon>
            <Title>Resultados</Title>
          </TitleWrapper>
        </Header>
        <EmptyState>
          <EmptyIcon>
            <HiDocumentText />
          </EmptyIcon>
          <EmptyText>Nenhum resultado ainda</EmptyText>
          <EmptySubtext>
            Faça uma busca ou carregue uma planilha para ver os resultados aqui
          </EmptySubtext>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <TitleWrapper>
          <TitleIcon>
            <HiTable />
          </TitleIcon>
          <div>
            <Title>
              Resultados
              <CountBadge>{dadosFiltrados.length}</CountBadge>
            </Title>
          </div>
        </TitleWrapper>
        <HeaderActions>
          <Button onClick={() => exportarElegiveis(resultados)} $success>
            <HiDownload />
            Elegíveis
          </Button>
          <Button onClick={() => exportarNaoElegiveis(resultados)} $warning>
            <HiDownload />
            Não Elegíveis
          </Button>
          <Button onClick={() => exportarTodos(resultados)}>
            <HiDownload />
            Todos
          </Button>
          <Button onClick={onRemoverDuplicatas}>
            <HiRefresh />
            Remover Duplicatas
          </Button>
          <Button onClick={onLimpar} $danger>
            <HiTrash />
            Limpar
          </Button>
        </HeaderActions>
      </Header>

      <FiltersArea>
        <InputGroup>
          <Label>
            <HiSearch />
            Filtrar por CPF
          </Label>
          <Input
            type="text"
            placeholder="Digite o CPF..."
            value={filtros.cpf}
            onChange={(e) => handleFiltroChange('cpf', e.target.value)}
          />
        </InputGroup>

        <InputGroup>
          <Label>
            <HiSearch />
            Filtrar por Nome
          </Label>
          <Input
            type="text"
            placeholder="Digite o nome..."
            value={filtros.nome}
            onChange={(e) => handleFiltroChange('nome', e.target.value)}
          />
        </InputGroup>

        <InputGroup>
          <Label>
            <HiSearch />
            Filtrar por Empregador
          </Label>
          <Input
            type="text"
            placeholder="Digite o empregador..."
            value={filtros.empregador}
            onChange={(e) => handleFiltroChange('empregador', e.target.value)}
          />
        </InputGroup>

        <InputGroup>
          <Label>
            <HiFilter />
            Elegível
          </Label>
          <Select
            value={filtros.elegivel}
            onChange={(e) => handleFiltroChange('elegivel', e.target.value)}
          >
            <option value="">Todos</option>
            <option value="1">Sim</option>
            <option value="0">Não</option>
          </Select>
        </InputGroup>
      </FiltersArea>

      <TableContainer>
        <Table>
          <Thead>
            <tr>
              <Th>CPF</Th>
              <Th>Nome</Th>
              <Th>Matrícula</Th>
              <Th>Empregador</Th>
              <Th>Elegível</Th>
              <Th>Margem Disponível</Th>
              <Th>Ações</Th>
            </tr>
          </Thead>
          <Tbody>
            {dadosPaginados.map((item, index) => {
              const rowIndex = indiceInicio + index;
              const isExpanded = expandedRows.has(rowIndex);
              
              return (
                <>
                  <tr key={rowIndex}>
                    <Td>{formatarCPF(item.cpf)}</Td>
                    <Td>{item.nome}</Td>
                    <Td>{item.matricula}</Td>
                    <Td>{item.nomeEmpregador}</Td>
                    <Td>
                      <Badge $type={item.elegivel === '1' ? 'success' : 'danger'}>
                        {item.elegivel === '1' ? <HiCheckCircle /> : <HiXCircle />}
                        {item.elegivel === '1' ? 'Sim' : 'Não'}
                      </Badge>
                    </Td>
                    <Td>
                      <span style={{ 
                        color: parseFloat(item.valorMargemDisponivel) < 0 ? '#EF4444' : '#10B981',
                        fontWeight: '700'
                      }}>
                        {formatarMoeda(item.valorMargemDisponivel)}
                      </span>
                    </Td>
                    <Td>
                      <ExpandButton onClick={() => toggleExpandRow(rowIndex)}>
                        {isExpanded ? <HiChevronUp /> : <HiChevronDown />}
                        {isExpanded ? 'Ocultar' : 'Detalhes'}
                      </ExpandButton>
                    </Td>
                  </tr>
                  {isExpanded && (
                    <DetailsRow>
                      <DetailsCell colSpan="7">
                        <DetailsGrid>
                          <DetailItem>
                            <DetailLabel>Sexo</DetailLabel>
                            <DetailValue>{item.sexo_descricao}</DetailValue>
                          </DetailItem>
                          <DetailItem>
                            <DetailLabel>Data Nascimento</DetailLabel>
                            <DetailValue>{formatarData(item.dataNascimento)}</DetailValue>
                          </DetailItem>
                          <DetailItem>
                            <DetailLabel>Nome da Mãe</DetailLabel>
                            <DetailValue>{item.nomeMae}</DetailValue>
                          </DetailItem>
                          <DetailItem>
                            <DetailLabel>Data Admissão</DetailLabel>
                            <DetailValue>{formatarData(item.dataAdmissao)}</DetailValue>
                          </DetailItem>
                          <DetailItem>
                            <DetailLabel>CBO</DetailLabel>
                            <DetailValue>{item.cbo_codigo} - {item.cbo_descricao}</DetailValue>
                          </DetailItem>
                          <DetailItem>
                            <DetailLabel>CNAE</DetailLabel>
                            <DetailValue>{item.cnae_codigo} - {item.cnae_descricao}</DetailValue>
                          </DetailItem>
                          <DetailItem>
                            <DetailLabel>Valor Total Vencimentos</DetailLabel>
                            <DetailValue>{formatarMoeda(item.valorTotalVencimentos)}</DetailValue>
                          </DetailItem>
                          <DetailItem>
                            <DetailLabel>Valor Base Margem</DetailLabel>
                            <DetailValue>{formatarMoeda(item.valorBaseMargem)}</DetailValue>
                          </DetailItem>
                          <DetailItem>
                            <DetailLabel>Categoria Trabalhador</DetailLabel>
                            <DetailValue>{item.codigoCategoriaTrabalhador}</DetailValue>
                          </DetailItem>
                          <DetailItem>
                            <DetailLabel>PEP</DetailLabel>
                            <DetailValue>{item.pessoaExpostaPoliticamente_descricao}</DetailValue>
                          </DetailItem>
                          <DetailItem>
                            <DetailLabel>Motivo Inelegibilidade</DetailLabel>
                            <DetailValue>{item.motivoInelegibilidade_descricao || '-'}</DetailValue>
                          </DetailItem>
                          <DetailItem>
                            <DetailLabel>Empréstimos Legados</DetailLabel>
                            <DetailValue>
                              <Badge $type={item.emprestimosLegados === 'S' ? 'warning' : 'success'}>
                                {item.emprestimosLegados === 'S' ? 'Sim' : 'Não'}
                              </Badge>
                            </DetailValue>
                          </DetailItem>
                        </DetailsGrid>
                      </DetailsCell>
                    </DetailsRow>
                  )}
                </>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>

      {totalPaginas > 1 && (
        <Pagination>
          <PaginationInfo>
            Mostrando {indiceInicio + 1} - {Math.min(indiceFim, dadosFiltrados.length)} de {dadosFiltrados.length}
          </PaginationInfo>

          <PaginationControls>
            <PageButton
              onClick={() => setPaginaAtual(1)}
              disabled={paginaAtual === 1}
            >
              <HiChevronDoubleLeft />
            </PageButton>
            
            <PageButton
              onClick={() => setPaginaAtual(prev => prev - 1)}
              disabled={paginaAtual === 1}
            >
              <HiChevronLeft />
            </PageButton>

            {[...Array(totalPaginas)].map((_, i) => {
              const pageNum = i + 1;
              // Mostra apenas páginas próximas
              if (
                pageNum === 1 ||
                pageNum === totalPaginas ||
                (pageNum >= paginaAtual - 1 && pageNum <= paginaAtual + 1)
              ) {
                return (
                  <PageButton
                    key={pageNum}
                    onClick={() => setPaginaAtual(pageNum)}
                    $active={paginaAtual === pageNum}
                  >
                    {pageNum}
                  </PageButton>
                );
              } else if (
                pageNum === paginaAtual - 2 ||
                pageNum === paginaAtual + 2
              ) {
                return <span key={pageNum} style={{ padding: '0 4px', color: '#9CA3AF' }}>...</span>;
              }
              return null;
            })}

            <PageButton
              onClick={() => setPaginaAtual(prev => prev + 1)}
              disabled={paginaAtual === totalPaginas}
            >
              <HiChevronRight />
            </PageButton>

            <PageButton
              onClick={() => setPaginaAtual(totalPaginas)}
              disabled={paginaAtual === totalPaginas}
            >
              <HiChevronDoubleRight />
            </PageButton>
          </PaginationControls>
        </Pagination>
      )}
    </Container>
  );
};

export default ResultsTable;
