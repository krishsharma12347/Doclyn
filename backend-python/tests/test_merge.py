"""
Basic pytest tests for the merge service. We create real PDFs on disk
via PyMuPDF so we're exercising the full code path, not mocking it.
"""
from pathlib import Path
import fitz

from app.services.merge_service import merge_pdfs
from app.core.exceptions import FileProcessingError


def _make_pdf(path: Path, pages: int, text_prefix: str):
    """Helper: write a minimal valid PDF with N pages."""
    doc = fitz.open()
    for i in range(pages):
        page = doc.new_page()
        page.insert_text((72, 72), f"{text_prefix} page {i + 1}")
    doc.save(path)
    doc.close()


def test_merge_two_pdfs(tmp_path):
    a = tmp_path / "a.pdf"
    b = tmp_path / "b.pdf"
    out = tmp_path / "merged.pdf"

    _make_pdf(a, pages=2, text_prefix="A")
    _make_pdf(b, pages=3, text_prefix="B")

    result = merge_pdfs([a, b], out)

    assert result == out
    assert out.exists()

    with fitz.open(out) as merged:
        assert merged.page_count == 5


def test_merge_single_file_raises(tmp_path):
    a = tmp_path / "a.pdf"
    _make_pdf(a, pages=1, text_prefix="solo")
    out = tmp_path / "nope.pdf"

    try:
        merge_pdfs([a], out)
    except FileProcessingError:
        # expected
        pass
    else:
        raise AssertionError("Expected FileProcessingError for single-file merge")


def test_merge_corrupt_input_raises(tmp_path):
    bad = tmp_path / "bad.pdf"
    bad.write_bytes(b"this is definitely not a pdf")
    good = tmp_path / "good.pdf"
    _make_pdf(good, pages=1, text_prefix="ok")
    out = tmp_path / "out.pdf"

    try:
        merge_pdfs([bad, good], out)
    except FileProcessingError:
        # expected — corrupt input should raise, not silently produce a bad output
        pass
    else:
        raise AssertionError("Expected FileProcessingError for corrupt input")

    # Output file should not exist since the merge failed before saving.
    assert not out.exists()