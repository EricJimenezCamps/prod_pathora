# Pathora

Producto EdTech self-service: el estudiante sube una PAC/PEC, recibe un
análisis gratuito de requisitos y temas, y puede comprar una guía de
resolución paso a paso o una revisión de su borrador. Contexto de producto
completo en `scratch/` (`pathora_concepto_producto.docx`,
`pathora_estrategia_distribucion.docx`, `PROGRESS.md`).

## Estructura

- `apps/web` — Next.js (TypeScript, App Router, Tailwind). Deploy: Vercel.
- `apps/api` — FastAPI. Host de despliegue todavía por decidir.

## Desarrollo local

### Base de datos

Solo para desarrollo local — en producción se usará Vercel Postgres, así
que `docker-compose.yml` deja de ser necesario una vez desplegado.

```
docker compose up -d
```

### Frontend

```
cd apps/web
npm install
npm run dev
```

Abre `http://localhost:3000`.

### Backend

```
cd apps/api
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Comprueba `http://localhost:8000/health`.

Copia `.env.example` a `.env` (raíz) y `apps/web/.env.local.example` a
`apps/web/.env.local` antes de arrancar.
