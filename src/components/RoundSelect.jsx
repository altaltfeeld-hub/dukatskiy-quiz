import React from 'react';

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
    <div className="container" style={{ paddingTop: '20px' }}>
      
      {/* Header Area */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <button 
          className="btn-glass"
          style={{ padding: '12px 24px', borderRadius: 'var(--radius-md) !important', fontSize: '13px', background: 'rgba(255,255,255,0.05) !important' }} 
          onClick={() => updateState({ screen: 'START' })}>
          🏠 На главный
        </button>
      </div>

      <div className="stacked-content" style={{ alignItems: 'center', width: '100%' }}>
        {/* Scoreboard */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', width: '100%' }}>
          {players.map(p => (
            <div key={p.id} className="btn-glass" style={{
              padding: '15px 25px', borderRadius: 'var(--radius-md) !important', 
              minWidth: '140px', textAlign: 'center', pointerEvents: 'none',
              borderBottom: '4px solid var(--color-teal) !important',
              background: 'rgba(255,255,255,0.02) !important'
            }}>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '12px', textTransform: 'uppercase', marginBottom: '4px', fontWeight: 'bold' }}>{p.name}</div>
              <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--color-pink)' }}>{p.score}</div>
            </div>
          ))}
        </div>

        <h1 style={{ fontSize: 'clamp(32px, 8vw, 64px)', color: 'var(--color-teal)', textAlign: 'center', margin: '2.5rem 0', letterSpacing: '6px', fontWeight: '900' }}>
          ВЫБОР РАУНДА
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', width: '100%', maxWidth: '550px' }}>
          {/* Round 1 */}
          <div style={{ width: '100%' }}>
            <button 
              className="btn-glass"
              style={{ width: '100%', padding: '35px', fontSize: '28px', borderRadius: 'var(--radius-lg) !important', border: '1px solid var(--color-teal) !important', fontWeight: '900' }}
              onClick={() => updateState({ screen: 'TABLE', currentRound: 'R1' })}
            >
              РАУНД 1
            </button>
            <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '14px', color: 'var(--color-teal)', opacity: 0.9, fontWeight: 'bold' }}>
              {getProgressLabel(openedR1, totalR1)}
            </div>
          </div>
          
          {/* Round 2 */}
          <div style={{ width: '100%', opacity: isR1Complete ? 1 : 0.5 }}>
            <button 
              disabled={!isR1Complete}
              className="btn-glass"
              style={{ width: '100%', padding: '35px', fontSize: '28px', borderRadius: 'var(--radius-lg) !important', border: isR1Complete ? '1px solid var(--color-pink) !important' : '1px solid rgba(255,255,255,0.1) !important', cursor: isR1Complete ? 'pointer' : 'not-allowed', fontWeight: '900' }}
              onClick={() => updateState({ screen: 'TABLE', currentRound: 'R2' })}
            >
              {!isR1Complete && <span style={{ marginRight: '10px' }}>🔒</span>}
              РАУНД 2
            </button>
            <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '14px', color: isR1Complete ? 'var(--color-pink)' : 'var(--color-text-muted)', fontWeight: 'bold' }}>
              {isR1Complete ? getProgressLabel(openedR2, totalR2) : "Сначала завершите Раунд 1"}
            </div>
          </div>
          
          {/* Super Game */}
          <div style={{ width: '100%', opacity: isR2Complete ? 1 : 0.5 }}>
            <button 
              disabled={!isR2Complete}
              className="btn-glass"
              style={{ 
                width: '100%', padding: '35px', fontSize: '28px', borderRadius: 'var(--radius-lg) !important', 
                background: isR2Complete ? 'linear-gradient(135deg, var(--color-pink), var(--color-teal)) !important' : 'rgba(255,255,255,0.05) !important',
                color: isR2Complete ? 'var(--color-bg-deep) !important' : 'var(--color-text-muted) !important', 
                fontWeight: '900', border: 'none !important',
                cursor: isR2Complete ? 'pointer' : 'not-allowed'
              }}
              onClick={() => updateState({ screen: 'SUPER_GAME', currentRound: 'SUPER' })}
            >
              {!isR2Complete && <span style={{ marginRight: '10px' }}>🔒</span>}
              СУПЕР-ИГРА
            </button>
            <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '14px', color: isR2Complete ? 'white' : 'var(--color-text-muted)', fontWeight: 'bold' }}>
              {!isR2Complete && "Сначала завершите Раунд 2"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
