import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const FloatingOrbs = () => {
    const [orbs] = useState(() =>
        Array.from({ length: 8 }, (_, i) => ({
            id: i,
            size: Math.random() * 100 + 50,
            x: Math.random() * 100,
            y: Math.random() * 100,
            color: i % 2 === 0 ? 'rgba(0, 255, 255, 0.15)' : 'rgba(255, 0, 51, 0.15)',
            duration: Math.random() * 20 + 15,
        }))
    );

    return (
        <div className="fixed inset-0 pointer-events-none z-[3] overflow-hidden">
            {orbs.map(orb => (
                <motion.div
                    key={orb.id}
                    className="absolute rounded-full blur-3xl"
                    style={{
                        width: orb.size,
                        height: orb.size,
                        background: `radial-gradient(circle, ${orb.color}, transparent)`,
                        boxShadow: `0 0 ${orb.size}px ${orb.color}`,
                    }}
                    initial={{ x: `${orb.x}vw`, y: `${orb.y}vh` }}
                    animate={{
                        x: [`${orb.x}vw`, `${(orb.x + 30) % 100}vw`, `${orb.x}vw`],
                        y: [`${orb.y}vh`, `${(orb.y + 40) % 100}vh`, `${orb.y}vh`],
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: orb.duration,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            ))}
        </div>
    );
};

export default FloatingOrbs;
