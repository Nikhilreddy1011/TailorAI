from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    MONGO_URI: str
    GROQ_API_KEY: str
    FRONTEND_URL: str | None = None


settings = Settings()
