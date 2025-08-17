import React from 'react';
import { motion } from 'framer-motion';

export default function Home({ goTo }) {
  const title = '一路向哪？'.split('');

  return (
    <div 
      style={{ 
        width: '100vw', 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        color: '#ff69b4', 
        textShadow: '0 2px 4px rgba(0,0,0,0.5)',
        position: 'relative',
        backgroundColor: 'rgba(255, 192, 203, 0.3)', 
      }}
    >
      {/* 上半部分：空出空间给视频背景（后续添加） */}
      <div style={{ width: '100%', height: '50vh', background: '#000' /* 占位黑色背景 */ }}></div>
      
      {/* 标题 */}
      <div style={{ position: 'absolute', top: '20%', display: 'flex' }}>
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
      
      {/* 下半部分：地球图片作为入口 */}
      <div 
        style={{ 
          width: '50vw', 
          height: '50vh', 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer' 
        }} 
        onClick={() => goTo('globe')}
      >
        <img src="/earth.png" alt="Enter ToWhere" style={{ maxWidth: '100%', maxHeight: '100%' }} />
      </div>
    </div>
  );
} 