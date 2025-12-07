from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.user import User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.models.resume import Resume

auth_bp = Blueprint('auth', __name__)

# 1. Register Mahasiswa
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Data tidak lengkap'}), 400
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Email sudah terdaftar'}), 400
    
    new_user = User (
        name = data.get('name'),
        email = data.get('email'),
        phone = data.get('phone'),
    )
    new_user.set_password(data.get('password')) 
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'Registrasi berhasil'}), 201

# 2. Login Mahasiswa
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    user = User.query.filter_by(email=data.get('email')).first()
    
    if user and user.check_password(data.get('password')):
        # PERBAIKAN DI SINI: Bungkus user.id dengan str()
        access_token = create_access_token(identity=str(user.id))
        
        return jsonify({
            'message': 'Login berhasil',
            'access_token': access_token,
            'user': user.to_json()
        }), 200
    
    return jsonify({'message': 'Email atau password salah'}), 401

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_current_user_profile():
    current_user_id = int(get_jwt_identity()) # Pastikan int
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({'message': 'User tidak ditemukan'}), 404

    # Ambil Resume Terakhir user ini
    resume = Resume.query.filter_by(user_id=current_user_id).order_by(Resume.id.desc()).first()
    
    user_data = user.to_json()
    
    # Tambahkan info resume ke data user
    if resume:
        user_data['resume'] = {
            'file_name': resume.file_name,
            'uploaded_at': resume.uploaded_at.strftime('%d %b %Y'),
            'skills': resume.detected_skills # Tampilkan skill hasil IndoBERT
        }
    else:
        user_data['resume'] = None

    return jsonify(user_data), 200