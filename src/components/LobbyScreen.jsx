import React, { useState } from 'react';

export default function LobbyScreen({ state, updateState, role, setRole }) {
  const [inviteName, setInviteName] = useState('');
  const [hasClaimedSpot, setHasClaimedSpot] = useState(false);

  const players = state.players || [];
  const hostStatus = state.host || '';

  // Host adds a pending participant
  const handleHostAddPlayer = (e) => {
    e.preventDefault();
    if (!inviteName.trim()) return;
    
    const newPlayer = { id: Date.now().toString(), name: inviteName.trim(), score: 0, connected: false };
    updateState({
      players: [...players, newPlayer]
    });
    setInviteName('');
  };

  // Player claims a spot created by the host
  const claimSpot = (playerId) => {
    setHasClaimedSpot(true);
    setRole('PLAYER');
    
    // Mark as connected
    const updatedPlayers = players.map(p => 
      p.id === playerId ? { ...p, connected: true } : p
    );
    updateState({ players: updatedPlayers });
  };

  const attemptBecomeHost = () => {
    setRole('HOST');
    updateState({ host: 'assigned' });
  };

  const handleStartGame = () => {
    if (players.length === 0) {
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
          style={{ padding: '12px 24px', borderRadius: 'var(--radius-md) !important', fontSize: '14px', background: 'rgba(255,255,255,0.05) !important' }} 
          onClick={() => {
             updateState({ screen: 'START', host: '', players: [] });
             setRole(null);
          }}>
          🏠 На главный
        </button>
      </div>

      <div className="stacked-content" style={{ alignItems: 'center' }}>
        <h1 style={{ fontSize: 'clamp(28px, 6vw, 48px)', color: 'var(--color-teal)', textAlign: 'center', marginBottom: '1.5rem', fontWeight: '900', letterSpacing: '2px' }}>
          КОМНАТА ОЖИДАНИЯ
        </h1>
        
        {/* If I am the Host */}
        {role === 'HOST' ? (
          <div style={{ textAlign: 'center', width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <div>
              <h2 style={{ color: 'var(--color-pink)', marginBottom: '0.5rem', fontSize: '28px', fontWeight: '900' }}>Вы Ведущий 👑</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', fontWeight: '500' }}>Впишите сюда всех игроков. Когда они перейдут по ссылке, они увидят свое приглашение!</p>
            </div>
            
            <form onSubmit={handleHostAddPlayer} style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <input 
                type="text" 
                value={inviteName} 
                onChange={(e) => setInviteName(e.target.value)} 
                placeholder="Имя карточки (Игрок)"
                style={{ 
                  padding: '18px 24px', fontSize: '18px', background: 'rgba(0,0,0,0.3)', color: 'white', 
                  border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', outline: 'none', 
                  flex: '1', minWidth: '250px', maxWidth: '350px', fontWeight: '600'
                }}
              />
              <button className="btn-glass" type="submit" style={{ padding: '18px 36px', fontSize: '18px', background: 'var(--color-teal)', color: 'var(--color-bg-deep)', borderRadius: 'var(--radius-md) !important', border: 'none', fontWeight: '900' }}>
                Добавить
              </button>
            </form>

            <button className="btn-glass" onClick={handleStartGame} style={{ padding: '28px 56px', fontSize: '28px', background: 'var(--color-pink) !important', color: 'white !important', borderRadius: 'var(--radius-lg) !important', alignSelf: 'center', fontWeight: '900', boxShadow: '0 0 40px rgba(232, 93, 141, 0.3)', border: 'none !important' }}>
              НАЧАТЬ КВИЗ ВСЕМ
            </button>
          </div>
        ) : (
          /* If I am NOT the Host */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '800px' }}>
            
            {state.host !== 'assigned' ? (
              <div style={{ textAlign: 'center', padding: '50px 0' }}>
                <h2 style={{ color: 'white', marginBottom: '25px', fontSize: '28px', fontWeight: '800' }}>Ожидаем Ведущего...</h2>
                <button onClick={attemptBecomeHost} className="btn-glass" style={{ padding: '16px 32px', borderRadius: 'var(--radius-md) !important', fontSize: '18px', fontWeight: '900' }}>
                  Я Ведущий 👑
                </button>
              </div>
            ) : (
              <div style={{ width: '100%' }}>
                {hasClaimedSpot ? (
                   <h2 style={{ color: 'var(--color-teal)', textAlign: 'center', padding: '50px 0', fontSize: '24px', fontWeight: '800' }}>ВЫ ВОШЛИ! ✨ Ждем старта от Ведущего...</h2>
                ) : (
                  <div style={{ background: 'var(--color-bg-card)', padding: '50px 30px', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(232, 93, 141, 0.3)', boxShadow: '0 0 50px rgba(232, 93, 141, 0.1)', width: '100%', textAlign: 'center' }}>
                    <h2 style={{ color: 'var(--color-text-main)', marginBottom: '15px', fontSize: '28px', fontWeight: '900' }}>ВАС ПРИГЛАСИЛИ В ИГРУ!</h2>
                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '40px', fontSize: '18px' }}>Ведущий создал карточки. Найдите себя в списке ниже:</p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      {players.filter(p => !p.connected).length === 0 ? (
                        <p style={{ color: 'var(--color-pink)', fontSize: '20px', fontWeight: '700' }}>Пока нет доступных приглашений...</p>
                      ) : (
                        players.filter(p => !p.connected).map(p => (
                          <button key={p.id} onClick={() => claimSpot(p.id)} className="btn-glass" style={{ padding: '25px', borderRadius: 'var(--radius-md) !important', fontSize: '24px', fontWeight: '900' }}>
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
        <div style={{ width: '100%', maxWidth: '900px', marginTop: '3.5rem' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '14px', fontWeight: '800' }}>
            Игроки в лобби ({players.length})
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'center' }}>
            {players.map((p, i) => (
              <div key={i} className="btn-glass" style={{ 
                padding: '15px 25px', borderRadius: 'var(--radius-lg) !important', fontSize: '18px', 
                background: p.connected ? 'rgba(127, 215, 205, 0.1) !important' : 'rgba(255,255,255,0.02) !important',
                border: p.connected ? '2px solid var(--color-teal) !important' : '1px dashed var(--color-text-muted) !important',
                color: p.connected ? 'var(--color-teal)' : 'var(--color-text-muted)',
                pointerEvents: 'none', fontWeight: '800'
              }}>
                {p.name} {p.connected ? '🟢' : '⏳'}
              </div>
            ))}
            {players.length === 0 && <span style={{ color: 'var(--color-text-muted)', fontWeight: '600' }}>Ожидание игроков...</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
