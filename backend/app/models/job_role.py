from app.extensions import db

class JobRole(db.Model):
    __tablename__ = 'job_roles'

    id = db.Column(db.Integer, primary_key=True)
    # Kita pakai String saja agar mudah, meski di DB tipe-nya ENUM
    role_name = db.Column(db.String(50), unique=True, nullable=False)
    description = db.Column(db.Text)

    def to_json(self):
        return {
            'id': self.id,
            'role_name': self.role_name,
            'description': self.description
        }