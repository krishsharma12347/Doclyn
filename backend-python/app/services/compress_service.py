"""
Compress service: re-saves a PDF with compression settings based on a level.

We do NOT do OCR or downsample images by default (that's a heavier op).
We mostly rely on PyMuPDF's garbage collection + deflate which already
shaves significant bytes. For 'high' we additionally downsample images.

This is intentionally simple — the goal is a working baseline, not a
state-of-the-art PDF optimizer.
"""
from pathlib import Path
import fitz

from app.core.exceptions import FileProcessingError, InvalidCompressionLevelError


# Map level -> (image quality 0-100, downsample target DPI). 0 means skip image work.
_LEVEL_CONFIG = {
    "low": {"image_q": 75, "dpi": 150},
    "medium": {"image_q": 60, "dpi": 120},
    "high": {"image_q": 40, "dpi": 96},
}


def _compress_images(doc: fitz.Document, quality: int, dpi: int) -> None:
    """
    Walk every page. For each image, re-render at lower DPI / JPEG quality.
    Mutates the doc in place.
    """
    zoom = dpi / 72.0  # PDF default is 72 DPI
    matrix = fitz.Matrix(zoom, zoom)

    for page in doc:
        images = page.get_images(full=True)
        for img_info in images:
            xref = img_info[0]
            try:
                # Extract the image, re-encode as JPEG with lower quality.
                base = doc.extract_image(xref)
                stream = base["image"]
                # Use Pixmap to re-render then re-insert.
                pix = fitz.Pixmap(stream)
                # If it's CMYK or has alpha, convert to RGB so JPEG works.
                if pix.n - pix.alpha >= 4 or pix.alpha:
                    pix = fitz.Pixmap(fitz.csRGB, pix)

                # Downsample by scaling the matrix.
                pix.shrink(2)  # halves each dim; cheap size cut

                new_stream = pix.tobytes("jpeg", jpg_quality=quality)
                doc.replace_image(xref, stream=new_stream)
                pix = None
            except Exception:
                # Some images (e.g. masks, JBIG2) can't be re-encoded safely.
                # Skip them rather than fail the whole job.
                continue


def compress_pdf(input_path: Path, level: str, output_path: Path) -> Path:
    if level not in _LEVEL_CONFIG:
        raise InvalidCompressionLevelError(
            f"Invalid compression level '{level}'. Allowed: low, medium, high"
        )

    cfg = _LEVEL_CONFIG[level]
    try:
        with fitz.open(input_path) as doc:
            # Always: garbage collect unreferenced objects + deflate streams.
            if level in ("medium", "high"):
                _compress_images(doc, cfg["image_q"], cfg["dpi"])
            doc.save(output_path, garbage=4, deflate=True, clean=True)
        return output_path

    except fitz.FileDataError as e:
        raise FileProcessingError(f"Corrupt or non-PDF input: {e}") from e
    except InvalidCompressionLevelError:
        raise
    except Exception as e:
        raise FileProcessingError(f"Compress failed: {e}") from e