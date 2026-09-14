# Pathora — guía para Claude Code

Producto EdTech self-service (ver `README.md`). Contexto de producto completo
en `scratch/`.

## Estructura

- `apps/web` — Next.js (TypeScript, App Router, Tailwind). Deploy: Vercel.
- `apps/api` — FastAPI. Host todavía por decidir.

## Estilo de código

- Minimalismo ante todo: antes de añadir código nuevo, comprobar si ya existe
  en el repo, si lo resuelve la librería estándar (Next.js, FastAPI, etc.) o
  si se puede hacer en pocas líneas sin crear una abstracción nueva.
- No crear helpers, wrappers o capas de abstracción para un único uso.
- No añadir manejo de errores, validaciones o fallbacks para casos que no
  pueden ocurrir en este proyecto.
- No generar documentación (`*.md`) ni comentarios explicativos salvo que se
  pida explícitamente.
