from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.interview_session import InterviewSession
from app.models.job_role import JobRole
# Import service pertanyaan yang baru kita buat
from app.services.question_service import generate_interview_questions

interview_bp = Blueprint('interview', __name__)

# --- 1. AMBIL DAFTAR JOB ---
@interview_bp.route('/jobs', methods=['GET'])
def get_job_roles():
    jobs = JobRole.query.all()
    output = [job.to_json() for job in jobs]
    return jsonify(output), 200

# --- 2. MULAI SESI & AMBIL PERTANYAAN ---
@interview_bp.route('/start', methods=['POST'])
@jwt_required()
def start_interview_session():
    current_user_id = int(get_jwt_identity())
    data = request.get_json()

    role_id = data.get('role_id')
    level = data.get('level') 

    if not role_id or not level:
        return jsonify({'message': 'Pilih Role dan Level!'}), 400

    # Ambil nama role untuk generator soal
    job = JobRole.query.get(role_id)
    if not job:
        return jsonify({'message': 'Role tidak ditemukan'}), 404

    # 1. Generate Soal sesuai Level
    questions_list = generate_interview_questions(job.role_name, level)

    # 2. Simpan Sesi ke Database
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
        'role_name': job.role_name,
        'level': level,
        'questions': questions_list # Kirim daftar soal ke Frontend
    }), 201

# --- 3. SUBMIT JAWABAN PER SOAL ---
@interview_bp.route('/submit-answer', methods=['POST'])
@jwt_required()
def submit_answer():
    # Nanti di sini kita simpan jawaban ke database (Tabel Answers)
    # Untuk tahap ini, kita cukup return sukses agar flow Frontend jalan dulu
    data = request.get_json()
    
    # Logika penyimpanan database akan kita tambahkan setelah tabel Answer siap
    print(f"Jawaban diterima untuk soal: {data.get('question')}")
    print(f"Jawaban user: {data.get('answer')}")
    
    return jsonify({'message': 'Jawaban tersimpan'}), 200