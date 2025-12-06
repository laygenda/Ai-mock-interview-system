from app.extensions import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash 

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.Text, nullable=False)
    phone = db.Column(db.String(30))
    avatar_url = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def set_password(self, password):
        """Mengubah password teks biasa menjadi hash terenkripsi"""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """Mengecek apakah password input cocok dengan hash di database"""
        return check_password_hash(self.password_hash, password)
    
    def to_json(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'avatar_url': self.avatar_url
        }