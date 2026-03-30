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

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', zIndex: 1 }}>
        <motion.h1 
          initial={{ y: -20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          style={{ fontSize: 'clamp(32px, 5vw, 56px)', color: 'white', letterSpacing: '8px', fontWeight: '900', marginBottom: '3rem', textShadow: '0 0 40px rgba(255,255,255,0.1)' }}
        >
          ВЫБОР РАУНДА
        </motion.h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', width: '100%', maxWidth: '450px' }}>
          {/* Round 1 */}
          <div style={{ width: '100%' }}>
            <button 
              className="btn-glass"
              style={{ width: '100%', padding: '30px', fontSize: '24px', borderRadius: 'var(--radius-lg) !important', border: '2px solid var(--color-teal) !important', fontWeight: '900', transition: 'transform 0.2s' }}
              onClick={() => updateState({ screen: 'TABLE', currentRound: 'R1' })}
            >
              РАУНД 1
            </button>
            <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '11px', color: 'var(--color-teal)', fontWeight: '900', letterSpacing: '2px' }}>{getProgressLabel(openedR1, totalR1)}</div>
          </div>
          
          {/* Round 2 */}
          <div style={{ width: '100%', opacity: isR1Complete ? 1 : 0.4 }}>
            <button 
              disabled={!isR1Complete}
              className="btn-glass"
              style={{ width: '100%', padding: '30px', fontSize: '24px', borderRadius: 'var(--radius-lg) !important', border: isR1Complete ? '2px solid var(--color-pink) !important' : '1px solid rgba(255,255,255,0.1) !important', fontWeight: '900' }}
              onClick={() => updateState({ screen: 'TABLE', currentRound: 'R2' })}
            >
              {!isR1Complete && "🔒 "}РАУНД 2
            </button>
            <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '11px', color: isR1Complete ? 'var(--color-pink)' : 'var(--color-text-muted)', fontWeight: '900', letterSpacing: '2px' }}>{isR1Complete ? getProgressLabel(openedR2, totalR2) : "ЗАВЕРШИТЕ Р1 СНАЧАЛА"}</div>
          </div>
          
          {/* Super Game */}
          <div style={{ width: '100%', opacity: isR2Complete ? 1 : 0.4 }}>
            <button 
              disabled={!isR2Complete}
              className="btn-glass"
              style={{ width: '100%', padding: '30px', fontSize: '24px', borderRadius: 'var(--radius-lg) !important', background: isR2Complete ? 'linear-gradient(135deg, var(--color-pink), var(--color-teal)) !important' : 'rgba(255,255,255,0.05) !important', color: isR2Complete ? 'white' : 'var(--color-text-muted)', fontWeight: '900', border: 'none !important', boxShadow: isR2Complete ? '0 0 40px rgba(0,0,0,0.3)' : 'none' }}
              onClick={() => updateState({ screen: 'SUPER_GAME', currentRound: 'SUPER' })}
            >
              {!isR2Complete && "🔒 "}СУПЕР-ИГРА
            </button>
          </div>
        </div>

        <button className="btn-glass" style={{ marginTop: '50px', padding: '12px 25px', fontSize: '12px', opacity: 0.5, fontWeight: '800' }} onClick={() => updateState({ screen: 'START' })}>ВЕРНУТЬСЯ В МЕНЮ</button>
      </div>

      {/* FIXED RIGHT SIDEBAR - Scoreboard */}
      <div style={{ width: '260px', height: '100vh', background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(30px)', borderLeft: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', padding: '30px 20px', zIndex: 2 }}>
        <h3 style={{ fontSize: '10px', color: 'var(--color-text-muted)', letterSpacing: '4px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '20px' }}>ТЕКУЩИЙ СЧЁТ</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {players.map(p => (
            <div key={p.id} className="btn-glass" style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03) !important' }}>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '12px', fontWeight: '800', color: 'white' }}>{p.name}</div>
                <div style={{ fontSize: '20px', fontWeight: '900', color: 'var(--color-pink)' }}>{p.score}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
