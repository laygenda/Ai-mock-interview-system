import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const History = () => {
    const [history, setHistory] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://127.0.0.1:5000/api/history/', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                setHistory(response.data);
            } catch (error) {
                console.error("Gagal ambil history:", error);
            }
        };
        fetchHistory();
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-purple-400">Riwayat Latihan</h2>
                    <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-white">
                        ← Kembali ke Dashboard
                    </button>
                </div>

                <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700">
                    <table className="w-full text-left">
                        <thead className="bg-gray-700 text-gray-300">
                            <tr>
                                <th className="p-4">Tanggal</th>
                                <th className="p-4">Posisi</th>
                                <th className="p-4">Level</th>
                                <th className="p-4">Skor</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {history.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-gray-500">Belum ada riwayat latihan.</td>
                                </tr>
                            ) : (
                                history.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-750 transition">
                                        <td className="p-4 text-sm">{item.date}</td>
                                        <td className="p-4 font-semibold">{item.role}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs ${item.level === 'Senior' ? 'bg-red-900 text-red-200' : 'bg-blue-900 text-blue-200'}`}>
                                                {item.level}
                                            </span>
                                        </td>
                                        <td className="p-4 font-bold text-purple-300">{item.score}</td>
                                        <td className="p-4 text-sm text-gray-400">{item.status}</td>
                                        <td className="p-4">
                                            <button 
                                                onClick={() => {
                                                    localStorage.setItem('sessionId', item.id);
                                                    navigate('/result');
                                                }}
                                                className="text-purple-400 hover:underline text-sm"
                                            >
                                                Lihat Detail
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default History;