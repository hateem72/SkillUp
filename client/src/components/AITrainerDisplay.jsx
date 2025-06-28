import { useEffect, useState } from 'react';

const AITrainerDisplay = ({
  trainer,
  isSpeaking,
  isListening,
  hasError,
  subtitle,
  onAnimationComplete
}) => {
  const [displayGreeting, setDisplayGreeting] = useState(true);
  const [greetingOpacity, setGreetingOpacity] = useState(0);
  const fullGreeting = `Hello! I'm ${trainer.name}, your ${trainer.role.toLowerCase()}. Ready when you are!`;

  useEffect(() => {
    if (!displayGreeting) return;

    let opacity = 0;
    const fadeIn = setInterval(() => {
      if (opacity < 1) {
        opacity += 0.05;
        setGreetingOpacity(opacity);
      } else {
        clearInterval(fadeIn);
        setTimeout(() => {
          setDisplayGreeting(false);
          if (onAnimationComplete) onAnimationComplete();
        }, 3500);
      }
    }, 50);

    return () => clearInterval(fadeIn);
  }, [displayGreeting, onAnimationComplete]);

  const getBackgroundEffect = () => {
    if (displayGreeting) {
      return (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/80 to-purple-950/80 backdrop-blur-lg overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_40%,_rgba(0,0,0,0.7)_100%)]"></div>
          {[...Array(60)].map((_, i) => (
            <div
              key={`particle-${i}`}
              className="absolute rounded-full bg-gradient-to-r from-blue-400 to-purple-400"
              style={{
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                top: `50%`,
                left: `50%`,
                animation: `particle-explode ${Math.random() * 1.5 + 1}s ease-out forwards`,
                animationDelay: `${Math.random() * 0.5}s`,
                transform: `translate(-50%, -50%)`
              }}
            ></div>
          ))}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-1/2 h-1/2 rounded-full border-2 border-blue-400/60 animate-portal-ring"
              style={{ animation: `portal-ring 3s linear infinite` }}
            ></div>
            <div
              className="w-2/3 h-2/3 rounded-full border-2 border-purple-400/50 animate-portal-ring"
              style={{ animation: `portal-ring 4s linear infinite reverse` }}
            ></div>
            <div className="w-3/4 h-3/4 bg-[radial-gradient(circle,_rgba(139,92,246,0.5)_0%,_transparent_70%)] animate-glow"></div>
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(0deg,_transparent_49%,_rgba(139,92,246,0.2)_50%,_transparent_51%)] bg-[length:3px_3px] animate-scanlines"></div>
        </div>
      );
    }

    if (hasError) {
      return (
        <div className="absolute inset-0 bg-red-950/30 overflow-hidden animate-shake">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMCwwLDUwLDEwMCwxMDAsMCwwLDBaTTEwLDMwLDUwLDcwLDkwLDMwLDEwLDMwWiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDIzOSw2OCw2OCwwLjMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=')] bg-[length:100px_100px] opacity-40 animate-glitch"></div>
          <div className="absolute inset-0 bg-[linear-gradient(0deg,_transparent_49%,_rgba(239,68,68,0.2)_50%,_transparent_51%)] bg-[length:4px_4px] animate-scanlines"></div>
          {[...Array(20)].map((_, i) => (
            <div
              key={`glitch-particle-${i}`}
              className="absolute rounded-full bg-red-500/60"
              style={{
                width: `${Math.random() * 6 + 3}px`,
                height: `${Math.random() * 6 + 3}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `glitch-particle ${Math.random() * 1 + 0.5}s infinite`
              }}
            ></div>
          ))}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-full bg-[radial-gradient(circle,_rgba(239,68,68,0.4)_0%,_transparent_70%)] animate-neon-pulse"></div>
          </div>
        </div>
      );
    }

    if (isSpeaking) {
      return (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/40 to-purple-950/40 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAsMEw0MCwwTDA0MGwtNDAsMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDU5LDEzMCwyNDYsMC4yNSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] bg-[length:40px_40px] animate-speech-grid"></div>
          <div className="absolute inset-x-0 bottom-0 h-24 flex items-end justify-center space-x-2">
            {[...Array(15)].map((_, i) => (
              <div
                key={`speech-wave-${i}`}
                className="w-2 bg-gradient-to-t from-blue-400/80 to-purple-400/80 rounded-t shadow-[0_0_10px_rgba(59,130,246,0.6)]"
                style={{
                  height: `${Math.random() * 60 + 30}%`,
                  animation: `speech-wave ${Math.random() * 0.4 + 0.3}s infinite`,
                  animationDelay: `${i * 0.05}s`
                }}
              ></div>
            ))}
          </div>
          <div className="absolute inset-x-0 bottom-0 h-16 flex items-end justify-center space-x-1.5 opacity-50">
            {[...Array(20)].map((_, i) => (
              <div
                key={`speech-wave-bg-${i}`}
                className="w-1.5 bg-gradient-to-t from-purple-400/60 to-transparent rounded-t"
                style={{
                  height: `${Math.random() * 50 + 20}%`,
                  animation: `speech-wave ${Math.random() * 0.5 + 0.4}s infinite`,
                  animationDelay: `${i * 0.06}s`
                }}
              ></div>
            ))}
          </div>
          {/* Vocal energy spheres */}
          {[...Array(6)].map((_, i) => (
            <div
              key={`vocal-sphere-${i}`}
              className="absolute rounded-full bg-gradient-to-r from-blue-400 to-purple-500 shadow-[0_0_15px_rgba(59,130,246,0.7)]"
              style={{
                width: `${Math.random() * 12 + 8}px`,
                height: `${Math.random() * 12 + 8}px`,
                top: `50%`,
                left: `50%`,
                animation: `vocal-sphere ${Math.random() * 1 + 0.5}s infinite`,
                transform: `translate(-50%, -50%) rotate(${i * 60}deg) translateX(${Math.random() * 60 + 50}px)`
              }}
            ></div>
          ))}
          {/* Sound particles */}
          {[...Array(20)].map((_, i) => (
            <div
              key={`sound-particle-${i}`}
              className="absolute rounded-full bg-blue-400/60"
              style={{
                width: `${Math.random() * 5 + 3}px`,
                height: `${Math.random() * 5 + 3}px`,
                top: `50%`,
                left: `50%`,
                animation: `sound-particle ${Math.random() * 1.5 + 1}s linear infinite`,
                animationDelay: `${Math.random() * 0.8}s`,
                transform: `translate(-50%, -50%)`
              }}
            ></div>
          ))}
          {/* Background glow ripple */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3/4 h-3/4 rounded-full bg-[radial-gradient(circle,_rgba(59,130,246,0.4)_0%,_transparent_70%)] animate-speech-ripple"></div>
            <div className="w-2/3 h-2/3 rounded-full bg-[radial-gradient(circle,_rgba(139,92,246,0.3)_0%,_transparent_70%)] animate-speech-ripple delay-300"></div>
          </div>
        </div>
      );
    }

    if (isListening) {
      return (
        <div className="absolute inset-0 bg-gradient-to-br from-green-950/30 to-teal-950/30 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center perspective-500">
            <div className="flex space-x-1.5 h-48 items-end transform rotate-x-20">
              {[...Array(25)].map((_, i) => (
                <div
                  key={`eq-wave-${i}`}
                  className="w-1.5 bg-gradient-to-t from-green-400 to-teal-400 rounded-t shadow-[0_0_10px_rgba(16,185,129,0.7)]"
                  style={{
                    height: `${Math.random() * 70 + 30}%`,
                    animation: `eq-wave ${Math.random() * 0.4 + 0.5}s infinite`,
                    animationDelay: `${i * 0.06}s`
                  }}
                ></div>
              ))}
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1/2 h-1/2 rounded-full bg-[radial-gradient(circle,_rgba(16,185,129,0.3)_0%,_transparent_70%)] animate-ripple"></div>
            <div className="w-1/2 h-1/2 rounded-full bg-[radial-gradient(circle,_rgba(16,185,129,0.2)_0%,_transparent_70%)] animate-ripple delay-300"></div>
          </div>
          {[...Array(15)].map((_, i) => (
            <div
              key={`rising-particle-${i}`}
              className="absolute rounded-full bg-teal-400/60"
              style={{
                width: `${Math.random() * 5 + 3}px`,
                height: `${Math.random() * 5 + 3}px`,
                bottom: '0%',
                left: `${Math.random() * 100}%`,
                animation: `rise ${Math.random() * 2 + 1}s linear infinite`,
                animationDelay: `${Math.random() * 1}s`
              }}
            ></div>
          ))}
        </div>
      );
    }

    // Idle state with nebula effect
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950/80 to-blue-950/80 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,_rgba(59,130,246,0.15)_0%,_rgba(139,92,246,0.15)_50%,_rgba(16,185,129,0.15)_100%)] animate-nebula"></div>
        <div className="absolute inset-4 rounded-xl border-2 border-blue-400/30 animate-rotate-frame"></div>
        {[...Array(5)].map((_, i) => (
          <div
            key={`star-burst-${i}`}
            className="absolute rounded-full bg-white/60"
            style={{
              width: `${Math.random() * 6 + 3}px`,
              height: `${Math.random() * 6 + 3}px`,
              top: `${Math.random() * 80 + 10}%`,
              left: `${Math.random() * 80 + 10}%`,
              animation: `star-burst ${Math.random() * 4 + 3}s infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>
    );
  };

  return (
    <div className="relative w-full h-full max-w-4xl mx-auto">
      <style>
        {`
          @keyframes particle-explode {
            0% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
            100% { transform: translate(-50%, -50%) translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px) scale(0); opacity: 0; }
          }
          @keyframes portal-ring {
            0% { transform: rotate(0deg) scale(1); opacity: 0.6; }
            50% { transform: rotate(180deg) scale(1.1); opacity: 0.8; }
            100% { transform: rotate(360deg) scale(1); opacity: 0.6; }
          }
          @keyframes glow {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 0.7; }
          }
          @keyframes scanlines {
            0% { background-position: 0 0; }
            100% { background-position: 0 3px; }
          }
          @keyframes glitch {
            0% { transform: translate(0); opacity: 0.8; }
            20% { transform: translate(-4px, 4px); opacity: 0.6; }
            40% { transform: translate(4px, -4px); opacity: 0.7; }
            60% { transform: translate(-3px, -3px); opacity: 0.6; }
            80% { transform: translate(3px, 3px); opacity: 0.7; }
            100% { transform: translate(0); opacity: 0.8; }
          }
          @keyframes glitch-particle {
            0% { transform: translate(0); opacity: 0.8; }
            50% { transform: translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px); opacity: 0.4; }
            100% { transform: translate(0); opacity: 0.8; }
          }
          @keyframes neon-pulse {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 0.7; }
          }
          @keyframes speech-grid {
            0% { opacity: 0.25; background-position: 0 0; }
            50% { opacity: 0.5; background-position: 2px 2px; }
            100% { opacity: 0.25; background-position: 0 0; }
          }
          @keyframes speech-wave {
            0%, 100% { transform: scaleY(1); }
            50% { transform: scaleY(${Math.random() * 0.7 + 1.3}); }
          }
          @keyframes vocal-sphere {
            0%, 100% { transform: translate(-50%, -50%) rotate(${Math.random() * 360}deg) translateX(${Math.random() * 60 + 50}px) scale(1); }
            50% { transform: translate(-50%, -50%) rotate(${Math.random() * 360}deg) translateX(${Math.random() * 60 + 50}px) scale(1.3); }
          }
          @keyframes sound-particle {
            0% { transform: translate(-50%, -50%) translateY(0); opacity: 0.8; }
            100% { transform: translate(-50%, -50%) translateY(-${Math.random() * 100 + 50}px); opacity: 0; }
          }
          @keyframes speech-ripple {
            0% { transform: scale(0.8); opacity: 0.4; }
            100% { transform: scale(1.5); opacity: 0; }
          }
          @keyframes eq-wave {
            0%, 100% { transform: scaleY(1) rotateX(20deg); }
            50% { transform: scaleY(${Math.random() * 0.6 + 1.3}) rotateX(20deg); }
          }
          @keyframes ripple {
            0% { transform: scale(0); opacity: 0.6; }
            100% { transform: scale(2); opacity: 0; }
          }
          @keyframes rise {
            0% { transform: translateY(0); opacity: 0.8; }
            100% { transform: translateY(-100vh); opacity: 0; }
          }
          @keyframes nebula {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes rotate-frame {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes star-burst {
            0%, 100% { opacity: 0.6; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.5); }
          }
          @keyframes shake {
            0%, 100% { transform: translate(0); }
            10%, 30%, 50%, 70%, 90% { transform: translate(${Math.random() * 2 - 1}px, ${Math.random() * 2 - 1}px); }
          }
          @keyframes breathe {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.02); }
          }
          @keyframes materialize {
            0% { transform: scale(0.8) translateY(20px); opacity: 0; }
            100% { transform: scale(1) translateY(0); opacity: 1; }
          }
          .animate-speech-grid {
            animation: speech-grid 2s ease-in-out infinite;
          }
          .animate-speech-ripple {
            animation: speech-ripple 1.5s ease-out infinite;
          }
          .perspective-500 {
            perspective: 500px;
          }
          .delay-300 { animation-delay: 0.3s; }
        `}
      </style>
      <div className="relative aspect-[16/9] bg-gray-950 rounded-xl overflow-hidden">
        {/* Background Effect */}
        {getBackgroundEffect()}

        {/* Trainer Profile Image - Hidden during greeting */}
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <img
            src={trainer.profileImage}
            alt={`${trainer.name}, ${trainer.role}`}
            className={`max-h-full max-w-full object-contain transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] animate-breathe ${
              displayGreeting ? 'opacity-0' : 'opacity-100'
            } ${hasError ? 'animate-glitch' : ''} ${isSpeaking ? 'scale-102' : ''}`}
            style={{ animation: displayGreeting ? 'none' : 'breathe 6s ease-in-out infinite' }}
          />
        </div>

        {/* Greeting Text */}
        {displayGreeting && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div
              className="text-center px-8 animate-materialize"
              style={{ opacity: greetingOpacity, animation: 'materialize 1.5s ease-out forwards' }}
            >
              <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-4 relative">
                {fullGreeting}
                <span className="animate-pulse text-blue-400">|</span>
                <div className="absolute inset-0 bg-[linear-gradient(0deg,_transparent_49%,_rgba(139,92,246,0.25)_50%,_transparent_51%)] bg-[length:3px_3px] animate-scanlines"></div>
                <div className="absolute inset-0 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 filter blur-sm opacity-50 animate-glow"></div>
              </h2>
              <p className="text-lg md:text-xl text-gray-200 mt-2 drop-shadow-lg animate-[glow_3s_ease-in-out_infinite]">
                {trainer.bio}
              </p>
            </div>
          </div>
        )}

        {/* Status Indicator */}
        <div
          className={`absolute bottom-6 right-6 w-12 h-12 rounded-full border-4 border-white/90 ${
            hasError
              ? 'bg-red-500 shadow-[0_0_25px_rgba(239,68,68,0.9)] animate-pulse-slow'
              : isListening
              ? 'bg-green-500 shadow-[0_0_25px_rgba(16,185,129,0.8)]'
              : isSpeaking
              ? 'bg-blue-500 shadow-[0_0_25px_rgba(59,130,246,0.8)]'
              : 'bg-gray-500 shadow-[0_0_15px_rgba(107,114,128,0.6)]'
          } transition-all duration-300`}
        ></div>
      </div>

      {/* Subtitle */}
      <div
        className={`mt-6 bg-gray-950/90 backdrop-blur-lg rounded-lg p-4 text-center transition-all duration-500 ${
          displayGreeting ? 'opacity-0 translate-y-12' : 'opacity-100 translate-y-0'
        }`}
      >
        <p className="text-white font-medium text-lg drop-shadow-md">
          {subtitle || `${trainer.name} is ready`}
        </p>
      </div>
    </div>
  );
};

export default AITrainerDisplay;