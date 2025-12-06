import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'; // Import Dashboard
import SelectJob from './pages/SelectJob';
import InterviewRoom from './pages/InterviewRoom';

function App() {
  return (
    <Router>
      <Routes>
        {/* Halaman Login (Default) */}
        <Route path="/" element={<Login />} />
        
        {/* Halaman Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Halaman Select Job */}
        <Route path="/select-job" element={<SelectJob />} />

        {/* Halaman Interview Room */}
        <Route path="/interview-room" element={<InterviewRoom />} />
      </Routes>
    </Router>
  );
}

export default App;