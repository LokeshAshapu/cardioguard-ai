import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ShieldCheck, HeartPulse, ArrowRight } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full bg-slate-50 dark:bg-bgDark z-0">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute bottom-[10%] right-[-5%] w-96 h-96 bg-accent/20 rounded-full blur-3xl opacity-50"></div>
            </div>

            {/* Navbar */}
            <nav className="relative z-10 flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <Activity className="text-primary w-8 h-8" />
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-rose-600">CardioGuard AI</h1>
                </div>
                <div className="flex gap-4">
                    <Link to="/login" className="px-5 py-2.5 rounded-xl font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-all">
                        Login
                    </Link>
                    <Link to="/register" className="px-5 py-2.5 rounded-xl font-medium bg-primary text-white shadow-lg shadow-primary/30 hover:scale-105 transition-all">
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 mt-16 flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1 space-y-8">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold tracking-wide border border-primary/20">
                        AI-POWERED HEALTH PROTECTION
                    </span>
                    <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
                        Predict Health Risks <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-rose-500">Before They Happen</span>
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
                        CardioGuard AI analyzes your vitals, symptoms, and medical history to predict heart attacks, strokes, and diabetic emergencies with clinical precision.
                    </p>
                    <div className="flex gap-4 pt-4">
                        <Link to="/register" className="group flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-rose-600 text-white font-bold text-lg shadow-xl shadow-primary/25 hover:shadow-2xl hover:scale-[1.02] transition-all">
                            Check My Risk Now
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                {/* Hero Visual Mockup */}
                <div className="flex-1 relative">
                    <div className="relative z-10 glass-panel p-6 border border-white/20">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-xl font-bold">Your Risk Analysis</h3>
                                <p className="text-sm text-slate-500">Live Prediction</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <HeartPulse className="text-primary w-6 h-6 animate-pulse" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-100 dark:border-white/10">
                                <div className="flex justify-between mb-2">
                                    <span className="text-slate-500">Heart Attack Risk</span>
                                    <span className="text-primary font-bold">Low (12%)</span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                                    <div className="bg-primary h-full w-[12%]"></div>
                                </div>
                            </div>

                            <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-100 dark:border-white/10">
                                <div className="flex justify-between mb-2">
                                    <span className="text-slate-500">Stroke Probability</span>
                                    <span className="text-amber-500 font-bold">Medium (45%)</span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                                    <div className="bg-amber-500 h-full w-[45%]"></div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex gap-3">
                            <div className="flex-1 bg-green-500/10 p-3 rounded-lg flex items-center justify-center gap-2 text-green-500 text-sm font-semibold border border-green-500/20">
                                <ShieldCheck className="w-4 h-4" /> Stable
                            </div>
                        </div>
                    </div>
                    {/* Decorative Elements */}
                    <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-rose-500 rounded-full blur-2xl opacity-40"></div>
                </div>
            </main>
        </div>
    );
};

export default LandingPage;
