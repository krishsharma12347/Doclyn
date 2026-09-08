"""
Centralized configuration. Reads from environment variables so we can
deploy without code changes. Sensible defaults for local development.
"""
import os
from pathlib import Path


class Settings:
    # Where the Node backend stashes uploaded files before this service touches them.
    # Node will write here, then call our endpoints with absolute paths.
    INPUT_DIR: Path = Path(os.getenv("PY_INPUT_DIR", "/tmp/doclyn/inputs"))

    # Where this service writes outputs. Node will read from here to ship the file back.
    OUTPUT_DIR: Path = Path(os.getenv("PY_OUTPUT_DIR", "/tmp/doclyn/outputs"))

    # Max upload size mirror (bytes). The Node side enforces 50MB, but we double-check.
    MAX_UPLOAD_BYTES: int = int(os.getenv("PY_MAX_UPLOAD_BYTES", str(50 * 1024 * 1024)))

    # Allowed compression levels.
    COMPRESS_LEVELS = ("low", "medium", "high")


settings = Settings()

# Make sure the dirs exist on import. Cheap to do once.
settings.INPUT_DIR.mkdir(parents=True, exist_ok=True)
settings.OUTPUT_DIR.mkdir(parents=True, exist_ok=True)