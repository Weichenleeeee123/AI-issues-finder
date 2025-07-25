# 安全指南 / Security Guide

## 🔐 API密钥安全 / API Key Security

### 环境变量配置 / Environment Variables Configuration

1. **使用环境变量文件 / Use Environment Files**
   - 将所有敏感信息存储在 `.env` 文件中
   - Store all sensitive information in `.env` files
   - 确保 `.env` 文件已添加到 `.gitignore`
   - Ensure `.env` files are added to `.gitignore`

2. **API密钥最佳实践 / API Key Best Practices**
   ```bash
   # ✅ 正确做法 / Correct approach
   GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
   OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxx
   
   # ❌ 错误做法 / Wrong approach
   # 不要在代码中硬编码API密钥
   # Never hardcode API keys in your code
   const apiKey = "ghp_xxxxxxxxxxxxxxxxxxxx"; // 危险！
   ```

### GitHub Token 配置 / GitHub Token Configuration

1. **创建Personal Access Token**
   - 访问 GitHub Settings > Developer settings > Personal access tokens
   - 选择 "Generate new token (classic)"
   - 设置适当的权限范围：
     - `public_repo` - 访问公共仓库
     - `read:user` - 读取用户信息

2. **Token权限最小化原则**
   - 只授予必要的最小权限
   - 定期检查和更新权限
   - 设置合理的过期时间

### 部署安全 / Deployment Security

1. **生产环境配置 / Production Configuration**
   ```bash
   # 使用环境变量而不是文件
   # Use environment variables instead of files
   export GITHUB_TOKEN="your_token_here"
   export OPENAI_API_KEY="your_key_here"
   ```

2. **CI/CD安全 / CI/CD Security**
   - 使用GitHub Secrets存储敏感信息
   - 不要在日志中输出敏感信息
   - 使用加密的环境变量

### 监控和审计 / Monitoring and Auditing

1. **定期轮换密钥 / Regular Key Rotation**
   - 每3-6个月更换API密钥
   - 监控API使用情况
   - 及时撤销不再使用的密钥

2. **安全检查清单 / Security Checklist**
   - [ ] `.env` 文件已添加到 `.gitignore`
   - [ ] 没有在代码中硬编码敏感信息
   - [ ] API密钥权限已最小化
   - [ ] 设置了密钥过期时间
   - [ ] 定期检查和更新密钥

### 紧急响应 / Emergency Response

如果API密钥泄露：
If API keys are compromised:

1. **立即撤销泄露的密钥**
   - Immediately revoke the compromised keys

2. **生成新的密钥**
   - Generate new API keys

3. **更新所有使用该密钥的服务**
   - Update all services using the compromised keys

4. **检查访问日志**
   - Review access logs for suspicious activity

5. **通知相关团队成员**
   - Notify relevant team members

---

## 📞 报告安全问题 / Report Security Issues

如果发现安全漏洞，请通过以下方式联系我们：
If you discover a security vulnerability, please contact us via:

- 📧 Email: security@yourproject.com
- 🔒 Private GitHub Issue

**请不要公开披露安全漏洞，直到我们有机会修复它们。**
**Please do not publicly disclose security vulnerabilities until we have had a chance to fix them.**

---

*最后更新 / Last updated: 2024年*