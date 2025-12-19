import { useEffect, useState } from 'react';

export default function CustomCursor() {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isPointer, setIsPointer] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });

            const target = e.target as HTMLElement;
            setIsPointer(
                window.getComputedStyle(target).cursor === 'pointer' ||
                target.tagName.toLowerCase() === 'button' ||
                target.tagName.toLowerCase() === 'a'
            );
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <>
            <div
                className="fixed top-0 left-0 w-2 h-2 bg-brand-orange rounded-full pointer-events-none z-[9999] mix-blend-difference transition-transform duration-75"
                style={{
                    transform: `translate(${position.x - 4}px, ${position.y - 4}px)`
                }}
            />
            <div
                className={`fixed top-0 left-0 w-8 h-8 border border-brand-orange/30 rounded-full pointer-events-none z-[9998] transition-all duration-300 ease-out ${isPointer ? 'scale-150 bg-brand-orange/10 border-brand-orange/50' : 'scale-100'
                    }`}
                style={{
                    transform: `translate(${position.x - 16}px, ${position.y - 16}px)`
                }}
            />
        </>
    );
}
