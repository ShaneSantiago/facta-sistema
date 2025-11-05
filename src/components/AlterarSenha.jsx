import { useState } from 'react';
import styled from 'styled-components';
import { alterarSenhaSupabase, logoutSupabase } from '../services/supabaseAuth';
import { removerToken } from '../services/auth';
import { HiLockClosed, HiCheckCircle, HiExclamationCircle } from 'react-icons/hi';

// Código de autorização fixo para liberar alteração de senha
const AUTH_CODE = '5518996118095';

const Container = styled.div`
  background: white;
  padding: 28px;
  border-radius: 16px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  border: 1px solid #E5E7EB;
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
  box-shadow: 0 10px 15px -3px rgba(139, 92, 246, 0.3);
  
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
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Label = styled.label`
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
  background: #F9FAFB;
  color: #111827;
  font-weight: 500;
  &:focus {
    border-color: #8B5CF6;
    box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1);
    background: white;
  }
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
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  color: white;
  box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.3);
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
    transform: translateY(-2px);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Message = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  ${props => props.$type === 'success' && `
    background: #D1FAE5;
    color: #065F46;
    border: 2px solid #6EE7B7;
    svg { color: #10B981; }
  `}
  ${props => props.$type === 'error' && `
    background: #FEE2E2;
    color: #991B1B;
    border: 2px solid #FCA5A5;
    svg { color: #EF4444; }
  `}
`;

export default function AlterarSenha() {
  const [email, setEmail] = useState('');
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [codigo, setCodigo] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (!email || !senhaAtual || !novaSenha || !confirmacao || !codigo) {
      setStatus({ type: 'error', text: 'Preencha todos os campos, incluindo o código.' });
      return;
    }
    if (novaSenha !== confirmacao) {
      setStatus({ type: 'error', text: 'Nova senha e confirmação não coincidem.' });
      return;
    }
    if (novaSenha.length < 6) {
      setStatus({ type: 'error', text: 'A nova senha deve ter pelo menos 6 caracteres.' });
      return;
    }
    if (codigo !== AUTH_CODE) {
      setStatus({ type: 'error', text: 'Código de autorização inválido.' });
      return;
    }

    setLoading(true);
    const result = await alterarSenhaSupabase(email, senhaAtual, novaSenha);
    setLoading(false);

    if (result.success) {
      try { removerToken(); } catch {}
      await logoutSupabase();
      setStatus({ type: 'success', text: 'Senha alterada. Faça login novamente.' });
    } else {
      setStatus({ type: 'error', text: result.message || 'Falha ao alterar senha.' });
    }
  };

  return (
    <Container>
      <TitleWrapper>
        <TitleIcon><HiLockClosed /></TitleIcon>
        <Title>Alterar Senha (Oculta)</Title>
      </TitleWrapper>
      {status && (
        <Message $type={status.type}>
          {status.type === 'success' ? <HiCheckCircle /> : <HiExclamationCircle />}
          {status.text}
        </Message>
      )}
      <Form onSubmit={handleSubmit}>
        <div>
          <Label>Email</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <Label>Senha atual</Label>
          <Input type="password" value={senhaAtual} onChange={(e) => setSenhaAtual(e.target.value)} />
        </div>
        <div>
          <Label>Nova senha</Label>
          <Input type="password" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} />
        </div>
        <div>
          <Label>Confirmar nova senha</Label>
          <Input type="password" value={confirmacao} onChange={(e) => setConfirmacao(e.target.value)} />
        </div>
        <div>
          <Label>Código de autorização</Label>
          <Input type="password" value={codigo} onChange={(e) => setCodigo(e.target.value)} placeholder="Digite o código" />
        </div>
        <Button type="submit" disabled={loading}>
          <HiLockClosed />
          {loading ? 'Alterando...' : 'Alterar Senha'}
        </Button>
      </Form>
    </Container>
  );
}