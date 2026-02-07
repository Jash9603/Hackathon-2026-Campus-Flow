import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle, AlertCircle } from 'lucide-react';

const RegistrationModule = ({ eventId, config }) => {
    const { user } = useAuth();
    const [status, setStatus] = useState(null); // null, pending, confirmed, waitlisted
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({}); // For dynamic fields if configured

    useEffect(() => {
        if (user) {
            checkRegistrationStatus();
        }
    }, [user, eventId]);

    const checkRegistrationStatus = async () => {
        try {
            const res = await api.get('/registrations/my');
            const myReg = res.data.find(r => r.event._id === eventId);
            if (myReg) {
                setStatus(myReg.status);
            }
        } catch (err) {
            console.error('Failed to check registration', err);
        }
    };

    const handleRegister = async () => {
        setLoading(true);
        setError('');
        try {
            await api.post(`/registrations/${eventId}`, { responses: formData });
            setStatus('pending');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="p-4 border border-gray-700 bg-black/40 rounded text-center">
                <p className="text-gray-400 font-retro text-xs mb-4">LOGIN_REQUIRED_FOR_ACCESS</p>
                <a href="/login" className="text-stranger-red hover:underline">AUTHENTICATE</a>
            </div>
        );
    }

    if (status) {
        return (
            <div className="p-6 border border-retro-cyan/30 bg-retro-cyan/5 rounded text-center">
                <CheckCircle className="mx-auto text-retro-cyan mb-2" size={32} />
                <h3 className="text-retro-cyan font-title text-xl tracking-widest">STATUS: {status.toUpperCase()}</h3>
                <p className="text-gray-400 font-mono text-xs mt-2">REGISTRATION_LOGGED</p>
            </div>
        );
    }

    return (
        <div className="p-6 border border-stranger-red/30 bg-black/40 rounded">
            <h3 className="text-xl font-title text-stranger-red mb-4 text-glow">
                EVENT_REGISTRATION
            </h3>

            {config.limit && (
                <p className="text-gray-500 font-mono text-xs mb-4">
                    CAPACITY_LIMIT: {config.limit} UNITS
                </p>
            )}

            {error && (
                <div className="bg-red-900/50 border border-red-500 text-red-200 p-2 mb-4 font-retro text-xs flex items-center gap-2">
                    <AlertCircle size={14} />
                    <span>{error}</span>
                </div>
            )}

            {/* TODO: Render dynamic fields based on config.fields */}

            <button
                onClick={handleRegister}
                disabled={loading}
                className="w-full py-3 bg-stranger-red text-black font-bold font-retro text-sm hover:bg-stranger-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed tracking-widest"
            >
                {loading ? 'PROCESSING...' : 'CONFIRM_ATTENDANCE'}
            </button>
        </div>
    );
};

export default RegistrationModule;
