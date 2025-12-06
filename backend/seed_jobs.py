from app import create_app, db
from app.models.job_role import JobRole

app = create_app()

def seed_jobs():
    with app.app_context():
        # Daftar Pekerjaan sesuai Proposal
        jobs = [
                    {"role_name": "Data Analyst", "description": "Menganalisis data untuk wawasan bisnis."},
                    {"role_name": "Data Scientist", "description": "Membangun model prediktif dan machine learning."},
                    {"role_name": "Data Engineer", "description": "Membangun pipeline dan infrastruktur data."},
                    {"role_name": "AI Engineer", "description": "Mengembangkan sistem kecerdasan buatan."},
                    {"role_name": "ML Engineer", "description": "Deploy dan optimasi model ML."},  # <--- GANTI INI
                    {"role_name": "Data Architect", "description": "Merancang arsitektur data enterprise."} # <--- TAMBAHAN (Ada di ENUM)
                ]

        print("Sedang mengisi data Job Roles...")
        for job_data in jobs:
            # Cek apakah sudah ada biar tidak duplikat
            exists = JobRole.query.filter_by(role_name=job_data["role_name"]).first()
            if not exists:
                new_job = JobRole(
                    role_name=job_data["role_name"],
                    description=job_data["description"]
                )
                db.session.add(new_job)
        
        db.session.commit()
        print("Sukses! Data Job Roles berhasil ditambahkan.")

if __name__ == "__main__":
    seed_jobs()