/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/* tslint:disable */
import React, { useState, useEffect } from 'react';
import { AiDesignerPage } from './AiDesignerPage';
import { PricingPage } from './PricingPage';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('landing');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const navigateToAiDesigner = () => setCurrentView('aiDesigner');
  const navigateToLanding = () => setCurrentView('landing');
  const navigateToPricing = () => setCurrentView('pricing');

  if (currentView === 'aiDesigner') {
    return <AiDesignerPage onNavigateHome={navigateToLanding} />;
  }

  if (currentView === 'pricing') {
    return <PricingPage onNavigateHome={navigateToLanding} />;
  }

  const lightLogoUrl = "https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAECOn9ozleo0tM7DPF7sr591ApAntiEDAAC4iEAAtUHcVaRqaXTEvSnuTYE.png";
  const darkLogoUrl = "https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAECO9RoznW0NYfb2caj4HfL8cH45fuoWAACyRkAAtUHeValFaFoSqRCwjYE.png";

  const LandingPage = () => (
    <div className="font-sans bg-white">
      {/* Header */}
       <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <img 
            src={scrolled ? darkLogoUrl : lightLogoUrl} 
            alt="Logo" 
            className={`cursor-pointer transition-all duration-300 h-12 ${scrolled ? 'transform scale-125' : 'transform scale-100'}`} 
            onClick={navigateToLanding} 
          />
          <div className={`flex items-center space-x-8 ${scrolled ? 'text-gray-800' : 'text-white'}`}>
            <a href="#" className="hover:text-blue-500">首页</a>
            <a href="#" className="hover:text-blue-500" onClick={(e) => { e.preventDefault(); navigateToAiDesigner(); }}>AI 设计</a>
            <a href="#" className="hover:text-blue-500">产品</a>
            <a href="#" className="hover:text-blue-500">联系我们</a>
            <button
              onClick={navigateToAiDesigner}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition-colors">
              开始设计
            </button>
          </div>
        </nav>
      </header>
      
      <main>
        {/* Hero Section */}
        <section className="relative w-full h-screen flex items-center justify-start hero-section-background">
            <div className="container mx-auto px-6">
                <div className="w-2/5 flex flex-col justify-center text-left">
                    <h1 className="text-7xl font-extrabold leading-tight mb-6 text-white" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                        空间计算
                        <br />
                        家具设计软件
                    </h1>
                    <p className="text-lg mb-8 max-w-lg text-gray-200">
                        借助尖端的空间计算与AI技术，我们的在线设计引擎将彻底改变您的创作流程。上传您的家具产品，人工智能将从百万级真实场景中汲取灵感，为您瞬间生成照片级的渲染效果。无需繁琐的3D建模，只需5分钟，即可将您的产品置于任何您能想象到的空间。
                    </p>
                    <div className="flex space-x-4">
                        <button
                            onClick={navigateToAiDesigner}
                            className="bg-white text-black font-bold py-4 px-8 rounded-full shadow-lg hover:bg-gray-200 transition-transform hover:scale-105">
                            开始设计
                        </button>
                        <button className="bg-white/30 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:bg-white/40 transition-transform hover:scale-105 backdrop-blur-sm">
                            了解更多
                        </button>
                    </div>
                </div>
            </div>
        </section>

        {/* 3 Steps Section */}
        <section className="bg-gray-50 text-gray-800 py-24">
          <div className="container mx-auto px-6">
            <div className="w-full mb-16">
                <div className="flex items-center">
                    <span className="inline-block w-2 h-8 bg-black mr-4"></span>
                    <h2 className="text-4xl font-bold">在3个简单步骤中创造您的完美空间</h2>
                </div>
                <div className="w-full h-px bg-gray-200 mt-4"></div>
            </div>
            <div className="grid md:grid-cols-3 gap-12 text-left">
              <div>
                <img src="https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAEDC5xo2n6HDVjoMmHek44xhq3b2bOh_QAC_hkAAga52FZvRm8vxSqd1zYE.png" alt="模型识别" className="w-full h-56 object-cover rounded-lg shadow-lg mb-6" />
                <h3 className="text-2xl font-bold mb-3 text-blue-600">步骤1: 模型识别 &rarr;</h3>
                <p className="text-gray-600 leading-relaxed">上传产品，AI将进行三维空间解析。 我们的空间计算引擎会自动分析您上传的家具照片，理解其结构、材质与光影特性。</p>
              </div>
              <div>
                <img src="https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAEDC5Jo2n3v0ztOXgRz2S2sKqV5C8KCjgAC8xkAAga52FZNOIaCK6wH0zYE.png" alt="语义理解" className="w-full h-56 object-cover rounded-lg shadow-lg mb-6" />
                <h3 className="text-2xl font-bold mb-3 text-blue-600">步骤2: 语义理解 &rarr;</h3>
                <p className="text-gray-600 leading-relaxed">输入自然语言，AI理解您的创意意图。 您可以用最生活化的语言下达指令，我们的AI将精准理解您对场景、风格和氛围的复杂要求。</p>
              </div>
              <div>
                <img src="https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAEDC5Fo2n3hQ24SDJ1ojGl1Rm8J11FRjAAC8hkAAga52Fb02_EiTHfEszYE.png" alt="即时渲染" className="w-full h-56 object-cover rounded-lg shadow-lg mb-6" />
                <h3 className="text-2xl font-bold mb-3 text-blue-600">步骤3: 即时渲染 &rarr;</h3>
                <p className="text-gray-600 leading-relaxed">云端AI即时渲染，瞬间呈现照片级真实感。 基于强大的云端渲染技术，AI将在几分钟内为您生成多种高精度的设计构想，将您的产品无缝融入任何虚拟空间。</p>
              </div>
            </div>
          </div>
        </section>

        {/* Explore Features Section - 四大AI功能 */}
         <section className="bg-white text-gray-800 py-24">
            <div className="container mx-auto px-6">
                <div className="w-full mb-16">
                    <div className="flex items-center">
                        <span className="inline-block w-2 h-8 bg-black mr-4"></span>
                        <h2 className="text-4xl font-bold">探索功能：从一张图片，到无限商机</h2>
                    </div>
                    <div className="w-full h-px bg-gray-200 mt-4"></div>
                </div>
                
                {/* 功能一：场景融合大师 */}
                <div className="flex items-center -mx-4 mb-20">
                    <div className="w-1/2 px-4 text-left">
                        <h3 className="text-3xl font-bold mb-4">场景融合大师</h3>
                        <p className="text-gray-600 leading-relaxed">告别昂贵的实景拍摄。上传您的任意一张产品图，我们的AI即可瞬间将其从背景中完美分离，并为融入万千虚拟场景做好准备。</p>
                    </div>
                    <div className="w-1/2 px-4">
                        <img src="https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAEDC8Bo2oXflVA2JljpytaGR-f8KBGQKQACORoAAga52FZZJQ6g_zjlzzYE.png" alt="场景融合大师" className="w-full h-80 object-cover rounded-lg shadow-lg" />
                    </div>
                </div>
        
                {/* 功能二：超写实材质替换 */}
                <div className="flex items-center -mx-4 mb-20">
                <div className="w-1/2 px-4">
                        <img src="https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAEDC8No2oYoy0CMIOv5nwPUFDDceWor0QACPBoAAga52FYebqz145TW7jYE.png" alt="超写实材质替换" className="w-full h-80 object-cover rounded-lg shadow-lg" />
                    </div>
                    <div className="w-1/2 px-4 text-left">
                        <h3 className="text-3xl font-bold mb-4">超写实材质替换</h3>
                        <p className="text-gray-600 leading-relaxed">瞬间满足客户的所有定制化需求。在AI识别出您的产品后，您可以从我们庞大的云端材质库中，一键为其更换上千种逼真材质进行预览。</p>
                    </div>
                </div>

                {/* 功能三：精准色彩重定义 */}
                <div className="flex items-center -mx-4 mb-20">
                    <div className="w-1/2 px-4 text-left">
                        <h3 className="text-3xl font-bold mb-4">精准色彩重定义</h3>
                        <p className="text-gray-600 leading-relaxed">为您的产品注入无限色彩活力。精准匹配潘通色卡，或根据您的品牌VI进行定制。在几秒钟内，即可生成同一产品的所有颜色款式，提供最丰富的视觉选择。</p>
                    </div>
                    <div className="w-1/2 px-4">
                        <img src="https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAEDC49o2n2-wOVMPTU2RrOnSMEGLcGXdwAC8BkAAga52FaaF_p-TqA0nTYE.png" alt="精准色彩重定义" className="w-full h-80 object-cover rounded-lg shadow-lg" />
                    </div>
                </div>

                {/* 功能四：AI概念再创 */}
                <div className="flex items-center -mx-4">
                    <div className="w-1/2 px-4">
                        <img src="https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAEDC5to2n46gQpunr21XYchns0e8uXAkQAC_BkAAga52Fb1RB5_5sj1tTYE.png" alt="AI概念再创" className="w-full h-80 object-cover rounded-lg shadow-lg" />
                    </div>
                    <div className="w-1/2 px-4 text-left">
                        <h3 className="text-3xl font-bold mb-4">AI概念再创</h3>
                        <p className="text-gray-600 leading-relaxed">突破灵感枯竭的瓶颈。上传您现有的产品设计草图或照片，我们的AI将基于其核心形态，为您衍生出全新的设计方向。助您在几分钟内，完成过去需要数周才能完成的概念探索启发工作。</p>
                    </div>
                </div>
            </div>
        </section>
        






        {/* Testimonials */}
        <section className="bg-white text-gray-800 py-24">
            <div className="container mx-auto px-6 text-center">
                <div className="w-full mb-16">
                    <div className="flex items-center justify-center">
                        <span className="inline-block w-2 h-8 bg-black mr-4"></span>
                        <h2 className="text-4xl font-bold">已赋能数千家企业与创意工作者</h2>
                    </div>
                    <div className="w-1/3 mx-auto h-px bg-gray-300 mt-4"></div>
                </div>
                <div className="grid md:grid-cols-3 gap-8 text-left">
                    <div className="bg-gray-100 p-8 rounded-lg shadow-lg">
                         <p className="text-5xl text-gray-300 mb-4">&ldquo;</p>
                         <p className="text-gray-600 mb-6 italic">"空间计算的AI渲染，彻底改变了我们团队的产品展示流程..."</p>
                         <div className="flex items-center">
                            <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                            <div>
                                <p className="font-bold">王浩 (Alex Wang)</p>
                                <p className="text-sm text-gray-500">某知名家具品牌，首席营销官</p>
                            </div>
                         </div>
                    </div>
                     <div className="bg-gray-100 p-8 rounded-lg shadow-lg">
                         <p className="text-5xl text-gray-300 mb-4">&ldquo;</p>
                         <p className="text-gray-600 mb-6 italic">"我们一直在寻找一种能将我们的虚拟产品，无缝融入真实生活场景的解决方案..."</p>
                         <div className="flex items-center">
                            <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                            <div>
                                <p className="font-bold">李静 (Jing Li)</p>
                                <p className="text-sm text-gray-500">顶尖室内设计工作室，创始人</p>
                            </div>
                         </div>
                    </div>
                     <div className="bg-gray-100 p-8 rounded-lg shadow-lg">
                         <p className="text-5xl text-gray-300 mb-4">&ldquo;</p>
                         <p className="text-gray-600 mb-6 italic">"我不是一个专业的三维设计师，但空间计算让我能够轻松地将自己的产品..."</p>
                         <div className="flex items-center">
                            <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                            <div>
                                <p className="font-bold">陈宇 (Chen Yu)</p>
                                <p className="text-sm text-gray-500">独立产品设计师</p>
                            </div>
                         </div>
                    </div>
                </div>
            </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-gray-50 text-gray-800 py-24">
            <div className="container mx-auto px-6 flex">
                <div className="w-1/3 pr-8">
                    <div className="flex items-center mb-4">
                        <span className="inline-block w-2 h-8 bg-red-500 mr-4"></span>
                        <h2 className="text-3xl font-bold">关于空间计算AI的常见问题</h2>
                    </div>
                </div>
                <div className="w-2/3">
                    <div className="border-b py-4 flex justify-between items-center cursor-pointer"><p>什么是空间计算AI渲染？</p><span>&#9662;</span></div>
                    <div className="border-b py-4 flex justify-between items-center cursor-pointer"><p>我需要自己提供三维模型吗？</p><span>&#9662;</span></div>
                    <div className="border-b py-4 flex justify-between items-center cursor-pointer"><p>从上传图片到生成最终渲染图，需要多长时间？</p><span>&#9662;</span></div>
                    <div className="border-b py-4 flex justify-between items-center cursor-pointer"><p>我可以指定生成的场景风格吗？</p><span>&#9662;</span></div>
                </div>
            </div>
        </section>

        {/* Final CTA - 视觉升级版 */}
        <section className="relative py-20 text-center overflow-hidden" style={{ backgroundColor: '#111827' }}>
            {/* 底层：深邃背景色 */}
            <div className="absolute inset-0" style={{ backgroundColor: '#111827' }}></div>
            
            {/* 中层：白色雾气效果 */}
            <div className="absolute inset-0">
                <div 
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full"
                    style={{
                        background: `radial-gradient(ellipse 80% 50% at 50% 50%, rgba(156, 163, 175, 0.15) 0%, rgba(156, 163, 175, 0.08) 40%, transparent 70%)`,
                        filter: 'blur(40px)',
                    }}
                ></div>
                <div 
                    className="absolute top-1/4 left-1/4 w-96 h-96"
                    style={{
                        background: `radial-gradient(circle, rgba(156, 163, 175, 0.12) 0%, transparent 60%)`,
                        filter: 'blur(60px)',
                    }}
                ></div>
                <div 
                    className="absolute bottom-1/4 right-1/4 w-80 h-80"
                    style={{
                        background: `radial-gradient(circle, rgba(156, 163, 175, 0.1) 0%, transparent 50%)`,
                        filter: 'blur(50px)',
                    }}
                ></div>
            </div>
            
            {/* 顶层：发光线条网络背景图 */}
            <div 
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3Cpath d='M30 0v60M0 30h60' stroke='%23ffffff' stroke-width='0.5' stroke-opacity='0.1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: '60px 60px',
                }}
            ></div>
            
            {/* 额外的动态光效 */}
            <div className="absolute inset-0">
                <div 
                    className="absolute top-0 left-1/3 w-1 h-full opacity-10"
                    style={{
                        background: `linear-gradient(to bottom, transparent 0%, rgba(156, 163, 175, 0.3) 50%, transparent 100%)`,
                        filter: 'blur(1px)',
                        animation: 'pulse 4s ease-in-out infinite',
                    }}
                ></div>
                <div 
                    className="absolute top-0 right-1/4 w-1 h-full opacity-10"
                    style={{
                        background: `linear-gradient(to bottom, transparent 0%, rgba(156, 163, 175, 0.2) 60%, transparent 100%)`,
                        filter: 'blur(1px)',
                        animation: 'pulse 6s ease-in-out infinite',
                        animationDelay: '2s',
                    }}
                ></div>
            </div>
            
            {/* 内容层 */}
            <div className="relative z-10 container mx-auto px-6">
                <h2 className="text-4xl font-bold mb-4 text-white">用空间计算AI，释放你的创作潜能</h2>
                <p className="text-gray-400 mb-8">从一张图片，到无限场景。空间计算的AI渲染引擎，让你的产品轻松融入任何虚拟空间。</p>
            <div className="flex justify-center space-x-4">
                    <button 
                        onClick={navigateToAiDesigner}
                        className="bg-white text-black font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-colors shadow-lg">
                        立即开始 &rarr;
                    </button>
                    <button 
                        onClick={navigateToPricing}
                        className="border border-gray-400 text-gray-400 font-bold py-3 px-8 rounded-full hover:bg-white hover:text-black transition-colors">
                        查看套餐 &rarr;
                    </button>
                </div>
            </div>
        </section>
        
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
      </main>
    </div>
  );

  return <LandingPage />;
};

export default App;