// GitHub Issue 数据类型定义
export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  body: string;
  state: 'open' | 'closed';
  created_at: string;
  updated_at: string;
  html_url: string;
  comments: number;
  user: {
    login: string;
    avatar_url: string;
  };
  labels: Array<{
    id: number;
    name: string;
    color: string;
  }>;
  repository: {
    name: string;
    full_name: string;
    stargazers_count: number;
    forks_count: number;
    language: string;
    description: string;
    html_url: string;
    owner: {
      login: string;
    };
  };
}

// 智能评估后的 Issue 数据
export interface EvaluatedIssue extends GitHubIssue {
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  score: number;
  tags: string[];
  customTags?: string[];
}

// AI 分析报告
export interface AIAnalysis {
  summary: string;
  technicalAnalysis: string;
  solutions: string[];
  estimatedTime: string;
  requiredSkills: string[];
}

// 筛选条件
export interface FilterOptions {
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  language?: string;
  minStars?: number;
  maxStars?: number;
  updatedSince?: string;
  labels?: string[];
}

// 搜索参数
export interface SearchParams {
  query?: string;
  repository?: string;
  language?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  labels?: string;
  sort?: 'created' | 'updated' | 'comments' | 'score';
  order?: 'asc' | 'desc';
}

// API 响应类型
export interface APIResponse<T> {
  data: T;
  total_count: number;
  incomplete_results: boolean;
}

// 魔搭 API 请求参数
export interface ModelScopeRequest {
  model: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  temperature?: number;
  max_tokens?: number;
}

// 魔搭 API 响应
export interface ModelScopeResponse {
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}