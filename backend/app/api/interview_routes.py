from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.interview_session import InterviewSession
from app.models.job_role import JobRole
# Import service pertanyaan yang baru kita buat
from app.services.question_service import generate_interview_questions
from app.models.answer import Answer
from app.models.score import Score
from app.services.evaluation_service import calculate_score

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

# --- 3. SUBMIT JAWABAN PER SOAL (REAL IMPLEMENTATION) ---
@interview_bp.route('/submit-answer', methods=['POST'])
@jwt_required()
def submit_answer():
    data = request.get_json()
    
    session_id = data.get('session_id')
    question_text = data.get('question')
    answer_text = data.get('answer')

    if not session_id or not question_text or not answer_text:
        return jsonify({'message': 'Data tidak lengkap'}), 400

    # 1. Hitung Nilai menggunakan NLP Service
    scores = calculate_score(question_text, answer_text)

    # 2. Simpan Jawaban ke Database
    new_answer = Answer(
        session_id=session_id,
        question_text=question_text,
        user_answer_text=answer_text
    )
    db.session.add(new_answer)
    db.session.flush() # Agar kita dapat ID answer untuk tabel score

    # 3. Simpan Nilai ke Database
    new_score = Score(
        answer_id=new_answer.id,
        relevance_score=scores['relevance'],
        clarity_score=scores['clarity'],
        total_score=scores['total']
    )
    db.session.add(new_score)
    
    # 4. Update Skor Rata-rata Sesi (Opsional, agar dashboard real-time)
    session = InterviewSession.query.get(session_id)
    if session:
        # Hitung rata-rata baru (sederhana)
        current_total = session.overall_score or 0
        # Kita ambil rata-rata simpel (bisa dikembangkan nanti)
        session.overall_score = (current_total + scores['total']) / 2 
        
    db.session.commit()
    
    return jsonify({
        'message': 'Jawaban tersimpan',
        'scores': scores # Kirim balik nilai agar bisa ditampilkan di frontend jika mau
    }), 200
    
# --- 4. AMBIL HASIL SESI (RAPOR) ---
@interview_bp.route('/session/<session_id>', methods=['GET'])
@jwt_required()
def get_session_result(session_id):
    # 1. Cari Sesi
    session = InterviewSession.query.get(session_id)
    if not session:
        return jsonify({'message': 'Sesi tidak ditemukan'}), 404

    # 2. Ambil Semua Jawaban & Skor Detail
    answers = Answer.query.filter_by(session_id=session_id).all()
    
    details = []
    total_relevance = 0
    total_clarity = 0
    
    for ans in answers:
        score = ans.score
        details.append({
            'question': ans.question_text,
            'answer': ans.user_answer_text,
            'relevance': score.relevance_score if score else 0,
            'clarity': score.clarity_score if score else 0,
            'total': score.total_score if score else 0
        })
        
        if score:
            total_relevance += score.relevance_score
            total_clarity += score.clarity_score

    # 3. Hitung Rata-rata
    count = len(answers)
    if count > 0:
        avg_relevance = round(total_relevance / count, 1)
        avg_clarity = round(total_clarity / count, 1)
        final_score = round(session.overall_score, 1)
    else:
        avg_relevance = 0
        avg_clarity = 0
        final_score = 0

    return jsonify({
        'role': session.job_role.role_name,
        'level': session.level,
        'final_score': final_score,
        'avg_relevance': avg_relevance,
        'avg_clarity': avg_clarity,
        'details': details
    }), 200