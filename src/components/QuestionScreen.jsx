import React, { useState, useEffect } from 'react';

export default function QuestionScreen({ state, updateState, role }) {
  const q = state.currentQuestion;
  const isModifier = q.modifier;
  
  const [timeLeft, setTimeLeft] = useState(60);
  const [showAnswer, setShowAnswer] = useState(false);
  const [modifierMode, setModifierMode] = useState(false);
  const [modifierPoints, setModifierPoints] = useState(q.cost || 0);
  const [passTo, setPassTo] = useState(null);

  // Simple countdown timer
  useEffect(() => {
    if (timeLeft <= 0 || isModifier) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isModifier]);

  const addScore = (playerId, correct, pointsToChange = q.cost) => {
    const updatedPlayers = state.players.map(p => {
      if (p.id === playerId) {
        return { ...p, score: p.score + (correct ? pointsToChange : -pointsToChange) };
      }
      return p;
    });
    updateState({ players: updatedPlayers, screen: 'TABLE', currentQuestion: null });
  };

  const handlePassScore = (playerId) => {
    addScore(playerId, true, Number(modifierPoints));
  };

  // If Modifier initially
  if (isModifier && !modifierMode) {
    return (
      <div className="container animate-fade" style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h1 style={{ fontSize: '80px', color: 'var(--color-pink)', textShadow: 'var(--shadow-glow-pink)', marginBottom: '40px' }}>МОДИФИКАТОР</h1>
        <p style={{ fontSize: '32px', textAlign: 'center', maxWidth: '800px', background: 'rgba(255,255,255,0.05)', padding: '40px', borderRadius: 'var(--radius-lg)' }}>
          {q.text}
        </p>

        {role === 'HOST' && (
          <button style={{ marginTop: '40px', padding: '16px 40px', fontSize: '20px', background: 'var(--color-teal)', color: 'var(--color-bg-deep)', borderRadius: 'var(--radius-lg)' }} onClick={() => setModifierMode(true)}>
            Открыть панель модификатора
          </button>
        )}
      </div>
    );
  }

  // Render Moderator Panel for Modifier
  if (isModifier && modifierMode) {
    if (role === 'PLAYER') {
       return <div className="container"><h2 style={{marginTop:'50vh', textAlign:'center', color: 'var(--color-teal)'}}>Ведущий принимает решение...</h2></div>
    }

    return (
      <div className="container animate-fade" style={{ paddingTop: '50px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '36px', color: 'var(--color-teal)', marginBottom: '40px' }}>Панель модификатора</h2>
        
         <div style={{ background: 'var(--color-bg-card)', padding: '40px', borderRadius: 'var(--radius-lg)', maxWidth: '600px', margin: '0 auto', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h3 style={{ marginBottom: '25px', fontSize: '20px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-teal)' }}>Назначить баллы:</h3>
            <input 
              type="number" 
              value={modifierPoints} 
              onChange={e => setModifierPoints(e.target.value)} 
              style={{ 
                padding: '20px', fontSize: '28px', width: '100%', marginBottom: '30px', 
                background: 'rgba(0,0,0,0.4)', color: 'white', border: '2px solid var(--color-teal)', 
                borderRadius: 'var(--radius-md)', textAlign: 'center', outline: 'none',
                boxSizing: 'border-box', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)'
              }} 
            />
           
           <h3 style={{ marginBottom: '20px', marginTop: '20px' }}>Игроки (начислить или списать введенные баллы):</h3>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
             {state.players.map(p => (
               <div key={p.id} style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '10px 20px', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-sm)' }}>
                 <span style={{ fontSize: '22px' }}>{p.name} <span style={{ color: 'var(--color-text-muted)', fontSize: '16px' }}>({p.score})</span></span>
                 <div style={{ display: 'flex', gap: '10px' }}>
                   <button onClick={() => addScore(p.id, false, Number(modifierPoints))} style={{ padding: '12px 20px', background: 'var(--color-pink)', color: 'white', borderRadius: 'var(--radius-sm)', fontWeight: 'bold' }}>
                     — Списать
                   </button>
                   <button onClick={() => addScore(p.id, true, Number(modifierPoints))} style={{ padding: '12px 20px', background: 'var(--color-teal)', color: 'var(--color-bg-deep)', borderRadius: 'var(--radius-sm)', fontWeight: 'bold' }}>
                     + Начислить
                   </button>
                 </div>
               </div>
             ))}
           </div>
           
           <button style={{ marginTop: '40px', padding: '12px 20px', border: '1px solid rgba(255,255,255,0.2)' }} onClick={() => updateState({ screen: 'TABLE', currentQuestion: null })}>
             Закрыть (без изменений баллов)
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ height: '100vh', display: 'flex', flexDirection: 'column', padding: 0 }}>
      
      {/* Scrollable Question Content */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div className="stacked-content" style={{ alignItems: 'center', maxWidth: '1000px' }}>
          {/* Topic-specific Logic */}
          {(() => {
            const topic = state.currentRound?.topic || "";
            const isSpecialCropTopic = topic === "Угадай мем" || topic === "Куда течет река";
            const isNoBlurTopic = topic === "Что по встрече?" || isSpecialCropTopic;
            const imageFile = q.image || q.answerImage;

            if (showAnswer) {
              // Priority: answerImage, then full version if special topic, then regular image
              const finalImage = q.answerImage || (isSpecialCropTopic ? `quiz/full/${imageFile}` : imageFile);
              return finalImage ? (
                <img 
                  src={`/${finalImage}`} 
                  alt="Answer" 
                  style={{ width: '100%', maxHeight: '60vh', objectFit: 'contain', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-card)' }} 
                />
              ) : (
                <h1 style={{ fontSize: 'clamp(24px, 6vw, 48px)', textAlign: 'center', lineHeight: '1.2', margin: 0 }}>{q.text}</h1>
              );
            } else {
              // Question Phase
              const qImage = isSpecialCropTopic ? `quiz/cropped/${imageFile}` : imageFile;
              return (
                <>
                  {qImage && (
                    <div style={{ position: 'relative', width: '100%', maxHeight: '45vh', overflow: 'hidden', borderRadius: 'var(--radius-md)', marginBottom: '20px' }}>
                      <img 
                        src={`/${qImage}`} 
                        alt="Question" 
                        style={{ 
                          width: '100%', height: '100%', objectFit: 'contain', 
                        filter: isNoBlurTopic ? 'none' : 'blur(12px) brightness(0.7)',
                        transition: 'filter 0.5s ease'
                      }} 
                    />
                  </div>
                  )}
                  <h1 style={{ fontSize: 'clamp(24px, 6vw, 48px)', textAlign: 'center', lineHeight: '1.2', margin: 0 }}>{q.text}</h1>
                </>
              );
            }
          })()}
          {showAnswer && q.answer && (
            <div className="btn-glass" style={{ width: 'auto', marginTop: '20px', padding: '24px 40px', borderRadius: 'var(--radius-md)', fontSize: 'clamp(20px, 4vw, 32px)', color: 'var(--color-teal)', border: '1px solid var(--color-teal) !important' }}>
                ОТВЕТ: <span style={{ color: 'white' }}>{q.answer}</span>
            </div>
          )}
        </div>
      </div>

      {/* Shared Timer UI - Slimmer & Non-intrusive */}
      {!showAnswer && (
        <div style={{ width: '100%', background: 'rgba(255,255,255,0.05)', height: '6px', overflow: 'hidden' }}>
          <div style={{ width: `${(timeLeft / 60) * 100}%`, height: '100%', background: 'var(--color-teal)', transition: 'width 1s linear' }} />
        </div>
      )}

      {/* Host Controls - Pinned to bottom, Glassmorphism */}
      {role === 'HOST' && (
        <div 
          className="btn-glass" 
          style={{ 
            padding: '20px', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0', 
            display: 'flex', flexWrap: 'nowrap', gap: '15px', alignItems: 'center', 
            overflowX: 'auto', width: '100%', border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)',
            minHeight: '100px', boxSizing: 'border-box'
          }}
        >
          <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
            <button className="btn-glass" style={{ padding: '12px 20px', borderRadius: 'var(--radius-md)', whiteSpace: 'nowrap', fontSize: '14px' }} onClick={() => setShowAnswer(true)}>Показать ответ</button>
            <button className="btn-glass" style={{ padding: '12px 20px', borderRadius: 'var(--radius-md)', whiteSpace: 'nowrap', fontSize: '14px' }} onClick={() => updateState({ screen: 'TABLE', currentQuestion: null })}>В таблицу</button>
          </div>
          
          <div style={{ width: '1px', height: '30px', background: 'rgba(255,255,255,0.1)', flexShrink: 0 }} />
          
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '5px' }}>
            {showAnswer && state.players.map(p => (
              <button key={`plus-${p.id}`} onClick={() => addScore(p.id, true)} style={{ padding: '10px 16px', background: 'rgba(127, 215, 205, 0.1)', border: '1px solid var(--color-teal)', color: 'var(--color-teal)', borderRadius: 'var(--radius-md)', whiteSpace: 'nowrap', fontSize: '13px' }}>
                + {p.name}
              </button>
            ))}
            {!showAnswer && state.players.map(p => (
              <button key={`minus-${p.id}`} onClick={() => addScore(p.id, false)} style={{ padding: '10px 16px', background: 'rgba(232, 93, 141, 0.1)', border: '1px solid var(--color-pink)', color: 'var(--color-pink)', borderRadius: 'var(--radius-md)', whiteSpace: 'nowrap', fontSize: '13px' }}>
                - {p.name}
              </button>
            ))}
          </div>

          <button className="btn-glass" style={{ marginLeft: 'auto', padding: '12px 20px', background: 'rgba(255,80,80,0.1) !important', color: '#ff8888 !important', borderRadius: 'var(--radius-md)', fontWeight: 'bold', border: '1px solid rgba(255,80,80,0.2) !important', flexShrink: 0 }} onClick={() => updateState({ screen: 'START', currentQuestion: null })}>Прервать</button>
        </div>
      )}
    </div>
  );
}
