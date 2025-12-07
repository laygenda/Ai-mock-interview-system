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
            const response = await axios.post('http://127.0.0.1:5000/api/auth/login', {
                email: email, password: password
            });
            localStorage.setItem('token', response.data.access_token);
            navigate('/dashboard');
        } catch (err) {
            setError('Login Gagal. Periksa email/password.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen relative overflow-hidden">
            
            {/* Background Glow Effects (Hiasan) */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600/30 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-600/30 rounded-full blur-[100px]"></div>

            {/* Login Card */}
            <div className="glass-card w-full max-w-md p-10 relative z-10 animate-fade-in-up">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-purple to-neon-green mb-2">
                        AI Mock Interview
                    </h1>
                    <p className="text-gray-400">Welcome back, Future Talent!</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded bg-red-500/20 border border-red-500 text-red-200 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm text-neon-blue mb-2 font-semibold">EMAIL</label>
                        <input 
                            type="email" 
                            className="input-field"
                            placeholder="nama@mahasiswa.pens.ac.id"
                            value={email} onChange={(e) => setEmail(e.target.value)} required
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-neon-blue mb-2 font-semibold">PASSWORD</label>
                        <input 
                            type="password" 
                            className="input-field"
                            placeholder="••••••••"
                            value={password} onChange={(e) => setPassword(e.target.value)} required
                        />
                    </div>
                    <button type="submit" className="btn-primary">
                        LOGIN SYSTEM
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-500 text-sm">
                        Belum punya akun?{' '}
                        <span onClick={() => navigate('/register')} className="text-neon-green cursor-pointer hover:underline">
                            Daftar Akses
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;