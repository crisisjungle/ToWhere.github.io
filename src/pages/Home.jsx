import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import CesiumGlobe from '../components/CesiumGlobe';

export default function Home({ goTo, goToCity }) {
  const title = '一路向哪？'.split('');
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef(null);
  const isScrollingToGlobe = useRef(false);

  useEffect(() => {
    const handleScroll = (e) => {
      if (!containerRef.current) return;
      
      const newScrollY = containerRef.current.scrollTop;
      setScrollY(newScrollY);
      
      // 当滚动到第二屏完全显示时，可以考虑跳转到地球页面
      // 暂时注释掉自动跳转，让用户可以体验完整的滚动动画
      /*
      if (newScrollY > window.innerHeight * 1.5 && !isScrollingToGlobe.current) {
        isScrollingToGlobe.current = true;
        setTimeout(() => {
          goTo('globe');
        }, 500);
      }
      */
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [goTo]);

  // 计算滚动参数
  const scrollProgress = Math.min(scrollY / window.innerHeight, 1);
  const titleOpacity = Math.max(1 - scrollProgress * 2, 0); // 标题逐渐消失

  return (
    <div 
      ref={containerRef}
      style={{ 
        width: '100vw', 
        height: '100vh', 
        overflowY: 'auto',
        overflowX: 'hidden',
        scrollBehavior: 'smooth'
      }}
    >
      {/* 第一屏：主页内容 */}
      <div 
        style={{ 
          width: '100vw', 
          height: '100vh', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          color: '#ff69b4', 
          textShadow: '0 2px 4px rgba(0,0,0,0.5)',
          position: 'relative',
          background: '#000', // 纯黑背景
        }}
      >
        {/* 标题 */}
        <div 
          style={{ 
            display: 'flex',
            opacity: titleOpacity,
            transform: `translateY(${-scrollY * 0.5}px)` // 视差效果
          }}
        >
          {title.map((char, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2, ease: 'easeOut' }}
              style={{ fontSize: '4rem', fontWeight: 'bold', margin: '0 0.1rem' }}
            >
              {char}
            </motion.span>
          ))}
        </div>

        {/* 滚动提示 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: titleOpacity }}
          style={{
            position: 'absolute',
            bottom: '5%',
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'white',
            textAlign: 'center',
            fontSize: '1.2rem'
          }}
        >
          <div>向下滚动探索地球</div>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ fontSize: '2rem', marginTop: '10px' }}
          >
            ↓
          </motion.div>
        </motion.div>
      </div>

      {/* 第二屏：地球过渡页面 */}
      <div 
        style={{ 
          width: '100vw', 
          height: '100vh', 
          position: 'relative',
          background: '#000', // 纯黑背景
          overflow: 'hidden'
        }}
      >
        {/* 3D地球组件 */}
        <div 
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100vw',
            height: '100vh',
            pointerEvents: scrollProgress > 0.95 ? 'auto' : 'none' // 只有滚动到95%才启用交互
          }}
        >
          <CesiumGlobe 
            goToCity={goToCity} 
            transitionMode={true}
            scrollProgress={scrollProgress}
          />
        </div>

        {/* 滚动覆盖层：确保用户可以继续滚动而不被Cesium拦截 */}
        {scrollProgress < 0.95 && (
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 100,
              pointerEvents: 'none', // 允许滚动穿透，但阻止其他交互
              cursor: 'default'
            }}
          />
        )}

        {/* 过渡文字 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: scrollProgress > 0.3 ? 1 : 0 }}
          style={{
            position: 'absolute',
            top: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'white',
            textAlign: 'center',
            fontSize: '2rem',
            fontWeight: 'bold',
            textShadow: '0 2px 4px rgba(0,0,0,0.8)',
            zIndex: 10
          }}
        >
          探索我们的旅程
        </motion.div>

        {/* 滚动进度提示 */}
        {scrollProgress > 0.8 && scrollProgress < 0.95 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              position: 'absolute',
              bottom: '15%',
              left: '50%',
              transform: 'translateX(-50%)',
              color: 'rgba(255, 255, 255, 0.8)',
              textAlign: 'center',
              fontSize: '1.2rem',
              zIndex: 10
            }}
          >
            继续向下滑动解锁地球交互 ({Math.round(scrollProgress * 100)}%)
          </motion.div>
        )}

        {/* 进入地球页面按钮 */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: scrollProgress > 0.95 ? 1 : 0,
            y: scrollProgress > 0.95 ? 0 : 20 
          }}
          onClick={() => goTo('globe')}
          style={{
            position: 'absolute',
            bottom: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '15px 30px',
            fontSize: '1.5rem',
            color: 'white',
            background: 'rgba(255, 255, 255, 0.2)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '25px',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            fontWeight: 'bold',
            textShadow: '0 2px 4px rgba(0,0,0,0.8)',
            transition: 'all 0.3s ease',
            zIndex: 10
          }}
          whileHover={{
            scale: 1.05,
            background: 'rgba(255, 255, 255, 0.3)'
          }}
          whileTap={{ scale: 0.95 }}
        >
          🌍 现在可以操作地球了！
        </motion.button>
      </div>
    </div>
  );
} 