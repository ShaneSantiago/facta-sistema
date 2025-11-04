import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { obterDataExpiracao, tokenExpirado, removerToken, estaAutenticado } from '../services/auth';
import { HiShieldCheck, HiShieldExclamation, HiRefresh, HiLogout } from 'react-icons/hi';

const Bar = styled.div`
  background: ${props => props.$expired ? 
    'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)' : 
    'linear-gradient(135deg, #10B981 0%, #059669 100%)'
  };
  color: white;
  padding: 20px 32px;
  border-radius: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  box-shadow: ${props => props.$expired ? 
    '0 10px 15px -3px rgba(239, 68, 68, 0.3)' : 
    '0 10px 15px -3px rgba(16, 185, 129, 0.3)'
  };
  animation: slideUp 0.4s ease;
  
  @media (max-width: 768px) {
    padding: 16px 20px;
  }
`;

const Info = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
`;

const IconWrapper = styled.div`
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  
  svg {
    font-size: 24px;
    color: white;
  }
`;

const TextGroup = styled.div``;

const Label = styled.div`
  font-size: 12px;
  opacity: 0.9;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Value = styled.div`
  font-size: 17px;
  font-weight: 700;
  margin-top: 2px;
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  background: white;
  color: ${props => props.$danger ? '#EF4444' : '#2563EB'};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);

  svg {
    font-size: 18px;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px -2px rgba(0, 0, 0, 0.15);
  }
`;

const TokenBar = ({ onRenovar }) => {
  const [expiracao, setExpiracao] = useState(null);
  const [expirado, setExpirado] = useState(false);
  const [temToken, setTemToken] = useState(false);

  useEffect(() => {
    atualizarStatus();
    
    // Atualiza a cada 30 segundos
    const interval = setInterval(atualizarStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const atualizarStatus = () => {
    const dataExpiracao = obterDataExpiracao();
    const isExpirado = tokenExpirado();
    const isAutenticado = estaAutenticado();

    setExpiracao(dataExpiracao);
    setExpirado(isExpirado);
    setTemToken(isAutenticado);
  };

  const handleLogout = () => {
    if (window.confirm('Deseja realmente fazer logout?')) {
      removerToken();
      window.location.reload();
    }
  };

  if (!expiracao && !temToken) {
    return (
      <Bar $expired={true}>
        <Info>
          <IconWrapper>
            <HiShieldExclamation />
          </IconWrapper>
          <TextGroup>
            <Label>Status de Autenticação</Label>
            <Value>Token não configurado</Value>
          </TextGroup>
        </Info>
        <Actions>
          <Button onClick={onRenovar}>
            <HiRefresh />
            Fazer Login
          </Button>
        </Actions>
      </Bar>
    );
  }

  return (
    <Bar $expired={expirado}>
      <Info>
        <IconWrapper>
          {expirado ? <HiShieldExclamation /> : <HiShieldCheck />}
        </IconWrapper>
        <TextGroup>
          <Label>Token {expirado ? 'Expirado' : 'Ativo'}</Label>
          <Value>
            {expirado ? 'Renovação necessária' : `Válido até ${expiracao}`}
          </Value>
        </TextGroup>
      </Info>
      <Actions>
        <Button onClick={onRenovar}>
          <HiRefresh />
          {expirado ? 'Renovar Token' : 'Novo Token'}
        </Button>
        <Button onClick={handleLogout} $danger>
          <HiLogout />
          Logout
        </Button>
      </Actions>
    </Bar>
  );
};

export default TokenBar;

