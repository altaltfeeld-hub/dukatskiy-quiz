import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SUPER_GAME_DATA } from '../data';

export default function SuperGame({ state, updateState, role }) {
  const players = state.players || [];
  const removedTopics = state.removedSuperTopics || [];
  const remaining = SUPER_GAME_DATA.filter(t => !removedTopics.includes(t.topic));

  const [openedFinal, setOpenedFinal] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [rewardAmount, setRewardAmount] = useState(3000);

  // Timer logic
  useEffect(() => {
    if (!openedFinal || showAnswer || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [openedFinal, showAnswer, timeLeft]);

  const handleRemove = (topic) => {
    if (role !== 'HOST') return;
    updateState({ removedSuperTopics: [...removedTopics, topic] });
  };

  const addScore = (playerId, amount) => {
    const updatedPlayers = state.players.map(p => {
      if (p.id === playerId) return { ...p, score: p.score + Number(amount) };
      return p;
    });
    updateState({ players: updatedPlayers });
  };

  return (
    <div className="container" style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', overflow: 'hidden' }}>
      
      {/* Background Icons Layer (Reverted) */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 0, overflow: 'hidden', display: 'flex', flexWrap: 'wrap', gap: '100px', padding: '60px', justifyContent: 'center', opacity: 0.05 }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }} transition={{ duration: 6 + i, repeat: Infinity }}
            style={{ width: '120px', height: '120px', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundImage: i % 2 === 0 ? 'url(/emblem.jpg)' : 'url(/rat.jpg)', filter: 'grayscale(100%)' }}
          />
        ))}
      </div>

      <div className="stacked-content" style={{ alignItems: 'center', zIndex: 1, width: '100%', maxWidth: '1000px', gap: '1.5rem' }}>
        
        {openedFinal && remaining.length === 1 ? (
          /* Final Question View */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', width: '100%' }}>
            <h1 style={{ fontSize: '40px', color: 'var(--color-pink)', fontWeight: '900', letterSpacing: '4px' }}>СУПЕР-ИГРА</h1>
            
            {(() => {
              const finalQ = remaining[0];
              const imageFile = finalQ.image || finalQ.answerImage;
              if (imageFile) {
                return (
                  <div style={{ width: '100%', maxHeight: '40vh', overflow: 'hidden', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'center' }}>
                    <img src={`/${imageFile}`} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  </div>
                );
              }
              return <h2 style={{ fontSize: '48px', fontWeight: '900', textAlign: 'center' }}>{finalQ.text}</h2>;
            })()}

            <h3 style={{ fontSize: '24px', fontWeight: '800' }}>{!showAnswer ? remaining[0].text : ''}</h3>

            {showAnswer && remaining[0].answer && (
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="btn-glass" style={{ padding: '15px 30px', border: '1px solid var(--color-teal) !important', borderRadius: 'var(--radius-md) !important' }}>
                <div style={{ fontSize: '10px', color: 'var(--color-teal)', fontWeight: '900', textTransform: 'uppercase' }}>Ответ:</div>
                <div style={{ fontSize: '32px', fontWeight: '900' }}>{remaining[0].answer}</div>
              </motion.div>
            )}
          </div>
        ) : (
          /* Topic Choice */
          <div style={{ textAlign: 'center', width: '100%' }}>
            <h1 style={{ fontSize: '42px', color: 'var(--color-teal)', fontWeight: '900', marginBottom: '30px' }}>ВЫБОР ТЕМЫ</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'center', width: '100%' }}>
               {SUPER_GAME_DATA.map(t => {
                 const isRemoved = removedTopics.includes(t.topic);
                 return (
                   <div key={t.topic} className="btn-glass" style={{ 
                     padding: '15px 25px', borderRadius: 'var(--radius-lg) !important', minWidth: '220px',
                     background: isRemoved ? 'rgba(255,255,255,0.01) !important' : 'rgba(255,255,255,0.05) !important',
                     opacity: isRemoved ? 0.3 : 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                   }}>
                     <span style={{ fontSize: '1.2rem', fontWeight: '800' }}>{t.topic}</span>
                     {role === 'HOST' && !isRemoved && remaining.length > 1 && (
                       <button className="btn-glass" style={{ background: 'rgba(255,50,50,0.1) !important', color: '#ff8888 !important', padding: '6px 12px', fontSize: '10px' }} onClick={() => handleRemove(t.topic)}>УБРАТЬ</button>
                     )}
                   </div>
                 );
               })}
            </div>
            {role === 'HOST' && remaining.length === 1 && !openedFinal && (
               <button className="btn-glass" style={{ marginTop: '40px', padding: '20px 60px', fontSize: '24px', background: 'var(--color-pink) !important', color: 'white !important', fontWeight: '900' }} onClick={() => setOpenedFinal(true)}>ИГРАТЬ ФИНАЛ 🚀</button>
            )}
          </div>
        )}
      </div>

      {/* Host Control ribbon at Bottom */}
      {role === 'HOST' && (
        <div style={{ width: '100%', maxWidth: '1000px', background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)', borderRadius: 'var(--radius-lg)', padding: '15px', display: 'flex', flexDirection: 'column', gap: '12px', border: '1px solid rgba(255,255,255,0.05)', zIndex: 1, marginTop: '20px' }}>
           <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              {openedFinal && !showAnswer && (
                <button className="btn-glass" style={{ padding: '10px 24px', background: 'var(--color-teal) !important', color: 'var(--color-bg-deep) !important', fontSize: '14px', fontWeight: '900' }} onClick={() => setShowAnswer(true)}>ОТКРЫТЬ ОТВЕТ</button>
              )}
              {showAnswer && (
                <button className="btn-glass" style={{ padding: '10px 24px', background: 'var(--color-pink) !important', color: 'white !important', fontSize: '14px', fontWeight: '900' }} onClick={() => updateState({ screen: 'WINNER_SCREEN' })}>🏆 К ПОБЕДИТЕЛЮ</button>
              )}
              <button className="btn-glass" style={{ padding: '10px 20px', fontSize: '12px', opacity: 0.5 }} onClick={() => updateState({ screen: 'START' })}>На главный</button>
           </div>
           
           {openedFinal && (
             <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
                <input type="number" value={rewardAmount} onChange={e => setRewardAmount(e.target.value)} style={{ padding: '8px', fontSize: '18px', width: '100px', background: 'rgba(0,0,0,0.3)', color: 'white', border: '1px solid var(--color-teal)', borderRadius: '8px', textAlign: 'center' }} />
                {players.map(p => (
                  <div key={p.id} className="btn-glass" style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '10px', borderRadius: '40px !important' }}>
                    <span style={{ fontSize: '11px', fontWeight: '900' }}>{p.name}</span>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button onClick={() => addScore(p.id, -rewardAmount)} className="btn-glass" style={{ width: '28px', height: '28px', borderRadius: '50% !important', padding: 0, color: 'var(--color-pink) !important', border: '1px solid var(--color-pink) !important', fontSize: '14px' }}>-</button>
                      <button onClick={() => addScore(p.id, rewardAmount)} className="btn-glass" style={{ width: '28px', height: '28px', borderRadius: '50% !important', padding: 0, color: 'var(--color-teal) !important', border: '1px solid var(--color-teal) !important', fontSize: '14px' }}>+</button>
                    </div>
                  </div>
                ))}
             </div>
           )}
        </div>
      )}
    </div>
  );
}
