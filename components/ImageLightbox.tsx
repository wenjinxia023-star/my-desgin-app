/**
 * 图片放大预览组件 (Lightbox)
 * 点击图片或背景关闭
 */

import React from 'react';

interface ImageLightboxProps {
  imageUrl: string | null;
  onClose: () => void;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({ imageUrl, onClose }) => {
  // 如果没有图片 URL，不渲染任何内容
  if (!imageUrl) {
    return null;
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        cursor: 'zoom-out',
        padding: '40px',
      }}
    >
      {/* 关闭提示 */}
      <div
        style={{
          position: 'absolute',
          top: '30px',
          right: '30px',
          color: 'white',
          fontSize: '36px',
          fontWeight: 300,
          cursor: 'pointer',
          userSelect: 'none',
          transition: 'transform 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        ×
      </div>

      {/* 提示文字 */}
      <div
        style={{
          position: 'absolute',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '14px',
          userSelect: 'none',
        }}
      >
        点击任意位置关闭
      </div>

      {/* 大图显示 */}
      <img
        src={imageUrl}
        alt="放大预览"
        onClick={onClose}
        style={{
          maxWidth: '90vw',
          maxHeight: '90vh',
          objectFit: 'contain',
          borderRadius: '8px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
          cursor: 'zoom-out',
        }}
      />
    </div>
  );
};









