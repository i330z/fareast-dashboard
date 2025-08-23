"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { app } from '@/lib/firebaseInit'; // Ensure firebase is initialized


const auth = getAuth(app);

export default function SignUpPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const router = useRouter();
    
    const handleSignUp = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            setSuccess('Account created successfully!');
            setEmail('');
            setPassword('');
            router.push('/dashboard'); // Redirect to dashboard after successful sign-up
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-md mt-10">
            <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
            <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Email:</label>
                    <input
                        type="email"
                        value={email}
                        required
                        onChange={e => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Password:</label>
                    <input
                        type="password"
                        value={password}
                        required
                        onChange={e => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
                >
                    Sign Up
                </button>
            </form>
            {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
            {success && <p className="text-green-600 mt-4 text-center">{success}</p>}
        </div>
    );
}