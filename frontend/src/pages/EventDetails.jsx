import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { MapPin, Calendar, Clock, ArrowLeft } from 'lucide-react';
import RegistrationModule from '../components/modules/RegistrationModule';
import VotingModule from '../components/modules/VotingModule';
import { getThemeStyle } from '../utils/themes';

const EventDetails = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await api.get(`/events/${id}`);
                setEvent(res.data);
            } catch (error) {
                console.error('Failed to fetch event', error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    if (loading) return <div className="text-center py-20 font-retro text-retro-amber animate-pulse">LOADING_PROTOCOL...</div>;
    if (!event) return <div className="text-center py-20">EVENT_NOT_FOUND</div>;

    // Resolve Theme
    const themePreset = event.themeConfig?.preset || 'retro';
    const theme = getThemeStyle(themePreset);

    return (
        <div className={`min-h-screen ${theme.colors.background} transition-colors duration-500`}>
            {/* Dynamic Background Effects */}
            {theme.effects.crt && (
                <>
                    <div className="fixed inset-0 pointer-events-none z-50 crt-overlay"></div>
                    <div className="fixed inset-0 pointer-events-none z-40 scanline"></div>
                </>
            )}

            <div className="container mx-auto px-4 py-8 relative z-10">
                <Link to="/events" className={`inline-flex items-center gap-2 ${theme.colors.secondary} hover:opacity-80 ${theme.fonts.body} text-xs mb-8 transition-colors`}>
                    <ArrowLeft size={14} /> RETURN_TO_FEED
                </Link>

                <div className={`${theme.colors.cardBg} border border-gray-800 rounded-lg overflow-hidden shadow-2xl`}>
                    <div className="p-8 md:p-12 border-b border-gray-800 relative overflow-hidden">
                        <div className={`absolute top-0 right-0 p-4 opacity-20 ${theme.fonts.title} text-9xl ${theme.colors.primary} select-none`}>
                            {themePreset.toUpperCase()}
                        </div>

                        <div className="relative z-10">
                            <span className={`inline-block px-3 py-1 rounded border ${theme.colors.accent} border-current bg-black/30 ${theme.fonts.body} text-xs tracking-widest mb-4`}>
                                {event.status.toUpperCase()}
                            </span>
                            <h1 className={`text-4xl md:text-6xl ${theme.fonts.title} ${theme.colors.primary} mb-6 ${theme.effects.glow}`}>
                                {event.title}
                            </h1>

                            <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${theme.fonts.body} text-sm text-gray-400`}>
                                <div className="flex items-center gap-3">
                                    <Calendar className={theme.colors.secondary} size={20} />
                                    <span>{new Date(event.timeline.start).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Clock className={theme.colors.secondary} size={20} />
                                    <span>{new Date(event.timeline.start).toLocaleTimeString()}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <MapPin className={theme.colors.secondary} size={20} />
                                    <span>{event.location}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
                        <div className="lg:col-span-2 space-y-8">
                            <div className="prose prose-invert max-w-none">
                                <h3 className={`${theme.fonts.title} ${theme.colors.accent} text-xl mb-4`}>ABOUT_EVENT</h3>
                                <p className={`${theme.fonts.body} text-gray-300 leading-relaxed whitespace-pre-wrap`}>
                                    {event.description}
                                </p>
                            </div>

                            {/* Dynamic Modules Rendering */}
                            <div className="space-y-6">
                                {event.modules?.map((module, index) => {
                                    if (module.type === 'registration') {
                                        return <RegistrationModule key={index} eventId={event._id} config={module.config} theme={theme} />;
                                    }
                                    if (module.type === 'voting') {
                                        return <VotingModule key={index} eventId={event._id} config={module.config} theme={theme} />;
                                    }
                                    return null;
                                })}
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            <div className={`p-6 border border-gray-800 rounded bg-black/20 ${theme.fonts.body}`}>
                                <h3 className={`${theme.colors.secondary} text-xs tracking-widest mb-4 border-b border-gray-800 pb-2`}>
                                    EVENT_DETAILS
                                </h3>
                                <div className="space-y-6">
                                    {/* Organizer Section */}
                                    <div>
                                        <div className="text-xs opacity-50 mb-1">ORGANIZER</div>
                                        <div className="text-gray-200 font-bold text-lg leading-tight mb-1">
                                            {event.organizer?.name || 'Unknown Log'}
                                        </div>
                                        <div className="text-xs text-gray-500 font-mono truncate">
                                            {event.organizer?.email}
                                        </div>
                                    </div>

                                    {/* Status Section */}
                                    <div>
                                        <div className="text-xs opacity-50 mb-2">STATUS</div>
                                        <div className={`inline-block px-2 py-1 rounded border ${theme.colors.accent} border-current bg-black/30 text-xs tracking-widest`}>
                                            {event.status.toUpperCase()}
                                        </div>
                                    </div>

                                    {/* Capacity Section */}
                                    <div>
                                        <div className="text-xs opacity-50 mb-1">CAPACITY</div>
                                        <div className="text-gray-200 font-mono text-xl">
                                            {event.modules?.find(m => m.type === 'registration')?.config?.limit || 'UNLIMITED'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;
