from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.resume import Resume
from app.services.file_service import save_and_extract_pdf, allowed_file

user_bp = Blueprint('user', __name__)

@user_bp.route('/upload-resume', methods=['POST'])
@jwt_required()  # <--- Wajib login!
def upload_resume():
    if 'file' not in request.files:
        return jsonify({'message': 'File tidak ditemukan'}), 400
    
    file = request.files['file']
    
    if file and allowed_file(file.filename):
        # Panggil service yang kita buat di Langkah 2
        file_path, extracted_text = save_and_extract_pdf(file)
        
        if not extracted_text:
            return jsonify({'message': 'Gagal membaca PDF'}), 500

        # Simpan ke Database
        current_user_id = get_jwt_identity()
        new_resume = Resume(
            user_id=current_user_id,
            file_name=file.filename,
            file_path=file_path,
            extracted_text=extracted_text,
            clean_text=extracted_text, # Nanti dibersihkan oleh NLP Preprocessing
            detected_skills={},        # Nanti diisi NLP NER
            top_keywords={}            # Nanti diisi NLP TF-IDF
        )
        
        db.session.add(new_resume)
        db.session.commit()

        return jsonify({'message': 'Upload berhasil!', 'id': new_resume.id}), 201
    
    return jsonify({'message': 'Format harus PDF'}), 400