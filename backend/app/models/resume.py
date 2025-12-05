from app.extensions import db
from datetime import datetime
from sqlalchemy.dialects.postgresql import JSONB

class Resume(db.Model):
    __tablename__ = 'resumes'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    file_name = db.Column(db.String(255))
    file_path = db.Column(db.Text, nullable=False)
    
    # Kolom untuk hasil NLP (Sesuai database di pgAdmin)
    extracted_text = db.Column(db.Text)
    clean_text = db.Column(db.Text)
    detected_skills = db.Column(JSONB)
    top_keywords = db.Column(JSONB)
    
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_json(self):
        return {
            'id': self.id,
            'file_name': self.file_name,
            'uploaded_at': self.uploaded_at
        }