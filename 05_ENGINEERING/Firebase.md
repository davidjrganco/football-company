---
doc: Firebase vs Supabase
area: 05_ENGINEERING
estado: Rascunho
responsavel: Fundadores
atualizado: 2026-08-01
---

# Firebase vs Supabase

Avaliação para a Fase 3 (auth + dados + tempo real). Decisão futura via ADR.

| Critério | Firebase | Supabase |
|---|---|---|
| Auth | Muito maduro | Bom (com RLS) |
| Tempo real | Firestore/RTDB | Realtime Postgres |
| Modelo de dados | NoSQL (documentos) | SQL (Postgres) |
| Regras de segurança | Security Rules | Row Level Security |
| Curva / familiaridade | Alta adoção | SQL clássico |
| Custo inicial | Generoso | Generoso / open-source |

**Recomendação preliminar:** Supabase se quisermos SQL e ligas/consultas relacionais;
Firebase se o tempo real e a simplicidade de auth pesarem mais. Decidir quando a Fase 3
estiver definida — registar em ADR.
