---
doc: Deployment / CI-CD
area: 05_ENGINEERING
estado: Rascunho
responsavel: Fundadores
atualizado: 2026-08-01
---

# Deployment / CI-CD

## Alojamento
Netlify ou Vercel (o David já domina Netlify). PWA servida por HTTPS.

## CI/CD (GitHub Actions)
- Em cada push: instalar deps, lint, type-check, build.
- Em PR: pré-visualização (deploy preview).
- Em merge para `main`: deploy de produção.
- (Futuro) testes automatizados a correr no pipeline.

## Ambientes
`main` = produção; branches de feature com previews. Sem segredos no repo (`.env` ignorado).
