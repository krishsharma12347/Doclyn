import os
import logging
from pdf2image import convert_from_path
from PIL import Image
import fitz  # PyMuPDF
from app.core.config import settings

logger = logging.getLogger(__name__)

class ImageConvertService:
    def jpg_to_pdf(self, input_paths, output_path):
        """Convert JPG images to PDF"""
        try:
            images = []
            for input_path in input_paths:
                if not os.path.exists(input_path):
                    raise FileNotFoundError(f"Image file not found: {input_path}")
                img = Image.open(input_path)
                # Convert to RGB if necessary (PDF doesn't support RGBA)
                if img.mode == 'RGBA':
                    img = img.convert('RGB')
                images.append(img)
            
            if not images:
                raise ValueError("No valid images provided")
            
            # Save all images as PDF
            images[0].save(
                output_path,
                save_all=True,
                append_images=images[1:],
                resolution=100.0
            )
            
        except Exception as e:
            logger.error(f"JPG to PDF conversion failed: {str(e)}")
            raise Exception(f"Conversion failed: {str(e)}")
    
    def pdf_to_jpg(self, input_path, output_path):
        """Convert first page of PDF to JPG"""
        try:
            if not os.path.exists(input_path):
                raise FileNotFoundError(f"PDF file not found: {input_path}")
            
            # Convert first page to image
            images = convert_from_path(
                input_path,
                first_page=1,
                last_page=1,
                dpi=settings.PDF_TO_IMAGE_DPI or 200,
                fmt='jpeg',
                output_folder=os.path.dirname(output_path),
                output_file=os.path.splitext(os.path.basename(output_path))[0]
            )
            
            if not images:
                raise Exception("Failed to convert PDF to image")
            
            # The convert_from_path function saves the file directly
            # We need to find the generated file
            generated_file = os.path.join(
                os.path.dirname(output_path),
                f"{os.path.splitext(os.path.basename(output_path))[0]}.jpg"
            )
            
            if os.path.exists(generated_file) and generated_file != output_path:
                os.rename(generated_file, output_path)
            elif not os.path.exists(output_path):
                # If the file wasn't renamed, check if it exists with expected name
                if os.path.exists(output_path):
                    pass  # Already in correct location
                else:
                    raise Exception("Output file was not generated")
                    
        except Exception as e:
            logger.error(f"PDF to JPG conversion failed: {str(e)}")
            raise Exception(f"Conversion failed: {str(e)}")