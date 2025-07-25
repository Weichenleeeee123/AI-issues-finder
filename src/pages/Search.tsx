import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Filter, SortAsc, SortDesc } from 'lucide-react';
import { toast } from 'sonner';
import { useIssuesStore, useIssuesSelectors } from '@/store/useIssuesStore';
import { SearchParams, FilterOptions } from '@/types';
import Navbar from '@/components/Navbar';
import FilterPanel from '@/components/FilterPanel';
import IssueCard from '@/components/IssueCard';
import { IssueListSkeleton } from '@/components/LoadingSpinner';

type SortOption = 'created' | 'updated' | 'comments' | 'score';
type SortOrder = 'asc' | 'desc';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Local state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [sortBy, setSortBy] = useState<SortOption>('updated');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [showFilters, setShowFilters] = useState(false);
  
  // Store
  const { searchIssues, applyFilters, clearFilters, setCurrentIssue } = useIssuesStore();
  const filteredIssues = useIssuesSelectors.useFilteredIssues();
  const filters = useIssuesSelectors.useFilters();
  const { isSearching } = useIssuesSelectors.useLoadingStates();
  const error = useIssuesSelectors.useError();
  
  // 初始化搜索
  useEffect(() => {
    const query = searchParams.get('q');
    const language = searchParams.get('language');
    const difficulty = searchParams.get('difficulty');
    
    if (query) {
      const params: SearchParams = {
        query,
        language: language || undefined,
        sort: sortBy,
        order: sortOrder
      };
      
      searchIssues(params);
      
      // 应用URL中的筛选条件
      if (language || difficulty) {
        const filterOptions: FilterOptions = {};
        if (language) filterOptions.language = language;
        if (difficulty) filterOptions.difficulty = difficulty as any;
        applyFilters(filterOptions);
      }
    }
  }, [searchParams, sortBy, sortOrder, searchIssues, applyFilters]);
  
  // 处理搜索
  const handleSearch = async (params: SearchParams) => {
    try {
      // 更新URL参数
      const newSearchParams = new URLSearchParams();
      newSearchParams.set('q', params.query);
      if (params.language) newSearchParams.set('language', params.language);
      if (params.difficulty) newSearchParams.set('difficulty', params.difficulty);
      setSearchParams(newSearchParams);
      
      // 执行搜索
      await searchIssues({
        ...params,
        sort: sortBy,
        order: sortOrder
      });
      
      toast.success('搜索完成');
    } catch (error) {
      toast.error('搜索失败，请重试');
    }
  };
  
  // 处理快速搜索
  const handleQuickSearch = () => {
    if (!searchQuery.trim()) {
      toast.error('请输入搜索关键词');
      return;
    }
    
    handleSearch({ query: searchQuery.trim() });
  };
  
  // 处理排序变化
  const handleSortChange = (newSortBy: SortOption) => {
    if (newSortBy === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };
  
  // 处理筛选器变化
  const handleFiltersChange = (newFilters: FilterOptions) => {
    applyFilters(newFilters);
    
    // 更新URL参数
    const newSearchParams = new URLSearchParams(searchParams);
    if (newFilters.language) {
      newSearchParams.set('language', newFilters.language);
    } else {
      newSearchParams.delete('language');
    }
    if (newFilters.difficulty) {
      newSearchParams.set('difficulty', newFilters.difficulty);
    } else {
      newSearchParams.delete('difficulty');
    }
    setSearchParams(newSearchParams);
  };
  
  // 处理清除筛选器
  const handleClearFilters = () => {
    clearFilters();
    
    // 清除URL中的筛选参数
    const newSearchParams = new URLSearchParams();
    const query = searchParams.get('q');
    if (query) newSearchParams.set('q', query);
    setSearchParams(newSearchParams);
  };
  
  // 处理Issue点击
  const handleIssueClick = (issue: any) => {
    setCurrentIssue(issue);
    navigate(`/issue/${issue.repository.full_name}/${issue.number}`);
  };
  
  // 排序选项
  const sortOptions = [
    { value: 'updated' as SortOption, label: '最近更新' },
    { value: 'created' as SortOption, label: '创建时间' },
    { value: 'comments' as SortOption, label: '评论数' },
    { value: 'score' as SortOption, label: '推荐分数' }
  ];
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onSearch={handleSearch} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">搜索 Issues</h1>
          
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleQuickSearch()}
                placeholder="搜索 Issues..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleQuickSearch}
              disabled={isSearching}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              {isSearching ? '搜索中...' : '搜索'}
            </button>
          </div>
          
          {/* Search Stats */}
          {searchParams.get('q') && (
            <div className="text-gray-600">
              搜索 "{searchParams.get('q')}" 的结果
              {filteredIssues.length > 0 && (
                <span className="ml-2">- 找到 {filteredIssues.length} 个Issues</span>
              )}
            </div>
          )}
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Filters */}
          <div className="lg:w-80 flex-shrink-0">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-50"
              >
                <Filter className="w-4 h-4 mr-2" />
                筛选条件
                {Object.keys(filters).length > 0 && (
                  <span className="ml-auto bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                    {Object.keys(filters).length}
                  </span>
                )}
              </button>
            </div>
            
            {/* Filter Panel */}
            <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
              <div className="sticky top-24">
                <FilterPanel
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  onClearFilters={handleClearFilters}
                />
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            {/* Sort Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 font-medium">排序:</span>
                <div className="flex items-center space-x-2">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSortChange(option.value)}
                      className={`flex items-center px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        sortBy === option.value
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      {option.label}
                      {sortBy === option.value && (
                        sortOrder === 'desc' ? 
                          <SortDesc className="w-4 h-4 ml-1" /> : 
                          <SortAsc className="w-4 h-4 ml-1" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              {filteredIssues.length > 0 && (
                <div className="text-sm text-gray-500">
                  共 {filteredIssues.length} 个结果
                </div>
              )}
            </div>
            
            {/* Loading State */}
            {isSearching && (
              <IssueListSkeleton count={6} />
            )}
            
            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">搜索出错</h3>
                <p className="text-gray-600 mb-6">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  重新加载
                </button>
              </div>
            )}
            
            {/* Results Grid */}
            {!isSearching && !error && filteredIssues.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredIssues.map((issue) => (
                  <IssueCard
                    key={`${issue.repository.full_name}-${issue.number}`}
                    issue={issue}
                    onClick={() => handleIssueClick(issue)}
                  />
                ))}
              </div>
            )}
            
            {/* Empty State */}
            {!isSearching && !error && filteredIssues.length === 0 && searchParams.get('q') && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SearchIcon className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到相关Issues</h3>
                <p className="text-gray-600 mb-6">
                  尝试使用不同的关键词或调整筛选条件
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={handleClearFilters}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                  >
                    清除筛选条件
                  </button>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      const newSearchParams = new URLSearchParams();
                      setSearchParams(newSearchParams);
                    }}
                    className="border border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                  >
                    清除搜索
                  </button>
                </div>
              </div>
            )}
            
            {/* No Search Query State */}
            {!searchParams.get('q') && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SearchIcon className="w-12 h-12 text-blue-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">开始搜索Issues</h3>
                <p className="text-gray-600 mb-6">
                  输入关键词来搜索GitHub上的开源项目Issues
                </p>
                <div className="max-w-md mx-auto">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleQuickSearch()}
                      placeholder="例如: react, vue, typescript..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleQuickSearch}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                    >
                      搜索
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}