from flask import Flask
from config import Config
from app.extensions import db, migrate, jwt

def create_app(config_class=Config):
    # 1. Inisialisasi Aplikasi Flask
    app = Flask(__name__)
    app.config.from_object(config_class)

    # 2. Inisialisasi Plugin (Database, Migrasi, JWT)
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # 3. Registrasi Blueprint (Routes)
    # Import di dalam fungsi untuk menghindari circular import
    from app.api.auth_routes import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    from app.api.user_routes import user_bp
    app.register_blueprint(user_bp, url_prefix='/api/user')
    from app.api.interview_routes import interview_bp
    app.register_blueprint(interview_bp, url_prefix='/api/interview')

    # 4. Route Sederhana untuk Cek Server
    @app.route('/')
    def index():
        return "Halo! Server Backend AI Mock Interview Berjalan Sukses!"

    return app