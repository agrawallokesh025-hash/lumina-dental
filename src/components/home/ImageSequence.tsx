"use client";

export default function ImageSequence() {
  return (
    <div 
      className="w-full h-full relative flex items-center justify-center"
      style={{ transform: 'translateZ(0)', willChange: 'transform' }}
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="w-full h-full object-cover object-[80%_center] md:object-center"
        style={{ 
          mixBlendMode: 'screen',
          transform: 'translateZ(0)',
          willChange: 'transform'
        }}
      >
        <source src="/hero-animation.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
