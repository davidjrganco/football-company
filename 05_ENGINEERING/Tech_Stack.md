---
doc: Tech Stack
area: 05_ENGINEERING
estado: Aprovado
responsavel: Fundadores
atualizado: 2026-08-01
---

# Tech Stack

## MVP (Fase 1)
- **Vite + React + TypeScript**
- **Tailwind CSS** (tema escuro, mobile-first)
- **PWA** via `vite-plugin-pwa`
- **Estado + persistência:** hook próprio sobre `localStorage` (sem backend, sem contas)
- **Dados:** `drills.json`

## Fases seguintes
- **Backend/auth:** Firebase ou Supabase (Fase 3, para social real). Ver ADR futuro.
- **IA:** API da Anthropic para análise de vídeo (Fase 4), sem hardware.
- **Nativo:** graduar para React Native / Expo a partir da mesma base, se/quando fizer sentido.

## Deploy
Netlify ou Vercel + CI/CD por GitHub Actions (ver `Deployment.md`).
