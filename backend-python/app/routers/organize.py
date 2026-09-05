"""
Endpoints for organizing PDFs (merge, split).

Node calls these. We accept paths instead of raw file bytes so we can
avoid streaming the file through HTTP twice (Node already has it on disk).
"""
from pathlib import Path
import uuid

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.core.config import settings
from app.services import merge_service, split_service


router = APIRouter(prefix="/organize", tags=["organize"])


class MergeRequest(BaseModel):
    input_paths: list[str] = Field(..., min_length=2, description="Ordered list of absolute file paths to merge")


class SplitRequest(BaseModel):
    input_path: str
    pages: str = Field(..., description='e.g. "1-3,5"')


class JobResponse(BaseModel):
    output_path: str
    output_filename: str


def _validate_within_dir(path: Path, base: Path) -> None:
    """Make sure the supplied path lives inside our allowed dir. Cheap path traversal guard."""
    try:
        path.resolve().relative_to(base.resolve())
    except ValueError:
        raise HTTPException(status_code=400, detail="Path outside allowed directory")


@router.post("/merge", response_model=JobResponse)
def merge(req: MergeRequest):
    inputs = [Path(p) for p in req.input_paths]
    for p in inputs:
        if not p.exists():
            raise HTTPException(status_code=404, detail=f"Input not found: {p}")
        _validate_within_dir(p, settings.INPUT_DIR)
        if p.stat().st_size > settings.MAX_UPLOAD_BYTES:
            raise HTTPException(status_code=413, detail="Input file exceeds size limit")

    out_name = f"merge_{uuid.uuid4().hex}.pdf"
    out_path = settings.OUTPUT_DIR / out_name
    merge_service.merge_pdfs(inputs, out_path)
    return JobResponse(output_path=str(out_path), output_filename=out_name)


@router.post("/split", response_model=JobResponse)
def split(req: SplitRequest):
    inp = Path(req.input_path)
    if not inp.exists():
        raise HTTPException(status_code=404, detail=f"Input not found: {inp}")
    _validate_within_dir(inp, settings.INPUT_DIR)
    if inp.stat().st_size > settings.MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="Input file exceeds size limit")

    out_name = f"split_{uuid.uuid4().hex}.pdf"
    out_path = settings.OUTPUT_DIR / out_name
    split_service.split_pdf(inp, req.pages, out_path)
    return JobResponse(output_path=str(out_path), output_filename=out_name)