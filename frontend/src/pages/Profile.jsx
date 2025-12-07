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
                const response = await axios.get('http://127.0.0.1:5000/api/auth/profile', { headers: { 'Authorization': 'Bearer ' + token } });
                setProfile(response.data);
            } catch (error) { console.error(error); }
        };
        fetchProfile();
    }, []);

    if (!profile) return <div className="min-h-screen flex items-center justify-center text-gray-500">Retrieving Data...</div>;

    return (
        <div className="min-h-screen p-8 flex items-center justify-center">
            <div className="w-full max-w-2xl">
                <button onClick={() => navigate('/dashboard')} className="mb-6 text-gray-400 hover:text-white transition">← Dashboard</button>
                
                <div className="glass-card p-8 border-t-4 border-neon-blue relative overflow-hidden">
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-neon-blue/10 rounded-full blur-3xl"></div>
                    
                    <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                        <div className="w-32 h-32 rounded-full bg-dark-900 border-2 border-neon-blue flex items-center justify-center text-4xl font-bold text-white shadow-[0_0_20px_rgba(69,162,158,0.3)]">
                            {profile.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-center md:text-left flex-1">
                            <h2 className="text-3xl font-bold text-white mb-1">{profile.name}</h2>
                            <p className="text-neon-blue font-mono text-sm tracking-widest mb-4">MAHASISWA PENS</p>
                            <div className="grid grid-cols-1 gap-2 text-sm text-gray-400 bg-dark-900/50 p-4 rounded-lg border border-gray-700">
                                <p>📧 {profile.email}</p>
                                <p>📱 {profile.phone}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-700">
                        <h3 className="text-gray-300 font-bold mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-neon-green rounded-full"></span> RESUME STATUS
                        </h3>
                        {profile.resume ? (
                            <div className="bg-dark-900/30 p-4 rounded-xl border border-gray-700">
                                <div className="flex justify-between text-sm mb-3">
                                    <span className="text-white font-mono">{profile.resume.file_name}</span>
                                    <span className="text-gray-500">{profile.resume.uploaded_at}</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {profile.resume.skills && profile.resume.skills.map((skill, idx) => (
                                        <span key={idx} className="px-3 py-1 rounded-full bg-neon-purple/10 text-neon-purple border border-neon-purple/30 text-xs font-bold uppercase">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-6 bg-dark-900/30 rounded-xl border border-gray-700 border-dashed">
                                <p className="text-gray-500 mb-4">No Data Available</p>
                                <button onClick={() => navigate('/dashboard')} className="text-neon-blue hover:underline text-sm">Upload Now</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;