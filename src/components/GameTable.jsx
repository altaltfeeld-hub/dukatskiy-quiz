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
    <div className="container" style={{ height: '100vh', display: 'flex', flexDirection: 'column', padding: '20px', overflow: 'hidden' }}>
      
      {/* Background Icons Layer (Reverted) */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 0, overflow: 'hidden', display: 'flex', flexWrap: 'wrap', gap: '80px', padding: '40px', justifyContent: 'center', opacity: 0.05 }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div key={i} animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 7 + i, repeat: Infinity }} style={{ width: '80px', height: '80px', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundImage: i % 2 === 0 ? 'url(/emblem.jpg)' : 'url(/rat.jpg)', filter: 'grayscale(100%)' }} />
        ))}
      </div>

      <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
          
          {/* Header Row - Compact */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
             <div style={{ textAlign: 'left' }}>
               <h2 style={{ fontSize: '18px', color: 'var(--color-teal)', fontWeight: '900', letterSpacing: '2px' }}>
                 {state.currentRound === 'R1' ? 'РАУНД 1' : 'РАУНД 2'}
               </h2>
               <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontWeight: '900' }}>
                 ОТКРЫТО: {state.currentRound === 'R1' ? openedR1Count : openedR2Count} / {state.currentRound === 'R1' ? 15 : 25}
               </div>
             </div>

             <div style={{ display: 'flex', gap: '10px' }}>
               {players.map(p => (
                 <div key={p.id} className="btn-glass" style={{ padding: '6px 12px', fontSize: '12px', textAlign: 'center', minWidth: '60px' }}>
                    <div style={{ opacity: 0.5, fontSize: '9px' }}>{p.name}</div>
                    <div style={{ fontWeight: '900', color: 'var(--color-pink)' }}>{p.score}</div>
                 </div>
               ))}
             </div>

             <div style={{ display: 'flex', gap: '10px' }}>
                {role === 'HOST' && <button className="btn-glass" style={{ padding: '8px 15px', fontSize: '10px', fontWeight: 'bold' }} onClick={() => updateState({ screen: 'START' })}>🏠 ГЛАВНАЯ</button>}
                {role === 'HOST' && <button className="btn-glass" style={{ padding: '8px 15px', fontSize: '10px', fontWeight: 'bold' }} onClick={() => updateState({ screen: 'ROUND_SELECT' })}>РАУНДЫ</button>}
             </div>
          </div>

          {/* Grid Container - No Scroll Fix */}
          <div className="btn-glass" style={{ flex: 1, padding: '10px', borderRadius: 'var(--radius-lg) !important', background: 'rgba(255,255,255,0.02) !important', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
             <div style={{ 
               display: 'grid', 
               gridTemplateColumns: `minmax(180px, 1.2fr) repeat(${roundData[0].questions.length}, 1fr)`, 
               gap: '8px',
               height: '100%',
               width: '100%'
             }}>
                {roundData.map((topicData, tIdx) => (
                  <React.Fragment key={topicData.topic}>
                    {/* Topic Name */}
                    <div style={{ 
                      background: 'rgba(255,255,255,0.04)', padding: '12px', display: 'flex', alignItems: 'center', 
                      fontWeight: '900', borderLeft: '4px solid var(--color-teal)',
                      textTransform: 'uppercase', fontSize: '10px', lineHeight: '1.2',
                      borderRadius: 'var(--radius-sm)'
                    }}>
                      {topicData.topic}
                    </div>

                    {/* Questions Cells */}
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
                            background: isOpened ? 'rgba(0,0,0,0.2)' : 'rgba(232, 93, 141, 0.05) !important',
                            border: isOpened ? '1px dashed rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.05) !important',
                            fontSize: 'clamp(18px, 2.5vw, 32px)', 
                            color: isOpened ? 'rgba(255,255,255,0.1)' : 'white',
                            fontWeight: '900',
                            borderRadius: 'var(--radius-sm) !important'
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

          {/* Bottom Round transition buttons (If any) */}
          {role === 'HOST' && (isR1Done || isR2Done) && (
            <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'center' }}>
               <button className="btn-glass" style={{ padding: '12px 40px', background: 'linear-gradient(135deg, var(--color-teal), var(--color-pink)) !important', color: 'white !important', fontWeight: '900', fontSize: '16px' }} onClick={() => updateState({ screen: 'TABLE', currentRound: isR1Done ? 'R2' : 'SUPER', currentQuestion: null })}>СЛЕДУЮЩИЙ РАУНД Р2 ⏩</button>
            </div>
          )}
      </div>
    </div>
  );
}
