---
doc: Normas de Documentação e Contribuição
area: raiz
estado: Rascunho
responsavel: Fundadores
atualizado: 2026-08-01
---

# Normas de Documentação e Contribuição

## Princípio
Documentação "just enough" por sprint: escrevemos o que precisamos para avançar
com clareza, e expandimos quando for preciso. Documentar não é encher pastas — é
pensar antes de fazer (Regra de Ouro n.º 2), mantendo o Nicolas envolvido e o
produto a andar.

## Front-matter
Todos os documentos começam com o bloco YAML dos `_TEMPLATES/Doc_Template.md`
(`doc`, `area`, `estado`, `responsavel`, `atualizado`).

## Estados de um documento
- **Rascunho** — em construção.
- **Aprovado** — validado pelos fundadores; base estável.
- **Ativo** — em uso corrente (ex.: sprint a decorrer).
- **Arquivado** — substituído (nunca apagar; referenciar o sucessor).

## Decisões
Vão para `12_DECISIONS` como ADRs. **Nunca alterar um ADR antigo.** Para mudar,
cria-se um novo ADR que substitui (`substitui: ADR-XXXX`).

## Convenções de código (quando começar)
- TypeScript estrito; componentes pequenos e testáveis.
- Nomes de ficheiros de componentes em PascalCase; hooks em `useX`.
- Sem segredos no repo. Sem dados pessoais de menores.
