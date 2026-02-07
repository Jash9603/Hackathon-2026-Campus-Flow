import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Trash2, Edit, Calendar, Users, MapPin, Clock } from 'lucide-react';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalEvents: 0,
        publishedEvents: 0,
        totalOrganizers: 0,
    });

    useEffect(() => {
        fetchAllEvents();
    }, []);

    const fetchAllEvents = async () => {
        try {
            const res = await api.get('/events');
            setEvents(res.data);

            // Calculate stats
            setStats({
                totalEvents: res.data.length,
                publishedEvents: res.data.filter(e => e.status === 'published').length,
                totalOrganizers: new Set(res.data.map(e => e.organizer?._id)).size,
            });
        } catch (error) {
            console.error('Failed to fetch events:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (eventId, eventTitle) => {
        if (!window.confirm(`Are you sure you want to delete "${eventTitle}"? This action cannot be undone.`)) {
            return;
        }

        try {
            await api.delete(`/events/${eventId}`);
            setEvents(events.filter(e => e._id !== eventId));
            alert('Event deleted successfully');
        } catch (error) {
            alert('Failed to delete event: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleEdit = (eventId) => {
        navigate(`/events/${eventId}/edit`);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'published': return 'text-retro-cyan';
            case 'ongoing': return 'text-green-400';
            case 'completed': return 'text-gray-400';
            case 'draft': return 'text-yellow-400';
            default: return 'text-stranger-glow';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <p className="font-retro text-retro-cyan animate-pulse">LOADING_ADMIN_PANEL...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-title text-stranger-red text-glow">ADMIN_CONTROL_PANEL</h1>
                    <p className="text-stranger-glow font-retro mt-2">Full platform access & event management</p>
                </div>
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
                        <Clock className="text-retro-cyan" size={24} />
                        <h3 className="font-retro text-stranger-glow tracking-wider">PUBLISHED</h3>
                    </div>
                    <p className="text-4xl font-bold text-retro-cyan">{stats.publishedEvents}</p>
                </div>

                <div className="bg-stranger-gray/30 border border-stranger-red/50 p-6 rounded-lg backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <Users className="text-stranger-red" size={24} />
                        <h3 className="font-retro text-stranger-glow tracking-wider">ORGANIZERS</h3>
                    </div>
                    <p className="text-4xl font-bold text-stranger-red">{stats.totalOrganizers}</p>
                </div>
            </div>

            {/* Events List */}
            <div>
                <h2 className="text-2xl font-title text-retro-cyan mb-4">ALL_CAMPUS_EVENTS</h2>

                {events.length === 0 ? (
                    <div className="text-center py-12 border border-stranger-red/30 rounded-lg backdrop-blur-sm">
                        <p className="font-retro text-stranger-glow">NO_EVENTS_FOUND</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {events.map(event => (
                            <div
                                key={event._id}
                                className="bg-stranger-gray/20 border border-stranger-red/30 p-5 rounded-lg hover:border-retro-cyan/50 transition-all"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-bold text-stranger-red">{event.title}</h3>
                                            <span className={`text-xs font-retro ${getStatusColor(event.status)} uppercase`}>
                                                [{event.status}]
                                            </span>
                                        </div>

                                        <p className="text-stranger-glow mb-3 line-clamp-2">{event.description}</p>

                                        <div className="flex flex-wrap gap-4 text-sm text-stranger-glow font-retro">
                                            <div className="flex items-center gap-2">
                                                <Users size={16} className="text-retro-cyan" />
                                                <span>Organizer: {event.organizer?.name || 'Unknown'}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin size={16} className="text-retro-cyan" />
                                                <span>{event.location}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar size={16} className="text-retro-cyan" />
                                                <span>{new Date(event.timeline.start).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2 ml-4">
                                        <button
                                            onClick={() => handleEdit(event._id)}
                                            className="p-2 border border-retro-cyan/50 text-retro-cyan hover:bg-retro-cyan hover:text-black transition-all rounded"
                                            title="Edit Event"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(event._id, event.title)}
                                            className="p-2 border border-stranger-red/50 text-stranger-red hover:bg-stranger-red hover:text-white transition-all rounded"
                                            title="Delete Event"
                                        >
                                            <Trash2 size={18} />
                                        </button>
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

export default AdminDashboard;
