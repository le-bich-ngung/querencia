from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    ENV: str = "development"

    # AI APIs
    ANTHROPIC_API_KEY: str
    OPENAI_API_KEY: str = ""
    AI_BUDGET_CAP_USD_DAILY: float = 10.0

    # Redis DB2 (AI cache)
    REDIS_DB2_AI_CACHE_URL: str

    # Internal
    API_SERVICE_URL: str = "http://localhost:3001"
    AI_SERVICE_INTERNAL_KEY: str = ""

    # Database (cho pgvector)
    DATABASE_URL: str

    class Config:
        env_file = ".env"

settings = Settings()
