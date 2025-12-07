import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

// Gambar Avatar (Bisa ganti URL lain)
const AVATAR_URL = "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg";

const InterviewRoom = () => {
    const navigate = useNavigate();
    
    // --- STATE UTAMA ---
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState("");
    const [timer, setTimer] = useState(180); 
    const [isSenior, setIsSenior] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSpeaking, setIsSpeaking] = useState(false); // Status AI bicara

    // Setup STT (Speech to Text)
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    const sessionId = localStorage.getItem('sessionId');
    const sessionRole = localStorage.getItem('sessionRole');
    const timerRef = useRef(null);

    // --- 1. LOAD DATA & CEK BROWSER ---
    useEffect(() => {
        const storedQuestions = JSON.parse(localStorage.getItem('questionsList') || "[]");
        const storedLevel = localStorage.getItem('sessionLevel');

        if (storedQuestions.length > 0) {
            setQuestions(storedQuestions);
            setIsSenior(storedLevel === 'Senior');
            setIsLoading(false);
        } else {
            alert("Data sesi hilang.");
            navigate('/dashboard');
        }

        if (!browserSupportsSpeechRecognition) {
            alert("Browser Anda tidak mendukung fitur suara. Gunakan Chrome/Edge.");
        }
    }, [navigate, browserSupportsSpeechRecognition]);

    // --- 2. FITUR TTS (AI BICARA) ---
    const speakQuestion = (text) => {
        // Hentikan suara sebelumnya jika ada
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'id-ID'; // Bahasa Indonesia
        utterance.rate = 1; // Kecepatan bicara normal
        
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
    };

    // Efek: Baca soal setiap kali soal berubah (ganti nomor)
    useEffect(() => {
        if (questions.length > 0) {
            const currentQ = questions[currentQuestionIndex];
            // Beri jeda sedikit agar natural
            setTimeout(() => speakQuestion(currentQ), 500);
        }
    }, [currentQuestionIndex, questions]);

    // --- 3. SINKRONISASI STT KE TEXTAREA ---
    // Apa yang diucap user, otomatis masuk ke kotak jawaban
    useEffect(() => {
        setUserAnswer(transcript);
    }, [transcript]);

    // --- 4. LOGIKA TIMER ---
    useEffect(() => {
        if (!isSenior) return;
        setTimer(180); 
        timerRef.current = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    handleNextQuestion(); // Auto submit
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, [currentQuestionIndex, isSenior]);

    // --- 5. NAVIGASI SOAL ---
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
        // Stop merekam & bicara jika user klik next
        SpeechRecognition.stopListening();
        window.speechSynthesis.cancel();

        // Gunakan transcript (suara) atau userAnswer (ketikan manual)
        const finalAnswer = userAnswer || transcript || "Tidak menjawab";
        
        await submitAnswerToBackend(finalAnswer);

        if (currentQuestionIndex < questions.length - 1) {
            resetTranscript(); // Bersihkan teks rekaman
            setUserAnswer(""); 
            setCurrentQuestionIndex((prev) => prev + 1);
        } else {
            navigate('/result');
        }
    };

    // Kontrol Mic
    const toggleMic = () => {
        if (listening) {
            SpeechRecognition.stopListening();
        } else {
            resetTranscript();
            SpeechRecognition.startListening({ continuous: true, language: 'id-ID' });
        }
    };

    if (isLoading) return <div className="text-white p-10 text-center">Menyiapkan Ruangan...</div>;

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4">
            
            {/* Header */}
            <div className="w-full max-w-5xl flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-purple-400">Interview: {sessionRole}</h2>
                {isSenior && (
                    <div className={`text-2xl font-mono font-bold ${timer < 30 ? 'text-red-500 animate-pulse' : 'text-green-400'}`}>
                        {Math.floor(timer/60)}:{timer%60 < 10 ? '0' : ''}{timer%60}
                    </div>
                )}
            </div>

            {/* Konten Utama: Kiri (Avatar) & Kanan (Jawaban) */}
            <div className="flex flex-col md:flex-row gap-6 w-full max-w-5xl">
                
                {/* Panel Kiri: Avatar AI */}
                <div className="md:w-1/3 bg-gray-800 rounded-2xl p-6 flex flex-col items-center justify-center border border-gray-700 shadow-xl relative">
                    {/* Efek Animasi saat AI Bicara */}
                    <div className={`absolute inset-0 rounded-2xl transition-opacity duration-300 ${isSpeaking ? 'bg-purple-500/20 animate-pulse' : 'bg-transparent'}`}></div>
                    
                    <img 
                        src={AVATAR_URL} 
                        alt="Avatar" 
                        className={`w-40 h-40 rounded-full object-cover mb-6 border-4 shadow-lg transition-transform duration-500 ${isSpeaking ? 'border-green-400 scale-110' : 'border-purple-500 scale-100'}`}
                    />
                    
                    <div className="bg-gray-700 p-4 rounded-xl text-center w-full relative z-10">
                        <p className="text-sm text-gray-400 mb-1">AI Interviewer</p>
                        <p className="font-semibold text-lg">"{questions[currentQuestionIndex]}"</p>
                    </div>
                </div>

                {/* Panel Kanan: Input Jawaban */}
                <div className="md:w-2/3 bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl flex flex-col">
                    <label className="text-gray-300 mb-2 font-semibold">Jawaban Anda:</label>
                    
                    <textarea 
                        className="flex-1 w-full bg-gray-900 text-white p-4 rounded-xl border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none resize-none mb-4 text-lg leading-relaxed"
                        placeholder="Tekan Mic untuk bicara, atau ketik jawaban..."
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                    ></textarea>

                    {/* Tombol Kontrol Bawah */}
                    <div className="flex justify-between items-center">
                        
                        {/* Tombol Mic Besar */}
                        <button 
                            onClick={toggleMic}
                            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all shadow-lg transform hover:scale-105
                                ${listening 
                                    ? 'bg-red-500 hover:bg-red-600 animate-pulse text-white' 
                                    : 'bg-gray-700 hover:bg-gray-600 text-gray-200'}`}
                        >
                            <span className="text-2xl">{listening ? '⏹️' : '🎙️'}</span>
                            {listening ? 'Stop Rekam' : 'Mulai Bicara'}
                        </button>

                        <button 
                            onClick={handleNextQuestion}
                            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-full font-bold text-white shadow-lg transition transform hover:-translate-y-1"
                        >
                            Selanjutnya ➡️
                        </button>
                    </div>
                    
                    {listening && <p className="text-center text-xs text-green-400 mt-2">Mendengarkan suara Anda...</p>}
                </div>
            </div>
        </div>
    );
};

export default InterviewRoom;