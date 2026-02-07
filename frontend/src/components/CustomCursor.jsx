import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CustomCursor = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isPointer, setIsPointer] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setPosition({ x: e.clientX, y: e.clientY });

            const target = e.target;
            setIsPointer(
                target.tagName === 'BUTTON' ||
                target.tagName === 'A' ||
                target.onclick ||
                window.getComputedStyle(target).cursor === 'pointer'
            );
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <>
            {/* Main cursor dot */}
            <motion.div
                className="fixed pointer-events-none z-[100]"
                animate={{
                    x: position.x - 6,
                    y: position.y - 6,
                    scale: isPointer ? 1.5 : 1
                }}
                transition={{ type: "spring", stiffness: 500, damping: 28 }}
                style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(0, 255, 255, 0.8)',
                    boxShadow: '0 0 20px rgba(0, 255, 255, 0.6)',
                }}
            />

            {/* Outer ring */}
            <motion.div
                className="fixed pointer-events-none z-[100]"
                animate={{
                    x: position.x - 20,
                    y: position.y - 20,
                    scale: isPointer ? 1.5 : 1
                }}
                transition={{ type: "spring", stiffness: 150, damping: 15 }}
                style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    border: '2px solid rgba(0, 255, 255, 0.3)',
                    boxShadow: '0 0 10px rgba(0, 255, 255, 0.2)',
                }}
            />
        </>
    );
};

export default CustomCursor;
