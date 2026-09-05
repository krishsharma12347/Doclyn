"""
Endpoints for optimizing PDFs (compress).
"""
from pathlib import Path
import uuid

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.core.config import settings
from app.services import compress_service


router = APIRouter(prefix="/optimize", tags=["optimize"])


class CompressRequest(BaseModel):
    input_path: str
    level: str = "medium"


class JobResponse(BaseModel):
    output_path: str
    output_filename: str


def _validate_within_dir(path: Path, base: Path) -> None:
    try:
        path.resolve().relative_to(base.resolve())
    except ValueError:
        raise HTTPException(status_code=400, detail="Path outside allowed directory")


@router.post("/compress", response_model=JobResponse)
def compress(req: CompressRequest):
    inp = Path(req.input_path)
    if not inp.exists():
        raise HTTPException(status_code=404, detail=f"Input not found: {inp}")
    _validate_within_dir(inp, settings.INPUT_DIR)
    if inp.stat().st_size > settings.MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="Input file exceeds size limit")

    out_name = f"compress_{uuid.uuid4().hex}.pdf"
    out_path = settings.OUTPUT_DIR / out_name
    compress_service.compress_pdf(inp, req.level, out_path)
    return JobResponse(output_path=str(out_path), output_filename=out_name)