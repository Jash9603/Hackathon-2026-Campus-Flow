import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Twitter, Bell } from 'lucide-react';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

const socket = io('http://localhost:5000', {
    transports: ['websocket'],
    autoConnect: true,
});

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        socket.on('connect', () => {
            console.log('> UPLINK ESTABLISHED. SOCKET_ID:', socket.id);
        });

        socket.on('new_event', (event) => {
            addNotification(`NEW_EVENT_DETECTED: ${event.title}`, 'info');
        });

        // Add more socket listeners here

        return () => {
            socket.off('connect');
            socket.off('new_event');
        };
    }, []);

    const addNotification = (message, type = 'info') => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message, type }]);

        // Auto remove after 5s
        setTimeout(() => {
            removeNotification(id);
        }, 5000);
    };

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    return (
        <NotificationContext.Provider value={{ addNotification }}>
            {children}

            {/* Toast Container */}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
                {notifications.map(n => (
                    <div
                        key={n.id}
                        className="bg-black/80 border border-retro-amber text-retro-amber p-4 rounded shadow-[0_0_15px_rgba(255,191,0,0.3)] animate-slide-in pointer-events-auto flex items-center gap-3 backdrop-blur-md min-w-[300px]"
                    >
                        <Bell size={18} className="animate-pulse" />
                        <div>
                            <h4 className="font-retro text-xs font-bold tracking-widest text-stranger-glow">INCOMING_TRANSMISSION</h4>
                            <p className="font-mono text-sm">{n.message}</p>
                        </div>
                    </div>
                ))}
            </div>
        </NotificationContext.Provider>
    );
};
