# 🎨 Design System - Facta CLT

## Paleta de Cores

### Cores Principais
```
Primary Blue: #3b82f6 → #2563eb (gradient)
Background: #f8f9fc
Card Background: #ffffff
```

### Cores de Texto
```
Heading: #0f172a
Body: #1e293b
Secondary: #64748b
Light: #94a3b8
```

### Cores de Borda
```
Default: #e2e8f0
Hover: #cbd5e1
Focus: #3b82f6
```

### Cores de Status
```
Success: #10b981 / Background: #d1fae5
Error: #ef4444 / Background: #fee2e2
Warning: #f59e0b / Background: #fef3c7
Info: #3b82f6 / Background: #dbeafe
```

### Tags/Badges (estilo Behance)
```
Blue: #dbeafe / Text: #1e40af
Green: #d1fae5 / Text: #065f46
Red: #fee2e2 / Text: #991b1b
Yellow: #fef3c7 / Text: #78350f
Purple: #e9d5ff / Text: #6b21a8
```

## Tipografia

### Font Family
```
'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto'
```

### Font Sizes
```
Heading 1: 20px (weight: 700)
Heading 2: 16px (weight: 600)
Body: 14px (weight: 400)
Small: 13px (weight: 500)
Tiny: 12px (weight: 400)
```

## Espaçamento

```
Padding Cards: 24px
Margin Between: 20px
Border Radius: 8px-12px
```

## Sombras

```
Light: 0 1px 3px 0 rgba(0, 0, 0, 0.05)
Medium: 0 4px 12px rgba(59, 130, 246, 0.25)
Heavy: 0 20px 25px -5px rgba(0, 0, 0, 0.1)
```

## Ícones

### Biblioteca
React Icons (Feather Icons)

### Tamanhos
- Small: 16px
- Medium: 18px
- Large: 24px

### Ícones Usados
```
FiLogIn - Login
FiLogOut - Logout
FiUser - Usuário
FiLock - Senha
FiSearch - Buscar
FiUpload - Upload
FiFile - Arquivo
FiTable - Tabela
FiFilter - Filtro
FiDownload - Download
FiTrash - Deletar
FiCheckCircle - Sucesso
FiAlertCircle - Alerta
FiClock - Tempo
```

## Componentes

### Botões

**Primary Button**
```css
background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
color: white;
padding: 11px 24px;
border-radius: 8px;
font-weight: 600;
```

**Secondary Button**
```css
background: #f1f5f9;
color: #475569;
border: 1px solid #e2e8f0;
padding: 9px 18px;
border-radius: 8px;
```

### Inputs
```css
background: #f8fafc;
border: 1px solid #e2e8f0;
padding: 11px 14px 11px 42px; // com ícone
border-radius: 8px;
font-size: 14px;

&:focus {
  border-color: #3b82f6;
  background: white;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
```

### Cards
```css
background: white;
padding: 24px;
border-radius: 12px;
border: 1px solid #e2e8f0;
box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
```

## Animações

### Transitions
```css
transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
```

### Hover Effects
```css
transform: translateY(-1px);
box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
```

### Click Effects
```css
transform: scale(0.98);
```

## Princípios de Design

1. **Consistência**: Usar sempre os mesmos espaçamentos e cores
2. **Hierarquia**: Títulos maiores e bold, textos menores e lighter
3. **Feedback Visual**: Sempre dar feedback em ações (hover, click, loading)
4. **Acessibilidade**: Contraste adequado, tamanhos de fonte legíveis
5. **Profissionalismo**: Paleta sóbria, sem cores muito vibrantes
6. **Modernidade**: Gradientes sutis, sombras leves, bordas arredondadas

---

**Inspirado em**: Behance, Linear, Notion, Stripe Dashboard

