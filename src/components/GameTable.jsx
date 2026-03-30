import React from 'react';
import { R1_DATA, R2_DATA } from '../data';

export default function GameTable({ state, updateState, role }) {
  const roundData = (state.currentRound === 'R1' ? R1_DATA : R2_DATA) || R1_DATA[0].questions;
  const players = state.players || [];
  const openedQuestions = state.openedQuestions || [];

  const openedR1 = openedQuestions.filter(q => q.startsWith('R1_')).length;
  const openedR2 = openedQuestions.filter(q => q.startsWith('R2_')).length;
  const isR1Done = state.currentRound === 'R1' && openedR1 >= 15;
  const isR2Done = state.currentRound === 'R2' && openedR2 >= 25;

  const handleQuestionClick = (topicIdx, questionIdx, questionData) => {
    if (role !== 'HOST') return; // Only host can click

    const qId = `${state.currentRound}_${topicIdx}_${questionIdx}`;
    if (openedQuestions.includes(qId)) return; // Already clicked

    updateState({
      screen: 'QUESTION',
      currentQuestion: { ...questionData, id: qId, topic: roundData[topicIdx]?.topic },
      openedQuestions: [...openedQuestions, qId]
    });
  };

  return (
    <div className="container" style={{ paddingTop: '20px' }}>
      
      {/* Header Area - Prevents Overlaps */}
      <div style={{ width: '100%', display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '10px 0' }}>
        {role === 'HOST' ? (
          <button className="btn-glass" style={{ padding: '8px 16px', fontSize: '12px' }} onClick={() => updateState({ screen: 'START' })}>
            🏠 На главный
          </button>
        ) : <div />}

        {/* Mini Scoreboard - Non-interactive here */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {state.players.map(p => (
            <div key={p.id} className="btn-glass" style={{
              padding: '8px 16px', borderRadius: 'var(--radius-md)', 
              minWidth: '80px', textAlign: 'center', pointerEvents: 'none',
              borderBottom: '2px solid var(--color-teal) !important',
              background: 'rgba(255,255,255,0.02) !important'
            }}>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '10px', textTransform: 'uppercase' }}>{p.name}</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--color-pink)' }}>{p.score}</div>
            </div>
          ))}
        </div>

        {role === 'HOST' ? (
          <button className="btn-glass" style={{ padding: '8px 16px', fontSize: '12px' }} onClick={() => updateState({ screen: 'ROUND_SELECT' })}>
            Раунды ➡️
          </button>
        ) : <div />}
      </div>

      <div className="btn-glass" style={{ padding: '4px', borderRadius: 'var(--radius-lg)', background: 'rgba(255,255,255,0.02) !important' }}>
        {/* Grid Container */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: `minmax(150px, 1.5fr) repeat(${roundData[0].questions.length}, 1fr)`, 
          gap: '4px',
          overflowX: 'auto',
          width: '100%'
        }}>
          
          {roundData.map((topicData, tIdx) => (
            <React.Fragment key={topicData.topic}>
              {/* Topic Name */}
              <div style={{ 
                background: 'rgba(255,255,255,0.05)', padding: '16px', display: 'flex', alignItems: 'center', 
                fontWeight: '900', borderLeft: '4px solid var(--color-teal)',
                textTransform: 'uppercase', minWidth: '150px', fontSize: '13px', lineHeight: '1.2'
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
                      minHeight: '80px',
                      background: isOpened ? 'transparent' : 'rgba(232, 93, 141, 0.1) !important',
                      border: isOpened ? '1px dashed rgba(255,255,255,0.05)' : '1px solid rgba(255,255,255,0.05) !important',
                      fontSize: 'clamp(20px, 3vw, 32px)', 
                      color: isOpened ? 'rgba(255,255,255,0.1)' : 'white',
                      fontWeight: '800',
                      cursor: (isOpened || role !== 'HOST') ? 'default' : 'pointer',
                      transition: 'all 0.2s ease',
                      opacity: isOpened ? 0.3 : 1
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

      {/* Round Footer Controls - Quick Transition */}
      {role === 'HOST' && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px', paddingBottom: '30px' }}>
          {(isR1Done || isR2Done) && (
            <button 
              className="btn-glass" 
              style={{ 
                padding: '20px 60px', borderRadius: 'var(--radius-lg)', fontSize: '24px', 
                background: 'linear-gradient(135deg, var(--color-teal), var(--color-pink)) !important', 
                color: 'white !important', fontWeight: '900', boxShadow: 'var(--shadow-glow-pink)',
                border: 'none !important'
              }} 
              onClick={() => updateState({ screen: 'TABLE', currentRound: isR1Done ? 'R2' : 'SUPER', currentQuestion: null })}
            >
              СЛЕДУЮЩИЙ РАУНД ⏩
            </button>
          )}
        </div>
      )}
    </div>
  );
}
