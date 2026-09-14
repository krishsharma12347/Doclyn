from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
import os
import uuid
from app.core.config import settings
from app.services.office_convert_service import OfficeConvertService
from app.services.image_convert_service import ImageConvertService
from app.services.pdfa_convert_service import PDFAConvertService
from app.utils.database import get_db
from app.utils.storage import StorageManager
from app.models.file import File as FileModel

router = APIRouter(prefix="/convert", tags=["convert"])

# Initialize services
office_service = OfficeConvertService()
image_service = ImageConvertService()
pdfa_service = PDFAConvertService()
storage = StorageManager()

@router.post("/word-to-pdf")
async def word_to_pdf(
    file_id: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Convert Word document to PDF"""
    # Verify file exists and belongs to user (auth handled elsewhere)
    file_record = db.query(FileModel).filter(FileModel.id == file_id).first()
    if not file_record:
        raise HTTPException(status_code=404, detail="File not found")
    
    # Generate output filename
    output_filename = f"{uuid.uuid4()}.pdf"
    output_path = os.path.join(settings.OUTPUT_DIR, output_filename)
    
    # Schedule conversion in background
    background_tasks.add_task(
        office_service.word_to_pdf,
        file_record.path,
        output_path
    )
    
    # Create output file record
    output_file = FileModel(
        id=str(uuid.uuid4()),
        user_id=file_record.user_id,
        original_name=os.path.splitext(file_record.original_name)[0] + ".pdf",
        stored_name=output_filename,
        path=output_path,
        size=0,  # Will be updated after conversion
        mime_type="application/pdf",
        is_output=True
    )
    db.add(output_file)
    db.commit()
    db.refresh(output_file)
    
    return {"file_id": output_file.id, "status": "processing"}

@router.post("/pdf-to-word")
async def pdf_to_word(
    file_id: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Convert PDF to Word document"""
    file_record = db.query(FileModel).filter(FileModel.id == file_id).first()
    if not file_record:
        raise HTTPException(status_code=404, detail="File not found")
    
    output_filename = f"{uuid.uuid4()}.docx"
    output_path = os.path.join(settings.OUTPUT_DIR, output_filename)
    
    background_tasks.add_task(
        office_service.pdf_to_word,
        file_record.path,
        output_path
    )
    
    output_file = FileModel(
        id=str(uuid.uuid4()),
        user_id=file_record.user_id,
        original_name=os.path.splitext(file_record.original_name)[0] + ".docx",
        stored_name=output_filename,
        path=output_path,
        size=0,
        mime_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        is_output=True
    )
    db.add(output_file)
    db.commit()
    db.refresh(output_file)
    
    return {"file_id": output_file.id, "status": "processing"}

@router.post("/ppt-to-pdf")
async def ppt_to_pdf(
    file_id: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Convert PowerPoint to PDF"""
    file_record = db.query(FileModel).filter(FileModel.id == file_id).first()
    if not file_record:
        raise HTTPException(status_code=404, detail="File not found")
    
    output_filename = f"{uuid.uuid4()}.pdf"
    output_path = os.path.join(settings.OUTPUT_DIR, output_filename)
    
    background_tasks.add_task(
        office_service.ppt_to_pdf,
        file_record.path,
        output_path
    )
    
    output_file = FileModel(
        id=str(uuid.uuid4()),
        user_id=file_record.user_id,
        original_name=os.path.splitext(file_record.original_name)[0] + ".pdf",
        stored_name=output_filename,
        path=output_path,
        size=0,
        mime_type="application/pdf",
        is_output=True
    )
    db.add(output_file)
    db.commit()
    db.refresh(output_file)
    
    return {"file_id": output_file.id, "status": "processing"}

@router.post("/pdf-to-ppt")
async def pdf_to_ppt(
    file_id: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Convert PDF to PowerPoint"""
    file_record = db.query(FileModel).filter(FileModel.id == file_id).first()
    if not file_record:
        raise HTTPException(status_code=404, detail="File not found")
    
    output_filename = f"{uuid.uuid4()}.pptx"
    output_path = os.path.join(settings.OUTPUT_DIR, output_filename)
    
    background_tasks.add_task(
        office_service.pdf_to_ppt,
        file_record.path,
        output_path
    )
    
    output_file = FileModel(
        id=str(uuid.uuid4()),
        user_id=file_record.user_id,
        original_name=os.path.splitext(file_record.original_name)[0] + ".pptx",
        stored_name=output_filename,
        path=output_path,
        size=0,
        mime_type="application/vnd.openxmlformats-officedocument.presentationml.presentation",
        is_output=True
    )
    db.add(output_file)
    db.commit()
    db.refresh(output_file)
    
    return {"file_id": output_file.id, "status": "processing"}

@router.post("/excel-to-pdf")
async def excel_to_pdf(
    file_id: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Convert Excel to PDF"""
    file_record = db.query(FileModel).filter(FileModel.id == file_id).first()
    if not file_record:
        raise HTTPException(status_code=404, detail="File not found")
    
    output_filename = f"{uuid.uuid4()}.pdf"
    output_path = os.path.join(settings.OUTPUT_DIR, output_filename)
    
    background_tasks.add_task(
        office_service.excel_to_pdf,
        file_record.path,
        output_path
    )
    
    output_file = FileModel(
        id=str(uuid.uuid4()),
        user_id=file_record.user_id,
        original_name=os.path.splitext(file_record.original_name)[0] + ".pdf",
        stored_name=output_filename,
        path=output_path,
        size=0,
        mime_type="application/pdf",
        is_output=True
    )
    db.add(output_file)
    db.commit()
    db.refresh(output_file)
    
    return {"file_id": output_file.id, "status": "processing"}

@router.post("/pdf-to-excel")
async def pdf_to_excel(
    file_id: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Convert PDF to Excel"""
    file_record = db.query(FileModel).filter(FileModel.id == file_id).first()
    if not file_record:
        raise HTTPException(status_code=404, detail="File not found")
    
    output_filename = f"{uuid.uuid4()}.xlsx"
    output_path = os.path.join(settings.OUTPUT_DIR, output_filename)
    
    background_tasks.add_task(
        office_service.pdf_to_excel,
        file_record.path,
        output_path
    )
    
    output_file = FileModel(
        id=str(uuid.uuid4()),
        user_id=file_record.user_id,
        original_name=os.path.splitext(file_record.original_name)[0] + ".xlsx",
        stored_name=output_filename,
        path=output_path,
        size=0,
        mime_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        is_output=True
    )
    db.add(output_file)
    db.commit()
    db.refresh(output_file)
    
    return {"file_id": output_file.id, "status": "processing"}

@router.post("/jpg-to-pdf")
async def jpg_to_pdf(
    file_ids: list[str],
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Convert JPG images to PDF"""
    if not file_ids or len(file_ids) == 0:
        raise HTTPException(status_code=400, detail="No files provided")
    
    # Verify all files exist
    files = db.query(FileModel).filter(FileModel.id.in_(file_ids)).all()
    if len(files) != len(file_ids):
        raise HTTPException(status_code=404, detail="One or more files not found")
    
    output_filename = f"{uuid.uuid4()}.pdf"
    output_path = os.path.join(settings.OUTPUT_DIR, output_filename)
    
    background_tasks.add_task(
        image_service.jpg_to_pdf,
        [f.path for f in files],
        output_path
    )
    
    output_file = FileModel(
        id=str(uuid.uuid4()),
        user_id=files[0].user_id,  # Assume all files belong to same user
        original_name="converted.pdf",
        stored_name=output_filename,
        path=output_path,
        size=0,
        mime_type="application/pdf",
        is_output=True
    )
    db.add(output_file)
    db.commit()
    db.refresh(output_file)
    
    return {"file_id": output_file.id, "status": "processing"}

@router.post("/pdf-to-jpg")
async def pdf_to_jpg(
    file_id: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Convert PDF to JPG (returns first page as JPG)"""
    file_record = db.query(FileModel).filter(FileModel.id == file_id).first()
    if not file_record:
        raise HTTPException(status_code=404, detail="File not found")
    
    output_filename = f"{uuid.uuid4()}.jpg"
    output_path = os.path.join(settings.OUTPUT_DIR, output_filename)
    
    background_tasks.add_task(
        image_service.pdf_to_jpg,
        file_record.path,
        output_path
    )
    
    output_file = FileModel(
        id=str(uuid.uuid4()),
        user_id=file_record.user_id,
        original_name=os.path.splitext(file_record.original_name)[0] + ".jpg",
        stored_name=output_filename,
        path=output_path,
        size=0,
        mime_type="image/jpeg",
        is_output=True
    )
    db.add(output_file)
    db.commit()
    db.refresh(output_file)
    
    return {"file_id": output_file.id, "status": "processing"}

@router.post("/html-to-pdf")
async def html_to_pdf(
    file_id: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Convert HTML file to PDF"""
    file_record = db.query(FileModel).filter(FileModel.id == file_id).first()
    if not file_record:
        raise HTTPException(status_code=404, detail="File not found")
    
    # Verify it's an HTML file
    if not file_record.original_name.endswith(('.html', '.htm')):
        raise HTTPException(status_code=400, detail="File is not an HTML document")
    
    output_filename = f"{uuid.uuid4()}.pdf"
    output_path = os.path.join(settings.OUTPUT_DIR, output_filename)
    
    background_tasks.add_task(
        office_service.html_to_pdf,
        file_record.path,
        output_path
    )
    
    output_file = FileModel(
        id=str(uuid.uuid4()),
        user_id=file_record.user_id,
        original_name=os.path.splitext(file_record.original_name)[0] + ".pdf",
        stored_name=output_filename,
        path=output_path,
        size=0,
        mime_type="application/pdf",
        is_output=True
    )
    db.add(output_file)
    db.commit()
    db.refresh(output_file)
    
    return {"file_id": output_file.id, "status": "processing"}

@router.post("/pdf-to-pdfa")
async def pdf_to_pdfa(
    file_id: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Convert PDF to PDF/A format"""
    file_record = db.query(FileModel).filter(FileModel.id == file_id).first()
    if not file_record:
        raise HTTPException(status_code=404, detail="File not found")
    
    output_filename = f"{uuid.uuid4()}_pdfa.pdf"
    output_path = os.path.join(settings.OUTPUT_DIR, output_filename)
    
    background_tasks.add_task(
        pdfa_service.convert_to_pdfa,
        file_record.path,
        output_path
    )
    
    output_file = FileModel(
        id=str(uuid.uuid4()),
        user_id=file_record.user_id,
        original_name=os.path.splitext(file_record.original_name)[0] + "_pdfa.pdf",
        stored_name=output_filename,
        path=output_path,
        size=0,
        mime_type="application/pdf",
        is_output=True
    )
    db.add(output_file)
    db.commit()
    db.refresh(output_file)
    
    return {"file_id": output_file.id, "status": "processing"}

@router.get("/download/{file_id}")
async def download_file(file_id: str, db: Session = Depends(get_db)):
    """Download converted file"""
    file_record = db.query(FileModel).filter(FileModel.id == file_id).first()
    if not file_record:
        raise HTTPException(status_code=404, detail="File not found")
    
    if not os.path.exists(file_record.path):
        raise HTTPException(status_code=404, detail="File not found on disk")
    
    return FileResponse(
        path=file_record.path,
        filename=file_record.original_name,
        media_type=file_record.mime_type
    )