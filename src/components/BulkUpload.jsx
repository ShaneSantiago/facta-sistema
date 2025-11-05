import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { lerArquivoExcel, isArquivoExcel } from '../utils/excelParser';
import { buscarMultiplosCPFs } from '../services/api';
import { HiDocumentText, HiUpload, HiPlay, HiPause, HiStop, HiTrash, HiCheckCircle } from 'react-icons/hi';
import { carregarEstadoLote, salvarEstadoLote, limparEstadoLote } from '../utils/storage';

const Container = styled.div`
  background: white;
  padding: 28px;
  border-radius: 16px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  border: 1px solid #E5E7EB;
  animation: slideUp 0.4s ease;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
`;

const TitleIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
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

const UploadArea = styled.div`
  border: 3px dashed ${props => props.$isDragging ? '#8B5CF6' : '#D1D5DB'};
  border-radius: 16px;
  padding: 48px;
  text-align: center;
  background: ${props => props.$isDragging ? 'rgba(139, 92, 246, 0.05)' : '#F9FAFB'};
  transition: all 0.3s ease;
  cursor: pointer;
  margin-bottom: 24px;

  &:hover {
    border-color: #8B5CF6;
    background: rgba(139, 92, 246, 0.05);
    transform: scale(1.01);
  }
`;

const UploadIconWrapper = styled.div`
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 15px -3px rgba(139, 92, 246, 0.3);
  
  svg {
    color: white;
    font-size: 32px;
  }
`;

const UploadText = styled.p`
  font-size: 16px;
  color: #374151;
  margin-bottom: 8px;
  font-weight: 600;
`;

const FileInput = styled.input`
  display: none;
`;

const ControlsArea = styled.div`
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  margin-bottom: 20px;
  align-items: flex-end;
`;

const InputGroup = styled.div`
  flex: 0 0 200px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #374151;
  font-size: 14px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #E5E7EB;
  border-radius: 10px;
  font-size: 14px;
  transition: all 0.2s ease;
  background: #F9FAFB;
  color: #111827;
  font-weight: 500;

  &:focus {
    border-color: #8B5CF6;
    box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1);
    background: white;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  flex: 1;
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    font-size: 18px;
  }

  ${props => props.$variant === 'primary' && `
    background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
    color: white;
    box-shadow: 0 4px 6px -1px rgba(139, 92, 246, 0.3);
    
    &:hover:not(:disabled) {
      background: linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%);
      box-shadow: 0 6px 12px -2px rgba(139, 92, 246, 0.4);
      transform: translateY(-2px);
    }
  `}

  ${props => props.$variant === 'warning' && `
    background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
    color: white;
    box-shadow: 0 4px 6px -1px rgba(245, 158, 11, 0.3);
    
    &:hover:not(:disabled) {
      background: linear-gradient(135deg, #D97706 0%, #B45309 100%);
      box-shadow: 0 6px 12px -2px rgba(245, 158, 11, 0.4);
      transform: translateY(-2px);
    }
  `}

  ${props => props.$variant === 'danger' && `
    background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
    color: white;
    box-shadow: 0 4px 6px -1px rgba(239, 68, 68, 0.3);
    
    &:hover:not(:disabled) {
      background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%);
      box-shadow: 0 6px 12px -2px rgba(239, 68, 68, 0.4);
      transform: translateY(-2px);
    }
  `}

  ${props => props.$variant === 'secondary' && `
    background: linear-gradient(135deg, #6B7280 0%, #4B5563 100%);
    color: white;
    box-shadow: 0 4px 6px -1px rgba(107, 114, 128, 0.3);
    
    &:hover:not(:disabled) {
      background: linear-gradient(135deg, #4B5563 0%, #374151 100%);
      box-shadow: 0 6px 12px -2px rgba(107, 114, 128, 0.4);
      transform: translateY(-2px);
    }
  `}
`;

const FileInfo = styled.div`
  background: linear-gradient(135deg, #EDE9FE 0%, #E9D5FF 100%);
  padding: 18px 20px;
  border-radius: 12px;
  margin-bottom: 24px;
  border-left: 4px solid #8B5CF6;
  display: flex;
  align-items: center;
  gap: 16px;
  
  svg {
    color: #8B5CF6;
    font-size: 32px;
    flex-shrink: 0;
  }
`;

const FileInfoContent = styled.div`
  flex: 1;
`;

const FileInfoText = styled.p`
  font-size: 14px;
  color: #4C1D95;
  margin: 4px 0;
  font-weight: 500;
  
  strong {
    font-weight: 700;
    color: #6D28D9;
  }
`;

const ProgressBar = styled.div`
  background: #E5E7EB;
  height: 40px;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  margin-top: 24px;
  box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
`;

const ProgressFill = styled.div`
  background: linear-gradient(90deg, #8B5CF6 0%, #7C3AED 100%);
  height: 100%;
  width: ${props => props.$progress}%;
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 15px;
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.4);
`;

const StatusText = styled.p`
  margin-top: 12px;
  font-size: 14px;
  color: #6B7280;
  text-align: center;
  font-weight: 600;
`;

const BulkUpload = ({ onResultados }) => {
  const [arquivo, setArquivo] = useState(null);
  const [cpfs, setCpfs] = useState([]);
  const [limite, setLimite] = useState('');
  const [processando, setProcessando] = useState(false);
  const [pausado, setPausado] = useState(false);
  const [progresso, setProgresso] = useState({ current: 0, total: 0 });
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef(null);
  const shouldContinueRef = useRef(true);

  // Restaura estado salvo (arquivo, CPFs, progresso e pausa) ao montar
  useEffect(() => {
    const estado = carregarEstadoLote();
    if (estado && Array.isArray(estado.cpfs) && estado.cpfs.length > 0) {
      setArquivo(estado.arquivoNome ? { name: estado.arquivoNome } : { name: 'Planilha' });
      setCpfs(estado.cpfs);
      setLimite((estado.limite || estado.cpfs.length).toString());
      setProgresso(estado.progresso || { current: 0, total: estado.cpfs.length });
      setPausado(!!estado.pausado);
      setProcessando(false);
      // Sempre inicia interrompido para não continuar sozinho após reload
      shouldContinueRef.current = false;
    }
  }, []);

  const handleFileSelect = async (file) => {
    if (!file) return;

    if (!isArquivoExcel(file)) {
      alert('Por favor, selecione um arquivo Excel (.xls, .xlsx)');
      return;
    }

    try {
      const cpfsExtraidos = await lerArquivoExcel(file);
      
      if (cpfsExtraidos.length === 0) {
        alert('Nenhum CPF encontrado no arquivo');
        return;
      }

      setArquivo(file);
      setCpfs(cpfsExtraidos);
      setLimite(cpfsExtraidos.length.toString());
      salvarEstadoLote({
        arquivoNome: file.name,
        cpfs: cpfsExtraidos,
        limite: cpfsExtraidos.length,
        progresso: { current: 0, total: cpfsExtraidos.length },
        pausado: false,
        processando: false,
      });
    } catch (error) {
      alert(error.message);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleProcessar = async () => {
    if (cpfs.length === 0) {
      alert('Nenhum CPF para processar');
      return;
    }

    const limiteNum = parseInt(limite) || cpfs.length;
    const cpfsParaProcessar = cpfs.slice(0, limiteNum);

    setProcessando(true);
    setPausado(false);
    shouldContinueRef.current = true;
    setProgresso({ current: 0, total: cpfsParaProcessar.length });
    salvarEstadoLote({
      arquivoNome: arquivo?.name,
      cpfs,
      limite: cpfsParaProcessar.length,
      progresso: { current: 0, total: cpfsParaProcessar.length },
      pausado: false,
      processando: true,
    });

    const resultados = await buscarMultiplosCPFs(
      cpfsParaProcessar,
      (progressInfo) => {
        setProgresso({
          current: progressInfo.current,
          total: progressInfo.total
        });
        salvarEstadoLote({
          arquivoNome: arquivo?.name,
          cpfs,
          limite: progressInfo.total,
          progresso: { current: progressInfo.current, total: progressInfo.total },
          pausado: false,
          processando: true,
        });
        
        // Envia resultado individual para o componente pai
        onResultados([progressInfo.resultado]);
      },
      () => shouldContinueRef.current
    );

    setProcessando(false);
    salvarEstadoLote({
      arquivoNome: arquivo?.name,
      cpfs,
      limite: progresso.total,
      progresso,
      pausado: false,
      processando: false,
    });
  };

  const handlePausar = () => {
    setPausado(true);
    shouldContinueRef.current = false;
    salvarEstadoLote({
      arquivoNome: arquivo?.name,
      cpfs,
      limite: progresso.total || cpfs.length,
      progresso,
      pausado: true,
      processando: false,
    });
  };

  const handleRetomar = () => {
    setPausado(false);
    shouldContinueRef.current = true;
    salvarEstadoLote({
      arquivoNome: arquivo?.name,
      cpfs,
      limite: progresso.total || cpfs.length,
      progresso,
      pausado: false,
      processando: true,
    });
    
    // Retoma processamento com CPFs restantes
    const cpfsRestantes = cpfs.slice(progresso.current);
    if (cpfsRestantes.length > 0) {
      handleProcessarRestantes(cpfsRestantes);
    }
  };

  const handleProcessarRestantes = async (cpfsRestantes) => {
    setProcessando(true);
    setPausado(false);
    shouldContinueRef.current = true;

    const offset = progresso.current;

    await buscarMultiplosCPFs(
      cpfsRestantes,
      (progressInfo) => {
        setProgresso({
          current: offset + progressInfo.current,
          total: progresso.total
        });
        salvarEstadoLote({
          arquivoNome: arquivo?.name,
          cpfs,
          limite: progresso.total,
          progresso: { current: offset + progressInfo.current, total: progresso.total },
          pausado: false,
          processando: true,
        });
        
        onResultados([progressInfo.resultado]);
      },
      () => shouldContinueRef.current
    );

    setProcessando(false);
    salvarEstadoLote({
      arquivoNome: arquivo?.name,
      cpfs,
      limite: progresso.total,
      progresso,
      pausado: false,
      processando: false,
    });
  };

  const handleCancelar = () => {
    shouldContinueRef.current = false;
    setProcessando(false);
    setPausado(false);
    setProgresso({ current: 0, total: 0 });
    salvarEstadoLote({
      arquivoNome: arquivo?.name,
      cpfs,
      limite: cpfs.length,
      progresso: { current: 0, total: 0 },
      pausado: false,
      processando: false,
    });
  };

  const handleLimpar = () => {
    setArquivo(null);
    setCpfs([]);
    setLimite('');
    setProgresso({ current: 0, total: 0 });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    limparEstadoLote();
  };

  const progressoPercentual = progresso.total > 0 
    ? Math.round((progresso.current / progresso.total) * 100) 
    : 0;

  return (
    <Container>
      <TitleWrapper>
        <TitleIcon>
          <HiDocumentText />
        </TitleIcon>
        <Title>Consulta em Lote via Planilha</Title>
      </TitleWrapper>
      
      <UploadArea
        $isDragging={isDragging}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <UploadIconWrapper>
          <HiUpload />
        </UploadIconWrapper>
        <UploadText>
          <strong>Clique aqui</strong> ou arraste um arquivo Excel
        </UploadText>
        <UploadText style={{ fontSize: '14px', color: '#6B7280', fontWeight: 400 }}>
          Formatos aceitos: .xls, .xlsx
        </UploadText>
      </UploadArea>

      <FileInput
        ref={fileInputRef}
        type="file"
        accept=".xls,.xlsx"
        onChange={handleFileInputChange}
      />

      {arquivo && (
        <FileInfo>
          <HiCheckCircle />
          <FileInfoContent>
            <FileInfoText><strong>Arquivo:</strong> {arquivo.name}</FileInfoText>
            <FileInfoText><strong>CPFs encontrados:</strong> {cpfs.length}</FileInfoText>
          </FileInfoContent>
        </FileInfo>
      )}

      {cpfs.length > 0 && (
        <>
          <ControlsArea>
            <InputGroup>
              <Label htmlFor="limite">Quantidade para processar</Label>
              <Input
                id="limite"
                type="number"
                value={limite}
                onChange={(e) => setLimite(e.target.value)}
                min="1"
                max={cpfs.length}
                disabled={processando}
              />
            </InputGroup>

            <ButtonGroup>
              {!processando && !pausado && (
                <Button
                  $variant="primary"
                  onClick={handleProcessar}
                  disabled={!limite || parseInt(limite) < 1}
                >
                  <HiPlay />
                  Processar
                </Button>
              )}

              {processando && !pausado && (
                <Button $variant="warning" onClick={handlePausar}>
                  <HiPause />
                  Pausar
                </Button>
              )}

              {pausado && (
                <Button $variant="primary" onClick={handleRetomar}>
                  <HiPlay />
                  Retomar
                </Button>
              )}

              {(processando || pausado) && (
                <Button $variant="danger" onClick={handleCancelar}>
                  <HiStop />
                  Cancelar
                </Button>
              )}

              <Button
                $variant="secondary"
                onClick={handleLimpar}
                disabled={processando}
              >
                <HiTrash />
                Limpar
              </Button>
            </ButtonGroup>
          </ControlsArea>

          {(processando || pausado || progresso.current > 0) && (
            <>
              <ProgressBar>
                <ProgressFill $progress={progressoPercentual}>
                  {progressoPercentual}%
                </ProgressFill>
              </ProgressBar>
              <StatusText>
                {processando && !pausado && `Processando: ${progresso.current} de ${progresso.total}`}
                {pausado && `Pausado: ${progresso.current} de ${progresso.total}`}
                {!processando && !pausado && progresso.current > 0 && 
                  `Concluído: ${progresso.current} de ${progresso.total}`}
              </StatusText>
            </>
          )}
        </>
      )}
    </Container>
  );
};

export default BulkUpload;

