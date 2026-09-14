# Progreso y decisiones — Pathora

Log cronológico por sesión. Añadir entradas nuevas al final; no crear
documentos sueltos para esto.

## 2026-09-14 — Kickoff y esqueleto técnico

**Contexto revisado**: `pathora_concepto_producto.docx` y
`pathora_estrategia_distribucion.docx`. Producto: PAC Analyzer (gratis) →
Study Pack / Guided Plan / Review (pago). Mercado inicial UOC. MVP objetivo
10 días. Tesis de distribución: SEO long-tail + analyzer gratuito + referral
de asignatura.

**Decisiones tomadas**:
- Stack: Next.js (frontend) + FastAPI/Python (backend), monorepo
  (`apps/web`, `apps/api`).
- Despliegue: frontend en Vercel. Base de datos: Vercel Postgres (Neon).
  Backend FastAPI: **host todavía sin decidir** (opciones abiertas:
  Railway, Render, Fly.io, o funciones serverless de Vercel).
- Desarrollo local de BBDD: Postgres vía Docker (`docker-compose.yml`).
- `scratch/` se mantiene como carpeta de referencia de producto y de este
  log de progreso; no se sube a `docs/` ni se toca su tracking en git.

**Construido hoy** (solo esqueleto, sin lógica de producto):
- `apps/web`: Next.js + TypeScript + Tailwind, placeholder con tagline de
  marca y paleta de colores del documento de concepto.
- `apps/api`: FastAPI mínimo con `/health` y config vía `pydantic-settings`.
- `docker-compose.yml` con Postgres local.
- `.gitignore`, `.env.example`, `README.md` en la raíz.

**Pendiente / próxima sesión**:
- Elegir host definitivo para `apps/api`.
- Elegir 3–5 asignaturas UOC para pruebas de calidad inicial.
- Definir el schema JSON/Pydantic exacto del PAC Analyzer.
- Diseñar el flujo de upload → analyzer en `apps/web` y el primer endpoint
  real en `apps/api`.

## 2026-09-14 (cont.) — Naming definitivo

**Decisión**: el nombre del producto es **Pathora** (no "Pauta" como
working name). Renombrado en todo el esqueleto: título/branding de
`apps/web`, título de la API en `apps/api`, usuario/DB de Postgres en
`docker-compose.yml` y `.env.example`.

**Nota pendiente de verificar**: los dos documentos de producto en
`scratch/` (`pathora_concepto_producto.docx`,
`pathora_estrategia_distribucion.docx`) usan internamente el nombre "Pauta"
en el contenido y en el naming alternativo (sección 8.2 del documento de
concepto) — no se han editado, siguen como material de referencia
histórico de la sesión de brainstorming.

**Próxima sesión — orden acordado**:
1. Levantar Docker paso a paso (guía sencilla, ya que Docker Desktop no
   estaba corriendo al final de esta sesión). Docker es solo para
   desarrollo local: en producción se usará Vercel Postgres y
   `docker-compose.yml` deja de ser necesario.
2. Asignaturas piloto de UOC.
3. Schema del PAC Analyzer.
