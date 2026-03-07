// app/welcome/page.js
'use client';

import Link from 'next/link';
import { BookOpen, Eye, MessageSquare, ArrowRight, Sparkles, Zap, Shield } from 'lucide-react';

export default function WelcomePage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 animate-fadeUp">
            <div className="max-w-6xl mx-auto w-full">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#7c6aff]/10 border border-[#7c6aff]/30 rounded-full mb-6 text-sm">
                        <Sparkles className="w-4 h-4 text-[#7c6aff]" />
                        <span className="text-[#7c6aff] font-medium">AI-Powered Research Assistant</span>
                    </div>
                    
                    <h1 className="text-6xl md:text-7xl font-bold nav-text mb-6 tracking-tight">
                        <span className="text-[#7c6aff]">Paper</span>IQ
                    </h1>
                    
                    <p className="text-xl md:text-2xl text-[#666680] max-w-3xl mx-auto mb-8 leading-relaxed">
                        Your personal AI decoder for dense research papers. Understand complex studies at any level, visualize intricate diagrams, and get instant answers.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link 
                            href="/register" 
                            className="px-8 py-4 bg-[#7c6aff] hover:bg-[#6855ea] text-white rounded-xl font-semibold transition-all hover:scale-105 flex items-center gap-2 text-lg"
                        >
                            Get Started Free
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        
                        <Link 
                            href="/login" 
                            className="px-8 py-4 border-2 border-[#2a2a3a] hover:border-[#7c6aff] text-[#e8e8f0] rounded-xl font-semibold transition-all"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    <div className="bg-[#1a1a24] border border-[#2a2a3a] rounded-2xl p-8 hover:border-[#7c6aff] transition-all group">
                        <div className="w-14 h-14 rounded-xl bg-[#7c6aff]/10 flex items-center justify-center mb-6 group-hover:bg-[#7c6aff] transition-colors">
                            <BookOpen className="w-7 h-7 text-[#7c6aff] group-hover:text-white transition-colors" />
                        </div>
                        <h3 className="text-2xl font-bold nav-text mb-3 text-[#e8e8f0]">ELIF Summarizer</h3>
                        <p className="text-[#666680] leading-relaxed">
                            Get paper summaries tailored to your expertise level — from high school to PhD researcher. Complex research, explained your way.
                        </p>
                    </div>

                    <div className="bg-[#1a1a24] border border-[#2a2a3a] rounded-2xl p-8 hover:border-[#ff6a9e] transition-all group">
                        <div className="w-14 h-14 rounded-xl bg-[#ff6a9e]/10 flex items-center justify-center mb-6 group-hover:bg-[#ff6a9e] transition-colors">
                            <Eye className="w-7 h-7 text-[#ff6a9e] group-hover:text-white transition-colors" />
                        </div>
                        <h3 className="text-2xl font-bold nav-text mb-3 text-[#e8e8f0]">ScholarSight</h3>
                        <p className="text-[#666680] leading-relaxed">
                            Decode charts, equations, and diagrams instantly. Turn confusing visuals into crystal-clear explanations with AI vision.
                        </p>
                    </div>

                    <div className="bg-[#1a1a24] border border-[#2a2a3a] rounded-2xl p-8 hover:border-[#4ade80] transition-all group">
                        <div className="w-14 h-14 rounded-xl bg-[#4ade80]/10 flex items-center justify-center mb-6 group-hover:bg-[#4ade80] transition-colors">
                            <MessageSquare className="w-7 h-7 text-[#4ade80] group-hover:text-black transition-colors" />
                        </div>
                        <h3 className="text-2xl font-bold nav-text mb-3 text-[#e8e8f0]">Smart Chat</h3>
                        <p className="text-[#666680] leading-relaxed">
                            Ask questions about methodology, results, or limitations. Get instant, cited answers from your research papers.
                        </p>
                    </div>
                </div>

                {/* Benefits */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-[#7c6aff]/10 flex items-center justify-center shrink-0">
                            <Zap className="w-5 h-5 text-[#7c6aff]" />
                        </div>
                        <div>
                            <h4 className="font-bold text-[#e8e8f0] mb-2">Lightning Fast</h4>
                            <p className="text-sm text-[#666680]">Powered by Google's Gemini 1.5 Flash for instant analysis</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-[#4ade80]/10 flex items-center justify-center shrink-0">
                            <Shield className="w-5 h-5 text-[#4ade80]" />
                        </div>
                        <div>
                            <h4 className="font-bold text-[#e8e8f0] mb-2">Private & Secure</h4>
                            <p className="text-sm text-[#666680]">Your papers stay private. No data stored permanently</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-[#ff6a9e]/10 flex items-center justify-center shrink-0">
                            <Sparkles className="w-5 h-5 text-[#ff6a9e]" />
                        </div>
                        <div>
                            <h4 className="font-bold text-[#e8e8f0] mb-2">Always Learning</h4>
                            <p className="text-sm text-[#666680]">Advanced AI that understands academic language</p>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="bg-gradient-to-r from-[#7c6aff]/10 to-[#ff6a9e]/10 border border-[#7c6aff]/30 rounded-2xl p-12 text-center">
                    <h2 className="text-3xl font-bold nav-text mb-4">Ready to decode research?</h2>
                    <p className="text-[#666680] mb-8 max-w-2xl mx-auto">
                        Join researchers, students, and professionals using PaperIQ to understand complex papers faster.
                    </p>
                    <Link 
                        href="/register" 
                        className="inline-flex items-center gap-2 px-8 py-4 bg-[#7c6aff] hover:bg-[#6855ea] text-white rounded-xl font-semibold transition-all hover:scale-105"
                    >
                        Start Using PaperIQ
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
