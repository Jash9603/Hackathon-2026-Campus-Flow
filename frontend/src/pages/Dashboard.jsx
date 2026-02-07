import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Calendar, Users, TrendingUp, PlusCircle } from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalEvents: 0,
        activeEvents: 0,
        totalRegistrations: 0,
    });
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const res = await api.get('/events');
            const myEvents = res.data.filter(e => e.isOrganizer); // Assuming backend adds this flag

            setEvents(myEvents);
            setStats({
                totalEvents: myEvents.length,
                activeEvents: myEvents.filter(e => e.status === 'published' || e.status === 'ongoing').length,
                totalRegistrations: myEvents.reduce((acc, e) => acc + (e.registrationCount || 0), 0),
            });
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <p className="font-retro text-retro-cyan animate-pulse">LOADING_DASHBOARD...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-title text-stranger-red text-glow">ORGANIZER_DASHBOARD</h1>
                <button
                    onClick={() => navigate('/create-event')}
                    className="flex items-center gap-2 px-6 py-3 bg-retro-cyan/20 text-retro-cyan border border-retro-cyan rounded hover:bg-retro-cyan hover:text-black transition-all font-retro"
                >
                    <PlusCircle size={20} />
                    CREATE_EVENT
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-stranger-gray/30 border border-stranger-red/50 p-6 rounded-lg backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <Calendar className="text-stranger-red" size={24} />
                        <h3 className="font-retro text-stranger-glow tracking-wider">TOTAL_EVENTS</h3>
                    </div>
                    <p className="text-4xl font-bold text-stranger-red">{stats.totalEvents}</p>
                </div>

                <div className="bg-stranger-gray/30 border border-retro-cyan/50 p-6 rounded-lg backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <TrendingUp className="text-retro-cyan" size={24} />
                        <h3 className="font-retro text-stranger-glow tracking-wider">ACTIVE_EVENTS</h3>
                    </div>
                    <p className="text-4xl font-bold text-retro-cyan">{stats.activeEvents}</p>
                </div>

                <div className="bg-stranger-gray/30 border border-stranger-red/50 p-6 rounded-lg backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <Users className="text-stranger-red" size={24} />
                        <h3 className="font-retro text-stranger-glow tracking-wider">REGISTRATIONS</h3>
                    </div>
                    <p className="text-4xl font-bold text-stranger-red">{stats.totalRegistrations}</p>
                </div>
            </div>

            {/* Events List */}
            <div>
                <h2 className="text-2xl font-title text-retro-cyan mb-4">YOUR_EVENTS</h2>

                {events.length === 0 ? (
                    <div className="text-center py-12 border border-stranger-red/30 rounded-lg backdrop-blur-sm">
                        <p className="font-retro text-stranger-glow mb-4">NO_EVENTS_CREATED</p>
                        <button
                            onClick={() => navigate('/create-event')}
                            className="px-6 py-2 border border-retro-cyan text-retro-cyan hover:bg-retro-cyan hover:text-black transition-all font-retro"
                        >
                            CREATE_YOUR_FIRST_EVENT
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {events.map(event => (
                            <div
                                key={event._id}
                                className="bg-stranger-gray/20 border border-stranger-red/30 p-4 rounded-lg hover:border-retro-cyan/50 transition-all cursor-pointer"
                                onClick={() => navigate(`/events/${event._id}`)}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-bold text-stranger-red mb-2">{event.title}</h3>
                                        <p className="text-stranger-glow font-retro text-sm">
                                            STATUS: <span className={`${event.status === 'published' ? 'text-retro-cyan' : 'text-stranger-red'}`}>
                                                {event.status.toUpperCase()}
                                            </span>
                                        </p>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/events/${event._id}/registrations`);
                                        }}
                                        className="px-4 py-2 border border-retro-cyan/50 text-retro-cyan text-sm font-retro hover:bg-retro-cyan hover:text-black transition-all"
                                    >
                                        MANAGE
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
