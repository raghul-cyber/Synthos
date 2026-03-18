from datetime import datetime
import uuid


def generate_uuid() -> str:
    return str(uuid.uuid4())


def format_salary(amount: int) -> str:
    return f"${amount:,}"


def format_percentage(value: float) -> str:
    sign = "+" if value > 0 else ""
    return f"{sign}{value:.1f}%"


def utc_now() -> datetime:
    return datetime.utcnow()
