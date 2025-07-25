import { create } from 'zustand';
import { EvaluatedIssue, FilterOptions, SearchParams, AIAnalysis } from '@/types';
import { githubApi } from '@/services/githubApi';
import { evaluationService } from '@/services/evaluationService';
import { modelScopeApi } from '@/services/modelScopeApi';

interface IssuesState {
  // 数据状态
  issues: EvaluatedIssue[];
  filteredIssues: EvaluatedIssue[];
  recommendedIssues: EvaluatedIssue[];
  currentIssue: EvaluatedIssue | null;
  aiAnalysis: AIAnalysis | null;
  
  // 加载状态
  isLoading: boolean;
  isSearching: boolean;
  isAnalyzing: boolean;
  isRefreshing: boolean;
  isLoadingMore: boolean;
  
  // 分页状态
  currentPage: number;
  hasMore: boolean;
  
  // 筛选和搜索状态
  filters: FilterOptions;
  searchParams: SearchParams;
  
  // 错误状态
  error: string | null;
  
  // Actions
  fetchPopularIssues: () => Promise<void>;
  refreshIssues: () => Promise<void>;
  loadMoreIssues: () => Promise<void>;
  searchIssues: (params: SearchParams) => Promise<void>;
  applyFilters: (filters: FilterOptions) => void;
  clearFilters: () => void;
  setCurrentIssue: (issue: EvaluatedIssue) => void;
  generateAIAnalysis: (issue: EvaluatedIssue) => Promise<void>;
  clearError: () => void;
}

export const useIssuesStore = create<IssuesState>((set, get) => ({
  // 初始状态
  issues: [],
  filteredIssues: [],
  recommendedIssues: [],
  currentIssue: null,
  aiAnalysis: null,
  
  isLoading: false,
  isSearching: false,
  isAnalyzing: false,
  isRefreshing: false,
  isLoadingMore: false,
  
  currentPage: 1,
  hasMore: true,
  
  filters: {},
  searchParams: {},
  
  error: null,
  
  // 获取热门 Issues
  fetchPopularIssues: async () => {
    set({ isLoading: true, error: null, currentPage: 1 });
    
    try {
      const rawIssues = await githubApi.getPopularIssues(30); // 获取30个issues
      const evaluatedIssues = evaluationService.evaluateAndSortIssues(rawIssues);
      const recommended = evaluationService.getRecommendedIssues(evaluatedIssues, 30);
      
      set({ 
        issues: evaluatedIssues,
        filteredIssues: evaluatedIssues,
        recommendedIssues: recommended,
        isLoading: false,
        hasMore: rawIssues.length >= 30
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '获取Issues失败',
        isLoading: false 
      });
    }
  },

  // 刷新 Issues
  refreshIssues: async () => {
    set({ isRefreshing: true, error: null, currentPage: 1 });
    
    try {
      const rawIssues = await githubApi.getPopularIssues(30);
      const evaluatedIssues = evaluationService.evaluateAndSortIssues(rawIssues);
      const recommended = evaluationService.getRecommendedIssues(evaluatedIssues, 30);
      
      set({ 
        issues: evaluatedIssues,
        filteredIssues: evaluatedIssues,
        recommendedIssues: recommended,
        isRefreshing: false,
        hasMore: rawIssues.length >= 30
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '刷新Issues失败',
        isRefreshing: false 
      });
    }
  },

  // 加载更多 Issues
  loadMoreIssues: async () => {
    const { currentPage, hasMore, recommendedIssues } = get();
    
    if (!hasMore) return;
    
    set({ isLoadingMore: true, error: null });
    
    try {
      const nextPage = currentPage + 1;
      const rawIssues = await githubApi.getMorePopularIssues(nextPage, 20); // 每次加载20个
      
      if (rawIssues.length === 0) {
        set({ hasMore: false, isLoadingMore: false });
        return;
      }
      
      const evaluatedIssues = evaluationService.evaluateAndSortIssues(rawIssues);
      const newRecommended = evaluationService.getRecommendedIssues(evaluatedIssues, 20);
      
      set({ 
        recommendedIssues: [...recommendedIssues, ...newRecommended],
        currentPage: nextPage,
        isLoadingMore: false,
        hasMore: rawIssues.length >= 20
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '加载更多Issues失败',
        isLoadingMore: false 
      });
    }
  },
  
  // 搜索 Issues
  searchIssues: async (params: SearchParams) => {
    set({ isSearching: true, error: null, searchParams: params });
    
    try {
      const response = await githubApi.searchIssues(params);
      const evaluatedIssues = evaluationService.evaluateAndSortIssues(response.data);
      
      // 应用当前筛选条件
      const { filters } = get();
      const filteredIssues = evaluationService.applyFilters(evaluatedIssues, filters);
      
      set({ 
        issues: evaluatedIssues,
        filteredIssues,
        isSearching: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '搜索失败',
        isSearching: false 
      });
    }
  },
  
  // 应用筛选条件
  applyFilters: (newFilters: FilterOptions) => {
    const { issues } = get();
    const filteredIssues = evaluationService.applyFilters(issues, newFilters);
    
    set({ 
      filters: newFilters,
      filteredIssues 
    });
  },
  
  // 清除筛选条件
  clearFilters: () => {
    const { issues } = get();
    
    set({ 
      filters: {},
      filteredIssues: issues 
    });
  },
  
  // 设置当前 Issue
  setCurrentIssue: (issue: EvaluatedIssue) => {
    set({ 
      currentIssue: issue,
      aiAnalysis: null // 清除之前的分析结果
    });
  },
  
  // 生成 AI 分析
  generateAIAnalysis: async (issue: EvaluatedIssue) => {
    set({ isAnalyzing: true, error: null });
    
    try {
      const analysis = await modelScopeApi.generateIssueAnalysis(issue);
      
      set({ 
        aiAnalysis: analysis,
        isAnalyzing: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'AI分析失败',
        isAnalyzing: false 
      });
    }
  },
  
  // 清除错误
  clearError: () => {
    set({ error: null });
  }
}));

// 选择器函数（用于性能优化）
export const useIssuesSelectors = {
  // 获取推荐Issues
  useRecommendedIssues: () => useIssuesStore(state => state.recommendedIssues),
  
  // 获取筛选后的Issues
  useFilteredIssues: () => useIssuesStore(state => state.filteredIssues),
  
  // 获取当前Issue
  useCurrentIssue: () => useIssuesStore(state => state.currentIssue),
  
  // 获取AI分析
  useAIAnalysis: () => useIssuesStore(state => state.aiAnalysis),
  
  // 获取加载状态
  useLoadingStates: () => {
    const isLoading = useIssuesStore(state => state.isLoading);
    const isSearching = useIssuesStore(state => state.isSearching);
    const isAnalyzing = useIssuesStore(state => state.isAnalyzing);
    const isRefreshing = useIssuesStore(state => state.isRefreshing);
    const isLoadingMore = useIssuesStore(state => state.isLoadingMore);
    return { isLoading, isSearching, isAnalyzing, isRefreshing, isLoadingMore };
  },
  
  // 获取分页状态
  usePaginationStates: () => {
    const currentPage = useIssuesStore(state => state.currentPage);
    const hasMore = useIssuesStore(state => state.hasMore);
    return { currentPage, hasMore };
  },
  
  // 获取筛选条件
  useFilters: () => useIssuesStore(state => state.filters),
  
  // 获取错误状态
  useError: () => useIssuesStore(state => state.error)
};