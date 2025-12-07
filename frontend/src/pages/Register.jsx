import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://127.0.0.1:5000/api/auth/register', formData);
            alert("Registrasi Berhasil! Silakan Login.");
            navigate('/');
        } catch (err) { setError(err.response?.data?.message || 'Registrasi Gagal.'); }
    };

    return (
        <div className="flex items-center justify-center min-h-screen relative overflow-hidden p-4">
            {/* Background Ornaments */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neon-purple/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-neon-blue/20 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="glass-card w-full max-w-lg p-8 relative z-10 animate-fade-in-up border-t border-white/20">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white tracking-wide">
                        JOIN <span className="text-neon-green">THE FORCE</span>
                    </h2>
                    <p className="text-gray-400 text-sm">Buat akun untuk memulai simulasi.</p>
                </div>
                
                {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-200 text-sm rounded text-center">{error}</div>}

                <form onSubmit={handleRegister} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-neon-blue ml-1 mb-1 block">NAMA LENGKAP</label>
                            <input name="name" type="text" onChange={handleChange} className="input-field" placeholder="John Doe" required />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-neon-blue ml-1 mb-1 block">NOMOR HP</label>
                            <input name="phone" type="text" onChange={handleChange} className="input-field" placeholder="0812..." required />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-neon-blue ml-1 mb-1 block">EMAIL KAMPUS</label>
                        <input name="email" type="email" onChange={handleChange} className="input-field" placeholder="email@pens.ac.id" required />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-neon-blue ml-1 mb-1 block">PASSWORD</label>
                        <input name="password" type="password" onChange={handleChange} className="input-field" placeholder="••••••••" required />
                    </div>

                    <button type="submit" className="btn-primary mt-4">
                        INITIATE REGISTRATION
                    </button>
                </form>
                
                <div className="mt-6 text-center text-sm text-gray-500">
                    Sudah punya akses? <span onClick={() => navigate('/')} className="text-neon-purple cursor-pointer hover:text-white transition">Login System</span>
                </div>
            </div>
        </div>
    );
};

export default Register;