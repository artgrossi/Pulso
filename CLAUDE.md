# Pulso - Regras do Projeto

## REGRA CRITICA: Emojis proibidos

**NUNCA use emojis (Unicode emoji characters) em nenhum lugar do codigo.**

Isso inclui:
- Componentes React/TSX
- Strings em arquivos `.ts` / `.tsx`
- Constantes e configuracoes
- Comentarios no codigo
- Mensagens exibidas ao usuario
- Placeholder text
- Testes

### O que usar no lugar de emojis

Este projeto possui um sistema de icones SVG profissional em `src/components/ui/Icon.tsx`.

**Sempre use o componente `<Icon>` para representar icones visuais:**

```tsx
import { Icon } from '@/components/ui/Icon';

// Correto
<Icon name="flame" size={20} className="text-orange-500" />

// ERRADO - NUNCA faca isso
<span>🔥</span>
```

### Icones disponiveis

Os nomes validos estao definidos no tipo `IconName` em `src/components/ui/Icon.tsx`:

`arrow-path`, `building`, `trending-up`, `academic-cap`, `flame`, `snowflake`,
`coin`, `document-text`, `banknotes`, `calculator`, `shield-check`, `chart-bar`,
`check-circle`, `lightbulb`, `question-mark`, `target`, `clipboard`, `book-open`,
`exclamation-triangle`, `x-circle`, `star`, `sparkles`, `thumb-up`, `bolt`,
`clock`, `rocket`, `trending-down`, `trophy`, `medal`, `users`, `arrow-right`,
`cog`, `calendar`

Se precisar de um icone que nao existe, **adicione um novo SVG ao componente Icon** seguindo o padrao Heroicons (outline, 24x24 viewBox, strokeWidth 1.5).

### Configuracao de tracks (trilhas)

As trilhas em `src/lib/constants.ts` usam `IconName` tipado. Ao criar/editar trilhas, use nomes de icones do componente Icon, nunca strings emoji.

## Stack tecnica

- **Framework:** Next.js 16 (App Router)
- **Linguagem:** TypeScript (strict)
- **Estilizacao:** Tailwind CSS 4
- **Banco de dados:** Supabase (PostgreSQL)
- **Autenticacao:** Supabase Auth

## Arquitetura

Este projeto e pensado para **evoluir para um mobile app** (React Native). Por isso:

- Use o componente `Icon` (SVG inline) em vez de fontes de icones externas
- Mantenha componentes pequenos e reutilizaveis
- Evite dependencias pesadas de DOM/browser
- Prefira logica em server actions (`src/lib/actions/`)
- Mantenha a tipagem forte com TypeScript

## Estrutura de pastas

```
src/
  app/              # Rotas Next.js (App Router)
    (app)/          # Rotas protegidas (com layout + nav)
  components/
    ui/             # Componentes base reutilizaveis (Icon, etc.)
    branding/       # Logo e identidade visual
    dashboard/      # Componentes do dashboard
    ferramentas/    # Calculadoras financeiras
    navigation/     # Navegacao (bottom nav)
    onboarding/     # Wizard de diagnostico
    perfil/         # Componentes de perfil
    relatorio/      # Componentes de relatorio
  lib/
    actions/        # Server actions
    supabase/       # Clients Supabase
    types/          # Tipos TypeScript
    constants.ts    # Constantes globais (TRACK_CONFIG, etc.)
```

## Design system

- **Tema:** Claro, minimalista, profissional
- **Cores primarias:** Gradiente Pulso blue (#4facfe -> #00f2fe)
- **Tipografia:** Inter
- **Bordas:** `rounded-xl` / `rounded-2xl`
- **Sombras:** `shadow-sm` com `hover:shadow-md`
- **Glassmorphism:** `backdrop-blur-sm` com `bg-white/80`
- **Sem emojis** - apenas icones SVG do componente Icon
