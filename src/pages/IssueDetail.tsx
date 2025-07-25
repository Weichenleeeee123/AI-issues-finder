import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Star, GitFork, Clock, User, Tag, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { useIssuesStore, useIssuesSelectors } from '@/store/useIssuesStore';
import { githubApi } from '@/services/githubApi';
import { EvaluatedIssue } from '@/types';
import Navbar from '@/components/Navbar';
import AIAnalysisReport from '@/components/AIAnalysisReport';
import { PageLoading } from '@/components/LoadingSpinner';
import { formatRelativeTime, formatAbsoluteTime, getDifficultyColor, getLanguageColor } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';
import 'highlight.js/styles/github.css';
import '@/styles/markdown.css';



export default function IssueDetail() {
  const { owner, repo, issueNumber } = useParams<{
    owner: string;
    repo: string;
    issueNumber: string;
  }>();
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  
  const [issue, setIssue] = useState<EvaluatedIssue | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Store
  const { generateAIAnalysis, setCurrentIssue } = useIssuesStore();
  const currentIssue = useIssuesSelectors.useCurrentIssue();
  const aiAnalysis = useIssuesSelectors.useAIAnalysis();
  const { isAnalyzing } = useIssuesSelectors.useLoadingStates();
  
  // 加载Issue详情
  useEffect(() => {
    const loadIssueDetail = async () => {
      if (!owner || !repo || !issueNumber) {
        setError(t('issue.invalidParams'));
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        
        // 首先检查store中是否已有当前issue
        if (currentIssue && 
            currentIssue.repository.owner.login === owner &&
            currentIssue.repository.name === repo &&
            currentIssue.number === parseInt(issueNumber)) {
          setIssue(currentIssue);
          setIsLoading(false);
          return;
        }
        
        // 从API获取详细信息
        const issueDetail = await githubApi.getIssueDetails(owner, repo, parseInt(issueNumber));
        if (issueDetail) {
          const evaluatedIssue: EvaluatedIssue = {
            ...issueDetail,
            difficulty: 'intermediate' as const,
            score: 0,
            tags: [],
            customTags: []
          };
          setIssue(evaluatedIssue);
          setCurrentIssue(evaluatedIssue);
        } else {
          throw new Error('Issue not found');
        }
        
      } catch (err) {
        console.error('Failed to load issue detail:', err);
        setError(t('issue.loadDetailsFailed'));
        toast.error(t('issue.loadDetailsFailed'));
      } finally {
        setIsLoading(false);
      }
    };
    
    loadIssueDetail();
  }, [owner, repo, issueNumber, currentIssue, setCurrentIssue]);
  
  // 生成AI分析
  const handleGenerateAnalysis = async () => {
    if (!issue) return;
    
    try {
      await generateAIAnalysis(issue);
      toast.success(t('issue.analysisComplete'));
    } catch (error) {
      toast.error(t('issue.analysisFailed'));
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar onSearch={() => {}} />
        <PageLoading text={t('issue.loadingDetails')} />
      </div>
    );
  }
  
  if (error || !issue) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar onSearch={() => {}} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('issue.loadFailed')}</h3>
            <p className="text-gray-600 mb-6">{error || t('issue.notFound')}</p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              {t('issue.backToHome')}
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onSearch={() => {}} />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          {t('issue.backToHome')}
        </button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Issue Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {issue.title}
                  </h1>
                  <div className="flex items-center text-sm text-gray-600 space-x-4">
                    <span>#{issue.number}</span>
                    <span className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {issue.user.login}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatRelativeTime(issue.created_at, language)}
                    </span>
                  </div>
                </div>
                
                <a
                  href={issue.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  {t('issue.viewOnGitHub')}
                </a>
              </div>
              
              {/* Repository Info */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-4">
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {issue.repository.full_name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {issue.repository.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    {issue.repository.stargazers_count.toLocaleString()}
                  </span>
                  <span className="flex items-center">
                    <GitFork className="w-4 h-4 mr-1" />
                    {issue.repository.forks_count.toLocaleString()}
                  </span>
                  {issue.repository.language && (
                    <span 
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: getLanguageColor(issue.repository.language) + '20',
                        color: getLanguageColor(issue.repository.language)
                      }}
                    >
                      {issue.repository.language}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Labels and Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {issue.labels.map((label) => (
                  <span
                    key={label.id}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: `#${label.color}20`,
                      color: `#${label.color}`
                    }}
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {label.name}
                  </span>
                ))}
                
                {issue.customTags?.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              {/* Issue Body */}
              <div className="prose prose-gray max-w-none">
                {issue.body ? (
                  <div className="markdown-content">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeHighlight]}
                    >
                      {issue.body}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">{t('issue.noDescription')}</p>
                )}
              </div>
            </div>
            
            {/* AI Analysis Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">{t('issue.aiAnalysisTitle')}</h2>
                {!aiAnalysis && (
                  <button
                    onClick={handleGenerateAnalysis}
                    disabled={isAnalyzing}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                  >
                    {isAnalyzing ? t('issue.analyzing') : t('issue.generateAnalysis')}
                  </button>
                )}
              </div>
              
              <AIAnalysisReport
                analysis={aiAnalysis}
                isLoading={isAnalyzing}
                onGenerate={handleGenerateAnalysis}
              />
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Issue Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('issue.issueInfo')}</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{t('issue.status')}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    issue.state === 'open' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {issue.state === 'open' ? t('issue.open') : t('issue.closed')}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{t('issue.difficulty')}</span>
                  <span 
                    className="px-2 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: getDifficultyColor(issue.difficulty) + '20',
                      color: getDifficultyColor(issue.difficulty)
                    }}
                  >
                    {issue.difficulty}
                  </span>
                </div>
                
                {issue.score && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">{t('issue.score')}</span>
                    <span className="font-semibold text-blue-600">
                      {issue.score.toFixed(1)}/10
                    </span>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{t('issue.commentsCount')}</span>
                  <span className="font-medium">{issue.comments}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{t('issue.createdTime')}</span>
                  <span className="text-sm">{formatAbsoluteTime(issue.created_at, language)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{t('issue.updatedTime')}</span>
                  <span className="text-sm flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatRelativeTime(issue.updated_at, language)}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('issue.quickActions')}</h3>
              
              <div className="space-y-3">
                <a
                  href={issue.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  {t('issue.viewOnGitHub')}
                </a>
                
                <a
                  href={`${issue.repository.html_url}/issues`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center border border-gray-300 hover:border-gray-400 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  {t('issue.viewMoreIssues')}
                </a>
                
                <a
                  href={issue.repository.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center border border-gray-300 hover:border-gray-400 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  {t('issue.visitRepository')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}