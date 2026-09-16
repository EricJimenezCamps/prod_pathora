from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

_REPO_ROOT_ENV = Path(__file__).resolve().parents[4] / ".env"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=_REPO_ROOT_ENV, extra="ignore")

    database_url: str = "postgresql://pathora:pathora@localhost:5432/pathora"
    cors_origins: list[str] = ["http://localhost:3000"]
    anthropic_api_key: str = ""


settings = Settings()
