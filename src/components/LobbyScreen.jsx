import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function LobbyScreen({ state, updateState, role, setRole }) {
  const [inviteName, setInviteName] = useState('');
  const [hasClaimedSpot, setHasClaimedSpot] = useState(false);

  const players = state.players || [];
  
  const handleHostAddPlayer = (e) => {
    e.preventDefault();
    if (!inviteName.trim()) return;
    const newPlayer = { id: Date.now().toString(), name: inviteName.trim(), score: 0, connected: false };
    updateState({ players: [...players, newPlayer] });
    setInviteName('');
  };

  const claimSpot = (playerId) => {
    setHasClaimedSpot(true);
    setRole('PLAYER');
    const updatedPlayers = players.map(p => p.id === playerId ? { ...p, connected: true } : p);
    updateState({ players: updatedPlayers });
  };

  const attemptBecomeHost = () => {
    setRole('HOST');
    updateState({ host: 'assigned' });
  };

  const handleStartGame = () => {
    if (players.length === 0) return alert('Нет добавленных игроков!');
    updateState({ screen: 'ROUND_SELECT' });
  };

  return (
    <div className="container" style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', overflow: 'hidden' }}>
      
      {/* Background Icons Layer */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 0, opacity: 0.05, display: 'flex', flexWrap: 'wrap', gap: '80px', justifyContent: 'center', padding: '40px' }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div key={i} animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }} transition={{ duration: 6 + i, repeat: Infinity }} style={{ width: '100px', height: '100px', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundImage: i % 2 === 0 ? 'url(/emblem.jpg)' : 'url(/rat.jpg)', filter: 'grayscale(100%) brightness(1.5)' }} />
        ))}
      </div>

      <div className="stacked-content" style={{ alignItems: 'center', zIndex: 1, width: '100%', gap: '1.5rem' }}>
        <h1 style={{ fontSize: 'clamp(24px, 5vw, 42px)', color: 'var(--color-teal)', textAlign: 'center', fontWeight: '900', letterSpacing: '2px', marginBottom: '0.5rem' }}>КОМНАТА ОЖИДАНИЯ</h1>
        
        {role === 'HOST' ? (
          <div style={{ textAlign: 'center', width: '100%', maxWidth: '700px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <h2 style={{ color: 'var(--color-pink)', fontSize: '20px', fontWeight: '900', marginBottom: '5px' }}>Вы Ведущий 👑</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>Впишите игроков. Они увидят приглашение!</p>
            </div>
            
            <form onSubmit={handleHostAddPlayer} style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <input type="text" value={inviteName} onChange={(e) => setInviteName(e.target.value)} placeholder="Имя игрока" style={{ padding: '12px 20px', fontSize: '16px', background: 'rgba(0,0,0,0.4)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', outline: 'none', width: '220px' }} />
              <button className="btn-glass" type="submit" style={{ padding: '12px 24px', fontSize: '14px', background: 'var(--color-teal)', fontWeight: '900' }}>Добавить</button>
            </form>

            <button className="btn-glass" onClick={handleStartGame} style={{ padding: '20px 50px', fontSize: '22px', background: 'var(--color-pink) !important', color: 'white !important', borderRadius: 'var(--radius-lg) !important', alignSelf: 'center', fontWeight: '900', boxShadow: '0 0 30px rgba(232, 93, 141, 0.2)' }}>НАЧАТЬ КВИЗ ВСЕМ</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '700px' }}>
            {state.host !== 'assigned' ? (
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ color: 'white', marginBottom: '20px', fontSize: '22px' }}>Ожидаем Ведущего...</h2>
                <button onClick={attemptBecomeHost} className="btn-glass" style={{ padding: '12px 24px', fontSize: '16px', fontWeight: '900' }}>Я Ведущий 👑</button>
              </div>
            ) : (
              <div style={{ width: '100%' }}>
                {hasClaimedSpot ? (
                   <h2 style={{ color: 'var(--color-teal)', textAlign: 'center', fontSize: '20px', fontWeight: '800' }}>ВЫ ВОШЛИ! ✨ Ждем старта...</h2>
                ) : (
                  <div className="btn-glass" style={{ padding: '30px 20px', borderRadius: 'var(--radius-lg) !important', width: '100%', textAlign: 'center', background: 'rgba(255,255,255,0.02) !important' }}>
                    <h2 style={{ fontSize: '22px', fontWeight: '900', marginBottom: '10px' }}>ВАС ПРИГЛАСИЛИ!</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
                      {players.filter(p => !p.connected).length === 0 ? (
                        <p style={{ color: 'var(--color-pink)', fontSize: '14px' }}>Пока нет приглашений...</p>
                      ) : (
                        players.filter(p => !p.connected).map(p => (
                          <button key={p.id} onClick={() => claimSpot(p.id)} className="btn-glass" style={{ padding: '15px', fontSize: '18px', fontWeight: '900' }}>Я {p.name}! 👋</button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div style={{ width: '100%', maxWidth: '800px', marginTop: '1rem' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--color-text-muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px' }}>Игроки в лобби ({players.length})</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
            {players.map((p, i) => (
              <div key={i} className="btn-glass" style={{ padding: '10px 20px', borderRadius: '40px !important', fontSize: '14px', background: p.connected ? 'rgba(127, 215, 205, 0.1) !important' : 'rgba(255,255,255,0.02) !important', color: p.connected ? 'var(--color-teal)' : 'var(--color-text-muted)', fontWeight: '800' }}>{p.name} {p.connected ? '🟢' : '⏳'}</div>
            ))}
          </div>
        </div>

        <button className="btn-glass" style={{ padding: '10px 20px', fontSize: '12px', opacity: 0.5 }} onClick={() => updateState({ screen: 'START', host: '', players: [] })}>На главную</button>
      </div>
    </div>
  );
}
