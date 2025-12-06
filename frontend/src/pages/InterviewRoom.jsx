import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const InterviewRoom = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Untuk mengambil data yang dikirim dari halaman sebelumnya

    // --- STATE MANAGEMENT ---
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState("");
    const [timer, setTimer] = useState(180); // 3 Menit = 180 detik (Khusus Senior)
    const [isSenior, setIsSenior] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Ambil Session Info dari LocalStorage
    const sessionId = localStorage.getItem('sessionId');
    const sessionRole = localStorage.getItem('sessionRole');

    // Ref untuk timer interval agar bisa di-clear
    const timerRef = useRef(null);

    // --- 1. FETCH PERTANYAAN SAAT LOAD ---
    useEffect(() => {
        // Ambil data pertanyaan yang tersimpan di LocalStorage (dikirim dari SelectJob)
        // Atau fetch ulang jika perlu. Di sini kita ambil dari state navigasi/localStorage
        const storedQuestions = JSON.parse(localStorage.getItem('questionsList') || "[]");
        const storedLevel = localStorage.getItem('sessionLevel');

        if (storedQuestions.length > 0) {
            setQuestions(storedQuestions);
            setIsSenior(storedLevel === 'Senior');
            setIsLoading(false);
        } else {
            alert("Data sesi hilang. Kembali ke dashboard.");
            navigate('/dashboard');
        }
    }, [navigate]);

    // --- 2. LOGIKA TIMER (KHUSUS SENIOR) ---
    useEffect(() => {
        if (!isSenior) return; // Junior tidak pakai timer

        // Reset timer setiap ganti soal
        setTimer(180); 

        timerRef.current = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    handleAutoSubmit(); // Waktu habis, auto submit
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [currentQuestionIndex, isSenior]); // Jalan ulang tiap index berubah

    // --- 3. FUNGSI SUBMIT JAWABAN ---
    const submitAnswerToBackend = async (answerText) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://127.0.0.1:5000/api/interview/submit-answer', {
                session_id: sessionId,
                question: questions[currentQuestionIndex],
                answer: answerText
            }, {
                headers: { 'Authorization': 'Bearer ' + token }
            });
        } catch (error) {
            console.error("Gagal simpan jawaban:", error);
        }
    };

    const handleNextQuestion = async () => {
        // 1. Simpan Jawaban
        await submitAnswerToBackend(userAnswer);

        // 2. Cek apakah masih ada soal?
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
            setUserAnswer(""); // Reset input teks
        } else {
            finishInterview();
        }
    };

    const handleAutoSubmit = () => {
        clearInterval(timerRef.current);
        alert("Waktu Habis! Pindah ke soal berikutnya.");
        handleNextQuestion();
    };

    const finishInterview = () => {
        alert("Selamat! Sesi Wawancara Selesai.");
        navigate('/dashboard'); // Nanti diarahkan ke halaman Result
    };

    // Format Waktu (Menit:Detik)
    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    if (isLoading) return <div className="text-white p-10">Memuat Soal...</div>;

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
            
            {/* Header: Progress & Timer */}
            <div className="w-full max-w-4xl flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
                <div>
                    <h2 className="text-xl font-bold text-purple-400">{sessionRole} Interview</h2>
                    <p className="text-sm text-gray-400">Soal {currentQuestionIndex + 1} dari {questions.length}</p>
                </div>

                {isSenior && (
                    <div className={`text-2xl font-mono font-bold ${timer < 30 ? 'text-red-500 animate-pulse' : 'text-green-400'}`}>
                        ⏱ {formatTime(timer)}
                    </div>
                )}
            </div>

            {/* Area Pertanyaan */}
            <div className="w-full max-w-4xl bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 mb-6">
                <h3 className="text-lg text-gray-300 mb-2">Pertanyaan:</h3>
                <p className="text-2xl font-semibold text-white leading-relaxed">
                    "{questions[currentQuestionIndex]}"
                </p>
            </div>

            {/* Area Jawaban (Text Only untuk sekarang) */}
            <div className="w-full max-w-4xl">
                <textarea 
                    className="w-full h-40 p-4 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none resize-none text-lg"
                    placeholder="Ketik jawaban Anda di sini..."
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                ></textarea>

                <div className="flex justify-end mt-4">
                    <button 
                        onClick={handleNextQuestion}
                        className="px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold text-white transition shadow-lg flex items-center gap-2"
                    >
                        {currentQuestionIndex === questions.length - 1 ? 'Selesai & Kumpulkan' : 'Selanjutnya ➡️'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InterviewRoom;