import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { Check, X, ArrowLeft, Loader } from 'lucide-react';

const ManageRegistrations = () => {
    const { eventId } = useParams();
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [eventName, setEventName] = useState('');

    useEffect(() => {
        fetchRegistrations();
    }, [eventId]);

    const fetchRegistrations = async () => {
        try {
            const res = await api.get(`/registrations/event/${eventId}`);
            setRegistrations(res.data);
            // Fetch event details just for the name if needed, or assume context
            const eventRes = await api.get(`/events/${eventId}`);
            setEventName(eventRes.data.title);
        } catch (error) {
            console.error('Failed to fetch registrations', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (regId, newStatus) => {
        try {
            await api.put(`/registrations/${regId}`, { status: newStatus });
            setRegistrations(prev => prev.map(r =>
                r._id === regId ? { ...r, status: newStatus } : r
            ));
        } catch (error) {
            console.error('Update failed', error);
            alert('STATUS UPDATE FAILED');
        }
    };

    if (loading) return <div className="flex justify-center py-20"><Loader className="animate-spin text-retro-cyan" /></div>;

    return (
        <div className="max-w-4xl mx-auto">
            <Link to="/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-retro-cyan font-retro text-xs mb-8 transition-colors">
                <ArrowLeft size={14} /> RETURN_TO_COMMAND
            </Link>

            <div className="flex justify-between items-end mb-8 border-b border-gray-800 pb-6">
                <div>
                    <h1 className="text-3xl font-title text-retro-cyan text-glow">RECRUITMENT_LOG</h1>
                    <p className="font-retro text-gray-400 text-xs mt-2 tracking-widest">
                        &gt; TARGET_PROTOCOL: <span className="text-white">{eventName}</span>
                    </p>
                </div>
                <div className="font-mono text-xs text-gray-500">
                    TOTAL_ENTRIES: {registrations.length}
                </div>
            </div>

            <div className="bg-black/40 border border-gray-800 rounded overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-900/50 text-gray-400 font-retro text-xs">
                        <tr>
                            <th className="p-4 tracking-widest">USER_ID</th>
                            <th className="p-4 tracking-widest">EMAIL</th>
                            <th className="p-4 tracking-widest">STATUS</th>
                            <th className="p-4 tracking-widest text-right">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {registrations.map(reg => (
                            <tr key={reg._id} className="hover:bg-gray-900/30 transition-colors">
                                <td className="p-4 font-mono text-gray-300">{reg.user?.name || 'UNKNOWN'}</td>
                                <td className="p-4 font-mono text-gray-500">{reg.user?.email}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold font-retro tracking-wider ${reg.status === 'confirmed' ? 'bg-green-900/30 text-green-400 border border-green-800' :
                                            reg.status === 'rejected' ? 'bg-red-900/30 text-red-400 border border-red-800' :
                                                'bg-yellow-900/30 text-yellow-500 border border-yellow-800'
                                        }`}>
                                        {reg.status.toUpperCase()}
                                    </span>
                                </td>
                                <td className="p-4 text-right space-x-2">
                                    {reg.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => handleStatusUpdate(reg._id, 'confirmed')}
                                                className="p-1 text-gray-500 hover:text-green-400 transition-colors"
                                                title="APPROVE"
                                            >
                                                <Check size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(reg._id, 'rejected')}
                                                className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                                                title="REJECT"
                                            >
                                                <X size={18} />
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {registrations.length === 0 && (
                            <tr>
                                <td colSpan="4" className="p-8 text-center text-gray-600 font-mono">
                                    NO_DATA_FOUND
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageRegistrations;
