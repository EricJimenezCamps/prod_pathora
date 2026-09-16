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

## 2026-09-16 — Docker/Postgres up locally

From here on, sessions are conducted in English (user's preference, to
practice the language).

**Docker Desktop issue resolved**: it was failing to start with a WSL
timeout (`Wsl/Service/CreateInstance/0x800705b4`) on the internal
`docker-desktop` WSL distro. Fixed with `wsl --shutdown` followed by
restarting Docker Desktop — no reinstall needed.

**Discussed and decided against (for now)**: replacing the core stack with
Airflow + Snowflake + dbt for "productive-like" local development. Those
are batch/analytics tools, not a fit for a transactional, low-latency
user-facing app (upload → synchronous analysis → checkout). Decision:
FastAPI + Postgres stays as the transactional layer; an analytics layer
(Airflow/dbt/warehouse) is a possible future addition once there's real
usage data worth aggregating (see concept doc, section 4.1) — not now, and
not a blocker for the MVP.

**Verified**: `docker compose up -d` starts Postgres cleanly;
`docker compose exec postgres psql -U pathora -d pathora -c "SELECT 1;"`
returns successfully. (Note: hitting `http://localhost:5432` in a browser
logs "invalid length of startup packet" in the container — expected, since
Postgres doesn't speak HTTP; not an error.)

**Next up**: UOC pilot subjects, then the PAC Analyzer schema (as already
queued above).

## 2026-09-16 (cont.) — UOC pilot subjects decided

Researched real demand/WTP signal via the main paid-human competitor
(Pacsolver): degree-level subject catalogs and per-PAC pricing.

**Findings**: Pacsolver covers 128 subjects in Psicología and 97 in ADE,
pricing €40 (shared) to €100 (personalized) per PAC, plus a separate
cheaper "Resumen" product per subject — validates demand for both a full
guided-help product and a lighter summary product. "Integración de
sistemas de información" (Ing. Informática) lists pricing up to PAC20,
signaling very high assignment frequency per semester.

**Decision — 5 pilot subjects**, scored against the weighting table in
`pathora_estrategia_distribucion.docx` §3 (public PAC/demand,
competitor WTP, workload/frequency, LLM fit):

1. **Contabilidad de costes** (ADE) — named as SEO example in the concept
   doc; rule-based calculations, high LLM fit.
2. **Estadística aplicada** (ADE) — deterministic math, easy to verify,
   recurs across cohorts.
3. **Macroeconomía** (ADE) — named as SEO example in the concept doc; more
   conceptual, good diversity within the same degree.
4. **Psicometría** (Psicología) — the running example already used in the
   estrategia doc; applied statistics; tests the product outside ADE.
5. **Integración de sistemas de información** (Ing. Informática) — covers
   the "programación" vertical from concept doc §4.1; strongest recurrence
   signal found (up to PAC20).

**Deliberately deferred**: Derecho (Law) — named as a future vertical in
the concept doc, but essay/case-study PACs are harder to verify
deterministically and riskier for hallucinations in a 10-day MVP. Good
candidate for phase 2, not phase 1.

**Next up**: PAC Analyzer schema (JSON/Pydantic).

## 2026-09-16 (cont.) — PAC Analyzer academic schema

Added `apps/api/app/schemas/pac.py`: one shared `PAC` Pydantic model (not
one per product tier) covering `Exercise`, `Deliverable`, `RubricItem`,
with a `Difficulty` enum. This is the "academic schema" named in the
concept doc's architecture table (§9) — Analyzer, Study Pack, Guided Plan
and Review all read from this same structure instead of each defining
their own.

**Key choices**: exercises/deliverables/rubric items carry stable string
`id`s so later features (Guided Plan steps, Review coverage checks) can
reference them without re-parsing; `subject` is free text, not an enum of
the 5 pilot subjects, since the Analyzer must accept any upload; no
separate `overall_difficulty` field — derive it from `exercises[]` at
render time instead of asking the LLM to judge difficulty twice;
`source_text_hash` included to support de-duping identical re-uploads
later (ties to the <€0,50/purchase AI-cost target in the estrategia doc
§11).

**Verified**: added a realistic fixture,
`apps/api/app/schemas/examples/contabilidad_de_costes.json`, and confirmed
it parses via `PAC.model_validate_json()`.

**Deferred on purpose**: linking exercises to material chunks (the
"killer feature" in concept doc §4.1, needs RAG/materials ingestion first),
DB persistence model, the actual `/analyze` endpoint + LLM prompt, and
Study Pack/Guided Plan/Review's own output shapes.

**Next up**: wire a first `/analyze` endpoint (even with a hardcoded/fake
`PAC` response) so `apps/web` has something real to call, or start on the
LLM extraction prompt — to be decided next session.

## 2026-09-16 (cont.) — Landing page

Deliberately paused backend work to build the real landing page in
`apps/web` (was just a name + tagline placeholder). Backend picks back up
in a separate session.

**Built**: `Hero`, `UploadDropzone`, `HowItWorks`, `Pricing` under
`apps/web/app/_components/`, composed in `app/page.tsx`. All copy pulled
directly from the concept doc (§7 user journey, §8.1 brand messages, §8.3
wireframe, §3.1–§3.4 pricing) — nothing invented. Guided Plan is
highlighted as "producto principal" per the doc.

**Upload dropzone**: fully interactive (drag-and-drop + click-to-browse,
real client state) but the CTA is intentionally inert — no `/analyze`
endpoint exists yet, so clicking it just shows "Muy pronto: el análisis en
tiempo real llega con el backend." instead of pretending to submit.

**Verified properly, not just by reading the code**: no browser-driving
tool was available in this environment (no `chromium-cli`, no Playwright
installed), so installed Playwright + Chromium one-off into the session
scratchpad, started the dev server, and drove the real page: confirmed all
four sections render, the CTA is disabled until a file is selected, the
filename appears after selecting `dummy.pdf` via `setInputFiles`, the CTA
enables and clicking it shows the status message, and there were zero
console errors. `npm run build` also passes cleanly.

**Deferred**: swapping the font to Inter/Manrope (doc §8 recommends it;
currently still Next.js default Geist) — cheap follow-up, not done today.

**Next up**: back to backend — wire a first `/analyze` endpoint (or start
the LLM extraction prompt), as queued above.

## 2026-09-16 (cont.) — Real `/analyze` endpoint with Claude extraction

Built the `/analyze` endpoint in two passes. First pass: accepts a PDF
upload, validates content type, hashes the real bytes (`sha256`) for
`source_text_hash`, and returned the hardcoded fixture — enough to prove
the HTTP layer (upload, validation, `response_model=PAC`) end-to-end
before tackling real extraction.

Second pass: wired real extraction via the Claude API. **Decision — LLM
provider is Anthropic** (`.env.example`'s `LLM_API_KEY` renamed to
`ANTHROPIC_API_KEY`). Added `app/services/analyzer.py`:
`client.messages.parse(output_format=PACExtraction)` with the PDF sent
natively as a base64 `document` content block (no separate PDF-text
library — Claude reads layout/tables directly). Model: `claude-opus-5`.

**Key design choice**: split the schema into `PAC` (full record) and a
new `PACExtraction` (everything except `id` and `source_text_hash`) in
`apps/api/app/schemas/pac.py`. The LLM must never generate `id` or
`source_text_hash` — those are assembled server-side in `main.py` from
`uuid4()` and the real `sha256` of the uploaded bytes, so the hash stays
trustworthy for future de-dup even though the analysis content comes from
the model.

**Bug found and fixed along the way**: `config.py`'s `env_file=".env"` was
a relative path, resolved against whatever directory `uvicorn` is
launched from. Since the README says to run `uvicorn` from `apps/api` but
put `.env` at the repo root, the root `.env` was never actually being
read in the documented workflow (this predates today — would have
affected `database_url` too). Fixed by resolving the path from
`config.py`'s own location instead of cwd.

**Verified with a real PDF**, not just a synthetic one: user supplied a
real UOC "Dret Constitucional" PAC (Catalan legal assignment, non-ADE,
outside the 5 pilot subjects) as a stress test. Extraction correctly
separated the Moodle test from the two theory/practice exercises, kept
the 30/70 rubric weighting plus five non-numeric grading criteria
(`weight: null`), and `checklist`/`risks` surfaced real gotchas from the
text (e.g. this PAC explicitly forbids PDF submission, penalizes wrong
test answers by 1/3 point, and treats uncited sources as plagiarism → D
grade) rather than generic advice. Confirms the schema and prompt
generalize beyond the 5 pilot subjects and beyond Spanish (Catalan
source).

**Also fixed**: a missing `ANTHROPIC_API_KEY` used to raise a raw SDK
`TypeError` as an unhandled 500. `main.py` now checks
`settings.anthropic_api_key` upfront and returns a clean
"LLM provider misconfigured" 500 instead.

**Deferred on purpose**: the frontend (`UploadDropzone.tsx`'s `handleAnalyze`
is still inert — no `fetch` call to `/analyze` yet), persisting analyses to
Postgres, and de-duping repeat uploads via `source_text_hash` (the field
is populated correctly now, but nothing reads it yet).

**Next up**: wire `UploadDropzone.tsx` to actually call `/analyze` and
render a real result, so there's an end-to-end demo in the browser.
