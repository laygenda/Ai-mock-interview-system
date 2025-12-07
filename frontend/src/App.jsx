import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'; // Import Dashboard
import SelectJob from './pages/SelectJob';
import InterviewRoom from './pages/InterviewRoom';
import Register from './pages/Register';
import Result from './pages/Result';

function App() {
  return (
    <Router>
      <Routes>
        {/* Halaman Login (Default) */}
        <Route path="/" element={<Login />} />
        
        {/* Halaman Register */}
        <Route path="/register" element={<Register />} />

        {/* Halaman Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Halaman Select Job */}
        <Route path="/select-job" element={<SelectJob />} />

        {/* Halaman Interview Room */}
        <Route path="/interview-room" element={<InterviewRoom />} />

        {/* halaman Result */}
        <Route path="/result" element={<Result />} />

      </Routes>
    </Router>
  );
}

export default App;