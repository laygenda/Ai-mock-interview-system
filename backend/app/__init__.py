from flask import Flask
from flask_cors import CORS  # <--- TAMBAHAN PENTING
from config import Config
from app.extensions import db, migrate, jwt

def create_app(config_class=Config):
    # 1. Inisialisasi Aplikasi Flask
    app = Flask(__name__)
    app.config.from_object(config_class)

    # 2. Aktifkan CORS (Agar Frontend bisa akses Backend)
    CORS(app) 

    # 3. Inisialisasi Plugin
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # kode detektif
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        # Ini akan mencetak alasan error di Terminal Backend
        print(f"!!! JWT ERROR (Invalid): {error} !!!")
        return {"message": "Token tidak valid", "error": error}, 422

    @jwt.unauthorized_loader
    def missing_token_callback(error):
        # Ini akan mencetak jika Header Authorization hilang/salah format
        print(f"!!! JWT ERROR (Missing/Format): {error} !!!")
        return {"message": "Token hilang atau format salah", "error": error}, 401
        
    # 4. Registrasi Blueprint (Routes)
    from app.api.auth_routes import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    
    from app.api.user_routes import user_bp
    app.register_blueprint(user_bp, url_prefix='/api/user')

    from app.api.interview_routes import interview_bp
    app.register_blueprint(interview_bp, url_prefix='/api/interview')
    
    from app.api.history_routes import history_bp
    app.register_blueprint(history_bp, url_prefix='/api/history')

    @app.route('/')
    def index():
        return "Halo! Server Backend AI Mock Interview Berjalan Sukses!"

    return app