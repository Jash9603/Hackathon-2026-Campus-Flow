import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Calendar, User, Shield } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="border-b border-stranger-red/30 bg-black/80 backdrop-blur-md sticky top-0 z-30">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-title text-stranger-red tracking-widest hover:text-stranger-glow transition-colors text-glow">
                    CAMPUS FLOW
                </Link>

                <div className="flex items-center space-x-6 font-retro text-xs md:text-sm text-gray-300">
                    <Link to="/events" className="hover:text-retro-cyan transition-colors flex items-center gap-2">
                        <Calendar size={16} /> <span className="hidden md:inline">EVENTS</span>
                    </Link>

                    {user ? (
                        <>
                            {user.role === 'organizer' && (
                                <Link to="/dashboard" className="text-retro-amber hover:text-yellow-300 transition-colors flex items-center gap-2">
                                    <Shield size={16} /> <span className="hidden md:inline">ORG_DASHBOARD</span>
                                </Link>
                            )}
                            <div className="flex items-center gap-4">
                                {/* Student Profile Link */}
                                {user.role === 'student' && (
                                    <Link to="/profile" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2" title="MY_PROFILE">
                                        <User size={16} /> <span className="hidden md:inline">PROFILE</span>
                                    </Link>
                                )}
                                <span className="text-stranger-glow hidden md:inline">{user.name.toUpperCase()}</span>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 hover:bg-stranger-red/20 rounded-full transition-colors text-stranger-red"
                                    title="LOGOUT"
                                >
                                    <LogOut size={18} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex gap-4">
                            <Link to="/login" className="hover:text-retro-cyan transition-colors">LOGIN</Link>
                            <Link to="/register" className="text-stranger-red hover:text-stranger-glow transition-colors">JOIN</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
