'use client';

import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import { ArrowRight, Globe, Camera, Zap, Shield, Image as ImageIcon, CreditCard, BarChart2, Users } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#f2f4f7] bg-gradient-to-b from-purple-50 to-[#f2f4f7] text-slate-900 font-sans antialiased">
            <PublicHeader />
            <section className="pt-40 pb-20 px-6 max-w-4xl mx-auto">
                <span className="inline-block px-4 py-2 bg-purple-50 text-purple-600 rounded-full text-xs font-black uppercase tracking-widest mb-6">Our Story</span>
                <h1 className="text-5xl font-bold mb-8 leading-tight">We're on a mission to empower photographers.</h1>
                <p className="text-slate-500 text-lg mb-12 leading-relaxed">
                    Weey.NET was born out of the need for a truly integrated studio management system.
                    Our goal is to help you spend less time on admin and more time behind the lens.
                </p>

                <div className="grid md:grid-cols-2 gap-8 mb-20">
                    <div className="bg-white p-10 rounded-[40px] shadow-xl border border-white">
                        <Users className="w-10 h-10 text-purple-600 mb-6" />
                        <h3 className="text-xl font-bold mb-4">Customer Centric</h3>
                        <p className="text-slate-500 text-sm">We listen to our users and build features that solve real problems in photography business.</p>
                    </div>
                    <div className="bg-white p-10 rounded-[40px] shadow-xl border border-white">
                        <Shield className="w-10 h-10 text-blue-600 mb-6" />
                        <h3 className="text-xl font-bold mb-4">Top-tier Security</h3>
                        <p className="text-slate-500 text-sm">Your data and your clients' photos are stored with highest encryption standards.</p>
                    </div>
                </div>

                <div className="p-12 bg-black rounded-[50px] text-white text-center">
                    <h2 className="text-3xl font-bold mb-6">Ready to join our community?</h2>
                    <Link href="/register" className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-all">
                        Get Started <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>

            <PublicFooter />
        </div>
    );
}
