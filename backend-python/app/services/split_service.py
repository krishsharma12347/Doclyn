"""
Split service: split a PDF by a page-range string like "1-3,5,8-10".

Page numbers in the API are 1-indexed and human-friendly.
PyMuPDF is 0-indexed, so we convert internally.
"""
import re
from pathlib import Path
import fitz

from app.core.exceptions import FileProcessingError, InvalidPageRangeError


_RANGE_RE = re.compile(r"^\s*(\d+)\s*(-\s*(\d+)\s*)?$")


def _parse_page_ranges(spec: str, total_pages: int) -> list[int]:
    """
    Parse "1-3,5" -> [0,1,2,4] (0-indexed).
    Validates ranges are within bounds and start <= end.
    """
    pages: list[int] = []
    if not spec or not spec.strip():
        raise InvalidPageRangeError("Page range cannot be empty")

    for chunk in spec.split(","):
        chunk = chunk.strip()
        if not chunk:
            raise InvalidPageRangeError(f"Empty range segment in '{spec}'")

        m = _RANGE_RE.match(chunk)
        if not m:
            raise InvalidPageRangeError(f"Invalid range segment '{chunk}'")

        start = int(m.group(1))
        end = int(m.group(3)) if m.group(3) else start

        if start < 1 or end < 1:
            raise InvalidPageRangeError("Page numbers must be >= 1")
        if end < start:
            raise InvalidPageRangeError(f"End < start in range '{chunk}'")
        if start > total_pages or end > total_pages:
            raise InvalidPageRangeError(
                f"Range '{chunk}' exceeds document length ({total_pages} pages)"
            )

        # convert to 0-indexed, inclusive
        pages.extend(range(start - 1, end))

    # de-dup while keeping order (in case user passes overlapping ranges)
    seen = set()
    deduped = []
    for p in pages:
        if p not in seen:
            seen.add(p)
            deduped.append(p)
    return deduped


def split_pdf(input_path: Path, page_spec: str, output_path: Path) -> Path:
    """
    Reads input_path, writes selected pages to output_path.
    Raises InvalidPageRangeError for bad input, FileProcessingError otherwise.
    """
    try:
        with fitz.open(input_path) as src:
            page_indices = _parse_page_ranges(page_spec, src.page_count)
            out_doc = fitz.open()
            for idx in page_indices:
                out_doc.insert_pdf(src, from_page=idx, to_page=idx)
            out_doc.save(output_path, deflate=True, garbage=4)
            out_doc.close()
        return output_path

    except fitz.FileDataError as e:
        raise FileProcessingError(f"Corrupt or non-PDF input: {e}") from e
    except InvalidPageRangeError:
        # Let it bubble — the global handler maps it to a 400.
        raise
    except Exception as e:
        raise FileProcessingError(f"Split failed: {e}") from e