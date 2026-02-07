import React, { useRef, useEffect } from 'react';

const GridBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let offset = 0;

        const drawGrid = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const gridSize = 50;
            const perspective = 0.5; // Creates depth effect

            ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
            ctx.lineWidth = 1;

            // Vertical lines
            for (let x = -gridSize; x < canvas.width + gridSize; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, canvas.height);
                ctx.lineTo(x + (x - canvas.width / 2) * perspective, 0);
                ctx.stroke();
            }

            // Horizontal lines (moving towards viewer)
            for (let y = 0; y < canvas.height; y += gridSize) {
                const yPos = y + offset;
                const alpha = 0.05 + (y / canvas.height) * 0.15;
                ctx.strokeStyle = `rgba(0, 255, 255, ${alpha})`;

                ctx.beginPath();
                ctx.moveTo(0, yPos % canvas.height);
                ctx.lineTo(canvas.width, yPos % canvas.height);
                ctx.stroke();
            }

            // Glow lines (accent lines)
            ctx.strokeStyle = 'rgba(255, 0, 51, 0.2)';
            ctx.lineWidth = 2;
            const glowY = (canvas.height / 2 + offset * 2) % canvas.height;
            ctx.beginPath();
            ctx.moveTo(0, glowY);
            ctx.lineTo(canvas.width, glowY);
            ctx.stroke();

            offset += 0.5;
            requestAnimationFrame(drawGrid);
        };

        drawGrid();

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[5] opacity-40"
            style={{ background: 'transparent' }}
        />
    );
};

export default GridBackground;
