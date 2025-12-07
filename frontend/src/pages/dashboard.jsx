import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line,
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

const Dashboard = () => {
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // State untuk Data Grafik
    const [stats, setStats] = useState(null);
    const navigate = useNavigate();

    // 1. Fetch Data Statistik saat Load
    useEffect(() => {
        const fetchStats = async () => {
            const token = localStorage.getItem('token');
            if (!token) { navigate('/'); return; }

            try {
                const response = await axios.get('http://127.0.0.1:5000/api/dashboard/stats', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                setStats(response.data);
            } catch (error) {
                console.error("Gagal load stats:", error);
            }
        };
        fetchStats();
    }, [navigate]);

    // ... (Fungsi Logout, FileChange, Upload tetap sama seperti sebelumnya) ...
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) { alert("Pilih file PDF dulu!"); return; }
        const formData = new FormData();
        formData.append('file', file);
        setIsLoading(true);
        setUploadStatus('');

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://127.0.0.1:5000/api/user/upload-resume', formData, {
                headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'multipart/form-data' }
            });
            setUploadStatus(`Sukses! Skill terdeteksi: ${response.data.detected_skills.join(", ")}`);
            setTimeout(() => { navigate('/select-job'); }, 1500);
        } catch (error) {
            setUploadStatus('Gagal upload. Pastikan file PDF dan Backend nyala.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 p-6 hidden md:block border-r border-gray-700">
                <h1 className="text-2xl font-bold text-purple-500 mb-8">AI Mock Interview</h1>
                <nav className="space-y-4">
                    <div className="block py-2 px-4 bg-purple-900/50 text-purple-300 rounded cursor-pointer border border-purple-500">Dashboard</div>
                    <div onClick={() => navigate('/history')} className="block py-2 px-4 text-gray-400 hover:text-white hover:bg-gray-700 rounded cursor-pointer transition">History</div>
                    <div onClick={() => navigate('/profile')} className="block py-2 px-4 text-gray-400 hover:text-white hover:bg-gray-700 rounded cursor-pointer transition">Profile</div>
                    <button onClick={handleLogout} className="text-red-400 hover:text-red-300 mt-10 w-full text-left px-4">Logout</button>
                </nav>
            </aside>

            {/* Konten Utama */}
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold">Dashboard Kinerja</h2>
                        <p className="text-gray-400">Pantau progres latihan wawancaramu di sini.</p>
                    </div>
                    <button onClick={handleLogout} className="md:hidden text-red-400">Logout</button>
                </div>

                {/* --- BAGIAN GRAFIK --- */}
                {stats && stats.has_data ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                        
                        {/* 1. Bar Chart: Progress Skor */}
                        <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-lg">
                            <h3 className="text-lg font-semibold mb-4 text-purple-300">Progress Skor Terakhir</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={stats.bar_data}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                        <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                                        <YAxis stroke="#9CA3AF" domain={[0, 100]} />
                                        <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                                        <Bar dataKey="skor" fill="#8884d8" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* 2. Line Chart: Keaktifan Latihan */}
                        <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-lg">
                            <h3 className="text-lg font-semibold mb-4 text-blue-300">Frekuensi Latihan</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={stats.line_data}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                        <XAxis dataKey="date" stroke="#9CA3AF" />
                                        <YAxis stroke="#9CA3AF" allowDecimals={false} />
                                        <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                                        <Line type="monotone" dataKey="count" stroke="#60A5FA" strokeWidth={3} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* 3. Radar Chart: Analisis STAR */}
                        <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-lg">
                            <h3 className="text-lg font-semibold mb-4 text-green-300">Kompetensi (STAR & Skill)</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={stats.radar_data}>
                                        <PolarGrid stroke="#374151" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                                        <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#4B5563" />
                                        <Radar name="User" dataKey="A" stroke="#34D399" fill="#34D399" fillOpacity={0.4} />
                                        <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mb-10 text-center">
                        <p className="text-gray-400">Belum ada data latihan. Yuk mulai latihan pertamamu!</p>
                    </div>
                )}

                {/* --- BAGIAN UPLOAD (CTA) --- */}
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-8 rounded-xl shadow-lg border border-gray-700 text-center">
                    <h3 className="text-xl font-bold mb-4 text-white">Mulai Sesi Baru</h3>
                    <p className="text-gray-400 mb-6">Upload CV terbaru untuk mendapatkan pertanyaan yang dipersonalisasi.</p>

                    <form onSubmit={handleUpload} className="max-w-xl mx-auto">
                        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                            <input 
                                type="file" 
                                accept="application/pdf"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-400
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-gray-700 file:text-purple-400
                                hover:file:bg-gray-600 cursor-pointer"
                            />
                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className={`px-8 py-2 rounded-full font-bold text-white transition whitespace-nowrap
                                    ${isLoading ? 'bg-gray-600' : 'bg-purple-600 hover:bg-purple-700 shadow-lg hover:shadow-purple-500/30'}`}
                            >
                                {isLoading ? 'Processing...' : 'Upload & Start 🚀'}
                            </button>
                        </div>
                    </form>

                    {uploadStatus && (
                        <div className={`mt-4 text-sm font-medium ${uploadStatus.includes('Sukses') ? 'text-green-400' : 'text-red-400'}`}>
                            {uploadStatus}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;