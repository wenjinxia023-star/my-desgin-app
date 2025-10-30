/**
 * 材质预览弹窗组件
 * 类似 ImageLightbox，用于放大查看材质细节
 */

import React from 'react';
import { Material } from '../data/materials';

interface MaterialPreviewModalProps {
  material: Material | null;
  onClose: () => void;
  onSelect: () => void; // 智能切换：选定/取消选择
  isSelected: boolean;
}

export const MaterialPreviewModal: React.FC<MaterialPreviewModalProps> = ({ 
  material, 
  onClose,
  onSelect,
  isSelected
}) => {
  // 如果没有材质数据，不渲染
  if (!material) {
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
        cursor: 'pointer',
        padding: '40px',
      }}
    >
      {/* 关闭按钮 */}
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
          zIndex: 10000,
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

      {/* 白色容器框 */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: '20px',
          padding: '40px',
          maxWidth: '600px',
          width: '100%',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
          cursor: 'default',
          position: 'relative',
        }}
      >
        {/* 材质信息头部 */}
        <div style={{
          marginBottom: '30px',
        }}>
          <div style={{
            fontSize: '12px',
            color: '#999',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '8px',
          }}>
            {material.category}
          </div>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 700,
            color: '#333',
            margin: 0,
            fontFamily: 'monospace',
          }}>
            {material.display_name}
          </h2>
          <div style={{
            fontSize: '14px',
            color: '#666',
            marginTop: '5px',
          }}>
            ID: {material.material_id}
          </div>
        </div>

        {/* 材质大图 */}
        <div style={{
          width: '100%',
          height: '400px',
          borderRadius: '15px',
          overflow: 'hidden',
          marginBottom: '30px',
          border: '2px solid #f0f0f0',
        }}>
          <img
            src={material.image_url}
            alt={material.display_name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </div>

        {/* 操作按钮 */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}>
          {/* 【智能切换按钮】选定/取消选择 */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(); // 切换选择状态
              onClose(); // 操作后关闭灯箱
            }}
            style={{
              width: '100%',
              padding: '18px',
              borderRadius: '12px',
              border: 'none',
              background: isSelected
                ? 'linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)' // 已选中：绿色渐变
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // 未选中：紫色渐变
              color: 'white',
              fontSize: '18px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: isSelected
                ? '0 6px 20px rgba(76, 175, 80, 0.4)'
                : '0 6px 20px rgba(102, 126, 234, 0.4)',
              letterSpacing: '0.5px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = isSelected
                ? '0 8px 25px rgba(76, 175, 80, 0.6)'
                : '0 8px 25px rgba(102, 126, 234, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = isSelected
                ? '0 6px 20px rgba(76, 175, 80, 0.4)'
                : '0 6px 20px rgba(102, 126, 234, 0.4)';
            }}
          >
            {isSelected ? '✔ 已选定 - 点击取消' : '选定此材质'}
          </button>

          {/* 关闭按钮 */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '10px',
              border: '2px solid #e0e0e0',
              background: 'white',
              color: '#666',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#667eea';
              e.currentTarget.style.color = '#667eea';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e0e0e0';
              e.currentTarget.style.color = '#666';
            }}
          >
            关闭
          </button>
        </div>

        {/* 底部提示 */}
        <div style={{
          marginTop: '20px',
          textAlign: 'center',
          fontSize: '13px',
          color: '#999',
          lineHeight: '1.6',
        }}>
          {isSelected ? (
            <>
              <div style={{ marginBottom: '5px', color: '#4caf50', fontWeight: 600 }}>
                ✔ 此材质已选定
              </div>
              <div style={{ fontSize: '12px', color: '#bbb' }}>
                💡 点击按钮可取消选择，或点击"立即生成"开始设计
              </div>
            </>
          ) : (
            <>
              <div style={{ marginBottom: '5px' }}>
                💡 点击"选定此材质"将其标记为当前材质
              </div>
              <div style={{ fontSize: '12px', color: '#bbb' }}>
                选定后可在左侧步骤中使用此材质生成设计
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

