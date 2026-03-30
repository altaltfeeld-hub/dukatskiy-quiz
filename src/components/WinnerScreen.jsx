import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export default function WinnerScreen({ state, updateState }) {
  const sortedPlayers = [...(state.players || [])].sort((a, b) => b.score - a.score);
  const winners = sortedPlayers.slice(0, 3); // Top 3

  // Confetti logic
  const confettiList = useMemo(() => {
    const colors = ['#E85D8D', '#7FD7CD', '#FFD700', '#4169E1', '#9370DB', '#32CD32'];
    return Array.from({ length: 60 }).map((_, i) => ({
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4,
      size: 8 + Math.random() * 10,
      color: colors[i % colors.length],
      rotate: Math.random() * 360
    }));
  }, []);

  return (
    <div style={{ height: '100vh', display: 'flex', overflow: 'hidden', background: 'var(--color-bg-deep)', position: 'relative' }}>
      
      {/* Restored Background Icons Layer (Drifting) */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 0, opacity: 0.05 }}>
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div 
            key={i} 
            initial={{ x: Math.random() * 100 + '%', y: Math.random() * 100 + '%' }}
            animate={{ 
              x: [Math.random() * 100 + '%', Math.random() * 100 + '%'], 
              y: [Math.random() * 100 + '%', Math.random() * 100 + '%'],
              opacity: [0.1, 0.4, 0.1]
            }} 
            transition={{ duration: 25 + i * 2, repeat: Infinity, ease: "linear" }}
            style={{ position: 'absolute', width: '100px', height: '100px', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundImage: i % 2 === 0 ? 'url(/emblem.jpg)' : 'url(/rat.jpg)', filter: 'grayscale(100%) brightness(1.2)' }} 
          />
        ))}
      </div>

      {/* VFX Overlay */}
      <motion.div 
        animate={{ opacity: [0, 0.12, 0, 0.08, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
        style={{ position: 'fixed', inset: 0, background: 'white', pointerEvents: 'none', zIndex: 0 }}
      />

      {/* Confetti */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 3 }}>
         {confettiList.map((c, i) => (
           <div key={`c-${i}`} style={{
             position: 'absolute', width: `${c.size}px`, height: `${c.size * 1.5}px`,
             background: c.color, left: c.left, top: `-20px`, opacity: 0.8,
             borderRadius: '2px', animation: `fall ${c.duration}s linear infinite`,
             animationDelay: `${c.delay}s`, transform: `rotate(${c.rotate}deg)`
           }} />
         ))}
      </div>

      <style>{`
        @keyframes fall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
      `}</style>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', zIndex: 1 }}>
        <motion.div 
          initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1 }}
          style={{ marginBottom: '40px', textAlign: 'center' }}
        >
          <div style={{ fontSize: '20px', color: 'var(--color-teal)', fontWeight: '900', letterSpacing: '12px', marginBottom: '10px' }}>ИГРА ЗАВЕРШЕНА</div>
          <h1 style={{ fontSize: 'clamp(48px, 8vw, 84px)', color: 'white', fontWeight: '900', lineHeight: 1, margin: 0, textShadow: '0 0 60px rgba(127, 215, 205, 0.4)' }}>
            ПОБЕДИТЕЛЬ!
          </h1>
        </motion.div>

        {/* Winner Podium Cards */}
        <div style={{ display: 'flex', gap: '25px', justifyContent: 'center', alignItems: 'flex-end', marginBottom: '60px' }}>
          {winners.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.2, type: 'spring' }}
              className="btn-glass"
              style={{
                padding: i === 0 ? '50px 40px' : '30px 40px',
                borderRadius: 'var(--radius-lg) !important',
                textAlign: 'center',
                minWidth: i === 0 ? '300px' : '220px',
                background: i === 0 ? 'rgba(127, 215, 205, 0.1) !important' : 'rgba(255,255,255,0.03) !important',
                border: i === 0 ? '3px solid var(--color-teal) !important' : '1px solid rgba(255,255,255,0.1) !important',
                boxShadow: i === 0 ? '0 20px 80px rgba(127, 215, 205, 0.3)' : 'none',
                order: i === 0 ? 2 : (i === 1 ? 1 : 3)
              }}
            >
              <div style={{ fontSize: '12px', color: i === 0 ? 'var(--color-teal)' : 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '10px', fontWeight: '900', letterSpacing: '2px' }}>
                {i === 0 ? '🏆 1 МЕСТО' : `${i + 1} МЕСТО`}
              </div>
              <div style={{ fontSize: i === 0 ? '42px' : '28px', fontWeight: '900', color: 'white', marginBottom: '5px' }}>{p.name}</div>
              <div style={{ fontSize: i === 0 ? '32px' : '22px', fontWeight: '900', color: i === 0 ? 'var(--color-teal)' : 'var(--color-pink)' }}>{p.score}</div>
            </motion.div>
          ))}
        </div>

        <button
          className="btn-glass"
          style={{ 
            padding: '20px 60px', fontSize: '22px', 
            background: 'var(--color-pink) !important', color: 'white !important', 
            borderRadius: 'var(--radius-lg) !important', fontWeight: '900',
            boxShadow: '0 0 50px rgba(232, 93, 141, 0.3)',
            animation: 'pulseStart 2s infinite',
            border: 'none !important'
          }}
          onClick={() => {
            updateState({
              screen: 'START',
              players: [],
              host: '',
              currentRound: null,
              currentQuestion: null,
              removedSuperTopics: [],
              openedQuestions: []
            });
          }}
        >
          НОВАЯ ИГРА 🔄
        </button>
      </div>

      {/* FIXED RIGHT SIDEBAR - Final Standings */}
      <div style={{ width: '320px', height: '100vh', background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(40px)', borderLeft: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', padding: '40px 25px', zIndex: 2 }}>
        <h3 style={{ fontSize: '10px', color: 'var(--color-text-muted)', letterSpacing: '4px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '30px' }}>ИТОГОВАЯ ТАБЛИЦА</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', overflowY: 'auto', paddingRight: '5px' }}>
          {sortedPlayers.map((p, idx) => (
            <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ fontSize: '16px', color: 'var(--color-text-muted)', fontWeight: 'bold' }}>{idx + 1}</span>
                <span style={{ fontSize: '20px', fontWeight: '800', color: idx < 3 ? 'white' : 'rgba(255,255,255,0.6)' }}>{p.name}</span>
              </div>
              <span style={{ fontSize: '20px', fontWeight: '900', color: idx === 0 ? 'var(--color-teal)' : 'var(--color-pink)' }}>{p.score}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
