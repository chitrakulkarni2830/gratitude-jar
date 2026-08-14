export default function AmbientBackground() {
  return (
    <>
      <div 
        className="fixed rounded-full blur-[90px] opacity-55 z-0 pointer-events-none w-[480px] h-[480px] bg-pastel-peach top-[-120px] left-[-100px] motion-safe:animate-[drift1_26s_ease-in-out_infinite]" 
      />
      <div 
        className="fixed rounded-full blur-[90px] opacity-55 z-0 pointer-events-none w-[420px] h-[420px] bg-pastel-sky bottom-[-140px] right-[-80px] motion-safe:animate-[drift2_32s_ease-in-out_infinite]" 
      />
      <div 
        className="fixed rounded-full blur-[90px] opacity-55 z-0 pointer-events-none w-[320px] h-[320px] bg-pastel-sage top-[40%] right-[15%] motion-safe:animate-[drift3_24s_ease-in-out_infinite]" 
      />
      <div className="noise" />
      <style>{`
        @keyframes drift1 {
          0%, 100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(60px, 40px) scale(1.1); }
        }
        @keyframes drift2 {
          0%, 100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(-50px, -30px) scale(1.08); }
        }
        @keyframes drift3 {
          0%, 100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(-30px, 50px) scale(0.95); }
        }
      `}</style>
    </>
  );
}
