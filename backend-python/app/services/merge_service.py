"""
Merge service: combines 2+ PDFs into one output PDF.

We open each input with PyMuPDF, copy every page into a new output doc,
and save to disk. Order of input files is preserved (Node passes them
ordered per the user request).
"""
from pathlib import Path
import fitz  # PyMuPDF

from app.core.exceptions import FileProcessingError


def merge_pdfs(input_paths: list[Path], output_path: Path) -> Path:
    """
    input_paths: ordered list of PDF paths to merge.
    output_path: where the merged PDF gets written.

    Returns the output_path on success.
    Raises FileProcessingError on any failure.
    """
    if len(input_paths) < 2:
        # The Node side should prevent this, but defense in depth.
        raise FileProcessingError("Merge requires at least 2 input files")

    out_doc = None
    try:
        out_doc = fitz.open()
        for src in input_paths:
            with fitz.open(src) as src_doc:
                out_doc.insert_pdf(src_doc)  # append all pages

        # deflate=True keeps the file small without losing quality.
        out_doc.save(output_path, deflate=True, garbage=4)
        out_doc.close()
        return output_path

    except fitz.FileDataError as e:
        raise FileProcessingError(f"Corrupt or non-PDF input: {e}") from e
    except Exception as e:
        raise FileProcessingError(f"Merge failed: {e}") from e
    finally:
        # `out_doc` is closed above on the happy path; close again if open.
        if out_doc is not None:
            try:
                out_doc.close()
            except Exception:
                pass