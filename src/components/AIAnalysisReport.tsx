import { useState } from 'react';
import { Brain, Clock, Lightbulb, Code, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { AIAnalysis } from '@/types';
import { cn } from '@/lib/utils';
import LoadingSpinner from './LoadingSpinner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';

interface AIAnalysisReportProps {
  analysis: AIAnalysis | null;
  isLoading: boolean;
  onGenerate: () => void;
}

export default function AIAnalysisReport({ analysis, isLoading, onGenerate }: AIAnalysisReportProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['summary']));
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const copyToClipboard = async (text: string, section: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(section);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="text-center">
          <LoadingSpinner size="lg" text="AI正在分析中，请稍候..." />
          <p className="text-sm text-gray-500 mt-4">
            这可能需要几秒钟时间
          </p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Brain className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          获取AI分析报告
        </h3>
        <p className="text-gray-600 mb-6">
          点击下方按钮，让AI为您分析这个Issue的技术细节和解决方案
        </p>
        <button
          onClick={onGenerate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 mx-auto"
        >
          <Brain className="w-5 h-5" />
          <span>生成AI分析</span>
        </button>
      </div>
    );
  }

  const sections = [
    {
      id: 'summary',
      title: '问题总结',
      icon: Brain,
      content: analysis.summary,
      color: 'blue'
    },
    {
      id: 'technical',
      title: '技术分析',
      icon: Code,
      content: analysis.technicalAnalysis,
      color: 'green'
    },
    {
      id: 'solutions',
      title: '解决方案',
      icon: Lightbulb,
      content: analysis.solutions.join('\n\n'),
      color: 'yellow'
    },
    {
      id: 'time',
      title: '预估工作量',
      icon: Clock,
      content: analysis.estimatedTime,
      color: 'purple'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-700 border-blue-200',
      green: 'bg-green-50 text-green-700 border-green-200',
      yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      purple: 'bg-purple-50 text-purple-700 border-purple-200'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">AI 分析报告</h2>
            <p className="text-sm text-gray-600">基于魔搭社区AI模型生成</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="divide-y divide-gray-200">
        {sections.map((section) => {
          const isExpanded = expandedSections.has(section.id);
          const Icon = section.icon;
          
          return (
            <div key={section.id} className="">
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center border',
                    getColorClasses(section.color)
                  )}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {section.title}
                  </h3>
                </div>
                
                <div className="flex items-center space-x-2">
                  {isExpanded && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(section.content, section.id);
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      title="复制内容"
                    >
                      {copiedSection === section.id ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  )}
                  
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </button>

              {/* Section Content */}
              {isExpanded && (
                <div className="px-6 pb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    {section.id === 'solutions' ? (
                      <div className="space-y-4">
                        {analysis.solutions.map((solution, index) => (
                          <div key={index} className="bg-white rounded-md p-3 border border-gray-200">
                            <div className="flex items-start space-x-2">
                              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                                {index + 1}
                              </span>
                              <p className="text-gray-700 leading-relaxed">
                                {solution}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-700 leading-relaxed prose prose-sm max-w-none prose-headings:text-gray-800 prose-strong:text-gray-900 prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-50 prose-pre:border prose-table:text-sm prose-th:bg-gray-50 prose-td:border prose-th:border prose-ul:list-disc prose-ol:list-decimal">
                         <ReactMarkdown
                           remarkPlugins={[remarkGfm]}
                           rehypePlugins={[rehypeHighlight]}
                           components={{
                             h1: ({children}) => <h1 className="text-xl font-bold text-gray-800 mb-3 mt-4 first:mt-0">{children}</h1>,
                             h2: ({children}) => <h2 className="text-lg font-semibold text-gray-800 mb-2 mt-3 first:mt-0">{children}</h2>,
                             h3: ({children}) => <h3 className="text-base font-medium text-gray-700 mb-2 mt-2">{children}</h3>,
                             p: ({children}) => <p className="mb-2 text-gray-700">{children}</p>,
                             ul: ({children}) => <ul className="mb-3 ml-4 space-y-1">{children}</ul>,
                             ol: ({children}) => <ol className="mb-3 ml-4 space-y-1">{children}</ol>,
                             li: ({children}) => <li className="text-gray-700">{children}</li>,
                             strong: ({children}) => <strong className="font-semibold text-gray-900">{children}</strong>,
                             code: ({children, className}) => {
                               const isInline = !className;
                               return isInline ? (
                                 <code className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>
                               ) : (
                                 <code className={className}>{children}</code>
                               );
                             },
                             pre: ({children}) => <pre className="bg-gray-50 border rounded-lg p-3 overflow-x-auto mb-3">{children}</pre>,
                             table: ({children}) => <table className="w-full border-collapse border border-gray-300 mb-3 text-sm">{children}</table>,
                             th: ({children}) => <th className="border border-gray-300 bg-gray-50 px-3 py-2 text-left font-medium">{children}</th>,
                             td: ({children}) => <td className="border border-gray-300 px-3 py-2">{children}</td>,
                             blockquote: ({children}) => <blockquote className="border-l-4 border-blue-200 pl-4 py-2 bg-blue-50 mb-3 italic">{children}</blockquote>
                           }}
                         >
                           {section.content}
                         </ReactMarkdown>
                       </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Required Skills */}
        {analysis.requiredSkills.length > 0 && (
          <div className="px-6 py-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">所需技能</h4>
            <div className="flex flex-wrap gap-2">
              {analysis.requiredSkills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          此分析报告由AI生成，仅供参考。实际情况可能有所不同。
        </p>
      </div>
    </div>
  );
}