/**
 * 历史记录面板组件
 * 只读展示已归档的历史项目
 */

import React from 'react';

interface HistoryItem {
  id: string;
  url: string;
  timestamp: string;
}

interface HistoryPanelProps {
  history: HistoryItem[];  // 历史项目数组
  onImageClick?: (url: string) => void;  // 可选：点击图片的回调
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ 
  history,
  onImageClick
}) => {
  if (history.length === 0) {
    return (
      <div style={{
        width: '280px',
        background: 'rgba(255, 255, 255, 0.98)',
        borderRadius: '24px',
        padding: '30px 20px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
      }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: 600,
          color: '#333',
          margin: 0,
          paddingBottom: '15px',
          borderBottom: '2px solid #f0f0f0',
        }}>
          📜 历史记录
        </h3>
        
        <div style={{
          textAlign: 'center',
          color: '#999',
          padding: '40px 20px',
          fontSize: '14px',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '15px', opacity: 0.3 }}>
            🖼️
          </div>
          <div>暂无历史记录</div>
          <div style={{ fontSize: '12px', marginTop: '8px', color: '#bbb' }}>
            生成的图片将显示在这里
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      width: '280px',
      background: 'rgba(255, 255, 255, 0.98)',
      borderRadius: '24px',
      padding: '30px 20px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
      maxHeight: '90vh',
      overflow: 'hidden',
    }}>
      {/* 标题 */}
      <h3 style={{
        fontSize: '18px',
        fontWeight: 600,
        color: '#333',
        margin: 0,
        paddingBottom: '15px',
        borderBottom: '2px solid #f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span>📜 历史记录</span>
        <span style={{
          fontSize: '12px',
          fontWeight: 400,
          color: '#999',
          background: '#f5f5f5',
          padding: '4px 10px',
          borderRadius: '12px',
        }}>
          {history.length} 项
        </span>
      </h3>

      {/* 历史项列表 */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        overflowY: 'auto',
        overflowX: 'hidden',
        paddingRight: '5px',
      }}>
        {history.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            style={{
              position: 'relative',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '2px solid #e0e0e0',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              background: '#fff',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
            }}
          >
            {/* 图片缩略图 - 可点击放大 */}
            <img
              src={item.url}
              alt={item.id}
              onClick={() => onImageClick && onImageClick(item.url)}
              style={{
                width: '100%',
                height: '140px',
                objectFit: 'cover',
                display: 'block',
                cursor: onImageClick ? 'zoom-in' : 'default',
              }}
            />
            
            {/* 项目信息卡片 */}
            <div style={{
              padding: '12px',
              background: '#fafafa',
              borderTop: '1px solid #e0e0e0',
            }}>
              {/* 项目 ID */}
              <div style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#333',
                marginBottom: '6px',
                fontFamily: 'monospace',
              }}>
                {item.id}
              </div>
              
              {/* 时间戳 */}
              <div style={{
                fontSize: '11px',
                color: '#999',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}>
                <span>🕐</span>
                <span>{item.timestamp}</span>
              </div>
            </div>
            
            {/* 归档标记 */}
            <div style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              background: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '6px',
              fontSize: '10px',
              fontWeight: 600,
            }}>
              已归档
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

