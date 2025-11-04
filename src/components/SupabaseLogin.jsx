import { useState } from 'react';
import styled from 'styled-components';
import { loginSupabase, atualizarUltimoLogin } from '../services/supabaseAuth';
import { HiUser, HiLockClosed, HiLogin, HiCheckCircle, HiXCircle } from 'react-icons/hi';

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

const IconWrapper = styled.div`
  width: 72px;
  height: 72px;
  background: linear-gradient(135deg, #2563EB 0%, #1E40AF 100%);
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 28px;
  box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.4);
  
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
  background: linear-gradient(135deg, #2563EB 0%, #8B5CF6 100%);
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

const InputGroup = styled.div`
  position: relative;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #4a5568;
  font-size: 13px;
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
    border-color: #2563EB;
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
    outline: none;
    background: white;
  }
  
  &:focus ~ svg {
    color: #2563EB;
  }
  
  &::placeholder {
    color: #9CA3AF;
    font-weight: 400;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 14px 24px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  background: linear-gradient(135deg, #2563EB 0%, #1E40AF 100%);
  color: white;
  transition: all 0.2s ease;
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.4);

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #1D4ED8 0%, #1E3A8A 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 12px -2px rgba(37, 99, 235, 0.5);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  svg {
    font-size: 20px;
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

const SupabaseLogin = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMensagem({ tipo: 'error', texto: 'Preencha email e senha' });
      return;
    }

    setLoading(true);
    setMensagem(null);

    try {
      const resultado = await loginSupabase(email, password);

      if (resultado.success) {
        setMensagem({ tipo: 'success', texto: 'Login realizado com sucesso!' });
        
        // Atualiza último login
        await atualizarUltimoLogin();
        
        // Aguarda um pouco para mostrar mensagem de sucesso
        setTimeout(() => {
          onSuccess(resultado);
        }, 1000);
      } else {
        setMensagem({ tipo: 'error', texto: resultado.message });
      }
    } catch (error) {
      setMensagem({ tipo: 'error', texto: 'Erro ao fazer login' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Overlay>
      <Modal onClick={(e) => e.stopPropagation()}>
        <IconWrapper>
          <HiLogin />
        </IconWrapper>
        
        <Title>Bem-vindo de volta</Title>
        <Subtitle>Entre com suas credenciais para continuar</Subtitle>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="email">Email</Label>
            <InputWrapper>
              <HiUser />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                disabled={loading}
                autoFocus
              />
            </InputWrapper>
          </InputGroup>

          <InputGroup>
            <Label htmlFor="password">Senha</Label>
            <InputWrapper>
              <HiLockClosed />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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

          <Button type="submit" disabled={loading}>
            {loading ? 'Entrando...' : (
              <>
                <HiLogin />
                Entrar no Sistema
              </>
            )}
          </Button>
        </Form>
      </Modal>
    </Overlay>
  );
};

export default SupabaseLogin;

