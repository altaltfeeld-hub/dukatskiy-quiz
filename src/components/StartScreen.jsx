import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StartScreen({ updateState }) {
  const [showRules, setShowRules] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', background: 'var(--color-bg-deep)', position: 'relative', overflow: 'hidden' }}>
      
      {/* Help Button - Floating Glass */}
      <div 
        style={{ position: 'absolute', top: '30px', left: '30px', zIndex: 100 }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <button 
          className="btn-glass"
          onClick={() => setShowRules(true)}
          style={{ width: '50px', height: '50px', borderRadius: '50% !important', fontSize: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', border: '1px solid rgba(255,255,255,0.1) !important' }}
        >
          ?
        </button>
        {showTooltip && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="btn-glass" style={{ position: 'absolute', top: '60px', left: '0', padding: '15px 20px', borderRadius: 'var(--radius-md) !important', width: '250px', textAlign: 'left', fontSize: '13px', pointerEvents: 'none', background: 'rgba(0,0,0,0.8) !important' }}>
            Правила игры, квиз-механика и описание модификаторов
          </motion.div>
        )}
      </div>

      {/* Rules Modal */}
      <AnimatePresence>
        {showRules && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.9)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(20px)' }}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
              className="btn-glass"
              style={{ padding: '40px', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto', textAlign: 'left', cursor: 'default', borderRadius: 'var(--radius-lg) !important', border: '1px solid rgba(255,255,255,0.1) !important', position: 'relative' }}
            >
              <button 
                onClick={() => setShowRules(false)}
                style={{ position: 'absolute', top: '20px', right: '20px', fontSize: '24px', color: 'rgba(255,255,255,0.3)', border: 'none', background: 'none', cursor: 'pointer' }}
              >
                ✕
              </button>
              <h2 style={{ color: 'var(--color-pink)', marginBottom: '25px', fontSize: '28px', fontWeight: '900', letterSpacing: '2px' }}>ПРАВИЛА И МЕХАНИКА</h2>
              <div style={{ color: 'var(--color-text-main)', lineHeight: '1.6', fontSize: '16px' }}>
                <p style={{ marginBottom: '15px' }}><strong>Краткая суть:</strong> Интерактивный квиз для участников Клуба Дукатов. Состязание в знании контекста, мемов и брендов.</p>
                <div style={{ margin: '20px 0', borderLeft: '3px solid var(--color-teal)', paddingLeft: '20px', background: 'rgba(255, 255, 255, 0.02)', padding: '15px' }}>
                  <p style={{ fontWeight: '900', color: 'var(--color-teal)', marginBottom: '8px' }}>КАК ИГРАТЬ:</p>
                  <ul style={{ paddingLeft: '20px', listStyleType: 'square' }}>
                    <li><strong>Ведущий:</strong> Ожидает в лобби, зачитывает вопросы и начисляет баллы.</li>
                    <li><strong>Игроки:</strong> Присоединяются по ссылке и выбирают свою карточку участника.</li>
                    <li><strong>Модификаторы:</strong> Специальные события, где ставку определяет только Ведущий в реальном времени.</li>
                  </ul>
                </div>
              </div>
              <button 
                className="btn-glass"
                onClick={() => setShowRules(false)}
                style={{ marginTop: '30px', width: '100%', padding: '15px', background: 'var(--color-teal) !important', color: 'var(--color-bg-deep) !important', borderRadius: 'var(--radius-md) !important', fontSize: '18px', fontWeight: '900' }}
              >
                ПРИНЯТО
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
  
      {/* Restored Background Icons Layer (Drifting) */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 0, opacity: 0.05 }}>
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div 
            key={i} 
            initial={{ x: Math.random() * 100 + '%', y: Math.random() * 100 + '%' }}
            animate={{ 
              x: [Math.random() * 100 + '%', Math.random() * 100 + '%'], 
              y: [Math.random() * 100 + '%', Math.random() * 100 + '%'],
              opacity: [0.1, 0.4, 0.1],
              scale: [1, 1.1, 1]
            }} 
            transition={{ duration: 20 + i * 2, repeat: Infinity, ease: "linear" }}
            style={{ position: 'absolute', width: '120px', height: '120px', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundImage: i % 2 === 0 ? 'url(/emblem.jpg)' : 'url(/rat.jpg)', filter: 'grayscale(100%) brightness(1.2)' }} 
          />
        ))}
      </div>

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4rem' }}>
        <div style={{ textAlign: 'center' }}>
          <motion.div 
            initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1 }}
            style={{ fontSize: 'clamp(20px, 4vw, 32px)', color: 'var(--color-pink-dark)', fontWeight: '900', letterSpacing: '12px', marginBottom: '0.5rem', opacity: 0.7 }}
          >
            KD CLUB
          </motion.div>
          <motion.h1 
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3, duration: 1 }}
            style={{ fontSize: 'clamp(42px, 10vw, 92px)', color: 'white', lineHeight: '0.9', margin: '0', fontWeight: '900', textShadow: '0 0 50px rgba(255,255,255,0.1)' }}
          >
            ДУКАТСКИЙ<br/>
            <span style={{ color: 'var(--color-teal)', textShadow: '0 0 40px rgba(127, 215, 205, 0.3)' }}>КВИЗ</span>
          </motion.h1>
        </div>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-glass"
          style={{ 
            padding: '24px 70px', fontSize: 'clamp(20px, 4vw, 32px)', 
            background: 'var(--color-pink) !important', color: '#fff !important', 
            borderRadius: 'var(--radius-lg) !important', fontWeight: '900', 
            boxShadow: '0 0 50px rgba(232, 93, 141, 0.25)',
            border: 'none !important',
            letterSpacing: '2px'
          }}
          onClick={() => updateState({ screen: 'LOBBY' })}
        >
          НАЧАТЬ
        </motion.button>
      </div>
    </div>
  );
}
