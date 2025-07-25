# AI Issues Finder

🚀 **AI-Powered GitHub Issues Recommendation System**

[中文版](README.md) | **English**

## 🌐 Live Demo

[![Deploy with Vercel](https://vercel.com/button)](https://traenn4e001z-kxz01m8y6-weichens-projects-083f7446.vercel.app)

**🔗 Live Site**: [https://traenn4e001z-kxz01m8y6-weichens-projects-083f7446.vercel.app](https://traenn4e001z-kxz01m8y6-weichens-projects-083f7446.vercel.app)

---

AI Issues Finder is an intelligent platform that helps developers discover suitable open-source contribution opportunities by analyzing and recommending high-quality GitHub issues from popular repositories.

## ✨ Features

- **🤖 AI-Powered Analysis**: Intelligent issue difficulty assessment and personalized recommendations
- **🔍 Smart Search**: Advanced filtering by language, difficulty, stars, and labels
- **📊 Rich Text Display**: Markdown rendering with syntax highlighting for issue descriptions
- **📈 Repository Insights**: Focus on high-star repositories (1000+ stars) for quality assurance
- **🎯 Difficulty Classification**: Beginner, Intermediate, and Advanced level categorization
- **🔄 Real-time Updates**: Auto-refresh and manual refresh capabilities
- **📱 Responsive Design**: Modern, clean UI that works on all devices
- **🌐 Bilingual Support**: Chinese and English interface

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router
- **Markdown**: react-markdown + remark-gfm + rehype-highlight
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Notifications**: Sonner

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/AI-issues-finder.git
   cd AI-issues-finder
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Configure environment variables**
   ```bash
   # Copy the environment template file
   cp .env.example .env
   ```
   
   Then edit the `.env` file and fill in your API keys:
   ```bash
   # GitHub API Configuration (Required)
   GITHUB_TOKEN=your_github_personal_access_token_here
   
   # AI Service API Configuration (Optional, for AI analysis features)
   OPENAI_API_KEY=your_openai_api_key_here
   ```
   
   **⚠️ Security Reminders**:
   - Never commit `.env` files to version control
   - Keep your API keys secure and rotate them regularly
   - Use the principle of least privilege when configuring API keys

4. **Start development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   ```
   http://localhost:5173
   ```

## 🎯 Usage

1. **Browse Recommended Issues**: View curated issues from high-star repositories
2. **Search & Filter**: Use advanced filters to find issues matching your skills
3. **AI Analysis**: Get detailed AI-powered analysis for each issue
4. **Difficulty Assessment**: Choose issues based on your experience level
5. **Direct GitHub Access**: Click to view issues directly on GitHub

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── services/           # API services and business logic
├── store/              # State management
├── types/              # TypeScript type definitions
├── lib/                # Utility functions
└── styles/             # Global styles and themes
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Star History

If this project helps you, please give us a ⭐️!

## 📞 Contact Us

- 📧 Email: weichenleeeee@outlook.com
- 🐛 Issues: [GitHub Issues](https://github.com/weichenleeeee123/AI-issues-finder/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/weichenleeeee123/AI-issues-finder/discussions)

---

**Made with ❤️ by developers, for developers**