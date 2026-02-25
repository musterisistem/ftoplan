'use client';

import Link from 'next/link';
import { Calendar, Clock, MapPin, CheckCircle, ArrowRight, MousePointer, ShieldCheck } from 'lucide-react';

import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';

export default function AppointmentPage() {
    return (
        <div className="min-h-screen bg-[#FDFCFE] text-slate-900 font-sans antialiased">
            <PublicHeader />
            <section className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row items-center gap-20">
                    <div className="lg:w-1/2">
                        <span className="inline-block px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black uppercase tracking-widest mb-6">Booking Flow</span>
                        <h1 className="text-5xl font-bold mb-8 leading-tight">Effortless booking for your clients.</h1>
                        <p className="text-slate-500 text-lg mb-12">No more back-and-forth emails. Set your availability and let the system handle the rest.</p>

                        <div className="space-y-8">
                            {[
                                { title: 'Dynamic Calendar', desc: 'Sync with Google or Outlook to avoid double bookings.', icon: <Calendar className="w-6 h-6" /> },
                                { title: 'Instant Confirmation', desc: 'Clients get automated confirmation after booking.', icon: <CheckCircle className="w-6 h-6" /> },
                                { title: 'Deposit Integration', desc: 'Secure the session by taking online deposits.', icon: <ShieldCheck className="w-6 h-6" /> }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700 shrink-0">{item.icon}</div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-lg">{item.title}</h4>
                                        <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:w-1/2 w-full">
                        <div className="bg-white p-12 rounded-[60px] shadow-2xl border border-white relative">
                            <div className="absolute -top-10 -right-10 w-24 h-24 bg-purple-100 rounded-full blur-2xl opacity-50" />
                            <div className="space-y-6">
                                <div className="h-12 bg-slate-50 rounded-2xl w-2/3" />
                                <div className="grid grid-cols-4 gap-3">
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <div key={i} className="h-14 bg-slate-50 rounded-2xl" />)}
                                </div>
                                <div className="h-32 bg-slate-50 rounded-2xl w-full" />
                                <div className="w-full py-5 bg-black text-white rounded-2xl flex items-center justify-center gap-2 font-bold select-none cursor-default opacity-50">
                                    <MousePointer className="w-4 h-4" /> System Demo
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-40 text-center">
                    <h2 className="text-4xl font-bold mb-10">Stop chasing emails. <br /> Start taking bookings.</h2>
                    <Link href="/register" className="bg-black text-white px-10 py-5 rounded-3xl font-bold shadow-2xl hover:scale-105 transition-all">
                        Create Your System Now
                    </Link>
                </div>
            </section>

            <PublicFooter />
        </div>
    );
}
