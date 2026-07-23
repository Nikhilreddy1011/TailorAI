from app.services.llm_client import build_token_usage, DEFAULT_MAX_CONTEXT_TOKENS


def test_build_token_usage_calculates_remaining_tokens() -> None:
    usage = build_token_usage(prompt_tokens=120, completion_tokens=30)

    assert usage["prompt_tokens"] == 120
    assert usage["completion_tokens"] == 30
    assert usage["total_tokens"] == 150
    assert usage["remaining_tokens"] == DEFAULT_MAX_CONTEXT_TOKENS - 150
