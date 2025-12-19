import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Check, Mail, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Auth() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: window.location.origin,
            }
        });

        if (error) {
            alert(error.message);
        } else {
            setSent(true);
        }
        setLoading(false);
    };

    return (
        <div className="flex min-h-screen w-full flex-col lg:flex-row bg-white">
            {/* Left Panel - Hero/Branding */}
            <div className="relative flex w-full flex-col justify-between bg-zinc-900 p-8 text-white lg:w-1/2 lg:p-12 xl:w-5/12">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 -left-1/4 h-full w-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-500/30 via-transparent to-transparent opacity-60 blur-3xl" />
                    <div className="absolute bottom-0 -right-1/4 h-full w-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-500/30 via-transparent to-transparent opacity-60 blur-3xl" />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
                            <Sparkles className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">FocusFlow</span>
                    </div>
                </div>

                <div className="relative z-10 mt-16 lg:mt-0">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                        Master your day, <br />
                        <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                            gamify your life.
                        </span>
                    </h1>
                    <p className="mt-6 text-lg text-zinc-400 leading-relaxed max-w-lg">
                        Experience a new way to stay productive. Earn points, unlock badges, and
                        build consistent habits with a beautifully designed todo app.
                    </p>
                </div>

                <div className="relative z-10 mt-12 hidden lg:block">
                    <blockquote className="border-l-2 border-zinc-700 pl-6 italic text-zinc-500">
                        "The secret of getting ahead is getting started."
                    </blockquote>
                </div>
            </div>

            {/* Right Panel - Auth Form */}
            <div className="flex w-full items-center justify-center bg-white p-6 lg:w-1/2 lg:p-12 xl:w-7/12">
                <div className="w-full max-w-sm space-y-8">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                            Get started
                        </h2>
                        <p className="mt-2 text-sm text-gray-500">
                            Sign in securely via magic link
                        </p>
                    </div>

                    <AnimatePresence mode="wait">
                        {sent ? (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="flex flex-col items-center justify-center rounded-2xl bg-green-50 p-8 text-center ring-1 ring-green-900/5 lg:items-start lg:text-left">
                                    <div className="mb-4 rounded-full bg-green-100 p-3">
                                        <Check className="h-6 w-6 text-green-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-green-900">Check your email</h3>
                                    <p className="mt-1 text-sm text-green-700">
                                        We've sent a login link to <span className="font-bold">{email}</span>. Click it to enter.
                                    </p>
                                </div>

                                <Button
                                    variant="ghost"
                                    onClick={() => setSent(false)}
                                    className="w-full border border-gray-200 text-gray-600 hover:text-gray-900"
                                >
                                    <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
                                    Back to login
                                </Button>
                            </motion.div>
                        ) : (
                            <motion.form
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onSubmit={handleLogin}
                                className="mt-8 space-y-6"
                            >
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                            Email address
                                        </label>
                                        <div className="relative group">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                                                <Mail className="h-5 w-5" />
                                            </div>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                autoComplete="email"
                                                required
                                                placeholder="you@company.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="pl-10 h-12 rounded-xl border-gray-200 bg-gray-50 transition-all font-medium focus:bg-white focus:ring-indigo-500/20"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-12 rounded-xl bg-gray-900 text-white shadow-xl shadow-gray-900/10 hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all"
                                    isLoading={loading}
                                >
                                    {loading ? "Sending..." : "Send Magic Link"}
                                    {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                                </Button>

                                <p className="text-center text-xs text-gray-400">
                                    By clicking connect, you agree to our Terms of Service and Privacy Policy.
                                </p>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
