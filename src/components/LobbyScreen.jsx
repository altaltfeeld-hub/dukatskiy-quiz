import React, { useState } from 'react';

export default function LobbyScreen({ state, updateState, role, setRole }) {
  const [inviteName, setInviteName] = useState('');
  const [hasClaimedSpot, setHasClaimedSpot] = useState(false);

  // Host adds a pending participant
  const handleHostAddPlayer = (e) => {
    e.preventDefault();
    if (!inviteName.trim()) return;
    
    const newPlayer = { id: Date.now().toString(), name: inviteName.trim(), score: 0, connected: false };
    updateState({
      players: [...state.players, newPlayer]
    });
    setInviteName('');
  };

  // Player claims a spot created by the host
  const claimSpot = (playerId) => {
    setHasClaimedSpot(true);
    setRole('PLAYER');
    
    // Mark as connected
    const updatedPlayers = state.players.map(p => 
      p.id === playerId ? { ...p, connected: true } : p
    );
    updateState({ players: updatedPlayers });
  };

  const attemptBecomeHost = () => {
    setRole('HOST');
    updateState({ host: 'assigned' });
  };

  const handleStartGame = () => {
    if (state.players.length === 0) {
      alert('Нет добавленных игроков!');
      return;
    }
    updateState({ screen: 'ROUND_SELECT' });
  };

  return (
    <div className="container">
      
      {/* Header Area */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', paddingBottom: '20px' }}>
        <button 
          className="btn-glass"
          style={{ padding: '10px 20px', borderRadius: 'var(--radius-md)', fontSize: '14px' }} 
          onClick={() => {
             updateState({ screen: 'START', host: '', players: [] });
             setRole(null);
          }}>
          🏠 На главный
        </button>
      </div>

      <div className="stacked-content" style={{ alignItems: 'center' }}>
        <h1 style={{ fontSize: 'clamp(24px, 5vw, 42px)', color: 'var(--color-teal)', textAlign: 'center', marginBottom: '1rem' }}>
          КОМНАТА ОЖИДАНИЯ
        </h1>
        
        {/* If I am the Host */}
        {role === 'HOST' ? (
          <div style={{ textAlign: 'center', width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <h2 style={{ color: 'var(--color-pink)', marginBottom: '0.5rem' }}>Вы Ведущий 👑</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>Впишите сюда всех игроков. Когда они перейдут по ссылке, они увидят свое приглашение!</p>
            </div>
            
            <form onSubmit={handleHostAddPlayer} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <input 
                type="text" 
                value={inviteName} 
                onChange={(e) => setInviteName(e.target.value)} 
                placeholder="Имя карточки (Игрок)"
                style={{ 
                  padding: '16px', fontSize: '18px', background: 'rgba(0,0,0,0.3)', color: 'white', 
                  border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', outline: 'none', 
                  flex: '1', minWidth: '200px', maxWidth: '300px' 
                }}
              />
              <button className="btn-glass" type="submit" style={{ padding: '16px 32px', fontSize: '18px', background: 'var(--color-teal)', color: 'var(--color-bg-deep)', borderRadius: 'var(--radius-md)', border: 'none' }}>
                Добавить
              </button>
            </form>

            <button className="btn-glass" onClick={handleStartGame} style={{ padding: '24px 48px', fontSize: '24px', background: 'var(--color-pink) !important', color: 'white !important', borderRadius: 'var(--radius-md)', alignSelf: 'center' }}>
              НАЧАТЬ КВИЗ ВСЕМ
            </button>
          </div>
        ) : (
          /* If I am NOT the Host */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '800px' }}>
            
            {state.host !== 'assigned' ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <h2 style={{ color: 'white', marginBottom: '20px' }}>Ожидаем Ведущего...</h2>
                <button onClick={attemptBecomeHost} className="btn-glass" style={{ padding: '12px 24px', borderRadius: 'var(--radius-sm)' }}>
                  Я Ведущий 👑
                </button>
              </div>
            ) : (
              <div style={{ width: '100%' }}>
                {hasClaimedSpot ? (
                   <h2 style={{ color: 'var(--color-teal)', textAlign: 'center', padding: '40px 0' }}>Вы вошли! Ждем старта от Ведущего...</h2>
                ) : (
                  <div style={{ background: 'var(--color-bg-card)', padding: '40px 20px', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(232, 93, 141, 0.3)', boxShadow: '0 0 40px rgba(232, 93, 141, 0.1)', width: '100%', textAlign: 'center' }}>
                    <h2 style={{ color: 'var(--color-text-main)', marginBottom: '10px' }}>ВАС ПРИГЛАСИЛИ В ИГРУ!</h2>
                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '30px' }}>Ведущий создал карточки. Найдите себя в списке ниже:</p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                      {state.players.filter(p => !p.connected).length === 0 ? (
                        <p style={{ color: 'var(--color-pink)' }}>Пока нет доступных приглашений...</p>
                      ) : (
                        state.players.filter(p => !p.connected).map(p => (
                          <button key={p.id} onClick={() => claimSpot(p.id)} className="btn-glass" style={{ padding: '20px', borderRadius: 'var(--radius-md)', fontSize: '20px' }}>
                            Я {p.name}! 👋
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Global Roster */}
        <div style={{ width: '100%', maxWidth: '800px', marginTop: '2rem' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--color-text-muted)' }}>
            Игроки в лобби ({state.players.length})
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
            {state.players.map((p, i) => (
              <div key={i} className="btn-glass" style={{ 
                padding: '12px 20px', borderRadius: 'var(--radius-lg)', fontSize: '16px', 
                background: p.connected ? 'rgba(127, 215, 205, 0.1) !important' : 'rgba(255,255,255,0.02) !important',
                border: p.connected ? '1px solid var(--color-teal) !important' : '1px dashed var(--color-text-muted) !important',
                color: p.connected ? 'var(--color-teal)' : 'var(--color-text-muted)',
                pointerEvents: 'none'
              }}>
                {p.name} {p.connected ? '🟢' : '⏳'}
              </div>
            ))}
            {state.players.length === 0 && <span style={{ color: 'var(--color-text-muted)' }}>Ожидание игроков...</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
