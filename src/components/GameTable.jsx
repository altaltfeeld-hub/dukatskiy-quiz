import React from 'react';
import { motion } from 'framer-motion';
import { R1_DATA, R2_DATA } from '../data';

export default function GameTable({ state, updateState, role }) {
  const roundData = (state.currentRound === 'R1' ? R1_DATA : R2_DATA) || R1_DATA[0].questions;
  const players = state.players || [];
  const openedQuestions = state.openedQuestions || [];

  const openedR1Count = openedQuestions.filter(q => q.startsWith('R1_')).length;
  const openedR2Count = openedQuestions.filter(q => q.startsWith('R2_')).length;
  const isR1Done = state.currentRound === 'R1' && openedR1Count >= 15;
  const isR2Done = state.currentRound === 'R2' && openedR2Count >= 25;

  const handleQuestionClick = (topicIdx, questionIdx, questionData) => {
    if (role !== 'HOST') return;
    const qId = `${state.currentRound}_${topicIdx}_${questionIdx}`;
    if (openedQuestions.includes(qId)) return;

    updateState({
      screen: 'QUESTION',
      currentQuestion: { ...questionData, id: qId, topic: roundData[topicIdx]?.topic },
      openedQuestions: [...openedQuestions, qId]
    });
  };

  return (
    <div style={{ height: '100vh', display: 'flex', overflow: 'hidden', background: 'var(--color-bg-deep)', position: 'relative' }}>
      
      {/* Restored Background Icons Layer (Drifting) */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 0, opacity: 0.07 }}>
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div 
            key={i} 
            initial={{ x: Math.random() * 100 + '%', y: Math.random() * 100 + '%' }}
            animate={{ 
              x: [Math.random() * 100 + '%', Math.random() * 100 + '%'], 
              y: [Math.random() * 100 + '%', Math.random() * 100 + '%'],
              opacity: [0.2, 0.5, 0.2]
            }} 
            transition={{ duration: 20 + i * 2, repeat: Infinity, ease: "linear" }}
            style={{ position: 'absolute', width: '100px', height: '100px', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundImage: i % 2 === 0 ? 'url(/emblem.jpg)' : 'url(/rat.jpg)', filter: 'grayscale(100%) brightness(1.2)' }} 
          />
        ))}
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px', zIndex: 1, overflow: 'hidden' }}>
        
        {/* Minimal Round Header */}
        <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'baseline', gap: '15px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--color-teal)', letterSpacing: '4px', margin: 0 }}>
            {state.currentRound === 'R1' ? 'РАУНД 1' : 'РАУНД 2'}
          </h1>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontWeight: '800' }}>
            ПРОГРЕСС: {state.currentRound === 'R1' ? openedR1Count : openedR2Count} / {state.currentRound === 'R1' ? 15 : 25}
          </span>
        </div>

        {/* Grid Container */}
        <div className="btn-glass" style={{ flex: 1, padding: '15px', borderRadius: 'var(--radius-lg) !important', background: 'rgba(255,255,255,0.02) !important', display: 'flex', overflow: 'hidden' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: `minmax(200px, 1.2fr) repeat(${roundData[0].questions.length}, 1fr)`, 
            gap: '10px',
            width: '100%',
            height: '100%'
          }}>
            {roundData.map((topicData, tIdx) => (
              <React.Fragment key={topicData.topic}>
                {/* Topic Card */}
                <div style={{ 
                  background: 'rgba(255,255,255,0.04)', padding: '15px', display: 'flex', alignItems: 'center', 
                  fontWeight: '900', borderLeft: '5px solid var(--color-teal)',
                  textTransform: 'uppercase', fontSize: '13px', lineHeight: '1.2',
                  borderRadius: 'var(--radius-sm)', color: 'white'
                }}>
                  {topicData.topic}
                </div>

                {/* Score Cells */}
                {topicData.questions.map((q, qIdx) => {
                  const qId = `${state.currentRound}_${tIdx}_${qIdx}`;
                  const isOpened = state.openedQuestions.includes(qId);

                  return (
                    <button 
                      key={qId}
                      disabled={isOpened || role !== 'HOST'}
                      onClick={() => handleQuestionClick(tIdx, qIdx, q)}
                      className={isOpened ? "" : "btn-glass"}
                      style={{ 
                        background: isOpened ? 'rgba(0,0,0,0.3)' : 'rgba(232, 93, 141, 0.05) !important',
                        border: isOpened ? '1px dashed rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.08) !important',
                        fontSize: 'clamp(20px, 3vw, 36px)', 
                        color: isOpened ? 'rgba(255,255,255,0.1)' : 'white',
                        fontWeight: '900',
                        borderRadius: 'var(--radius-sm) !important',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {isOpened ? "✓" : q.cost}
                    </button>
                  )
                })}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Next Round Button - Floating if done */}
        {role === 'HOST' && isR1Done && !isR2Done && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
            <button className="btn-glass" style={{ padding: '15px 45px', background: 'linear-gradient(135deg, var(--color-teal), #5bc8ff) !important', color: 'white !important', fontWeight: '900', fontSize: '18px', boxShadow: '0 0 40px rgba(91,200,255,0.3)', letterSpacing: '1px' }} onClick={() => updateState({ screen: 'TABLE', currentRound: 'R2', currentQuestion: null })}>
              ПЕРЕЙТИ К РАУНДУ 2 ⏩
            </button>
          </motion.div>
        )}

        {/* Super Game Button - Only when R2 complete */}
        {role === 'HOST' && isR2Done && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}
          >
            <motion.button
              animate={{ boxShadow: ['0 0 20px rgba(232,93,141,0.3)', '0 0 60px rgba(232,93,141,0.7)', '0 0 20px rgba(232,93,141,0.3)'] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="btn-glass"
              style={{ padding: '20px 60px', background: 'linear-gradient(135deg, var(--color-pink), #9b59b6) !important', color: 'white !important', fontWeight: '900', fontSize: '22px', letterSpacing: '2px', border: '2px solid rgba(232,93,141,0.5) !important' }}
              onClick={() => updateState({ screen: 'SUPER_GAME', currentRound: 'SUPER', currentQuestion: null })}
            >
              🏆 СУПЕР-ИГРА
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* FIXED RIGHT SIDEBAR - Restored Aesthetic */}
      <div style={{ width: '260px', height: '100vh', background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(30px)', borderLeft: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', padding: '20px 15px', zIndex: 2, overflow: 'hidden' }}>
        
        {/* Nav Buttons at TOP - always visible */}
        {role === 'HOST' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px', flexShrink: 0 }}>
            <button className="btn-glass" style={{ padding: '10px', fontSize: '10px', fontWeight: '900', background: 'rgba(255,255,255,0.05) !important' }} onClick={() => updateState({ screen: 'START' })}>ГЛАВНОЕ МЕНЮ</button>
            <button className="btn-glass" style={{ padding: '10px', fontSize: '10px', fontWeight: '900', background: 'rgba(255,255,255,0.05) !important' }} onClick={() => updateState({ screen: 'ROUND_SELECT' })}>ВЫБОР РАУНДА</button>
          </div>
        )}

        <h3 style={{ fontSize: '9px', color: 'var(--color-text-muted)', letterSpacing: '3px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '12px', flexShrink: 0 }}>СЧЁТ</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }}>
           {players.map(p => (
             <div key={p.id} className="btn-glass" style={{ padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: 'var(--radius-md) !important', background: 'rgba(255,255,255,0.03) !important', flexShrink: 0 }}>
               <div style={{ textAlign: 'left' }}>
                 <div style={{ fontSize: '11px', fontWeight: '800', color: 'white' }}>{p.name}</div>
                 <div style={{ fontSize: '18px', fontWeight: '900', color: 'var(--color-pink)' }}>{p.score}</div>
               </div>
               {p.connected ? <span style={{ fontSize: '10px' }}>🟢</span> : <span style={{ fontSize: '10px', opacity: 0.3 }}>⏳</span>}
             </div>
           ))}
        </div>
      </div>

    </div>
  );
}
