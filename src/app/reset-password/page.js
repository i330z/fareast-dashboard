// /pages/reset-password.js
"use client";
import { useEffect, useState } from 'react';
import { getAuth, verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth';
import { useSearchParams } from 'next/navigation'; // or useLocation() in React Router
import { app } from '@/lib/firebaseInit'; // Ensure firebase is initialized
export default function ResetPassword() {
    const [verifiedEmail, setVerifiedEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const searchParams = useSearchParams();

    const oobCode = searchParams.get('oobCode');

    useEffect(() => {
        if (oobCode) {
            const auth = getAuth(app);
            verifyPasswordResetCode(auth, oobCode)
                .then(email => {
                    setVerifiedEmail(email);
                })
                .catch(err => {
                    setError('Invalid or expired reset code.');
                });
        }
    }, [oobCode]);

    const handleReset = async () => {
        const auth = getAuth(app);
        try {
            await confirmPasswordReset(auth, oobCode, newPassword);
            setSuccess('Password reset successful. You can now log in.');
        } catch (err) {
            setError('Failed to reset password.');
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto">
            <h1 className="text-xl font-bold mb-4">Reset Your Password</h1>
            {error && <p className="text-red-500">{error}</p>}
            {success ? (
                <p className="text-green-600">{success}</p>
            ) : verifiedEmail ? (
                <>
                    <p>Resetting password for <strong>{verifiedEmail}</strong></p>
                    <input
                        type="password"
                        placeholder="Enter new password"
                        className="border p-2 w-full my-4"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button
                        onClick={handleReset}
                        className="bg-blue-600 text-white py-2 px-4 rounded"
                    >
                        Reset Password
                    </button>
                </>
            ) : (
                <p>Verifying reset link...</p>
            )}
        </div>
    );
}
