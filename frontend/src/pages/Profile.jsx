import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://127.0.0.1:5000/api/auth/profile', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                setProfile(response.data);
            } catch (error) {
                console.error("Gagal ambil profil:", error);
            }
        };
        fetchProfile();
    }, []);

    if (!profile) return <div className="text-white p-10 text-center">Memuat Profil...</div>;

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8 flex justify-center">
            <div className="w-full max-w-2xl">
                
                {/* Header & Tombol Kembali */}
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-purple-400">Profil Saya</h2>
                    <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-white">
                        ← Kembali ke Dashboard
                    </button>
                </div>

                {/* Kartu Data Diri */}
                <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-8 mb-6">
                    <div className="flex items-center gap-6 mb-6">
                        <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center text-3xl font-bold">
                            {profile.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold">{profile.name}</h3>
                            <p className="text-gray-400">Mahasiswa PENS</p>
                        </div>
                    </div>

                    <div className="space-y-4 border-t border-gray-700 pt-6">
                        <div>
                            <label className="text-xs text-gray-500 uppercase">Email</label>
                            <p className="text-lg">{profile.email}</p>
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 uppercase">Nomor HP</label>
                            <p className="text-lg">{profile.phone}</p>
                        </div>
                    </div>
                </div>

                {/* Kartu Status Resume */}
                <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-8">
                    <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">Status Resume (CV)</h3>
                    
                    {profile.resume ? (
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-green-400 font-bold">✅ Terupload</span>
                                <span className="text-sm text-gray-500">{profile.resume.uploaded_at}</span>
                            </div>
                            <p className="text-gray-300 mb-2">File: {profile.resume.file_name}</p>
                            
                            <label className="text-xs text-gray-500 uppercase block mb-2">Skill Terdeteksi (AI):</label>
                            <div className="flex flex-wrap gap-2">
                                {profile.resume.skills && profile.resume.skills.length > 0 ? (
                                    profile.resume.skills.map((skill, idx) => (
                                        <span key={idx} className="bg-purple-900 text-purple-200 px-3 py-1 rounded-full text-sm border border-purple-700">
                                            {skill}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-gray-500 italic">Belum ada skill spesifik terdeteksi.</span>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <p className="text-red-400 mb-4">Belum ada CV yang diupload.</p>
                            <button 
                                onClick={() => navigate('/dashboard')}
                                className="px-6 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition"
                            >
                                Upload Sekarang
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Profile;