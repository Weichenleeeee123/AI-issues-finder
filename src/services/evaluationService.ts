import { GitHubIssue, EvaluatedIssue, FilterOptions } from '@/types';

class EvaluationService {
  // 评估 Issue 难度
  evaluateIssueDifficulty(issue: GitHubIssue): 'beginner' | 'intermediate' | 'advanced' {
    let score = 0;
    
    // 基于标签评估
    const labels = issue.labels.map(label => label.name.toLowerCase());
    
    // 新手友好标签
    const beginnerLabels = ['good first issue', 'beginner', 'easy', 'documentation', 'help wanted'];
    const intermediateLabels = ['enhancement', 'feature', 'refactor', 'performance'];
    const advancedLabels = ['bug', 'critical', 'security', 'architecture', 'breaking change'];
    
    if (labels.some(label => beginnerLabels.some(bl => label.includes(bl)))) {
      score -= 2;
    }
    
    if (labels.some(label => intermediateLabels.some(il => label.includes(il)))) {
      score += 1;
    }
    
    if (labels.some(label => advancedLabels.some(al => label.includes(al)))) {
      score += 3;
    }
    
    // 基于描述长度评估（更长的描述通常意味着更复杂的问题）
    const bodyLength = issue.body?.length || 0;
    if (bodyLength > 1000) {
      score += 2;
    } else if (bodyLength > 500) {
      score += 1;
    }
    
    // 基于标题关键词评估
    const title = issue.title.toLowerCase();
    const complexKeywords = ['refactor', 'architecture', 'performance', 'security', 'breaking'];
    const simpleKeywords = ['typo', 'documentation', 'readme', 'comment', 'example'];
    
    if (complexKeywords.some(keyword => title.includes(keyword))) {
      score += 2;
    }
    
    if (simpleKeywords.some(keyword => title.includes(keyword))) {
      score -= 1;
    }
    
    // 基于仓库语言评估
    const language = issue.repository.language?.toLowerCase();
    const complexLanguages = ['c++', 'rust', 'assembly', 'haskell'];
    const beginnerLanguages = ['python', 'javascript', 'html', 'css', 'markdown'];
    
    if (language && complexLanguages.includes(language)) {
      score += 1;
    }
    
    if (language && beginnerLanguages.includes(language)) {
      score -= 1;
    }
    
    // 返回难度等级
    if (score <= -1) {
      return 'beginner';
    } else if (score <= 2) {
      return 'intermediate';
    } else {
      return 'advanced';
    }
  }
  
  // 计算 Issue 评分（优先考虑高star数仓库）
  calculateIssueScore(issue: GitHubIssue): number {
    let score = 0;
    
    // 仓库星数权重（对数缩放，对高star数仓库给予更高权重）
    const stars = issue.repository.stargazers_count;
    
    // 对于star数小于1000的仓库，给予较低分数
    if (stars < 1000) {
      score += Math.min(15, Math.log10(Math.max(stars, 1)) * 5);
    } else {
      // 对高star数仓库给予更高权重
      score += Math.log10(Math.max(stars, 1)) * 15;
    }
    
    // 更新时间权重（越新越好）
    const updatedAt = new Date(issue.updated_at);
    const daysSinceUpdate = (Date.now() - updatedAt.getTime()) / (1000 * 60 * 60 * 24);
    score += Math.max(0, 30 - daysSinceUpdate); // 30天内的issue得分更高
    
    // 标签权重
    const labels = issue.labels.map(label => label.name.toLowerCase());
    const goodLabels = ['good first issue', 'help wanted', 'beginner', 'documentation'];
    const bonusLabels = ['hacktoberfest', 'bounty', 'priority'];
    
    if (labels.some(label => goodLabels.some(gl => label.includes(gl)))) {
      score += 20;
    }
    
    if (labels.some(label => bonusLabels.some(bl => label.includes(bl)))) {
      score += 10;
    }
    
    // 语言流行度权重
    const language = issue.repository.language?.toLowerCase();
    const popularLanguages = ['javascript', 'python', 'java', 'typescript', 'react', 'vue'];
    
    if (language && popularLanguages.includes(language)) {
      score += 5;
    }
    
    return Math.round(score);
  }
  
  // 生成标签
  generateTags(issue: GitHubIssue): string[] {
    const tags: string[] = [];
    
    // 添加语言标签
    if (issue.repository.language) {
      tags.push(issue.repository.language);
    }
    
    // 添加难度标签
    const difficulty = this.evaluateIssueDifficulty(issue);
    tags.push(difficulty);
    
    // 添加类型标签
    const labels = issue.labels.map(label => label.name.toLowerCase());
    
    if (labels.some(label => label.includes('bug'))) {
      tags.push('Bug修复');
    }
    
    if (labels.some(label => label.includes('feature') || label.includes('enhancement'))) {
      tags.push('新功能');
    }
    
    if (labels.some(label => label.includes('documentation'))) {
      tags.push('文档');
    }
    
    if (labels.some(label => label.includes('test'))) {
      tags.push('测试');
    }
    
    // 添加星数等级标签
    const stars = issue.repository.stargazers_count;
    if (stars > 10000) {
      tags.push('热门项目');
    } else if (stars > 1000) {
      tags.push('活跃项目');
    }
    
    return tags;
  }
  
  // 评估并排序 Issues
  evaluateAndSortIssues(issues: GitHubIssue[]): EvaluatedIssue[] {
    const evaluatedIssues: EvaluatedIssue[] = issues.map(issue => ({
      ...issue,
      difficulty: this.evaluateIssueDifficulty(issue),
      score: this.calculateIssueScore(issue),
      tags: this.generateTags(issue)
    }));
    
    // 按评分排序
    return evaluatedIssues.sort((a, b) => b.score - a.score);
  }
  
  // 应用筛选条件
  applyFilters(issues: EvaluatedIssue[], filters: FilterOptions): EvaluatedIssue[] {
    return issues.filter(issue => {
      // 难度筛选
      if (filters.difficulty && issue.difficulty !== filters.difficulty) {
        return false;
      }
      
      // 语言筛选
      if (filters.language && issue.repository.language?.toLowerCase() !== filters.language.toLowerCase()) {
        return false;
      }
      
      // 星数范围筛选
      const stars = issue.repository.stargazers_count;
      if (filters.minStars && stars < filters.minStars) {
        return false;
      }
      
      if (filters.maxStars && stars > filters.maxStars) {
        return false;
      }
      
      // 更新时间筛选
      if (filters.updatedSince) {
        const updatedAt = new Date(issue.updated_at);
        const filterDate = new Date(filters.updatedSince);
        if (updatedAt < filterDate) {
          return false;
        }
      }
      
      // 标签筛选
      if (filters.labels && filters.labels.length > 0) {
        const issueLabels = issue.labels.map(label => label.name.toLowerCase());
        const hasMatchingLabel = filters.labels.some(filterLabel => 
          issueLabels.some(issueLabel => issueLabel.includes(filterLabel.toLowerCase()))
        );
        if (!hasMatchingLabel) {
          return false;
        }
      }
      
      return true;
    });
  }
  
  // 获取推荐的 Issues（用于首页展示，优先推荐高star数仓库）
  getRecommendedIssues(issues: EvaluatedIssue[], limit: number = 12): EvaluatedIssue[] {
    // 首先过滤出高star数仓库的issues（优先推荐star数>1000的仓库）
    const highStarIssues = issues.filter(issue => issue.repository.stargazers_count > 1000);
    const lowStarIssues = issues.filter(issue => issue.repository.stargazers_count <= 1000);
    
    // 从高star数仓库中选择不同难度的issues
    const beginnerIssues = highStarIssues.filter(issue => issue.difficulty === 'beginner').slice(0, Math.ceil(limit * 0.5));
    const intermediateIssues = highStarIssues.filter(issue => issue.difficulty === 'intermediate').slice(0, Math.ceil(limit * 0.3));
    const advancedIssues = highStarIssues.filter(issue => issue.difficulty === 'advanced').slice(0, Math.ceil(limit * 0.2));
    
    let recommended = [...beginnerIssues, ...intermediateIssues, ...advancedIssues];
    
    // 如果高star数仓库的issues不够，从剩余的高star数issues中补充
    if (recommended.length < limit) {
      const remainingHighStar = highStarIssues.filter(issue => !recommended.includes(issue)).slice(0, limit - recommended.length);
      recommended.push(...remainingHighStar);
    }
    
    // 如果还是不够，才从低star数仓库中补充
    if (recommended.length < limit) {
      const remainingLowStar = lowStarIssues.slice(0, limit - recommended.length);
      recommended.push(...remainingLowStar);
    }
    
    return recommended.slice(0, limit);
  }
}

export const evaluationService = new EvaluationService();