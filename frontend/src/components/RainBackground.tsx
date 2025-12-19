
import React, { useMemo, useState, useEffect } from 'react';
import './RainBackground.css';

const RainBackground = () => {
    const [angle, setAngle] = useState(91);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const x = e.clientX;
            const width = window.innerWidth;
            const percentage = x / width;

            // Calculate angle:
            // Left (0%) -> 110deg (Gentle Slant Left)
            // Center (50%) -> 90deg (Vertical)
            // Right (100%) -> 70deg (Gentle Slant Right)
            // Formula: 110 - (percentage * 40)
            const newAngle = 110 - (percentage * 40);
            setAngle(newAngle);
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    const drops = useMemo(() => {
        return Array.from({ length: 500 }).map((_, i) => {
            const opacity = Math.random() * 0.9;
            const left = Math.random() * 120; // 0 to 120vw
            const borderLeftWidth = Math.random() * 8 * 0.1; // 0 to 0.8vmin
            const duration = Math.random() * 1.0 + 1.0; // Random duration between 1s and 2s
            const delay = Math.random() * 25 * -0.5; // Random negative delay

            return (
                <div
                    key={i}
                    className="drop-wrapper"
                    style={{
                        left: `${left}vw`,
                        top: `-5vmin`,
                        // transform: `rotate(${angle}deg)`, // Removed: Handled by CSS variable on container
                    } as React.CSSProperties}
                >
                    <div
                        className="drop"
                        style={{
                            opacity,
                            borderLeftWidth: `${borderLeftWidth}vmin`,
                            animationDuration: `${duration}s`,
                            animationDelay: `${delay}s`
                        }}
                    />
                </div>
            );
        });
    }, []); // Removed angle dependency to prevent re-renders

    return (
        <div
            className="rain-container"
            style={{ '--angle': `${angle}deg`, zIndex: 0 } as React.CSSProperties}
        >
            <div className="rain">
                {drops}
            </div>
        </div>
    );
};

export default RainBackground;

