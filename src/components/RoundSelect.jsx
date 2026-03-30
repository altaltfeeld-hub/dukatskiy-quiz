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

  // Sleek Sidebar Scoreboard (Consistent with GameTable & QuestionScreen)
  const BroadcastScoreboard = () => (
    <div style={{ 
      width: '240px', height: '100vh', 
      background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(30px)',
      borderLeft: '1px solid rgba(255,255,255,0.1)',
      display: 'flex', flexDirection: 'column', padding: '30px 20px', zIndex: 100
    }}>
      <div style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--color-teal)', letterSpacing: '2px', fontWeight: '900', marginBottom: '25px', opacity: 0.7 }}>
        Счёт игры
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto' }}>
        {players.sort((a, b) => b.score - a.score).map((p, idx) => (
          <motion.div 
            key={p.id}
            initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
            style={{ 
              display: 'flex', flexDirection: 'column', gap: '4px',
              borderLeft: idx === 0 ? '3px solid var(--color-teal)' : '1px solid rgba(255,255,255,0.1)',
              paddingLeft: '15px'
            }}
          >
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', fontWeight: 'bold' }}>{p.name}</div>
            <div style={{ fontSize: '24px', color: idx === 0 ? 'white' : 'var(--color-pink)', fontWeight: '900' }}>{p.score}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="container" style={{ height: '100vh', width: '100vw', display: 'flex', padding: 0, overflow: 'hidden' }}>
      
      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', position: 'relative' }}>
          
          {/* Top Info Bar */}
          <div style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
             <span style={{ color: 'var(--color-teal)', fontWeight: '900', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '4px' }}>ВЫБОР РАУНДА</span>
             <button className="btn-glass" style={{ padding: '8px 16px', fontSize: '11px', fontWeight: 'bold' }} onClick={() => updateState({ screen: 'START' })}>🏠 ГЛАВНАЯ</button>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
            <motion.h1 initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ fontSize: 'clamp(32px, 8vw, 64px)', color: 'white', textAlign: 'center', marginBottom: '3rem', letterSpacing: '8px', fontWeight: '900', textShadow: '0 0 40px rgba(127, 215, 205, 0.3)' }}>
              СТРУКТУРА ИГРЫ
            </motion.h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', width: '100%', maxWidth: '600px' }}>
              {/* Round 1 */}
              <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
                <button 
                  className="btn-glass"
                  style={{ width: '100%', padding: '40px', fontSize: '32px', borderRadius: 'var(--radius-lg) !important', border: '1px solid var(--color-teal) !important', fontWeight: '900' }}
                  onClick={() => updateState({ screen: 'TABLE', currentRound: 'R1' })}
                >
                  РАУНД 1
                </button>
                <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '14px', color: 'var(--color-teal)', fontWeight: '900', letterSpacing: '2px' }}>
                  {getProgressLabel(openedR1, totalR1)}
                </div>
              </motion.div>
              
              {/* Round 2 */}
              <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }} style={{ opacity: isR1Complete ? 1 : 0.5 }}>
                <button 
                  disabled={!isR1Complete}
                  className="btn-glass"
                  style={{ width: '100%', padding: '40px', fontSize: '32px', borderRadius: 'var(--radius-lg) !important', border: isR1Complete ? '1px solid var(--color-pink) !important' : '1px solid rgba(255,255,255,0.1) !important', cursor: isR1Complete ? 'pointer' : 'not-allowed', fontWeight: '900' }}
                  onClick={() => updateState({ screen: 'TABLE', currentRound: 'R2' })}
                >
                  {!isR1Complete && <span style={{ marginRight: '15px', fontSize: '24px' }}>🔒</span>}
                  РАУНД 2
                </button>
                <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '14px', color: isR1Complete ? 'var(--color-pink)' : 'var(--color-text-muted)', fontWeight: '900', letterSpacing: '2px' }}>
                  {isR1Complete ? getProgressLabel(openedR2, totalR2) : "СНАЧАЛА ЗАВЕРШИТЕ РАУНД 1"}
                </div>
              </motion.div>
              
              {/* Super Game */}
              <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }} style={{ opacity: isR2Complete ? 1 : 0.5 }}>
                <button 
                  disabled={!isR2Complete}
                  className="btn-glass"
                  style={{ 
                    width: '100%', padding: '40px', fontSize: '32px', borderRadius: 'var(--radius-lg) !important', 
                    background: isR2Complete ? 'linear-gradient(135deg, var(--color-pink), var(--color-teal)) !important' : 'rgba(255,255,255,0.05) !important',
                    color: isR2Complete ? 'var(--color-bg-deep) !important' : 'var(--color-text-muted) !important', 
                    fontWeight: '900', border: 'none !important',
                    cursor: isR2Complete ? 'pointer' : 'not-allowed',
                    boxShadow: isR2Complete ? '0 0 50px rgba(232, 93, 141, 0.3)' : 'none'
                  }}
                  onClick={() => updateState({ screen: 'SUPER_GAME', currentRound: 'SUPER' })}
                >
                  {!isR2Complete && <span style={{ marginRight: '15px', fontSize: '24px' }}>🔒</span>}
                  СУПЕР-ИГРА
                </button>
                <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '14px', color: isR2Complete ? 'white' : 'var(--color-text-muted)', fontWeight: '900', letterSpacing: '2px' }}>
                  {!isR2Complete && "СНАЧАЛА ЗАВЕРШИТЕ РАУНД 2"}
                </div>
              </motion.div>
            </div>
          </div>
      </div>

      {/* Consistent Vertical Scoreboard Sidebar */}
      <BroadcastScoreboard />
    </div>
  );
}
