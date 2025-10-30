/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
/* tslint:disable */
import React from 'react';

interface PricingPageProps {
  onNavigateHome: () => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onNavigateHome }) => {
  const navigateToAiDesigner = () => {
    // 这里可以添加导航到AI设计页面的逻辑
    console.log('Navigate to AI Designer');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - 复用AI Designer页面的导航栏样式 */}
      <header className="relative z-20 bg-black text-white">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <img 
            src="https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAECOn9ozleo0tM7DPF7sr591ApAntiEDAAC4iEAAtUHcVaRqaXTEvSnuTYE.png" 
            alt="空间计算 Logo" 
            className="h-8 cursor-pointer" 
            onClick={onNavigateHome}
          />
          <div className="flex items-center space-x-8">
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigateHome(); }} className="hover:text-blue-400 transition-colors">首页</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigateToAiDesigner(); }} className="hover:text-blue-400 transition-colors">AI 设计</a>
            <a href="#" className="hover:text-blue-400 transition-colors">产品</a>
            <a href="#" className="hover:text-blue-400 transition-colors">联系我们</a>
            <button
              onClick={navigateToAiDesigner}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition-colors">
              开始设计
            </button>
          </div>
        </nav>
      </header>

      {/* Autumn Vibes Banner */}
      <section className="relative bg-gradient-to-r from-orange-200 via-orange-100 to-yellow-100 py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <h1 className="text-4xl font-bold text-orange-800 mr-8">
              AUTUMN <span className="text-orange-600">VIBES</span>
              <span className="text-red-600 text-2xl ml-2" style={{ fontFamily: 'cursive' }}>Sale</span>
            </h1>
            <div className="text-orange-700">
              <span className="text-lg">欢庆秋季，尽享钜惠</span>
              <div className="flex items-center space-x-2 mt-2">
                <div className="bg-white px-3 py-1 rounded text-lg font-bold text-orange-800">11</div>
                <span className="text-2xl">:</span>
                <div className="bg-white px-2 py-1 rounded text-lg font-bold text-orange-800">03</div>
                <span>:</span>
                <div className="bg-white px-2 py-1 rounded text-lg font-bold text-orange-800">36</div>
                <span>:</span>
                <div className="bg-white px-2 py-1 rounded text-lg font-bold text-orange-800">11</div>
              </div>
            </div>
          </div>
          
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-4 right-4 opacity-70">
          <div className="text-6xl">🍂</div>
        </div>
        <div className="absolute bottom-4 left-4 opacity-70">
          <div className="text-4xl">🎃</div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex items-center mb-12">
            <span className="inline-block w-2 h-8 bg-red-500 mr-4"></span>
            <h2 className="text-3xl font-bold text-gray-800">我们的套餐</h2>
            <div className="ml-8 flex items-center space-x-4">
              <span className="bg-orange-400 text-white px-3 py-1 rounded text-sm">升级到：AUTUMN</span>
              <span className="bg-orange-500 text-white px-3 py-1 rounded text-sm">复制</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Basic Plan */}
            <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Basic</h3>
              <p className="text-gray-600 mb-4">基础版，适合个人用户</p>
              <div className="mb-6">
                <span className="text-3xl font-bold text-gray-800">免费</span>
              </div>
              <button className="w-full bg-white text-gray-800 font-bold py-3 px-6 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors mb-6">
                开始免费设计
              </button>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>用户2次免费AI出图</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>基础图片编辑功能</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>社区访问权限</span>
                </li>
              </ul>
            </div>

            {/* Pro Plan - with AUTUMN badge */}
            <div className="bg-white rounded-lg p-8 border border-gray-200 relative shadow-lg">
              {/* AUTUMN Badge */}
              <div className="absolute -top-3 right-4 bg-orange-400 text-white px-3 py-1 rounded-full text-xs font-bold">
                AUTUMN
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">个人</h3>
              <p className="text-gray-600 mb-4">专为个人创作者设计</p>
              <div className="mb-6">
                <span className="text-3xl font-bold text-gray-800">¥100</span>
                <span className="text-gray-600 ml-1">/月</span>
              </div>
              <button className="w-full bg-black text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors mb-6">
                立即购买
              </button>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>每月300张AI出图额度</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>包含所有基础版功能</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>高级图片编辑功能</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>优先队列处理</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>商业使用授权</span>
                </li>
              </ul>
            </div>

            {/* Team Plan */}
            <div className="bg-white rounded-lg p-8 border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">团队</h3>
              <p className="text-gray-600 mb-4">团队协作的理想选择</p>
              <div className="mb-6">
                <span className="text-3xl font-bold text-gray-800">¥500</span>
                <span className="text-gray-600 ml-1 text-sm">/月</span>
              </div>
              <button className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors mb-6">
                立即购买
              </button>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>每月2500张AI出图额度</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>包含所有个人版权益</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>多用户协作空间（最多5人）</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>专属客户支持</span>
                </li>
              </ul>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-lg p-8 border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">企业</h3>
              <p className="text-gray-600 mb-4">为企业量身定制</p>
              <div className="mb-6">
                <span className="text-2xl font-bold text-gray-800">定制价格</span>
              </div>
              <button className="w-full bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors mb-6">
                联系我们
              </button>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>软件私有化部署或永久授权</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>无限出图额度</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>专属技术支持与培训</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>定制化功能开发</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>年度维护服务</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-gray-400 py-16 text-sm">
        <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-8">
          <div>
            <h4 className="font-bold text-white mb-4">产品 & 服务</h4>
            <ul>
              <li className="mb-2"><a href="#" className="hover:text-white transition-colors">AI设计软件</a></li>
              <li className="mb-2"><a href="#" className="hover:text-white transition-colors">设计案例</a></li>
              <li className="mb-2"><a href="#" className="hover:text-white transition-colors">模型库</a></li>
              <li className="mb-2"><a href="#" className="hover:text-white transition-colors">创意渲染器</a></li>
              <li className="mb-2"><a href="#" className="hover:text-white transition-colors">企业服务</a></li>
              <li className="mb-2"><a href="#" className="hover:text-white transition-colors">3D建模服务</a></li>
              <li className="mb-2"><a href="#" className="hover:text-white transition-colors">定制化解决方案</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">解决方案</h4>
            <ul>
              <li className="mb-2"><a href="#" className="hover:text-white transition-colors">室内设计师解决方案</a></li>
              <li className="mb-2"><a href="#" className="hover:text-white transition-colors">品牌与电商解决方案</a></li>
              <li className="mb-2"><a href="#" className="hover:text-white transition-colors">教育与科研合作</a></li>
              <li className="mb-2"><a href="#" className="hover:text-white transition-colors">个人用户与爱好者</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">为什么选择空间计算</h4>
            <ul>
              <li className="mb-2"><a href="#" className="hover:text-white transition-colors">空间计算 vs 传统渲染软件</a></li>
              <li className="mb-2"><a href="#" className="hover:text-white transition-colors">空间计算 vs 人工设计流程</a></li>
              <li className="mb-2"><a href="#" className="hover:text-white transition-colors">核心技术优势</a></li>
              <li className="mb-2"><a href="#" className="hover:text-white transition-colors">客户成功案例</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">社区</h4>
            <ul>
              <li className="mb-2"><a href="#" className="hover:text-white transition-colors">灵感画廊</a></li>
              <li className="mb-2"><a href="#" className="hover:text-white transition-colors">学习中心</a></li>
              <li className="mb-2"><a href="#" className="hover:text-white transition-colors">开发者论坛</a></li>
              <li className="mb-2"><a href="#" className="hover:text-white transition-colors">视频教程</a></li>
              <li className="mb-2"><a href="#" className="hover:text-white transition-colors">合作者计划</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">下载</h4>
            <ul>
              <li className="mb-2"><a href="#" className="hover:text-white transition-colors">空间计算 APP</a></li>
              <li className="mb-2"><a href="#" className="hover:text-white transition-colors">iOS版 APP</a></li>
              <li className="mb-2"><a href="#" className="hover:text-white transition-colors">安卓版 APP</a></li>
              <li className="mb-2"><a href="#" className="hover:text-white transition-colors">Windows 客户端</a></li>
              <li className="mb-2"><a href="#" className="hover:text-white transition-colors">Mac 客户端</a></li>
              <li className="mb-2"><a href="#" className="hover:text-white transition-colors">插件下载</a></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-6 mt-12 border-t border-gray-700 pt-8 flex justify-between items-center text-xs">
          <p>&copy; 2024 广东省空间计算科技集团有限公司. All Rights Reserved.</p>
          <p>地址：佛山市南海区大沥镇毅贤路5号广佛智城（六期）天街4号楼3层第150301A号</p>
        </div>
      </footer>
    </div>
  );
};
