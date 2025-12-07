from app.extensions import db
from datetime import datetime

class Score(db.Model):
    __tablename__ = 'scores'

    id = db.Column(db.Integer, primary_key=True)
    answer_id = db.Column(db.Integer, db.ForeignKey('answers.id'), nullable=False)
    
    # Komponen Penilaian (0-100)
    relevance_score = db.Column(db.Float, default=0) # Seberapa nyambung?
    clarity_score = db.Column(db.Float, default=0)   # Seberapa jelas/panjang?
    
    # Nilai Total
    total_score = db.Column(db.Float, default=0)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_json(self):
        return {
            'relevance': self.relevance_score,
            'clarity': self.clarity_score,
            'total': self.total_score
        }