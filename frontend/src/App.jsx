import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Layout/Navbar';
import Home from './pages/Home';
import MapPage from './pages/Map';
import CalendarPage from './pages/Calendar';
import Admin from './pages/Admin';

function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="app-container">
                    <Navbar />
                    <main>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/map" element={<MapPage />} />
                            <Route path="/calendar" element={<CalendarPage />} />
                            <Route path="/admin" element={<Admin />} />
                        </Routes>
                    </main>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;
