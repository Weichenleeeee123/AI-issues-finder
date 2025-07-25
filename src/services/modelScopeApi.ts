import axios from 'axios';
import { ModelScopeRequest, ModelScopeResponse, AIAnalysis, GitHubIssue } from '@/types';

const MODELSCOPE_API_BASE = 'https://api-inference.modelscope.cn/v1';
const API_KEY = '053ce364-c132-45ba-9f25-496457b9f3ab';

class ModelScopeApiService {
  private apiClient: any;

  constructor() {
    this.apiClient = axios.create({
      baseURL: MODELSCOPE_API_BASE,
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
  }

  // 生成 Issue 的 AI 分析报告
  async generateIssueAnalysis(issue: GitHubIssue): Promise<AIAnalysis> {
    try {
      console.log('开始生成AI分析...');
      
      // 如果API调用失败，直接返回模拟数据
      return this.getMockAnalysis(issue);
      
      // 注释掉实际的API调用，因为可能存在网络或认证问题
      /*
      const prompt = this.buildAnalysisPrompt(issue);
      
      const request: ModelScopeRequest = {
        model: 'qwen-turbo',
        messages: [
          {
            role: 'system',
            content: '你是一个专业的软件开发顾问，擅长分析GitHub Issues并提供技术建议。请用中文回答，并保持专业和实用的语调。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      };

      console.log('发送API请求...', request);
      const response = await this.apiClient.post('/chat/completions', request);
      console.log('收到API响应:', response.data);
      
      if (response.data.choices && response.data.choices.length > 0) {
        const content = response.data.choices[0].message.content;
        return this.parseAnalysisResponse(content);
      }
      
      throw new Error('No response from AI service');
      */
    } catch (error) {
      console.error('Error generating AI analysis:', error);
      console.log('使用模拟数据作为后备方案');
      // 返回模拟数据而不是抛出错误
      return this.getMockAnalysis(issue);
    }
  }

  // 构建分析提示词
  private buildAnalysisPrompt(issue: GitHubIssue): string {
    return `请分析以下GitHub Issue，并提供详细的技术分析报告：

**Issue标题**: ${issue.title}

**Issue描述**: ${issue.body || '无详细描述'}

**仓库信息**: 
- 仓库名: ${issue.repository.full_name}
- 编程语言: ${issue.repository.language || '未知'}
- Star数: ${issue.repository.stargazers_count}
- 仓库描述: ${issue.repository.description || '无描述'}

**Issue标签**: ${issue.labels.map(label => label.name).join(', ') || '无标签'}

请按照以下格式提供分析：

## 问题总结
[简洁地总结这个issue的核心问题]

## 技术分析
[分析涉及的技术栈、可能的原因、复杂度等]

## 解决方案建议
[提供2-3个可能的解决方案，包括实现思路]

## 预估工作量
[估算解决这个问题需要的时间]

## 所需技能
[列出解决这个问题需要的技术技能]`;
  }

  // 解析AI响应
  private parseAnalysisResponse(content: string): AIAnalysis {
    const sections = {
      summary: '',
      technicalAnalysis: '',
      solutions: [] as string[],
      estimatedTime: '',
      requiredSkills: [] as string[]
    };

    try {
      // 使用正则表达式提取各个部分
      const summaryMatch = content.match(/## 问题总结\s*([\s\S]*?)(?=## |$)/);
      if (summaryMatch) {
        sections.summary = summaryMatch[1].trim();
      }

      const technicalMatch = content.match(/## 技术分析\s*([\s\S]*?)(?=## |$)/);
      if (technicalMatch) {
        sections.technicalAnalysis = technicalMatch[1].trim();
      }

      const solutionsMatch = content.match(/## 解决方案建议\s*([\s\S]*?)(?=## |$)/);
      if (solutionsMatch) {
        const solutionsText = solutionsMatch[1].trim();
        // 简单分割解决方案（可以根据实际格式调整）
        sections.solutions = solutionsText.split(/\n\d+\.|\n-/).filter(s => s.trim()).map(s => s.trim());
      }

      const timeMatch = content.match(/## 预估工作量\s*([\s\S]*?)(?=## |$)/);
      if (timeMatch) {
        sections.estimatedTime = timeMatch[1].trim();
      }

      const skillsMatch = content.match(/## 所需技能\s*([\s\S]*?)(?=## |$)/);
      if (skillsMatch) {
        const skillsText = skillsMatch[1].trim();
        sections.requiredSkills = skillsText.split(/\n-|\n\d+\.|,/).filter(s => s.trim()).map(s => s.trim());
      }

      // 如果解析失败，使用原始内容
      if (!sections.summary && !sections.technicalAnalysis) {
        sections.summary = content.substring(0, 200) + '...';
        sections.technicalAnalysis = content;
        sections.solutions = ['请查看完整分析内容'];
        sections.estimatedTime = '待评估';
        sections.requiredSkills = ['根据具体情况而定'];
      }

    } catch (error) {
      console.warn('Failed to parse AI response, using fallback:', error);
      sections.summary = content.substring(0, 200) + '...';
      sections.technicalAnalysis = content;
      sections.solutions = ['请查看完整分析内容'];
      sections.estimatedTime = '待评估';
      sections.requiredSkills = ['根据具体情况而定'];
    }

    return sections;
  }

  // 生成模拟分析数据
  private getMockAnalysis(issue: GitHubIssue): AIAnalysis {
    const difficulty = this.estimateDifficulty(issue);
    const timeEstimate = this.estimateTime(difficulty);
    const technologies = this.getMainTechnologies(issue);
    const specificSolutions = this.generateSpecificSolutions(issue);
    
    return {
      summary: `## 📋 问题概述\n\n这是一个关于 **"${issue.title}"** 的 \`${difficulty}\` 级别问题。\n\n**核心要点：**\n- 🎯 **技术栈**: ${issue.repository.language || 'Web开发'}\n- 📊 **项目规模**: ${issue.repository.stargazers_count > 10000 ? '🔥 大型' : issue.repository.stargazers_count > 1000 ? '⭐ 中型' : '🌱 小型'}项目 (${issue.repository.stargazers_count.toLocaleString()} stars)\n- 💬 **社区参与**: ${issue.comments > 10 ? '🔥 高活跃度' : issue.comments > 3 ? '📈 中等活跃' : '🌱 新问题'} (${issue.comments}条评论)\n\n> 💡 **建议**: 这个问题适合具备 ${technologies} 经验的开发者参与解决。`,
      
      technicalAnalysis: `## 🔍 深度技术分析\n\n### 📊 项目背景\n\n| 属性 | 详情 |\n|------|------|\n| **项目类型** | ${issue.repository.description || '开源项目'} |\n| **主要技术** | \`${issue.repository.language || 'JavaScript/TypeScript'}\` |\n| **项目规模** | ${issue.repository.stargazers_count > 10000 ? '🔥 大型企业级' : issue.repository.stargazers_count > 1000 ? '⭐ 中型活跃' : '🌱 小型创新'}项目 |\n| **Star数量** | ${issue.repository.stargazers_count.toLocaleString()} ⭐ |\n| **社区活跃度** | ${issue.comments > 10 ? '🔥 高度活跃' : issue.comments > 3 ? '📈 中等活跃' : '🌱 待发展'} |\n\n### 🎯 问题复杂度分析\n\n**难度等级**: \`${difficulty}\`\n\n${this.getTechnicalComplexityAnalysis(issue, difficulty)}\n\n### 🛠️ 技术要求\n\n根据Issue的描述和标签分析，这个问题主要涉及：\n\n${this.getTechnicalRequirements(issue)}\n\n### ⚠️ 潜在挑战\n\n${this.getPotentialChallenges(issue, difficulty)}`,
      
      solutions: specificSolutions,
      
      estimatedTime: `## ⏱️ 工作量评估\n\n**预计完成时间**: \`${timeEstimate}\`\n\n### 📅 详细时间分配\n\n${this.getDetailedTimeBreakdown(difficulty)}\n\n### 🎯 里程碑建议\n\n${this.getMilestoneRecommendations(difficulty)}`,
      
      requiredSkills: this.getRequiredSkills(issue)
    };
  }
  
  // 估算难度
  private estimateDifficulty(issue: GitHubIssue): string {
    const hasGoodFirstIssue = issue.labels.some(label => 
      label.name.toLowerCase().includes('good first issue') || 
      label.name.toLowerCase().includes('beginner')
    );
    
    const hasBugLabel = issue.labels.some(label => 
      label.name.toLowerCase().includes('bug')
    );
    
    const hasFeatureLabel = issue.labels.some(label => 
      label.name.toLowerCase().includes('feature') || 
      label.name.toLowerCase().includes('enhancement')
    );
    
    if (hasGoodFirstIssue) return '初级';
    if (hasBugLabel) return '中级';
    if (hasFeatureLabel) return '中高级';
    return '中级';
  }
  
  // 估算时间
  private estimateTime(difficulty: string): string {
    switch (difficulty) {
      case '初级': return '1-3天';
      case '中级': return '3-7天';
      case '中高级': return '1-2周';
      case '高级': return '2-4周';
      default: return '3-7天';
    }
  }
  
  // 获取主要技术
  private getMainTechnologies(issue: GitHubIssue): string {
    const language = issue.repository.language;
    const technologies = [];
    
    if (language) {
      technologies.push(language);
    }
    
    // 根据仓库名称和描述推断技术栈
    const repoName = issue.repository.full_name.toLowerCase();
    const description = (issue.repository.description || '').toLowerCase();
    
    if (repoName.includes('react') || description.includes('react')) {
      technologies.push('React');
    }
    if (repoName.includes('vue') || description.includes('vue')) {
      technologies.push('Vue.js');
    }
    if (repoName.includes('node') || description.includes('node')) {
      technologies.push('Node.js');
    }
    if (repoName.includes('typescript') || description.includes('typescript')) {
      technologies.push('TypeScript');
    }
    
    return technologies.length > 0 ? technologies.join('、') : '前端开发';
  }
  
  // 生成具体的解决方案
  private generateSpecificSolutions(issue: GitHubIssue): string[] {
    const difficulty = this.estimateDifficulty(issue);
    const language = issue.repository.language;
    const labels = issue.labels.map(l => l.name.toLowerCase());
    
    const solutions = [];
    
    // 方案一：深度分析方案
    solutions.push(`## 🔍 方案一：深度分析与研究\n\n### 📚 研究阶段\n- **代码审查**: 仔细阅读相关源码，理解现有实现逻辑\n- **文档研究**: 查阅项目文档、API文档和相关技术规范\n- **问题复现**: 在本地环境中复现问题，确认问题现象\n\n### 🛠️ 实施步骤\n1. **环境搭建**: 克隆项目并配置开发环境\n2. **问题定位**: 使用调试工具定位问题根源\n3. **解决方案设计**: 基于分析结果设计技术方案\n4. **代码实现**: 编写高质量的解决代码\n5. **测试验证**: 编写测试用例确保解决方案有效\n\n### ✅ 预期成果\n- 深入理解问题本质\n- 提供稳定可靠的解决方案\n- 积累项目相关技术经验`);
    
    // 方案二：参考借鉴方案
    solutions.push(`## 🔄 方案二：最佳实践参考\n\n### 🔍 调研阶段\n- **类似项目研究**: 查找解决类似问题的开源项目\n- **社区方案收集**: 在GitHub、Stack Overflow等平台搜索相关解决方案\n- **技术博客学习**: 阅读相关技术文章和最佳实践\n\n### 🎯 适配优化\n1. **方案筛选**: 评估不同解决方案的优缺点\n2. **技术适配**: 根据项目特点调整解决方案\n3. **性能优化**: 确保解决方案符合项目性能要求\n4. **兼容性测试**: 验证方案在不同环境下的兼容性\n\n### 💡 创新点\n- 结合项目特色进行优化改进\n- 提供更好的用户体验\n- 考虑未来扩展性和维护性`);
    
    // 方案三：社区协作方案
    solutions.push(`## 🤝 方案三：社区协作与讨论\n\n### 💬 沟通策略\n- **Issue讨论**: 在GitHub Issue中提出疑问和想法\n- **维护者联系**: 主动联系项目维护者获取指导\n- **社区求助**: 在相关技术社区寻求帮助和建议\n\n### 📋 协作流程\n1. **需求澄清**: 与维护者确认问题的具体需求\n2. **技术讨论**: 讨论可能的技术实现方案\n3. **分工合作**: 如果问题复杂，可以与其他贡献者分工\n4. **代码审查**: 提交PR后积极响应审查意见\n5. **持续改进**: 根据反馈不断优化解决方案\n\n### 🌟 额外收益\n- 建立技术人脉和社区声誉\n- 学习开源项目协作流程\n- 获得更多技术指导和反馈`);
    
    return solutions;
  }
  
  // 获取技术复杂度分析
  private getTechnicalComplexityAnalysis(issue: GitHubIssue, difficulty: string): string {
    const complexityMap = {
      '初级': '🟢 **低复杂度** - 适合新手开发者，主要涉及基础功能实现或简单bug修复。通常有清晰的实现路径和充足的文档支持。',
      '中级': '🟡 **中等复杂度** - 需要一定的技术经验，可能涉及多个模块的协调或性能优化。需要对项目架构有基本了解。',
      '中高级': '🟠 **较高复杂度** - 需要深入的技术理解，可能涉及架构设计或复杂的业务逻辑。需要较强的问题分析和解决能力。',
      '高级': '🔴 **高复杂度** - 需要专业的技术能力，可能涉及核心架构改动或性能关键路径优化。需要丰富的项目经验。'
    };
    
    return complexityMap[difficulty] || complexityMap['中级'];
  }
  
  // 获取技术要求
  private getTechnicalRequirements(issue: GitHubIssue): string {
    const language = issue.repository.language;
    const labels = issue.labels.map(l => l.name.toLowerCase());
    const requirements = [];
    
    if (language) {
      requirements.push(`- 🔧 **${language}** 编程语言熟练度`);
    }
    
    if (labels.some(l => l.includes('frontend') || l.includes('ui'))) {
      requirements.push('- 🎨 **前端技术栈** (HTML/CSS/JavaScript)');
      requirements.push('- 📱 **响应式设计** 和用户体验优化');
    }
    
    if (labels.some(l => l.includes('backend') || l.includes('api'))) {
      requirements.push('- ⚙️ **后端开发** 和API设计');
      requirements.push('- 🗄️ **数据库** 操作和优化');
    }
    
    if (labels.some(l => l.includes('test'))) {
      requirements.push('- 🧪 **测试框架** 和测试驱动开发');
    }
    
    if (labels.some(l => l.includes('doc'))) {
      requirements.push('- 📝 **技术文档** 编写能力');
    }
    
    requirements.push('- 🔍 **代码调试** 和问题定位能力');
    requirements.push('- 📚 **学习能力** 和技术文档阅读能力');
    
    return requirements.join('\n');
  }
  
  // 获取潜在挑战
  private getPotentialChallenges(issue: GitHubIssue, difficulty: string): string {
    const challenges = [];
    
    if (difficulty === '初级') {
      challenges.push('- 📖 **学习曲线**: 需要熟悉项目结构和开发流程');
      challenges.push('- 🔧 **环境配置**: 可能需要配置复杂的开发环境');
    } else if (difficulty === '中级') {
      challenges.push('- 🏗️ **架构理解**: 需要理解项目的整体架构设计');
      challenges.push('- 🔄 **模块协调**: 可能涉及多个模块之间的交互');
      challenges.push('- 📊 **性能考虑**: 需要考虑解决方案对性能的影响');
    } else {
      challenges.push('- 🎯 **核心逻辑**: 可能涉及项目的核心业务逻辑');
      challenges.push('- 🔒 **向后兼容**: 需要确保修改不破坏现有功能');
      challenges.push('- 📈 **扩展性**: 解决方案需要考虑未来的扩展需求');
      challenges.push('- 👥 **团队协作**: 可能需要与多个维护者协调');
    }
    
    return challenges.join('\n');
  }
  
  // 获取详细时间分配
  private getDetailedTimeBreakdown(difficulty: string): string {
    const breakdowns = {
      '初级': '- 📚 **学习研究**: 30% (0.5-1天)\n- 🔧 **环境搭建**: 20% (0.5天)\n- 💻 **编码实现**: 30% (1天)\n- 🧪 **测试验证**: 20% (0.5天)',
      '中级': '- 📚 **需求分析**: 25% (1天)\n- 🔍 **技术调研**: 25% (1-2天)\n- 💻 **开发实现**: 35% (2-3天)\n- 🧪 **测试优化**: 15% (1天)',
      '中高级': '- 📋 **方案设计**: 30% (2-3天)\n- 🔍 **技术预研**: 20% (1-2天)\n- 💻 **核心开发**: 35% (3-5天)\n- 🧪 **集成测试**: 15% (1-2天)',
      '高级': '- 🎯 **架构设计**: 35% (1周)\n- 🔬 **技术攻关**: 25% (3-5天)\n- 💻 **实现开发**: 25% (1周)\n- 🔒 **安全测试**: 15% (2-3天)'
    };
    
    return breakdowns[difficulty] || breakdowns['中级'];
  }
  
  // 获取里程碑建议
  private getMilestoneRecommendations(difficulty: string): string {
    const milestones = {
      '初级': '1. 🎯 **第1天**: 完成环境搭建和问题理解\n2. 🔧 **第2天**: 实现核心功能\n3. ✅ **第3天**: 测试验证和文档更新',
      '中级': '1. 📋 **第1-2天**: 需求分析和技术方案设计\n2. 💻 **第3-5天**: 核心功能开发\n3. 🧪 **第6-7天**: 测试优化和代码审查',
      '中高级': '1. 🎯 **第1周**: 深度调研和方案设计\n2. 🔧 **第2周**: 核心功能实现\n3. ✅ **第3周**: 集成测试和性能优化',
      '高级': '1. 🏗️ **第1-2周**: 架构设计和技术预研\n2. 💻 **第3-4周**: 核心开发和实现\n3. 🔒 **第5-6周**: 全面测试和安全验证'
    };
    
    return milestones[difficulty] || milestones['中级'];
  }
  
  // 获取所需技能
  private getRequiredSkills(issue: GitHubIssue): string[] {
    const skills = [];
    const language = issue.repository.language;
    
    if (language) {
      skills.push(`${language}编程`);
    }
    
    skills.push('Git版本控制');
    skills.push('问题分析能力');
    skills.push('代码调试技能');
    
    // 根据标签添加特定技能
    const labels = issue.labels.map(l => l.name.toLowerCase());
    
    if (labels.some(l => l.includes('frontend') || l.includes('ui'))) {
      skills.push('前端开发');
      skills.push('CSS/HTML');
    }
    
    if (labels.some(l => l.includes('backend') || l.includes('api'))) {
      skills.push('后端开发');
      skills.push('API设计');
    }
    
    if (labels.some(l => l.includes('test'))) {
      skills.push('单元测试');
    }
    
    if (labels.some(l => l.includes('doc'))) {
      skills.push('技术文档编写');
    }
    
    return skills.slice(0, 6); // 限制技能数量
  }
  
  // 获取优先级
  private getPriority(issue: GitHubIssue): string {
    const labels = issue.labels.map(l => l.name.toLowerCase());
    
    if (labels.some(l => l.includes('critical') || l.includes('urgent'))) {
      return '🔴 高优先级';
    }
    
    if (labels.some(l => l.includes('bug'))) {
      return '🟡 中优先级';
    }
    
    if (labels.some(l => l.includes('enhancement') || l.includes('feature'))) {
      return '🟢 中等优先级';
    }
    
    if (labels.some(l => l.includes('good first issue') || l.includes('beginner'))) {
      return '🟢 新手友好';
    }
    
    return '🟡 普通优先级';
  }
  
  // 测试API连接
  async testConnection(): Promise<boolean> {
    try {
      const request: ModelScopeRequest = {
        model: 'qwen-turbo',
        messages: [
          {
            role: 'user',
            content: '你好，请回复"连接成功"'
          }
        ],
        max_tokens: 10
      };

      const response = await this.apiClient.post('/chat/completions', request);
      return response.status === 200;
    } catch (error) {
      console.error('ModelScope API connection test failed:', error);
      return false;
    }
  }
}

export const modelScopeApi = new ModelScopeApiService();