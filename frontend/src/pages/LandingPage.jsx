import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Smartphone, Zap, FileCheck2, ArrowRight, Car, UserCircle, Phone } from 'lucide-react';
import Aurora from '../components/Aurora/Aurora';

export default function LandingPage() {
  const features = [
    {
      title: 'Digital Services',
      description: 'Apply for Learner, Permanent, and Renewal Driving Licenses online without visiting the RTO.',
      icon: Smartphone,
    },
    {
      title: 'Vehicle Registration',
      description: 'Streamlined online process for registering new vehicles and transferring ownership.',
      icon: Car,
    },
    {
      title: 'e-Challan Payments',
      description: 'View traffic violations and securely pay fines online in a few clicks.',
      icon: Zap,
    },
    {
      title: 'Document Verification',
      description: 'Upload identification natively for remote verification by RTO officers.',
      icon: FileCheck2,
    },
    {
      title: 'Citizen Dashboard',
      description: 'Live tracking of all your applications with a transparent processing timeline.',
      icon: UserCircle,
    },
    {
      title: 'Help Desk',
      description: '24/7 support desk to answer your questions regarding RTO procedures.',
      icon: Phone,
    },
  ];

  const stats = [
    { label: 'Citizens Reached', value: '2.5M+' },
    { label: 'Licenses Issued', value: '850K+' },
    { label: 'Vehicles Registered', value: '1.2M+' },
    { label: 'Challans Cleared', value: '3M+' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans transition-colors duration-200">
      
      {/* Navbar */}
      <nav className="border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex flex-shrink-0 items-center">
              <div className="h-10 w-10 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold tracking-tight text-slate-900 dark:text-white">Smart RTO</span>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <a href="#home" className="text-slate-900 dark:text-slate-100 font-medium hover:text-red-600 dark:hover:text-red-400 transition">Home</a>
              <a href="#services" className="text-slate-500 dark:text-slate-400 font-medium hover:text-red-600 dark:hover:text-red-400 transition">Services</a>
              <a href="#about" className="text-slate-500 dark:text-slate-400 font-medium hover:text-red-600 dark:hover:text-red-400 transition">About</a>
              <a href="#contact" className="text-slate-500 dark:text-slate-400 font-medium hover:text-red-600 dark:hover:text-red-400 transition">Contact</a>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium transition">
                Log in
              </Link>
              <Link to="/register" className="bg-red-600 text-white px-5 py-2 rounded-full font-medium shadow-sm shadow-red-600/20 hover:bg-red-700 hover:shadow-red-600/40 transition-all">
                Register
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div
        id="home"
        className="relative overflow-hidden pt-20 pb-36 lg:pt-40 lg:pb-48"
        style={{
          backgroundImage: "url('/hero-bg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-slate-900/70 to-red-950/80 z-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-red-500/20 text-red-300 text-xs font-semibold tracking-widest uppercase border border-red-500/30">
            Official Government Transport Portal
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight drop-shadow-lg">
            Vehicle Intelligence &amp; <br className="hidden sm:block" /> Risk Analysis System
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-300">
            Digitizing Regional Transport Office services for a transparent, faster, and reliable citizen experience. Apply for licenses, register vehicles, and pay fines securely online.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="bg-red-600 text-white px-8 py-4 rounded-full font-semibold shadow-lg shadow-red-600/40 hover:bg-red-500 hover:-translate-y-1 transition-all flex items-center justify-center group"
            >
              Get Started <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#services"
              className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold border border-white/20 hover:bg-white/20 transition flex items-center justify-center"
            >
              Explore Services
            </a>
          </div>
        </div>
      </div>


      {/* ============ SERVICES MARQUEE ============ */}
      <div className="bg-slate-900 py-5 overflow-hidden border-y border-slate-700 relative">
        <style>{`
          @keyframes marquee-scroll {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .marquee-track {
            display: flex;
            width: max-content;
            animation: marquee-scroll 30s linear infinite;
            will-change: transform;
          }
          .marquee-wrap:hover .marquee-track {
            animation-play-state: paused;
          }
        `}</style>

        {/* Fade edges */}
        <div className="absolute inset-y-0 left-0 w-20 z-10 bg-gradient-to-r from-slate-900 to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-20 z-10 bg-gradient-to-l from-slate-900 to-transparent pointer-events-none" />

        <div className="marquee-wrap overflow-hidden">
          <div className="marquee-track">
            {[...Array(2)].map((_, copyIdx) => (
              <div key={copyIdx} className="flex items-center whitespace-nowrap">
                {[
                  'Vehicle Registration',
                  'Driving Licence Services',
                  'Learner Licence',
                  'Vehicle Transfer',
                  'Road Tax Payment',
                  'Permit Services',
                  'Vehicle Fitness Certificate',
                  'Traffic Challan Payment',
                  'Duplicate RC',
                  'Duplicate Driving Licence',
                  'Address Change in RC',
                  'Hypothecation Services',
                  'Fancy Number Booking',
                  'Vehicle Ownership Transfer',
                  'International Driving Permit',
                ].map((service, idx) => (
                  <span key={idx} className="flex items-center">
                    <span className="text-white font-bold text-sm md:text-base px-6 tracking-wide hover:text-red-400 cursor-default transition-colors duration-200">
                      {service}
                    </span>
                    <span className="text-red-400 text-lg font-bold select-none">•</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-black py-16 text-white border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {stats.map((stat, i) => (
              <div key={i} className="animate-in fade-in zoom-in duration-500 delay-100">
                <p className="text-4xl font-extrabold">{stat.value}</p>
                <p className="mt-2 text-slate-400 font-medium tracking-wide uppercase text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features grid — Aurora animated background */}
      <div id="services" className="relative py-24 overflow-hidden bg-black">
        {/* Aurora WebGL animation layer */}
        <Aurora
          colorStops={['#1a237e', '#1565c0', '#0288d1']}
          amplitude={2.5}
          blend={0.8}
          speed={0.5}
        />
        {/* Subtle overlay to keep cards readable */}
        <div className="absolute inset-0 bg-black/30 z-[1]" />

        <div className="relative z-[2] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-red-400 font-semibold tracking-widest uppercase text-xs">Features</h2>
            <p className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
              Everything you need, completely online
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-white/95 backdrop-blur-sm border border-white/20 p-8 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center mb-6 text-white group-hover:bg-red-700 transition-colors">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-400">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center text-white mb-4">
                 <Shield className="h-6 w-6 text-red-500 mr-2" />
                 <span className="text-xl font-bold">Smart RTO</span>
              </div>
              <p className="text-sm leading-relaxed max-w-sm">
                Next-generation government platform digitizing Regional Transport Office services for the citizens. 
                Experience transparent and fast processing.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Verify DL</a></li>
                <li><a href="#" className="hover:text-white transition">Check Vahan</a></li>
                <li><a href="#" className="hover:text-white transition">Pay Challan</a></li>
                <li><a href="#" className="hover:text-white transition">Fee Structure</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-2 text-sm">
                <li>Contact Person: Ishu S</li>
                <li>Phone: 1800-120-4500</li>
                <li>Email: helpdesk@smartrto.gov.in</li>
                <li className="mt-2 text-white font-medium">Smart RTO Office</li>
                <li>Coimbatore, Tamil Nadu</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
            <p>&copy; 2026 Smart RTO System. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition">Privacy Policy</a>
              <a href="#" className="hover:text-white transition">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
