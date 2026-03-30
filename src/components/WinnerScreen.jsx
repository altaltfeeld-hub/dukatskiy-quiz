import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export default function WinnerScreen({ state, updateState }) {
  const sortedPlayers = [...state.players].sort((a, b) => b.score - a.score);
  const maxScore = sortedPlayers[0]?.score || 0;
  const winners = sortedPlayers.filter(p => p.score === maxScore);

  // Stabilized multicolored confetti (prevents jitter on parent re-renders)
  const confettiList = useMemo(() => {
    const colors = ['#E85D8D', '#7FD7CD', '#FFD700', '#4169E1', '#9370DB', '#32CD32'];
    return Array.from({ length: 50 }).map((_, i) => ({
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4,
      size: 6 + Math.random() * 8,
      color: colors[i % colors.length],
      rotate: Math.random() * 360
    }));
  }, []);

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: '100vh', overflow: 'hidden' }}>
      
      {/* VFX Fashes Overlay */}
      <motion.div 
        animate={{ opacity: [0, 0.1, 0, 0.05, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        style={{ position: 'fixed', inset: 0, background: 'white', pointerEvents: 'none', zIndex: 0 }}
      />

      {/* Confetti Animation */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
         {confettiList.map((c, i) => (
           <div key={`c-${i}`} style={{
             position: 'absolute',
             width: `${c.size}px`, height: `${c.size * 1.5}px`,
             background: c.color,
             left: c.left,
             top: `-20px`,
             opacity: 0.8,
             borderRadius: '2px',
             animation: `fall ${c.duration}s linear infinite`,
             animationDelay: `${c.delay}s`,
             transform: `rotate(${c.rotate}deg)`
           }} />
         ))}
      </div>
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
      `}</style>

      <div className="stacked-content" style={{ alignItems: 'center', position: 'relative', zIndex: 1, width: '100%', maxWidth: '1000px' }}>
        <motion.h1 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.5, duration: 1 }}
          style={{ fontSize: 'clamp(40px, 10vw, 84px)', color: 'var(--color-pink)', margin: '0 0 20px 0', textShadow: '0 0 50px rgba(232, 93, 141, 0.6)', letterSpacing: '8px' }}
        >
          ПОБЕДИТЕЛЬ!
        </motion.h1>

        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '20px' }}>
          {winners.map((winner, idx) => (
            <motion.div 
              key={winner.id}
              initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 + idx * 0.2, duration: 0.8 }}
              className="btn-glass"
              style={{ 
                padding: '40px 60px', borderRadius: 'var(--radius-lg)', 
                background: 'rgba(127, 215, 205, 0.12) !important',
                border: '1px solid var(--color-teal) !important',
                boxShadow: '0 20px 80px rgba(127, 215, 205, 0.3)',
                minWidth: '300px'
              }}
            >
              <h2 style={{ color: 'var(--color-teal)', fontSize: 'clamp(32px, 5vw, 64px)', marginBottom: '10px' }}>{winner.name}</h2>
              <div style={{ fontSize: '28px', color: 'var(--color-text-main)', fontWeight: '900', letterSpacing: '2px' }}>{winner.score} БАЛЛОВ</div>
            </motion.div>
          ))}
        </div>

        {/* Winner Plaque / Reward Message */}
        <motion.div
           initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 1.2, type: 'spring' }}
           className="btn-glass"
           style={{ 
             padding: '24px 40px', borderRadius: 'var(--radius-md)', 
             background: 'rgba(232, 93, 141, 0.1) !important',
             border: '2px solid var(--color-pink) !important',
             boxShadow: '0 0 40px rgba(232, 93, 141, 0.2)',
             marginBottom: '40px', maxWidth: '600px'
           }}
        >
           <h3 style={{ fontSize: '24px', color: 'white', lineHeight: '1.4', textTransform: 'none', margin: 0 }}>
             🏆 <span style={{ color: 'var(--color-pink)' }}>Можешь забрать с полки дукатский пряник!</span>
           </h3>
        </motion.div>

        {/* Final Standings Table */}
        <div className="btn-glass" style={{ width: '100%', maxWidth: '700px', padding: '40px', borderRadius: 'var(--radius-lg)', textAlign: 'left', background: 'rgba(255,255,255,0.02) !important' }}>
          <h3 style={{ color: 'var(--color-text-muted)', marginBottom: '30px', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '4px' }}>Итоговая таблица:</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {sortedPlayers.map((p, idx) => (
              <div key={p.id} style={{ 
                display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', 
                borderBottom: idx !== sortedPlayers.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', 
                fontSize: '22px', alignItems: 'center'
              }}>
                <span style={{ color: idx === 0 ? 'var(--color-teal)' : 'rgba(255,255,255,0.7)', fontWeight: idx === 0 ? '900' : '500' }}>
                  <span style={{ opacity: 0.3, marginRight: '15px' }}>{idx + 1}</span> {p.name}
                </span>
                <span style={{ color: 'var(--color-pink)', fontWeight: '900' }}>{p.score}</span>
              </div>
            ))}
          </div>
        </div>

        <button 
          className="btn-glass"
          style={{ padding: '24px 80px', fontSize: '18px', background: 'var(--color-pink) !important', color: 'white !important', borderRadius: 'var(--radius-lg)', alignSelf: 'center', marginTop: '40px', border: 'none !important' }}
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
          }}>
          НОВАЯ ИГРА
        </button>
      </div>
      
    </div>
  );
}
