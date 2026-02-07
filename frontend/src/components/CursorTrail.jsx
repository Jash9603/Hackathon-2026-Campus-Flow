import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CursorTrail = () => {
    const [trails, setTrails] = useState([]);

    useEffect(() => {
        let timeoutId;

        const handleMouseMove = (e) => {
            const newTrail = {
                id: Date.now(),
                x: e.clientX,
                y: e.clientY,
            };

            setTrails(prev => [...prev.slice(-10), newTrail]);

            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                setTrails(prev => prev.slice(1));
            }, 100);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            clearTimeout(timeoutId);
        };
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-[60]">
            {trails.map((trail, index) => (
                <motion.div
                    key={trail.id}
                    initial={{ opacity: 0.8, scale: 1 }}
                    animate={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.5 }}
                    style={{
                        position: 'absolute',
                        left: trail.x,
                        top: trail.y,
                        width: '8px',
                        height: '8px',
                        background: `radial-gradient(circle, rgba(0,255,255,${0.8 - index * 0.08}) 0%, transparent 70%)`,
                        borderRadius: '50%',
                        transform: 'translate(-50%, -50%)',
                        boxShadow: '0 0 10px rgba(0,255,255,0.5)',
                    }}
                />
            ))}
        </div>
    );
};

export default CursorTrail;
