import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StartScreen({ updateState }) {
  const [showRules, setShowRules] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      
      {/* Help Button - Floating Glass */}
      <div 
        style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 100 }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <button 
          className="btn-glass"
          onClick={() => setShowRules(true)}
          style={{ width: '50px', height: '50px', borderRadius: '50% !important', fontSize: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          ?
        </button>
        {showTooltip && (
          <div className="btn-glass" style={{ position: 'absolute', top: '60px', left: '0', padding: '12px', borderRadius: 'var(--radius-sm)', width: '250px', textAlign: 'left', fontSize: '14px', pointerEvents: 'none' }}>
            Здесь прописаны правила игры, механика и ответы на вопросы
          </div>
        )}
      </div>

      {/* Rules Modal */}
      <AnimatePresence>
        {showRules && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="btn-glass"
              style={{ padding: '40px', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto', textAlign: 'left', cursor: 'default' }}
            >
              <button 
                onClick={() => setShowRules(false)}
                style={{ position: 'absolute', top: '20px', right: '20px', fontSize: '24px', color: 'var(--color-text-muted)' }}
              >
                ✕
              </button>
              <h2 style={{ color: 'var(--color-pink)', marginBottom: '20px', fontSize: '24px' }}>ПРАВИЛА И МЕХАНИКА</h2>
              <div style={{ color: 'var(--color-text-main)', lineHeight: '1.6', fontSize: '16px' }}>
                <p><strong>Суть игры:</strong> Это аналог «Своей Игры» для участников Клуба Дукатов.</p>
                <div style={{ margin: '15px 0', borderLeft: '3px solid var(--color-teal)', paddingLeft: '15px' }}>
                  <p><strong>Механика:</strong></p>
                  <ul style={{ paddingLeft: '20px' }}>
                    <li>Один игрок — <strong>Ведущий</strong>. Остальные вводят имена в лобби.</li>
                    <li>Ведущий зачитывает вопросы и начисляет баллы.</li>
                    <li>Все экраны синхронизируются автоматически!</li>
                    <li>«Секретные» МОДИФИКАТОРЫ меняют ход игры.</li>
                  </ul>
                </div>
              </div>
              <button 
                className="btn-glass"
                onClick={() => setShowRules(false)}
                style={{ marginTop: '30px', width: '100%', padding: '16px', background: 'var(--color-pink) !important', color: 'white !important', borderRadius: 'var(--radius-md)' }}
              >
                ПОНЯТНО
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Checkerboard Background Layer */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 0, overflow: 'hidden', display: 'flex', flexWrap: 'wrap', gap: '80px', padding: '40px', justifyContent: 'center' }}>
        {Array.from({ length: 24 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 0.04,
              y: [0, i % 2 === 0 ? 15 : -15, 0],
              rotate: [0, i % 3 === 0 ? 5 : -5, 0]
            }}
            transition={{ 
              duration: 6 + (i % 4), 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: i * 0.1 
            }}
            style={{
              width: '120px', height: '120px',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundImage: i % 2 === 0 ? 'url(/emblem.jpg)' : 'url(/rat.jpg)',
              filter: 'grayscale(100%) brightness(1.2)'
            }}
          />
        ))}
      </div>

      <div className="stacked-content" style={{ alignItems: 'center', gap: '4rem', position: 'relative', zIndex: 1 }}>

        <div style={{ position: 'relative' }}>
          <motion.div 
            initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}
            style={{ fontSize: 'clamp(24px, 5vw, 42px)', color: 'var(--color-pink-dark)', fontWeight: '900', letterSpacing: '12px', marginBottom: '0.5rem' }}
          >
            KD CLUB
          </motion.div>
          <motion.h1 
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3, duration: 1 }}
            style={{ fontSize: 'clamp(40px, 10vw, 84px)', color: 'white', lineHeight: '1', margin: '0' }}
          >
            ДУКАТСКИЙ<br/>
            <span style={{ color: 'var(--color-teal)' }}>КВИЗ</span>
          </motion.h1>
        </div>

        <button 
          className="btn-glass"
          style={{ 
            padding: '24px 64px', fontSize: 'clamp(20px, 4vw, 32px)', 
            background: 'var(--color-pink) !important', color: '#fff !important', 
            borderRadius: 'var(--radius-lg) !important', fontWeight: '900', 
            boxShadow: '0 0 50px rgba(232, 93, 141, 0.3)',
            animation: 'pulseStart 2s infinite',
            border: 'none !important'
          }}
          onClick={() => updateState({ screen: 'LOBBY' })}
        >
          ПРИСТУПИТЬ
        </button>
      </div>
    </div>
  );
}
