import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService, QuotaStatus } from '../services/api';
import { useAuth } from './AuthContext';

interface QuotaContextType {
    quota: QuotaStatus | null;
    isExhausted: boolean;
    refreshQuota: () => Promise<void>;
    loading: boolean;
}

const QuotaContext = createContext<QuotaContextType | undefined>(undefined);

export function QuotaProvider({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuth();
    const [quota, setQuota] = useState<QuotaStatus | null>(null);
    const [loading, setLoading] = useState(false);

    const refreshQuota = async () => {
        if (!isAuthenticated) {
            setQuota(null);
            return;
        }

        try {
            setLoading(true);
            const quotaData = await apiService.getQuotaStatus();
            setQuota(quotaData);

            // Store in localStorage for multi-tab sync
            localStorage.setItem('quota_data', JSON.stringify(quotaData));
        } catch (error) {
            console.error('Failed to fetch quota:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch quota on mount and when auth changes
    useEffect(() => {
        if (isAuthenticated) {
            refreshQuota();

            // Refresh quota every minute
            const interval = setInterval(refreshQuota, 60000);
            return () => clearInterval(interval);
        } else {
            setQuota(null);
        }
    }, [isAuthenticated]);

    // Listen for quota updates from other tabs
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'quota_data' && e.newValue) {
                try {
                    const quotaData = JSON.parse(e.newValue);
                    setQuota(quotaData);
                } catch (error) {
                    console.error('Failed to parse quota data from storage:', error);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const isExhausted = quota?.is_exhausted ?? false;

    return (
        <QuotaContext.Provider value={{ quota, isExhausted, refreshQuota, loading }}>
            {children}
        </QuotaContext.Provider>
    );
}

export function useQuota() {
    const context = useContext(QuotaContext);
    if (context === undefined) {
        throw new Error('useQuota must be used within a QuotaProvider');
    }
    return context;
}
