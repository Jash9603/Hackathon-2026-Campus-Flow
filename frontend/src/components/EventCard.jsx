import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const EventCard = ({ event }) => {
    const { _id, title, description, timeline, location, themeConfig, status } = event;

    const startDate = new Date(timeline.start).toLocaleDateString();
    const startTime = new Date(timeline.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className="bg-black/80 border border-gray-700 hover:border-stranger-red transition-all duration-300 rounded-lg overflow-hidden group shadow-[0_0_10px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(255,0,51,0.4)]"
        >
            {/* Dynamic Header Color based on themeConfig or default */}
            <div
                className="h-2 bg-stranger-red group-hover:animate-pulse"
                style={{ backgroundColor: themeConfig?.primaryColor }}
            ></div>

            <div className="p-6 relative">
                {/* Status Badge */}
                <span className={`absolute top-4 right-4 text-[10px] font-retro px-2 py-1 border ${status === 'ongoing' ? 'border-green-500 text-green-500 animate-pulse' :
                    status === 'published' ? 'border-retro-cyan text-retro-cyan' : 'border-gray-500 text-gray-500'
                    }`}>
                    {status.toUpperCase()}
                </span>

                <h3 className="text-xl font-bold font-title text-gray-200 group-hover:text-stranger-glow transition-colors mb-4 line-clamp-1">
                    {title}
                </h3>

                <div className="space-y-2 text-sm text-gray-400 font-mono mb-6">
                    <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-stranger-red" />
                        <span>{startDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock size={14} className="text-stranger-red" />
                        <span>{startTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-stranger-red" />
                        <span className="line-clamp-1">{location}</span>
                    </div>
                </div>

                <p className="text-gray-500 text-sm line-clamp-2 mb-6">
                    {description}
                </p>

                <Link
                    to={`/events/${_id}`}
                    className="block w-full text-center py-2 border border-gray-600 text-gray-400 font-retro text-xs group-hover:border-stranger-red group-hover:text-stranger-red group-hover:bg-stranger-red/10 transition-all tracking-widest"
                >
                    ACCESS_DATA
                </Link>
            </div>
        </motion.div>
    );
};

export default EventCard;
