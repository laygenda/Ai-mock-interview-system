from app.extensions import db
from datetime import datetime
import werkzeug.security as security

class User(db.Model):
    __tablename__ = 'users'
    # menyesuaikan dengan kolom di PostgreSQL yang telah dibuat
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        """mengubah password biasa menjadi terenskripsi"""
        self.password_hash = security.generate_password_hash(password)
    
    def cek_password(self, password):
        """memeriksa apakah password yang dimasukkan sesuai dengan yang ada di database"""
        return security.check_password_hash(self.password_hash, password)
    
    def to_json(self):
        """mengubah objek User menjadi format JSON"""
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone' : self.phone,
            'avatar_url' : self.avatar_url,
        }
