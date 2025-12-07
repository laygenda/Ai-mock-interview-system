import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // Nembak API Backend Flask
            const response = await axios.post('http://127.0.0.1:5000/api/auth/login', {
                email: email,
                password: password
            });

            // Jika sukses, simpan Token JWT di LocalStorage browser
            localStorage.setItem('token', response.data.access_token);
            
            alert("Login Berhasil!");
            // Nanti kita arahkan ke Dashboard (sekarang ke home dulu)
            navigate('/dashboard'); 
            
        } catch (err) {
            setError(err.response?.data?.message || 'Login Gagal. Cek email/password.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-center text-white">AI Mock Interview</h2>
                <p className="text-center text-gray-400">Silakan login untuk memulai</p>
                
                {error && <div className="p-3 text-sm text-red-500 bg-red-100 rounded">{error}</div>}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Email</label>
                        <input 
                            type="email" 
                            className="w-full px-4 py-2 mt-2 text-white bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Password</label>
                        <input 
                            type="password" 
                            className="w-full px-4 py-2 mt-2 text-white bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="w-full px-4 py-2 font-bold text-white bg-purple-600 rounded hover:bg-purple-700 transition duration-200"
                    >
                        Masuk
                    </button>
                </form>
                    <div className="text-center text-gray-400">
                    Belum punya akun? <span 
                        onClick={() => navigate('/register')}  // <--- Tambahkan fungsi klik ini
                        className="text-purple-400 cursor-pointer hover:underline"
                    >
                        Daftar di sini
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Login;