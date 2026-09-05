"""
Custom exception types + global FastAPI handlers so every error response
follows the same JSON shape that the Node backend expects.

Shape:
    { "success": false, "data": null, "message": "human-readable" }

Two handlers are registered (see main.py):
  1. http_exception_handler   -> catches fastapi.HTTPException (404/400/413 etc
                                  raised explicitly in routers)
  2. global_exception_handler -> catches everything else (unexpected errors,
                                  our custom FileProcessingError etc)
FastAPI registers its own default handler for HTTPException internally, so
we must override it explicitly, otherwise HTTPException responses come back
as {"detail": "..."} instead of our {"success": false, ...} shape.
"""
from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse


class FileProcessingError(Exception):
    """Raised when a PDF op fails for any reason (corrupt file, IO error, etc)."""


class InvalidPageRangeError(Exception):
    """Raised when the user-supplied page range string is malformed or out of bounds."""


class InvalidCompressionLevelError(Exception):
    """Raised when `level` is not one of low/medium/high."""


async def http_exception_handler(request: Request, exc: HTTPException):
    """
    Catches fastapi.HTTPException (raised via `raise HTTPException(status_code=..., detail=...)`
    in the routers, e.g. 404 file-not-found, 400 path-traversal, 413 too-large).

    We preserve the original status_code but wrap `detail` into our standard shape
    so the Node backend always sees the same envelope regardless of error source.
    """
    return JSONResponse(
        status_code=exc.status_code,
        content={"success": False, "data": None, "message": str(exc.detail)},
    )


async def global_exception_handler(request: Request, exc: Exception):
    """
    Catches everything that is NOT an HTTPException (see handler above).
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