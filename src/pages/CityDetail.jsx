import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function CityDetail({ cityName, goBack }) {
  const [scrollY, setScrollY] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true); // 默认深色模式
  const [cityImages, setCityImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 城市的主要景点图片配置
  const cityConfig = {
    '深圳': {
      mainImage: '/images/cities/深圳/main.jpg',
      description: '2024.12.28 ～',
      gallery: [
        '/images/cities/深圳/WechatIMG681.jpg',
        '/images/cities/深圳/WechatIMG680.jpg',
        '/images/cities/深圳/WechatIMG678.jpg',
        '/images/cities/深圳/WechatIMG677.jpg',
        '/images/cities/深圳/WechatIMG668.jpg',
        '/images/cities/深圳/WechatIMG667.jpg',
        '/images/cities/深圳/WechatIMG666.jpg',
        '/images/cities/深圳/174591752948657_.pic.jpg',
        '/images/cities/深圳/174581752948656_.pic.jpg',
        '/images/cities/深圳/174571752948655_.pic.jpg',
        '/images/cities/深圳/174561752948654_.pic.jpg',
        '/images/cities/深圳/wx_camera_1752934528042.jpg',
        '/images/cities/深圳/IMG_20250707_235656.jpg',
        '/images/cities/深圳/wx_camera_1751903753776.jpg',
        '/images/cities/深圳/IMG_20250707_205303.jpg',
        '/images/cities/深圳/IMG_20250707_063900.jpg',
        '/images/cities/深圳/IMG_20250706_175621.jpg',
        '/images/cities/深圳/IMG_20250706_175219.jpg',
        '/images/cities/深圳/IMG_20250706_175215.jpg',
        '/images/cities/深圳/IMG_20250706_172944.jpg',
        '/images/cities/深圳/IMG_20250706_172947.jpg',
        '/images/cities/深圳/wx_camera_1751770864385.jpg',
        '/images/cities/深圳/IMG_20250706_090637.jpg',
        '/images/cities/深圳/IMG_20250706_090021.jpg',
        '/images/cities/深圳/IMG_20250702_072400.jpg',
        '/images/cities/深圳/IMG_20250702_072347.jpg',
        '/images/cities/深圳/IMG_20250621_055705.jpg',
        '/images/cities/深圳/IMG_20250621_053002.jpg',
        '/images/cities/深圳/IMG_20250621_052601.jpg',
        '/images/cities/深圳/IMG_20250616_003707.jpg',
        '/images/cities/深圳/WechatIMG676.jpg',
        
        // promphoto系列（最新添加）
        '/images/cities/深圳/promphoto_1747390988721.jpg',
        '/images/cities/深圳/promphoto_1747390988694.jpg',
        '/images/cities/深圳/promphoto_1747390988668.jpg',
        '/images/cities/深圳/promphoto_1747390988553.jpg',
        
        '/images/cities/深圳/IMG_20250516_155828.jpg',
        '/images/cities/深圳/wx_camera_1747030914549.jpg',
        '/images/cities/深圳/wx_camera_1746673550009.jpg',
        '/images/cities/深圳/wx_camera_1746593650868.jpg',
        '/images/cities/深圳/IMG_20250427_135810.jpg',
        '/images/cities/深圳/IMG_20250315_231412.jpg',
        
        // 微信图片17系列
        '/images/cities/深圳/WechatIMG17818.jpg',
        '/images/cities/深圳/WechatIMG17817.jpg',
        '/images/cities/深圳/WechatIMG17816.jpg',
        '/images/cities/深圳/WechatIMG17815.jpg',
        '/images/cities/深圳/WechatIMG17814.jpg',
        '/images/cities/深圳/WechatIMG17813.jpg',
        '/images/cities/深圳/WechatIMG17812.jpg',
        '/images/cities/深圳/WechatIMG17810.jpg',
        '/images/cities/深圳/WechatIMG17809.jpg',
        '/images/cities/深圳/WechatIMG17804.jpg',
        '/images/cities/深圳/WechatIMG17803.jpg',
        
        // IMG_系列照片
        '/images/cities/深圳/IMG_0103.jpg',
        '/images/cities/深圳/IMG_0098.jpg',
        '/images/cities/深圳/IMG_0072.jpg',
        '/images/cities/深圳/IMG_0051.jpg',
        '/images/cities/深圳/IMG_0049.jpg',
        '/images/cities/深圳/IMG_0048.jpg',
        '/images/cities/深圳/IMG_0044.jpg',
        '/images/cities/深圳/IMG_0029.jpg',
        
        // 2024年照片
        '/images/cities/深圳/IMG_20241228_224936.jpg',
        '/images/cities/深圳/IMG_20241228_224923.jpg',
      ]
    },
    '香港': {
      mainImage: '/images/cities/香港/main.jpg',
      description: '2024.9 ～ 2025.7',
      gallery: [
        '/images/cities/香港/mmexport1753246771006.jpg',
        '/images/cities/香港/mmexport1752421249989.jpg',
        '/images/cities/香港/mmexport1752421152574.jpg',
        '/images/cities/香港/wx_camera_1746968527226.jpg',
        '/images/cities/香港/IMG_20250511_185935.jpg',
        '/images/cities/香港/IMG_20250511_185922.jpg',
        '/images/cities/香港/IMG_20250510_155901.jpg',
        '/images/cities/香港/IMG_20250510_155857.jpg',
        '/images/cities/香港/IMG_20250510_155845.jpg',
        '/images/cities/香港/IMG_20250507_144431.jpg',
        '/images/cities/香港/IMG_20250503_103617.jpg',
        '/images/cities/香港/wx_camera_1745584891132.jpg',
        '/images/cities/香港/IMG_20250325_175518.jpg',
        '/images/cities/香港/Screenshot_20250315_203100_com.tencent.mm.jpg',
        '/images/cities/香港/wx_camera_1741849979088.jpg',
        '/images/cities/香港/wx_camera_1741849027523.jpg',
        '/images/cities/香港/IMG_20250313_145558.jpg',
        '/images/cities/香港/IMG_20250313_145524.jpg',
        '/images/cities/香港/IMG_20250313_145008.jpg',
        '/images/cities/香港/wx_camera_1739541018151.jpg',
        '/images/cities/香港/IMG_20250214_212427.jpg',
        '/images/cities/香港/IMG_20250214_212028.jpg',
        '/images/cities/香港/IMG_20250208_080930.jpg',
        '/images/cities/香港/wx_camera_1738747120938.jpg',
        '/images/cities/香港/wx_camera_1735282504779.jpg',
        '/images/cities/香港/IMG_20241202_065859.jpg',
      ]
    },
    '惠州': {
      mainImage: '/images/cities/惠州/main.jpg',
      description: '2025.6.8',
      gallery: []
    },
    '珠海': {
      mainImage: '/images/cities/珠海/main.jpg',
      description: '2025.6.6 ～ 2025.6.7',
      gallery: [
        '/images/cities/珠海/main2.jpg',
        '/images/cities/珠海/main1.jpg',
      ]
    },
    '中山': {
      mainImage: '/images/cities/中山/main.jpg',
      description: '2025.6.7 ～ 2025.6.8',
      gallery: []
    },
    '东莞': {
      mainImage: '/images/cities/东莞/main.jpg',
      description: '2025.3.3',
      gallery: []
    },
    '外伶仃岛': {
      mainImage: '/images/cities/外伶仃岛/main.jpg',
      description: '2025.2.20 ～ 2025.2.21',
      gallery: [
        '/images/cities/外伶仃岛/1.jpg',
        '/images/cities/外伶仃岛/2.jpg',
        '/images/cities/外伶仃岛/3.jpg',
        '/images/cities/外伶仃岛/4.jpg',
      ]
    },
    '南澳岛': {
      mainImage: '/images/cities/南澳岛/main.jpg',
      description: '2025.4.9 ～ 2025.4.10',
      gallery: [
        '/images/cities/南澳岛/1.jpg',
        '/images/cities/南澳岛/2.jpg',
        '/images/cities/南澳岛/3.jpg',
        '/images/cities/南澳岛/4.jpg',
        '/images/cities/南澳岛/5.jpg',
        '/images/cities/南澳岛/6.jpg',
      ]
    },
    '台北': {
      mainImage: '/images/cities/台北/main.jpg',
      description: '2025.6.25 ～ 2025.6.27',
      gallery: [
        '/images/cities/台北/main1.jpg',
        '/images/cities/台北/IMG_20250627_143554.jpg',
        '/images/cities/台北/IMG_20250627_135427.jpg',
        '/images/cities/台北/Screenshot_20250627_122532_com.gbox.android.jpg',
        '/images/cities/台北/IMG_20250627_115535.jpg',
        '/images/cities/台北/Screenshot_20250627_003954_com.easy.abroad.jpg',
        '/images/cities/台北/IMG_20250626_204833.jpg',
        '/images/cities/台北/IMG_20250626_170428.jpg',
        '/images/cities/台北/wx_camera_1750927440445.jpg',
        '/images/cities/台北/wx_camera_1750927393137.jpg',
        '/images/cities/台北/IMG_20250626_163810.jpg',
        '/images/cities/台北/IMG_20250626_163415.jpg',
        '/images/cities/台北/IMG_20250626_163151.jpg',
        '/images/cities/台北/IMG_20250626_155200.jpg',
        '/images/cities/台北/Screenshot_20250626_153256_com.gbox.android.jpg',
        '/images/cities/台北/IMG_20250626_150205.jpg',
        '/images/cities/台北/IMG_20250626_145510.jpg',
        '/images/cities/台北/IMG_20250626_141614.jpg',
        '/images/cities/台北/Screenshot_20250625_221039_com.gbox.android.jpg',
        '/images/cities/台北/IMG_20250625_210721.jpg',
        '/images/cities/台北/IMG_20250625_201232.jpg',
        '/images/cities/台北/IMG_20250625_194953.jpg',
        '/images/cities/台北/IMG_20250625_184730.jpg',
        '/images/cities/台北/IMG_20250625_184619.jpg',
        '/images/cities/台北/IMG_20250625_184612.jpg',
        '/images/cities/台北/IMG_20250625_170315.jpg',
        '/images/cities/台北/IMG_20250625_170309.jpg',
        '/images/cities/台北/IMG_20250625_170300.jpg',
        '/images/cities/台北/IMG_20250625_170257.jpg',
        '/images/cities/台北/wx_camera_1750812335001.jpg',
      ]
    },
    '马来西亚': {
      mainImage: '/images/cities/马来西亚/main.jpg',
      description: '2025.1.5 ～ 2025.1.10',
      gallery: [
        '/images/cities/马来西亚/Screenshot_20250107_095012_com.tencent.mm.jpg',
        '/images/cities/马来西亚/mmexport1752421184942.jpg',
        '/images/cities/马来西亚/mmexport1752421179187.jpg',
        '/images/cities/马来西亚/IMG-20250109-WA0011.jpg',
        '/images/cities/马来西亚/IMG-20250109-WA0008.jpg',
        '/images/cities/马来西亚/IMG-20250109-WA0006.jpg',
        '/images/cities/马来西亚/IMG-20250108-WA0006.jpg',
        '/images/cities/马来西亚/IMG-20250108-WA0005.jpg',
        '/images/cities/马来西亚/IMG_20250106_205620.jpg',
        '/images/cities/马来西亚/IMG-20250106-WA0003.jpg',
        '/images/cities/马来西亚/IMG-20250106-WA0002.jpg',
        '/images/cities/马来西亚/IMG_20250106_090114.jpg',
        '/images/cities/马来西亚/IMG_20250106_083836.jpg',
      ]
    },
    '成都': {
      mainImage: '/images/cities/成都/main.jpg',
      description: '2025.1.17 ～ 2025.1.19',
      gallery: [
        '/images/cities/成都/1.jpg',
        '/images/cities/成都/2.jpg',
        '/images/cities/成都/3.jpg',
        '/images/cities/成都/4.jpg',
        '/images/cities/成都/5.jpg',
        '/images/cities/成都/6.jpg',
        '/images/cities/成都/7.jpg',
        '/images/cities/成都/8.jpg',
        '/images/cities/成都/9.jpg',
        '/images/cities/成都/10.jpg',
        '/images/cities/成都/11.jpg',
        '/images/cities/成都/12.jpg',
        '/images/cities/成都/13.jpg',
        '/images/cities/成都/14.jpg',
        '/images/cities/成都/15.jpg',
        '/images/cities/成都/16.jpg',
        '/images/cities/成都/17.jpg',
        '/images/cities/成都/18.jpg',
        '/images/cities/成都/IMG_20250118_183439.jpg',
        '/images/cities/成都/IMG_20250118_140452.jpg',
        '/images/cities/成都/IMG_20250117_214252.jpg',
        '/images/cities/成都/wx_camera_1737121258563.jpg',
        '/images/cities/成都/wx_camera_1737120562077.jpg',
        '/images/cities/成都/wx_camera_1737120168538.jpg',
        '/images/cities/成都/wx_camera_1737119207475.jpg',
        '/images/cities/成都/wx_camera_1737118409291.jpg',
        '/images/cities/成都/wx_camera_1737117741151.jpg',
        '/images/cities/成都/wx_camera_1737116951020.jpg',
        '/images/cities/成都/wx_camera_1737116510333.jpg',
        '/images/cities/成都/wx_camera_1737115166280.jpg',
        '/images/cities/成都/wx_camera_1737114486709.jpg',
        '/images/cities/成都/IMG_20250117_193028.jpg',
        '/images/cities/成都/IMG_20250117_192403.jpg',
        '/images/cities/成都/wx_camera_1737112380979.jpg',
        '/images/cities/成都/IMG_20250117_191041.jpg',
        '/images/cities/成都/IMG_20250117_190929.jpg',
        '/images/cities/成都/IMG_20250117_163342.jpg',
        '/images/cities/成都/wx_camera_1737088949704.jpg',
      ]
    },
    '广元': {
      mainImage: '/images/cities/广元/main.jpg',
      description: '2025.1.20 ～ 2025.1.22',
      gallery: [
        '/images/cities/广元/1.jpg',
        '/images/cities/广元/2.jpg',
        '/images/cities/广元/wx_camera_1737533757223.jpg',
        '/images/cities/广元/IMG_20250122_160030.jpg',
        '/images/cities/广元/IMG_20250122_121732.jpg',
        '/images/cities/广元/IMG_20250121_193322.jpg',
        '/images/cities/广元/IMG_20250121_193321.jpg',
        '/images/cities/广元/IMG_20250121_193319.jpg',
        '/images/cities/广元/IMG_20250121_171711.jpg',
        '/images/cities/广元/IMG_20250121_171148.jpg',
        '/images/cities/广元/IMG_20250121_171110.jpg',
        '/images/cities/广元/IMG_20250121_170732.jpg',
        '/images/cities/广元/IMG_20250121_170330.jpg',
        '/images/cities/广元/IMG_20250121_170319.jpg',
        '/images/cities/广元/IMG_20250121_170202.jpg',
        '/images/cities/广元/Screenshot_20250121_135951_com.tencent.mm.jpg',
        '/images/cities/广元/IMG_20250121_133119.jpg',
        '/images/cities/广元/IMG_20250121_133018.jpg',
        '/images/cities/广元/IMG_20250120_150636.jpg',
        '/images/cities/广元/wx_camera_1737176969675.jpg',
      ]
    },
    '绵阳': {
      mainImage: '/images/cities/绵阳/main.jpg',
      description: '2025.1.19 ～ 2025.1.20',
      gallery: [
        '/images/cities/绵阳/1.jpg',
        '/images/cities/绵阳/2.jpg',
        '/images/cities/绵阳/3.jpg',
        '/images/cities/绵阳/4.jpg',
        '/images/cities/绵阳/wx_camera_1737270310924.jpg',
      ]
    },
    '台南': {
      mainImage: '/images/cities/台南/main.jpg',
      description: '2025.6.27 ～ 2025.6.28',
      gallery: [
        '/images/cities/台南/IMG_20250628_124359.jpg',
        '/images/cities/台南/IMG_20250628_114513.jpg',
        '/images/cities/台南/IMG_20250628_112051.jpg',
        '/images/cities/台南/IMG_20250628_111655.jpg',
        '/images/cities/台南/IMG_20250628_111544.jpg',
        '/images/cities/台南/IMG_20250628_094048.jpg',
        '/images/cities/台南/IMG_20250627_195256.jpg',
        '/images/cities/台南/IMG_20250627_194600.jpg',
        '/images/cities/台南/IMG_20250627_194217.jpg',
        '/images/cities/台南/IMG_20250627_194007.jpg',
        '/images/cities/台南/IMG_20250627_183604.jpg',
        '/images/cities/台南/IMG_20250627_182724.jpg',
        '/images/cities/台南/IMG_20250627_180152.jpg',
        '/images/cities/台南/IMG_20250627_171642.jpg',
        '/images/cities/台南/IMG_20250627_161731.jpg',
        '/images/cities/台南/IMG_20250627_161727.jpg',
        '/images/cities/台南/IMG_20250627_160837.jpg',
      ]
    },
    '高雄': {
      mainImage: '/images/cities/高雄/main.jpg',
      description: '2025.6.28 ～ 2025.6.29',
      gallery: [
        '/images/cities/高雄/1.jpg',
        '/images/cities/高雄/2.jpg',
        '/images/cities/高雄/3.jpg',
        '/images/cities/高雄/4.jpg',
        '/images/cities/高雄/5.jpg',
        '/images/cities/高雄/6.jpg',
        '/images/cities/高雄/7.jpg',
        '/images/cities/高雄/8.jpg',
        '/images/cities/高雄/9.jpg',
        '/images/cities/高雄/10.jpg',
        '/images/cities/高雄/IMG_20250628_172733.jpg',
        '/images/cities/高雄/IMG_20250628_172721.jpg',
        '/images/cities/高雄/IMG_20250628_161319.jpg',
        '/images/cities/高雄/IMG_20250628_161321.jpg',
        '/images/cities/高雄/IMG_20250628_145059.jpg',
        '/images/cities/高雄/IMG_20250628_142952.jpg',
      ]
    },
  };

  const currentCity = cityConfig[cityName] || cityConfig['深圳'];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      // 假设 hero-section 高度为 window.innerHeight，当滚动超过时切换到浅色
      setIsDarkMode(currentScrollY < window.innerHeight);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 组件卸载时恢复滚动
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleImageError = (e) => {
    e.target.style.display = 'none';
  };

  const openImageViewer = (image, index) => {
    setSelectedImage(image);
    setCurrentImageIndex(index);
    document.body.style.overflow = 'hidden'; // 防止背景滚动
  };

  const closeImageViewer = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  const showPreviousImage = () => {
    const allImages = [currentCity.mainImage, ...currentCity.gallery];
    const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : allImages.length - 1;
    setCurrentImageIndex(newIndex);
    setSelectedImage(allImages[newIndex]);
  };

  const showNextImage = () => {
    const allImages = [currentCity.mainImage, ...currentCity.gallery];
    const newIndex = currentImageIndex < allImages.length - 1 ? currentImageIndex + 1 : 0;
    setCurrentImageIndex(newIndex);
    setSelectedImage(allImages[newIndex]);
  };

  // 键盘事件处理
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!selectedImage) return;
      
      if (e.key === 'Escape') {
        closeImageViewer();
      } else if (e.key === 'ArrowLeft') {
        showPreviousImage();
      } else if (e.key === 'ArrowRight') {
        showNextImage();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [selectedImage, currentImageIndex]);

  return (
    <div className="city-detail">
      <button 
        className={`back-button ${isDarkMode ? 'dark' : 'light'}`} 
        onClick={goBack}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        返回
      </button>

      {/* 全屏主页面 */}
      <div className="hero-section">
        <div 
          className="hero-background"
          style={{
            backgroundImage: `url(${currentCity.mainImage})`,
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
          onClick={() => openImageViewer(currentCity.mainImage, 0)}
        />
        <div className="hero-overlay" />
        
        {/* 城市名字 */}
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="city-name">{cityName}</h1>
          <p className="city-description">{currentCity.description}</p>
        </motion.div>

        {/* 下滑提示 */}
        <div className="scroll-indicator">
          <span>向下滑动查看更多</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 13l5 5 5-5M7 6l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* 图片流区域 */}
      <div className="gallery-section">
        <div className="gallery-container">
          <h2 className="gallery-title">精彩瞬间</h2>
          <div className="gallery-grid">
            {currentCity.gallery.map((image, index) => (
              <motion.div
                key={index}
                className="gallery-item"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                onClick={() => openImageViewer(image, index + 1)}
              >
                <img 
                  src={image} 
                  alt={`${cityName}景点${index + 1}`}
                  onError={handleImageError}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* 图片查看器模态框 */}
      {selectedImage && (
        <div className="image-viewer-overlay" onClick={closeImageViewer}>
          <div className="image-viewer-container" onClick={(e) => e.stopPropagation()}>
            {/* 关闭按钮 */}
            <button className="image-viewer-close" onClick={closeImageViewer}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            {/* 上一张按钮 */}
            <button className="image-viewer-nav prev" onClick={showPreviousImage}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            {/* 下一张按钮 */}
            <button className="image-viewer-nav next" onClick={showNextImage}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            {/* 主图片 */}
            <img 
              src={selectedImage} 
              alt="放大查看" 
              className="image-viewer-img"
              onError={handleImageError}
            />
            
            {/* 图片计数器 */}
            <div className="image-viewer-counter">
              {currentImageIndex + 1} / {[currentCity.mainImage, ...currentCity.gallery].length}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .city-detail {
          width: 100%;
          height: 100%;
          overflow-y: auto;
        }

        .hero-section {
          position: relative;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hero-background {
          position: absolute;
          top: -20%;
          left: -20%;
          width: 140%;
          height: 140%;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          background-image: linear-gradient(45deg, #1e3c72, #2a5298);
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
        }

        .back-button {
          position: fixed;
          top: 30px;
          left: 30px;
          padding: 12px 24px;
          border-radius: 30px;
          border: none;
          font-size: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          z-index: 100;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .back-button.dark {
          background: rgba(0, 0, 0, 0.7);
          color: white;
          backdrop-filter: blur(10px);
        }

        .back-button.dark:hover {
          background: rgba(0, 0, 0, 0.9);
          transform: translateY(-2px);
        }

        .back-button.light {
          background: rgba(255, 255, 255, 0.9);
          color: black;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(0, 0, 0, 0.1);
        }

        .back-button.light:hover {
          background: rgba(255, 255, 255, 1);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }

        .hero-content {
          position: relative;
          z-index: 5;
          text-align: center;
          color: white;
          max-width: 80%;
        }

        .city-name {
          font-size: 8rem;
          font-weight: bold;
          margin: 0;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
          letter-spacing: 0.1em;
          line-height: 1.2;
        }

        .city-description {
          font-size: 1.5rem;
          margin-top: 20px;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
          opacity: 0.9;
        }

        .scroll-indicator {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          color: white;
          text-align: center;
          z-index: 10;
          animation: bounce 2s infinite;
        }

        .scroll-indicator span {
          display: block;
          margin-bottom: 8px;
          font-size: 14px;
          opacity: 0.8;
        }

        .gallery-section {
          background: white;
          padding: 80px 0;
          min-height: 100vh;
        }

        .gallery-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 40px;
        }

        .gallery-title {
          font-size: 3rem;
          text-align: center;
          margin-bottom: 60px;
          color: #333;
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
          margin-bottom: 80px;
        }

        .gallery-item {
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
          cursor: pointer;
        }

        .gallery-item:hover {
          transform: translateY(-10px);
        }

        .gallery-item img {
          width: 100%;
          height: 250px;
          object-fit: cover;
          transition: transform 0.3s ease;
          display: block;
        }

        .gallery-item:hover img {
          transform: scale(1.05);
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateX(-50%) translateY(0);
          }
          40% {
            transform: translateX(-50%) translateY(-10px);
          }
          60% {
            transform: translateX(-50%) translateY(-5px);
          }
        }

        .hero-background {
          cursor: pointer;
        }

        /* 图片查看器样式 */
        .image-viewer-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.95);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.3s ease;
        }

        .image-viewer-container {
          position: relative;
          max-width: 90vw;
          max-height: 90vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .image-viewer-img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          border-radius: 8px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }

        .image-viewer-close {
          position: absolute;
          top: -50px;
          right: -50px;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
          z-index: 1001;
        }

        .image-viewer-close:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.1);
        }

        .image-viewer-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
          z-index: 1001;
        }

        .image-viewer-nav:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-50%) scale(1.1);
        }

        .image-viewer-nav.prev {
          left: -80px;
        }

        .image-viewer-nav.next {
          right: -80px;
        }

        .image-viewer-counter {
          position: absolute;
          bottom: -50px;
          left: 50%;
          transform: translateX(-50%);
          color: white;
          background: rgba(0, 0, 0, 0.5);
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          backdrop-filter: blur(10px);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @media (max-width: 768px) {
          .city-name {
            font-size: 4rem;
          }
          .city-description {
            font-size: 1.2rem;
          }
          .gallery-container {
            padding: 0 20px;
          }
          .gallery-grid {
            grid-template-columns: 1fr;
          }
          .back-button {
            top: 20px;
            left: 20px;
            padding: 8px 16px;
            font-size: 14px;
          }
          
          .image-viewer-close {
            top: 20px;
            right: 20px;
          }
          
          .image-viewer-nav.prev {
            left: 20px;
          }
          
          .image-viewer-nav.next {
            right: 20px;
          }
          
          .image-viewer-counter {
            bottom: 20px;
          }
        }
      `}</style>
    </div>
  );
} 