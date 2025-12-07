import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await axios.post('http://127.0.0.1:5000/api/auth/register', formData);
            
            alert("Registrasi Berhasil! Silakan Login.");
            navigate('/'); // Arahkan ke halaman Login
            
        } catch (err) {
            setError(err.response?.data?.message || 'Registrasi Gagal. Coba lagi.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
            <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
                <h2 className="text-3xl font-bold text-center text-white">Buat Akun Baru</h2>
                <p className="text-center text-gray-400">Mulai perjalanan karirmu sekarang</p>
                
                {error && <div className="p-3 text-sm text-red-500 bg-red-100 rounded text-center">{error}</div>}

                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Nama Lengkap</label>
                        <input 
                            name="name" type="text" required
                            className="w-full px-4 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-purple-500 outline-none"
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Email</label>
                        <input 
                            name="email" type="email" required
                            className="w-full px-4 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-purple-500 outline-none"
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Nomor HP</label>
                        <input 
                            name="phone" type="text" required
                            className="w-full px-4 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-purple-500 outline-none"
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Password</label>
                        <input 
                            name="password" type="password" required
                            className="w-full px-4 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-purple-500 outline-none"
                            onChange={handleChange}
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="w-full px-4 py-3 font-bold text-white bg-purple-600 rounded hover:bg-purple-700 transition duration-200"
                    >
                        Daftar Sekarang
                    </button>
                </form>
                <div className="text-center text-gray-400 text-sm">
                    Sudah punya akun? <span onClick={() => navigate('/')} className="text-purple-400 cursor-pointer hover:underline">Login di sini</span>
                </div>
            </div>
        </div>
    );
};

export default Register;