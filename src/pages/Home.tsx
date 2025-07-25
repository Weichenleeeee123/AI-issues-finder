import { useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { RefreshCw, Plus } from 'lucide-react';
import { useIssuesStore, useIssuesSelectors } from '@/store/useIssuesStore';
import { SearchParams } from '@/types';
import { useTranslation } from '@/hooks/useTranslation';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FilterPanel from '@/components/FilterPanel';
import IssueCard from '@/components/IssueCard';
import { PageLoading, IssueListSkeleton } from '@/components/LoadingSpinner';

export default function Home() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // Store actions
  const { 
    fetchPopularIssues,
    refreshIssues,
    loadMoreIssues,
    searchIssues, 
    applyFilters, 
    clearFilters, 
    setCurrentIssue,
    clearError 
  } = useIssuesStore();
  
  // Store selectors
  const recommendedIssues = useIssuesSelectors.useRecommendedIssues();
  const filteredIssues = useIssuesSelectors.useFilteredIssues();
  const filters = useIssuesSelectors.useFilters();
  const { isLoading, isSearching, isRefreshing, isLoadingMore } = useIssuesSelectors.useLoadingStates();
  const { hasMore } = useIssuesSelectors.usePaginationStates();
  const error = useIssuesSelectors.useError();
  
  // 自动刷新状态
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);
  
  // 初始化加载热门issues
  const initializeData = useCallback(async () => {
    try {
      await fetchPopularIssues();
    } catch (error) {
      console.error('Failed to fetch popular issues:', error);
    }
  }, [fetchPopularIssues]);
  
  useEffect(() => {
    initializeData();
  }, []);
  
  // 错误处理
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);
  
  // 自动刷新逻辑
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        handleRefresh();
      }, 30000); // 每30秒刷新一次
      setRefreshInterval(interval);
    } else {
      if (refreshInterval) {
        clearInterval(refreshInterval);
        setRefreshInterval(null);
      }
    }
    
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [autoRefresh]);
  
  // 组件卸载时清理定时器
  useEffect(() => {
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, []);
  
  // 处理搜索
  const handleSearch = async (params: SearchParams) => {
    try {
      await searchIssues(params);
      toast.success(t('search.searchComplete') || '搜索完成');
    } catch (error) {
      toast.error(t('search.searchFailed') || '搜索失败，请重试');
    }
  };
  
  // 处理刷新
  const handleRefresh = async () => {
    try {
      await refreshIssues();
      toast.success(t('common.refreshComplete') || '刷新完成');
    } catch (error) {
      toast.error(t('common.refreshFailed') || '刷新失败，请重试');
    }
  };
  
  // 处理加载更多
  const handleLoadMore = async () => {
    try {
      await loadMoreIssues();
      toast.success(t('common.loadMoreComplete') || '加载更多完成');
    } catch (error) {
      toast.error(t('common.loadMoreFailed') || '加载更多失败，请重试');
    }
  };
  
  // 切换自动刷新
  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
    toast.success(autoRefresh ? (t('common.autoRefreshOff') || '已关闭自动刷新') : (t('common.autoRefreshOn') || '已开启自动刷新'));
  };
  
  // 处理Issue点击
  const handleIssueClick = (issue: any) => {
    setCurrentIssue(issue);
    // 导航到详情页（这里先用简单的方式，后续可以改为路由）
    navigate(`/issue/${issue.repository.full_name}/${issue.number}`);
  };
  
  // 显示的issues列表
  const displayIssues = Object.keys(filters).length > 0 ? filteredIssues : recommendedIssues;
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar onSearch={handleSearch} />
        <PageLoading text={t('common.loadingRecommended') || '正在加载推荐Issues...'} />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onSearch={handleSearch} />
      
      {/* Hero Section */}
      <HeroSection onSearch={handleSearch} />
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Filter Panel */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="sticky top-24">
              <FilterPanel
                filters={filters}
                onFiltersChange={applyFilters}
                onClearFilters={clearFilters}
              />
            </div>
          </div>
          
          {/* Main Content - Issues List */}
          <div className="flex-1">
            {/* Section Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {Object.keys(filters).length > 0 ? t('search.filterResults') || '筛选结果' : t('home.recommendedIssues') || '推荐Issues'}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {Object.keys(filters).length > 0 
                      ? `${t('search.foundResults') || '找到'} ${displayIssues.length} ${t('search.matchingIssues') || '个匹配的Issues'}`
                      : t('home.qualityContributions') || '为您精选的优质开源贡献机会'
                    }
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  {/* 自动刷新开关 */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">{t('common.autoRefresh') || '自动刷新'}</label>
                    <button
                      onClick={toggleAutoRefresh}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        autoRefresh ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          autoRefresh ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  
                  {/* 手动刷新按钮 */}
                  <button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors duration-200"
                  >
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    {isRefreshing ? (t('common.refreshing') || '刷新中...') : (t('common.refresh') || '刷新')}
                  </button>
                  
                  {displayIssues.length > 0 && (
                    <div className="text-sm text-gray-500">
                      {t('common.total') || '共'} {displayIssues.length} {t('common.issues') || '个Issues'}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Loading State */}
            {isSearching && (
              <IssueListSkeleton count={6} />
            )}
            
            {/* Issues Grid */}
            {!isSearching && displayIssues.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {displayIssues.map((issue) => (
                    <IssueCard
                      key={`${issue.repository.full_name}-${issue.number}`}
                      issue={issue}
                      onClick={() => handleIssueClick(issue)}
                    />
                  ))}
                </div>
                
                {/* 加载更多按钮 */}
                {Object.keys(filters).length === 0 && hasMore && (
                  <div className="mt-12 text-center">
                    <button
                      onClick={handleLoadMore}
                      disabled={isLoadingMore}
                      className="flex items-center gap-2 mx-auto px-6 py-3 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 disabled:text-gray-400 rounded-lg font-medium transition-colors duration-200"
                    >
                      <Plus className={`w-5 h-5 ${isLoadingMore ? 'animate-spin' : ''}`} />
                      {isLoadingMore ? (t('common.loading') || '加载中...') : (t('common.loadMore') || '加载更多Issues')}
                    </button>
                  </div>
                )}
                
                {/* 加载更多时的骨架屏 */}
                {isLoadingMore && (
                  <div className="mt-8">
                    <IssueListSkeleton count={3} />
                  </div>
                )}
                
                {/* 没有更多数据提示 */}
                {Object.keys(filters).length === 0 && !hasMore && displayIssues.length > 0 && (
                  <div className="mt-12 text-center">
                    <p className="text-gray-500">{t('common.allLoaded') || '已加载全部Issues'}</p>
                  </div>
                )}
              </>
            )}
            
            {/* Empty State */}
            {!isSearching && displayIssues.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {Object.keys(filters).length > 0 ? (t('search.noMatches') || '没有找到匹配的Issues') : (t('home.noRecommended') || '暂无推荐Issues')}
                </h3>
                <p className="text-gray-600 mb-6">
                  {Object.keys(filters).length > 0 
                    ? (t('search.tryAdjustFilters') || '尝试调整筛选条件或搜索其他关键词')
                    : (t('home.tryLaterOrSearch') || '请稍后再试，或者尝试搜索特定的Issues')
                  }
                </p>
                {Object.keys(filters).length > 0 && (
                  <button
                    onClick={clearFilters}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                  >
                    {t('search.clearFilters') || '清除筛选条件'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}