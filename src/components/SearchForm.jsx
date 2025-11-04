import { useState } from 'react';
import styled from 'styled-components';
import { buscarPorCPF } from '../services/api';
import { formatarCPF } from '../utils/excelParser';
import { HiSearch, HiIdentification, HiCheckCircle, HiXCircle, HiInformationCircle } from 'react-icons/hi';

const FormContainer = styled.div`
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
  background: linear-gradient(135deg, #2563EB 0%, #1E40AF 100%);
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

const Form = styled.form`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  align-items: flex-end;
`;

const InputGroup = styled.div`
  flex: 1;
  min-width: 280px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #374151;
  font-size: 14px;
`;

const InputWrapper = styled.div`
  position: relative;
  
  svg {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #9CA3AF;
    font-size: 20px;
    transition: color 0.2s;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px 12px 46px;
  border: 2px solid #E5E7EB;
  border-radius: 10px;
  font-size: 14px;
  transition: all 0.2s ease;
  background: #F9FAFB;
  color: #111827;
  font-weight: 500;

  &:focus {
    border-color: #2563EB;
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
    background: white;
  }
  
  &:focus + svg {
    color: #2563EB;
  }

  &::placeholder {
    color: #9CA3AF;
    font-weight: 400;
  }
`;

const Button = styled.button`
  padding: 12px 28px;
  background: linear-gradient(135deg, #2563EB 0%, #1E40AF 100%);
  color: white;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.3);
  
  svg {
    font-size: 18px;
  }
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #1D4ED8 0%, #1E3A8A 100%);
    box-shadow: 0 6px 12px -2px rgba(37, 99, 235, 0.4);
    transform: translateY(-2px);
  }

  &:active:not(:disabled) {
    transform: translateY(-1px) scale(0.98);
  }
`;

const Message = styled.div`
  margin-top: 16px;
  padding: 14px 18px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 10px;
  animation: slideUp 0.3s ease;
  
  svg {
    font-size: 20px;
    flex-shrink: 0;
  }
  
  ${props => props.$type === 'success' && `
    background: #D1FAE5;
    color: #065F46;
    border: 2px solid #6EE7B7;
    
    svg {
      color: #10B981;
    }
  `}
  
  ${props => props.$type === 'error' && `
    background: #FEE2E2;
    color: #991B1B;
    border: 2px solid #FCA5A5;
    
    svg {
      color: #EF4444;
    }
  `}
  
  ${props => props.$type === 'info' && `
    background: #DBEAFE;
    color: #1E40AF;
    border: 2px solid #93C5FD;
    
    svg {
      color: #3B82F6;
    }
  `}
`;

const SearchForm = ({ onResultado }) => {
  const [cpf, setCpf] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validação básica
    const cpfLimpo = cpf.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) {
      setMensagem({ tipo: 'error', texto: 'CPF deve conter 11 dígitos' });
      return;
    }

    setLoading(true);
    setMensagem(null);

    try {
      const resultado = await buscarPorCPF(cpfLimpo);
      
      if (resultado.success) {
        if (resultado.data.length > 0) {
          setMensagem({ 
            tipo: 'success', 
            texto: `${resultado.data.length} registro(s) encontrado(s)!` 
          });
          
          // Passa resultado para o componente pai
          onResultado({
            cpf: cpfLimpo,
            ...resultado,
            timestamp: new Date().toISOString()
          });
          
          setCpf('');
        } else {
          setMensagem({ 
            tipo: 'info', 
            texto: 'Nenhum registro encontrado para este CPF' 
          });
        }
      } else {
        setMensagem({ 
          tipo: 'error', 
          texto: resultado.message 
        });
      }
    } catch (error) {
      setMensagem({ 
        tipo: 'error', 
        texto: 'Erro ao realizar busca. Tente novamente.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCpfChange = (e) => {
    const valor = e.target.value;
    // Permite apenas números e formatação
    const valorLimpo = valor.replace(/\D/g, '');
    
    if (valorLimpo.length <= 11) {
      // Formata enquanto digita
      if (valorLimpo.length <= 11) {
        setCpf(formatarCPF(valorLimpo));
      }
    }
  };

  const getMessageIcon = (tipo) => {
    switch (tipo) {
      case 'success':
        return <HiCheckCircle />;
      case 'error':
        return <HiXCircle />;
      case 'info':
        return <HiInformationCircle />;
      default:
        return null;
    }
  };

  return (
    <FormContainer>
      <TitleWrapper>
        <TitleIcon>
          <HiIdentification />
        </TitleIcon>
        <Title>Busca Individual por CPF</Title>
      </TitleWrapper>
      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Label htmlFor="cpf">CPF do Trabalhador</Label>
          <InputWrapper>
            <HiIdentification />
            <Input
              id="cpf"
              type="text"
              value={cpf}
              onChange={handleCpfChange}
              placeholder="000.000.000-00"
              disabled={loading}
              maxLength={14}
            />
          </InputWrapper>
        </InputGroup>
        <Button type="submit" disabled={loading || !cpf}>
          <HiSearch />
          {loading ? 'Buscando...' : 'Buscar'}
        </Button>
      </Form>
      
      {mensagem && (
        <Message $type={mensagem.tipo}>
          {getMessageIcon(mensagem.tipo)}
          <span>{mensagem.texto}</span>
        </Message>
      )}
    </FormContainer>
  );
};

export default SearchForm;

