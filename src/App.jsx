import { useState, useEffect } from 'react';
import styled from 'styled-components';
import SearchForm from './components/SearchForm';
import BulkUpload from './components/BulkUpload';
import ResultsTable from './components/ResultsTable';
import LoginModal from './components/LoginModal';
import TokenBar from './components/TokenBar';
import SupabaseLogin from './components/SupabaseLogin';
import AlterarSenha from './components/AlterarSenha';
import { 
  carregarResultados, 
  salvarResultados, 
  limparResultados,
  atualizarResultados 
} from './utils/storage';
import { removerDuplicatas, contarDuplicatas } from './utils/deduplicar';
import { estaAutenticado, obterToken, removerToken } from './services/auth';
import { 
  estaAutenticadoSupabase, 
  obterCredenciaisFacta,
  logoutSupabase,
  obterUsuarioAtual 
} from './services/supabaseAuth';
import { gerarToken } from './services/auth';
import { HiLogout, HiUser, HiMail, HiBriefcase } from 'react-icons/hi';

const AppContainer = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  animation: fadeIn 0.5s ease;
`;

const Header = styled.header`
  background: white;
  padding: 24px 32px;
  border-radius: 16px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  border: 1px solid #E5E7EB;
  display: flex;
  justify-content: space-between;
  align-items: center;
  animation: slideDown 0.4s ease;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const LogoIcon = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #2563EB 0%, #1E40AF 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.3);
  
  svg {
    color: white;
    font-size: 24px;
  }
`;

const LogoText = styled.div``;

const Logo = styled.h1`
  font-size: 24px;
  color: #111827;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.5px;
  background: linear-gradient(135deg, #2563EB 0%, #8B5CF6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  font-size: 13px;
  color: #6B7280;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 4px 0 0 0;
  font-weight: 500;
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const UserCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: #F9FAFB;
  border-radius: 12px;
  border: 1px solid #E5E7EB;
`;

const UserAvatar = styled.div`
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

const UserInfo = styled.div`
  text-align: left;
`;

const UserName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 2px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const UserEmail = styled.div`
  font-size: 12px;
  color: #6B7280;
  display: flex;
  align-items: center;
  gap: 4px;
  
  svg {
    font-size: 12px;
  }
`;

const LogoutButton = styled.button`
  padding: 10px 20px;
  background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
  color: white;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 6px -1px rgba(239, 68, 68, 0.2);
  
  svg {
    font-size: 18px;
  }
  
  &:hover {
    background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%);
    box-shadow: 0 6px 12px -2px rgba(239, 68, 68, 0.3);
    transform: translateY(-2px);
  }
`;

const MainContent = styled.main`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const Notification = styled.div`
  position: fixed;
  top: 24px;
  right: 24px;
  background: white;
  padding: 20px 24px;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border-left: 4px solid #10B981;
  z-index: 10000;
  animation: slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  max-width: 380px;
  min-width: 320px;

  @keyframes slideInRight {
    from {
      transform: translateX(450px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

const NotificationTitle = styled.div`
  font-weight: 600;
  color: #111827;
  margin-bottom: 6px;
  font-size: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &::before {
    content: '✓';
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    background: #10B981;
    color: white;
    border-radius: 50%;
    font-size: 12px;
    font-weight: bold;
  }
`;

const NotificationMessage = styled.div`
  font-size: 13px;
  color: #6B7280;
  padding-left: 28px;
`;

function App() {
  const [resultados, setResultados] = useState([]);
  const [notificacao, setNotificacao] = useState(null);
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [mostrarLoginSupabase, setMostrarLoginSupabase] = useState(false);
  const [autenticado, setAutenticado] = useState(false);
  const [autenticadoSupabase, setAutenticadoSupabase] = useState(false);
  const [usuarioAtual, setUsuarioAtual] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [hash, setHash] = useState(window.location.hash);

  // Ouve mudanças no hash para permitir rota oculta sem links
  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Carrega resultados e verifica autenticação ao montar
  useEffect(() => {
    verificarAutenticacao();
  }, []);

  const verificarAutenticacao = async () => {
    setCarregando(true);
    
    // Carrega resultados salvos
    const resultadosSalvos = carregarResultados();
    setResultados(resultadosSalvos);
    
    // Verifica se está autenticado no Supabase
    const isAuthSupabase = await estaAutenticadoSupabase();
    setAutenticadoSupabase(isAuthSupabase);
    
    if (isAuthSupabase) {
      // Obtém dados do usuário
      const { success, user } = await obterUsuarioAtual();
      if (success) {
        setUsuarioAtual(user);
      }
      
      // Verifica se tem token Facta válido
      const tokenFacta = obterToken();
      const tokenValido = estaAutenticado();
      
      // Se não tem token Facta válido, gera automaticamente
      if (!tokenValido) {
        await gerarTokenAutomatico();
      } else {
        setAutenticado(true);
      }
    } else {
      // Não está autenticado no Supabase, mostra tela de login
      setMostrarLoginSupabase(true);
    }
    
    setCarregando(false);
  };

  // Gera token Facta automaticamente usando credenciais do Supabase
  const gerarTokenAutomatico = async () => {
    try {
      const credenciais = await obterCredenciaisFacta();
      
      if (credenciais.success) {
        const resultado = await gerarToken(credenciais.login, credenciais.senha);
        
        if (resultado.success) {
          setAutenticado(true);
          mostrarNotificacao(
            'Token gerado automaticamente',
            `Válido até ${resultado.expira}`
          );
        } else {
          mostrarNotificacao(
            'Erro ao gerar token',
            'Clique em Renovar para gerar manualmente'
          );
        }
      }
    } catch (error) {
      console.error('Erro ao gerar token automático:', error);
    }
  };

  // Função para adicionar novos resultados
  const handleNovoResultado = (resultado) => {
    setResultados(prev => {
      const novosResultados = [...prev, resultado];
      salvarResultados([resultado]);
      return novosResultados;
    });

    // Mostra notificação de sucesso
    if (resultado.success && resultado.data.length > 0) {
      mostrarNotificacao(
        'Consulta realizada!',
        `${resultado.data.length} registro(s) encontrado(s)`
      );
    }
  };

  // Função para adicionar múltiplos resultados (bulk)
  const handleNovosResultados = (novosResultados) => {
    setResultados(prev => {
      const atualizados = [...prev, ...novosResultados];
      salvarResultados(novosResultados);
      return atualizados;
    });
  };

  // Função para limpar todos os resultados
  const handleLimparResultados = () => {
    const confirmar = window.confirm(
      'Tem certeza que deseja limpar todos os resultados? Esta ação não pode ser desfeita.'
    );

    if (confirmar) {
      limparResultados();
      setResultados([]);
      mostrarNotificacao('Dados limpos', 'Todos os resultados foram removidos');
    }
  };

  // Função para remover duplicatas
  const handleRemoverDuplicatas = () => {
    const numDuplicatas = contarDuplicatas(resultados);
    
    if (numDuplicatas === 0) {
      mostrarNotificacao('Sem duplicatas', 'Não há registros duplicados para remover');
      return;
    }

    const confirmar = window.confirm(
      `Encontradas ${numDuplicatas} duplicata(s). Deseja removê-las?`
    );

    if (confirmar) {
      const resultadosSemDuplicatas = removerDuplicatas(resultados);
      setResultados(resultadosSemDuplicatas);
      atualizarResultados(resultadosSemDuplicatas);
      mostrarNotificacao(
        'Duplicatas removidas',
        `${numDuplicatas} registro(s) duplicado(s) removido(s)`
      );
    }
  };

  // Função para mostrar notificação temporária
  const mostrarNotificacao = (titulo, mensagem) => {
    setNotificacao({ titulo, mensagem });
    
    setTimeout(() => {
      setNotificacao(null);
    }, 3000);
  };

  // Função para lidar com sucesso do login
  const handleLoginSuccess = (resultado) => {
    setAutenticado(true);
    mostrarNotificacao(
      'Autenticação realizada!',
      `Token válido até ${resultado.expira}`
    );
  };

  // Função para abrir modal de login Facta
  const handleAbrirLogin = () => {
    setMostrarLogin(true);
  };

  // Função para lidar com sucesso do login Supabase
  const handleLoginSupabaseSuccess = async (resultado) => {
    setAutenticadoSupabase(true);
    setMostrarLoginSupabase(false);
    
    // Obtém dados do usuário
    const { success, user } = await obterUsuarioAtual();
    if (success) {
      setUsuarioAtual(user);
      mostrarNotificacao('Bem-vindo!', `Olá, ${user.nome}!`);
    }
    
    // Gera token Facta automaticamente
    await gerarTokenAutomatico();
  };

  // Função para fazer logout completo
  const handleLogoutCompleto = async () => {
    const confirmar = window.confirm('Deseja realmente sair do sistema?');

    if (!confirmar) return;

    try {
      await logoutSupabase();
    } catch (e) {
      // ignore
    }

    // Limpa token Facta e volta para tela de login sem recarregar
    try { removerToken(); } catch {}

    setAutenticadoSupabase(false);
    setAutenticado(false);
    setUsuarioAtual(null);
    setMostrarLoginSupabase(true);
    setMostrarLogin(false);
    mostrarNotificacao('Sessão encerrada', 'Faça login para continuar.');
  };

  // Tela de carregamento
  if (carregando) {
    return (
      <AppContainer>
        <Header>
          <LogoSection>
            <LogoIcon>
              <HiBriefcase />
            </LogoIcon>
            <LogoText>
              <Logo>Consulta CLT</Logo>
              <Subtitle>Carregando...</Subtitle>
            </LogoText>
          </LogoSection>
        </Header>
      </AppContainer>
    );
  }

  // Tela de login Supabase (obrigatória para qualquer rota, inclusive alterar-senha)
  if (mostrarLoginSupabase && !autenticadoSupabase) {
    return (
      <>
        <AppContainer>
          <Header>
            <LogoSection>
              <LogoIcon>
                <HiBriefcase />
              </LogoIcon>
              <LogoText>
                <Logo>Consulta CLT</Logo>
                <Subtitle>Sistema de Consulta de Trabalhadores</Subtitle>
              </LogoText>
            </LogoSection>
          </Header>
        </AppContainer>
        <SupabaseLogin onSuccess={handleLoginSupabaseSuccess} />
      </>
    );
  }

  // Tela oculta de Alterar Senha via hash route
  if (hash === '#/alterar-senha') {
    return (
      <>
        <AppContainer>
          <Header>
            <LogoSection>
              <LogoIcon>
                <HiBriefcase />
              </LogoIcon>
              <LogoText>
                <Logo>Consulta CLT</Logo>
                <Subtitle>Alteração de Senha</Subtitle>
              </LogoText>
            </LogoSection>
          </Header>
          <MainContent>
            <AlterarSenha />
          </MainContent>
        </AppContainer>
      </>
    );
  }

  return (
    <AppContainer>
      <Header>
        <LogoSection>
          <LogoIcon>
            <HiBriefcase />
          </LogoIcon>
          <LogoText>
            <Logo>Consulta CLT</Logo>
            <Subtitle>Sistema de Consulta de Trabalhadores</Subtitle>
          </LogoText>
        </LogoSection>
        {autenticadoSupabase && (
          <UserSection>
            {usuarioAtual && (
              <UserCard>
                <UserAvatar>
                  <HiUser />
                </UserAvatar>
                <UserInfo>
                  <UserName>{usuarioAtual.nome}</UserName>
                  <UserEmail>
                    <HiMail />
                    {usuarioAtual.email}
                  </UserEmail>
                </UserInfo>
              </UserCard>
            )}
            <LogoutButton onClick={handleLogoutCompleto}>
              <HiLogout />
              Sair
            </LogoutButton>
          </UserSection>
        )}
      </Header>

      <MainContent>
        {/* Barra de token com status e ações */}
        <TokenBar onRenovar={handleAbrirLogin} />

        {/* Formulário de busca individual */}
        <SearchForm onResultado={handleNovoResultado} />

        {/* Upload e processamento em lote */}
        <BulkUpload onResultados={handleNovosResultados} />

        {/* Tabela de resultados */}
        <ResultsTable 
          resultados={resultados} 
          onLimpar={handleLimparResultados}
          onRemoverDuplicatas={handleRemoverDuplicatas}
        />
      </MainContent>

      {/* Modal de login Facta (renovação manual) */}
      {mostrarLogin && (
        <LoginModal
          onClose={() => setMostrarLogin(false)}
          onSuccess={handleLoginSuccess}
        />
      )}

      {/* Notificação de sucesso */}
      {notificacao && (
        <Notification>
          <NotificationTitle>{notificacao.titulo}</NotificationTitle>
          <NotificationMessage>{notificacao.mensagem}</NotificationMessage>
        </Notification>
      )}
    </AppContainer>
  );
}

export default App;

