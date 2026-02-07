import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import EventCard from '../components/EventCard';
import { Search } from 'lucide-react';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, ongoing, upcoming

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await api.get('/events');
                setEvents(res.data);
            } catch (error) {
                console.error('Failed to fetch events', error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const filteredEvents = events.filter(event => {
        if (filter === 'all') return true;
        if (filter === 'ongoing') return event.status === 'ongoing';
        // simple check for upcoming
        if (filter === 'upcoming') return new Date(event.timeline.start) > new Date();
        return true;
    });

    return (
        <div className="min-h-screen">
            <header className="mb-12 flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <h1 className="text-4xl font-title text-stranger-red text-glow">EVENT_LOGS</h1>
                    <p className="font-retro text-gray-500 text-xs mt-2 tracking-widest">
                        &gt; DECRYPTING SECURE CHANNELS...
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-black/60 p-2 border border-gray-800 rounded">
                    <Search size={18} className="text-gray-500" />
                    <input
                        type="text"
                        placeholder="SEARCH_QUERY..."
                        className="bg-transparent border-none outline-none text-retro-cyan font-mono text-sm w-48"
                    />
                </div>
            </header>

            {/* Filters */}
            <div className="flex gap-4 mb-8 border-b border-gray-800 pb-4 overflow-x-auto">
                {['all', 'ongoing', 'upcoming'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`font-retro text-xs px-4 py-2 border transition-all tracking-widest uppercase ${filter === f
                            ? 'border-stranger-red text-stranger-red bg-stranger-red/10'
                            : 'border-transparent text-gray-500 hover:text-gray-300'
                            }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="text-center py-20">
                    <div className="inline-block w-4 h-4 bg-stranger-red animate-ping rounded-full mr-2"></div>
                    <span className="font-retro text-stranger-red text-sm animate-pulse">LOADING_DATA_STREAMS...</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredEvents.length > 0 ? (
                        filteredEvents.map(event => (
                            <EventCard key={event._id} event={event} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 text-gray-600 font-mono">
                            &gt; NO_RECORDS_FOUND
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Events;
