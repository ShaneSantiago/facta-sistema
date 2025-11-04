# 🏢 Facta - Sistema de Consulta CLT

Sistema web desenvolvido em React para consulta de dados de trabalhadores CLT através da API da Facta.

## 🚀 Funcionalidades

- ✅ **Autenticação com Token JWT**: Login seguro com renovação automática
- ✅ **Gerenciamento de Token**: Visualize expiração e renove facilmente
- ✅ **Busca Individual por CPF**: Consulta rápida digitando o CPF
- ✅ **Consulta em Lote via Planilha**: Carregue um arquivo Excel com múltiplos CPFs
- ✅ **Controle de Processamento**: Pause, retome ou cancele consultas em lote
- ✅ **Limite Configurável**: Escolha quantos CPFs processar de uma vez
- ✅ **Tabela Interativa**: Visualize resultados com paginação e filtros
- ✅ **Detalhes Expansíveis**: Clique para ver informações completas de cada registro
- ✅ **Exportação Excel**: Baixe planilhas de elegíveis, não elegíveis ou todos
- ✅ **Deduplicação Automática**: Remove registros duplicados automaticamente
- ✅ **Persistência Local**: Dados salvos automaticamente no navegador
- ✅ **Interface Moderna**: Design responsivo e amigável
- ✅ **Delay Configurável**: 5 segundos entre cada requisição para proteger a API

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn

## 🔧 Instalação

1. Navegue até a pasta do projeto:
```bash
cd "C:\Users\TCS\Desktop\Facta Funcional"
```

2. Instale as dependências:
```bash
npm install
```

## ▶️ Como Executar

1. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

2. O sistema abrirá automaticamente no navegador em `http://localhost:3000`

## 📖 Como Usar

### Autenticação

Ao abrir o sistema pela primeira vez, você verá uma **barra vermelha** indicando que o token não está configurado.

1. Clique em **"🔐 Fazer Login"**
2. Digite seu **login** e **senha**
3. Clique em **"Gerar Token"**
4. O token será gerado e salvo automaticamente
5. A barra ficará **verde** mostrando a validade do token

**Renovação do Token:**
- Quando o token expirar, a barra ficará vermelha
- Clique em **"🔄 Renovar"** e faça login novamente
- O novo token será aplicado automaticamente em todas as requisições

### Busca Individual

1. Digite o CPF no campo de busca (com ou sem formatação)
2. Clique em "Buscar"
3. Os resultados aparecerão na tabela abaixo

### Consulta em Lote

1. Clique no botão "📁" ou arraste um arquivo Excel para a área de upload
2. O sistema extrairá automaticamente todos os CPFs da planilha
3. Defina quantos CPFs deseja processar no campo "Quantidade para processar"
4. Clique em "▶️ Processar" para iniciar
5. Use os botões de controle:
   - **⏸️ Pausar**: Pausa o processamento
   - **▶️ Retomar**: Continua de onde parou
   - **⏹️ Cancelar**: Cancela completamente
   - **🗑️ Limpar**: Remove o arquivo carregado

### Visualizando Resultados

- **Filtros**: Use os campos no topo da tabela para filtrar por CPF, Nome, Empregador ou Elegibilidade
- **Detalhes**: Clique em "▼ Detalhes" para expandir e ver todas as informações
- **Paginação**: Navegue pelos resultados usando os controles na parte inferior
- **Downloads**: 
  - **📥 Baixar Elegíveis**: Exporta Excel apenas com registros elegíveis
  - **📥 Baixar Não Elegíveis**: Exporta Excel apenas com não elegíveis
  - **📥 Baixar Todos**: Exporta Excel com todos os registros
- **Limpar**: Use o botão "🗑️ Limpar Todos" para remover todos os resultados

## 📁 Formato da Planilha

A planilha Excel (.xls ou .xlsx) pode ter qualquer formato. O sistema procurará automaticamente por CPFs em todas as células, seja com ou sem formatação (000.000.000-00 ou 00000000000).

## 💾 Armazenamento

Os resultados são salvos automaticamente no localStorage do navegador, permitindo que você:
- Feche e reabra o navegador sem perder dados
- Continue de onde parou
- Acumule resultados de múltiplas consultas

## 🛠️ Tecnologias Utilizadas

- **React 18**: Biblioteca JavaScript para interfaces
- **Vite**: Build tool moderno e rápido
- **Styled Components**: Estilização com CSS-in-JS
- **Axios**: Cliente HTTP para requisições
- **XLSX**: Leitura de arquivos Excel

## 📦 Build para Produção

Para criar uma versão otimizada para produção:

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`.

### ⚙️ Configuração de Ambiente

O sistema usa variáveis de ambiente para gerenciar URLs:

- **Desenvolvimento** (`.env`): Usa proxy local (`/api`) para evitar CORS
- **Produção** (`.env.production`): Usa URL direta da API

Em produção, certifique-se de que o servidor da API tem CORS habilitado ou que o frontend está no mesmo domínio.

## 🔗 API

O sistema consome a API da Facta:
- **Endpoint**: `https://cltoff-homol.facta.com.br/clt/base-offline`
- **Método**: GET
- **Parâmetro**: `cpf` (11 dígitos)

## 📝 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── SearchForm.jsx   # Formulário de busca individual
│   ├── BulkUpload.jsx   # Upload e processamento em lote
│   └── ResultsTable.jsx # Tabela de resultados
├── services/            # Serviços
│   └── api.js          # Configuração e chamadas da API
├── utils/              # Utilitários
│   ├── storage.js      # Gerenciamento do localStorage
│   └── excelParser.js  # Leitura de arquivos Excel
├── styles/             # Estilos globais
│   └── GlobalStyles.js # Estilos CSS globais
├── App.jsx             # Componente principal
└── main.jsx            # Ponto de entrada
```

## 🎨 Recursos de UI

- Gradiente roxo moderno
- Animações suaves
- Feedback visual em todas as ações
- Notificações toast
- Estados de loading
- Responsivo para mobile e desktop

## 📄 Licença

Este projeto foi desenvolvido para uso interno.

---

Desenvolvido com ❤️ usando React + Vite

# facta-sistema
