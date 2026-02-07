import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'student'
    });
    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'REGISTRATION FAILED');
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-black/60 border border-retro-cyan p-8 rounded-lg shadow-[0_0_30px_rgba(0,255,255,0.2)] relative overflow-hidden backdrop-blur-sm">

                {/* Decorative corner accents - Cyan for Register */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-retro-cyan"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-retro-cyan"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-retro-cyan"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-retro-cyan"></div>

                <h2 className="text-3xl font-title text-center text-retro-cyan mb-8 tracking-widest text-glow">
                    NEW_USER_ENTRY
                </h2>

                {error && (
                    <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 mb-6 font-retro text-xs text-center animate-pulse">
                        &gt; ERROR: {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-400 text-xs font-retro mb-2 tracking-widest">FULL_NAME</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full bg-gray-900/50 border border-gray-700 focus:border-retro-cyan focus:ring-1 focus:ring-retro-cyan text-gray-200 p-3 outline-none transition-all font-mono"
                            placeholder="JANE DOE"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-xs font-retro mb-2 tracking-widest">EMAIL_COORDINATES</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-gray-900/50 border border-gray-700 focus:border-retro-cyan focus:ring-1 focus:ring-retro-cyan text-gray-200 p-3 outline-none transition-all font-mono"
                            placeholder="jane@hawkins.edu"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-xs font-retro mb-2 tracking-widest">SECURITY_CODE</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full bg-gray-900/50 border border-gray-700 focus:border-retro-cyan focus:ring-1 focus:ring-retro-cyan text-gray-200 p-3 outline-none transition-all font-mono"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 text-xs font-retro mb-2 tracking-widest">ASSIGNMENT_ROLE</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full bg-gray-900/50 border border-gray-700 focus:border-retro-cyan text-gray-200 p-3 outline-none font-mono"
                        >
                            <option value="student">STUDENT</option>
                            <option value="organizer">ORGANIZER</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full mt-6 bg-retro-cyan/10 border border-retro-cyan text-retro-cyan hover:bg-retro-cyan hover:text-black font-bold py-3 transition-all duration-300 tracking-widest uppercase text-sm"
                    >
                        INITIALIZE
                    </button>
                </form>

                <div className="mt-8 text-center text-gray-500 text-xs font-retro">
                    <p>ALREADY IN THE SYSTEM?</p>
                    <Link to="/login" className="text-stranger-red hover:underline mt-2 inline-block">
                        ACCESS TERMINAL
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
