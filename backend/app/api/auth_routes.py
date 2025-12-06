from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.user import User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

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
    current_user_id = get_jwt_identity()
    user = User.query.get(int(current_user_id)) # Convert balik ke int
    return jsonify(user.to_json()), 200