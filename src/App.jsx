import { useEffect, useRef, useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);
  const [pop, setPop] = useState(false);
  const [piggies, setPiggies] = useState([]);
  const idRef = useRef(0);
  const lastCounts = useRef([]);

  const audioCtx = useRef(null);
  const getAudio = () => {
    if (!audioCtx.current) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) audioCtx.current = new Ctx();
    }
    return audioCtx.current;
  };

  // Improved pig snort sound: combines low-frequency oscillators with noise for a deeper, grunty snort
  const playSnort = () => {
    const ctx = getAudio();
    if (!ctx) return;

    const duration = 0.4;
    const rate = ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, rate * duration, rate);
    const data = noiseBuffer.getChannelData(0);

    for (let i = 0; i < data.length; i++) {
      const t = i / rate;
      const envelope = Math.exp(-5 * t);
      data[i] = (Math.random() * 2 - 1) * envelope;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const gruntOsc = ctx.createOscillator();
    gruntOsc.type = "sine";
    gruntOsc.frequency.setValueAtTime(80, ctx.currentTime);
    gruntOsc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + duration);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.5, ctx.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    const gruntGain = ctx.createGain();
    gruntGain.gain.setValueAtTime(0.6, ctx.currentTime);
    gruntGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    noiseSource.connect(noiseGain).connect(ctx.destination);
    gruntOsc.connect(gruntGain).connect(ctx.destination);

    noiseSource.start();
    gruntOsc.start();

    noiseSource.stop(ctx.currentTime + duration);
    gruntOsc.stop(ctx.currentTime + duration);
  };

  const spawnPiggies = () => {
    const batch = Array.from({ length: 12 }).map(() => ({
      id: idRef.current++,
      left: (Math.random() - 0.5) * 140,
      duration: 700 + Math.random() * 600,
      size: 12 + Math.random() * 14,
      rotate: (Math.random() - 0.5) * 50,
      lift: 120 + Math.random() * 120,
    }));
    setPiggies((p) => [...p, ...batch]);
    batch.forEach((b) => {
      setTimeout(() => {
        setPiggies((p) => p.filter((x) => x.id !== b.id));
      }, b.duration);
    });
  };

  const handleClick = () => {
    lastCounts.current.push(count);
    setCount((c) => c + 1);
    setPop(true);
    playSnort();
    spawnPiggies();
  };

  useEffect(() => {
    if (!pop) return;
    const t = setTimeout(() => setPop(false), 220);
    return () => clearTimeout(t);
  }, [pop]);

  const handleReset = () => {
    lastCounts.current.push(count);
    setCount(0);
  };

  const handleUndo = () => {
    const prev = lastCounts.current.pop();
    if (typeof prev === "number") setCount(prev);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
      <BackgroundDecor />
      <div className="relative z-10 w-full max-w-md p-6 sm:p-8">
        <div className="rounded-3xl shadow-2xl p-8 sm:p-10 bg-gradient-to-br from-pink-100 via-pink-50 to-pink-200 backdrop-blur-md border border-pink-300/80 shadow-pink-200">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-6 select-none bg-gradient-to-r from-pink-500 via-pink-600 to-pink-700 bg-clip-text text-transparent">
            Snort Counter
          </h1>
          <div className="flex items-center justify-center mb-8">
            <div
              className={`text-6xl sm:text-7xl font-black tracking-tight transition-transform duration-200 bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 bg-clip-text text-transparent ${
                pop ? "scale-110" : "scale-100"
              }`}
            >
              {count}
            </div>
          </div>
          <div className="relative flex flex-col items-center gap-4">
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center" style={{ height: 0 }}>
              {piggies.map((p) => (
                <Piggy key={p.id} {...p} />
              ))}
            </div>
            <button
              onClick={handleClick}
              className="group relative inline-flex items-center gap-3 rounded-full px-8 py-4 text-xl font-semibold text-white shadow-lg active:scale-95 transition-all duration-300 hover:scale-105"
              style={{
                background:
                  "linear-gradient(135deg, #ec4899, #db2777 25%, #f472b6 50%, #ec4899 75%, #db2777 100%)",
                boxShadow: "0 15px 35px rgba(236, 72, 153, 0.5), 0 8px 20px rgba(219, 39, 119, 0.4)"
              }}
            >
              <span className="text-5xl animate-bounce" aria-hidden>🐽</span>
              Count a snort
              <span className="absolute -inset-1 rounded-full blur opacity-40 group-hover:opacity-60 transition-all duration-300" style={{
                background:
                  "radial-gradient(60% 60% at 50% 50%, rgba(236, 72, 153, 0.8), rgba(219, 39, 119, 0.6))",
              }} />
            </button>
            <div className="flex items-center gap-3 mt-2">
              <button onClick={handleUndo} className="text-sm px-3 py-2 rounded-md bg-gradient-to-r from-pink-300 to-pink-400 hover:from-pink-400 hover:to-pink-500 text-white font-medium transition-all duration-200 hover:scale-105 shadow-md">Undo</button>
              <button onClick={handleReset} className="text-sm px-3 py-2 rounded-md bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white font-medium transition-all duration-200 hover:scale-105 shadow-md">Reset</button>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0) scale(1) rotate(var(--rot)); opacity: 1; filter: hue-rotate(0deg); }
          50% { transform: translateY(calc(-0.5 * var(--lift))) scale(1.1) rotate(calc(var(--rot) * 1.2)); opacity: 0.8; filter: hue-rotate(180deg); }
          100% { transform: translateY(calc(-1 * var(--lift))) scale(0.8) rotate(calc(var(--rot) * 1.5)); opacity: 0; filter: hue-rotate(360deg); }
        }
        
        @keyframes glow {
          0%, 100% { filter: drop-shadow(0 0 5px rgba(236, 72, 153, 0.5)); }
          50% { filter: drop-shadow(0 0 20px rgba(236, 72, 153, 0.8)); }
        }
      `}</style>
    </div>
  );
}

function Piggy({ left, duration, size, rotate, lift }) {
  return (
    <span
      className="select-none"
      style={{
        position: "absolute",
        top: 0,
        left: `calc(50% + ${left}px)`,
        fontSize: `${size}px`,
        animation: `floatUp ${duration}ms ease-out forwards`,
        ["--rot"]: `${rotate}deg`,
        ["--lift"]: `${lift}px`,
      }}
      aria-hidden
    >
      🐷
    </span>
  );
}

function BackgroundDecor() {
  return (
    <div className="absolute inset-0 -z-10">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 60% at 20% 10%, #fce7f3 0%, transparent 70%)," +
            "radial-gradient(70% 60% at 80% 20%, #fbcfe8 0%, transparent 70%)," +
            "radial-gradient(70% 60% at 50% 90%, #f9a8d4 0%, transparent 70%)," +
            "linear-gradient(135deg, #fdf2f8, #fce7f3)",
        }}
      />
      <svg className="absolute inset-0 w-full h-full opacity-50" aria-hidden>
        <defs>
          <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="#ec4899" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-br from-pink-200/40 via-pink-100/30 to-pink-200/40"></div>
    </div>
  );
}
