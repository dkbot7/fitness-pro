# 🎨 FitPro Brand Kit

Kit de identidade visual completo do FitPro - Treinos Personalizados com IA.

---

## 📂 Estrutura de Arquivos

```
/brand/
├── README.md                       ← Você está aqui
├── BRAND_GUIDELINES.md             ← Diretrizes completas de marca
├── SOCIAL_MEDIA_TEMPLATES.md       ← Templates para redes sociais
│
├── /logos/                         ← Logos e variações
│   ├── fitpro-logo-original.png    (2138x2138px - Logo completa)
│   ├── fitpro-logo-horizontal.png  (Versão horizontal)
│   ├── fitpro-logo-vertical.png    (Versão vertical)
│   ├── fitpro-logo-symbol.png      (Apenas símbolo)
│   └── fitpro-logo-white.png       (Para fundos escuros)
│
├── /icons/                         ← Favicons e ícones de app
│   ├── favicon.ico                 (16x16, 32x32, 48x48)
│   ├── icon-192.png                (Android)
│   ├── icon-512.png                (Android)
│   ├── apple-touch-icon.png        (180x180 - iOS)
│   └── web-app-manifest.json       (PWA config)
│
└── /social/                        ← Assets para redes sociais
    ├── og-image.png                (1200x630 - Open Graph)
    ├── twitter-card.png            (1200x600 - Twitter Card)
    ├── instagram-profile.png       (320x320 - Profile pic)
    └── linkedin-banner.png         (1128x191 - Banner)
```

---

## 🚀 Início Rápido

### 1. Usando a Logo

```tsx
// React/TypeScript
import { Logo } from '@/components/brand/Logo';

<Logo variant="full" size="md" />
<Logo variant="symbol" size="sm" />
```

```html
<!-- HTML puro -->
<img src="/brand/logos/fitpro-logo-original.png" alt="FitPro" height="40" />
```

### 2. Cores da Marca

```css
/* CSS */
@import '@/styles/brand-tokens.css';

.button-primary {
  background-color: var(--fitpro-red);
  color: var(--color-white);
}
```

```tsx
// Tailwind (após configurar tema)
<button className="bg-fitpro-red text-white">
  Começar Treino
</button>
```

### 3. Tipografia

```css
/* Importar Inter font */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* Aplicar */
body {
  font-family: var(--font-family-primary);
}
```

---

## 🎨 Paleta de Cores

### Principais

| Preview | Nome | Hex | Uso |
|---------|------|-----|-----|
| 🔴 | FitPro Red | `#DC2626` | CTAs, destaques principais |
| 🔴 | FitPro Dark Red | `#B91C1C` | Hover states, sombras |
| ⚫ | FitPro Charcoal | `#2D3748` | Texto principal |
| ⚫ | FitPro Gray | `#4A5568` | Texto secundário |

### Semânticas

| Preview | Nome | Hex | Uso |
|---------|------|-----|-----|
| 🟢 | Success | `#10B981` | Treinos completos |
| 🟡 | Warning | `#F59E0B` | Alertas |
| 🔵 | Info | `#3B82F6` | Informações |
| 🔴 | Error | `#EF4444` | Erros |

[Ver paleta completa →](./BRAND_GUIDELINES.md#paleta-de-cores)

---

## 📝 Tipografia

**Fonte Principal:** [Inter](https://fonts.google.com/specimen/Inter)

```
Headline 1: 48px / Bold
Headline 2: 36px / Bold
Headline 3: 30px / Semibold
Body: 16px / Regular
Caption: 12px / Regular
```

[Ver hierarquia completa →](./BRAND_GUIDELINES.md#tipografia)

---

## 📐 Espaçamento

Sistema baseado em **8px**:

```
xs:  4px
sm:  8px
md:  16px
lg:  24px
xl:  32px
2xl: 48px
```

---

## 🖼️ Logo - Guia de Uso

### ✅ Permitido

- ✅ Escalar proporcionalmente
- ✅ Usar em fundos brancos ou muito claros
- ✅ Versão monocromática (preto ou branco)
- ✅ Espaço mínimo ao redor: 2x altura do símbolo

### ❌ Não Permitido

- ❌ Alterar cores
- ❌ Distorcer ou esticar
- ❌ Adicionar efeitos (sombra, brilho)
- ❌ Rotacionar
- ❌ Usar em fundos de baixo contraste

### Tamanhos Mínimos

- **Web:** 120px de largura
- **Impressão:** 25mm de largura
- **Favicon:** 32x32px (apenas símbolo)

---

## 📱 Redes Sociais

### Dimensões Padrão

| Plataforma | Tipo | Dimensões |
|------------|------|-----------|
| Instagram | Post | 1080x1080px |
| Instagram | Stories | 1080x1920px |
| Facebook | Post | 1200x630px |
| Facebook | Cover | 820x312px |
| Twitter | Header | 1500x500px |
| LinkedIn | Banner | 1128x191px |

[Ver templates completos →](./SOCIAL_MEDIA_TEMPLATES.md)

---

## 💻 Para Desenvolvedores

### Instalar Tokens de Design

```bash
# Copiar tokens CSS
cp apps/web/src/styles/brand-tokens.css src/styles/

# Ou importar no CSS global
@import '@/styles/brand-tokens.css';
```

### Configurar Tailwind

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'fitpro-red': '#DC2626',
        'fitpro-red-dark': '#B91C1C',
        'fitpro-charcoal': '#2D3748',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
};
```

### Usar Componentes

```tsx
import { Logo, HeaderLogo, LogoLoading } from '@/components/brand/Logo';

// Logo padrão
<Logo variant="full" size="md" />

// Header (com navegação)
<HeaderLogo onClick={() => navigate('/')} />

// Loading
<LogoLoading size={60} />
```

---

## 🎯 Para Designers

### Figma
- [Design System FitPro](#) (em breve)
- Componentes prontos
- Auto-layout configurado
- Variantes de estados

### Adobe XD
- [Kit de UI FitPro](#) (em breve)

### Canva
- [Templates FitPro](https://canva.com/fitpro) (em breve)
- Posts pré-configurados
- Cores e fontes instaladas

---

## 📊 Para Marketing

### Assets Disponíveis

- ✅ Logo (todas as variações)
- ✅ Paleta de cores
- ✅ Templates de redes sociais
- ✅ Guidelines de voz e tom
- ✅ Hashtags recomendadas
- ✅ Calendário de conteúdo

### Próximos Passos

1. Baixar logo original
2. Ler [Brand Guidelines](./BRAND_GUIDELINES.md)
3. Usar [templates de social media](./SOCIAL_MEDIA_TEMPLATES.md)
4. Manter consistência visual

---

## 🔄 Atualizações

| Versão | Data | Mudanças |
|--------|------|----------|
| 1.0 | 05/01/2026 | Lançamento inicial do Brand Kit |

---

## 📞 Contato

**Dúvidas sobre uso da marca:**
- Email: brand@fitpro.vip
- Slack: #brand-design

**Aprovação de materiais:**
- Enviar para revisão: [Formulário](https://forms.fitpro.vip/brand-review)

---

## 📜 Licença

© 2026 FitPro. Todos os direitos reservados.

O uso dos assets de marca é permitido apenas para:
- Materiais oficiais do FitPro
- Parceiros autorizados
- Mídia/imprensa (com crédito apropriado)

Uso não autorizado pode resultar em ação legal.

---

## 🌟 Checklist de Qualidade

Antes de publicar qualquer material da marca:

- [ ] Logo está na resolução correta?
- [ ] Cores estão de acordo com o guia?
- [ ] Tipografia está correta (Inter)?
- [ ] Espaçamento segue o sistema de 8px?
- [ ] Tom de voz está alinhado?
- [ ] Hashtags estão incluídas?
- [ ] Imagens têm alt text?
- [ ] Contraste de cores está OK (WCAG)?

---

**Mantenha a marca forte. Use com responsabilidade. 💪**
