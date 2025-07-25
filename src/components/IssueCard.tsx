import { Link } from 'react-router-dom';
import { Star, Clock, Tag, ExternalLink, User } from 'lucide-react';
import { EvaluatedIssue } from '@/types';
import { 
  formatRelativeTime, 
  formatNumber, 
  truncateText, 
  getDifficultyColor, 
  getDifficultyText,
  getLanguageColor 
} from '@/lib/utils';
import { cn } from '@/lib/utils';

interface IssueCardProps {
  issue: EvaluatedIssue;
  onClick?: () => void;
}

export default function IssueCard({ issue, onClick }: IssueCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div 
      className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer group"
      onClick={handleClick}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
              {issue.title}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-sm text-gray-500">
                {issue.repository.full_name}
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-sm text-gray-500">
                #{issue.number}
              </span>
            </div>
          </div>
          
          {/* External Link */}
          <a
            href={issue.html_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
            title="在GitHub中查看"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Description */}
        {issue.body && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {truncateText(issue.body, 150)}
          </p>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {/* Difficulty Tag */}
          <span className={cn(
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
            getDifficultyColor(issue.difficulty)
          )}>
            {getDifficultyText(issue.difficulty)}
          </span>
          
          {/* Language Tag */}
          {issue.repository.language && (
            <span 
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: getLanguageColor(issue.repository.language) }}
            >
              {issue.repository.language}
            </span>
          )}
          
          {/* Custom Tags */}
          {issue.tags.slice(0, 2).map((tag, index) => (
            <span 
              key={index}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              {tag}
            </span>
          ))}
          
          {issue.tags.length > 2 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
              +{issue.tags.length - 2}
            </span>
          )}
        </div>

        {/* GitHub Labels */}
        {issue.labels.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {issue.labels.slice(0, 3).map((label, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded text-xs font-medium border"
                style={{
                  backgroundColor: `#${label.color}20`,
                  borderColor: `#${label.color}40`,
                  color: `#${label.color}`
                }}
              >
                <Tag className="w-3 h-3 mr-1" />
                {label.name}
              </span>
            ))}
            {issue.labels.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600">
                +{issue.labels.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            {/* Author */}
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>{issue.user.login}</span>
            </div>
            
            {/* Stars */}
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4" />
              <span>{formatNumber(issue.repository.stargazers_count)}</span>
            </div>
          </div>
          
          {/* Updated Time */}
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{formatRelativeTime(issue.updated_at)}</span>
          </div>
        </div>

        {/* Score Badge */}
        <div className="absolute top-4 right-4">
          <div className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            {issue.score}
          </div>
        </div>
      </div>
    </div>
  );
}