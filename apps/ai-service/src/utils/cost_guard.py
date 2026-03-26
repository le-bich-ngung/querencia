"""
Cost guard — tránh bill shock khi LLM API cost vượt ngưỡng
Đếm estimated cost theo usage, alert khi gần budget cap
"""
import logging
from src.core.config import settings

logger = logging.getLogger(__name__)

# Anthropic pricing (claude-sonnet) — cập nhật khi Anthropic thay đổi
COST_PER_1K_INPUT = 0.003   # USD
COST_PER_1K_OUTPUT = 0.015  # USD

def estimate_cost(input_tokens: int, output_tokens: int) -> float:
    return (input_tokens / 1000 * COST_PER_1K_INPUT +
            output_tokens / 1000 * COST_PER_1K_OUTPUT)

async def check_budget(daily_cost_so_far: float, request_cost: float) -> bool:
    """Returns True nếu còn budget, False nếu đã vượt cap"""
    total = daily_cost_so_far + request_cost
    cap = settings.AI_BUDGET_CAP_USD_DAILY

    if total > cap * 0.8:
        logger.warning(f"⚠️ AI cost at {total:.2f}/{cap:.2f} USD (80% threshold)")

    if total > cap:
        logger.error(f"🚨 AI budget cap exceeded: {total:.2f} > {cap:.2f} USD")
        return False

    return True
