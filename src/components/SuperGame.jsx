import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SUPER_GAME_DATA } from '../data';

export default function SuperGame({ state, updateState, role }) {
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

  if (openedFinal && remaining.length === 1) {
    const finalQ = remaining[0];
    return (
      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', textAlign: 'center', padding: '40px 0' }}>
        
        {/* Timer Bar */}
        {!showAnswer && (
          <div style={{ width: '100%', maxWidth: '800px', background: 'rgba(255,255,255,0.05)', height: '8px', borderRadius: '4px', overflow: 'hidden', marginBottom: '40px' }}>
            <div style={{ width: `${(timeLeft / 60) * 100}%`, height: '100%', background: 'var(--color-teal)', transition: 'width 1s linear' }} />
          </div>
        )}

        <div className="stacked-content" style={{ alignItems: 'center', width: '100%', maxWidth: '1200px' }}>
          <div>
            <h1 style={{ color: 'var(--color-pink)', marginBottom: '10px', fontSize: '24px', letterSpacing: '4px' }}>ФИНАЛЬНЫЙ ВОПРОС</h1>
            <h2 style={{ color: 'var(--color-teal)', marginBottom: '30px', fontSize: '32px' }}>{finalQ.topic}</h2>
          </div>
          
          {/* Topic-specific Logic */}
          {(() => {
            const topic = finalQ.topic || "";
            const isSpecialCropTopic = topic === "Угадай мем" || topic === "Куда течет река";
            const isNoBlurTopic = topic === "Что по встрече?" || isSpecialCropTopic;
            const imageFile = finalQ.image || finalQ.answerImage;

            if (showAnswer) {
               const finalImage = finalQ.answerImage || (isSpecialCropTopic ? `quiz/full/${imageFile}` : imageFile);
               return finalImage ? (
                 <img 
                    src={`/${finalImage}`} 
                    alt="Answer" 
                    style={{ width: '100%', maxHeight: '40vh', objectFit: 'contain', borderRadius: 'var(--radius-md)' }} 
                 />
               ) : (
                 <p style={{ fontSize: 'clamp(24px, 5vw, 48px)', lineHeight: '1.3', margin: 0 }}>{finalQ.text}</p>
               );
            } else {
               const qImage = isSpecialCropTopic ? `quiz/cropped/${imageFile}` : imageFile;
               return (
                 <>
                   {qImage && (
                     <div style={{ position: 'relative', width: '100%', maxHeight: '40vh', overflow: 'hidden', borderRadius: 'var(--radius-md)' }}>
                       <img 
                          src={`/${qImage}`} 
                          alt="Question" 
                          style={{ 
                            width: '100%', height: '100%', objectFit: 'contain', 
                            filter: isNoBlurTopic ? 'none' : 'blur(15px) brightness(0.8)', 
                            transition: 'filter 0.5s ease' 
                          }} 
                        />
                       {!isNoBlurTopic && (
                         <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                            <span className="btn-glass" style={{ padding: '10px 20px', fontSize: '14px' }}>ИЗОБРАЖЕНИЕ СКРЫТО</span>
                         </div>
                       )}
                     </div>
                   )}
                   <p style={{ fontSize: 'clamp(24px, 5vw, 48px)', lineHeight: '1.3', margin: 0 }}>{finalQ.text}</p>
                 </>
               );
            }
          })()}
          
          {showAnswer && finalQ.answer && (
             <motion.div 
               initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
               className="btn-glass" 
               style={{ marginTop: '10px', padding: '30px', borderRadius: 'var(--radius-md)', fontSize: '32px', color: 'var(--color-teal)', border: '1px solid var(--color-teal) !important' }}
             >
               ОТВЕТ: <span style={{ color: 'white' }}>{finalQ.answer}</span>
             </motion.div>
          )}

          {role === 'HOST' && (
            <div className="btn-glass" style={{ marginTop: '40px', padding: '30px', width: '100%', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
                <span style={{ fontSize: '18px' }}>Ставка за верный ответ:</span>
                <input 
                  type="number" 
                  value={rewardAmount} 
                  onChange={e => setRewardAmount(e.target.value)}
                  style={{ width: '120px', padding: '10px', fontSize: '20px', background: 'rgba(0,0,0,0.3)', color: 'white', border: '1px solid var(--color-teal)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '30px' }}>
                {state.players.map(p => (
                  <button 
                    key={p.id}
                    className="btn-glass"
                    style={{ padding: '12px 20px', border: '1px solid var(--color-teal) !important', color: 'var(--color-teal) !important' }}
                    onClick={() => addScore(p.id, rewardAmount)}
                  >
                    + {p.name} ({p.score})
                  </button>
                ))}
              </div>

              <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '20px 0' }} />

              <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                {!showAnswer && (
                  <button className="btn-glass" style={{ padding: '16px 40px', fontSize: '24px', background: 'var(--color-teal) !important', color: 'var(--color-bg-deep) !important' }} onClick={() => setShowAnswer(true)}>
                    Проверить ответ
                  </button>
                )}
                {showAnswer && (
                   <button className="btn-glass" style={{ padding: '16px 40px', fontSize: '24px', background: 'var(--color-pink) !important', color: 'white !important', fontWeight: 'bold' }} onClick={() => updateState({ screen: 'WINNER_SCREEN' })}>
                     🏆 К ПОБЕДИТЕЛЮ
                   </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '20px' }}>
      
      {/* Header Area */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        {role === 'HOST' && (
          <button 
            className="btn-glass"
            style={{ padding: '10px 20px', borderRadius: 'var(--radius-md)', fontSize: '13px' }} 
            onClick={() => updateState({ screen: 'START' })}>
            🏠 На главный
          </button>
        )}
      </div>

      <div className="stacked-content" style={{ alignItems: 'center' }}>
        {/* Scoreboard - Global View */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap', width: '100%' }}>
          {state.players.map(p => (
            <div key={p.id} className="btn-glass" style={{
              padding: '12px 20px', borderRadius: 'var(--radius-md)', 
              minWidth: '120px', textAlign: 'center', pointerEvents: 'none',
              borderBottom: '3px solid var(--color-teal) !important'
            }}>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '12px', textTransform: 'uppercase', marginBottom: '4px' }}>{p.name}</div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--color-pink)' }}>{p.score}</div>
            </div>
          ))}
        </div>

        <h1 style={{ fontSize: 'clamp(32px, 8vw, 64px)', color: 'var(--color-teal)', textAlign: 'center', margin: '1rem 0' }}>
          СУПЕР ИГРА
        </h1>

        {remaining.length > 1 ? (
          <FragmentList remaining={remaining} onRemove={handleRemove} role={role} />
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
             <h2 style={{ fontSize: '24px', marginBottom: '20px', color: 'var(--color-text-muted)' }}>ОСТАЛАСЬ ОДНА ТЕМА:</h2>
             <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', marginBottom: '40px', color: 'var(--color-pink)' }}>{remaining[0]?.topic}</h2>
             {role === 'HOST' && remaining.length === 1 && (
               <button className="btn-glass" style={{ padding: '24px 60px', fontSize: '24px', background: 'var(--color-pink) !important', color: 'white !important', borderRadius: 'var(--radius-lg)' }} onClick={() => setOpenedFinal(true)}>
                 ИГРАТЬ ФИНАЛ
               </button>
             )}
          </div>
        )}
      </div>
    </div>
  );
}

function FragmentList({ remaining, onRemove, role }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center', maxWidth: '1000px', width: '100%' }}>
      {remaining.map(t => (
        <div key={t.topic} className="btn-glass" style={{ padding: '24px 30px', borderRadius: 'var(--radius-lg)', minWidth: '300px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flex: '1 1 300px' }}>
          <span style={{ fontSize: '1.5rem', fontWeight: '800' }}>{t.topic}</span>
          {role === 'HOST' && (
            <button className="btn-glass" style={{ background: 'rgba(255,50,50,0.1) !important', color: '#ff8888 !important', padding: '10px 20px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,50,50,0.2) !important' }} onClick={() => onRemove(t.topic)}>
              Убрать
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
