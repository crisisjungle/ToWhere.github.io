import React, { useEffect, useRef, useState } from 'react';
import * as Cesium from 'cesium';
import { motion } from 'framer-motion';

// 主要地标点数据
const pointsData = [
  // 广东省和香港 - 黄色
  { name: '深圳', lng: 114.0579, lat: 22.5431, color: '#FFFF00' },
  { name: '香港', lng: 114.1694, lat: 22.3193, color: '#FFFF00' },
  { name: '惠州', lng: 114.4168, lat: 23.1115, color: '#FFFF00' },
  { name: '珠海', lng: 113.5767, lat: 22.2707, color: '#FFFF00' },
  { name: '中山', lng: 113.392, lat: 22.521, color: '#FFFF00' },
  { name: '东莞', lng: 113.760, lat: 23.020, color: '#FFFF00' },
  { name: '外伶仃岛', lng: 114.0050, lat: 22.1150, color: '#FFFF00' },
  { name: '南澳岛', lng: 117.0700, lat: 23.4400, color: '#FFFF00' },
  
  // 四川区域 - 蓝色
  { name: '成都', lng: 104.0665, lat: 30.5728, color: '#0000FF' },
  { name: '广元', lng: 105.8436, lat: 32.4416, color: '#0000FF' },
  { name: '绵阳', lng: 104.6794, lat: 31.4677, color: '#0000FF' },
  
  // 台湾地区和马来西亚 - 红色
  { name: '台北', lng: 121.5654, lat: 25.0330, color: '#FF0000' },
  { name: '台南', lng: 120.2133, lat: 22.9908, color: '#FF0000' },
  { name: '高雄', lng: 120.3014, lat: 22.6273, color: '#FF0000' },
  { name: '马来西亚', lng: 101.9758, lat: 4.2105, color: '#FF0000' },
];

export default function CesiumGlobe({ goTo, goToCity }) {
  const cesiumContainer = useRef(null);
  const viewer = useRef(null);
  const [showTicket, setShowTicket] = useState(false);
  const [ticketImage, setTicketImage] = useState(null);
  const [showMoonPhotos, setShowMoonPhotos] = useState(false);
  const [currentMoonPhoto, setCurrentMoonPhoto] = useState(0);
  
  // 月球异地照片
  const moonPhotos = [
    '/images/cities/月球/Screenshot_20250716_230917_com.tencent.mm.jpg',
    '/images/cities/月球/Screenshot_20250716_230920_com.tencent.mm.jpg',
    '/images/cities/月球/Screenshot_20250717_235058_com.tencent.mm.jpg',
    '/images/cities/月球/Screenshot_20250717_235102_com.tencent.mm.jpg',
    '/images/cities/月球/Screenshot_20250717_235423_com.tencent.mm.jpg',
  ];

  useEffect(() => {
    if (!cesiumContainer.current || viewer.current) return;

    console.log('开始初始化 Cesium...');

    try {
      // 设置 Cesium 静态资源路径
      window.CESIUM_BASE_URL = '/cesium/';
      
      // 设置 Cesium Token (可选，如果你有的话)
      // Cesium.Ion.defaultAccessToken = 'your-token-here';

      // 创建最简单的 Viewer 配置
      viewer.current = new Cesium.Viewer(cesiumContainer.current, {
        baseLayerPicker: false,
        timeline: false,
        animation: false,
        navigationHelpButton: false,
        homeButton: false,
        geocoder: false,
        sceneModePicker: false,
        infoBox: false,
        selectionIndicator: false,
        fullscreenButton: false,
        vrButton: false,
        creditContainer: document.createElement('div'),
      });

      viewer.current.clock.shouldAnimate = true;

      console.log('Cesium Viewer 创建成功');

      // 隐藏左下角的控制器
      viewer.current.cesiumWidget.creditContainer.style.display = 'none';
      
      // 设置地球基础样式
      viewer.current.scene.globe.enableLighting = false;
      viewer.current.scene.globe.show = true;
      
      // 保留Cesium默认的影像层，不做任何修改
      console.log('使用Cesium默认影像层，影像层数量:', viewer.current.imageryLayers.length);

      // 飞到中国上空
      viewer.current.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(114, 23, 2000000),
      });

      console.log('相机位置设置完成');

      // 添加美观的地标点
      console.log('开始添加城市点位，总数:', pointsData.length);
      
      pointsData.forEach((pt, index) => {
        try {
          const position = Cesium.Cartesian3.fromDegrees(pt.lng, pt.lat, 0);
          
          const entity = viewer.current.entities.add({
            name: pt.name,
            position: position,
            point: {
              pixelSize: new Cesium.CallbackProperty((time) => {
                const phase = Cesium.JulianDate.secondsDifference(time, viewer.current.clock.currentTime) * 2 * Math.PI / 2; // 2秒周期
                return 15 + Math.sin(phase) * 2;  // 较小内部圆，轻微呼吸
              }, false),
              color: Cesium.Color.WHITE.withAlpha(0.8),
              outlineColor: Cesium.Color.WHITE.withAlpha(0.4),
              outlineWidth: new Cesium.CallbackProperty((time) => {
                const phase = Cesium.JulianDate.secondsDifference(time, viewer.current.clock.currentTime) * 2 * Math.PI / 2; // 同步周期
                return 3 + Math.sin(phase) * 3;  // 外圈呼吸 0-6宽度
              }, false),
              heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
              scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.5, 1.5e7, 0.5),
            },
                          label: {
                text: pt.name,
                font: 'bold 16px PingFang SC, Microsoft YaHei, Arial, sans-serif',
                fillColor: Cesium.Color.WHITE,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 2,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                pixelOffset: new Cesium.Cartesian2(0, -35),
                showBackground: true,
                backgroundColor: Cesium.Color.BLACK.withAlpha(0.7),
                backgroundPadding: new Cesium.Cartesian2(10, 6),
                scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.2, 1.5e7, 0.6),
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                scale: new Cesium.CallbackProperty((time) => {
                  const phase = Cesium.JulianDate.secondsDifference(time, viewer.current.clock.currentTime) * 2 * Math.PI / 2;
                  return 1 + Math.sin(phase) * 0.02;
                }, false),
              },
            description: pt.name,
            pointData: pt,
          });
          
          console.log(`[${index + 1}/${pointsData.length}] 成功添加标点:`, pt.name, '坐标:', pt.lng, pt.lat);
        } catch (error) {
          console.error(`添加标点 ${pt.name} 失败:`, error);
        }
      });

      console.log('完成添加城市点位，当前实体数:', viewer.current.entities.values.length);

      // 添加月球
      const moonPosition = Cesium.Cartesian3.fromDegrees(114 + 30, 23, 38400000); // 在地球旁边，真实月球距离的1/10
      
      const moonEntity = viewer.current.entities.add({
        name: '月球',
        position: moonPosition,
        ellipsoid: {
          radii: new Cesium.Cartesian3(174000, 174000, 174000), // 月球半径约1737公里，缩小10倍
          material: new Cesium.ImageMaterialProperty({
            image: '/cesium/Assets/Textures/moonSmall.jpg', // 使用Cesium自带的月球贴图
            transparent: false
          }),
          outline: false,
        },
        label: {
          text: '月球 🌙',
          font: 'bold 18px PingFang SC, Microsoft YaHei, Arial, sans-serif',
          fillColor: Cesium.Color.LIGHTYELLOW,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 2,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          pixelOffset: new Cesium.Cartesian2(0, -200000),
          showBackground: true,
          backgroundColor: Cesium.Color.BLACK.withAlpha(0.8),
          backgroundPadding: new Cesium.Cartesian2(12, 8),
          scaleByDistance: new Cesium.NearFarScalar(1.5e6, 1.5, 1.5e8, 0.8),
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          scale: new Cesium.CallbackProperty((time) => {
            const phase = Cesium.JulianDate.secondsDifference(time, viewer.current.clock.currentTime) * 2 * Math.PI / 3;
            return 1 + Math.sin(phase) * 0.1; // 轻微的缩放动画
          }, false),
        },
        description: '月球 - 异地时光',
        isMoon: true,
      });
      
      console.log('月球已添加到场景中');

      // 添加点击事件监听器
      const clickHandler = (event) => {
        try {
          const pickedObject = viewer.current.scene.pick(new Cesium.Cartesian2(event.clientX, event.clientY));
          
          if (Cesium.defined(pickedObject) && Cesium.defined(pickedObject.id)) {
            const entity = pickedObject.id;
            
            // 检查是否点击了月球
            if (entity.isMoon) {
              console.log('点击了月球，显示异地照片');
              setShowMoonPhotos(true);
              setCurrentMoonPhoto(0);
              return;
            }
            
            if (entity.pointData) {
              const pointData = entity.pointData;
              console.log('点击了标点:', pointData.name);
              
              onCityClick(pointData.name);
            }
          }
        } catch (error) {
          console.error('点击事件处理错误:', error);
        }
      };

      viewer.current.cesiumWidget.canvas.addEventListener('click', clickHandler);

      console.log('Cesium 初始化完成');

    } catch (error) {
      console.error('Cesium 初始化错误:', error);
    }

    // 清理函数
    return () => {
      try {
        if (viewer.current) {
          viewer.current.destroy();
          viewer.current = null;
        }
      } catch (error) {
        console.error('Cesium 清理错误:', error);
      }
    };
  }, [goToCity]);

  let planeEntity; // 定义在组件 scope 内

  // 城市坐标配置
  const cityPositions = {
    '深圳': Cesium.Cartesian3.fromDegrees(114.0579, 22.5431, 0),
    '香港': Cesium.Cartesian3.fromDegrees(114.1694, 22.3193, 0),
    '东莞': Cesium.Cartesian3.fromDegrees(113.7518, 23.0207, 0),
    '珠海': Cesium.Cartesian3.fromDegrees(113.5767, 22.2707, 0),
    '南澳岛': Cesium.Cartesian3.fromDegrees(117.027, 23.419, 0),
    '中山': Cesium.Cartesian3.fromDegrees(113.3928, 22.5159, 0),
    '惠州': Cesium.Cartesian3.fromDegrees(114.4168, 23.1115, 0),
    '台北': Cesium.Cartesian3.fromDegrees(121.5654, 25.0330, 0),
    '台南': Cesium.Cartesian3.fromDegrees(120.2133, 22.9908, 0),
    '高雄': Cesium.Cartesian3.fromDegrees(120.3014, 22.6273, 0),
    '成都': Cesium.Cartesian3.fromDegrees(104.0665, 30.5723, 0),
    '绵阳': Cesium.Cartesian3.fromDegrees(104.6796, 31.4675, 0),
    '广元': Cesium.Cartesian3.fromDegrees(105.8434, 32.4355, 0),
    '外伶仃岛': Cesium.Cartesian3.fromDegrees(114.0050, 22.1150, 0),
  };

  // 交通工具配置（移除svg，改为参数传递）
  const vehicleConfigs = {
    plane: { heightMultiplier: 500000, dashLength: 20 },
    car: { heightMultiplier: 10000, dashLength: 10 },
    train: { heightMultiplier: 0, dashLength: 15 },
    ship: { heightMultiplier: 5000, dashLength: 15 },
  };

  const startTransition = (cityName, fromCity, toCity, vehicleType, svg) => {
    if (!viewer.current) return;

    // 只为飞机、火车、船显示票（目前仅台北有图片）
    if (['plane', 'train', 'ship'].includes(vehicleType)) {
      setShowTicket(true);
      setTicketImage(cityName === '台北' ? '/images/cities/台北/ticket1.jpg' : null); // 后续添加其他图片
    } else {
      setShowTicket(false);
    }

    const fromPos = cityPositions[fromCity];
    const toPos = cityPositions[toCity];

    const distance = Cesium.Cartesian3.distance(fromPos, toPos);
    const minDuration = 3000;
    const maxDuration = 5000;
    const maxDistance = 2000000;
    const duration = minDuration + Math.min(distance / maxDistance, 1) * (maxDuration - minDuration);

    const config = vehicleConfigs[vehicleType];
    const pathPositions = [];
    const steps = 100;
    for (let i = 0; i <= steps; i++) {
      const fraction = i / steps;
      const height = Math.sin(fraction * Math.PI) * config.heightMultiplier;
      const pos = Cesium.Cartesian3.lerp(fromPos, toPos, fraction, new Cesium.Cartesian3());
      Cesium.Cartesian3.add(pos, Cesium.Cartesian3.multiplyByScalar(Cesium.Cartesian3.normalize(pos, new Cesium.Cartesian3()), height, new Cesium.Cartesian3()), pos);
      pathPositions.push(pos);
    }

    viewer.current.entities.add({
      polyline: {
        positions: pathPositions,
        width: 4,
        material: new Cesium.PolylineDashMaterialProperty({
          color: Cesium.Color.WHITE.withAlpha(0.8),
          dashLength: config.dashLength
        }),
      }
    });

    const midLon = (Cesium.Cartographic.fromCartesian(fromPos).longitude + Cesium.Cartographic.fromCartesian(toPos).longitude) / 2;
    const midLat = (Cesium.Cartographic.fromCartesian(fromPos).latitude + Cesium.Cartographic.fromCartesian(toPos).latitude) / 2;

    // 计算合适的高度，使路径占屏幕宽度1/3
    // 假设FOV 60度 (PI/3 rad)
    const fov = Math.PI / 3;
    const effectiveAngle = fov / 3; // 1/3 屏幕
    const cameraHeight = (distance / 2) / Math.tan(effectiveAngle / 2);

    viewer.current.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(midLon * (180 / Math.PI), midLat * (180 / Math.PI), cameraHeight),
      duration: 2,
      complete: () => {
        animateVehicle(pathPositions, cityName, svg, duration);
      }
    });
  };

  const animateVehicle = (pathPositions, cityName, svg, duration) => {
    let startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const fraction = Math.min(elapsed / duration, 1);
      const index = Math.floor(fraction * (pathPositions.length - 1));

      if (fraction >= 1) {
        setShowTicket(false);
        setTicketImage(null);
        if (goToCity) goToCity(cityName);
        return;
      }

      if (!planeEntity) {
        planeEntity = viewer.current.entities.add({
          position: pathPositions[0],
          billboard: {
            image: svg,
            width: 48,
            height: 48,
            scale: 1.2,
            rotation: 0,
          },
        });
      }

      if (index < pathPositions.length - 1) {
        const currentCart = Cesium.Cartographic.fromCartesian(pathPositions[index]);
        const nextCart = Cesium.Cartographic.fromCartesian(pathPositions[index + 1]);
        const lon1 = currentCart.longitude;
        const lat1 = currentCart.latitude;
        const lon2 = nextCart.longitude;
        const lat2 = nextCart.latitude;
        const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
        const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
        let bearing = Math.atan2(y, x);
        bearing = -bearing;
        planeEntity.billboard.rotation.setValue(bearing);
      }
      planeEntity.position.setValue(pathPositions[index]);

      if (index % 5 === 0) {
        viewer.current.entities.add({
          position: pathPositions[index],
          point: {
            pixelSize: 5,
            color: Cesium.Color.WHITE.withAlpha(0.5 - fraction * 0.5),
          },
        });
      }

      requestAnimationFrame(animate);
    };
    animate();
  };

  const onCityClick = (cityName) => {
    switch (cityName) {
      case '东莞':
        startTransition(cityName, '深圳', cityName, 'car', '/car.svg');
        break;
      case '珠海':
        startTransition(cityName, '深圳', cityName, 'car', '/car.svg');
        break;
      case '南澳岛':
        startTransition(cityName, '深圳', cityName, 'car', '/car2.svg');
        break;
      case '中山':
        startTransition(cityName, '珠海', cityName, 'car', '/car.svg');
        break;
      case '惠州':
        startTransition(cityName, '中山', cityName, 'car', '/car2.svg');
        break;
      case '台南':
        startTransition(cityName, '台北', cityName, 'train', '/train.svg');
        break;
      case '高雄':
        startTransition(cityName, '台南', cityName, 'train', '/train3.svg');
        break;
      case '成都':
        startTransition(cityName, '深圳', cityName, 'plane', '/airplane1.svg');
        break;
      case '绵阳':
        startTransition(cityName, '成都', cityName, 'car', '/car2.svg');
        break;
      case '广元':
        startTransition(cityName, '绵阳', cityName, 'car', '/car2.svg');
        break;
      case '台北':
        startTransition(cityName, '香港', cityName, 'plane', '/airplane1.svg');
        break;
      case '外伶仃岛':
        startTransition(cityName, '深圳', cityName, 'ship', '/ship.svg');
        break;
      default:
        if (goToCity) goToCity(cityName);
        break;
    }
  };

  // 月球照片导航函数
  const nextMoonPhoto = () => {
    setCurrentMoonPhoto((prev) => (prev + 1) % moonPhotos.length);
  };
  
  const prevMoonPhoto = () => {
    setCurrentMoonPhoto((prev) => (prev - 1 + moonPhotos.length) % moonPhotos.length);
  };

  return (
    <div ref={cesiumContainer} style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden', position: 'relative' }}>
      {showTicket && ticketImage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            bottom: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            textAlign: 'center',
          }}
        >
          <img 
            src={ticketImage} 
            alt="旅程票" 
            style={{ maxWidth: '400px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }} 
          />
        </motion.div>
      )}
      
      {/* 月球照片浏览器 */}
      {showMoonPhotos && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            zIndex: 2000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div style={{
            position: 'relative',
            maxWidth: '90vw',
            maxHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            {/* 标题 */}
            <h2 style={{
              color: '#fff',
              fontSize: '28px',
              marginBottom: '20px',
              textAlign: 'center',
              fontFamily: 'PingFang SC, Microsoft YaHei, Arial, sans-serif',
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
            }}>
              🌙 异地时光 - 思念如月
            </h2>
            
            {/* 照片容器 */}
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              maxHeight: '70vh',
            }}>
              {/* 上一张按钮 */}
              <button
                onClick={prevMoonPhoto}
                style={{
                  position: 'absolute',
                  left: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '60px',
                  height: '60px',
                  fontSize: '24px',
                  color: '#fff',
                  cursor: 'pointer',
                  zIndex: 3,
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
                  e.target.style.transform = 'translateY(-50%) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.transform = 'translateY(-50%) scale(1)';
                }}
              >
                ❮
              </button>
              
              {/* 照片 */}
              <motion.img
                key={currentMoonPhoto}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
                src={moonPhotos[currentMoonPhoto]}
                alt={`异地时光 ${currentMoonPhoto + 1}`}
                style={{
                  maxWidth: '80%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  borderRadius: '15px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.7)',
                  border: '3px solid rgba(255, 255, 255, 0.3)',
                }}
              />
              
              {/* 下一张按钮 */}
              <button
                onClick={nextMoonPhoto}
                style={{
                  position: 'absolute',
                  right: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '60px',
                  height: '60px',
                  fontSize: '24px',
                  color: '#fff',
                  cursor: 'pointer',
                  zIndex: 3,
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
                  e.target.style.transform = 'translateY(-50%) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.transform = 'translateY(-50%) scale(1)';
                }}
              >
                ❯
              </button>
            </div>
            
            {/* 照片计数器和关闭按钮 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              maxWidth: '500px',
              marginTop: '20px',
            }}>
              <div style={{
                color: '#fff',
                fontSize: '16px',
                opacity: 0.8,
                fontFamily: 'PingFang SC, Microsoft YaHei, Arial, sans-serif',
              }}>
                {currentMoonPhoto + 1} / {moonPhotos.length}
              </div>
              
              <button
                onClick={() => setShowMoonPhotos(false)}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  borderRadius: '25px',
                  padding: '12px 24px',
                  fontSize: '16px',
                  color: '#fff',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  fontFamily: 'PingFang SC, Microsoft YaHei, Arial, sans-serif',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                关闭 ✕
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
} 