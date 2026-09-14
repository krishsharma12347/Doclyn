import subprocess
import os
import logging
from pathlib import Path
from app.core.config import settings

logger = logging.getLogger(__name__)

class OfficeConvertService:
    def __init__(self):
        # LibreOffice path - adjust if needed for your environment
        self.libreoffice_path = settings.LIBREOFFICE_PATH or "libreoffice"
    
    def _run_libreoffice(self, input_path, output_dir, filter_name=None):
        """Run LibreOffice in headless mode"""
        cmd = [
            self.libreoffice_path,
            "--headless",
            "--convert-to",
            filter_name if filter_name else "pdf:writer_pdf_Export",
            "--outdir",
            output_dir,
            input_path
        ]
        
        try:
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=settings.LIBREOFFICE_TIMEOUT or 120
            )
            
            if result.returncode != 0:
                logger.error(f"LibreOffice conversion failed: {result.stderr}")
                raise Exception(f"Conversion failed: {result.stderr}")
                
        except subprocess.TimeoutExpired:
            logger.error("LibreOffice conversion timed out")
            raise Exception("Conversion timed out")
        except Exception as e:
            logger.error(f"LibreOffice execution error: {str(e)}")
            raise Exception(f"Conversion error: {str(e)}")
    
    def word_to_pdf(self, input_path, output_path):
        """Convert Word document to PDF"""
        output_dir = os.path.dirname(output_path)
        os.makedirs(output_dir, exist_ok=True)
        
        self._run_libreoffice(input_path, output_dir, "pdf:writer_pdf_Export")
        
        # LibreOffice creates output with same name but .pdf extension
        input_name = os.path.splitext(os.path.basename(input_path))[0] + ".pdf"
        generated_path = os.path.join(output_dir, input_name)
        
        if os.path.exists(generated_path) and generated_path != output_path:
            os.rename(generated_path, output_path)
        elif not os.path.exists(output_path):
            raise Exception("Output file was not generated")
    
    def pdf_to_word(self, input_path, output_path):
        """Convert PDF to Word document"""
        output_dir = os.path.dirname(output_path)
        os.makedirs(output_dir, exist_ok=True)
        
        self._run_libreoffice(input_path, output_dir, "docx:Office Open XML Text")
        
        input_name = os.path.splitext(os.path.basename(input_path))[0] + ".docx"
        generated_path = os.path.join(output_dir, input_name)
        
        if os.path.exists(generated_path) and generated_path != output_path:
            os.rename(generated_path, output_path)
        elif not os.path.exists(output_path):
            raise Exception("Output file was not generated")
    
    def ppt_to_pdf(self, input_path, output_path):
        """Convert PowerPoint to PDF"""
        output_dir = os.path.dirname(output_path)
        os.makedirs(output_dir, exist_ok=True)
        
        self._run_libreoffice(input_path, output_dir, "pdf:impress_pdf_Export")
        
        input_name = os.path.splitext(os.path.basename(input_path))[0] + ".pdf"
        generated_path = os.path.join(output_dir, input_name)
        
        if os.path.exists(generated_path) and generated_path != output_path:
            os.rename(generated_path, output_path)
        elif not os.path.exists(output_path):
            raise Exception("Output file was not generated")
    
    def pdf_to_ppt(self, input_path, output_path):
        """Convert PDF to PowerPoint"""
        output_dir = os.path.dirname(output_path)
        os.makedirs(output_dir, exist_ok=True)
        
        self._run_libreoffice(input_path, output_dir, "pptx:impress_pdf_Export")
        
        input_name = os.path.splitext(os.path.basename(input_path))[0] + ".pptx"
        generated_path = os.path.join(output_dir, input_name)
        
        if os.path.exists(generated_path) and generated_path != output_path:
            os.rename(generated_path, output_path)
        elif not os.path.exists(output_path):
            raise Exception("Output file was not generated")
    
    def excel_to_pdf(self, input_path, output_path):
        """Convert Excel to PDF"""
        output_dir = os.path.dirname(output_path)
        os.makedirs(output_dir, exist_ok=True)
        
        self._run_libreoffice(input_path, output_dir, "pdf:calc_pdf_Export")
        
        input_name = os.path.splitext(os.path.basename(input_path))[0] + ".pdf"
        generated_path = os.path.join(output_dir, input_name)
        
        if os.path.exists(generated_path) and generated_path != output_path:
            os.rename(generated_path, output_path)
        elif not os.path.exists(output_path):
            raise Exception("Output file was not generated")
    
    def pdf_to_excel(self, input_path, output_path):
        """Convert PDF to Excel"""
        output_dir = os.path.dirname(output_path)
        os.makedirs(output_dir, exist_ok=True)
        
        self._run_libreoffice(input_path, output_dir, "xlsx:calc_pdf_Export")
        
        input_name = os.path.splitext(os.path.basename(input_path))[0] + ".xlsx"
        generated_path = os.path.join(output_dir, input_name)
        
        if os.path.exists(generated_path) and generated_path != output_path:
            os.rename(generated_path, output_path)
        elif not os.path.exists(output_path):
            raise Exception("Output file was not generated")
    
    def html_to_pdf(self, input_path, output_path):
        """Convert HTML to PDF"""
        output_dir = os.path.dirname(output_path)
        os.makedirs(output_dir, exist_ok=True)
        
        self._run_libreoffice(input_path, output_dir, "pdf:writer_pdf_Export")
        
        input_name = os.path.splitext(os.path.basename(input_path))[0] + ".pdf"
        generated_path = os.path.join(output_dir, input_name)
        
        if os.path.exists(generated_path) and generated_path != output_path:
            os.rename(generated_path, output_path)
        elif not os.path.exists(output_path):
            raise Exception("Output file was not generated")