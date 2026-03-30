import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuestionScreen({ state, updateState, role }) {
  const q = state.currentQuestion || {};
  const isModifier = q.modifier;
  const players = state.players || [];
  const openedQuestions = state.openedQuestions || [];

  const [timeLeft, setTimeLeft] = useState(60);
  const [showAnswer, setShowAnswer] = useState(false);
  const [modifierMode, setModifierMode] = useState(false);
  const [modifierPoints, setModifierPoints] = useState(q.cost || 0);

  // Timer logic
  useEffect(() => {
    if (timeLeft <= 0 || isModifier || showAnswer) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isModifier, showAnswer]);

  const addScore = (playerId, correct, pointsToChange = q.cost) => {
    const updatedPlayers = players.map(p => {
      if (p.id === playerId) return { ...p, score: p.score + (correct ? Number(pointsToChange) : -Number(pointsToChange)) };
      return p;
    });
    updateState({ players: updatedPlayers });
    if (modifierMode) setModifierMode(false); // Close modifier after action
  };

  const handleSkipQuestion = () => {
    const updatedPlayers = players.map(p => ({ ...p, score: p.score - q.cost }));
    updateState({ players: updatedPlayers, screen: 'TABLE', currentQuestion: null });
  };

  const closeQuestion = () => updateState({ screen: 'TABLE', currentQuestion: null });

  const topicLower = (q.topic || "").toLowerCase().trim();
  const isNoBlurTopic = topicLower.includes("что по встрече") || topicLower.includes("брендомания");
  const isBlurAlwaysTopic = (topicLower.includes("угадай мем") || topicLower.includes("куда течет река")) && !isNoBlurTopic;

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
            style={{ position: 'absolute', width: '100px', height: '100px', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundImage: i % 2 === 0 ? 'url(/emblem.jpg)' : 'url(/rat.jpg)', filter: 'grayscale(100%)' }} 
          />
        ))}
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '30px', zIndex: 1, position: 'relative' }}>
        
        {/* Header Branding */}
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '10px', color: 'var(--color-teal)', fontWeight: '900', letterSpacing: '4px', textTransform: 'uppercase' }}>РАЗДЕЛ: {q.topic}</div>
            <div style={{ fontSize: '32px', fontWeight: '900', color: 'white' }}>{q.cost} дукатов</div>
          </div>
          
          {!isModifier && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '24px', fontWeight: '900', color: timeLeft < 10 ? 'var(--color-pink)' : 'white' }}>
                {timeLeft}s
              </div>
            </div>
          )}
        </div>

        {/* Central Question Display */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
          
          {modifierMode ? (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="btn-glass" style={{ padding: '40px', width: '100%', maxWidth: '600px', borderRadius: 'var(--radius-lg) !important', border: '2px solid var(--color-pink) !important', textAlign: 'center' }}>
               <h2 style={{ fontSize: '24px', color: 'var(--color-pink)', fontWeight: '900', marginBottom: '20px' }}>ПРИНЯТЬ РЕШЕНИЕ</h2>
               <div style={{ marginBottom: '30px' }}>
                 <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '10px' }}>СУММА БАЛЛОВ:</div>
                 <input 
                  type="number" 
                  value={modifierPoints} 
                  onChange={e => setModifierPoints(e.target.value)} 
                  style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-teal)', color: 'white', fontSize: '32px', padding: '10px 20px', borderRadius: 'var(--radius-md)', width: '150px', textAlign: 'center', outline: 'none' }} 
                 />
               </div>
               <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
                  {players.map(p => (
                    <div key={p.id} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>{p.name}</span>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button onClick={() => addScore(p.id, false, modifierPoints)} className="btn-glass" style={{ width: '40px', height: '40px', borderRadius: '50% !important', color: 'var(--color-pink) !important', border: '1px solid var(--color-pink) !important' }}>-</button>
                        <button onClick={() => addScore(p.id, true, modifierPoints)} className="btn-glass" style={{ width: '40px', height: '40px', borderRadius: '50% !important', color: 'var(--color-teal) !important', border: '1px solid var(--color-teal) !important' }}>+</button>
                      </div>
                    </div>
                  ))}
               </div>
               <button onClick={() => setModifierMode(false)} style={{ marginTop: '30px', fontSize: '12px', opacity: 0.5, textDecoration: 'underline' }}>Отмена</button>
            </motion.div>
          ) : isModifier ? (
            <div style={{ textAlign: 'center' }}>
               <h1 style={{ fontSize: '72px', color: 'var(--color-pink)', fontWeight: '900', textShadow: 'var(--shadow-glow-pink)', margin: '0 0 20px 0' }}>МОДИФИКАТОР</h1>
               <div className="btn-glass" style={{ padding: '30px 50px', borderRadius: 'var(--radius-lg) !important', fontSize: '28px', border: '1px solid rgba(255,255,255,0.1) !important' }}>
                 {q.text}
               </div>
            </div>
          ) : (
            <>
              {(() => {
                const imageFile = q.image || q.answerImage;
                if (imageFile) {
                  return (
                    <div style={{ width: '100%', maxHeight: showAnswer ? '35vh' : '45vh', display: 'flex', justifyContent: 'center', borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
                      <img 
                        src={`/${imageFile}`} 
                        alt="Question" 
                        style={{ 
                          maxWidth: '100%', maxHeight: '100%', objectFit: 'contain',
                          filter: (isBlurAlwaysTopic && !showAnswer) ? 'blur(25px) brightness(0.5)' : (isNoBlurTopic || showAnswer ? 'none' : 'blur(20px) brightness(0.6)'),
                          transition: 'filter 0.6s ease'
                        }} 
                      />
                    </div>
                  );
                }
                return <h1 style={{ fontSize: 'clamp(32px, 5vw, 64px)', textAlign: 'center', fontWeight: '900', lineHeight: 1.1, margin: 0 }}>{q.text}</h1>;
              })()}

              {(q.image || q.answerImage) && <h2 style={{ fontSize: '24px', textAlign: 'center', color: 'white', fontWeight: '800', width: '100%', margin: 0 }}>{!showAnswer ? q.text : ''}</h2>}

              <AnimatePresence>
                {showAnswer && q.answer && (
                  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="btn-glass" style={{ padding: '20px 40px', border: '2px solid var(--color-teal) !important', borderRadius: 'var(--radius-md) !important', textAlign: 'center', marginTop: '10px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--color-teal)', textTransform: 'uppercase', display: 'block', fontWeight: '900', letterSpacing: '2px', marginBottom: '8px' }}>ОТВЕТ:</span>
                    <span style={{ fontSize: '36px', fontWeight: '900', color: 'white' }}>{q.answer}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>

        {/* Compact Host Ribbon (Bottom) */}
        {role === 'HOST' && (
          <div style={{ marginTop: '20px', padding: '15px 20px', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(30px)', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              {!showAnswer && !isModifier && (
                <button className="btn-glass" style={{ padding: '10px 30px', background: 'var(--color-teal) !important', color: 'var(--color-bg-deep) !important', fontWeight: '900', fontSize: '14px' }} onClick={() => setShowAnswer(true)}>ОТКРЫТЬ ОТВЕТ</button>
              )}
              {isModifier && !modifierMode ? (
                <button className="btn-glass" style={{ padding: '10px 30px', background: 'var(--color-pink) !important', color: 'white !important', fontWeight: '900', fontSize: '14px' }} onClick={() => setModifierMode(true)}>НАЧИСЛИТЬ БАЛЛЫ</button>
              ) : null}
              <button className="btn-glass" style={{ padding: '10px 30px', fontWeight: '900', fontSize: '14px' }} onClick={closeQuestion}>ВЫЙТИ В РАУНД</button>
              <button className="btn-glass" style={{ padding: '10px 20px', fontSize: '12px', opacity: 0.6 }} onClick={handleSkipQuestion}>ПРОПУСТИТЬ</button>
            </div>

            {!modifierMode && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
                {players.map(p => (
                  <div key={p.id} className="btn-glass" style={{ padding: '5px 12px', display: 'flex', alignItems: 'center', gap: '10px', borderRadius: '40px !important', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05) !important' }}>
                    <span style={{ fontSize: '12px', fontWeight: '800' }}>{p.name}</span>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button onClick={() => addScore(p.id, false)} className="btn-glass" style={{ width: '24px', height: '24px', borderRadius: '50% !important', padding: 0, color: 'var(--color-pink) !important', border: '1px solid var(--color-pink) !important', fontSize: '14px' }}>-</button>
                      <button onClick={() => addScore(p.id, true)} className="btn-glass" style={{ width: '24px', height: '24px', borderRadius: '50% !important', padding: 0, color: 'var(--color-teal) !important', border: '1px solid var(--color-teal) !important', fontSize: '14px' }}>+</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Progress Bar (More visible style) */}
        {!isModifier && !showAnswer && (
          <div style={{ position: 'absolute', bottom: '0', left: '0', width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)' }}>
            <motion.div animate={{ width: `${(timeLeft / 60) * 100}%` }} style={{ height: '100%', background: 'var(--color-teal)', boxShadow: '0 0 15px var(--color-teal)' }} />
          </div>
        )}
      </div>

      {/* FIXED RIGHT SIDEBAR - Scoreboard */}
      <div style={{ width: '260px', height: '100vh', background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(30px)', borderLeft: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', padding: '30px 20px', zIndex: 2 }}>
        <h3 style={{ fontSize: '10px', color: 'var(--color-text-muted)', letterSpacing: '4px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '20px' }}>СЧЁТ ИГРЫ</h3>
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
