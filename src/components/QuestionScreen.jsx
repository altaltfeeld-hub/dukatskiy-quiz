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

  // Simple countdown timer (visual only, no auto-redirect)
  useEffect(() => {
    if (timeLeft <= 0 || isModifier) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isModifier]);

  const addScore = (playerId, correct, pointsToChange = q.cost) => {
    const updatedPlayers = players.map(p => {
      if (p.id === playerId) {
        return { ...p, score: p.score + (correct ? pointsToChange : -pointsToChange) };
      }
      return p;
    });
    updateState({ players: updatedPlayers });
  };

  const handleSkipQuestion = () => {
    const updatedPlayers = players.map(p => ({
      ...p, score: p.score - q.cost
    }));
    updateState({ players: updatedPlayers, screen: 'TABLE', currentQuestion: null });
  };

  const closeQuestion = () => {
    updateState({ screen: 'TABLE', currentQuestion: null });
  };

  const topicLower = (q.topic || "").toLowerCase().trim();
  const isNoBlurTopic = topicLower.includes("что по встрече") || topicLower.includes("брендомания");
  const isBlurAlwaysTopic = (topicLower.includes("угадай мем") || topicLower.includes("куда течет река")) && !isNoBlurTopic;

  // New Sleek Sidebar Scoreboard
  const BroadcastScoreboard = () => (
    <div style={{ 
      width: '240px', height: '100vh', 
      background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(30px)',
      borderLeft: '1px solid rgba(255,255,255,0.1)',
      display: 'flex', flexDirection: 'column', padding: '30px 20px', zIndex: 100
    }}>
      <div style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--color-teal)', letterSpacing: '2px', fontWeight: '900', marginBottom: '25px', opacity: 0.7 }}>
        Счёт игры
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto' }}>
        {players.sort((a, b) => b.score - a.score).map((p, idx) => (
          <motion.div 
            key={p.id}
            initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
            style={{ 
              display: 'flex', flexDirection: 'column', gap: '4px',
              borderLeft: idx === 0 ? '3px solid var(--color-teal)' : '1px solid rgba(255,255,255,0.1)',
              paddingLeft: '15px'
            }}
          >
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', fontWeight: 'bold' }}>{p.name}</div>
            <div style={{ fontSize: '24px', color: idx === 0 ? 'white' : 'var(--color-pink)', fontWeight: '900' }}>{p.score}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="container" style={{ height: '100vh', width: '100vw', display: 'flex', padding: 0, overflow: 'hidden' }}>
      
      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', position: 'relative' }}>
        
        {/* Top Progress / Info Bar */}
        <div style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
           <div>
             <span style={{ color: 'var(--color-teal)', fontWeight: '900', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '4px' }}>{q.topic}</span>
             <span style={{ color: 'white', margin: '0 15px', opacity: 0.3 }}>|</span>
             <span style={{ color: 'var(--color-pink)', fontWeight: '900', fontSize: '12px' }}>{q.cost} дукатов</span>
           </div>
           
           {!isModifier && (
             <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
               <div style={{ fontSize: '14px', fontWeight: '900', color: timeLeft <= 10 ? 'var(--color-pink)' : 'white' }}>{timeLeft} сек.</div>
               <div style={{ width: '100px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                 <motion.div animate={{ width: `${(timeLeft / 60) * 100}%` }} style={{ height: '100%', background: timeLeft <= 10 ? 'var(--color-pink)' : 'var(--color-teal)' }} />
               </div>
             </div>
           )}
        </div>

        {/* Center Question Area - No Scrolling */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 40px', overflow: 'hidden' }}>
           
           {modifierMode ? (
              /* Modifier Panel specifically UI */
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="btn-glass" style={{ padding: '40px', maxWidth: '700px', width: '100%', border: '1px solid var(--color-teal) !important', textAlign: 'center' }}>
                 <h2 style={{ fontSize: '32px', color: 'var(--color-teal)', marginBottom: '30px', fontWeight: '900' }}>МОДИФИКАТОР</h2>
                 <p style={{ fontSize: '18px', color: 'white', opacity: 0.8, marginBottom: '30px' }}>{q.text}</p>
                 <div style={{ marginBottom: '30px' }}>
                   <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: '10px' }}>Ставка баллов:</div>
                   <input 
                     type="number" value={modifierPoints} onChange={e => setModifierPoints(e.target.value)} 
                     style={{ padding: '15px', fontSize: '24px', width: '150px', background: 'rgba(0,0,0,0.4)', color: 'white', border: '2px solid var(--color-teal)', borderRadius: 'var(--radius-md)', textAlign: 'center' }} 
                   />
                 </div>
              </motion.div>
           ) : isModifier && !modifierMode ? (
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ textAlign: 'center' }}>
                 <h1 style={{ fontSize: '80px', color: 'var(--color-pink)', fontWeight: '900', textShadow: 'var(--shadow-glow-pink)', marginBottom: '20px' }}>МОДИФИКАТОР</h1>
                 <p style={{ fontSize: '32px', background: 'rgba(255,255,255,0.05)', padding: '30px 50px', borderRadius: 'var(--radius-lg)' }}>{q.text}</p>
                 {role === 'HOST' && <button className="btn-glass" style={{ marginTop: '40px', padding: '16px 48px', fontSize: '20px', background: 'var(--color-teal) !important', color: 'var(--color-bg-deep) !important', fontWeight: '900' }} onClick={() => setModifierMode(true)}>ПРИНЯТЬ РЕШЕНИЕ</button>}
              </motion.div>
           ) : (
              /* Regular Question Content */
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px' }}>
                 {(() => {
                   const imageFile = q.image || q.answerImage;
                   if (imageFile) {
                     return (
                       <div style={{ width: '100%', maxHeight: showAnswer ? '45vh' : '55vh', overflow: 'hidden', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'center', boxShadow: 'var(--shadow-card)' }}>
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
                   return <h1 style={{ fontSize: 'clamp(24px, 5vw, 64px)', textAlign: 'center', fontWeight: '900', maxWidth: '900px' }}>{q.text}</h1>;
                 })()}

                 {(q.image || q.answerImage) && <h2 style={{ fontSize: '32px', textAlign: 'center', color: 'white', fontWeight: '800', maxWidth: '800px' }}>{!showAnswer ? q.text : ''}</h2>}

                 {showAnswer && q.answer && (
                   <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="btn-glass" style={{ padding: '24px 48px', border: '2px solid var(--color-teal) !important', borderRadius: 'var(--radius-md) !important', boxShadow: '0 0 40px rgba(127, 215, 205, 0.2)' }}>
                      <span style={{ fontSize: '18px', color: 'var(--color-teal)', textTransform: 'uppercase', display: 'block', marginBottom: '5px', fontWeight: '900' }}>Ответ:</span>
                      <span style={{ fontSize: '42px', fontWeight: '900', color: 'white' }}>{q.answer}</span>
                   </motion.div>
                 )}
              </div>
           )}
        </div>

        {/* Bottom Control Ribbon (Fixed Height) */}
        {role === 'HOST' && (
          <div style={{ 
            padding: '24px 40px', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
              {!showAnswer && !isModifier && (
                <button className="btn-glass" style={{ padding: '12px 32px', background: 'var(--color-teal) !important', color: 'var(--color-bg-deep) !important', fontWeight: '900' }} onClick={() => setShowAnswer(true)}>ОТКРЫТЬ ОТВЕТ</button>
              )}
              <button className="btn-glass" style={{ padding: '12px 32px', background: 'var(--color-pink) !important', color: 'white !important', fontWeight: '900' }} onClick={closeQuestion}>ВЫЙТИ В РАУНД</button>
              {(isR1Done || isR2Done) && (
                 <button className="btn-glass" style={{ padding: '12px 32px', background: 'linear-gradient(135deg, var(--color-teal), var(--color-pink)) !important', color: 'white !important', fontWeight: '900' }} onClick={() => updateState({ screen: 'TABLE', currentRound: isR1Done ? 'R2' : 'SUPER', currentQuestion: null })}>СЛЕДУЮЩИЙ РАУНД ⏩</button>
              )}
              {!showAnswer && !isModifier && (
                <button className="btn-glass" style={{ padding: '12px 24px', border: '1px solid #ffaa00 !important', color: '#ffaa00 !important' }} onClick={handleSkipQuestion}>ПРОПУСТИТЬ</button>
              )}
              <button className="btn-glass" style={{ padding: '12px 20px', fontSize: '10px', opacity: 0.5 }} onClick={() => updateState({ screen: 'START', currentQuestion: null })}>Прервать игру</button>
            </div>

            {/* Compact Player List for Host */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
              {players.map(p => (
                <div key={p.id} className="btn-glass" style={{ padding: '8px 15px', display: 'flex', alignItems: 'center', gap: '12px', borderRadius: '40px !important', background: 'rgba(255,255,255,0.03)' }}>
                  <span style={{ fontSize: '13px', fontWeight: '900' }}>{p.name}</span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => addScore(p.id, false, modifierMode ? Number(modifierPoints) : q.cost)} className="btn-glass" style={{ width: '32px', height: '32px', borderRadius: '50% !important', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-pink)', border: '1px solid var(--color-pink) !important', fontSize: '16px' }}>-</button>
                    <button onClick={() => addScore(p.id, true, modifierMode ? Number(modifierPoints) : q.cost)} className="btn-glass" style={{ width: '32px', height: '32px', borderRadius: '50% !important', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-teal)', border: '1px solid var(--color-teal) !important', fontSize: '16px' }}>+</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sleek Vertical Scoreboard Sidebar */}
      <BroadcastScoreboard />
    </div>
  );
}
