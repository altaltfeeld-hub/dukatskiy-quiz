import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';

export default function StartScreen({ updateState }) {
  const [showRules, setShowRules] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', position: 'relative', overflow: 'hidden', background: 'radial-gradient(ellipse at 60% 40%, #1a0a24 0%, #0d0d1a 50%, #060610 100%)' }}
    >
      
      {/* Help Button */}
      <div 
        style={{ position: 'absolute', top: '30px', left: '30px', zIndex: 100 }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <button 
          className="btn-glass"
          onClick={() => setShowRules(true)}
          style={{ width: '50px', height: '50px', borderRadius: '50% !important', fontSize: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900' }}
        >
          ?
        </button>
        {showTooltip && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="btn-glass" style={{ position: 'absolute', top: '60px', left: '0', padding: '12px 16px', borderRadius: 'var(--radius-md) !important', width: '220px', textAlign: 'left', fontSize: '13px', pointerEvents: 'none', background: 'rgba(0,0,0,0.85) !important', color: 'white' }}>
            Правила, механика и описание модификаторов
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
              <h2 style={{ color: 'var(--color-pink)', marginBottom: '25px', fontSize: '26px', fontWeight: '900', letterSpacing: '2px' }}>ПРАВИЛА И МЕХАНИКА</h2>
              <div style={{ color: 'white', lineHeight: '1.7', fontSize: '15px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
                  Дукатский Квиз — это командное интеллектуальное соревнование для участников KD Club. Два раунда вопросов, финальная Супер-Игра и один победитель.
                </p>

                <div style={{ borderLeft: '3px solid var(--color-teal)', paddingLeft: '18px' }}>
                  <p style={{ fontWeight: '900', color: 'var(--color-teal)', marginBottom: '10px', letterSpacing: '1px' }}>📋 СТРУКТУРА ИГРЫ</p>
                  <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px', color: 'rgba(255,255,255,0.85)' }}>
                    <li><strong style={{ color: 'white' }}>Раунд 1</strong> — 15 вопросов по 3 темам (5 вопросов на тему). Стоимость: 100–500 дукатов.</li>
                    <li><strong style={{ color: 'white' }}>Раунд 2</strong> — 25 вопросов по 5 темам (5 вопросов на тему). Стоимость: 100–500 дукатов.</li>
                    <li><strong style={{ color: 'white' }}>Супер-Игра</strong> — Финал. Выбирается одна тема из нескольких. Ставка — до 3000 дукатов.</li>
                  </ul>
                </div>

                <div style={{ borderLeft: '3px solid var(--color-pink)', paddingLeft: '18px' }}>
                  <p style={{ fontWeight: '900', color: 'var(--color-pink)', marginBottom: '10px', letterSpacing: '1px' }}>💎 НАЧИСЛЕНИЕ БАЛЛОВ</p>
                  <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px', color: 'rgba(255,255,255,0.85)' }}>
                    <li>Правильный ответ → <strong style={{ color: 'var(--color-teal)' }}>+N дукатов</strong> (указано на клетке).</li>
                    <li>Неправильный ответ → <strong style={{ color: 'var(--color-pink)' }}>−N дукатов</strong> (штраф).</li>
                    <li>Ведущий нажимает <strong style={{ color: 'white' }}>«+»</strong> или <strong style={{ color: 'white' }}>«−»</strong> напротив нужного игрока.</li>
                    <li>Можно начислить несколько игрокам сразу — кто ответил первым / дополнил.</li>
                  </ul>
                </div>

                <div style={{ borderLeft: '3px solid #FFD700', paddingLeft: '18px' }}>
                  <p style={{ fontWeight: '900', color: '#FFD700', marginBottom: '10px', letterSpacing: '1px' }}>⚡ МОДИФИКАТОРЫ</p>
                  <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px', color: 'rgba(255,255,255,0.85)' }}>
                    <li>Особый тип вопроса. Стоимость определяется <strong style={{ color: 'white' }}>вручную</strong> в момент игры.</li>
                    <li>Ведущий выбирает сумму и нажимает «Начислить баллы» для нужного игрока.</li>
                    <li>Примеры: двойная ставка, аукцион баллов, обмен очками между игроками.</li>
                  </ul>
                </div>

                <div style={{ borderLeft: '3px solid rgba(232, 93, 141, 0.6)', paddingLeft: '18px' }}>
                  <p style={{ fontWeight: '900', color: 'white', marginBottom: '10px', letterSpacing: '1px' }}>🚀 СУПЕР-ИГРА</p>
                  <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px', color: 'rgba(255,255,255,0.85)' }}>
                    <li>Доступна только после завершения Раунда 2.</li>
                    <li>Ведущий поочерёдно убирает темы, пока не остаётся одна — финальная.</li>
                    <li>Максимальная ставка: <strong style={{ color: 'var(--color-teal)' }}>3000 дукатов</strong>. Можно изменить перед начислением.</li>
                    <li>Побеждает тот, у кого больше всего дукатов по итогу всех раундов.</li>
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

      {/* Background Icons — subtle, scattered */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 0.06, 0.03, 0.06, 0],
              scale: [1, 1.1, 1],
              rotate: [0, i % 2 === 0 ? 8 : -8, 0]
            }}
            transition={{ 
              duration: 8 + (i % 5), 
              repeat: Infinity, 
              ease: 'easeInOut',
              delay: i * 0.4
            }}
            style={{
              position: 'absolute',
              left: `${(i % 5) * 22 + 3}%`,
              top: `${Math.floor(i / 5) * 26 + 5}%`,
              width: '130px',
              height: '130px',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundImage: i % 2 === 0 ? 'url(/emblem.jpg)' : 'url(/rat.jpg)',
              filter: 'grayscale(100%) brightness(1.8)',
            }}
          />
        ))}
      </div>

      {/* Mouse-following fog / radial glow */}
      <div
        style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          pointerEvents: 'none', zIndex: 0,
          background: `radial-gradient(circle 400px at ${mousePos.x}px ${mousePos.y}px, rgba(127, 215, 205, 0.04) 0%, transparent 70%)`,
          transition: 'background 0.1s ease'
        }}
      />

      {/* Main Content */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4rem' }}>
        <div style={{ textAlign: 'center' }}>
          <motion.div 
            initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1 }}
            style={{ fontSize: 'clamp(18px, 3.5vw, 28px)', color: 'var(--color-pink)', fontWeight: '900', letterSpacing: '14px', marginBottom: '0.5rem', opacity: 0.75 }}
          >
            KD CLUB
          </motion.div>
          <motion.h1 
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3, duration: 1 }}
            style={{ fontSize: 'clamp(44px, 10vw, 96px)', color: 'white', lineHeight: '0.9', margin: '0', fontWeight: '900', textShadow: '0 0 60px rgba(255,255,255,0.08)' }}
          >
            ДУКАТСКИЙ<br/>
            <span style={{ color: 'var(--color-teal)', textShadow: '0 0 40px rgba(127, 215, 205, 0.35)' }}>КВИЗ</span>
          </motion.h1>
        </div>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{ 
            boxShadow: [
              '0 0 30px rgba(232, 93, 141, 0.3)',
              '0 0 60px rgba(232, 93, 141, 0.7)',
              '0 0 30px rgba(232, 93, 141, 0.3)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="btn-glass"
          style={{ 
            padding: '24px 72px', fontSize: 'clamp(20px, 4vw, 32px)', 
            background: 'var(--color-pink) !important', color: '#fff !important', 
            borderRadius: 'var(--radius-lg) !important', fontWeight: '900', 
            border: 'none !important',
            letterSpacing: '3px'
          }}
          onClick={() => updateState({ screen: 'LOBBY' })}
        >
          НАЧАТЬ
        </motion.button>
      </div>
    </div>
  );
}
