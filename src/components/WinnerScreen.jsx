import React from 'react';
import { motion } from 'framer-motion';

export default function WinnerScreen({ state, updateState }) {
  // Sort players by score
  const sortedPlayers = [...state.players].sort((a, b) => b.score - a.score);
  const maxScore = sortedPlayers[0]?.score || 0;
  
  // Find winners (handles ties)
  const winners = sortedPlayers.filter(p => p.score === maxScore);

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: '100vh', overflow: 'hidden' }}>
      
      {/* CSS Confetti Animation (Lightweight) */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
         {Array.from({ length: 40 }).map((_, i) => (
           <div key={`confetti-${i}`} style={{
             position: 'absolute',
             width: '8px', height: '14px',
             background: i % 2 === 0 ? 'var(--color-pink)' : 'var(--color-teal)',
             left: `${Math.random() * 100}%`,
             top: `-20px`,
             opacity: 0.6,
             animation: `fall ${4 + Math.random() * 4}s linear infinite`,
             animationDelay: `${Math.random() * 5}s`,
             transform: `rotate(${Math.random() * 360}deg)`
           }} />
         ))}
      </div>
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 0.8; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
      `}</style>

      <div className="stacked-content" style={{ alignItems: 'center', position: 'relative', zIndex: 1 }}>
        <motion.h1 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.6, duration: 1 }}
          style={{ fontSize: 'clamp(40px, 10vw, 84px)', color: 'var(--color-pink)', margin: '0 0 20px 0', textShadow: '0 0 40px rgba(232, 93, 141, 0.4)' }}
        >
          ПОБЕДИТЕЛЬ!
        </motion.h1>

        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '40px' }}>
          {winners.map(winner => (
            <motion.div 
              key={winner.id}
              initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
              className="btn-glass"
              style={{ 
                padding: '30px 50px', borderRadius: 'var(--radius-lg)', 
                background: 'rgba(127, 215, 205, 0.1) !important',
                border: '1px solid var(--color-teal) !important',
                boxShadow: '0 20px 60px rgba(127, 215, 205, 0.2)'
              }}
            >
              <h2 style={{ color: 'var(--color-teal)', fontSize: 'clamp(32px, 5vw, 64px)', margin: 0 }}>{winner.name}</h2>
              <div style={{ fontSize: '24px', color: 'var(--color-text-main)', marginTop: '8px', fontWeight: 'bold' }}>{winner.score} баллов</div>
            </motion.div>
          ))}
        </div>

        <div className="btn-glass" style={{ width: '100%', maxWidth: '600px', padding: '30px', borderRadius: 'var(--radius-lg)', textAlign: 'left' }}>
          <h3 style={{ color: 'var(--color-pink-dark)', marginBottom: '20px', fontSize: '18px', textTransform: 'uppercase' }}>Итоговая таблица:</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {sortedPlayers.map((p, idx) => (
              <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: idx !== sortedPlayers.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', fontSize: '20px' }}>
                <span style={{ color: idx === 0 ? 'var(--color-teal)' : 'inherit', fontWeight: idx === 0 ? 'bold' : 'normal' }}>
                  {idx + 1}. {p.name}
                </span>
                <span style={{ color: 'var(--color-pink)', fontWeight: 'bold' }}>{p.score}</span>
              </div>
            ))}
          </div>
        </div>

        <button 
          className="btn-glass"
          style={{ padding: '20px 60px', fontSize: '20px', background: 'var(--color-pink) !important', color: 'white !important', borderRadius: 'var(--radius-md)', alignSelf: 'center', marginTop: '20px' }}
          onClick={() => {
             updateState({ screen: 'START', players: [], host: '', currentRound: 0, currentQuestion: null, removedSuperTopics: [] });
          }}>
          НА ГЛАВНЫЙ ЭКРАН
        </button>
      </div>
      
    </div>
  );
}
