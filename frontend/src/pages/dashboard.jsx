import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

const Dashboard = () => {
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [stats, setStats] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            if (!token) { navigate('/'); return; }
            try {
                const response = await axios.get('http://127.0.0.1:5000/api/dashboard/stats', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                setStats(response.data);
            } catch (err) { console.error(err); }
        };
        fetchData();
    }, [navigate]);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) { alert("Pilih file PDF!"); return; }
        const formData = new FormData();
        formData.append('file', file);
        setIsLoading(true);
        
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://127.0.0.1:5000/api/user/upload-resume', formData, {
                headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'multipart/form-data' }
            });
            setUploadStatus('CV Berhasil Dianalisis! Mengalihkan...');
            setTimeout(() => navigate('/select-job'), 1500);
        } catch (error) { setUploadStatus('Upload Gagal.'); } 
        finally { setIsLoading(false); }
    };

    return (
        <div className="flex min-h-screen">
            {/* --- SIDEBAR FUTURISTIK --- */}
            <aside className="w-72 glass-card m-4 mr-0 rounded-2xl flex flex-col p-6 sticky top-4 h-[95vh]">
                <div className="mb-10 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-tr from-neon-purple to-blue-500 rounded-full animate-pulse"></div>
                    <h1 className="text-xl font-bold tracking-wider text-white">AI <span className="text-neon-purple">MOCK</span></h1>
                </div>
                
                <nav className="space-y-4 flex-1">
                    <div className="nav-item nav-item-active">Dashboard</div>
                    <div onClick={() => navigate('/history')} className="nav-item">Riwayat Latihan</div>
                    <div onClick={() => navigate('/profile')} className="nav-item">Profil Saya</div>
                </nav>

                <button onClick={() => {localStorage.removeItem('token'); navigate('/');}} 
                    className="mt-auto py-3 px-4 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/10 transition">
                    Logout System
                </button>
            </aside>

            {/* --- KONTEN UTAMA --- */}
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-1">Command Center</h2>
                        <p className="text-dark-700">Analisis kinerja & Kesiapan Karir</p>
                    </div>
                    <div className="glass-card px-6 py-2 text-neon-green text-sm font-mono border-neon-green/30">
                        SYSTEM: ONLINE
                    </div>
                </header>

                {/* GRAFIK SECTION */}
                {stats && stats.has_data ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        {/* Radar Chart */}
                        <div className="glass-card p-6 col-span-1 border-t-4 border-t-neon-purple">
                            <h3 className="text-lg font-semibold mb-4 text-gray-300">Peta Kompetensi</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={stats.radar_data}>
                                        <PolarGrid stroke="#374151" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                                        <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="transparent" />
                                        <Radar name="User" dataKey="A" stroke="#B026FF" fill="#B026FF" fillOpacity={0.5} />
                                        <Tooltip contentStyle={{ backgroundColor: '#0B0C10', borderColor: '#374151' }} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Bar Chart */}
                        <div className="glass-card p-6 col-span-2 border-t-4 border-t-neon-blue">
                            <h3 className="text-lg font-semibold mb-4 text-gray-300">Progress Nilai Sesi</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={stats.bar_data}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                                        <XAxis dataKey="name" stroke="#6B7280" />
                                        <YAxis stroke="#6B7280" />
                                        <Tooltip cursor={{fill: '#1F2937'}} contentStyle={{ backgroundColor: '#0B0C10', borderColor: '#374151' }} />
                                        <Bar dataKey="skor" fill="#45A29E" radius={[4, 4, 0, 0]} barSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="glass-card p-10 text-center mb-8 border-dashed border-2 border-gray-700">
                        <p className="text-gray-400">Belum ada data latihan. Mulai sesi pertama Anda.</p>
                    </div>
                )}

                {/* UPLOAD SECTION (Hero Style) */}
                <div className="glass-card p-10 text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/10 to-neon-blue/10 opacity-0 group-hover:opacity-100 transition duration-500"></div>
                    
                    <h3 className="text-2xl font-bold text-white mb-2 relative z-10">Mulai Simulasi Baru</h3>
                    <p className="text-gray-400 mb-8 relative z-10">Unggah CV terbaru (PDF) untuk mendapatkan pertanyaan AI yang presisi.</p>

                    <form onSubmit={handleUpload} className="relative z-10 max-w-xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-center">
                        <label className="cursor-pointer bg-dark-900 border border-gray-600 hover:border-neon-purple text-gray-300 py-3 px-6 rounded-lg w-full md:w-auto transition-all">
                            <span>{file ? file.name : "📄 Pilih File PDF"}</span>
                            <input type="file" accept="application/pdf" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
                        </label>
                        
                        <button type="submit" disabled={isLoading} className="btn-primary w-full md:w-auto px-10">
                            {isLoading ? 'ANALYZING...' : 'UPLOAD & START'}
                        </button>
                    </form>
                    
                    {uploadStatus && <p className="mt-4 text-neon-green relative z-10 font-mono">{uploadStatus}</p>}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;