import { Code2, X, Eye, EyeOff, Mail, Lock, Github } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const { login, user } = useAuth();
    const [isLogin, setIsLogin] = useState(false); // Default to Sign Up per original image
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });

    const handleContinue = () => {
        if (!user) {
            const demoToken = 'demo-jwt-token-' + Date.now();
            login(demoToken);
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
            {/* Backdrop */}
            <div onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>

            {/* Modal Container - Split Layout */}
            <div className={`relative w-full max-w-5xl h-[600px] bg-[#0e0e0e] rounded-3xl shadow-2xl flex overflow-hidden transform transition-all duration-300 ${isOpen ? 'scale-100' : 'scale-95'}`}>

                {/* Close Button */}
                <button onClick={onClose} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors z-20 hover:bg-white/10 p-2 rounded-full">
                    <X className="w-5 h-5" />
                </button>

                {/* Left Side - Image Panel */}
                <div className="hidden md:block w-1/2 relative bg-zinc-900">
                    <div className="absolute inset-0">
                        <img
                            src="/images/bc0e3057-c73b-46a1-a617-dceb564857f0_800w.jpg"
                            alt="Auth Background"
                            className="w-full h-full object-cover"
                        />
                        {/* Gradient overlays for text readability */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20 mix-blend-overlay"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    </div>

                    {/* Quote Content */}
                    <div className="absolute bottom-12 left-12 right-12 z-10">
                        <blockquote className="text-2xl font-medium text-white mb-4 leading-relaxed">
                            "The best way to predict the future is to invent it."
                        </blockquote>
                        <div className="flex items-center gap-2 text-slate-400 text-sm font-mono tracking-wider uppercase">
                            <span className="w-4 h-px bg-slate-400"></span>
                            Built for builders
                        </div>
                    </div>
                </div>

                {/* Right Side - Auth Form */}
                <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto bg-[#0A0A0A]">
                    <div className="max-w-md mx-auto h-full flex flex-col justify-center">

                        {/* Header */}
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-8 h-8 rounded bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                                <Code2 className="text-white w-4 h-4" />
                            </div>
                            <span className="font-semibold tracking-tight text-white text-lg">KodesCruz</span>
                        </div>

                        {/* Title */}
                        <h2 className="text-2xl font-bold text-white mb-8">
                            {user ? "You're Logged In!" : (isLogin ? "Welcome back" : "Create account")}
                        </h2>

                        {/* Logged In Status Banner */}
                        {user && (
                            <div className="mb-8 bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                                <p className="text-green-400 font-medium mb-1">
                                    You're currently logged in as a demo user for local development.
                                </p>
                                <p className="text-slate-400 text-sm">
                                    Email: demo@kodescruz.local
                                </p>
                                <button
                                    onClick={handleContinue}
                                    className="mt-4 w-full bg-green-600 hover:bg-green-500 text-white font-medium rounded-lg py-2 transition-colors text-sm"
                                >
                                    Continue to Dashboard
                                </button>
                            </div>
                        )}

                        {/* Social Auth Buttons */}
                        <div className={`grid grid-cols-2 gap-4 mb-8 ${user ? 'opacity-50 pointer-events-none' : ''}`}>
                            <button
                                onClick={handleContinue}
                                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-sm font-medium transition-all"
                            >
                                <Github className="w-4 h-4" />
                                GitHub
                            </button>
                            <button
                                onClick={handleContinue}
                                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-sm font-medium transition-all"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Google
                            </button>
                        </div>

                        {/* Divider */}
                        <div className={`relative mb-8 ${user ? 'opacity-50' : ''}`}>
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-[#0A0A0A] px-2 text-slate-500">Or continue with</span>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={(e) => { e.preventDefault(); handleContinue(); }} className={`space-y-4 ${user ? 'opacity-50 pointer-events-none' : ''}`}>
                            {!isLogin && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-400">First name</label>
                                        <input
                                            type="text"
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                                            placeholder="John"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-400">Last name</label>
                                        <input
                                            type="text"
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                                            placeholder="Doe"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400">Email address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                                        placeholder="name@company.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                                        placeholder="Create a password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {!isLogin && <p className="text-xs text-slate-500">Must be at least 8 characters.</p>}
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-[#EA4335] hover:bg-[#d33828] text-white font-semibold rounded-lg py-3 transition-colors shadow-lg shadow-orange-900/20 active:scale-[0.98] transform"
                            >
                                {isLogin ? 'Log in' : 'Create Account'}
                            </button>
                        </form>

                        {/* Toggle Mode */}
                        <div className={`mt-6 text-center text-sm text-slate-500 ${user ? 'opacity-50 pointer-events-none' : ''}`}>
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-orange-500 hover:text-orange-400 font-medium transition-colors"
                            >
                                {isLogin ? 'Sign up' : 'Log in'}
                            </button>
                        </div>

                        {/* Legal */}
                        <div className="mt-8 text-center">
                            <p className="text-xs text-slate-600">
                                By continuing, you agree to our Terms and Privacy Policy.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
