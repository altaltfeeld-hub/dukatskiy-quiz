import React, { useState } from 'react';

export default function SetupScreen({ updateState }) {
  const [hostName, setHostName] = useState('');
  const [playerNames, setPlayerNames] = useState(['', '', '']); // Default 3 players

  const addPlayer = () => {
    if (playerNames.length < 5) setPlayerNames([...playerNames, '']);
  };

  const removePlayer = (idx) => {
    if (playerNames.length > 3) {
      setPlayerNames(playerNames.filter((_, i) => i !== idx));
    }
  };

  const handleStart = () => {
    if (!hostName) alert('Введите имя ведущего');
    const validPlayers = playerNames.filter(n => n.trim() !== '');
    if (validPlayers.length < 3) return alert('Нужно минимум 3 игрока');

    updateState({
      host: hostName,
      players: validPlayers.map((name, i) => ({ id: i, name, score: 0 })),
      screen: 'ROUND_SELECT'
    });
  };

  return (
    <div className="container animate-fade" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '10vh' }}>
      <h2 style={{ fontSize: '36px', marginBottom: '40px', color: 'var(--color-teal)' }}>Настройка игры</h2>
      
      <div style={{ background: 'var(--color-bg-card)', padding: '30px', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '500px', marginBottom: '20px', boxShadow: 'var(--shadow-card)' }}>
        <h3 style={{ marginBottom: '16px', color: 'var(--color-pink)' }}>Ведущий</h3>
        <input 
          style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: 'none', marginBottom: '10px', fontSize: '18px', background: 'rgba(255,255,255,0.1)', color: 'white' }}
          placeholder="Имя ведущего" 
          value={hostName} 
          onChange={e => setHostName(e.target.value)} 
        />
      </div>

      <div style={{ background: 'var(--color-bg-card)', padding: '30px', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '500px', marginBottom: '20px', boxShadow: 'var(--shadow-card)' }}>
        <h3 style={{ marginBottom: '16px', color: 'var(--color-pink)' }}>Игроки (от 3 до 5)</h3>
        {playerNames.map((name, idx) => (
          <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input 
              style={{ flex: 1, padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: 'none', fontSize: '18px', background: 'rgba(255,255,255,0.1)', color: 'white' }}
              placeholder={`Игрок ${idx + 1}`} 
              value={name} 
              onChange={e => {
                const newNames = [...playerNames];
                newNames[idx] = e.target.value;
                setPlayerNames(newNames);
              }} 
            />
            {playerNames.length > 3 && (
              <button 
                style={{ padding: '0 16px', background: 'rgba(255,0,0,0.2)', color: '#ff4444', borderRadius: 'var(--radius-sm)' }}
                onClick={() => removePlayer(idx)}
              >X</button>
            )}
          </div>
        ))}
        {playerNames.length < 5 && (
          <button style={{ color: 'var(--color-teal)', marginTop: '10px' }} onClick={addPlayer}>+ Добавить игрока</button>
        )}
      </div>

      <button 
        style={{ padding: '16px 40px', fontSize: '20px', borderRadius: 'var(--radius-lg)', background: 'var(--color-teal)', color: 'var(--color-bg-deep)', fontWeight: '800', boxShadow: 'var(--shadow-glow-teal)' }}
        onClick={handleStart}
      >
        Перейти к раундам
      </button>
    </div>
  );
}
