import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function QuestionScreen({ state, updateState, role }) {
  const q = state.currentQuestion || {};
  const isModifier = q.modifier;
  const players = state.players || [];
  const openedQuestions = state.openedQuestions || [];

  const openedR1Count = openedQuestions.filter(qid => qid.startsWith('R1_')).length;
  const openedR2Count = openedQuestions.filter(qid => qid.startsWith('R2_')).length;
  const isR1Done = state.currentRound === 'R1' && openedR1Count >= 15;
  const isR2Done = state.currentRound === 'R2' && openedR2Count >= 25;
  
  const [timeLeft, setTimeLeft] = useState(60);
  const [showAnswer, setShowAnswer] = useState(false);
  const [modifierMode, setModifierMode] = useState(false);
  const [modifierPoints, setModifierPoints] = useState(q.cost || 0);

  // Countdown timer (Visual only)
  useEffect(() => {
    if (timeLeft <= 0 || isModifier) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isModifier]);

  const addScore = (playerId, correct, pointsToChange = q.cost) => {
    const updatedPlayers = players.map(p => {
      if (p.id === playerId) return { ...p, score: p.score + (correct ? pointsToChange : -pointsToChange) };
      return p;
    });
    updateState({ players: updatedPlayers });
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
    <div className="container" style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: '20px', overflow: 'hidden' }}>
      
      {/* Background Icons Layer (Reverted back to original request) */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 0, overflow: 'hidden', display: 'flex', flexWrap: 'wrap', gap: '80px', padding: '40px', justifyContent: 'center', opacity: 0.05 }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }} transition={{ duration: 5 + i, repeat: Infinity }}
            style={{ width: '100px', height: '100px', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundImage: i % 2 === 0 ? 'url(/emblem.jpg)' : 'url(/rat.jpg)', filter: 'grayscale(100%) brightness(1.5)' }}
          />
        ))}
      </div>

      {/* Header - Info Row */}
      <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 1, marginBottom: '10px' }}>
         <div style={{ textAlign: 'left' }}>
            <div style={{ color: 'var(--color-teal)', fontWeight: '900', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '4px' }}>{q.topic}</div>
            <div style={{ color: 'var(--color-pink)', fontWeight: '900', fontSize: '24px' }}>{q.cost} дукатов</div>
         </div>
         
         {/* Score List (Subtle top corner) */}
         <div style={{ display: 'flex', gap: '15px' }}>
            {players.map(p => (
              <div key={p.id} style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontWeight: '900', textTransform: 'uppercase' }}>{p.name}</div>
                <div style={{ fontSize: '16px', fontWeight: '900', color: 'white' }}>{p.score}</div>
              </div>
            ))}
         </div>
      </div>

      {/* Main content - Flex items for centering and scaling */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', maxWidth: '1000px', zIndex: 1, gap: '20px', overflow: 'hidden' }}>
        
        {modifierMode ? (
          <div className="btn-glass" style={{ padding: '30px', width: '100%', borderRadius: 'var(--radius-lg) !important', border: '1px solid var(--color-teal) !important', textAlign: 'center' }}>
            <h2 style={{ fontSize: '28px', color: 'var(--color-teal)', marginBottom: '15px', fontWeight: '900' }}>МОДИФИКАТОР</h2>
            <p style={{ fontSize: '18px', marginBottom: '20px' }}>{q.text}</p>
            <input type="number" value={modifierPoints} onChange={e => setModifierPoints(e.target.value)} style={{ padding: '10px', fontSize: '24px', width: '120px', background: 'rgba(0,0,0,0.4)', color: 'white', border: '2px solid var(--color-teal)', borderRadius: 'var(--radius-md)', textAlign: 'center' }} />
          </div>
        ) : isModifier ? (
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '64px', color: 'var(--color-pink)', fontWeight: '900', textShadow: 'var(--shadow-glow-pink)', marginBottom: '15px' }}>МОДИФИКАТОР</h1>
            <p style={{ fontSize: '24px', background: 'rgba(255,255,255,0.03)', padding: '20px 40px', borderRadius: 'var(--radius-lg)' }}>{q.text}</p>
          </div>
        ) : (
          <>
            {(() => {
              const imageFile = q.image || q.answerImage;
              if (imageFile) {
                return (
                  <div style={{ width: '100%', maxHeight: showAnswer ? '35vh' : '45vh', overflow: 'hidden', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'center', boxShadow: 'var(--shadow-card)' }}>
                    <img 
                      src={`/${imageFile}`} 
                      alt="Question" 
                      style={{ 
                        maxWidth: '100%', maxHeight: '100%', objectFit: 'contain',
                        filter: (isBlurAlwaysTopic && !showAnswer) ? 'blur(20px) brightness(0.6)' : (isNoBlurTopic || showAnswer ? 'none' : 'blur(15px) brightness(0.7)'),
                        transition: 'filter 0.5s ease'
                      }} 
                    />
                  </div>
                );
              }
              return <h1 style={{ fontSize: 'clamp(24px, 4vw, 56px)', textAlign: 'center', fontWeight: '900', maxWidth: '800px', margin: 0 }}>{q.text}</h1>;
            })()}

            {(q.image || q.answerImage) && <h2 style={{ fontSize: '24px', textAlign: 'center', color: 'white', fontWeight: '800', width: '100%', margin: 0 }}>{!showAnswer ? q.text : ''}</h2>}

            {showAnswer && q.answer && (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="btn-glass" style={{ padding: '15px 30px', border: '1px solid var(--color-teal) !important', borderRadius: 'var(--radius-md) !important', textAlign: 'center' }}>
                <span style={{ fontSize: '11px', color: 'var(--color-teal)', textTransform: 'uppercase', display: 'block', fontWeight: '900', marginBottom: '4px' }}>Ответ:</span>
                <span style={{ fontSize: '28px', fontWeight: '900', color: 'white' }}>{q.answer}</span>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Footer controls - No scroll ribbon */}
      {role === 'HOST' && (
        <div style={{ width: '100%', maxWidth: '1100px', background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(20px)', borderRadius: 'var(--radius-lg)', padding: '15px', display: 'flex', flexDirection: 'column', gap: '15px', zIndex: 1, border: '1px solid rgba(255,255,255,0.05)' }}>
           
           <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              {!showAnswer && !isModifier && (
                <button className="btn-glass" style={{ padding: '10px 24px', background: 'var(--color-teal) !important', color: 'var(--color-bg-deep) !important', fontWeight: '900', fontSize: '14px' }} onClick={() => setShowAnswer(true)}>ОТКРЫТЬ ОТВЕТ</button>
              )}
              {isModifier && !modifierMode ? (
                <button className="btn-glass" style={{ padding: '10px 24px', background: 'var(--color-teal) !important', color: 'var(--color-bg-deep) !important', fontWeight: '900', fontSize: '14px' }} onClick={() => setModifierMode(true)}>ПРИНЯТЬ РЕШЕНИЕ</button>
              ) : null}
              <button className="btn-glass" style={{ padding: '10px 24px', background: 'var(--color-pink) !important', color: 'white !important', fontWeight: '900', fontSize: '14px' }} onClick={closeQuestion}>ВЫЙТИ В РАУНД</button>
              {(isR1Done || isR2Done) && (
                <button className="btn-glass" style={{ padding: '10px 24px', background: 'linear-gradient(135deg, var(--color-teal), var(--color-pink)) !important', color: 'white !important', fontWeight: '900', fontSize: '14px' }} onClick={() => updateState({ screen: 'TABLE', currentRound: isR1Done ? 'R2' : 'SUPER', currentQuestion: null })}>СЛЕДУЮЩИЙ РАУНД Р2</button>
              )}
              <button className="btn-glass" style={{ padding: '10px 15px', border: '1px solid #ffaa00 !important', color: '#ffaa00 !important', fontSize: '12px' }} onClick={handleSkipQuestion}>ПРОПУСТИТЬ</button>
           </div>

           <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
              {players.map(p => (
                <div key={p.id} className="btn-glass" style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '10px', borderRadius: '40px !important', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05) !important' }}>
                  <span style={{ fontSize: '12px', fontWeight: '900' }}>{p.name}</span>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button onClick={() => addScore(p.id, false, modifierMode ? Number(modifierPoints) : q.cost)} className="btn-glass" style={{ width: '28px', height: '28px', borderRadius: '50% !important', padding: 0, color: 'var(--color-pink) !important', border: '1px solid var(--color-pink) !important', fontSize: '14px' }}>-</button>
                    <button onClick={() => addScore(p.id, true, modifierMode ? Number(modifierPoints) : q.cost)} className="btn-glass" style={{ width: '28px', height: '28px', borderRadius: '50% !important', padding: 0, color: 'var(--color-teal) !important', border: '1px solid var(--color-teal) !important', fontSize: '14px' }}>+</button>
                  </div>
                </div>
              ))}
           </div>
        </div>
      )}

      {/* Progress Bar (Subtle) */}
      {!isModifier && (
         <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)' }}>
            <motion.div animate={{ width: `${(timeLeft / 60) * 100}%` }} style={{ height: '100%', background: 'var(--color-teal)' }} />
         </div>
      )}
    </div>
  );
}
