import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <div className="relative min-h-screen hero-bg flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519681393784-d120267933ba')] bg-cover bg-center opacity-18"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 animate-fade-in-up">
          Explore the World of
          <span className="block text-yellow-300">Thoughtful Writing</span>
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto animate-fade-in-up delay-200">
        "Explore stories, insights, and expertise on tech and programming—crafted with passion and thoughtful perspectives. This is my personal space to share knowledge and ideas, one blog at a time."
        </p>
        <Link to="/posts" >
        <button className="hero-cta px-8 py-4 font-semibold text-lg inline-flex items-center gap-2 hover:brightness-95 transition-colors animate-fade-in-up delay-300">
          Start Reading
          <ArrowRight className="w-5 h-5" />
        </button>
        </Link>
      </div>
    </div>
  );
}