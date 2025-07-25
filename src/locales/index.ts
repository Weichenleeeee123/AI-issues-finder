export const translations = {
  zh: {
    // 导航栏
    nav: {
      home: '首页',
      search: '搜索',
      about: '关于',
    },
    // 首页
    home: {
      title: 'AI Issues Finder',
      subtitle: '智能发现适合你的 GitHub Issues，让开源贡献变得简单高效',
      description: '通过AI技术评估难度等级，推荐最适合的开源项目贡献机会',
      searchPlaceholder: '搜索 GitHub Issues，例如：React bug fix',
      searchButton: '搜索',
      recommendedIssues: '推荐Issues',
      qualityContributions: '为您精选的优质开源贡献机会',
      noRecommended: '暂无推荐Issues',
      tryLaterOrSearch: '请稍后再试，或者尝试搜索特定的Issues',
      features: {
        title: '核心功能',
        intelligent: {
          title: '智能推荐',
          description: 'AI自动评估Issue难度等级，为不同水平的开发者推荐合适的贡献机会'
        },
        filter: {
          title: '精准筛选',
          description: '多维度筛选，快速找到目标Issues'
        },
        analysis: {
          title: 'AI分析',
          description: '深度分析Issue内容，提供技术方案建议和解决思路'
        },
        realtime: {
          title: '实时数据',
          description: '实时爬取GitHub最新Issues，确保信息准确性和时效性'
        }
      }
    },
    // 搜索页面
    search: {
      title: '搜索结果',
      loading: '正在搜索...',
      noResults: '未找到相关Issues',
      searchComplete: '搜索完成',
      searchFailed: '搜索失败，请重试',
      filterResults: '筛选结果',
      foundResults: '找到',
      matchingIssues: '个匹配的Issues',
      noMatches: '没有找到匹配的Issues',
      tryAdjustFilters: '尝试调整筛选条件或搜索其他关键词',
      clearFilters: '清除筛选条件',
      popularSearches: '热门搜索：',
      goodFirstIssue: 'Good First Issue',
      helpWanted: 'Help Wanted',
      documentation: '文档',
      bugFix: 'Bug修复',
      filters: {
        title: '筛选条件',
        language: '编程语言',
        difficulty: '难度等级',
        type: 'Issue类型',
        status: '状态',
        all: '全部',
        easy: '简单',
        medium: '中等',
        hard: '困难',
        bug: 'Bug修复',
        feature: '新功能',
        documentation: '文档',
        enhancement: '改进',
        open: '开放',
        closed: '已关闭'
      },
      aiAnalysis: {
        title: 'AI分析报告',
        difficulty: '难度评估',
        timeEstimate: '预估时间',
        skills: '所需技能',
        suggestions: '解决建议',
        resources: '参考资源'
      }
    },
    // Issue详情
    issue: {
      title: 'Issue详情',
      author: '作者',
      created: '创建时间',
      updated: '更新时间',
      labels: '标签',
      assignees: '负责人',
      comments: '评论',
      viewOnGitHub: '在GitHub上查看',
      startWorking: '开始工作',
      backToHome: '返回首页',
      loadingDetails: '正在加载Issue详情...',
      loadFailed: '加载失败',
      notFound: '未找到指定的Issue',
      invalidParams: '无效的Issue参数',
      loadDetailsFailed: '加载Issue详情失败，请重试',
      noDescription: '暂无描述',
      aiAnalysisTitle: 'AI 智能分析',
      generateAnalysis: '生成AI分析',
      analyzing: '分析中...',
      analysisComplete: 'AI分析生成完成',
      analysisFailed: 'AI分析生成失败，请重试',
      issueInfo: 'Issue 信息',
      status: '状态',
      difficulty: '难度',
      score: '推荐分数',
      commentsCount: '评论数',
      createdTime: '创建时间',
      updatedTime: '更新时间',
      quickActions: '快速操作',
      viewMoreIssues: '查看更多Issues',
      visitRepository: '访问仓库',
      open: '开放',
      closed: '已关闭'
    },
    // 通用
    common: {
      loading: '加载中...',
      error: '出错了',
      retry: '重试',
      back: '返回',
      next: '下一步',
      previous: '上一步',
      save: '保存',
      cancel: '取消',
      confirm: '确认',
      delete: '删除',
      edit: '编辑',
      view: '查看',
      share: '分享',
      copy: '复制',
      copied: '已复制',
      language: '语言',
      refresh: '刷新',
      refreshing: '刷新中...',
      refreshComplete: '刷新完成',
      refreshFailed: '刷新失败，请重试',
      loadMore: '加载更多Issues',
      loadMoreComplete: '加载更多完成',
      loadMoreFailed: '加载更多失败，请重试',
      autoRefresh: '自动刷新',
      autoRefreshOn: '已开启自动刷新',
      autoRefreshOff: '已关闭自动刷新',
      loadingRecommended: '正在加载推荐Issues...',
      total: '共',
      issues: '个Issues',
      allLoaded: '已加载全部Issues'
    },
    // 难度等级
    difficulty: {
      beginner: '新手',
      intermediate: '中级',
      advanced: '高级',
      unknown: '未知'
    }
  },
  en: {
    // Navigation
    nav: {
      home: 'Home',
      search: 'Search',
      about: 'About',
    },
    // Home page
    home: {
      title: 'AI Issues Finder',
      subtitle: 'Intelligently discover GitHub Issues that suit you, making open source contributions simple and efficient',
      description: 'Use AI technology to assess difficulty levels and recommend the most suitable open source project contribution opportunities',
      searchPlaceholder: 'Search GitHub Issues, e.g.: React bug fix',
      searchButton: 'Search',
      recommendedIssues: 'Recommended Issues',
      qualityContributions: 'Curated quality open source contribution opportunities for you',
      noRecommended: 'No recommended Issues available',
      tryLaterOrSearch: 'Please try again later, or try searching for specific Issues',
      features: {
        title: 'Core Features',
        intelligent: {
          title: 'Smart Assessment',
          description: 'AI automatically assesses Issue difficulty levels, recommending suitable contribution opportunities for developers of different levels'
        },
        filter: {
          title: 'Precise Filtering',
          description: 'Multi-dimensional filtering to quickly find target Issues'
        },
        analysis: {
          title: 'AI Analysis',
          description: 'In-depth analysis of Issue content, providing technical solution suggestions and problem-solving approaches'
        },
        realtime: {
          title: 'Real-time Data',
          description: 'Real-time crawling of the latest GitHub Issues, ensuring information accuracy and timeliness'
        }
      }
    },
    // Search page
    search: {
      title: 'Search Results',
      loading: 'Searching...',
      noResults: 'No related Issues found',
      searchComplete: 'Search completed',
      searchFailed: 'Search failed, please try again',
      filterResults: 'Filter Results',
      foundResults: 'Found',
      matchingIssues: 'matching Issues',
      noMatches: 'No matching Issues found',
      tryAdjustFilters: 'Try adjusting filters or search other keywords',
      clearFilters: 'Clear Filters',
      popularSearches: 'Popular searches:',
      goodFirstIssue: 'Good First Issue',
      helpWanted: 'Help Wanted',
      documentation: 'Documentation',
      bugFix: 'Bug Fix',
      filters: {
        title: 'Filters',
        language: 'Programming Language',
        difficulty: 'Difficulty Level',
        type: 'Issue Type',
        status: 'Status',
        all: 'All',
        easy: 'Easy',
        medium: 'Medium',
        hard: 'Hard',
        bug: 'Bug Fix',
        feature: 'New Feature',
        documentation: 'Documentation',
        enhancement: 'Enhancement',
        open: 'Open',
        closed: 'Closed'
      },
      aiAnalysis: {
        title: 'AI Analysis Report',
        difficulty: 'Difficulty Assessment',
        timeEstimate: 'Time Estimate',
        skills: 'Required Skills',
        suggestions: 'Solution Suggestions',
        resources: 'Reference Resources'
      }
    },
    // Issue details
    issue: {
      title: 'Issue Details',
      author: 'Author',
      created: 'Created',
      updated: 'Updated',
      labels: 'Labels',
      assignees: 'Assignees',
      comments: 'Comments',
      viewOnGitHub: 'View on GitHub',
      startWorking: 'Start Working',
      backToHome: 'Back to Home',
      loadingDetails: 'Loading Issue details...',
      loadFailed: 'Load Failed',
      notFound: 'Issue not found',
      invalidParams: 'Invalid Issue parameters',
      loadDetailsFailed: 'Failed to load Issue details, please try again',
      noDescription: 'No description available',
      aiAnalysisTitle: 'AI Smart Analysis',
      generateAnalysis: 'Generate AI Analysis',
      analyzing: 'Analyzing...',
      analysisComplete: 'AI analysis completed',
      analysisFailed: 'AI analysis failed, please try again',
      issueInfo: 'Issue Information',
      status: 'Status',
      difficulty: 'Difficulty',
      score: 'Recommendation Score',
      commentsCount: 'Comments',
      createdTime: 'Created',
      updatedTime: 'Updated',
      quickActions: 'Quick Actions',
      viewMoreIssues: 'View More Issues',
      visitRepository: 'Visit Repository',
      open: 'Open',
      closed: 'Closed'
    },
    // Common
    common: {
      loading: 'Loading...',
      error: 'An error occurred',
      retry: 'Retry',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      save: 'Save',
      cancel: 'Cancel',
      confirm: 'Confirm',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      share: 'Share',
      copy: 'Copy',
      copied: 'Copied',
      language: 'Language',
      refresh: 'Refresh',
      refreshing: 'Refreshing...',
      refreshComplete: 'Refresh completed',
      refreshFailed: 'Refresh failed, please try again',
      loadMore: 'Load More Issues',
      loadMoreComplete: 'Load more completed',
      loadMoreFailed: 'Load more failed, please try again',
      autoRefresh: 'Auto Refresh',
      autoRefreshOn: 'Auto refresh enabled',
      autoRefreshOff: 'Auto refresh disabled',
      loadingRecommended: 'Loading recommended Issues...',
      total: 'Total',
      issues: 'Issues',
      allLoaded: 'All Issues loaded'
    },
    // Difficulty levels
    difficulty: {
      beginner: 'Beginner',
      intermediate: 'Intermediate',
      advanced: 'Advanced',
      unknown: 'Unknown'
    }
  }
};

export type TranslationKey = keyof typeof translations.zh;