import { useState } from 'react';
import { Search, Sparkles, Github, TrendingUp } from 'lucide-react';
import { SearchParams } from '@/types';

interface HeroSectionProps {
  onSearch: (params: SearchParams) => void;
}

export default function HeroSection({ onSearch }: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch({ query: searchQuery.trim() });
    }
  };

  const handleQuickSearch = (query: string) => {
    onSearch({ query });
  };

  const quickSearchItems = [
    { label: 'Good First Issue', query: 'good first issue' },
    { label: 'Help Wanted', query: 'help wanted' },
    { label: 'Documentation', query: 'documentation' },
    { label: 'Bug Fix', query: 'bug' }
  ];

  return (
    <div className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-float"></div>
      <div className="absolute top-40 right-20 w-16 h-16 bg-green-200 rounded-full opacity-20 animate-float-delayed"></div>
      <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-purple-200 rounded-full opacity-20 animate-float"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Main Heading */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
                AI Issues Finder
              </h1>
            </div>
          </div>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            智能发现适合你的 <span className="text-blue-600 font-semibold">GitHub Issues</span>，
            让开源贡献变得简单高效
          </p>
          
          <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
            通过AI技术评估难度等级，推荐最适合的开源项目贡献机会
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <form onSubmit={handleSearch} className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索 GitHub Issues，例如：React bug fix"
                className="block w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 shadow-lg"
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
              >
                <div className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200">
                  搜索
                </div>
              </button>
            </form>
          </div>

          {/* Quick Search Tags */}
          <div className="mb-12">
            <p className="text-sm text-gray-500 mb-4">热门搜索：</p>
            <div className="flex flex-wrap justify-center gap-3">
              {quickSearchItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickSearch(item.query)}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-blue-300 hover:text-blue-600 hover:shadow-md transition-all duration-200"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">智能评估</h3>
              <p className="text-gray-600 text-sm">
                AI自动评估Issue难度等级，为不同水平的开发者推荐合适的贡献机会
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Github className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">实时数据</h3>
              <p className="text-gray-600 text-sm">
                实时爬取GitHub最新Issues，确保信息准确性和时效性
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI分析</h3>
              <p className="text-gray-600 text-sm">
                深度分析Issue内容，提供技术方案建议和解决思路
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Custom Styles */}
      <style>{`
        .bg-grid-pattern {
          background-image: radial-gradient(circle, #e5e7eb 1px, transparent 1px);
          background-size: 20px 20px;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}