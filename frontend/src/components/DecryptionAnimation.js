const DecryptionAnimation = () => {
  return (
    <div className="relative w-full h-64 bg-gray-900 rounded-lg overflow-hidden mb-4">
      {/* Scanning effect with multiple lines */}
      <div className="absolute inset-0">
        <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-teal-400 to-transparent animate-scan" />
        <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan2" />
        <div className="absolute w-0.5 h-full bg-gradient-to-b from-transparent via-teal-400 to-transparent animate-scanVertical" />
      </div>

      {/* Binary rain effect */}
      <div className="absolute inset-0 opacity-20">
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={i} 
            className="absolute text-teal-400 text-xs animate-rain" 
            style={{ 
              left: `${i * 5}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1 + Math.random() * 2}s`
            }}
          >
            {Array.from({ length: 12 }).map((_, j) => (
              <div key={j} className="my-1">
                {Math.random() > 0.5 ? '1' : '0'}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Matrix code rain */}
      <div className="absolute inset-0">
        {Array.from({ length: 15 }).map((_, i) => (
          <div 
            key={i} 
            className="absolute text-teal-400/30 font-mono text-xs animate-matrix"
            style={{ 
              left: `${i * 6.66}%`,
              animationDelay: `${i * 0.1}s`
            }}
          >
            {Array.from({ length: 20 }).map((_, j) => (
              <span 
                key={j} 
                className="block"
                style={{ 
                  animationDelay: `${Math.random() * 2}s`,
                  opacity: Math.random()
                }}
              >
                {String.fromCharCode(33 + Math.random() * 93)}
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* Hexadecimal addresses */}
      <div className="absolute left-4 top-4 text-xs font-mono text-teal-400/40 animate-pulse">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="mb-1">
            0x{Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}
          </div>
        ))}
      </div>

      {/* Central content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center z-10 bg-gray-900/50 p-4 rounded-lg backdrop-blur-sm">
          <div className="text-teal-400 font-bold text-xl animate-pulse">
            DECRYPTING MESSAGE
          </div>
          <div className="text-teal-400/60 text-sm mt-2 animate-blink">
            Scanning for hidden data...
          </div>
          {/* Progress indicators */}
          <div className="mt-4 flex justify-center space-x-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div 
                key={i} 
                className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Animated borders */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-teal-400 animate-borderPulse" />
        <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-teal-400 animate-borderPulse2" />
        <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-teal-400 animate-borderPulse3" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-teal-400 animate-borderPulse4" />
      </div>
    </div>
  );
};

export default DecryptionAnimation;