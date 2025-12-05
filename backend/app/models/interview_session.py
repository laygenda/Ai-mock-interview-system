from app.extensions import db
from datetime import datetime

class InterviewSession(db.Model):
    __tablename__ = 'interview_sessions'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    role_id = db.Column(db.Integer, db.ForeignKey('job_roles.id'), nullable=False)
    level = db.Column(db.String(20), nullable=False) # Junior / Senior

    status = db.Column(db.String(20), default='In Progress')
    started_at = db.Column(db.DateTime, default=datetime.utcnow)
    finished_at = db.Column(db.DateTime)

    overall_score = db.Column(db.Float, default=0)
    overall_feedback = db.Column(db.Text)

    # Relasi untuk memudahkan akses data
    job_role = db.relationship('JobRole', backref='sessions')

    def to_json(self):
        return {
            'id': self.id,
            'role': self.job_role.role_name,
            'level': self.level,
            'status': self.status,
            'started_at': self.started_at,
            'overall_score': self.overall_score
        }