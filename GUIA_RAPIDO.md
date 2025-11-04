# 🚀 Guia Rápido - Facta CLT

## ⚡ Início Rápido

### 1. Instalar Dependências (Já feito!)
```bash
npm install
```

### 2. Iniciar o Sistema
```bash
npm run dev
```

O sistema abrirá automaticamente em `http://localhost:3000`

---

## 📱 Funcionalidades Principais

### 🔍 Busca Individual
1. Digite o CPF no campo (com ou sem pontos/traços)
2. Clique em "Buscar"
3. Veja os resultados na tabela

### 📊 Consulta em Lote

#### Preparar a Planilha:
- Crie um arquivo Excel (.xlsx ou .xls)
- Cole os CPFs em qualquer coluna/célula
- Pode estar formatado (000.000.000-00) ou não (00000000000)

#### Usar no Sistema:
1. **Upload**: Arraste ou clique para selecionar o arquivo
2. **Configurar**: Defina quantos CPFs processar (ex: 10, 100)
3. **Processar**: Clique no botão ▶️ Processar
4. **Controlar**: 
   - ⏸️ **Pausar**: Para temporariamente
   - ▶️ **Retomar**: Continua de onde parou
   - ⏹️ **Cancelar**: Interrompe completamente
   - 🗑️ **Limpar**: Remove o arquivo

---

## 📋 Visualizar Resultados

### Filtros
- **CPF**: Digite para filtrar por CPF específico
- **Nome**: Busque por nome do trabalhador
- **Empregador**: Filtre por empresa
- **Elegível**: Selecione Sim/Não/Todos

### Tabela
- **▼ Detalhes**: Clique para ver todas as informações
- **Paginação**: Navegue pelos resultados (10 por página)
- **Downloads**:
  - **📥 Baixar Elegíveis**: Gera Excel só com elegíveis
  - **📥 Baixar Não Elegíveis**: Gera Excel só com não elegíveis
  - **📥 Baixar Todos**: Gera Excel com todos os registros
- **🔄 Remover Duplicatas**: Remove registros duplicados (mesmo CPF + Matrícula)
- **🗑️ Limpar Todos**: Remove todos os resultados salvos

---

## 💾 Dados Salvos

Os resultados são salvos automaticamente no navegador (localStorage):
- ✅ Não perdem ao fechar o navegador
- ✅ Acumulam entre sessões
- ✅ Podem ser limpos com o botão "Limpar Todos"

---

## 🎯 Exemplo de CPF para Teste

**CPF**: 40644169885 (ou 406.441.698-85)

Este CPF retorna 2 registros com informações de empregadores diferentes.

---

## 📊 Informações Exibidas

### Visão Geral (Tabela Principal)
- CPF
- Nome
- Matrícula
- Empregador
- Elegibilidade
- Margem Disponível

### Detalhes Expandidos
- Sexo e Data de Nascimento
- Nome da Mãe
- Data de Admissão
- CBO (Código Brasileiro de Ocupações)
- CNAE (Classificação Nacional de Atividades)
- Valores de Vencimentos e Margens
- Status PEP (Pessoa Exposta Politicamente)
- Motivo de Inelegibilidade
- Empréstimos Legados

---

## 🔧 Comandos Úteis

```bash
# Iniciar desenvolvimento
npm run dev

# Criar build de produção
npm run build

# Visualizar build
npm preview
```

---

## 🎨 Recursos da Interface

- ✨ Design moderno com gradiente roxo
- 📱 Responsivo (funciona em mobile e desktop)
- 🔄 Animações suaves
- 💬 Notificações de sucesso/erro
- ⚡ Feedback visual em tempo real
- 🎯 Estados de loading

---

## ⚠️ Observações Importantes

1. **Delay entre Requisições**: O sistema adiciona um delay de **5 segundos** entre cada consulta para não sobrecarregar a API

2. **Persistência**: Os dados ficam salvos no navegador. Use "Limpar Todos" para remover

3. **Formato da Planilha**: O sistema é inteligente e encontra CPFs em qualquer lugar da planilha

4. **Processamento**: As consultas são feitas uma por uma, em sequência

5. **Pausar vs Cancelar**:
   - **Pausar**: Para temporariamente, pode retomar
   - **Cancelar**: Para definitivamente, não pode retomar

6. **Downloads Excel**: As planilhas incluem mais de 25 campos organizados e formatados:
   - CPF formatado
   - Dados pessoais completos
   - Informações de emprego
   - Valores monetários formatados
   - Datas no formato DD/MM/AAAA

7. **Produção**: O sistema está configurado para funcionar em produção sem CORS. Use `npm run build` para gerar a versão otimizada.

8. **Deduplicação**: O sistema remove automaticamente duplicatas ao exibir. Se ver duplicatas antigas no localStorage, use o botão "🔄 Remover Duplicatas".

---

## 🐛 Solução de Problemas

### Erro ao fazer upload da planilha
- Verifique se o arquivo é .xlsx ou .xls
- Certifique-se de que há CPFs no arquivo (11 dígitos)

### Nenhum CPF encontrado
- Verifique se os CPFs têm 11 dígitos
- O sistema aceita com ou sem formatação

### Resultados não aparecem
- Verifique sua conexão com a internet
- A API pode estar temporariamente indisponível

### Dados não salvam
- Verifique se o localStorage está habilitado no navegador
- Não use modo anônimo/privado

---

## 📞 API Utilizada

**Endpoint**: https://cltoff-homol.facta.com.br/clt/base-offline

**Parâmetro**: `?cpf=00000000000`

---

Desenvolvido com ❤️ usando React + Vite + Styled Components

