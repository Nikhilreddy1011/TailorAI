# Groq API utility (call, parse, retry)

import asyncio
import json

from groq import AsyncGroq

from app.config import settings

_client = AsyncGroq(api_key=settings.GROQ_API_KEY)

MODEL_NAME = "llama-3.3-70b-versatile"
DEFAULT_MAX_CONTEXT_TOKENS = 128_000

_token_usage = {
    "prompt_tokens": 0,
    "completion_tokens": 0,
    "total_tokens": 0,
    "remaining_tokens": DEFAULT_MAX_CONTEXT_TOKENS,
}


class LLMCallError(Exception):
    """Raised when an LLM call fails to produce valid JSON after retrying."""


def build_token_usage(
    prompt_tokens: int = 0,
    completion_tokens: int = 0,
    total_tokens: int | None = None,
    max_context_tokens: int = DEFAULT_MAX_CONTEXT_TOKENS,
) -> dict[str, int]:
    """Build a normalized token usage payload for the session model."""
    if total_tokens is None:
        total_tokens = prompt_tokens + completion_tokens

    return {
        "prompt_tokens": prompt_tokens,
        "completion_tokens": completion_tokens,
        "total_tokens": total_tokens,
        "remaining_tokens": max(max_context_tokens - total_tokens, 0),
    }


def reset_token_usage() -> None:
    """Reset the in-memory token usage counter for a new analysis run."""
    global _token_usage
    _token_usage = build_token_usage()


def get_current_token_usage() -> dict[str, int]:
    """Return the current aggregate token usage for this analysis run."""
    return _token_usage.copy()


def _merge_token_usage(prompt_tokens: int, completion_tokens: int) -> None:
    global _token_usage
    _token_usage["prompt_tokens"] += prompt_tokens
    _token_usage["completion_tokens"] += completion_tokens
    _token_usage["total_tokens"] = _token_usage["prompt_tokens"] + _token_usage["completion_tokens"]
    _token_usage["remaining_tokens"] = max(
        DEFAULT_MAX_CONTEXT_TOKENS - _token_usage["total_tokens"],
        0,
    )


async def call_llm_json(prompt: str) -> dict:
    """Call the LLM with a prompt that must return JSON, parse the response, retry once on failure.

    Raises LLMCallError if both the initial call and the single retry fail
    (API error or unparseable JSON), so callers can fail the session step
    with a clear message.
    """
    last_error: Exception | None = None
    for attempt in range(2):
        try:
            response = await _client.chat.completions.create(
                model=MODEL_NAME,
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"},
            )
            usage = getattr(response, "usage", None)
            if isinstance(usage, dict):
                prompt_tokens = int(usage.get("prompt_tokens", 0) or 0)
                completion_tokens = int(usage.get("completion_tokens", 0) or 0)
            else:
                prompt_tokens = int(getattr(usage, "prompt_tokens", 0) or 0)
                completion_tokens = int(getattr(usage, "completion_tokens", 0) or 0)

            _merge_token_usage(prompt_tokens, completion_tokens)
            return json.loads(response.choices[0].message.content)
        except Exception as exc:  # noqa: BLE001
            last_error = exc
            if attempt == 0:
                await asyncio.sleep(1)
                continue

    raise LLMCallError(f"LLM call failed after retry: {last_error}") from last_error
