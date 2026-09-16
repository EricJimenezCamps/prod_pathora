import hashlib
from uuid import uuid4

import anthropic
from fastapi import FastAPI, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.schemas.pac import PAC
from app.services.analyzer import extract_pac

app = FastAPI(title="Pathora API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/analyze", response_model=PAC)
async def analyze(file: UploadFile) -> PAC:
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Empty file")

    if not settings.anthropic_api_key:
        raise HTTPException(status_code=500, detail="LLM provider misconfigured")

    try:
        extraction = extract_pac(contents)
    except anthropic.AuthenticationError:
        raise HTTPException(status_code=500, detail="LLM provider misconfigured")
    except anthropic.RateLimitError:
        raise HTTPException(status_code=503, detail="LLM provider is busy, try again")
    except anthropic.APIStatusError:
        raise HTTPException(status_code=502, detail="LLM provider request failed")

    return PAC(
        id=uuid4(),
        source_text_hash=hashlib.sha256(contents).hexdigest(),
        university=extraction.university or "UOC",
        **extraction.model_dump(exclude={"university"}),
    )
