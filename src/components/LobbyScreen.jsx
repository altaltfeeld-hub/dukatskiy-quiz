import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function LobbyScreen({ state, updateState, role, setRole }) {
  const [inviteName, setInviteName] = useState('');
  const [hasClaimedSpot, setHasClaimedSpot] = useState(false);

  const players = state.players || [];
  
  const handleHostAddPlayer = (e) => {
    e.preventDefault();
    if (!inviteName.trim() || players.length >= 5) return;
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

  const handleDeletePlayer = (playerId) => {
    updateState({ players: players.filter(p => p.id !== playerId) });
  };

  const isLimitReached = players.length >= 5;

  return (
    <div style={{ height: '100vh', display: 'flex', overflow: 'hidden', background: 'var(--color-bg-deep)', position: 'relative' }}>
      
      {/* Restored Background Icons Layer (Drifting) */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 0, opacity: 0.05 }}>
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div 
            key={i} 
            initial={{ x: Math.random() * 100 + '%', y: Math.random() * 100 + '%' }}
            animate={{ 
              x: [Math.random() * 100 + '%', Math.random() * 100 + '%'], 
              y: [Math.random() * 100 + '%', Math.random() * 100 + '%'],
              opacity: [0.1, 0.4, 0.1]
            }} 
            transition={{ duration: 25 + i * 2, repeat: Infinity, ease: "linear" }}
            style={{ position: 'absolute', width: '100px', height: '100px', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundImage: i % 2 === 0 ? 'url(/emblem.jpg)' : 'url(/rat.jpg)', filter: 'grayscale(100%) brightness(1.2)' }} 
          />
        ))}
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', zIndex: 1 }}>
        <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', color: 'var(--color-teal)', textAlign: 'center', fontWeight: '900', letterSpacing: '4px', marginBottom: '1.5rem', textShadow: '0 0 30px rgba(127, 215, 205, 0.2)' }}>КОМНАТА ОЖИДАНИЯ</h1>
        
        {role === 'HOST' ? (
          <div style={{ textAlign: 'center', width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <h2 style={{ color: 'var(--color-pink)', fontSize: '24px', fontWeight: '900', marginBottom: '8px' }}>Вы Ведущий 👑</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
                {isLimitReached ? <span style={{ color: 'var(--color-pink)', fontWeight: 'bold' }}>ЛИМИТ ИГРОКОВ (5) ДОСТИГНУТ</span> : "Впишите игроков. Они увидят приглашение!"}
              </p>
            </div>
            
            <form onSubmit={handleHostAddPlayer} style={{ display: 'flex', gap: '12px', justifyContent: 'center', opacity: isLimitReached ? 0.5 : 1 }}>
              <input 
                type="text" 
                value={inviteName} 
                onChange={(e) => setInviteName(e.target.value)} 
                placeholder={isLimitReached ? "Лимит" : "Имя игрока"} 
                disabled={isLimitReached}
                style={{ padding: '15px 25px', fontSize: '18px', background: 'rgba(0,0,0,0.4)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', outline: 'none', width: '250px' }} 
              />
              <button 
                className="btn-glass" 
                type="submit" 
                disabled={isLimitReached}
                style={{ padding: '15px 30px', fontSize: '16px', background: isLimitReached ? 'rgba(255,255,255,0.05)' : 'var(--color-teal)', fontWeight: '900' }}
              >
                Добавить
              </button>
            </form>

            <button className="btn-glass" onClick={handleStartGame} style={{ padding: '25px 60px', fontSize: '26px', background: 'var(--color-pink) !important', color: 'white !important', borderRadius: 'var(--radius-lg) !important', alignSelf: 'center', fontWeight: '900', boxShadow: '0 0 40px rgba(232, 93, 141, 0.3)' }}>
              НАЧАТЬ КВИЗ ВСЕМ
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '600px' }}>
            {state.host !== 'assigned' ? (
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ color: 'white', marginBottom: '25px', fontSize: '24px', fontWeight: '900' }}>Ожидаем Ведущего...</h2>
                <button onClick={attemptBecomeHost} className="btn-glass" style={{ padding: '15px 35px', fontSize: '18px', fontWeight: '900' }}>Я Ведущий 👑</button>
              </div>
            ) : (
              <div style={{ width: '100%' }}>
                {hasClaimedSpot ? (
                   <h2 style={{ color: 'var(--color-teal)', textAlign: 'center', fontSize: '22px', fontWeight: '900' }}>ВЫ ВОШЛИ! ✨ Ждем старта...</h2>
                ) : (
                  <div className="btn-glass" style={{ padding: '40px 30px', borderRadius: 'var(--radius-lg) !important', width: '100%', textAlign: 'center', background: 'rgba(255,255,255,0.02) !important' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '15px', color: 'white' }}>ВАС ПРИГЛАСИЛИ!</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '30px' }}>
                      {players.filter(p => !p.connected).length === 0 ? (
                        <p style={{ color: 'var(--color-pink)', fontSize: '16px', fontWeight: '700' }}>Пока нет доступных приглашений...</p>
                      ) : (
                        players.filter(p => !p.connected).map(p => (
                          <button key={p.id} onClick={() => claimSpot(p.id)} className="btn-glass" style={{ padding: '20px', fontSize: '20px', fontWeight: '900' }}>Я {p.name}! 👋</button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <button className="btn-glass" style={{ marginTop: '40px', padding: '10px 20px', fontSize: '12px', opacity: 0.5 }} onClick={() => updateState({ screen: 'START', host: '', players: [] })}>На главную</button>
      </div>

      {/* FIXED RIGHT SIDEBAR - Player Roster & Delete Controls for Host */}
      <div style={{ width: '280px', height: '100vh', background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(30px)', borderLeft: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', padding: '30px 20px', zIndex: 2 }}>
        <h3 style={{ fontSize: '10px', color: 'var(--color-text-muted)', letterSpacing: '4px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '25px' }}>Игроки в лобби ({players.length})</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {players.map((p) => (
            <div key={p.id} className="btn-glass" style={{ padding: '12px 15px', borderRadius: 'var(--radius-md) !important', fontSize: '14px', background: p.connected ? 'rgba(127, 215, 205, 0.05) !important' : 'rgba(255,255,255,0.02) !important', color: p.connected ? 'var(--color-teal)' : 'var(--color-text-muted)', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>{p.name} {p.connected ? '🟢' : '⏳'}</span>
              {role === 'HOST' && (
                <button 
                  onClick={() => handleDeletePlayer(p.id)} 
                  style={{ color: 'var(--color-pink)', cursor: 'pointer', fontSize: '20px', border: 'none', background: 'none', padding: '0 5px', lineHeight: 1 }}
                >
                  ×
                </button>
              )}
            </div>
          ))}
          {players.length === 0 && <span style={{ color: 'var(--color-text-muted)', fontSize: '12px', textAlign: 'center', marginTop: '20px' }}>Ожидание добавления...</span>}
        </div>
      </div>

    </div>
  );
}
