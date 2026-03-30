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
          style={{ width: '50px', height: '50px', borderRadius: '50%', fontSize: '24px' }}
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

      <div className="stacked-content" style={{ alignItems: 'center', gap: '4rem', position: 'relative' }}>
        
        {/* Flanking Ornaments */}
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{ 
            position: 'absolute', left: '-15vw', top: '50%', transform: 'translateY(-50%)',
            width: '180px', height: '180px', opacity: 0.15, filter: 'grayscale(100%) brightness(1.2)',
            background: 'url(/emblem.jpg) center/cover', borderRadius: '50%',
            boxShadow: '0 0 40px rgba(127, 215, 205, 0.2)', pointerEvents: 'none',
            border: '2px solid rgba(127, 215, 205, 0.3)'
          }} 
        />
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          style={{ 
            position: 'absolute', right: '-15vw', top: '50%', transform: 'translateY(-50%)',
            width: '180px', height: '180px', opacity: 0.15, filter: 'grayscale(100%) brightness(1.1)',
            background: 'url(/rat.jpg) center/cover', borderRadius: '50%',
            boxShadow: '0 0 40px rgba(232, 93, 141, 0.2)', pointerEvents: 'none',
            border: '2px solid rgba(232, 93, 141, 0.3)'
          }} 
        />

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
            borderRadius: 'var(--radius-lg)', fontWeight: '800', 
            boxShadow: '0 0 50px rgba(232, 93, 141, 0.3)',
            animation: 'pulseStart 2s infinite' 
          }}
          onClick={() => updateState({ screen: 'LOBBY' })}
        >
          ПРИСТУПИТЬ
        </button>
      </div>
    </div>
  );
}
