import React from 'react';

export default function RoundSelect({ players, updateState }) {
  // Check role from props or useGameState if we need to restrict, but players can't click it anyway because we don't pass 'role' here right now. Let's assume it's okay for host to click.
  return (
    <div className="container" style={{ paddingTop: '20px' }}>
      
      {/* Header Area */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <button 
          className="btn-glass"
          style={{ padding: '10px 20px', borderRadius: 'var(--radius-md)', fontSize: '13px' }} 
          onClick={() => updateState({ screen: 'START' })}>
          🏠 На главный
        </button>
      </div>

      <div className="stacked-content" style={{ alignItems: 'center' }}>
        {/* Scoreboard - Global View */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap', width: '100%' }}>
          {players.map(p => (
            <div key={p.id} className="btn-glass" style={{
              padding: '12px 20px', borderRadius: 'var(--radius-md)', 
              minWidth: '120px', textAlign: 'center', pointerEvents: 'none',
              borderBottom: '3px solid var(--color-teal) !important'
            }}>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '12px', textTransform: 'uppercase', marginBottom: '4px' }}>{p.name}</div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--color-pink)' }}>{p.score}</div>
            </div>
          ))}
        </div>

        <h1 style={{ fontSize: 'clamp(32px, 8vw, 64px)', color: 'var(--color-teal)', textAlign: 'center', margin: '2rem 0' }}>
          ВЫБОР РАУНДА
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', maxWidth: '400px' }}>
          <button 
            className="btn-glass"
            style={{ padding: '30px', fontSize: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-teal) !important' }}
            onClick={() => updateState({ screen: 'TABLE', currentRound: 'R1' })}
          >
            РАУНД 1
          </button>
          
          <button 
            className="btn-glass"
            style={{ padding: '30px', fontSize: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-pink) !important' }}
            onClick={() => updateState({ screen: 'TABLE', currentRound: 'R2' })}
          >
            РАУНД 2
          </button>
          
          <button 
            className="btn-glass"
            style={{ 
              padding: '30px', fontSize: '24px', borderRadius: 'var(--radius-lg)', 
              background: 'linear-gradient(135deg, var(--color-pink), var(--color-teal)) !important',
              color: 'var(--color-bg-deep) !important', fontWeight: '900', border: 'none !important'
            }}
            onClick={() => updateState({ screen: 'SUPER_GAME', currentRound: 'SUPER' })}
          >
            СУПЕР-ИГРА
          </button>
        </div>
      </div>
    </div>
  );
}
