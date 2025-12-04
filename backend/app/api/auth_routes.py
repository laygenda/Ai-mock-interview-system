from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.user import User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta

# membuat blueprint (kelompok route) bernama 'auth'
auth_bp = Blueprint('auth', __name__)

# 1. Register Mahasiswa
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # validasi input
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Data tidak lengkap'}), 400
    
    # cek apakah email sudah terdaftar
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Email sudah terdaftar'}), 400
    
    # Buat user baru
    new_user = User (
        name = data.get('name'),
        email = data.get('email'),
        phone = data.get('phone'),
    )
    # enkripsi password
    new_user.set_password(data.get('password')) 
    # simpan ke database
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'Registrasi berhasil'}), 201

# 2. Login Mahasiswa
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    User = User.query.filter_by(email=data.get('email')).first()
    
    # Cek user ada dan password benar
    if User and User.check_password(data.get('password')):
        # Buat token akses berlaku default 15 menit bisa diubah
        create_access = create_access_token(identity=User.id, expires_delta=timedelta(minutes=15))
        return jsonify({
            'message': 'Login berhasil',
            'token': create_access,
            'user': User.to_json()
        }), 200
    
    return jsonify({'message': 'Email atau password salah'}), 401

# 3. Cek profil
@auth_bp.route('/profile', methods=['GET'])
@jwt_required() # hanya bisa diakses jika punya token
def get_current_user_profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    return jsonify(user.to_json()), 200
    