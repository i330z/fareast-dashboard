"use client";

import React, { useState } from 'react'
import { getAuth, signOut, sendPasswordResetEmail } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { app } from '@/lib/firebaseInit';

function DashboardPage() {
    const router = useRouter();
    const auth = getAuth(app);
    const [resetMsg, setResetMsg] = useState('');
    const [resetError, setResetError] = useState('');

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push('/sign-in');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handlePasswordReset = async () => {
        setResetMsg('');
        setResetError('');
        if (!auth.currentUser?.email) {
            setResetError('No user email found.');
            return;
        }
        try {
            await sendPasswordResetEmail(auth, auth.currentUser.email, {
                url: 'http://localhost:3000/sign-in' , handleCodeInApp: true });
            setResetMsg('Password reset email sent!');
        } catch (error) {
            setResetError('Failed to send reset email.');
        }
    };

    return (
        <div className='max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10 container'>
            <h1 className='text-2xl font-bold mb-4'>Dashboard</h1>
            
            <button
                onClick={handleLogout}
                className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition mr-4 cursor-pointer'
            >
                Logout
            </button>
            <button
                onClick={handlePasswordReset}
                className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition cursor-pointer'
            >
                Reset Password
            </button>
            {resetMsg && <div className="mt-4 text-green-600">{resetMsg}</div>}
            {resetError && <div className="mt-4 text-red-600">{resetError}</div>}
        </div>
    );
}

export default DashboardPage;