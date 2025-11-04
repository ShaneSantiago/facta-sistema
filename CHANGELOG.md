# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

## [2.0.0] - 2025-11-04

### 🎉 INTEGRAÇÃO COMPLETA COM SUPABASE

#### ⭐ Sistema de Autenticação Multi-Camada

**Autenticação Supabase:**
- ✅ Login seguro com email/senha
- ✅ Gestão de múltiplos usuários
- ✅ Row Level Security (RLS) habilitado
- ✅ Sessões persistentes
- ✅ Logout completo do sistema

**Integração com Facta:**
- ✅ Credenciais criptografadas no banco (AES-256)
- ✅ Geração automática de token Facta após login Supabase
- ✅ Renovação automática transparente
- ✅ Sem necessidade de digitar credenciais Facta sempre

#### 🔐 Segurança

- **Criptografia**: Senhas do Facta criptografadas com CryptoJS
- **RLS**: Usuários acessam apenas seus próprios dados
- **Políticas**: Controle granular de acesso no banco
- **Auditoria**: Registra último login de cada usuário
- **Logs**: Sistema opcional de auditoria de consultas

#### 🎨 Interface Nova

- **Tela de Login**: Interface elegante de autenticação
- **Barra de Usuário**: Mostra nome do usuário logado
- **Botão Sair**: Logout completo do sistema
- **Loading**: Tela de carregamento durante autenticação
- **Notificações**: Feedback de todas as ações

#### 📦 Dependências Adicionadas

- `@supabase/supabase-js`: ^2.x
- `crypto-js`: ^4.x

#### 🗂️ Estrutura de Arquivos

```
src/
├── config/
│   └── supabase.js          # Configuração Supabase
├── services/
│   ├── auth.js              # Auth Facta (existente)
│   └── supabaseAuth.js      # Auth Supabase (novo)
└── components/
    ├── SupabaseLogin.jsx    # Tela de login (novo)
    ├── LoginModal.jsx       # Modal Facta (existente)
    └── TokenBar.jsx         # Barra de status (existente)
```

#### 📚 Documentação

- ✅ `SUPABASE_SETUP.md`: Guia completo de configuração
- ✅ `supabase_setup.sql`: Script SQL para setup
- ✅ Instruções de segurança e RLS
- ✅ Guia de cadastro de usuários

---

## [1.1.0] - 2025-11-04

### 🎉 Sistema de Autenticação JWT

#### ✨ Novas Funcionalidades
- **Login Modal**: Interface elegante para gerar token
- **Barra de Status do Token**: Visualize validade e expiração em tempo real
- **Renovação Automática**: Token atualizado automaticamente em todas as requisições
- **Gestão de Token**: Armazenamento seguro no localStorage
- **Logout**: Opção para remover token do sistema

#### 🔧 Melhorias Técnicas
- Interceptor do Axios para incluir token dinamicamente
- Verificação automática de expiração do token
- Sistema de notificações para feedback ao usuário
- Token não é mais hardcoded no código

#### 🎨 Interface
- Barra verde quando token ativo
- Barra vermelha quando token expirado ou ausente
- Modal de login moderno e responsivo
- Botões de renovar e logout facilmente acessíveis

## [1.0.1] - 2025-11-04

### 🔧 Correções
- Adicionada deduplicação automática de registros idênticos
- Sistema agora remove automaticamente duplicatas com mesmo CPF + Matrícula
- Novo botão "🔄 Remover Duplicatas" para limpar duplicatas existentes

### ✨ Melhorias
- Otimização no processamento de resultados
- Contador automático de duplicatas antes de remover
- Notificações informando quantas duplicatas foram removidas

## [1.0.0] - 2025-11-04

### 🎉 Lançamento Inicial

#### ✨ Funcionalidades
- Busca individual por CPF
- Upload de planilha Excel para consulta em lote
- Controle de processamento (pausar, retomar, cancelar)
- Limite configurável de CPFs a processar
- Tabela com paginação (10 itens por página)
- Filtros por CPF, Nome, Empregador e Elegibilidade
- Detalhes expansíveis de cada registro
- Exportação para Excel:
  - Baixar apenas elegíveis
  - Baixar apenas não elegíveis
  - Baixar todos os registros
- Persistência de dados no localStorage
- Notificações de sucesso/erro
- Interface responsiva

#### 🔧 Configurações
- Delay de 5 segundos entre requisições
- Proxy configurado para evitar CORS em desenvolvimento
- Variáveis de ambiente para dev/produção
- Token JWT de autenticação configurado

#### 🎨 Design
- Interface moderna com gradiente roxo
- Animações suaves
- Estados de loading
- Feedback visual em todas as ações

#### 📦 Tecnologias
- React 18.2.0
- Vite 5.0.11
- Styled Components 6.1.8
- Axios 1.6.5
- XLSX 0.18.5

---

## Formato das Versões

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

### Tipos de Mudanças
- `Added` (Adicionado) para novas funcionalidades
- `Changed` (Modificado) para mudanças em funcionalidades existentes
- `Deprecated` (Obsoleto) para funcionalidades que serão removidas
- `Removed` (Removido) para funcionalidades removidas
- `Fixed` (Corrigido) para correções de bugs
- `Security` (Segurança) para vulnerabilidades corrigidas

