import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
            style={{ position: 'absolute', width: '120px', height: '120px', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundImage: i % 2 === 0 ? 'url(/emblem.jpg)' : 'url(/rat.jpg)', filter: 'grayscale(100%) brightness(1.2)' }} 
          />
        ))}
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '30px', zIndex: 1, position: 'relative', overflow: 'hidden' }}>
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
          
          <AnimatePresence mode="wait">
            {openedFinal && remaining.length === 1 ? (
              /* Final Question View */
              <motion.div key="final" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', width: '100%', maxWidth: '900px' }}>
                <h1 style={{ fontSize: '48px', color: 'var(--color-pink)', fontWeight: '900', letterSpacing: '8px', margin: 0 }}>СУПЕР-ИГРА</h1>
                
                {(() => {
                  const finalQ = remaining[0];
                  const imageFile = finalQ.image || finalQ.answerImage;
                  if (imageFile) {
                    return (
                      <div style={{ width: '100%', maxHeight: '40vh', overflow: 'hidden', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'center', boxShadow: 'var(--shadow-card)' }}>
                        <img src={`/${imageFile}`} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                      </div>
                    );
                  }
                  return <h2 style={{ fontSize: '56px', fontWeight: '900', textAlign: 'center', lineHeight: 1.1 }}>{finalQ.text}</h2>;
                })()}

                <h3 style={{ fontSize: '28px', fontWeight: '800', textAlign: 'center', margin: 0 }}>{!showAnswer ? remaining[0].text : ''}</h3>

                {showAnswer && remaining[0].answer && (
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="btn-glass" style={{ padding: '20px 40px', border: '2px solid var(--color-teal) !important', borderRadius: 'var(--radius-md) !important', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: 'var(--color-teal)', fontWeight: '900', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '2px' }}>ОТВЕТ:</div>
                    <div style={{ fontSize: '42px', fontWeight: '900', color: 'white' }}>{remaining[0].answer}</div>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              /* Topic Choice View */
              <motion.div key="topics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', width: '100%', maxWidth: '1000px' }}>
                <h1 style={{ fontSize: '42px', color: 'var(--color-teal)', fontWeight: '900', letterSpacing: '6px', marginBottom: '40px' }}>ВЫБОР ТЕМЫ</h1>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'center', width: '100%' }}>
                  {SUPER_GAME_DATA.map(t => {
                    const isRemoved = removedTopics.includes(t.topic);
                    return (
                      <div key={t.topic} className="btn-glass" style={{ 
                        padding: '20px 30px', borderRadius: 'var(--radius-lg) !important', minWidth: '240px',
                        background: isRemoved ? 'rgba(0,0,0,0.3) !important' : 'rgba(255,255,255,0.05) !important',
                        opacity: isRemoved ? 0.3 : 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        transition: 'all 0.3s ease', border: isRemoved ? '1px dashed rgba(255,255,255,0.1) !important' : '1px solid rgba(255,255,255,0.1) !important'
                      }}>
                        <span style={{ fontSize: '1.4rem', fontWeight: '900', color: 'white' }}>{t.topic}</span>
                        {role === 'HOST' && !isRemoved && remaining.length > 1 && (
                          <button className="btn-glass" style={{ background: 'rgba(232, 93, 141, 0.1) !important', color: 'var(--color-pink) !important', padding: '6px 15px', fontSize: '11px', fontWeight: '900' }} onClick={() => handleRemove(t.topic)}>УБРАТЬ</button>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                {role === 'HOST' && remaining.length === 1 && !openedFinal && (
                  <motion.button initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="btn-glass" style={{ marginTop: '50px', padding: '25px 80px', fontSize: '28px', background: 'var(--color-pink) !important', color: 'white !important', fontWeight: '900', boxShadow: '0 0 50px rgba(232, 93, 141, 0.3)' }} onClick={() => setOpenedFinal(true)}>
                    ИГРАТЬ ФИНАЛ 🚀
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Compact Host Ribbon (Bottom) */}
        {role === 'HOST' && (
          <div style={{ marginTop: '20px', padding: '20px', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(30px)', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
              {openedFinal && !showAnswer && (
                <button className="btn-glass" style={{ padding: '12px 35px', background: 'var(--color-teal) !important', color: 'var(--color-bg-deep) !important', fontSize: '15px', fontWeight: '900' }} onClick={() => setShowAnswer(true)}>ОТКРЫТЬ ОТВЕТ</button>
              )}
              {showAnswer && (
                <button className="btn-glass" style={{ padding: '12px 35px', background: 'var(--color-pink) !important', color: 'white !important', fontSize: '15px', fontWeight: '900' }} onClick={() => updateState({ screen: 'WINNER_SCREEN' })}>🏆 К ПОБЕДИТЕЛЮ</button>
              )}
              <button className="btn-glass" style={{ padding: '12px 25px', fontSize: '13px', opacity: 0.6 }} onClick={() => updateState({ screen: 'START' })}>В МЕНЮ</button>
            </div>
            
            {openedFinal && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(0,0,0,0.3)', padding: '5px 15px', borderRadius: '40px', border: '1px solid var(--color-teal)' }}>
                  <span style={{ fontSize: '11px', color: 'var(--color-teal)', fontWeight: '900' }}>СТАВКА:</span>
                  <input type="number" value={rewardAmount} onChange={e => setRewardAmount(e.target.value)} style={{ padding: '5px', fontSize: '20px', width: '100px', background: 'transparent', color: 'white', border: 'none', textAlign: 'center', outline: 'none', fontWeight: '900' }} />
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {players.map(p => (
                    <div key={p.id} className="btn-glass" style={{ padding: '6px 15px', display: 'flex', alignItems: 'center', gap: '10px', borderRadius: '40px !important', background: 'rgba(255,255,255,0.03)' }}>
                      <span style={{ fontSize: '12px', fontWeight: '800' }}>{p.name}</span>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button onClick={() => addScore(p.id, -rewardAmount)} className="btn-glass" style={{ width: '28px', height: '28px', borderRadius: '50% !important', padding: 0, color: 'var(--color-pink) !important', border: '1px solid var(--color-pink) !important', fontSize: '16px' }}>-</button>
                        <button onClick={() => addScore(p.id, rewardAmount)} className="btn-glass" style={{ width: '28px', height: '28px', borderRadius: '50% !important', padding: 0, color: 'var(--color-teal) !important', border: '1px solid var(--color-teal) !important', fontSize: '16px' }}>+</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* FIXED RIGHT SIDEBAR - Scoreboard */}
      <div style={{ width: '260px', height: '100vh', background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(30px)', borderLeft: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', padding: '30px 20px', zIndex: 2 }}>
        <h3 style={{ fontSize: '10px', color: 'var(--color-text-muted)', letterSpacing: '4px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '20px' }}>ФИНАЛЬНЫЙ СЧЁТ</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {players.map(p => (
            <div key={p.id} className="btn-glass" style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03) !important' }}>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '12px', fontWeight: '800', color: 'white' }}>{p.name}</div>
                <div style={{ fontSize: '20px', fontWeight: '900', color: 'var(--color-pink)' }}>{p.score}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
