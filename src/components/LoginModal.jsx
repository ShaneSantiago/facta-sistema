import { useState } from 'react';
import styled from 'styled-components';
import { gerarToken } from '../services/auth';
import { HiShieldCheck, HiUser, HiLockClosed, HiCheckCircle, HiXCircle, HiX } from 'react-icons/hi';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease;
  backdrop-filter: blur(8px);

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const Modal = styled.div`
  background: white;
  padding: 48px;
  border-radius: 20px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  width: 90%;
  max-width: 460px;
  animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #E5E7EB;
  position: relative;

  @keyframes slideUp {
    from {
      transform: translateY(30px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #F3F4F6;
  color: #6B7280;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  svg {
    font-size: 20px;
  }
  
  &:hover {
    background: #E5E7EB;
    color: #374151;
  }
`;

const IconWrapper = styled.div`
  width: 72px;
  height: 72px;
  background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 28px;
  box-shadow: 0 10px 15px -3px rgba(139, 92, 246, 0.4);
  
  svg {
    color: white;
    font-size: 36px;
  }
`;

const Title = styled.h2`
  color: #111827;
  margin-bottom: 8px;
  font-size: 28px;
  text-align: center;
  font-weight: 700;
  background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  color: #6B7280;
  margin-bottom: 36px;
  text-align: center;
  font-size: 15px;
  font-weight: 500;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div``;

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
  padding: 14px 16px 14px 46px;
  border: 2px solid #E5E7EB;
  border-radius: 12px;
  font-size: 15px;
  transition: all 0.2s ease;
  background: #F9FAFB;
  color: #111827;
  font-weight: 500;

  &:focus {
    border-color: #8B5CF6;
    box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1);
    outline: none;
    background: white;
  }
  
  &:focus ~ svg {
    color: #8B5CF6;
  }
  
  &::placeholder {
    color: #9CA3AF;
    font-weight: 400;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 12px;
`;

const Button = styled.button`
  flex: 1;
  padding: 14px 24px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  svg {
    font-size: 18px;
  }

  ${props => props.$primary ? `
    background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
    color: white;
    box-shadow: 0 4px 6px -1px rgba(139, 92, 246, 0.4);
    
    &:hover:not(:disabled) {
      background: linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%);
      box-shadow: 0 6px 12px -2px rgba(139, 92, 246, 0.5);
      transform: translateY(-2px);
    }
  ` : `
    background: white;
    color: #6B7280;
    border: 2px solid #E5E7EB;
    
    &:hover:not(:disabled) {
      background: #F3F4F6;
      border-color: #D1D5DB;
    }
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Message = styled.div`
  padding: 14px 18px;
  border-radius: 10px;
  font-size: 14px;
  text-align: center;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
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
`;

const LoginModal = ({ onClose, onSuccess }) => {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!login || !senha) {
      setMensagem({ tipo: 'error', texto: 'Preencha login e senha' });
      return;
    }

    setLoading(true);
    setMensagem(null);

    try {
      const resultado = await gerarToken(login, senha);

      if (resultado.success) {
        setMensagem({ tipo: 'success', texto: 'Token gerado com sucesso!' });
        
        // Aguarda um pouco para mostrar mensagem de sucesso
        setTimeout(() => {
          onSuccess(resultado);
          onClose();
        }, 1500);
      } else {
        setMensagem({ tipo: 'error', texto: resultado.message });
      }
    } catch (error) {
      setMensagem({ tipo: 'error', texto: 'Erro ao gerar token' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose} type="button">
          <HiX />
        </CloseButton>
        
        <IconWrapper>
          <HiShieldCheck />
        </IconWrapper>
        
        <Title>Autenticação</Title>
        <Subtitle>Gere um novo token de acesso</Subtitle>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="login">Login</Label>
            <InputWrapper>
              <HiUser />
              <Input
                id="login"
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="Digite seu login"
                disabled={loading}
                autoFocus
              />
            </InputWrapper>
          </InputGroup>

          <InputGroup>
            <Label htmlFor="senha">Senha</Label>
            <InputWrapper>
              <HiLockClosed />
              <Input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Digite sua senha"
                disabled={loading}
              />
            </InputWrapper>
          </InputGroup>

          {mensagem && (
            <Message $type={mensagem.tipo}>
              {mensagem.tipo === 'success' ? <HiCheckCircle /> : <HiXCircle />}
              {mensagem.texto}
            </Message>
          )}

          <ButtonGroup>
            <Button type="button" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" $primary disabled={loading}>
              {loading ? 'Gerando...' : 'Gerar Token'}
            </Button>
          </ButtonGroup>
        </Form>
      </Modal>
    </Overlay>
  );
};

export default LoginModal;
