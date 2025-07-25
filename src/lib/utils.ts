import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDistanceToNow, format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 格式化相对时间
export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(dateObj, { 
    addSuffix: true,
    locale: zhCN 
  });
}

// 格式化绝对时间
export function formatAbsoluteTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'yyyy年MM月dd日 HH:mm', { locale: zhCN });
}

// 格式化数字（如star数）
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

// 截断文本
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
}

// 获取难度颜色
export function getDifficultyColor(difficulty: 'beginner' | 'intermediate' | 'advanced'): string {
  switch (difficulty) {
    case 'beginner':
      return 'bg-green-100 text-green-800';
    case 'intermediate':
      return 'bg-yellow-100 text-yellow-800';
    case 'advanced':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

// 获取难度文本
export function getDifficultyText(difficulty: 'beginner' | 'intermediate' | 'advanced'): string {
  switch (difficulty) {
    case 'beginner':
      return '新手';
    case 'intermediate':
      return '中级';
    case 'advanced':
      return '高级';
    default:
      return '未知';
  }
}

// 获取语言颜色（基于GitHub的语言颜色）
export function getLanguageColor(language: string): string {
  const colors: Record<string, string> = {
    'JavaScript': '#f1e05a',
    'TypeScript': '#2b7489',
    'Python': '#3572A5',
    'Java': '#b07219',
    'C++': '#f34b7d',
    'C': '#555555',
    'C#': '#239120',
    'PHP': '#4F5D95',
    'Ruby': '#701516',
    'Go': '#00ADD8',
    'Rust': '#dea584',
    'Swift': '#ffac45',
    'Kotlin': '#F18E33',
    'Dart': '#00B4AB',
    'HTML': '#e34c26',
    'CSS': '#1572B6',
    'Vue': '#2c3e50',
    'React': '#61DAFB'
  };
  
  return colors[language] || '#6b7280';
}

// 解析GitHub URL获取仓库信息
export function parseGitHubUrl(url: string): { owner: string; repo: string; issueNumber?: number } | null {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)(?:\/issues\/(\d+))?/);
  if (!match) return null;
  
  return {
    owner: match[1],
    repo: match[2],
    issueNumber: match[3] ? parseInt(match[3]) : undefined
  };
}

// 生成随机ID
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// 防抖函数
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// 节流函数
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
