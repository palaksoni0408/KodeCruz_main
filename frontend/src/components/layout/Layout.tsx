import { ReactNode } from 'react';
import RainBackground from '../RainBackground';

interface LayoutProps {
    children: ReactNode;
    className?: string;
}

export default function Layout({ children, className = '' }: LayoutProps) {
    return (
        <div className={`relative min-h-screen overflow-x-hidden bg-slate-950 ${className}`}>
            <RainBackground />
            <div className="min-h-screen flex flex-col relative z-20">
                {children}
            </div>
        </div >
    );
}
