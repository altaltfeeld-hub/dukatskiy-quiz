import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StartScreen({ updateState }) {
  const [showRules, setShowRules] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: '100vh', overflow: 'hidden' }}>
      
      {/* Help Button - Floating Glass */}
      <div 
        style={{ position: 'absolute', top: '30px', left: '30px', zIndex: 100 }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <button 
          className="btn-glass"
          onClick={() => setShowRules(true)}
          style={{ width: '56px', height: '56px', borderRadius: '50% !important', fontSize: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', border: '2px solid rgba(255,255,255,0.1) !important' }}
        >
          ?
        </button>
        {showTooltip && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="btn-glass" style={{ position: 'absolute', top: '70px', left: '0', padding: '15px 20px', borderRadius: 'var(--radius-md) !important', width: '280px', textAlign: 'left', fontSize: '14px', pointerEvents: 'none', background: 'rgba(0,0,0,0.6) !important' }}>
            Правила игры, механика начисления баллов и описание модификаторов
          </motion.div>
        )}
      </div>

      {/* Rules Modal */}
      <AnimatePresence>
        {showRules && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.92)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(20px)' }}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
              className="btn-glass"
              style={{ padding: '50px', maxWidth: '700px', width: '100%', maxHeight: '90vh', overflowY: 'auto', textAlign: 'left', cursor: 'default', borderRadius: 'var(--radius-lg) !important', border: '1px solid rgba(255,255,255,0.1) !important' }}
            >
              <button 
                onClick={() => setShowRules(false)}
                style={{ position: 'absolute', top: '30px', right: '30px', fontSize: '32px', color: 'rgba(255,255,255,0.3)', fontWeight: '300' }}
              >
                ✕
              </button>
              <h2 style={{ color: 'var(--color-pink)', marginBottom: '30px', fontSize: '32px', fontWeight: '900', letterSpacing: '2px' }}>ПРАВИЛА И МЕХАНИКА</h2>
              <div style={{ color: 'var(--color-text-main)', lineHeight: '1.8', fontSize: '18px' }}>
                <p style={{ marginBottom: '20px' }}><strong>Краткая суть:</strong> Это интерактивный квиз для участников Клуба Дукатов. Соревнование на знание контекста, мемов и брендов.</p>
                <div style={{ margin: '25px 0', borderLeft: '4px solid var(--color-teal)', paddingLeft: '25px', background: 'rgba(127, 215, 205, 0.05)', padding: '20px' }}>
                  <p style={{ fontWeight: '900', color: 'var(--color-teal)', marginBottom: '10px' }}>КАК ЭТО РАБОТАЕТ:</p>
                  <ul style={{ paddingLeft: '20px', listStyleType: 'square' }}>
                    <li><strong>Ведущий:</strong> Ожидает в лобби, зачитывает вопросы и управляет баллами.</li>
                    <li><strong>Игроки:</strong> Присоединяются по ссылке и выбирают свою карточку.</li>
                    <li><strong>Синхронизация:</strong> Все действия Ведущего мгновенно отображаются у всех.</li>
                    <li><strong>Модификаторы:</strong> Специальные задания, где ставку определяет только Ведущий.</li>
                  </ul>
                </div>
              </div>
              <button 
                className="btn-glass"
                onClick={() => setShowRules(false)}
                style={{ marginTop: '40px', width: '100%', padding: '24px', background: 'var(--color-pink) !important', color: 'white !important', borderRadius: 'var(--radius-md) !important', fontSize: '20px', fontWeight: '900' }}
              >
                ВСЕ ЯСНО, ПОЕХАЛИ!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
 
      {/* Premium Dynamic Background */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 0, overflow: 'hidden', display: 'flex', flexWrap: 'wrap', gap: '100px', padding: '60px', justifyContent: 'center' }}>
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 0.05,
              scale: [1, 1.1, 1],
              rotate: [0, i % 2 === 0 ? 10 : -10, 0]
            }}
            transition={{ 
              duration: 8 + (i % 5), 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: i * 0.2 
            }}
            style={{
              width: '140px', height: '140px',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundImage: i % 2 === 0 ? 'url(/emblem.jpg)' : 'url(/rat.jpg)',
              filter: 'grayscale(100%) brightness(1.5)',
              mixBlendMode: 'overlay'
            }}
          />
        ))}
      </div>

      <div className="stacked-content" style={{ alignItems: 'center', gap: '5rem', position: 'relative', zIndex: 1 }}>

        <div style={{ position: 'relative' }}>
          <motion.div 
            initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1 }}
            style={{ fontSize: 'clamp(28px, 6vw, 48px)', color: 'var(--color-pink-dark)', fontWeight: '900', letterSpacing: '16px', marginBottom: '0.8rem', opacity: 0.8 }}
          >
            KD CLUB
          </motion.div>
          <motion.h1 
            initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.4, duration: 1.2 }}
            style={{ fontSize: 'clamp(50px, 12vw, 100px)', color: 'white', lineHeight: '0.95', margin: '0', fontWeight: '900', textShadow: '0 0 80px rgba(255,255,255,0.1)' }}
          >
            ДУКАТСКИЙ<br/>
            <span style={{ color: 'var(--color-teal)', textShadow: '0 0 50px rgba(127, 215, 205, 0.4)' }}>КВИЗ</span>
          </motion.h1>
        </div>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-glass"
          style={{ 
            padding: '28px 80px', fontSize: 'clamp(24px, 5vw, 36px)', 
            background: 'var(--color-pink) !important', color: '#fff !important', 
            borderRadius: 'var(--radius-lg) !important', fontWeight: '900', 
            boxShadow: '0 20px 60px rgba(232, 93, 141, 0.4)',
            animation: 'pulseStart 2s infinite',
            border: 'none !important',
            letterSpacing: '2px'
          }}
          onClick={() => updateState({ screen: 'LOBBY' })}
        >
          ПРИСТУПИТЬ
        </motion.button>
      </div>
    </div>
  );
}
