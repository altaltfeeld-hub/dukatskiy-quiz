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

  // Timer logic for final question
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

  // Sleek Sidebar Scoreboard (Consistent with QuestionScreen)
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
               <span style={{ color: 'var(--color-teal)', fontWeight: '900', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '4px' }}>СУПЕР-ИГРА</span>
               {openedFinal && remaining.length === 1 && (
                 <>
                   <span style={{ color: 'white', margin: '0 15px', opacity: 0.3 }}>|</span>
                   <span style={{ color: 'var(--color-pink)', fontWeight: '900', fontSize: '12px' }}>{remaining[0].topic}</span>
                 </>
               )}
             </div>
             
             {openedFinal && !showAnswer && (
               <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                 <div style={{ fontSize: '14px', fontWeight: '900', color: timeLeft <= 10 ? 'var(--color-pink)' : 'white' }}>{timeLeft} сек.</div>
                 <div style={{ width: '100px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                   <motion.div animate={{ width: `${(timeLeft / 60) * 100}%` }} style={{ height: '100%', background: timeLeft <= 10 ? 'var(--color-pink)' : 'var(--color-teal)' }} />
                 </div>
               </div>
             )}
          </div>

          {/* Center Game Area - No Scrolling */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 40px', overflow: 'hidden' }}>
             
             {openedFinal && remaining.length === 1 ? (
                /* Final Question View */
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                   {(() => {
                     const finalQ = remaining[0];
                     const topicLower = (finalQ.topic || "").toLowerCase().trim();
                     const isNoBlurTopic = topicLower.includes("что по встрече") || topicLower.includes("брендомания");
                     const isBlurAlwaysTopic = (topicLower.includes("угадай мем") || topicLower.includes("куда течет река")) && !isNoBlurTopic;
                     const imageFile = finalQ.image || finalQ.answerImage;

                     if (imageFile) {
                       return (
                         <div style={{ width: '100%', maxHeight: showAnswer ? '40vh' : '50vh', overflow: 'hidden', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'center', boxShadow: 'var(--shadow-card)' }}>
                           <img 
                              src={`/${imageFile}`} alt="Final"
                              style={{ 
                                maxWidth: '100%', maxHeight: '100%', objectFit: 'contain',
                                filter: (isBlurAlwaysTopic && !showAnswer) ? 'blur(20px) brightness(0.6)' : (isNoBlurTopic || showAnswer ? 'none' : 'blur(15px) brightness(0.7)'),
                                transition: 'filter 0.5s ease'
                              }} 
                           />
                         </div>
                       );
                     }
                     return <h1 style={{ fontSize: '70px', fontWeight: '900' }}>{finalQ.text}</h1>;
                   })()}

                   <h2 style={{ fontSize: '32px', color: 'white', fontWeight: '800' }}>{!showAnswer ? remaining[0].text : ''}</h2>

                   {showAnswer && remaining[0].answer && (
                     <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="btn-glass" style={{ padding: '24px 48px', border: '2px solid var(--color-teal) !important', borderRadius: 'var(--radius-md) !important' }}>
                        <span style={{ fontSize: '18px', color: 'var(--color-teal)', textTransform: 'uppercase', marginBottom: '5px', fontWeight: '900' }}>Ответ:</span>
                        <span style={{ fontSize: '42px', fontWeight: '900', color: 'white' }}>{remaining[0].answer}</span>
                     </motion.div>
                   )}
                </div>
             ) : (
                /* Topic Removal Phase */
                <div style={{ textAlign: 'center', width: '100%', maxWidth: '1000px' }}>
                   <h1 style={{ fontSize: '48px', color: 'var(--color-teal)', fontWeight: '900', marginBottom: '40px' }}>ВЫБОР ТЕМЫ</h1>
                   <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'center' }}>
                      {SUPER_GAME_DATA.map(t => {
                        const isRemoved = removedTopics.includes(t.topic);
                        return (
                          <div key={t.topic} className="btn-glass" style={{ 
                            padding: '20px 30px', borderRadius: 'var(--radius-lg) !important', minWidth: '250px',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            background: isRemoved ? 'rgba(255,255,255,0.02) !important' : 'rgba(255,255,255,0.05) !important',
                            opacity: isRemoved ? 0.3 : 1
                          }}>
                            <span style={{ fontSize: '1.2rem', fontWeight: '800' }}>{t.topic}</span>
                            {role === 'HOST' && !isRemoved && remaining.length > 1 && (
                              <button className="btn-glass" style={{ background: 'rgba(255,50,50,0.1) !important', color: '#ff8888 !important', padding: '6px 12px', fontSize: '11px', fontWeight: '900' }} onClick={() => handleRemove(t.topic)}>УБРАТЬ</button>
                            )}
                          </div>
                        );
                      })}
                   </div>
                   {role === 'HOST' && remaining.length === 1 && !openedFinal && (
                      <button className="btn-glass" style={{ marginTop: '50px', padding: '24px 64px', fontSize: '28px', background: 'var(--color-pink) !important', color: 'white !important', fontWeight: '900' }} onClick={() => setOpenedFinal(true)}>ИГРАТЬ ФИНАЛ 🚀</button>
                   )}
                </div>
             )}
          </div>

          {/* Bottom Host Ribbon (Fixed Height) */}
          {role === 'HOST' && (
            <div style={{ 
              padding: '24px 40px', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(20px)',
              borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '20px'
            }}>
              
              <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                  {openedFinal && !showAnswer && (
                    <button className="btn-glass" style={{ padding: '12px 32px', background: 'var(--color-teal) !important', color: 'var(--color-bg-deep) !important', fontWeight: '900' }} onClick={() => setShowAnswer(true)}>ОТКРЫТЬ ОТВЕТ</button>
                  )}
                  {showAnswer && (
                    <button className="btn-glass" style={{ padding: '12px 32px', background: 'var(--color-pink) !important', color: 'white !important', fontWeight: '900' }} onClick={() => updateState({ screen: 'WINNER_SCREEN' })}>🏆 К ПОБЕДИТЕЛЮ</button>
                  )}
                  <button className="btn-glass" style={{ padding: '12px 20px', fontSize: '10px', opacity: 0.5 }} onClick={() => updateState({ screen: 'START' })}>На главный</button>
              </div>

              {openedFinal && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Ставка:</span>
                    <input type="number" value={rewardAmount} onChange={e => setRewardAmount(e.target.value)} style={{ padding: '8px', fontSize: '18px', width: '100px', background: 'rgba(0,0,0,0.3)', color: 'white', border: '1px solid var(--color-teal)', borderRadius: 'var(--radius-md)', textAlign: 'center' }} />
                  </div>
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {players.map(p => (
                      <div key={p.id} className="btn-glass" style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '10px', borderRadius: '40px !important' }}>
                        <span style={{ fontSize: '11px', fontWeight: '900' }}>{p.name}</span>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button onClick={() => addScore(p.id, -rewardAmount)} className="btn-glass" style={{ width: '28px', height: '28px', borderRadius: '50% !important', padding: 0, color: 'var(--color-pink)', border: '1px solid var(--color-pink) !important', fontSize: '14px' }}>-</button>
                          <button onClick={() => addScore(p.id, rewardAmount)} className="btn-glass" style={{ width: '28px', height: '28px', borderRadius: '50% !important', padding: 0, color: 'var(--color-teal)', border: '1px solid var(--color-teal) !important', fontSize: '14px' }}>+</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
      </div>

      {/* Consistent Vertical Scoreboard Sidebar */}
      <BroadcastScoreboard />
    </div>
  );
}
