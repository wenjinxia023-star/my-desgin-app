/**
 * 材质陈列馆组件
 * 悬停滑动轮播交互
 */

import React, { useState, useRef } from 'react';
import { materialLibrary, getMaterialCategories, getMaterialsByCategory, Material } from '../data/materials';
import { MaterialPreviewModal } from './MaterialPreviewModal';

interface MaterialGalleryProps {
  selectedMaterialId: string;
  onMaterialSelect: (materialId: string) => void;
}

export const MaterialGallery: React.FC<MaterialGalleryProps> = ({ 
  selectedMaterialId, 
  onMaterialSelect
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('织物');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  
  // 【新增】预览模态框状态
  const [previewMaterial, setPreviewMaterial] = useState<Material | null>(null);

  const categories = getMaterialCategories();
  const currentMaterials = getMaterialsByCategory(activeCategory);

  // 处理材质卡片点击（打开预览）
  const handleMaterialClick = (material: Material) => {
    // 如果不是拖拽，则打开预览
    if (!isDragging) {
      setPreviewMaterial(material);
    }
  };

  // 处理材质选择/取消
  const handleMaterialSelect = () => {
    if (!previewMaterial) return;
    
    if (selectedMaterialId === previewMaterial.material_id) {
      // 取消选择
      onMaterialSelect('');
    } else {
      // 选择新材质
      onMaterialSelect(previewMaterial.material_id);
    }
  };

  // 关闭预览
  const handleClosePreview = () => {
    setPreviewMaterial(null);
  };

  // 鼠标拖拽滚动
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollContainerRef.current?.offsetLeft || 0));
    setScrollLeft(scrollContainerRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (scrollContainerRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2; // 滚动速度
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  return (
    <div style={{
      width: '100%',
    }}>
      {/* 分类导航标签 */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '20px',
        flexWrap: 'wrap',
      }}>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            style={{
              padding: '10px 20px',
              borderRadius: '20px',
              border: activeCategory === category ? '2px solid #667eea' : '2px solid #e0e0e0',
              background: activeCategory === category ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#fff',
              color: activeCategory === category ? '#fff' : '#666',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: activeCategory === category ? '0 4px 15px rgba(102, 126, 234, 0.3)' : 'none',
            }}
            onMouseEnter={(e) => {
              if (activeCategory !== category) {
                e.currentTarget.style.borderColor = '#667eea';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeCategory !== category) {
                e.currentTarget.style.borderColor = '#e0e0e0';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            {category}
          </button>
        ))}
      </div>

      {/* 材质卡片轮播容器 */}
      <div style={{
        position: 'relative',
        width: '100%',
      }}>
        {/* 左侧渐变遮罩 */}
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '60px',
          background: 'linear-gradient(to right, rgba(255,255,255,0.95), transparent)',
          zIndex: 2,
          pointerEvents: 'none',
        }} />

        {/* 右侧渐变遮罩 */}
        <div style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '60px',
          background: 'linear-gradient(to left, rgba(255,255,255,0.95), transparent)',
          zIndex: 2,
          pointerEvents: 'none',
        }} />

        {/* 滚动容器 */}
        <div
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          style={{
            display: 'flex',
            gap: '15px',
            overflowX: 'auto',
            overflowY: 'hidden',
            padding: '10px 5px 20px 5px',
            cursor: isDragging ? 'grabbing' : 'grab',
            scrollBehavior: isDragging ? 'auto' : 'smooth',
            // 隐藏滚动条
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none', // IE and Edge
          }}
          className="material-scroll-container"
        >
          {currentMaterials.map((material) => {
            const isSelected = selectedMaterialId === material.material_id;
            
            return (
              <div
                key={material.material_id}
                onClick={() => handleMaterialClick(material)}
                style={{
                  flex: '0 0 120px',
                  width: '120px',
                  height: '140px',
                  position: 'relative',
                  borderRadius: '15px',
                  overflow: 'hidden',
                  border: isSelected ? '3px solid #667eea' : '2px solid #e0e0e0',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: isSelected 
                    ? '0 8px 25px rgba(102, 126, 234, 0.4)' 
                    : '0 4px 12px rgba(0, 0, 0, 0.1)',
                  transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                  userSelect: 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.transform = 'scale(1.05) translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                  }
                }}
              >
                {/* 材质图片 */}
                <img
                  src={material.image_url}
                  alt={material.display_name}
                  draggable="false"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />

                {/* 选中标记 */}
                {isSelected && (
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: '#667eea',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                  }}>
                    ✓
                  </div>
                )}

                {/* 材质名称悬浮层 */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                  padding: '30px 10px 10px 10px',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: 500,
                  textAlign: 'center',
                  pointerEvents: 'none',
                }}>
                  {material.display_name}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 提示文字 */}
      <div style={{
        marginTop: '15px',
        textAlign: 'center',
        fontSize: '13px',
        color: '#999',
      }}>
        💡 {isDragging ? '松开鼠标停止滑动' : '点击材质卡片查看大图，拖拽浏览更多'}
      </div>

      {/* 材质预览模态框 */}
      <MaterialPreviewModal 
        material={previewMaterial}
        onClose={handleClosePreview}
        onSelect={handleMaterialSelect}
        isSelected={previewMaterial ? selectedMaterialId === previewMaterial.material_id : false}
      />

      <style>{`
        .material-scroll-container::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

