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
    <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: '100vh', overflow: 'hidden', padding: '40px 20px' }}>
      
      {/* VFX Overlay */}
      <motion.div 
        animate={{ opacity: [0, 0.15, 0, 0.1, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        style={{ position: 'fixed', inset: 0, background: 'white', pointerEvents: 'none', zIndex: 0 }}
      />

      {/* Confetti */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
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

      <div className="stacked-content" style={{ alignItems: 'center', position: 'relative', zIndex: 1, width: '100%', maxWidth: '1100px' }}>
        
        <motion.div 
          initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1 }}
          style={{ marginBottom: '40px' }}
        >
          <div style={{ fontSize: '24px', color: 'var(--color-teal)', fontWeight: '900', letterSpacing: '8px', marginBottom: '10px' }}>ИГРА ЗАВЕРШЕНА</div>
          <h1 style={{ fontSize: 'clamp(48px, 12vw, 96px)', color: 'white', fontWeight: '900', lineHeight: 1, margin: 0, textShadow: '0 0 60px rgba(232, 93, 141, 0.4)' }}>
            ПОБЕДИТЕЛЬ!
          </h1>
        </motion.div>

        {/* Winner Podium Cards */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '25px', justifyContent: 'center', marginBottom: '60px', width: '100%' }}>
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
                minWidth: i === 0 ? '320px' : '240px',
                background: i === 0 ? 'rgba(127, 215, 205, 0.15) !important' : 'rgba(255,255,255,0.03) !important',
                border: i === 0 ? '3px solid var(--color-teal) !important' : '1px solid rgba(255,255,255,0.1) !important',
                boxShadow: i === 0 ? '0 20px 80px rgba(127, 215, 205, 0.3)' : 'none',
                order: i === 0 ? 2 : (i === 1 ? 1 : 3) // Center the winner
              }}
            >
              <div style={{ fontSize: '14px', color: i === 0 ? 'var(--color-teal)' : 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '10px', fontWeight: '900', letterSpacing: '2px' }}>
                {i === 0 ? '🏆 1 МЕСТО' : `${i + 1} МЕСТО`}
              </div>
              <div style={{ fontSize: i === 0 ? '48px' : '32px', fontWeight: '900', color: 'white', marginBottom: '8px' }}>{p.name}</div>
              <div style={{ fontSize: i === 0 ? '36px' : '24px', fontWeight: '900', color: i === 0 ? 'var(--color-teal)' : 'var(--color-pink)' }}>{p.score}</div>
            </motion.div>
          ))}
        </div>

        {/* Final Standings Small Table */}
        <div className="btn-glass" style={{ width: '100%', maxWidth: '700px', padding: '40px', borderRadius: 'var(--radius-lg) !important', background: 'rgba(255,255,255,0.01) !important', textAlign: 'left', marginBottom: '50px' }}>
           <h3 style={{ fontSize: '14px', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '30px', letterSpacing: '4px', fontWeight: '900' }}>ИТОГОВАЯ ТАБЛИЦА</h3>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
             {sortedPlayers.map((p, idx) => (
               <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: idx !== sortedPlayers.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                   <span style={{ fontSize: '18px', color: 'var(--color-text-muted)', fontWeight: 'bold', width: '25px' }}>{idx + 1}</span>
                   <span style={{ fontSize: '24px', fontWeight: '800', color: idx < 3 ? 'white' : 'rgba(255,255,255,0.6)' }}>{p.name}</span>
                 </div>
                 <span style={{ fontSize: '24px', fontWeight: '900', color: idx === 0 ? 'var(--color-teal)' : 'var(--color-pink)' }}>{p.score}</span>
               </div>
             ))}
           </div>
        </div>

        {/* Reboot Button */}
        <button
          className="btn-glass"
          style={{ 
            padding: '24px 64px', fontSize: '24px', 
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
    </div>
  );
}
