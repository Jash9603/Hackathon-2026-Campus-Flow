import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ThunderEffect = () => {
    const [strikes, setStrikes] = useState([]);
    const [flash, setFlash] = useState(false);

    useEffect(() => {
        const createThunderStrike = () => {
            // Create branching lightning bolt
            const startX = Math.random() * window.innerWidth;
            const segments = [];

            let currentX = startX;
            let currentY = 0;
            const numSegments = 8 + Math.floor(Math.random() * 6);

            for (let i = 0; i < numSegments; i++) {
                const nextX = currentX + (Math.random() - 0.5) * 100;
                const nextY = currentY + (window.innerHeight / numSegments);

                segments.push({
                    x1: currentX,
                    y1: currentY,
                    x2: nextX,
                    y2: nextY,
                });

                // Add branches (30% chance per segment)
                if (Math.random() > 0.7 && i > 2) {
                    const branchX = nextX + (Math.random() - 0.5) * 150;
                    const branchY = nextY + 100;
                    segments.push({
                        x1: nextX,
                        y1: nextY,
                        x2: branchX,
                        y2: branchY,
                        isBranch: true,
                    });
                }

                currentX = nextX;
                currentY = nextY;
            }

            const newStrike = {
                id: Date.now(),
                segments,
                color: Math.random() > 0.3 ? '#00ffff' : '#ff0033',
            };

            setStrikes(prev => [...prev, newStrike]);

            // Screen flash
            setFlash(true);
            setTimeout(() => setFlash(false), 100);

            setTimeout(() => {
                setStrikes(prev => prev.filter(s => s.id !== newStrike.id));
            }, 400);
        };

        const interval = setInterval(() => {
            if (Math.random() > 0.5) { // 35% chance - more frequent
                createThunderStrike();

                // Sometimes create double strike
                if (Math.random() > 0.5) {
                    setTimeout(createThunderStrike, 150);
                }
            }
        }, 1500); // Check every 1.5 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            {/* Screen Flash */}
            <AnimatePresence>
                {flash && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.3, 0] }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="fixed inset-0 pointer-events-none z-[45] bg-white mix-blend-screen"
                    />
                )}
            </AnimatePresence>

            {/* Lightning Bolts */}
            <div className="fixed inset-0 pointer-events-none z-[15] overflow-hidden">
                <AnimatePresence>
                    {strikes.map(strike => (
                        <motion.svg
                            key={strike.id}
                            className="absolute inset-0 w-full h-full"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 1, 0.8, 0] }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <defs>
                                <filter id={`glow-${strike.id}`}>
                                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                                    <feMerge>
                                        <feMergeNode in="coloredBlur" />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                            </defs>

                            {strike.segments.map((segment, idx) => (
                                <g key={idx}>
                                    {/* Glow layer */}
                                    <line
                                        x1={segment.x1}
                                        y1={segment.y1}
                                        x2={segment.x2}
                                        y2={segment.y2}
                                        stroke={strike.color}
                                        strokeWidth={segment.isBranch ? "4" : "6"}
                                        strokeLinecap="round"
                                        opacity="0.6"
                                        filter={`url(#glow-${strike.id})`}
                                    />
                                    {/* Core bolt */}
                                    <line
                                        x1={segment.x1}
                                        y1={segment.y1}
                                        x2={segment.x2}
                                        y2={segment.y2}
                                        stroke="white"
                                        strokeWidth={segment.isBranch ? "1" : "2"}
                                        strokeLinecap="round"
                                    />
                                </g>
                            ))}
                        </motion.svg>
                    ))}
                </AnimatePresence>
            </div>
        </>
    );
};

export default ThunderEffect;
