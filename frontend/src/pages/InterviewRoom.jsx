import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const AVATAR_URL = "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg";

const InterviewRoom = () => {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState("");
    const [timer, setTimer] = useState(180); 
    const [isSenior, setIsSenior] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
    const sessionId = localStorage.getItem('sessionId');
    const sessionRole = localStorage.getItem('sessionRole');
    const timerRef = useRef(null);

    useEffect(() => {
        const storedQuestions = JSON.parse(localStorage.getItem('questionsList') || "[]");
        const storedLevel = localStorage.getItem('sessionLevel');
        if (storedQuestions.length > 0) {
            setQuestions(storedQuestions);
            setIsSenior(storedLevel === 'Senior');
            setIsLoading(false);
        } else { navigate('/dashboard'); }
    }, [navigate]);

    const speakQuestion = (text) => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'id-ID';
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
    };

    useEffect(() => {
        if (questions.length > 0) setTimeout(() => speakQuestion(questions[currentQuestionIndex]), 500);
    }, [currentQuestionIndex, questions]);

    useEffect(() => { setUserAnswer(transcript); }, [transcript]);

    useEffect(() => {
        if (!isSenior) return;
        setTimer(180); 
        timerRef.current = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) { handleNextQuestion(); return 0; }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, [currentQuestionIndex, isSenior]);

    const submitAnswerToBackend = async (answerText) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://127.0.0.1:5000/api/interview/submit-answer', 
                { session_id: sessionId, question: questions[currentQuestionIndex], answer: answerText }, 
                { headers: { 'Authorization': 'Bearer ' + token } }
            );
        } catch (error) { console.error(error); }
    };

    const handleNextQuestion = async () => {
        SpeechRecognition.stopListening();
        window.speechSynthesis.cancel();
        await submitAnswerToBackend(userAnswer || transcript || "Tidak menjawab");
        if (currentQuestionIndex < questions.length - 1) {
            resetTranscript(); setUserAnswer(""); setCurrentQuestionIndex(prev => prev + 1);
        } else { navigate('/result'); }
    };

    const toggleMic = () => {
        if (listening) SpeechRecognition.stopListening();
        else { resetTranscript(); SpeechRecognition.startListening({ continuous: true, language: 'id-ID' }); }
    };

    if (isLoading) return <div className="min-h-screen flex items-center justify-center text-neon-blue font-mono animate-pulse">LOADING MODULES...</div>;

    return (
        <div className="min-h-screen p-6 flex flex-col items-center">
            {/* Top Bar */}
            <div className="w-full max-w-6xl flex justify-between items-center mb-8 glass-card px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                    <span className="font-mono text-red-400">LIVE SESSION: {sessionRole.toUpperCase()}</span>
                </div>
                {isSenior && <div className="text-2xl font-mono text-neon-green">{Math.floor(timer/60)}:{timer%60 < 10 ? '0' : ''}{timer%60}</div>}
            </div>

            <div className="flex flex-col lg:flex-row gap-6 w-full max-w-6xl h-[600px]">
                {/* Avatar Section */}
                <div className="lg:w-1/3 glass-card flex flex-col items-center justify-center relative overflow-hidden border-t-2 border-neon-purple">
                    <div className={`absolute inset-0 bg-neon-purple/10 transition-opacity duration-300 ${isSpeaking ? 'opacity-100 animate-pulse' : 'opacity-0'}`}></div>
                    <img src={AVATAR_URL} className={`w-48 h-48 rounded-full border-4 shadow-[0_0_30px_rgba(176,38,255,0.4)] object-cover mb-6 transition-transform ${isSpeaking ? 'scale-105 border-neon-purple' : 'border-gray-600'}`} />
                    <div className="px-6 w-full text-center relative z-10">
                        <p className="text-xs text-neon-purple mb-2 font-bold tracking-widest">AI INTERVIEWER</p>
                        <p className="text-white text-lg font-medium leading-relaxed">"{questions[currentQuestionIndex]}"</p>
                    </div>
                </div>

                {/* Response Section */}
                <div className="lg:w-2/3 glass-card p-6 flex flex-col border-t-2 border-neon-blue">
                    <div className="flex-1 bg-dark-900/50 rounded-xl p-4 border border-gray-700 mb-4 overflow-y-auto font-mono text-sm text-gray-300 relative">
                        {userAnswer || <span className="text-gray-600 italic">Menunggu respon suara...</span>}
                        {listening && <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>}
                    </div>

                    <div className="flex gap-4">
                        <button onClick={toggleMic} className={`flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all ${listening ? 'bg-red-500/20 text-red-400 border border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'bg-dark-800 border border-gray-600 hover:border-white text-white'}`}>
                            <span className="text-xl">{listening ? '⏹' : '🎙'}</span> {listening ? 'STOP RECORDING' : 'ACTIVATE MIC'}
                        </button>
                        <button onClick={handleNextQuestion} className="flex-1 btn-primary">
                            SUBMIT & NEXT
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterviewRoom;