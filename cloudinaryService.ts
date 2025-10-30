/**
 * Cloudinary 无签名上传服务
 * 使用 unsigned upload preset 进行图片上传
 */

// ===== Cloudinary 配置 =====
const CLOUDINARY_CLOUD_NAME = 'dxt46m9a0';
const CLOUDINARY_UPLOAD_PRESET = 'ml_default';
const CLOUDINARY_API_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

// ===== 文件验证 =====
export function isValidImageFile(file: File): boolean {
  // 检查文件类型
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    console.error('❌ 文件类型不支持:', file.type);
    return false;
  }

  // 检查文件大小 (最大 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    console.error('❌ 文件太大:', (file.size / 1024 / 1024).toFixed(2) + 'MB');
    return false;
  }

  return true;
}

// ===== 单个文件上传 =====
export async function uploadFilesToCloud(file: File): Promise<string> {
  if (!isValidImageFile(file)) {
    throw new Error(`文件验证失败: ${file.name}`);
  }

  const formData = new FormData();
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('file', file);

  console.log('=== 📤 开始上传到 Cloudinary ===');
  console.log('文件名:', file.name);
  console.log('文件大小:', (file.size / 1024).toFixed(2) + 'KB');
  console.log('API URL:', CLOUDINARY_API_URL);

  try {
    // 设置超时控制
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30秒超时

    const response = await fetch(CLOUDINARY_API_URL, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Cloudinary 响应错误:', errorText);
      throw new Error(`上传失败 (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Cloudinary 响应:', data);

    if (!data.secure_url) {
      throw new Error('上传成功但未返回图片 URL');
    }

    console.log('✅ Cloudinary 上传成功！');
    console.log('📸 图片 URL:', data.secure_url);

    return data.secure_url;

  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('上传超时：网络连接太慢或不稳定，请重试');
      } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        throw new Error('网络连接失败：无法连接到 Cloudinary 服务器，请检查网络连接');
      } else {
        throw new Error(`上传失败: ${error.message}`);
      }
    } else {
      throw new Error('上传失败: 未知错误');
    }
  }
}

// ===== 多个文件上传 =====
export async function uploadMultipleFiles(files: File[]): Promise<string[]> {
  console.log('=== 📤 批量上传 ===');
  console.log('文件数量:', files.length);

  const uploadPromises = files.map((file, index) => {
    console.log(`开始上传文件 ${index + 1}/${files.length}: ${file.name}`);
    return uploadFilesToCloud(file);
  });

  try {
    const urls = await Promise.all(uploadPromises);
    console.log('✅ 所有文件上传成功！');
    console.log('📸 图片 URLs:', urls);
    return urls;
  } catch (error) {
    console.error('❌ 批量上传失败:', error);
    throw error;
  }
}
