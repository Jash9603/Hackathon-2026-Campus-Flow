import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Loader, Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';

const StudentProfile = () => {
    const { user } = useAuth();
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyRegistrations();
    }, []);

    const fetchMyRegistrations = async () => {
        try {
            const res = await api.get('/registrations/my');
            setRegistrations(res.data);
        } catch (error) {
            console.error('Failed to fetch registrations', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="flex justify-center py-20"><Loader className="animate-spin text-retro-cyan" /></div>;

    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="flex items-end justify-between mb-8 border-b border-gray-800 pb-6">
                <div>
                    <h1 className="text-3xl font-title text-retro-cyan text-glow">STUDENT_PROFILE</h1>
                    <p className="font-retro text-gray-500 text-xs mt-2 tracking-widest">
                        Subject: {user?.name.toUpperCase()}
                    </p>
                    <p className="font-mono text-gray-600 text-xs mt-1">ID: {user?.id || '*******'}</p>
                </div>
                <div className="text-right">
                    <div className="font-retro text-xs text-gray-400 tracking-widest mb-1">REGISTERED_EVENTS</div>
                    <div className="text-4xl font-mono text-white">{registrations.length}</div>
                </div>
            </div>

            <div className="space-y-6">
                <h2 className="font-retro text-sm text-gray-400 tracking-widest border-l-2 border-retro-cyan pl-3">
                    &gt; ACTIVE_ENGAGEMENTS
                </h2>

                {registrations.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-gray-800 rounded bg-black/40">
                        <p className="font-mono text-gray-500 mb-4">NO_ACTIVE_PROTOCOLS_FOUND</p>
                        <Link to="/events" className="inline-block px-6 py-2 border border-retro-cyan text-retro-cyan font-retro text-xs hover:bg-retro-cyan hover:text-black transition-colors">
                            BROWSE_ALL_EVENTS
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {registrations.map((reg) => (
                            <div key={reg._id} className="group relative bg-black/40 border border-gray-800 p-6 rounded hover:border-retro-cyan/50 transition-all">
                                <div className="flex flex-col md:flex-row justify-between gap-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-retro tracking-wider ${reg.status === 'confirmed' ? 'bg-green-900/30 text-green-400 border border-green-800' :
                                                    reg.status === 'rejected' ? 'bg-red-900/30 text-red-400 border border-red-800' :
                                                        'bg-yellow-900/30 text-yellow-500 border border-yellow-800'
                                                }`}>
                                                {reg.status.toUpperCase()}
                                            </span>
                                            <span className="text-gray-500 font-mono text-xs">ref: {reg._id.slice(-6)}</span>
                                        </div>

                                        <h3 className="text-xl font-bold text-gray-200 group-hover:text-retro-cyan transition-colors">
                                            {reg.event.title}
                                        </h3>

                                        <div className="flex flex-wrap gap-4 text-xs font-mono text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Calendar size={14} />
                                                <span>{new Date(reg.event.timeline.start).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <MapPin size={14} />
                                                <span>{reg.event.location}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <Link
                                            to={`/events/${reg.event._id}`}
                                            className="w-full md:w-auto px-4 py-2 bg-gray-900 text-gray-300 font-retro text-xs hover:bg-retro-cyan hover:text-black transition-colors flex items-center justify-center gap-2"
                                        >
                                            ACCESS_PROTOCOL <ArrowRight size={14} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentProfile;
