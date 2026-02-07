import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Fix import path if needed, assumed ./context/AuthContext
import { NotificationProvider } from './context/NotificationContext'; // Added NotificationProvider
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register'; // Added Register import
import Events from './pages/Events'; // Added Events import
import EventDetails from './pages/EventDetails'; // Added EventDetails import
import Dashboard from './pages/Dashboard'; // Import Dashboard
import AdminDashboard from './pages/AdminDashboard'; // Import AdminDashboard
import CreateEvent from './pages/CreateEvent'; // Import CreateEvent
import ManageRegistrations from './pages/ManageRegistrations'; // Import ManageRegistrations
import StudentProfile from './pages/StudentProfile'; // Import StudentProfile
import ChatWidget from './components/ChatWidget'; // Import ChatWidget
import CursorTrail from './components/CursorTrail'; // Import CursorTrail
import CustomCursor from './components/CustomCursor'; // Import CustomCursor
import ParticleBackground from './components/ParticleBackground'; // Import ParticleBackground
import GridBackground from './components/GridBackground'; // Import GridBackground
import ThunderEffect from './components/LightningEffect'; // Import ThunderEffect
import FloatingOrbs from './components/FloatingOrbs'; // Import FloatingOrbs
import ProtectedRoute from './components/ProtectedRoute';

// Placeholder Pages
const Home = () => (
  <div className="text-center py-20">
    <h1 className="text-6xl font-title text-stranger-red mb-4 text-glow animate-text-glow">CAMPUS FLOW</h1>
    <p className="font-retro text-retro-cyan animate-pulse tracking-widest">WELCOME TO THE EVENT HORIZON</p>

    <div className="mt-12 flex justify-center gap-6">
      <a href="/events" className="px-8 py-3 border border-retro-cyan text-retro-cyan hover:bg-retro-cyan hover:text-black transition-all font-retro text-sm tracking-widest">
        &gt; BROWSE_EVENTS
      </a>
    </div>
  </div>
);




function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="min-h-screen relative font-sans text-stranger-glow selection:bg-stranger-red selection:text-white pb-20">

            {/* Global Effects */}
            <CustomCursor />
            <CursorTrail />

            {/* Background Layers (ordered back to front) */}
            <div className="fixed inset-0 bg-gradient-to-b from-stranger-black via-stranger-gray to-stranger-black -z-10"></div>
            <FloatingOrbs />
            <GridBackground />
            <ParticleBackground />
            <ThunderEffect />

            <ChatWidget />
            <div className="fixed inset-0 pointer-events-none z-50 crt-overlay"></div>
            <div className="fixed inset-0 pointer-events-none z-40 scanline"></div>

            <Navbar />

            <main className="container mx-auto px-4 py-8 relative z-10">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} /> {/* Added Register route */}

                <Route path="/" element={<Home />} />
                <Route path="/events" element={<Events />} />
                <Route path="/events/:id" element={<EventDetails />} />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/profile" element={<StudentProfile />} />
                </Route>

                <Route element={<ProtectedRoute roles={['organizer', 'admin']} />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/create-event" element={<CreateEvent />} />
                  <Route path="/events/:eventId/registrations" element={<ManageRegistrations />} />
                </Route>

                <Route element={<ProtectedRoute roles={['admin']} />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                </Route>

              </Routes>
            </main>

          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
