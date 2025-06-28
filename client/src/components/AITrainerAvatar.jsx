import { useEffect, useRef } from "react";

const AITrainerAvatar = ({ trainer, size = "medium", isListening = false, className = "" }) => {
  const sizeClasses = {
    small: "w-16 h-16 text-xl",
    medium: "w-24 h-24 text-2xl",
    large: "w-32 h-32 text-4xl",
  };

  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isListening) {
        videoRef.current.play().catch(e => console.log("Video play error:", e));
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isListening]);

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      
      <div className="absolute inset-0 rounded-full overflow-hidden">
       
        <img
            src={trainer.profileImage}
            alt={`${trainer.name}, ${trainer.role}`}
            className={`max-h-full max-w-full object-contain transition-all duration-300 hover:scale-105 `}
            />
      </div>
      
      <div className="absolute inset-0 rounded-full border-2 border-primary-500/50 flex items-center justify-center">
        {isListening && (
          <div className="absolute inset-0 rounded-full bg-primary-500/10 animate-ping"></div>
        )}
      </div>
      <div className={`absolute -bottom-2 -right-2 rounded-full p-1 ${
        isListening ? "bg-green-500" : "bg-accent-500"
      }`}>
        <div className="w-4 h-4 rounded-full bg-white"></div>
      </div>
    </div>
  );
};

export default AITrainerAvatar;