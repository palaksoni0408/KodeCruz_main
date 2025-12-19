import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
    id: string;
    email: string;
    username?: string;
    first_name?: string;
    last_name?: string;
    is_active?: boolean;
    is_verified?: boolean;
    auth_provider?: string;
}

interface AuthContextType {
    user: User | null;
    login: (token: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo user for local development
const DEMO_USER: User = {
    id: 'demo-user-123',
    email: 'demo@kodescruxx.local',
    username: 'demo_user',
    first_name: 'Demo',
    last_name: 'User',
    is_active: true,
    is_verified: true,
    auth_provider: 'local',
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Check if user was previously logged in
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // If token exists, restore the demo user session
            setUser(DEMO_USER);
        }
        setLoading(false);
    }, []);

    const login = (token: string) => {
        localStorage.setItem('token', token);
        setUser(DEMO_USER);
    };

    const logout = async () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            isAuthenticated: !!user,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
