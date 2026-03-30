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
    // Update points WITHOUT closing the screen immediately
    updateState({ players: updatedPlayers });
  };

  const handleSkipQuestion = () => {
    // Penalty for everyone
    const updatedPlayers = state.players.map(p => ({
      ...p, score: p.score - q.cost
    }));
    updateState({ players: updatedPlayers, screen: 'TABLE', currentQuestion: null });
  };

  const closeQuestion = () => {
    updateState({ screen: 'TABLE', currentQuestion: null });
  };

  // Helper for Topic logic
  const topicLower = (q.topic || "").toLowerCase().trim();
  const isNoBlurTopic = topicLower.includes("что по встрече");
  const isBlurAlwaysTopic = topicLower.includes("угадай мем") || topicLower.includes("куда течет река");

  // Side Dashboard (Scoreboard) for Host and Player visibility
  const SideScoreboard = () => (
    <div style={{ 
      position: 'fixed', right: '20px', top: '50%', transform: 'translateY(-50%)', 
      width: '180px', background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(10px)',
      padding: '15px', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.1)',
      display: 'flex', flexDirection: 'column', gap: '10px', zIndex: 1000,
      boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
    }}>
      <h3 style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--color-teal)', letterSpacing: '1px', marginBottom: '5px' }}>Счёт игры</h3>
      {state.players.map(p => (
        <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{p.name}</span>
          <span style={{ fontSize: '16px', color: 'var(--color-pink)', fontWeight: '800' }}>{p.score}</span>
        </div>
      ))}
    </div>
  );

  // If Modifier initially
  if (isModifier && !modifierMode) {
    return (
      <div className="container animate-fade" style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <SideScoreboard />
        <h1 style={{ fontSize: 'clamp(40px, 8vw, 80px)', color: 'var(--color-pink)', textShadow: 'var(--shadow-glow-pink)', marginBottom: '40px' }}>МОДИФИКАТОР</h1>
        <p style={{ fontSize: 'clamp(20px, 4vw, 32px)', textAlign: 'center', maxWidth: '800px', background: 'rgba(255,255,255,0.05)', padding: '40px', borderRadius: 'var(--radius-lg)' }}>
          {q.text || "Специальное задание для игрока!"}
        </p>

        {role === 'HOST' && (
          <button className="btn-glass" style={{ marginTop: '40px', padding: '20px 60px', fontSize: '24px', background: 'var(--color-teal) !important', color: 'var(--color-bg-deep) !important' }} onClick={() => setModifierMode(true)}>
            Открыть панель модификатора
          </button>
        )}
      </div>
    );
  }

  // Render Moderator Panel for Modifier
  if (isModifier && modifierMode) {
    if (role === 'PLAYER') {
       return <div className="container"><SideScoreboard /><h2 style={{marginTop:'45vh', textAlign:'center', color: 'var(--color-teal)', fontSize: '32px'}}>Ведущий принимает решение...</h2></div>
    }

    return (
      <div className="container animate-fade" style={{ paddingTop: '50px', textAlign: 'center' }}>
        <SideScoreboard />
        <h2 style={{ fontSize: '36px', color: 'var(--color-teal)', marginBottom: '40px' }}>Панель модификатора</h2>
        
         <div style={{ background: 'var(--color-bg-card)', padding: '40px', borderRadius: 'var(--radius-lg)', maxWidth: '700px', margin: '0 auto', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
            <h3 style={{ marginBottom: '15px', fontSize: '18px', color: 'var(--color-teal)' }}>НАЗНАЧИТЬ БАЛЛЫ:</h3>
            <input 
              type="number" 
              value={modifierPoints} 
              onChange={e => setModifierPoints(e.target.value)} 
              style={{ 
                padding: '15px', fontSize: '32px', width: '200px', marginBottom: '30px', 
                background: 'rgba(0,0,0,0.4)', color: 'white', border: '2px solid var(--color-teal)', 
                borderRadius: 'var(--radius-md)', textAlign: 'center', outline: 'none'
              }} 
            />
           
           <h3 style={{ marginBottom: '20px', color: 'var(--color-text-muted)', fontSize: '14px', textTransform: 'uppercase' }}>Управление игроками:</h3>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', marginBottom: '40px' }}>
             {state.players.map(p => (
               <div key={p.id} style={{ display: 'flex', gap: '15px', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '10px 20px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.05)' }}>
                 <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{p.name}</div>
                    <div style={{ fontSize: '14px', color: 'var(--color-pink)' }}>{p.score} баллов</div>
                 </div>
                 <div style={{ display: 'flex', gap: '10px' }}>
                   <button onClick={() => addScore(p.id, false, Number(modifierPoints))} className="btn-glass" style={{ padding: '8px 16px', background: 'rgba(232, 93, 141, 0.1) !important', color: 'var(--color-pink) !important', border: '1px solid var(--color-pink) !important' }}>
                     - Списать
                   </button>
                   <button onClick={() => addScore(p.id, true, Number(modifierPoints))} className="btn-glass" style={{ padding: '8px 16px', background: 'rgba(127, 215, 205, 0.1) !important', color: 'var(--color-teal) !important', border: '1px solid var(--color-teal) !important' }}>
                     + Начислить
                   </button>
                 </div>
               </div>
             ))}
           </div>
           
           <button className="btn-glass" style={{ width: '100%', padding: '20px', background: 'var(--color-pink) !important', color: 'white !important', fontSize: '20px', fontWeight: '900' }} onClick={closeQuestion}>
             ВЫЙТИ В РАУНД
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ height: '100vh', display: 'flex', flexDirection: 'column', padding: 0 }}>
      <SideScoreboard />
      
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div className="stacked-content" style={{ alignItems: 'center', maxWidth: '1000px' }}>
          {(() => {
            const imageFile = q.image || q.answerImage;
            if (!imageFile) return <h1 style={{ fontSize: 'clamp(24px, 6vw, 48px)', textAlign: 'center', lineHeight: '1.2', margin: 0 }}>{q.text}</h1>;

            const needsBlur = isBlurAlwaysTopic && !showAnswer;
            
            return (
              <div style={{ position: 'relative', width: '100%', maxHeight: showAnswer ? '60vh' : '45vh', overflow: 'hidden', borderRadius: 'var(--radius-md)', marginBottom: '20px', boxShadow: 'var(--shadow-card)' }}>
                 <img 
                    src={`/${imageFile}`} 
                    alt="Question Content" 
                    style={{ 
                      width: '100%', height: '100%', objectFit: 'contain', 
                      filter: needsBlur ? 'blur(20px) brightness(0.6)' : (isNoBlurTopic || showAnswer ? 'none' : 'blur(15px) brightness(0.7)'),
                      transition: 'filter 0.5s ease'
                    }} 
                  />
              </div>
            );
          })()}

          {(q.image || q.answerImage) && !showAnswer && (
             <h2 style={{ fontSize: '24px', opacity: 0.8, marginTop: '10px' }}>{q.text}</h2>
          )}

          {showAnswer && q.answer && (
            <div className="btn-glass" style={{ width: 'auto', marginTop: '20px', padding: '24px 40px', borderRadius: 'var(--radius-md)', fontSize: 'clamp(20px, 4vw, 32px)', color: 'var(--color-teal)', border: '1px solid var(--color-teal) !important', boxShadow: 'var(--shadow-glow-teal)' }}>
                ОТВЕТ: <span style={{ color: 'white' }}>{q.answer}</span>
            </div>
          )}
        </div>
      </div>

      {!showAnswer && (
        <div style={{ width: '100%', background: 'rgba(255,255,255,0.05)', height: '6px', overflow: 'hidden' }}>
          <div style={{ width: `${(timeLeft / 60) * 100}%`, height: '100%', background: 'var(--color-teal)', transition: 'width 1s linear' }} />
        </div>
      )}

      {role === 'HOST' && (
        <div 
          className="btn-glass" 
          style={{ 
            padding: '20px', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0', 
            display: 'flex', flexWrap: 'nowrap', gap: '15px', alignItems: 'center', 
            overflowX: 'auto', width: '100%', border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)',
            minHeight: '120px', boxSizing: 'border-box'
          }}
        >
          <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
            {!showAnswer && (
              <button className="btn-glass" style={{ padding: '12px 24px', borderRadius: 'var(--radius-md)', whiteSpace: 'nowrap', fontSize: '15px', background: 'var(--color-teal) !important', color: 'var(--color-bg-deep) !important', fontWeight: 'bold' }} onClick={() => setShowAnswer(true)}>Показать ответ</button>
            )}
            
            <button className="btn-glass" style={{ padding: '12px 24px', borderRadius: 'var(--radius-md)', whiteSpace: 'nowrap', fontSize: '15px', background: 'var(--color-pink) !important', color: 'white !important', fontWeight: 'bold' }} onClick={closeQuestion}>ВЫЙТИ В РАУНД</button>

            {(isR1Done || isR2Done) && (
               <button className="btn-glass" style={{ padding: '12px 24px', borderRadius: 'var(--radius-md)', whiteSpace: 'nowrap', fontSize: '15px', background: 'linear-gradient(135deg, var(--color-teal), var(--color-pink)) !important', color: 'white !important', fontWeight: '900' }} onClick={() => updateState({ screen: 'TABLE', currentRound: isR1Done ? 'R2' : 'SUPER', currentQuestion: null })}>СЛЕДУЮЩИЙ РАУНД ⏩</button>
            )}

            {!showAnswer && (
              <button className="btn-glass" style={{ padding: '12px 24px', borderRadius: 'var(--radius-md)', whiteSpace: 'nowrap', fontSize: '15px', border: '1px solid #ffaa00 !important', color: '#ffaa00 !important' }} onClick={handleSkipQuestion}>ПРОПУСТИТЬ ВОПРОС</button>
            )}
          </div>
          
          <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.1)', flexShrink: 0 }} />
          
          <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', padding: '5px' }}>
            {state.players.map(p => (
              <div key={p.id} style={{ display: 'flex', gap: '5px', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '8px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <button onClick={() => addScore(p.id, false)} className="btn-glass" style={{ padding: '8px 12px', background: 'rgba(232, 93, 141, 0.1) !important', color: 'var(--color-pink) !important', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-pink) !important', fontSize: '16px' }}>
                  -
                </button>
                <div style={{ padding: '0 10px', fontSize: '14px', minWidth: '60px', textAlign: 'center', fontWeight: 'bold' }}>{p.name}</div>
                <button onClick={() => addScore(p.id, true)} className="btn-glass" style={{ padding: '8px 12px', background: 'rgba(127, 215, 205, 0.1) !important', color: 'var(--color-teal) !important', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-teal) !important', fontSize: '16px' }}>
                  +
                </button>
              </div>
            ))}
          </div>

          <button className="btn-glass" style={{ marginLeft: 'auto', padding: '10px 20px', border: '1px solid rgba(255,255,255,0.2) !important', color: 'rgba(255,255,255,0.5) !important', fontSize: '12px', flexShrink: 0 }} onClick={() => updateState({ screen: 'START', currentQuestion: null })}>Прервать игру</button>
        </div>
      )}
    </div>
  );
}
