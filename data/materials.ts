/**
 * 材质库数据 - 前端本地数据库
 * 包含所有可用材质的信息
 */

export interface Material {
  category: string;
  material_id: string;
  display_name: string;
  image_url: string;
}

export const materialLibrary: Material[] = [
  // 织物类
  { category: '织物', material_id: 'Fabric001', display_name: 'FabricCanvas001_Cube', image_url: 'https://img.cdn1.vip/i/68fb3d46d48b0_1761295686.png' },
  { category: '织物', material_id: 'Fabric002', display_name: 'FabricCarpet001_cube', image_url: 'https://img.cdn1.vip/i/68fb3d8aba9f4_1761295754.png' },
  { category: '织物', material_id: 'Fabric003', display_name: 'FabricCarpetFine001_cube', image_url: 'https://img.cdn1.vip/i/68fb3db690284_1761295798.png' },
  
  // 棉质类
  { category: '棉质', material_id: 'Cotton001', display_name: 'FabricCotton003_cube', image_url: 'https://img.cdn1.vip/i/68fb3e03509dd_1761295875.png' },
  
  // 牛仔布料类
  { category: '牛仔布料', material_id: 'Denim001', display_name: 'FabricDenim002_Cube', image_url: 'https://img.cdn1.vip/i/68fb3e3da1cde_1761295933.png' },
  { category: '牛仔布料', material_id: 'Denim002', display_name: 'FabricDenim003_cube', image_url: 'https://img.cdn1.vip/i/68fb3e592201a_1761295961.png' },
  
  // 皮革类
  { category: '皮革', material_id: 'Leather001', display_name: 'FabricLeather001_cube', image_url: 'https://img.cdn1.vip/i/68fb3e8796f54_1761296007.png' },
  { category: '皮革', material_id: 'Leather002', display_name: 'FabricLeatherBlack001_cube', image_url: 'https://img.cdn1.vip/i/68fb3e923bd3f_1761296018.png' },
  
  // 褶皱织物类
  { category: '褶皱织物', material_id: 'Wrinkled001', display_name: 'FabricWrinkled005_Cube', image_url: 'https://img.cdn1.vip/i/68fb3f0a78edd_1761296138.png' },
];

/**
 * 获取所有材质分类
 */
export const getMaterialCategories = (): string[] => {
  const categories = [...new Set(materialLibrary.map(m => m.category))];
  return categories;
};

/**
 * 根据分类获取材质列表
 */
export const getMaterialsByCategory = (category: string): Material[] => {
  return materialLibrary.filter(m => m.category === category);
};

/**
 * 根据 material_id 获取材质信息
 */
export const getMaterialById = (materialId: string): Material | undefined => {
  return materialLibrary.find(m => m.material_id === materialId);
};









