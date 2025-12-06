import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            alert("Pilih file PDF dulu!");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setIsLoading(true);
        setUploadStatus('');

        try {
            const token = localStorage.getItem('token');
            
            // PERBAIKAN DI SINI: Perhatikan spasi setelah kata Bearer
            const response = await axios.post('http://127.0.0.1:5000/api/user/upload-resume', formData, {
                headers: {
                    'Authorization': 'Bearer ' + token, 
                    'Content-Type': 'multipart/form-data'
                }
            });

            setUploadStatus(`Sukses! Skill terdeteksi: ${response.data.detected_skills.join(", ")}`);

            // tambahan redirect setelah 1.5 detik
            setTimeout(() => {
                navigate('/select-job');
            }, 1500);
            
        } catch (error) {
            console.error(error);
            setUploadStatus('Gagal upload. Pastikan Anda sudah login ulang.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex">
            <aside className="w-64 bg-gray-800 p-6 hidden md:block">
                <h1 className="text-2xl font-bold text-purple-500 mb-8">AI Mock Interview</h1>
                <nav className="space-y-4">
                    <a href="#" className="block py-2 px-4 bg-gray-700 rounded text-white">Dashboard</a>
                    <button onClick={handleLogout} className="text-red-400 hover:text-red-300 mt-10 w-full text-left">Logout</button>
                </nav>
            </aside>

            <main className="flex-1 p-10">
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-3xl font-bold">Selamat Datang, Mahasiswa!</h2>
                    <button onClick={handleLogout} className="md:hidden text-red-400">Logout</button>
                </div>

                <div className="bg-gray-800 p-8 rounded-xl shadow-lg max-w-2xl mx-auto text-center border border-gray-700">
                    <h3 className="text-xl font-semibold mb-4">Mulai Latihan Wawancara</h3>
                    <p className="text-gray-400 mb-6">Jangan lupa upload CV/Resume terbaikmu yaaa!!!</p>

                    <form onSubmit={handleUpload} className="space-y-6">
                        <div className="border-2 border-dashed border-gray-600 rounded-lg p-10 hover:border-purple-500 transition cursor-pointer bg-gray-900">
                            <input 
                                type="file" 
                                accept="application/pdf"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                            />
                            <p className="mt-2 text-xs text-gray-500">Format: PDF only</p>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className={`w-full py-3 rounded font-bold text-white transition ${isLoading ? 'bg-gray-600' : 'bg-purple-600 hover:bg-purple-700'}`}
                        >
                            {isLoading ? 'Sedang Menganalisis CV...' : 'Upload & Analisis CV'}
                        </button>
                    </form>

                    {uploadStatus && (
                        <div className={`mt-6 p-4 rounded text-left ${uploadStatus.includes('Sukses') ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'}`}>
                            {uploadStatus}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;