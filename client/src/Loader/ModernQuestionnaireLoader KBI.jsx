import React, { useState, useEffect } from 'react';
import { ClipboardList, CheckCircle, FileText, Users, PieChart, Zap } from 'lucide-react';

const ModernQuestionnaireLoader = () => {
  const [currentWave, setCurrentWave] = useState(0);
  const [pulseIndex, setPulseIndex] = useState(0);

  const icons = [
    ClipboardList, FileText, CheckCircle, Users, PieChart, Zap
  ];

  useEffect(() => {
    const waveInterval = setInterval(() => {
      setCurrentWave(prev => (prev + 1) % 4);
    }, 600);

    const pulseInterval = setInterval(() => {
      setPulseIndex(prev => (prev + 1) % icons.length);
    }, 400);

    return () => {
      clearInterval(waveInterval);
      clearInterval(pulseInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-12 grid-rows-8 h-full w-full">
          {[...Array(96)].map((_, i) => (
            <div
              key={i}
              className="border border-orange-500/20 animate-pulse"
              style={{
                animationDelay: `${(i * 50)}ms`,
                animationDuration: '2s'
              }}
            />
          ))}
        </div>
      </div>

      {/* Logo container */}
      <div className="absolute top-16 left-1/2 transform -translate-x-1/2">
        <div className="relative">
          <div className="w-100 h-20">
            <div className="w-full h-full flex items-center justify-center text-white font-bold text-2xl ">
              <img src="./Picture2.png" alt="" />
            </div>
          </div>
          <div className="absolute -inset-2  rounded-2xl blur-lg animate-pulse"></div>
        </div>
      </div>

      {/* Main loader structure */}
      <div className="relative">
        
        {/* Central hexagon */}
        <div className="relative w-48 h-48 flex items-center justify-center">
          
          {/* Hexagonal border with rotation */}
          <div className="absolute inset-0">
            <svg width="192" height="192" className="animate-spin" style={{ animationDuration: '8s' }}>
              <polygon
                points="96,20 156,56 156,136 96,172 36,136 36,56"
                fill="none"
                stroke="url(#hexGradient)"
                strokeWidth="2"
                className="drop-shadow-lg"
              />
              <defs>
                <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="50%" stopColor="#ea580c" />
                  <stop offset="100%" stopColor="#dc2626" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Icons positioned at hexagon vertices */}
          {icons.map((Icon, index) => {
            const angle = (index * 60) - 90; // 60 degrees apart, starting from top
            const radius = 70;
            const x = Math.cos(angle * (Math.PI / 180)) * radius;
            const y = Math.sin(angle * (Math.PI / 180)) * radius;
            
            return (
              <div
                key={index}
                className={`absolute w-14 h-14 flex items-center justify-center rounded-xl transition-all duration-500 ${
                  pulseIndex === index
                    ? 'bg-gradient-to-br from-orange-500 to-red-500 shadow-2xl shadow-orange-500/50 scale-125 rotate-12'
                    : 'bg-white/90 backdrop-blur-sm border border-orange-500/50 shadow-lg scale-100 rotate-0'
                }`}
                style={{
                  left: `calc(50% + ${x}px - 28px)`,
                  top: `calc(50% + ${y}px - 28px)`,
                }}
              >
                <Icon 
                  size={28}
                  className={`transition-all duration-300 ${
                    pulseIndex === index ? 'text-white' : 'text-orange-600'
                  }`}
                />
              </div>
            );
          })}

          {/* Center element with morphing shape */}
          <div className="relative w-16 h-16">
            <div className={`absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500 transition-all duration-700 shadow-xl shadow-orange-500/40 ${
              currentWave % 2 === 0 ? 'rounded-full' : 'rounded-xl rotate-45'
            }`}>
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute -inset-32">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 bg-orange-500/60 rounded-full animate-float"
              style={{
                left: `${20 + (i * 60)}px`,
                top: `${30 + Math.sin(i) * 40}px`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: '3s'
              }}
            />
          ))}
        </div>

        {/* Wave effects */}
        {[0, 1, 2, 3].map((wave) => (
          <div
            key={wave}
            className={`absolute inset-0 rounded-full border border-orange-500/60 transition-all duration-1000 ${
              currentWave === wave ? 'scale-150 opacity-0' : 'scale-100 opacity-100'
            }`}
            style={{
              width: `${200 + wave * 40}px`,
              height: `${200 + wave * 40}px`,
              left: `calc(50% - ${100 + wave * 20}px)`,
              top: `calc(50% - ${100 + wave * 20}px)`,
              animationDelay: `${wave * 150}ms`
            }}
          />
        ))}

        {/* Bottom accent icons */}
        <div className="absolute -bottom-24 left-1/2 transform -translate-x-1/2">
          <div className="flex space-x-8">
            {[ClipboardList, CheckCircle, PieChart].map((Icon, index) => (
              <div
                key={index}
                className="w-6 h-6 text-orange-500/70 animate-bounce"
                style={{
                  animationDelay: `${index * 0.2}s`,
                  animationDuration: '2s'
                }}
              >
                <Icon size={24} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ambient light effect */}
      <div className="absolute inset-0 bg-gradient-radial from-orange-500/5 via-transparent to-transparent pointer-events-none"></div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .bg-gradient-radial {
          background: radial-gradient(circle at center, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
};

export default ModernQuestionnaireLoader;