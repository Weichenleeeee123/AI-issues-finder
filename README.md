# AI Issues 推荐系统

🚀 **AI驱动的GitHub Issues推荐系统**

**中文** | [English](README_EN.md)

## 🌐 在线体验

[![Deploy with Vercel](https://vercel.com/button)](https://traenn4e001z-kxz01m8y6-weichens-projects-083f7446.vercel.app)

**🔗 在线访问**: [https://traenn4e001z-kxz01m8y6-weichens-projects-083f7446.vercel.app](https://traenn4e001z-kxz01m8y6-weichens-projects-083f7446.vercel.app)

---

AI Issues Finder 是一个智能平台，通过分析和推荐来自热门仓库的高质量GitHub issues，帮助开发者发现适合的开源贡献机会。

## ✨ 功能特性

- **🤖 AI智能分析**: 智能issue难度评估和个性化推荐
- **🔍 智能搜索**: 支持按语言、难度、星数和标签进行高级筛选
- **📊 富文本显示**: 支持Markdown渲染和语法高亮的issue描述
- **📈 仓库洞察**: 专注于高星仓库（1000+星）确保质量
- **🎯 难度分类**: 新手、中级和高级难度分类
- **🔄 实时更新**: 支持自动刷新和手动刷新
- **📱 响应式设计**: 现代简洁的UI，适配所有设备
- **🌐 双语支持**: 中英文界面支持

## 🛠️ 技术栈

- **前端框架**: React 18 + TypeScript + Vite
- **样式方案**: Tailwind CSS
- **状态管理**: Zustand
- **路由管理**: React Router
- **Markdown渲染**: react-markdown + remark-gfm + rehype-highlight
- **图标库**: Lucide React
- **HTTP客户端**: Axios
- **通知组件**: Sonner

## 📦 安装说明

1. **克隆仓库**
   ```bash
   git clone https://github.com/yourusername/AI-issues-finder.git
   cd AI-issues-finder
   ```

2. **安装依赖**
   ```bash
   npm install
   # 或者
   pnpm install
   ```

3. **配置环境变量**
   ```bash
   # 复制环境变量模板文件
   cp .env.example .env
   ```
   
   然后编辑 `.env` 文件，填入你的API密钥：
   ```bash
   # GitHub API配置（必需）
   GITHUB_TOKEN=your_github_personal_access_token_here
   
   # AI服务API配置（可选，用于AI分析功能）
   OPENAI_API_KEY=your_openai_api_key_here
   ```
   
   **⚠️ 安全提醒**:
   - 永远不要将 `.env` 文件提交到版本控制系统
   - 保护好你的API密钥，定期轮换
   - 使用最小权限原则配置API密钥

4. **启动开发服务器**
   ```bash
   npm run dev
   # 或者
   pnpm dev
   ```

5. **打开浏览器**
   ```
   http://localhost:5173
   ```

## 🎯 使用方法

1. **浏览推荐Issues**: 查看来自高星仓库的精选issues
2. **搜索和筛选**: 使用高级筛选器找到匹配你技能的issues
3. **AI分析**: 获取每个issue的详细AI分析报告
4. **难度评估**: 根据你的经验水平选择合适的issues
5. **直达GitHub**: 点击直接在GitHub上查看issues

## 📁 项目结构

```
src/
├── components/          # 可复用UI组件
├── pages/              # 页面组件
├── services/           # API服务和业务逻辑
├── store/              # 状态管理
├── types/              # TypeScript类型定义
├── lib/                # 工具函数
└── styles/             # 全局样式和主题
```

## 🤝 贡献指南

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 📄 开源协议

本项目基于 MIT 协议开源 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🌟 Star History

如果这个项目对你有帮助，请给我们一个 ⭐️！

## 📞 联系我们

- 📧 邮箱: weichenleeeee@outlook.com
- 🐛 问题反馈: [GitHub Issues](https://github.com/weichenleeeee123/AI-issues-finder/issues)
- 💬 讨论交流: [GitHub Discussions](https://github.com/weichenleeeee123/AI-issues-finder/discussions)

---

**由开发者制作，为开发者服务 ❤️**
