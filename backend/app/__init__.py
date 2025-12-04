from flask import Flask
from config import Config
from app.extensions import db, migrate, jwt
# registrasi blueprint
from app.api.auth_routes import auth_bp
app.register_blueprint(auth_bp, url_prefix='/api/auth')

def create_app(config_class = Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize Flask extensions here
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # Register blueprints here
    @app.route('/')
    def index():
        return "Hello, AI Mock Interview! Semoga Sukses"
    return app