import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Result = () => {
    const [result, setResult] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchResult = async () => {
            const sessionId = localStorage.getItem('sessionId');
            const token = localStorage.getItem('token');

            if (!sessionId) {
                navigate('/dashboard');
                return;
            }

            try {
                const response = await axios.get(`http://127.0.0.1:5000/api/interview/session/${sessionId}`, {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                setResult(response.data);
            } catch (error) {
                console.error("Gagal ambil nilai:", error);
            }
        };
        fetchResult();
    }, [navigate]);

    if (!result) return <div className="text-white p-10 text-center">Menghitung Nilai...</div>;

    // Tentukan warna berdasarkan skor
    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-400';
        if (score >= 60) return 'text-yellow-400';
        return 'text-red-400';
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
            <div className="max-w-4xl mx-auto">
                
                {/* Header Hasil */}
                <div className="bg-gray-800 rounded-2xl p-8 mb-8 text-center shadow-2xl border border-gray-700">
                    <h2 className="text-3xl font-bold mb-2">Hasil Evaluasi Interview</h2>
                    <p className="text-gray-400 mb-6">{result.role} - {result.level}</p>
                    
                    <div className="text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                        {result.final_score}
                    </div>
                    <div className="text-sm text-gray-400 uppercase tracking-widest">Skor Akhir</div>

                    {/* Statistik Kecil */}
                    <div className="flex justify-center gap-10 mt-8">
                        <div>
                            <div className={`text-2xl font-bold ${getScoreColor(result.avg_relevance)}`}>
                                {result.avg_relevance}%
                            </div>
                            <div className="text-xs text-gray-500">Relevansi</div>
                        </div>
                        <div>
                            <div className={`text-2xl font-bold ${getScoreColor(result.avg_clarity)}`}>
                                {result.avg_clarity}%
                            </div>
                            <div className="text-xs text-gray-500">Kejelasan</div>
                        </div>
                    </div>
                </div>

                {/* Detail Jawaban */}
                <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
                    <h3 className="text-xl font-bold mb-6 border-b border-gray-600 pb-4">Detail Jawaban</h3>
                    <div className="space-y-6">
                        {result.details.map((item, idx) => (
                            <div key={idx} className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                                <p className="text-purple-300 font-semibold mb-2">Q{idx + 1}: {item.question}</p>
                                <p className="text-gray-300 italic mb-3">"{item.answer}"</p>
                                <div className="flex gap-4 text-sm">
                                    <span className="bg-gray-700 px-2 py-1 rounded text-green-300">Relevansi: {item.relevance}</span>
                                    <span className="bg-gray-700 px-2 py-1 rounded text-blue-300">Kejelasan: {item.clarity}</span>
                                    <span className="bg-gray-700 px-2 py-1 rounded text-white font-bold">Total: {item.total}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-full font-bold transition"
                    >
                        Kembali ke Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Result;