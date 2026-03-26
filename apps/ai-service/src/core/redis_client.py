import redis.asyncio as aioredis
from src.core.config import settings

# DB2 — AI result cache (TTL 1h)
redis_db2 = aioredis.from_url(
    settings.REDIS_DB2_AI_CACHE_URL,
    db=2,
    decode_responses=True,
    max_connections=10,
)
