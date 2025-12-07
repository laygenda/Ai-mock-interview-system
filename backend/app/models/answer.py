from app.extensions import db
from datetime import datetime

class Answer(db.Model):
    __tablename__ = 'answers'

    id = db.Column(db.Integer, primary_key=True)
    # Kita relasikan ke Session ID
    session_id = db.Column(db.Integer, db.ForeignKey('interview_sessions.id'), nullable=False)
    
    question_text = db.Column(db.Text, nullable=False)
    user_answer_text = db.Column(db.Text, nullable=False)
    
    # Relasi ke Score
    score = db.relationship('Score', backref='answer', uselist=False, cascade="all, delete-orphan")
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_json(self):
        return {
            'id': self.id,
            'question': self.question_text,
            'answer': self.user_answer_text,
            'score': self.score.to_json() if self.score else None
        }