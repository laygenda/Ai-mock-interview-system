import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SelectJob = () => {
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [level, setLevel] = useState('Junior');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/api/interview/jobs');
                setJobs(response.data);
            } catch (error) { console.error(error); }
        };
        fetchJobs();
    }, []);

    const handleStart = async () => {
        if (!selectedJob) { alert("Pilih target dulu!"); return; }
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://127.0.0.1:5000/api/interview/start', 
                { role_id: selectedJob, level: level }, 
                { headers: { 'Authorization': 'Bearer ' + token } }
            );
            localStorage.setItem('sessionId', response.data.session_id);
            localStorage.setItem('sessionRole', jobs.find(j => j.id === selectedJob).role_name);
            localStorage.setItem('questionsList', JSON.stringify(response.data.questions));
            localStorage.setItem('sessionLevel', level);
            navigate('/interview-room');
        } catch (error) { alert("Gagal memulai."); } 
        finally { setIsLoading(false); }
    };

    return (
        <div className="min-h-screen p-8 flex flex-col items-center justify-center relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-purple via-neon-blue to-neon-green"></div>
            
            <h2 className="text-4xl font-bold mb-2 text-white tracking-widest uppercase">Select <span className="text-neon-blue">Mission</span></h2>
            <p className="text-gray-400 mb-10 font-mono text-sm">Pilih spesialisasi dan tingkat kesulitan.</p>

            {/* Job Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mb-12">
                {jobs.map((job) => (
                    <div 
                        key={job.id}
                        onClick={() => setSelectedJob(job.id)}
                        className={`p-6 rounded-xl border transition-all duration-300 cursor-pointer relative overflow-hidden group
                            ${selectedJob === job.id 
                                ? 'bg-dark-800/80 border-neon-purple shadow-[0_0_30px_rgba(176,38,255,0.2)]' 
                                : 'bg-dark-800/40 border-gray-700 hover:border-gray-500'}`}
                    >
                        <div className={`absolute top-0 left-0 w-1 h-full transition-all duration-300 ${selectedJob === job.id ? 'bg-neon-purple' : 'bg-transparent'}`}></div>
                        <h3 className={`text-xl font-bold mb-2 ${selectedJob === job.id ? 'text-white' : 'text-gray-300'}`}>{job.role_name}</h3>
                        <p className="text-sm text-gray-500 group-hover:text-gray-400 transition-colors">{job.description}</p>
                    </div>
                ))}
            </div>

            {/* Level Selector (Neon Pills) */}
            <div className="flex bg-dark-800 p-1 rounded-full border border-gray-700 mb-10">
                {['Junior', 'Senior'].map((lvl) => (
                    <button
                        key={lvl}
                        onClick={() => setLevel(lvl)}
                        className={`px-10 py-3 rounded-full font-bold text-sm transition-all duration-300
                            ${level === lvl 
                                ? 'bg-neon-blue text-dark-900 shadow-[0_0_15px_rgba(69,162,158,0.5)]' 
                                : 'text-gray-400 hover:text-white'}`}
                    >
                        {lvl.toUpperCase()}
                    </button>
                ))}
            </div>

            <button onClick={handleStart} disabled={isLoading} className="btn-primary px-20">
                {isLoading ? 'INITIALIZING...' : 'START SIMULATION'}
            </button>
        </div>
    );
};

export default SelectJob;