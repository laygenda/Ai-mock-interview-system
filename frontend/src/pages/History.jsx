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
            } catch (error) { console.error(error); }
        };
        fetchHistory();
    }, []);

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-white tracking-wide border-l-4 border-neon-blue pl-4">
                        SESSION <span className="text-neon-blue">LOGS</span>
                    </h2>
                    <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-white transition">← BACK</button>
                </div>

                <div className="glass-card overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-dark-900 text-gray-400 font-mono text-xs uppercase tracking-wider">
                            <tr>
                                <th className="p-5">Date</th>
                                <th className="p-5">Mission (Role)</th>
                                <th className="p-5">Level</th>
                                <th className="p-5">Score</th>
                                <th className="p-5">Status</th>
                                <th className="p-5 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800 text-sm">
                            {history.map((item) => (
                                <tr key={item.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-5 font-mono text-gray-400">{item.date}</td>
                                    <td className="p-5 font-bold text-white">{item.role}</td>
                                    <td className="p-5"><span className="px-2 py-1 bg-dark-900 border border-gray-600 rounded text-xs text-gray-300">{item.level}</span></td>
                                    <td className={`p-5 font-bold font-mono ${item.score >= 80 ? 'text-neon-green' : item.score >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>{item.score}</td>
                                    <td className="p-5 text-gray-500">{item.status}</td>
                                    <td className="p-5 text-right">
                                        <button 
                                            onClick={() => { localStorage.setItem('sessionId', item.id); navigate('/result'); }}
                                            className="text-neon-purple hover:text-white transition font-bold text-xs uppercase"
                                        >
                                            View Report &gt;
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {history.length === 0 && <div className="p-10 text-center text-gray-600 italic">No data records found.</div>}
                </div>
            </div>
        </div>
    );
};

export default History;