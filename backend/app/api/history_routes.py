from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.interview_session import InterviewSession
from app.models.job_role import JobRole
from sqlalchemy import desc

history_bp = Blueprint('history', __name__)

@history_bp.route('/', methods=['GET'])
@jwt_required()
def get_user_history():
    current_user_id = int(get_jwt_identity())
    
    # Ambil sesi milik user, urutkan dari yang terbaru
    sessions = InterviewSession.query.filter_by(user_id=current_user_id)\
        .order_by(desc(InterviewSession.started_at)).all()
        
    history_data = []
    for sess in sessions:
        # Hitung durasi (opsional, kalau finished_at ada)
        duration = "N/A"
        if sess.finished_at:
            delta = sess.finished_at - sess.started_at
            duration = f"{delta.seconds // 60} menit"

        history_data.append({
            'id': sess.id,
            'role': sess.job_role.role_name,
            'level': sess.level,
            'date': sess.started_at.strftime('%d %b %Y, %H:%M'),
            'score': round(sess.overall_score, 1),
            'status': sess.status
        })
        
    return jsonify(history_data), 200