import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SelectJob = () => {
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [level, setLevel] = useState('Junior'); // Default Level
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Ambil data jobs dari Backend saat halaman dibuka
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/api/interview/jobs');
                setJobs(response.data);
            } catch (error) {
                console.error("Gagal ambil data job:", error);
                alert("Gagal memuat data pekerjaan. Pastikan backend nyala.");
            }
        };
        fetchJobs();
    }, []);

    // Handle Tombol Start Interview
    const handleStart = async () => {
        if (!selectedJob) {
            alert("Harap pilih posisi pekerjaan dulu!");
            return;
        }

        setIsLoading(true);
        const token = localStorage.getItem('token');

        try {
            // Request ke Backend untuk memulai sesi (Membuat ID sesi baru)
            const response = await axios.post('http://127.0.0.1:5000/api/interview/start', {
                role_id: selectedJob,
                level: level
            }, {
                headers: { 'Authorization': 'Bearer ' + token }
            });

            // Simpan Session ID agar halaman Interview nanti tahu ini sesi yang mana
            localStorage.setItem('sessionId', response.data.session_id);
            localStorage.setItem('sessionRole', jobs.find(j => j.id === selectedJob).role_name);
            
            alert(`Sesi Siap! ID: ${response.data.session_id}`);
            
            // Redirect ke Halaman Interview Room (Nanti kita buat)
            navigate('/interview-room');

        } catch (error) {
            console.error(error);
            alert("Gagal memulai sesi: " + (error.response?.data?.message || "Server Error"));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-10 flex flex-col items-center">
            <h2 className="text-3xl font-bold mb-2 text-purple-400">Pilih Target Karirmu</h2>
            <p className="text-gray-400 mb-10">Sesuaikan posisi dan level kesulitan wawancara</p>

            {/* Grid Pilihan Job */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mb-12">
                {jobs.map((job) => (
                    <div 
                        key={job.id}
                        onClick={() => setSelectedJob(job.id)}
                        className={`p-6 rounded-xl border-2 cursor-pointer transition-all hover:-translate-y-1
                            ${selectedJob === job.id 
                                ? 'border-purple-500 bg-gray-800 shadow-[0_0_15px_rgba(168,85,247,0.5)]' 
                                : 'border-gray-700 bg-gray-800 hover:border-gray-600'}`}
                    >
                        <h3 className="text-xl font-bold text-white mb-2">{job.role_name}</h3>
                        <p className="text-sm text-gray-400">{job.description}</p>
                    </div>
                ))}
            </div>

            {/* Pilihan Level */}
            <div className="flex space-x-4 mb-12 bg-gray-800 p-2 rounded-full border border-gray-700">
                {['Junior', 'Senior'].map((lvl) => (
                    <button
                        key={lvl}
                        onClick={() => setLevel(lvl)}
                        className={`px-8 py-2 rounded-full font-semibold transition-all
                            ${level === lvl 
                                ? 'bg-purple-600 text-white shadow-lg' 
                                : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
                    >
                        {lvl}
                    </button>
                ))}
            </div>

            {/* Tombol Aksi */}
            <button 
                onClick={handleStart}
                disabled={isLoading}
                className={`px-16 py-4 rounded-full font-bold text-lg transition shadow-xl
                    ${isLoading 
                        ? 'bg-gray-600 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transform hover:scale-105'}`}
            >
                {isLoading ? 'Menyiapkan Room...' : 'MULAI INTERVIEW 🚀'}
            </button>
        </div>
    );
};

export default SelectJob;