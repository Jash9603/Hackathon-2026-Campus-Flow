import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'LOGIN FAILED');
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-black/60 border border-stranger-red p-8 rounded-lg shadow-[0_0_30px_rgba(255,0,51,0.2)] relative overflow-hidden backdrop-blur-sm">

                {/* Decorative corner accents */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-stranger-red"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-stranger-red"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-stranger-red"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-stranger-red"></div>

                <h2 className="text-3xl font-title text-center text-stranger-red mb-8 tracking-widest text-glow">
                    AUTHENTICATION
                </h2>

                {error && (
                    <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 mb-6 font-retro text-xs text-center animate-pulse">
                        &gt; ERROR: {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-retro-blue text-xs font-retro mb-2 tracking-widest">EMAIL_ADDRESS</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-gray-900/50 border border-gray-700 focus:border-stranger-red focus:ring-1 focus:ring-stranger-red text-gray-200 p-3 outline-none transition-all font-mono"
                            placeholder="hawkins@lab.gov"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-retro-blue text-xs font-retro mb-2 tracking-widest">PASSWORD</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-900/50 border border-gray-700 focus:border-stranger-red focus:ring-1 focus:ring-stranger-red text-gray-200 p-3 outline-none transition-all font-mono"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-stranger-red/10 border border-stranger-red text-stranger-red hover:bg-stranger-red hover:text-black font-bold py-3 transition-all duration-300 tracking-widest uppercase text-sm"
                    >
                        Connect
                    </button>
                </form>

                <div className="mt-8 text-center text-gray-500 text-xs font-retro">
                    <p>NO ACCESS CARD?</p>
                    <Link to="/register" className="text-retro-cyan hover:underline mt-2 inline-block">
                        REQUEST CLEARANCE
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
