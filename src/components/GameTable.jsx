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

  // Sleek Sidebar Scoreboard (Consistent with QuestionScreen & SuperGame)
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
             <div>
               <span style={{ color: 'var(--color-teal)', fontWeight: '900', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '4px' }}>
                 {state.currentRound === 'R1' ? 'РАУНД 1: ПОГРУЖЕНИЕ' : 'РАУНД 2: ОБОСТРЕНИЕ'}
               </span>
               <span style={{ color: 'white', margin: '0 15px', opacity: 0.3 }}>|</span>
               <span style={{ color: 'var(--color-text-muted)', fontSize: '12px', fontWeight: 'bold' }}>
                 Вопросов открыто: {state.currentRound === 'R1' ? openedR1Count : openedR2Count} / {state.currentRound === 'R1' ? 15 : 25}
               </span>
             </div>
             
             <div style={{ display: 'flex', gap: '10px' }}>
               {role === 'HOST' && (
                 <>
                   <button className="btn-glass" style={{ padding: '8px 16px', fontSize: '11px', fontWeight: 'bold' }} onClick={() => updateState({ screen: 'START' })}>🏠 ГЛАВНАЯ</button>
                   <button className="btn-glass" style={{ padding: '8px 16px', fontSize: '11px', fontWeight: 'bold' }} onClick={() => updateState({ screen: 'ROUND_SELECT' })}>РАУНДЫ ➡️</button>
                 </>
               )}
             </div>
          </div>

          {/* Grid Area - Center */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '30px 40px', display: 'flex', alignItems: 'center' }}>
            <div className="btn-glass" style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-lg) !important', background: 'rgba(255,255,255,0.01) !important', border: '1px solid rgba(255,255,255,0.05) !important' }}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: `minmax(200px, 1.5fr) repeat(${roundData[0].questions.length}, 1fr)`, 
                gap: '8px',
                width: '100%'
              }}>
                {roundData.map((topicData, tIdx) => (
                  <React.Fragment key={topicData.topic}>
                    {/* Topic Name */}
                    <div style={{ 
                      background: 'rgba(255,255,255,0.04)', padding: '20px', display: 'flex', alignItems: 'center', 
                      fontWeight: '900', borderLeft: '4px solid var(--color-teal)',
                      textTransform: 'uppercase', minWidth: '200px', fontSize: '12px', lineHeight: '1.3',
                      borderRadius: 'var(--radius-md) 0 0 var(--radius-md)'
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
                            minHeight: '85px',
                            background: isOpened ? 'rgba(0,0,0,0.1)' : 'rgba(232, 93, 141, 0.08) !important',
                            border: isOpened ? '1px dashed rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.05) !important',
                            fontSize: 'clamp(24px, 3vw, 42px)', 
                            color: isOpened ? 'rgba(255,255,255,0.1)' : 'white',
                            fontWeight: '900',
                            cursor: (isOpened || role !== 'HOST') ? 'default' : 'pointer',
                            transition: 'all 0.2s ease',
                            borderRadius: 'var(--radius-md) !important'
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
          </div>

          {/* Bottom Transition Bar (Host Only) */}
          {role === 'HOST' && (isR1Done || isR2Done) && (
            <div style={{ padding: '20px', background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(20px)', display: 'flex', justifyContent: 'center' }}>
                <button 
                  className="btn-glass" 
                  style={{ 
                    padding: '16px 48px', borderRadius: 'var(--radius-lg) !important', fontSize: '20px', 
                    background: 'linear-gradient(135deg, var(--color-teal), var(--color-pink)) !important', 
                    color: 'white !important', fontWeight: '900', boxShadow: 'var(--shadow-glow-pink)',
                    border: 'none !important'
                  }} 
                  onClick={() => updateState({ screen: 'TABLE', currentRound: isR1Done ? 'R2' : 'SUPER', currentQuestion: null })}
                >
                  ПЕРЕЙТИ К {isR1Done ? 'РАУНДУ 2' : 'СУПЕР-ИГРЕ'} 🚀
                </button>
            </div>
          )}
      </div>

      {/* Consistent Vertical Scoreboard Sidebar */}
      <BroadcastScoreboard />
    </div>
  );
}
