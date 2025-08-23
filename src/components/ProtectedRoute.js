'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.replace('/sign-in'); // redirect to login if unauthenticated
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return <div className="p-4 text-center">Loading...</div>;
    }

    return children;
};

export default ProtectedRoute;
