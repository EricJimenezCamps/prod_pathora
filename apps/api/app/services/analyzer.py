import base64

import anthropic

from app.core.config import settings
from app.schemas.pac import PACExtraction

_MODEL = "claude-opus-5"

_SYSTEM_PROMPT = """\
Eres un asistente académico que analiza enunciados de PAC/PEC (evaluaciones \
continuas) de universidades españolas, principalmente la UOC.

Dado el PDF de un enunciado, extrae su estructura en el idioma del propio \
documento (normalmente español):

- Cada ejercicio como una entrada independiente, con su enunciado literal, \
  temas que cubre, dificultad estimada y requisitos específicos.
- Los entregables (formato, qué documentos hay que subir).
- La rúbrica de evaluación si el enunciado la incluye.
- Los requisitos generales de entrega (formato, plazos, normas).
- Un checklist de pasos previos recomendados antes de empezar a resolver \
  (qué repasar, qué tener a mano).
- Una lista de riesgos o errores frecuentes específicos de este enunciado \
  (no genéricos).

No inventes datos que no estén en el documento. Si un campo no aplica \
(por ejemplo, no hay rúbrica), devuelve una lista vacía en vez de inventar \
contenido.
"""


def extract_pac(pdf_bytes: bytes) -> PACExtraction:
    client = anthropic.Anthropic(api_key=settings.anthropic_api_key)

    response = client.messages.parse(
        model=_MODEL,
        max_tokens=16000,
        system=_SYSTEM_PROMPT,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "document",
                        "source": {
                            "type": "base64",
                            "media_type": "application/pdf",
                            "data": base64.standard_b64encode(pdf_bytes).decode(
                                "utf-8"
                            ),
                        },
                    },
                    {
                        "type": "text",
                        "text": "Analiza este enunciado de PAC/PEC.",
                    },
                ],
            }
        ],
        output_format=PACExtraction,
    )

    return response.parsed_output
