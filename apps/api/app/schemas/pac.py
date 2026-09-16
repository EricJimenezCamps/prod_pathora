from datetime import date
from enum import Enum
from uuid import UUID

from pydantic import BaseModel


class Difficulty(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"


class Exercise(BaseModel):
    id: str
    prompt: str
    topics: list[str]
    difficulty: Difficulty
    requirements: list[str]
    deliverable_format: str | None = None


class Deliverable(BaseModel):
    id: str
    description: str
    format: str | None = None


class RubricItem(BaseModel):
    id: str
    description: str
    weight: float | None = None
    exercise_ids: list[str] = []


class PAC(BaseModel):
    id: UUID
    subject: str
    university: str = "UOC"
    title: str
    deadline: date | None = None
    exercises: list[Exercise]
    deliverables: list[Deliverable]
    rubric: list[RubricItem] = []
    general_requirements: list[str]
    checklist: list[str]
    risks: list[str]
    source_text_hash: str


class PACExtraction(BaseModel):
    """What the LLM extracts from a PAC/PEC PDF.

    Excludes fields the model must not invent: `id` (generated server-side)
    and `source_text_hash` (the real SHA-256 of the uploaded bytes).
    """

    subject: str
    university: str | None = None
    title: str
    deadline: date | None = None
    exercises: list[Exercise]
    deliverables: list[Deliverable]
    rubric: list[RubricItem] = []
    general_requirements: list[str]
    checklist: list[str]
    risks: list[str]
