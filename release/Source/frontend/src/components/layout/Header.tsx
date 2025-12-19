import { AlertCircle } from 'lucide-react';

interface HeaderProps {
    backendConnected: boolean | null;
}

export default function Header({ backendConnected }: HeaderProps) {
    return (
        <div className="text-center mb-4 flex-shrink-0">
            <h1 className="text-4xl font-bold text-white mb-1">KodesCruxx</h1>
            <p className="text-lg text-gray-300">AI-Powered Coding Assistant</p>
            {backendConnected === false && (
                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 backdrop-blur-sm text-xs">
                    <AlertCircle className="w-3 h-3" />
                    <span>
                        Backend not connected. Please start the backend server: <code className="bg-red-900/30 px-1.5 py-0.5 rounded">uvicorn main:app --reload</code>
                    </span>
                </div>
            )}
            {backendConnected === true && (
                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/20 border border-green-500/50 rounded-lg text-green-200 backdrop-blur-sm text-xs">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Backend connected</span>
                </div>
            )}
        </div>
    );
}
