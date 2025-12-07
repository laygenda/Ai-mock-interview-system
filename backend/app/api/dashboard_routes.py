from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.interview_session import InterviewSession
from app.models.answer import Answer
from app.models.score import Score
from sqlalchemy import func, desc

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_dashboard_stats():
    current_user_id = int(get_jwt_identity())
    
    # 1. Ambil Semua Sesi User
    sessions = InterviewSession.query.filter_by(user_id=current_user_id).order_by(InterviewSession.started_at.asc()).all()
    
    if not sessions:
        return jsonify({
            'has_data': False,
            'bar_data': [],
            'line_data': [],
            'radar_data': []
        }), 200

    # --- A. Data untuk Bar Chart (Progress Skor per Sesi) ---
    # Mengambil 5 sesi terakhir
    recent_sessions = sessions[-5:]
    bar_data = []
    for sess in recent_sessions:
        bar_data.append({
            'name': f"Sesi {sess.id}", # Bisa diganti tanggal
            'skor': round(sess.overall_score, 1),
            'role': sess.job_role.role_name
        })

    # --- B. Data untuk Line Chart (Keaktifan Latihan) ---
    # Menghitung jumlah latihan per hari (Logic sederhana)
    # Di real world, gunakan Group By Date di SQL. Ini simplifikasi Python.
    activity_map = {}
    for sess in sessions:
        date_str = sess.started_at.strftime('%d/%m')
        activity_map[date_str] = activity_map.get(date_str, 0) + 1
    
    line_data = [{'date': k, 'count': v} for k, v in activity_map.items()]

    # --- C. Data untuk Radar Chart (Analisis STAR & Skill) ---
    # Kita ambil rata-rata dari tabel Score yang terhubung ke Answer milik User ini
    scores = db.session.query(
        func.avg(Score.relevance_score).label('avg_relevance'),
        func.avg(Score.clarity_score).label('avg_clarity'),
        func.avg(Score.total_score).label('avg_total')
    ).join(Answer).join(InterviewSession).filter(InterviewSession.user_id == current_user_id).first()

    # Mapping ke Aspek STAR (Simulasi berdasarkan data yang kita punya)
    # Karena kolom STAR spesifik belum ada, kita map dari Relevance & Clarity
    avg_relevance = round(scores.avg_relevance or 0, 1)
    avg_clarity = round(scores.avg_clarity or 0, 1)
    avg_total = round(scores.avg_total or 0, 1)

    radar_data = [
        {'subject': 'Situation', 'A': avg_relevance, 'fullMark': 100}, # Konteks (Relevansi)
        {'subject': 'Task', 'A': avg_relevance, 'fullMark': 100},      # Pemahaman Tugas
        {'subject': 'Action', 'A': avg_clarity, 'fullMark': 100},      # Kejelasan Aksi
        {'subject': 'Result', 'A': avg_total, 'fullMark': 100},        # Hasil Akhir
        {'subject': 'Komunikasi', 'A': avg_clarity, 'fullMark': 100},
        {'subject': 'Teknis', 'A': avg_relevance, 'fullMark': 100},
    ]

    return jsonify({
        'has_data': True,
        'bar_data': bar_data,
        'line_data': line_data,
        'radar_data': radar_data,
        'total_sessions': len(sessions),
        'last_score': round(sessions[-1].overall_score, 1)
    }), 200

# Helper import db (karena tidak di define di atas untuk menghindari circular import jika ada)
from app.extensions import db