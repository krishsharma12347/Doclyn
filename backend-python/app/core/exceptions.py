"""
Custom exception types + a global FastAPI handler so every error response
follows the same JSON shape that the Node backend expects.

Shape:
    { "success": false, "data": null, "message": "human-readable" }
"""
from fastapi import Request
from fastapi.responses import JSONResponse


class FileProcessingError(Exception):
    """Raised when a PDF op fails for any reason (corrupt file, IO error, etc)."""


class InvalidPageRangeError(Exception):
    """Raised when the user-supplied page range string is malformed or out of bounds."""


class InvalidCompressionLevelError(Exception):
    """Raised when `level` is not one of low/medium/high."""


async def global_exception_handler(request: Request, exc: Exception):
    """
    Single place that maps internal errors -> safe user-facing JSON.
    We intentionally do not leak internal details in `message`.
    """
    if isinstance(exc, (InvalidPageRangeError, InvalidCompressionLevelError)):
        return JSONResponse(
            status_code=400,
            content={"success": False, "data": None, "message": str(exc)},
        )

    if isinstance(exc, FileProcessingError):
        return JSONResponse(
            status_code=500,
            content={"success": False, "data": None, "message": "File processing failed, please try again"},
        )

    # Anything we didn't anticipate. Log it (uvicorn will print the traceback),
    # return generic message to the caller.
    return JSONResponse(
        status_code=500,
        content={"success": False, "data": None, "message": "Internal server error"},
    )