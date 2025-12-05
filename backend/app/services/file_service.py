import os
import fitz
import uuid
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = 'storage/uploads'
ALLOWED_EXTENSIONS = {'pdf'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_and_extract_pdf(file):
    # 1. Pastikan folder ada
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)

    # 2. Buat nama file unik
    filename = secure_filename(file.filename)
    unique_filename = f"{uuid.uuid4().hex}_{filename}"
    file_path = os.path.join(UPLOAD_FOLDER, unique_filename)

    # 3. Simpan file
    file.save(file_path)

    # 4. Ekstrak Teks pakai PyMuPDF
    text_content = ""
    try:
        with fitz.open(file_path) as doc:
            for page in doc:
                text_content += page.get_text()
    except Exception as e:
        print(f"Error PDF: {e}")
        return None, None

    return file_path, text_content