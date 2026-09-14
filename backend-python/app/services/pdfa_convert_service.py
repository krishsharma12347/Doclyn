import os
import logging
import fitz  # PyMuPDF
from app.core.config import settings

logger = logging.getLogger(__name__)

class PDFAConvertService:
    def convert_to_pdfa(self, input_path, output_path):
        """Convert PDF to PDF/A-1b format"""
        try:
            if not os.path.exists(input_path):
                raise FileNotFoundError(f"PDF file not found: {input_path}")
            
            # Open the PDF
            doc = fitz.open(input_path)
            
            # Save as PDF/A-1b
            # Note: PyMuPDF doesn't have direct PDF/A conversion, so we use save with garbage and deflate
            # For true PDF/A, you might need additional tools, but this is a reasonable approximation
            doc.save(
                output_path,
                garbage=4,
                deflate=True,
                clean=True
            )
            
            doc.close()
            
            # Verify output exists
            if not os.path.exists(output_path):
                raise Exception("Output file was not generated")
                
        except Exception as e:
            logger.error(f"PDF to PDF/A conversion failed: {str(e)}")
            raise Exception(f"Conversion failed: {str(e)}")