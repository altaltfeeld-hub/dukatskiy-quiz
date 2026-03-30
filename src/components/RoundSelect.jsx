import React from 'react';
import { motion } from 'framer-motion';

export default function RoundSelect({ state, updateState }) {
  const players = state.players || [];
  const openedQuestions = state.openedQuestions || [];
  
  const openedR1 = openedQuestions.filter(q => q.startsWith('R1_')).length;
  const openedR2 = openedQuestions.filter(q => q.startsWith('R2_')).length;
  
  const totalR1 = 15;
  const totalR2 = 25;

  const isR1Complete = openedR1 >= totalR1;
  const isR2Complete = openedR2 >= totalR2;

  const getProgressLabel = (opened, total) => {
    if (opened === 0) return "НЕ НАЧАТ";
    if (opened >= total) return "ЗАВЕРШЕН ✅";
    return `ПРОГРЕСС: ${opened}/${total}`;
  };

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', overflow: 'hidden' }}>
      
      {/* Background Icons Layer (Consistency) */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 0, opacity: 0.05, display: 'flex', flexWrap: 'wrap', gap: '100px', justifyContent: 'center', padding: '60px' }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div key={i} animate={{ opacity: [0.3, 0.6, 0.3], y: [0, -10, 0] }} transition={{ duration: 5 + i, repeat: Infinity }} style={{ width: '100px', height: '100px', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundImage: i % 2 === 0 ? 'url(/emblem.jpg)' : 'url(/rat.jpg)', filter: 'grayscale(100%)' }} />
        ))}
      </div>

      <div className="stacked-content" style={{ alignItems: 'center', zIndex: 1, width: '100%', maxWidth: '800px' }}>
        
        {/* Top Minimal Scoreboard */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {players.map(p => (
            <div key={p.id} className="btn-glass" style={{ padding: '8px 15px', textAlign: 'center', minWidth: '80px' }}>
              <div style={{ fontSize: '10px', opacity: 0.5, fontWeight: '900' }}>{p.name}</div>
              <div style={{ fontSize: '18px', fontWeight: '900', color: 'var(--color-teal)' }}>{p.score}</div>
            </div>
          ))}
        </div>

        <motion.h1 initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ fontSize: 'clamp(32px, 5vw, 64px)', color: 'white', letterSpacing: '6px', fontWeight: '900', marginBottom: '2rem' }}>ВЫБОР РАУНДА</motion.h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', maxWidth: '500px' }}>
          {/* Round 1 */}
          <div style={{ width: '100%' }}>
            <button 
              className="btn-glass"
              style={{ width: '100%', padding: '25px', fontSize: '24px', borderRadius: 'var(--radius-lg) !important', border: '1px solid var(--color-teal) !important', fontWeight: '900' }}
              onClick={() => updateState({ screen: 'TABLE', currentRound: 'R1' })}
            >
              РАУНД 1
            </button>
            <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '12px', color: 'var(--color-teal)', fontWeight: '900' }}>{getProgressLabel(openedR1, totalR1)}</div>
          </div>
          
          {/* Round 2 */}
          <div style={{ width: '100%', opacity: isR1Complete ? 1 : 0.5 }}>
            <button 
              disabled={!isR1Complete}
              className="btn-glass"
              style={{ width: '100%', padding: '25px', fontSize: '24px', borderRadius: 'var(--radius-lg) !important', border: isR1Complete ? '1px solid var(--color-pink) !important' : '1px solid rgba(255,255,255,0.1) !important', fontWeight: '900' }}
              onClick={() => updateState({ screen: 'TABLE', currentRound: 'R2' })}
            >
              {!isR1Complete && "🔒 "}РАУНД 2
            </button>
            <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '12px', color: isR1Complete ? 'var(--color-pink)' : 'var(--color-text-muted)', fontWeight: '900' }}>{isR1Complete ? getProgressLabel(openedR2, totalR2) : "ЗАВЕРШИТЕ Р1"}</div>
          </div>
          
          {/* Super Game */}
          <div style={{ width: '100%', opacity: isR2Complete ? 1 : 0.5 }}>
            <button 
              disabled={!isR2Complete}
              className="btn-glass"
              style={{ width: '100%', padding: '25px', fontSize: '24px', borderRadius: 'var(--radius-lg) !important', background: isR2Complete ? 'linear-gradient(135deg, var(--color-pink), var(--color-teal)) !important' : 'rgba(255,255,255,0.05) !important', color: isR2Complete ? 'white' : 'var(--color-text-muted)', fontWeight: '900', border: 'none !important' }}
              onClick={() => updateState({ screen: 'SUPER_GAME', currentRound: 'SUPER' })}
            >
              {!isR2Complete && "🔒 "}СУПЕР-ИГРА
            </button>
          </div>
        </div>

        <button className="btn-glass" style={{ marginTop: '30px', padding: '10px 20px', fontSize: '12px', opacity: 0.5 }} onClick={() => updateState({ screen: 'START' })}>На главную</button>
      </div>
    </div>
  );
}
