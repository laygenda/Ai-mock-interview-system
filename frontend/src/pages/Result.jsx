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
            if (!sessionId) { navigate('/dashboard'); return; }
            try {
                const response = await axios.get(`http://127.0.0.1:5000/api/interview/session/${sessionId}`, {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                setResult(response.data);
            } catch (error) { console.error(error); }
        };
        fetchResult();
    }, [navigate]);

    if (!result) return <div className="min-h-screen flex items-center justify-center text-neon-purple animate-pulse font-mono">CALCULATING SCORE...</div>;

    return (
        <div className="min-h-screen p-10 font-sans">
            <div className="max-w-4xl mx-auto">
                {/* Score Card */}
                <div className="glass-card p-10 text-center mb-8 border-t-4 border-neon-green relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-neon-green/5 to-transparent pointer-events-none"></div>
                    <h2 className="text-2xl font-bold text-white mb-1 uppercase tracking-widest">Performance Report</h2>
                    <p className="text-gray-400 mb-8 font-mono">{result.role} • {result.level}</p>
                    
                    <div className="text-8xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-neon-green to-blue-500 drop-shadow-[0_0_10px_rgba(102,252,241,0.5)]">
                        {result.final_score}
                    </div>
                    <div className="text-neon-blue text-sm font-bold tracking-[0.3em]">FINAL SCORE</div>

                    <div className="grid grid-cols-2 gap-8 mt-10 max-w-md mx-auto">
                        <div className="bg-dark-900/50 p-4 rounded-xl border border-gray-700">
                            <div className="text-3xl font-bold text-white">{result.avg_relevance}%</div>
                            <div className="text-xs text-gray-500 mt-1 uppercase">Relevance</div>
                        </div>
                        <div className="bg-dark-900/50 p-4 rounded-xl border border-gray-700">
                            <div className="text-3xl font-bold text-white">{result.avg_clarity}%</div>
                            <div className="text-xs text-gray-500 mt-1 uppercase">Clarity</div>
                        </div>
                    </div>
                </div>

                {/* Details List */}
                <div className="space-y-4">
                    {result.details.map((item, idx) => (
                        <div key={idx} className="glass-card p-6 border-l-4 border-neon-purple hover:bg-dark-800 transition">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-neon-purple font-mono text-xs font-bold">QUESTION {idx + 1}</span>
                                <span className="bg-dark-900 text-white text-xs px-2 py-1 rounded border border-gray-700">Score: {item.total}</span>
                            </div>
                            <p className="text-white font-semibold mb-2">{item.question}</p>
                            <p className="text-gray-400 text-sm italic border-l-2 border-gray-600 pl-4">{item.answer}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-10 text-center">
                    <button onClick={() => navigate('/dashboard')} className="btn-primary px-10">RETURN TO BASE</button>
                </div>
            </div>
        </div>
    );
};

export default Result;