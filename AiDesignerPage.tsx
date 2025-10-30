/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * AI Designer Page - 黄金逻辑完整版本
 * 包含: MaterialGallery, HistoryPanel, ImageLightbox, 双轨生成系统, 生成与归档
*/
/* tslint:disable */
import React, { useState, useRef } from 'react';
import { uploadMultipleFiles, isValidImageFile } from './cloudinaryService';
import { MaterialGallery } from './components/MaterialGallery';
import { HistoryPanel } from './components/HistoryPanel';
import { ImageLightbox } from './components/ImageLightbox';

interface AiDesignerPageProps {
  onNavigateHome: () => void;
}

// ===== API 配置 =====
const COZE_API_URL = 'https://api.coze.cn/v1/workflow/stream_run';

// API Token（令牌）- 从环境变量读取，如果没有则使用默认值
const COZE_API_TOKEN = import.meta.env.VITE_COZE_API_TOKEN || 'pat_i0sUsjpOUWxH4DWYJUSzBD1fcczdgZMEl5ck3DqJ17oxLuXXbBYEG2mumuE7AyoE';

const WORKFLOW_ID = '7552456285649453102';

// 注意：用户的业务密码（password）由用户在UI中输入，不在这里硬编码

// ===== 颜色选项 =====
const colors = [
  { name: '米白', hex: '#F5F5DC' },
  { name: '浅灰', hex: '#D3D3D3' },
  { name: '深灰', hex: '#696969' },
  { name: '蓝色', hex: '#4682B4' },
  { name: '红色', hex: '#B22222' },
  { name: '绿色', hex: '#228B22' },
  { name: '黄色', hex: '#FFD700' },
];

// ===== 生成项目接口 =====
interface GenerationItem {
  id: string;
  url: string;
  timestamp: string;
  prompt?: string;
}

export const AiDesignerPage: React.FC<AiDesignerPageProps> = ({ onNavigateHome }) => {
  // ========== 状态管理 ==========
  // 核心 up_pic 数组 (黄金逻辑标准1)
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  
  // 材质与参数
  const [selectedMaterial, setSelectedMaterial] = useState<string>(''); // Material ID
  const [selectedColor, setSelectedColor] = useState<string | null>(null); // 允许为 null（未选择状态）
  const [customPrompt, setCustomPrompt] = useState('');
  const [userPassword, setUserPassword] = useState(''); // 用户业务密码（验证权限）
  const [showPassword, setShowPassword] = useState(false);
  
  // 图片上传状态
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 生成状态
  const [isGenerating, setIsGenerating] = useState(false);
  
  // 生成与归档状态
  const [currentGeneration, setCurrentGeneration] = useState<GenerationItem | null>(null);
  const [history, setHistory] = useState<GenerationItem[]>([]);
  
  const [error, setError] = useState<string>('');
  const [streamingMessage, setStreamingMessage] = useState<string>('');

  // Lightbox 状态
  const [lightboxImageUrl, setLightboxImageUrl] = useState<string | null>(null);
  
  // ========== 文件上传处理 (黄金逻辑标准2) ==========
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []) as File[];
    if (files.length === 0) return;

    // 验证文件
    const validFiles = files.filter((file: File) => {
      if (!isValidImageFile(file)) {
        alert(`文件 ${file.name} 格式不支持或太大`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setUploadedFiles(prev => [...prev, ...validFiles]);
    setError('');

    // 创建本地预览
    const newPreviews = validFiles.map((file: File) => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviews]);

    // 立即上传到 Cloudinary
    setIsUploading(true);
    setStreamingMessage('正在上传图片到云端...');
    
    try {
      console.log(`📤 开始上传 ${validFiles.length} 个文件到 Cloudinary...`);
      const urls = await uploadMultipleFiles(validFiles);
      // 黄金逻辑标准2: 直接添加到核心数组
      setUploadedUrls(prev => [...prev, ...urls]);
      console.log('✅ 所有图片上传成功！URLs:', urls);
      setStreamingMessage(`✅ 成功上传 ${urls.length} 张图片！`);
      setTimeout(() => setStreamingMessage(''), 3000);
    } catch (error) {
      console.error('❌ 图片上传失败:', error);
      setError(error instanceof Error ? error.message : '图片上传失败');
      setStreamingMessage('');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    const newPreviews = previewUrls.filter((_, i) => i !== index);
    const newUrls = uploadedUrls.filter((_, i) => i !== index);
    
    setUploadedFiles(newFiles);
    setPreviewUrls(newPreviews);
    setUploadedUrls(newUrls);
  };

  // ========== Coze API 调用 (黄金逻辑标准4 - 核心生成函数) ==========
  const handleGenerate = async (upPicArray?: string[]) => {
    // 双轨逻辑: 决定使用哪个图片数组
    const finalUpPic = upPicArray || uploadedUrls;
    
    if (finalUpPic.length === 0) {
      setError('请先上传家具图片！');
      return;
    }

    // 验证用户密码（业务密码）
    if (!userPassword) {
      setError('请输入您的密钥（验证身份）');
      return;
    }

    setIsGenerating(true);
    setError('');
    setStreamingMessage('');

    try {
      // 构建完整的提示词（使用与预览相同的逻辑）
      const promptParts: string[] = [];
      
      if (selectedMaterial) {
        promptParts.push(`材质：${selectedMaterial}`);
      }
      
      if (selectedColor) {
        promptParts.push(`颜色：${selectedColor}`);
      }
      
      if (customPrompt) {
        promptParts.push(customPrompt);
      }
      
      const fullPrompt = promptParts.length > 0 ? promptParts.join('，') : '默认风格';

      // 调试信息
      console.log('=== 🚀 开始调用 Coze API ===');
      console.log('🔑 API Token (令牌):', COZE_API_TOKEN.substring(0, 15) + '...');
      console.log('🔐 用户密钥 (业务密码):', userPassword ? '已输入' : '未输入');
      console.log('📍 API URL:', COZE_API_URL);
      console.log('🆔 Workflow ID:', WORKFLOW_ID);
      console.log('📝 提示词:', fullPrompt);
      console.log('🖼️ 图片URL:', finalUpPic);

      const requestBody = {
        workflow_id: WORKFLOW_ID,
        parameters: {
          password: userPassword,  // 使用用户输入的业务密码
          prompt: fullPrompt,
          up_pic: finalUpPic,
        }
      };

      console.log('📦 请求体 password:', userPassword);

      const response = await fetch(COZE_API_URL, {
                        method: 'POST',
                        headers: {
          'Authorization': `Bearer ${COZE_API_TOKEN}`,  // 始终使用API Token（令牌）
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(requestBody),
                    });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API错误响应:', errorText);
        throw new Error(`API调用失败 (${response.status}): ${errorText}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let foundImageUrl = false; // 🔑 标志：是否已找到图片URL

      if (!reader) {
        throw new Error('无法读取响应流');
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log('📍 SSE流结束');
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim() || !line.startsWith('data:')) continue;

          try {
            const jsonStr = line.slice(5).trim();
            if (!jsonStr) continue;

            const data = JSON.parse(jsonStr);
            console.log('📦 收到SSE数据 [event=' + (data.event || '无') + ']:', data);
            
            // 处理流式消息
            if (data.event === 'message' && data.message) {
              setStreamingMessage(data.message.content || '生成中...');
            }

            // 🔍 【核心逻辑】多层级提取图片URL
            let imageUrl = '';
            console.log('🔍 开始提取图片URL，数据结构:', {
              hasMessage: !!data.message,
              hasContent: !!(data.message && data.message.content),
              hasTopLevelData: !!data.data,
              hasOutput: !!data.output
            });
            
            // ========== 策略1: 从 content 字段进行【二次JSON解析】==========
            if (data.content) {
              console.log('📄 发现顶层 content 字段:', data.content);
              try {
                const contentData = JSON.parse(data.content);
                console.log('📦 顶层content二次解析成功:', contentData);
                if (contentData.data && typeof contentData.data === 'string' && contentData.data.startsWith('http')) {
                  imageUrl = contentData.data;
                  console.log('🎨✅ [路径1] 从 data.content->contentData.data 提取到URL:', imageUrl);
                }
              } catch (e) {
                console.log('⚠️ 顶层content不是JSON，跳过');
              }
            }
            
            // ========== 策略2: 从 message.content 进行【二次JSON解析】==========
            if (!imageUrl && data.message && data.message.content) {
              console.log('📄 发现 message.content 字段:', data.message.content);
              
              try {
                // 【关键】二次 JSON 解析
                const contentData = JSON.parse(data.message.content);
                console.log('📦 message.content二次解析成功:', contentData);
                
                // 提取 data 字段（多种可能的字段名）
                if (contentData.data && typeof contentData.data === 'string' && contentData.data.startsWith('http')) {
                  imageUrl = contentData.data;
                  console.log('🎨✅ [路径2] 从 message.content->contentData.data 提取到URL:', imageUrl);
                } else if (contentData.output && typeof contentData.output === 'string' && contentData.output.startsWith('http')) {
                  imageUrl = contentData.output;
                  console.log('🎨✅ [路径2] 从 message.content->contentData.output 提取到URL:', imageUrl);
                } else if (contentData.image_url && typeof contentData.image_url === 'string' && contentData.image_url.startsWith('http')) {
                  imageUrl = contentData.image_url;
                  console.log('🎨✅ [路径2] 从 message.content->contentData.image_url 提取到URL:', imageUrl);
                } else if (contentData.url && typeof contentData.url === 'string' && contentData.url.startsWith('http')) {
                  imageUrl = contentData.url;
                  console.log('🎨✅ [路径2] 从 message.content->contentData.url 提取到URL:', imageUrl);
                } else {
                  console.log('⚠️ message.content解析成功，但未找到有效URL字段:', Object.keys(contentData));
                }
              } catch (e) {
                // 不是JSON，尝试直接使用
                console.log('⚠️ message.content不是JSON，尝试直接使用');
                if (typeof data.message.content === 'string' && data.message.content.startsWith('http')) {
                  imageUrl = data.message.content;
                  console.log('🎨✅ [路径2-直接] 直接使用message.content作为URL:', imageUrl);
                }
              }
            }

            // ========== 策略3: 从顶层字段直接提取 ==========
            if (!imageUrl && data.output && typeof data.output === 'string' && data.output.startsWith('http')) {
              imageUrl = data.output;
              console.log('🎨✅ [路径3] 从顶层 data.output 提取到URL:', imageUrl);
            }
            
            if (!imageUrl && data.data && typeof data.data === 'string' && data.data.startsWith('http')) {
              imageUrl = data.data;
              console.log('🎨✅ [路径4] 从顶层 data.data 提取到URL:', imageUrl);
            }
            
            if (!imageUrl && data.image_url && typeof data.image_url === 'string' && data.image_url.startsWith('http')) {
              imageUrl = data.image_url;
              console.log('🎨✅ [路径5] 从顶层 data.image_url 提取到URL:', imageUrl);
            }
            
            if (!imageUrl && data.url && typeof data.url === 'string' && data.url.startsWith('http')) {
              imageUrl = data.url;
              console.log('🎨✅ [路径6] 从顶层 data.url 提取到URL:', imageUrl);
            }

            // ========== 验证标志检查 ==========
            if (data.key1 === '密钥正确' || data.key1 === 'success') {
              console.log('✅ 密钥验证成功:', data.key1);
            }

            // 🎯 【核心功能】如果提取到了图片URL，执行"生成与归档"逻辑
            if (imageUrl && !foundImageUrl) {
              foundImageUrl = true; // 标记已找到
              console.log('');
              console.log('========================================');
              console.log('🎉🎉🎉 【成功】提取到图片URL!');
              console.log('📸 图片URL:', imageUrl);
              console.log('========================================');
              console.log('');
              
              // ==========================================
              // 【第二部分：历史记录归档功能】
              // ==========================================
              
              console.log('🔄 开始执行"生成与归档"逻辑...');
              
              // 📦 步骤A: 归档旧图（如果存在）
                  if (currentGeneration) {
                console.log('');
                console.log('--- 步骤A: 归档旧图 ---');
                console.log('📦 当前主区域有旧图:', currentGeneration.id);
                console.log('📦 旧图URL:', currentGeneration.url);
                console.log('📦 正在将旧图移动到历史记录面板...');
                
                setHistory(prevHistory => {
                  const newHistory = [currentGeneration, ...prevHistory];
                  console.log('✅ 归档成功！当前历史记录数量:', newHistory.length);
                  console.log('📚 历史记录列表:', newHistory.map(item => item.id));
                  return newHistory;
                });
              } else {
                console.log('');
                console.log('--- 步骤A: 无需归档 ---');
                console.log('ℹ️  这是第一次生成，主区域为空，无需归档');
              }
              
              // 🆕 步骤B: 显示新图
              console.log('');
              console.log('--- 步骤B: 显示新图 ---');
              
                  const newId = `Project-${Date.now()}`;
                  const newTimestamp = new Date().toLocaleString('zh-CN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  });
                  
                  const newGeneration: GenerationItem = {
                    id: newId,
                url: imageUrl,
                timestamp: newTimestamp,
                prompt: fullPrompt,
              };
              
              console.log('🆕 新项目ID:', newId);
              console.log('🖼️  新项目URL:', imageUrl);
              console.log('📅 生成时间:', newTimestamp);
              console.log('📝 提示词:', fullPrompt);
              console.log('📊 完整项目对象:', newGeneration);
              console.log('');
              console.log('🔄 正在更新主区域显示...');
              
                  setCurrentGeneration(newGeneration);
                  
              console.log('✅ 主区域已更新为新图！');
              console.log('');
              console.log('========================================');
              console.log('✅✅✅ "生成与归档"逻辑执行完毕！');
              console.log('📊 当前状态:');
              console.log('   - 主区域: 显示新图', newId);
              console.log('   - 历史记录: ' + (currentGeneration ? '包含旧图' : '暂无记录'));
              console.log('========================================');
              console.log('');
              
              setStreamingMessage('✅ 生成成功！');
                  setTimeout(() => setStreamingMessage(''), 3000);
                  
              console.log('✅ UI状态已更新，准备结束SSE处理');
            }
            
            // 兼容完成事件处理
            if (data.event === 'Message.completed' || data.event === 'Done' || data.event === 'done') {
              console.log('📍 收到完成事件:', data.event);
              if (!foundImageUrl) {
                console.warn('⚠️ 完成事件但未找到图片URL，完整数据:', JSON.stringify(data));
              }
            }

            // 处理错误事件
            if (data.event === 'error' || data.error) {
              const errorMsg = data.error || data.message || '生成失败';
              console.error('❌ API返回错误:', errorMsg);
              throw new Error(errorMsg);
            }
          } catch (parseError) {
            console.warn('⚠️ 解析数据块失败:', parseError, '原始行:', line);
          }
        }
        
        // 如果已找到图片URL，可以提前结束
        if (foundImageUrl) {
          console.log('✅ 已找到图片URL，结束SSE读取');
          break;
        }
      }

    } catch (error) {
      console.error('❌ 生成失败:', error);
      setError(error instanceof Error ? error.message : '生成失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

  // ========== 辅助功能 ==========
  const getFinalPrompt = () => {
    const parts: string[] = [];
    
    if (selectedMaterial) {
      parts.push(`材质：${selectedMaterial}`);
    }
    
    if (selectedColor) {
      parts.push(`颜色：${selectedColor}`);
    }
    
    if (customPrompt) {
      parts.push(customPrompt);
    }
    
    return parts.length > 0 ? parts.join('，') : '(未填写任何参数)';
  };

  // ========== 渲染 ==========
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #533483 75%, #6d2266 100%)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* 顶部导航栏 */}
      <header style={{
        padding: '15px 60px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
          <img 
            src="https://img.cdn1.vip/i/68f9ed7813591_1761209720.png" 
            alt="空间计算" 
            style={{ height: '32px', cursor: 'pointer' }}
              onClick={onNavigateHome} 
            />
          <nav style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
            <a href="#" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px', opacity: 0.9 }}>产品 ▼</a>
            <a href="#" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px', opacity: 0.9 }}>价格</a>
            <a href="#" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px', opacity: 0.9 }}>社区 ▼</a>
            <a href="#" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px', opacity: 0.9 }}>学习 ▼</a>
            <a href="#" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px', opacity: 0.9 }}>商务 ▼</a>
            <a href="#" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px', opacity: 0.9 }}>AI ▼</a>
            <a href="#" style={{ 
              color: '#fff', 
              textDecoration: 'none', 
              fontSize: '14px', 
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%)',
              padding: '4px 12px',
              borderRadius: '4px',
              fontWeight: 600,
            }}>
              设计服务 NEW
            </a>
          </nav>
            </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ fontSize: '20px', cursor: 'pointer', opacity: 0.8 }}>🔍</span>
          <span style={{ fontSize: '20px', cursor: 'pointer', opacity: 0.8 }}>🎨</span>
          <span style={{ fontSize: '20px', cursor: 'pointer', opacity: 0.8 }}>✉️</span>
          <span style={{ fontSize: '20px', cursor: 'pointer', opacity: 0.8 }}>👤</span>
          <button style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            padding: '8px 20px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
          }}>
            开始设计 →
            </button>
        </div>
      </header>

      {/* 主标题 */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '50px 0 30px 0',
      }}>
        <img 
          src="https://img.cdn1.vip/i/68f9ed7baa0af_1761209723.png" 
          alt="AI Designer" 
          style={{ maxWidth: '600px', height: 'auto' }}
        />
        </div>

      {/* 主内容区 - 三栏布局 */}
      <div style={{
        display: 'flex',
        gap: '30px',
        padding: '40px 60px',
        maxWidth: '1800px',
        width: '100%',
        margin: '0 auto',
        alignItems: 'stretch',
      }}>
        {/* 左侧控制面板 */}
        <div style={{
          flex: '0 0 480px',
          background: 'rgba(255, 255, 255, 0.98)',
          borderRadius: '24px',
          padding: '40px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}>
          {/* 步骤1：上传图片 */}
          <div>
            <h3 style={{
              fontSize: '18px',
              marginBottom: '15px',
              color: '#333',
            }}>
              <span style={{ fontWeight: 600 }}>步骤 1</span>{' '}
              <span style={{ fontWeight: 400, fontSize: '16px', color: '#999' }}>上传产品图片</span>
            </h3>
            
            <div style={{
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap',
              alignItems: 'flex-start',
            }}>
              {previewUrls.map((url, index) => (
                <div key={index} style={{ position: 'relative' }}>
                  <img
                    src={url}
                    alt={`预览 ${index + 1}`}
                    style={{
                      width: '100px',
                      height: '100px',
                      objectFit: 'cover',
                      borderRadius: '10px',
                      border: '2px solid #667eea',
                    }}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage(index);
                    }}
                    style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: '#ff4444',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                  >
                    ×
                  </button>
          </div>
              ))}

              {uploadedFiles.length === 0 ? (
              <div 
                onClick={handleUploadClick}
                  style={{
                    width: '100%',
                    border: '3px dashed #ddd',
                    borderRadius: '15px',
                    padding: '40px 20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: '#fafafa',
                  }}
                >
                  <div style={{ fontSize: '48px', marginBottom: '10px' }}>📁</div>
                  <div style={{ color: '#666', fontSize: '14px' }}>
                    点击选择文件或拖拽到此处
              </div>
                  <div style={{ color: '#999', fontSize: '12px' }}>
                    支持多图片上传，格式：JPG、PNG、GIF
            </div>
                </div>
              ) : (
                <div
                  onClick={handleUploadClick}
                  style={{
                    width: '100px',
                    height: '100px',
                    border: '3px dashed #ddd',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '36px',
                    color: '#999',
                  }}
                >
                  +
          </div>
                      )}
                    </div>
            
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
              multiple
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
                  </div>

          {/* 步骤2：选择材质（可选） - 材质陈列馆 */}
          <div>
            <h3 style={{
              fontSize: '18px',
              marginBottom: '15px',
              color: '#333',
            }}>
              <span style={{ fontWeight: 600 }}>步骤 2</span>{' '}
              <span style={{ fontWeight: 400, fontSize: '16px', color: '#999' }}>
                选择材质 <span style={{ fontSize: '14px', color: '#bbb' }}>(可选)</span>
              </span>
            </h3>
            
            <MaterialGallery 
              selectedMaterialId={selectedMaterial}
              onMaterialSelect={setSelectedMaterial}
            />
            </div>

          {/* 步骤3：选择颜色（可选） */}
          <div>
            <h3 style={{
              fontSize: '18px',
              marginBottom: '15px',
              color: '#333',
            }}>
              <span style={{ fontWeight: 600 }}>步骤 3</span>{' '}
              <span style={{ fontWeight: 400, fontSize: '16px', color: '#999' }}>
                选择颜色 <span style={{ fontSize: '14px', color: '#bbb' }}>(可选)</span>
              </span>
            </h3>
            
            <div style={{
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap',
            }}>
              {colors.map((color) => (
                <div
                  key={color.hex}
                  onClick={() => {
                    // 如果点击的是已选中的颜色，则取消选择
                    if (selectedColor === color.hex) {
                      setSelectedColor(null);
                    } else {
                      // 否则选中该颜色
                      setSelectedColor(color.hex);
                    }
                  }}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: color.hex,
                    cursor: 'pointer',
                    border: selectedColor === color.hex ? '2px solid #667eea' : '1px solid #ddd',
                    boxShadow: selectedColor === color.hex ? '0 2px 8px rgba(102, 126, 234, 0.3)' : 'none',
                    transition: 'all 0.2s ease',
                  }}
                  title={color.name}
                />
                ))}
              </div>
            
            {/* 提示文字 */}
            <div style={{
              marginTop: '10px',
              fontSize: '12px',
              color: '#999',
            }}>
              {selectedColor ? '💡 再次点击可取消选择' : '💡 点击颜色块进行选择'}
              </div>
            </div>

          {/* 步骤4：输入提示词 */}
          <div>
            <h3 style={{
              fontSize: '18px',
              marginBottom: '15px',
              color: '#333',
            }}>
              <span style={{ fontWeight: 600 }}>步骤 4</span>{' '}
              <span style={{ fontWeight: 400, fontSize: '16px', color: '#999' }}>输入提示词</span>
            </h3>
            
              <textarea 
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="在这里输入文字描述可快速修改效果..."
              style={{
                width: '100%',
                minHeight: '80px',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid #ddd',
                fontSize: '14px',
                resize: 'vertical',
                outline: 'none',
              }}
            />

            {/* ✅ 最终提示词预览 */}
            <div style={{
              marginTop: '10px',
              padding: '12px',
              background: '#f8f9fa',
              borderRadius: '8px',
              fontSize: '13px',
              color: '#666',
            }}>
              <div style={{ fontWeight: 600, marginBottom: '5px', color: '#333' }}>
                🔍 最终提示词预览：
              </div>
              <div style={{ color: '#667eea' }}>
                {getFinalPrompt()}
              </div>
            </div>
            </div>

          {/* 密钥输入（业务密码 - 验证用户权限） */}
          <div>
            <h3 style={{
              fontSize: '16px',
              fontWeight: 600,
              marginBottom: '10px',
              color: '#333',
            }}>
              密钥 <span style={{ fontWeight: 'normal', fontSize: '14px', color: '#999' }}>验证您的生图权限</span>
            </h3>
            
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                placeholder="请输入您的密钥"
                style={{
                  width: '100%',
                  padding: '12px 40px 12px 12px',
                  borderRadius: '10px',
                  border: '1px solid #ddd',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            <button 
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '18px',
                }}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
            </div>
            
            {/* 提示文字 */}
            <div style={{
              marginTop: '8px',
              fontSize: '12px',
              color: '#999',
            }}>
              💡 这是您的业务密码，用于验证生图权限
            </div>
          </div>

          {/* 立即生成按钮 (黄金逻辑标准4 - 轨道B) */}
          <button
            onClick={() => {
              console.log('🚀 ===== 【轨道B】常规生成流程启动 =====');
              console.log('📦 使用步骤1上传的图片:', uploadedUrls);
              console.log('📊 图片数量:', uploadedUrls.length);
              console.log('🔐 用户密钥:', userPassword ? '已输入' : '未输入');
              handleGenerate(); // 不传参数，使用uploadedUrls
            }}
            disabled={isGenerating || isUploading || uploadedUrls.length === 0 || !userPassword}
            style={{
              width: '100%',
              padding: '15px',
              background: (isGenerating || isUploading || !userPassword) ? '#999' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '25px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: (isGenerating || isUploading || !userPassword) ? 'not-allowed' : 'pointer',
            }}
          >
            {isGenerating ? '生成中...' : isUploading ? '上传中...' : !userPassword ? '请输入密钥' : '立即生成 →'}
          </button>

          {error && (
            <div style={{
              padding: '12px',
              background: '#fee',
              borderRadius: '8px',
              color: '#c33',
              fontSize: '14px',
            }}>
              ❌ {error}
            </div>
          )}

          {streamingMessage && (
            <div style={{
              padding: '12px',
              background: '#e8f5e9',
              borderRadius: '8px',
              color: '#2e7d32',
              fontSize: '14px',
            }}>
              {streamingMessage}
            </div>
          )}
          </div>

        {/* 中间结果展示区 */}
          <div style={{
            flex: '1',
            background: 'rgba(255, 255, 255, 0.98)',
            borderRadius: '24px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {currentGeneration ? (
            <>
              {/* 项目信息卡片 */}
                <div style={{
                  padding: '30px 40px',
                  borderBottom: '2px solid #f0f0f0',
                background: '#fafafa',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <div>
                      <div style={{
                    fontSize: '14px',
                        color: '#999',
                        marginBottom: '6px',
                      }}>
                        当前项目
                </div>
                      <div style={{
                        fontSize: '20px',
                    fontWeight: 600,
                        color: '#333',
                        fontFamily: 'monospace',
                      }}>
                        {currentGeneration.id}
              </div>
                </div>
                    <div style={{
                      textAlign: 'right',
                    }}>
                      <div style={{
                    fontSize: '14px',
                        color: '#999',
                        marginBottom: '6px',
                      }}>
                        生成时间
                      </div>
                      <div style={{
                    fontSize: '14px',
                        color: '#666',
                      }}>
                        {currentGeneration.timestamp}
                    </div>
                  </div>
                  </div>

              {/* 大图显示 */}
                <div style={{
                flex: '1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                padding: '60px',
                }}>
                  <img
                    src={currentGeneration.url}
                    alt={currentGeneration.id}
                    onClick={() => setLightboxImageUrl(currentGeneration.url)}
                    style={{
                      maxWidth: '100%',
                    maxHeight: '100%',
                      borderRadius: '15px',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                    cursor: 'pointer',
                    }}
                  />
                            </div>
            </>
            ) : (
              <div style={{
              flex: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                  textAlign: 'center',
                  color: '#999',
              padding: '80px',
            }}>
              <div>
                <div style={{ fontSize: '80px', marginBottom: '20px', opacity: 0.3 }}>
                    🎨
                    </div>
                <div style={{ fontSize: '18px', color: '#666' }}>
                    上传图片并点击生成，查看AI设计效果
                </div>
                <div style={{ fontSize: '14px', color: '#999', marginTop: '10px' }}>
                    最新生成的项目将在这里显示
                  </div>
                </div>
              </div>
            )}
        </div>

        {/* 右侧历史记录面板 */}
        <HistoryPanel 
          history={history}
          onImageClick={(url) => setLightboxImageUrl(url)}
        />
          </div>

      {/* Footer - 完整版本 */}
      <footer style={{
        background: 'rgba(0, 0, 0, 0.6)',
        padding: '60px 80px 20px 80px',
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: '13px',
        marginTop: '40px',
      }}>
        {/* 主要内容区域 - 5列布局 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '40px',
          marginBottom: '50px',
        }}>
          {/* 第一列：产品 & 服务 */}
          <div>
            <h4 style={{
              color: 'white',
              fontSize: '15px',
              fontWeight: 600,
              marginBottom: '20px',
            }}>产品 & 服务</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '12px' }}>
                <a href="#" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', transition: 'color 0.3s' }}>
                  AI设计软件
                </a>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <a href="#" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', transition: 'color 0.3s' }}>
                  设计案例
                </a>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <a href="#" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', transition: 'color 0.3s' }}>
                  模型库
                </a>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <a href="#" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', transition: 'color 0.3s' }}>
                  创意渲染器
                </a>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <a href="#" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', transition: 'color 0.3s' }}>
                  企业服务
                </a>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <a href="#" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', transition: 'color 0.3s' }}>
                  3D建模服务
                </a>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <a href="#" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', transition: 'color 0.3s' }}>
                  定制化解决方案
                </a>
              </li>
            </ul>
          </div>

          {/* 第二列：解决方案 */}
          <div>
            <h4 style={{
              color: 'white',
              fontSize: '15px',
              fontWeight: 600,
              marginBottom: '20px',
            }}>解决方案</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '12px' }}>
                <a href="#" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', transition: 'color 0.3s' }}>
                  室内设计师解决方案
                </a>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <a href="#" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', transition: 'color 0.3s' }}>
                  品牌与电商解决方案
                </a>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <a href="#" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', transition: 'color 0.3s' }}>
                  教育与科研合作
                </a>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <a href="#" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', transition: 'color 0.3s' }}>
                  个人用户与爱好者
                </a>
              </li>
            </ul>
          </div>

          {/* 第三列：为什么选择空间计算 */}
          <div>
            <h4 style={{
              color: 'white',
              fontSize: '15px',
              fontWeight: 600,
              marginBottom: '20px',
            }}>为什么选择空间计算</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '12px' }}>
                <a href="#" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', transition: 'color 0.3s' }}>
                  空间计算 vs 传统渲染软件
                </a>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <a href="#" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', transition: 'color 0.3s' }}>
                  空间计算 vs 人工设计流程
                </a>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <a href="#" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', transition: 'color 0.3s' }}>
                  核心技术优势
                </a>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <a href="#" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', transition: 'color 0.3s' }}>
                  客户成功案例
                </a>
              </li>
            </ul>
          </div>

          {/* 第四列：社区 */}
          <div>
            <h4 style={{
              color: 'white',
              fontSize: '15px',
              fontWeight: 600,
              marginBottom: '20px',
            }}>社区</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '12px' }}>
                <a href="#" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', transition: 'color 0.3s' }}>
                  灵感画廊
                </a>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <a href="#" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', transition: 'color 0.3s' }}>
                  学习中心
                </a>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <a href="#" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', transition: 'color 0.3s' }}>
                  开发者论坛
                </a>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <a href="#" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', transition: 'color 0.3s' }}>
                  视频教程
                </a>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <a href="#" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', transition: 'color 0.3s' }}>
                  合作者计划
                </a>
              </li>
            </ul>
          </div>

          {/* 第五列：下载 */}
          <div>
            <h4 style={{
              color: 'white',
              fontSize: '15px',
              fontWeight: 600,
              marginBottom: '20px',
            }}>下载</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '12px' }}>
                <a href="#" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', transition: 'color 0.3s' }}>
                  空间计算 APP
                </a>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <a href="#" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', transition: 'color 0.3s' }}>
                  iOS版 APP
                </a>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <a href="#" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', transition: 'color 0.3s' }}>
                  安卓版 APP
                </a>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <a href="#" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', transition: 'color 0.3s' }}>
                  Windows 客户端
                </a>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <a href="#" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', transition: 'color 0.3s' }}>
                  Mac 客户端
                </a>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <a href="#" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', transition: 'color 0.3s' }}>
                  插件下载
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* 底部版权和地址信息 */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
            © 2024 广东省空间计算科技集团有限公司. All Rights Reserved.
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)' }}>
            地址：佛山市南海区大沥镇毅贤路5号广佛智城（六期）天街4号楼3层第150301A号
          </div>
        </div>
      </footer>

      {/* Image Lightbox */}
      {lightboxImageUrl && (
      <ImageLightbox 
        imageUrl={lightboxImageUrl}
        onClose={() => setLightboxImageUrl(null)}
      />
      )}
    </div>
  );
};
