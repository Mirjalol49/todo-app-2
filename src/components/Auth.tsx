import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Check, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Auth() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.signInWithOtp({ email });

        if (error) {
            alert(error.message);
        } else {
            setSent(true);
        }
        setLoading(false);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-900/5 sm:p-10">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                        Welcome back
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Sign in via magic link with your email below
                    </p>
                </div>

                <AnimatePresence mode="wait">
                    {sent ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex flex-col items-center justify-center space-y-4 rounded-lg bg-green-50 p-6 text-center"
                        >
                            <div className="rounded-full bg-green-100 p-3">
                                <Check className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="text-lg font-medium text-green-900">Check your email</h3>
                            <p className="text-sm text-green-700">
                                We've sent a magic link to <span className="font-semibold">{email}</span>
                            </p>
                            <Button
                                variant="ghost"
                                onClick={() => setSent(false)}
                                className="text-green-700 hover:bg-green-100 hover:text-green-800"
                            >
                                Use a different email
                            </Button>
                        </motion.div>
                    ) : (
                        <motion.form
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="mt-8 space-y-6"
                            onSubmit={handleLogin}
                        >
                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email address
                                </label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                size="lg"
                                isLoading={loading}
                            >
                                Send Magic Link
                            </Button>
                        </motion.form>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
