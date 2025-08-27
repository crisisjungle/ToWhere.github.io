import React, { useEffect, useRef, useState } from 'react';
import * as Cesium from 'cesium';
import { motion, AnimatePresence } from 'framer-motion';

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

export default function CesiumGlobe({ goTo, goToCity, transitionMode = false, scrollProgress = 0 }) {
  const cesiumContainer = useRef(null);
  const viewer = useRef(null);
  const [showTicket, setShowTicket] = useState(false);
  const [ticketImage, setTicketImage] = useState(null);
  
  // 动画状态跟踪
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState(null);
  const animationCleanupRef = useRef(null);
  const latestAnimationRef = useRef(null); // 跟踪最新的动画ID
  
  // 调试票据状态变化
  useEffect(() => {
    console.log(`票据状态变化: showTicket=${showTicket}, ticketImage=${ticketImage}`);
  }, [showTicket, ticketImage]);
  
  // 开发环境下添加到window对象，方便调试
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.testTicket = (cityName = '台北') => {
        console.log(`手动测试票据: ${cityName}`);
        const encodedCityName = encodeURIComponent(cityName);
        const ticketPath = `/images/cities/${encodedCityName}/ticket.png`;
        setShowTicket(true);
        setTicketImage(ticketPath);
        setTimeout(() => {
          setShowTicket(false);
          setTicketImage(null);
        }, 3000);
      };
      
      // 测试动画切换功能
      window.testAnimationSwitch = () => {
        console.log('测试动画切换: 台北 -> 成都 -> 马来西亚');
        setTimeout(() => onCityClick('台北'), 100);
        setTimeout(() => onCityClick('成都'), 2000);
        setTimeout(() => onCityClick('马来西亚'), 4000);
      };
      
      // 查看当前动画状态
      window.getAnimationStatus = () => {
        console.log('动画状态:', {
          isAnimating,
          currentAnimation,
          latestAnimation: latestAnimationRef.current,
          hasCleanup: !!animationCleanupRef.current
        });
      };
      
      // 简单测试单个城市
      window.testSingleCity = (cityName = '台北') => {
        console.log(`测试单个城市: ${cityName}`);
        onCityClick(cityName);
      };
    }
  }, [isAnimating, currentAnimation]);
  const [showMoonPhotos, setShowMoonPhotos] = useState(false);
  const [currentMoonPhoto, setCurrentMoonPhoto] = useState(0);
  
  // 月球异地照片
  const moonPhotos = [
    '/images/cities/月球/Screenshot_20250716_230917_com.tencent.mm.jpg',
    '/images/cities/月球/Screenshot_20250716_230920_com.tencent.mm.jpg',
    '/images/cities/月球/Screenshot_20250717_235058_com.tencent.mm.jpg',
    '/images/cities/月球/Screenshot_20250717_235102_com.tencent.mm.jpg',
    '/images/cities/月球/Screenshot_20250717_235423_com.tencent.mm.jpg',
    '/images/cities/月球/WechatIMG739.jpg',
    '/images/cities/月球/WechatIMG740.jpg',
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
      
      // 在过渡模式下禁用相机交互
      if (transitionMode) {
        viewer.current.scene.screenSpaceCameraController.enableRotate = false;
        viewer.current.scene.screenSpaceCameraController.enableTranslate = false;
        viewer.current.scene.screenSpaceCameraController.enableZoom = false;
        viewer.current.scene.screenSpaceCameraController.enableTilt = false;
        viewer.current.scene.screenSpaceCameraController.enableLook = false;
      }
      
      // 保留Cesium默认的影像层，不做任何修改
      console.log('使用Cesium默认影像层，影像层数量:', viewer.current.imageryLayers.length);

      // 根据模式设置初始相机位置和目标
      if (transitionMode) {
        // 过渡模式：逐渐从远处拉近到深圳
        const distance = 50000000 - (scrollProgress * 45000000); // 从5000万米到500万米
        const shenzhenLng = 114.0579;
        const shenzhenLat = 22.5431;
        
        const cameraPosition = Cesium.Cartesian3.fromDegrees(
          shenzhenLng + (1 - scrollProgress) * 20, // 逐渐接近深圳经度
          shenzhenLat + (1 - scrollProgress) * 10,  // 逐渐接近深圳纬度
          distance
        );
        
        viewer.current.camera.setView({
          destination: cameraPosition,
          orientation: {
            heading: 0,
            pitch: -Math.PI / 3 - (scrollProgress * Math.PI / 6), // 逐渐向下倾斜
            roll: 0
          }
        });
        
        console.log(`过渡模式相机设置: 滚动进度${scrollProgress}, 距离${distance}米`);
      } else {
        // 正常模式：飞到能同时看到地球和月球的最佳视角
        viewer.current.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(114 + 10, 23, 25000000), // 调整到能看到地球和月球的距离
        });
      }

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

      // 添加月球 - 调整大小和位置使其更容易看到
      const moonPosition = Cesium.Cartesian3.fromDegrees(114 + 20, 23, 15000000); // 更近的距离，更容易看到
      
      const moonEntity = viewer.current.entities.add({
        name: '月球',
        position: moonPosition,
        ellipsoid: {
          radii: new Cesium.Cartesian3(500000, 500000, 500000), // 放大月球半径，更容易看到
          material: new Cesium.ImageMaterialProperty({
            image: '/cesium/Assets/Textures/moonSmall.jpg',
            transparent: false
          }),
          outline: false, // 移除边框线
        },
        description: '月球 - 异地时光',
        isMoon: true,
      });
      
      // 添加月球光晕效果 - 内层
      const moonGlowEntity = viewer.current.entities.add({
        name: '月球光晕',
        position: moonPosition,
        ellipsoid: {
          radii: new Cesium.Cartesian3(550000, 550000, 550000), // 内层光晕
          material: new Cesium.ColorMaterialProperty(
            new Cesium.CallbackProperty((time) => {
              // 月亮的真实黄色光晕，增强呼吸动画
              const phase = Cesium.JulianDate.secondsDifference(time, viewer.current.clock.currentTime) * 2 * Math.PI / 4; // 4秒周期，更明显
              const alpha = 0.25 + Math.sin(phase) * 0.2; // 0.05-0.45 大幅度变化，更明显的呼吸
              // 真实月亮的暖黄色
              return new Cesium.Color(1.0, 0.85, 0.4, alpha); // 月亮的暖黄色
            }, false)
          ),
          outline: false,
        },
        description: '月球光晕',
      });
      
      // 添加羽化外层光晕
      const moonFeatherGlowEntity = viewer.current.entities.add({
        name: '月球羽化光晕',
        position: moonPosition,
        ellipsoid: {
          radii: new Cesium.Cartesian3(600000, 600000, 600000), // 羽化外层
          material: new Cesium.ColorMaterialProperty(
            new Cesium.CallbackProperty((time) => {
              // 羽化边缘，更柔和的渐变
              const phase = Cesium.JulianDate.secondsDifference(time, viewer.current.clock.currentTime) * 2 * Math.PI / 4; // 与内层同步
              const alpha = 0.12 + Math.sin(phase) * 0.1; // 0.02-0.22 羽化效果
              // 稍浅的月黄色用于羽化
              return new Cesium.Color(1.0, 0.9, 0.6, alpha); // 羽化层的浅黄色
            }, false)
          ),
          outline: false,
        },
        description: '月球羽化光晕',
      });
      
      // 添加最外层羽化
      const moonSoftGlowEntity = viewer.current.entities.add({
        name: '月球软羽化',
        position: moonPosition,
        ellipsoid: {
          radii: new Cesium.Cartesian3(650000, 650000, 650000), // 最外层羽化
          material: new Cesium.ColorMaterialProperty(
            new Cesium.CallbackProperty((time) => {
              // 最柔和的羽化边缘
              const phase = Cesium.JulianDate.secondsDifference(time, viewer.current.clock.currentTime) * 2 * Math.PI / 4; // 与内层同步
              const alpha = 0.06 + Math.sin(phase) * 0.05; // 0.01-0.11 最柔和的羽化
              // 最浅的月黄色
              return new Cesium.Color(1.0, 0.95, 0.8, alpha); // 最浅的羽化层
            }, false)
          ),
          outline: false,
        },
        description: '月球软羽化',
      });
      
      console.log('月球已添加到场景中（包含光晕效果）');
      console.log('月球位置:', '经度 134°, 纬度 23°, 高度 15,000km');
      console.log('提示: 缩放相机到高度 25,000km 以上可同时看到地球和月球');

      // 添加点击事件监听器（仅在非过渡模式下）
      const clickHandler = (event) => {
        if (transitionMode) return; // 过渡模式下禁用点击
        
        try {
          const pickedObject = viewer.current.scene.pick(new Cesium.Cartesian2(event.clientX, event.clientY));
          
          if (Cesium.defined(pickedObject) && Cesium.defined(pickedObject.id)) {
            const entity = pickedObject.id;
            
            // 检查是否点击了月球或任何光晕层
            if (entity.isMoon || entity.name === '月球光晕' || entity.name === '月球羽化光晕' || entity.name === '月球软羽化') {
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

  // 监听滚动进度变化，实时更新相机位置（仅在过渡模式下）
  useEffect(() => {
    if (!viewer.current || !transitionMode) return;
    
    const distance = 50000000 - (scrollProgress * 45000000); // 从5000万米到500万米
    const shenzhenLng = 114.0579;
    const shenzhenLat = 22.5431;
    
    const cameraPosition = Cesium.Cartesian3.fromDegrees(
      shenzhenLng + (1 - scrollProgress) * 20, // 逐渐接近深圳经度
      shenzhenLat + (1 - scrollProgress) * 10,  // 逐渐接近深圳纬度
      distance
    );
    
    // 平滑过渡相机位置
    viewer.current.camera.setView({
      destination: cameraPosition,
      orientation: {
        heading: 0,
        pitch: -Math.PI / 3 - (scrollProgress * Math.PI / 6), // 逐渐向下倾斜
        roll: 0
      }
    });
    
  }, [transitionMode, scrollProgress]);

  // 动态控制相机交互：只有在滚动接近完成时才启用
  useEffect(() => {
    if (!viewer.current || !transitionMode) return;
    
    const shouldEnableInteraction = scrollProgress > 0.95;
    
    viewer.current.scene.screenSpaceCameraController.enableRotate = shouldEnableInteraction;
    viewer.current.scene.screenSpaceCameraController.enableTranslate = shouldEnableInteraction;
    viewer.current.scene.screenSpaceCameraController.enableZoom = shouldEnableInteraction;
    viewer.current.scene.screenSpaceCameraController.enableTilt = shouldEnableInteraction;
    viewer.current.scene.screenSpaceCameraController.enableLook = shouldEnableInteraction;
    
    console.log(`相机交互${shouldEnableInteraction ? '已启用' : '已禁用'}, 滚动进度: ${(scrollProgress * 100).toFixed(1)}%`);
    
  }, [transitionMode, scrollProgress]);

  // 清理当前动画的函数
  const cleanupCurrentAnimation = () => {
    if (animationCleanupRef.current) {
      console.log('取消当前动画');
      animationCleanupRef.current();
      animationCleanupRef.current = null;
    }
    setIsAnimating(false);
    setCurrentAnimation(null);
    setShowTicket(false);
    setTicketImage(null);
    // 注意：不清理 latestAnimationRef，因为新动画已经设置了新的ID
  };

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
    '马来西亚': Cesium.Cartesian3.fromDegrees(101.9758, 4.2105, 0), // 吉隆坡坐标
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

    // 如果当前有动画在进行，先取消它
    if (isAnimating) {
      console.log(`取消当前动画，切换到新目标: ${cityName}`);
      cleanupCurrentAnimation();
    }

    // 创建一个唯一的动画ID来跟踪这个特定的动画
    const animationId = `${cityName}_${Date.now()}`;
    console.log(`开始新动画: ${animationId}`);

    // 设置为最新的动画ID
    latestAnimationRef.current = animationId;

    // 设置新的动画状态
    setIsAnimating(true);
    setCurrentAnimation(animationId);

    // 为飞机、火车、船显示票据
    if (['plane', 'train', 'ship'].includes(vehicleType)) {
      // 对城市名进行URL编码以支持中文字符
      const encodedCityName = encodeURIComponent(cityName);
      const ticketPath = `/images/cities/${encodedCityName}/ticket.png`;
      setShowTicket(true);
      setTicketImage(ticketPath);
      console.log(`显示票据: ${cityName} - ${ticketPath}`);
    } else {
      setShowTicket(false);
    }

    const fromPos = cityPositions[fromCity];
    const toPos = cityPositions[toCity];
    
    // 检查坐标是否存在
    if (!fromPos || !toPos) {
      console.error(`城市坐标缺失: fromCity=${fromCity}, toCity=${toCity}`);
      console.error(`fromPos=${fromPos}, toPos=${toPos}`);
      console.error('可用城市:', Object.keys(cityPositions));
      setShowTicket(false);
      setTicketImage(null);
      return;
    }
    
    console.log(`开始动画: ${fromCity} -> ${toCity} (${vehicleType})`);

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

    let cameraFlyPromise = viewer.current.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(midLon * (180 / Math.PI), midLat * (180 / Math.PI), cameraHeight),
      duration: 2,
      complete: () => {
        // 检查这个特定的动画是否仍然是当前动画
        if (animationCleanupRef.current === null) {
          console.log(`相机飞行完成但动画已被取消: ${cityName}`);
          return;
        }
        
        // 确保在动画开始前票据已经准备好显示
        if (['plane', 'train', 'ship'].includes(vehicleType)) {
          console.log(`动画开始，显示票据状态: showTicket=${showTicket}, ticketImage=${ticketImage}`);
        }
        animateVehicle(pathPositions, cityName, svg, duration, animationId);
      }
    });

    // 设置清理函数
    animationCleanupRef.current = () => {
      // 取消相机飞行
      if (cameraFlyPromise && cameraFlyPromise.cancel) {
        cameraFlyPromise.cancel();
      }
      
      // 清理所有实体（轨迹线和载具）
      if (viewer.current && viewer.current.entities) {
        const entitiesToRemove = [];
        viewer.current.entities.values.forEach(entity => {
          // 移除所有非城市点的实体（轨迹、载具、尾迹等）
          if (!entity.pointData && !entity.isMoon && entity.name !== '月球光晕' && entity.name !== '月球羽化光晕' && entity.name !== '月球软羽化') {
            entitiesToRemove.push(entity);
          }
        });
        entitiesToRemove.forEach(entity => {
          viewer.current.entities.remove(entity);
        });
      }
    };
  };

  const animateVehicle = (pathPositions, cityName, svg, duration, currentAnimationId) => {
    let startTime = Date.now();
    let vehicleEntity = null; // 局部变量，每次动画都重新创建
    let requestId = null;
    
    const animate = () => {
      // 检查动画是否被取消（通过检查cleanup函数是否还存在）
      if (animationCleanupRef.current === null) {
        console.log(`载具动画被取消: ${cityName}`);
        if (vehicleEntity && viewer.current) {
          viewer.current.entities.remove(vehicleEntity);
        }
        return;
      }
      
      const elapsed = Date.now() - startTime;
      const fraction = Math.min(elapsed / duration, 1);
      const index = Math.floor(fraction * (pathPositions.length - 1));

      if (fraction >= 1) {
        // 检查这个动画是否仍然是最新的动画
        if (latestAnimationRef.current !== currentAnimationId) {
          console.log(`动画完成但已被更新的动画取代，不执行跳转: ${cityName}, 当前最新: ${latestAnimationRef.current}`);
          if (vehicleEntity && viewer.current) {
            viewer.current.entities.remove(vehicleEntity);
          }
          return;
        }
        
        // 再次检查动画是否仍然有效（避免被中断后仍然跳转）
        if (animationCleanupRef.current === null) {
          console.log(`动画已在完成前被取消，不执行跳转: ${cityName}`);
          if (vehicleEntity && viewer.current) {
            viewer.current.entities.remove(vehicleEntity);
          }
          return;
        }
        
        // 动画完成，清理状态
        if (vehicleEntity) {
          viewer.current.entities.remove(vehicleEntity);
          vehicleEntity = null;
        }
        setIsAnimating(false);
        setCurrentAnimation(null);
        setShowTicket(false);
        setTicketImage(null);
        animationCleanupRef.current = null;
        
        console.log(`动画完成，跳转到: ${cityName} (ID: ${currentAnimationId})`);
        if (goToCity) goToCity(cityName);
        return;
      }

      if (!vehicleEntity) {
        vehicleEntity = viewer.current.entities.add({
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
        vehicleEntity.billboard.rotation.setValue(bearing);
      }
      vehicleEntity.position.setValue(pathPositions[index]);

      if (index % 5 === 0) {
        viewer.current.entities.add({
          position: pathPositions[index],
          point: {
            pixelSize: 5,
            color: Cesium.Color.WHITE.withAlpha(0.5 - fraction * 0.5),
          },
        });
      }

      requestId = requestAnimationFrame(animate);
    };
    
    // 更新清理函数以包含载具动画的取消
    const originalCleanup = animationCleanupRef.current;
    animationCleanupRef.current = () => {
      if (originalCleanup) originalCleanup();
      
      // 取消动画帧
      if (requestId) {
        cancelAnimationFrame(requestId);
        requestId = null;
      }
      
      // 清理载具实体
      if (vehicleEntity && viewer.current) {
        viewer.current.entities.remove(vehicleEntity);
        vehicleEntity = null;
      }
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
      case '马来西亚':
        startTransition(cityName, '深圳', cityName, 'plane', '/airplane1.svg');
        break;
      default:
        if (goToCity) goToCity(cityName);
        break;
    }
  };

  // 月球照片触控滑动相关状态
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  
  // 最小滑动距离
  const minSwipeDistance = 50;
  
  // 月球照片导航函数
  const nextMoonPhoto = () => {
    setCurrentMoonPhoto((prev) => (prev + 1) % moonPhotos.length);
  };
  
  const prevMoonPhoto = () => {
    setCurrentMoonPhoto((prev) => (prev - 1 + moonPhotos.length) % moonPhotos.length);
  };
  
  // 触控事件处理
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      nextMoonPhoto();
    }
    if (isRightSwipe) {
      prevMoonPhoto();
    }
  };

  return (
    <div ref={cesiumContainer} style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden', position: 'relative' }}>
      {/* 票据显示 */}
      <AnimatePresence>
      {showTicket && ticketImage && (
        <motion.div
            key="ticket"
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
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
              alt="旅程票据" 
              style={{ 
                maxWidth: '400px', 
                maxHeight: '300px', 
                borderRadius: '12px', 
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)', 
                objectFit: 'contain'
              }}
              onError={(e) => {
                console.log(`票据图片加载失败: ${ticketImage}`);
                e.target.style.display = 'none';
                setShowTicket(false);
              }}
              onLoad={() => {
                console.log(`票据图片加载成功: ${ticketImage}`);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 月球照片浏览器 - 触控滑动版本 */}
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
            padding: '0',
            overflow: 'hidden',
          }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* 返回按钮 - 左上角 */}
          <button
            onClick={() => setShowMoonPhotos(false)}
            style={{
              position: 'absolute',
              top: '30px',
              left: '30px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '25px',
              padding: '12px 20px',
              fontSize: '16px',
              color: '#fff',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              fontFamily: 'PingFang SC, Microsoft YaHei, Arial, sans-serif',
              zIndex: 10,
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
            ← 返回
          </button>

          {/* 标题 */}
          <h2 style={{
            position: 'absolute',
            top: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#fff',
            fontSize: '24px',
            margin: 0,
            textAlign: 'center',
            fontFamily: 'PingFang SC, Microsoft YaHei, Arial, sans-serif',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
            zIndex: 10,
          }}>
            🌙 异地时光 - 思念如月
          </h2>
          
          {/* 照片层叠容器 */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: '100px',
            paddingBottom: '50px',
          }}>
            {moonPhotos.map((photo, index) => {
              const isCurrent = index === currentMoonPhoto;
              const isPrev = index === (currentMoonPhoto - 1 + moonPhotos.length) % moonPhotos.length;
              const isNext = index === (currentMoonPhoto + 1) % moonPhotos.length;
              
              let zIndex = 1;
              let opacity = 0.3;
              let scale = 0.8;
              let translateX = 0;
              let translateY = 0;
              
              if (isCurrent) {
                zIndex = 5;
                opacity = 1;
                scale = 1;
                translateX = 0;
                translateY = 0;
              } else if (isPrev) {
                zIndex = 3;
                opacity = 0.6;
                scale = 0.85;
                translateX = -100;
                translateY = 20;
              } else if (isNext) {
                zIndex = 3;
                opacity = 0.6;
                scale = 0.85;
                translateX = 100;
                translateY = 20;
              } else {
                zIndex = 2;
                opacity = 0.3;
                scale = 0.7;
                translateX = (index < currentMoonPhoto) ? -200 : 200;
                translateY = 40;
              }
              
              return (
                <motion.img
                  key={index}
                  initial={false}
                  animate={{
                    opacity,
                    scale,
                    x: translateX,
                    y: translateY,
                    zIndex,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: 'easeOut',
                  }}
                  src={photo}
                  alt={`异地时光 ${index + 1}`}
                  onClick={() => setCurrentMoonPhoto(index)}
                  style={{
                    position: 'absolute',
                    maxWidth: '80vw',
                    maxHeight: '70vh',
                    objectFit: 'contain',
                    borderRadius: '20px',
                    boxShadow: isCurrent 
                      ? '0 20px 40px rgba(0,0,0,0.8)' 
                      : '0 10px 20px rgba(0,0,0,0.5)',
                    border: isCurrent 
                      ? '3px solid rgba(255, 255, 255, 0.5)' 
                      : '2px solid rgba(255, 255, 255, 0.2)',
                    cursor: isCurrent ? 'default' : 'pointer',
                    userSelect: 'none',
                    touchAction: 'manipulation',
                  }}
                />
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
} 