# 📚 Índice de Documentação - FitPro

**Última atualização:** 06/01/2026

## 🚀 Comece Aqui

**Novo no projeto?** Leia nesta ordem:
1. [README.md](./README.md) - Visão geral completa
2. [SETUP.md](./SETUP.md) - Setup local
3. [USER_JOURNEY.md](./USER_JOURNEY.md) - Jornada do usuário

## 📖 Documentação Principal

### Essenciais
| Documento | Descrição | Quando Usar |
|-----------|-----------|-------------|
| [README.md](./README.md) | Documentação principal do projeto | Sempre começar aqui |
| [SETUP.md](./SETUP.md) | Guia de setup local | Configurar ambiente dev |
| [DEPLOY_PRODUCTION.md](./DEPLOY_PRODUCTION.md) | Deploy em produção | Fazer deploy manual |
| [PRODUCAO_COMPLETA_2026.md](./PRODUCAO_COMPLETA_2026.md) | Checklist de produção | Verificar status produção |

### Configuração
| Documento | Descrição | Quando Usar |
|-----------|-----------|-------------|
| [CLI_CONFIG_SUMMARY.md](./CLI_CONFIG_SUMMARY.md) | Configuração via CLI | Config Cloudflare CLI |

### Projeto
| Documento | Descrição | Quando Usar |
|-----------|-----------|-------------|
| [USER_JOURNEY.md](./USER_JOURNEY.md) | Jornada do usuário | Entender fluxo do app |
| [BRAND_KIT_INVENTORY.md](./BRAND_KIT_INVENTORY.md) | Assets e branding | Trabalhar com design |

## 📊 Histórico de Sprints

| Sprint | Documento | Conteúdo |
|--------|-----------|----------|
| Sprint 1 | [SPRINT1_SUMMARY.md](./SPRINT1_SUMMARY.md) | Foundation & Setup |
| Sprint 2 | [SPRINT2_SUMMARY.md](./SPRINT2_SUMMARY.md) | Core Features |
| Sprint 2 | [SPRINT2_PLAN.md](./SPRINT2_PLAN.md) | Planejamento Sprint 2 |
| Sprint 3 | [SPRINT3_SUMMARY.md](./SPRINT3_SUMMARY.md) | Polish & Launch |

## 🧹 Limpeza e Organização

| Documento | Descrição | Quando Usar |
|-----------|-----------|-------------|
| [CLEANUP_SUMMARY.md](./CLEANUP_SUMMARY.md) | Resumo da limpeza | Ver o que foi limpo |
| [LIMPEZA_COMPLETA.md](./LIMPEZA_COMPLETA.md) | Limpeza detalhada | Entender reorganização |

## 🗄️ Archive

**Localização:** `archive/`

### Categorias
- **archive/deploy_attempts/** - 14 tentativas de deploy
- **archive/config_attempts/** - 11 tentativas de configuração
- **archive/old_docs/** - 14 documentos antigos
- **archive/nextjs_old/** - Código Next.js antigo

### Como Usar
```bash
# Buscar em todos os arquivos
grep -r "palavra-chave" archive/

# Ver estrutura
ls -R archive/

# Restaurar arquivo
cp archive/path/file.md ./
```

## 🎯 Guias Rápidos

### Para Desenvolvedores

**Setup Inicial:**
1. Clone: `git clone https://github.com/dkbot7/fitness-pro.git`
2. Instale: `pnpm install`
3. Configure: Siga [SETUP.md](./SETUP.md)
4. Rode: `pnpm dev`

**Deploy:**
1. Automático: `git push origin main`
2. Manual: Veja [DEPLOY_PRODUCTION.md](./DEPLOY_PRODUCTION.md)

### Para Product Managers

**Entender o Produto:**
1. [README.md](./README.md) - Features e arquitetura
2. [USER_JOURNEY.md](./USER_JOURNEY.md) - Fluxo do usuário
3. [SPRINT1_SUMMARY.md](./SPRINT1_SUMMARY.md) - O que foi feito

**Status de Produção:**
- [PRODUCAO_COMPLETA_2026.md](./PRODUCAO_COMPLETA_2026.md)

### Para Designers

**Assets:**
- [BRAND_KIT_INVENTORY.md](./BRAND_KIT_INVENTORY.md)

**Fluxo do Usuário:**
- [USER_JOURNEY.md](./USER_JOURNEY.md)

## 🔍 Busca Rápida

### Por Tópico

**Autenticação (Clerk):**
- [README.md](./README.md) - Seção "Arquitetura"
- [SETUP.md](./SETUP.md) - Configuração Clerk

**Deploy:**
- [DEPLOY_PRODUCTION.md](./DEPLOY_PRODUCTION.md)
- [CLI_CONFIG_SUMMARY.md](./CLI_CONFIG_SUMMARY.md)
- [PRODUCAO_COMPLETA_2026.md](./PRODUCAO_COMPLETA_2026.md)

**Database:**
- [README.md](./README.md) - Seção "Database"
- [SETUP.md](./SETUP.md) - Setup Neon

**PWA:**
- [README.md](./README.md) - Seção "PWA Features"
- [PRODUCAO_COMPLETA_2026.md](./PRODUCAO_COMPLETA_2026.md) - Seção PWA

**Vite (Migração do Next.js):**
- [README.md](./README.md) - Seção "Por que Vite?"
- archive/old_docs/MIGRACAO_VITE_COMPLETA.md

## 📱 Links Úteis

### Produção
- **Site:** https://fitpro.vip
- **API:** https://api.fitpro.vip
- **Cloudflare:** https://dash.cloudflare.com/pages/view/fitness-pro

### Desenvolvimento
- **GitHub:** https://github.com/dkbot7/fitness-pro
- **Clerk:** https://dashboard.clerk.com
- **Neon:** https://console.neon.tech

## 🆘 Precisa de Ajuda?

### Problemas Comuns

**"Build falhou":**
1. Veja [DEPLOY_PRODUCTION.md](./DEPLOY_PRODUCTION.md)
2. Verifique variáveis de ambiente
3. Consulte archive/deploy_attempts/ para casos similares

**"Clerk em Development mode":**
1. Veja [CLI_CONFIG_SUMMARY.md](./CLI_CONFIG_SUMMARY.md)
2. Verificar chaves de produção

**"Como fazer X?":**
1. Busque no README.md
2. Consulte SETUP.md
3. Procure em archive/

### Comandos de Busca

```bash
# Buscar em todos os .md da raiz
grep -r "termo" *.md

# Buscar incluindo archive
grep -r "termo" . --include="*.md"

# Listar todos os docs
ls *.md
```

## ✅ Status Atual

**Última limpeza:** 06/01/2026
**Arquivos .md:** 13 (raiz) + 39 (archive)
**Status produção:** ✅ 100% Funcional
**URL:** https://fitpro.vip

---

**Este índice foi criado em:** 06/01/2026
**Mantido por:** Equipe FitPro
