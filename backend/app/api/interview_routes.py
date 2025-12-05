from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.job_role import JobRole
from app.models.interview_session import InterviewSession
from app.models.resume import Resume

interview_bp = Blueprint('interview', __name__)

# --- 1. AMBIL DAFTAR PEKERJAAN (Untuk Menu Pilih Job) ---
@interview_bp.route('/jobs', methods=['GET'])
def get_job_roles():
    jobs = JobRole.query.all()
    # Ubah list object database menjadi list JSON
    output = [job.to_json() for job in jobs]
    return jsonify(output), 200

# --- 2. MULAI SESSION BARU (Tombol START) ---
@interview_bp.route('/start', methods=['POST'])
@jwt_required()
def start_interview_session():
    current_user_id = get_jwt_identity()
    data = request.get_json()

    # Validasi Input (Frontend wajib kirim role_id dan level)
    role_id = data.get('role_id')
    level = data.get('level') # 'Junior' atau 'Senior'

    if not role_id or not level:
        return jsonify({'message': 'Pilih Role dan Level terlebih dahulu!'}), 400

    # Cek apakah user sudah upload CV? (Opsional, tapi bagus untuk validasi)
    resume = Resume.query.filter_by(user_id=current_user_id).order_by(Resume.id.desc()).first()
    if not resume:
        return jsonify({'message': 'Harap upload CV sebelum memulai!'}), 400

    # Buat Sesi Baru di Database
    new_session = InterviewSession(
        user_id=current_user_id,
        role_id=role_id,
        level=level,
        status='In Progress'
    )
    
    db.session.add(new_session)
    db.session.commit()

    return jsonify({
        'message': 'Sesi dimulai!',
        'session_id': new_session.id,
        'role_id': role_id,
        'level': level
    }), 201