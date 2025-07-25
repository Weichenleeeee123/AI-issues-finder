import { useState } from 'react';
import { Filter, X, ChevronDown } from 'lucide-react';
import { FilterOptions } from '@/types';
import { cn } from '@/lib/utils';

interface FilterPanelProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
}

const DIFFICULTY_OPTIONS = [
  { value: 'beginner', label: '新手' },
  { value: 'intermediate', label: '中级' },
  { value: 'advanced', label: '高级' }
] as const;

const LANGUAGE_OPTIONS = [
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'Go',
  'Rust',
  'C++',
  'C#',
  'PHP',
  'Ruby',
  'Swift',
  'Kotlin',
  'Dart',
  'HTML',
  'CSS',
  'Vue',
  'React'
];

const STAR_RANGES = [
  { label: '任意', min: undefined, max: undefined },
  { label: '< 100', min: undefined, max: 100 },
  { label: '100 - 1K', min: 100, max: 1000 },
  { label: '1K - 10K', min: 1000, max: 10000 },
  { label: '10K+', min: 10000, max: undefined }
];

const TIME_OPTIONS = [
  { label: '任意时间', value: '' },
  { label: '最近一天', value: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
  { label: '最近一周', value: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
  { label: '最近一月', value: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() }
];

export default function FilterPanel({ filters, onFiltersChange, onClearFilters }: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const updateStarRange = (min?: number, max?: number) => {
    onFiltersChange({
      ...filters,
      minStars: min,
      maxStars: max
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== '' && (Array.isArray(value) ? value.length > 0 : true)
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-medium text-gray-900">筛选条件</h3>
          {hasActiveFilters && (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
              已应用
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="text-sm text-gray-500 hover:text-red-600 transition-colors"
            >
              清除全部
            </button>
          )}
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ChevronDown className={cn(
              'w-4 h-4 transition-transform',
              isExpanded && 'rotate-180'
            )} />
          </button>
        </div>
      </div>

      {/* Filter Content */}
      {isExpanded && (
        <div className="p-4 space-y-6">
          {/* Difficulty Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              难度等级
            </label>
            <div className="flex flex-wrap gap-2">
              {DIFFICULTY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateFilter('difficulty', 
                    filters.difficulty === option.value ? undefined : option.value
                  )}
                  className={cn(
                    'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                    filters.difficulty === option.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Language Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              编程语言
            </label>
            <select
              value={filters.language || ''}
              onChange={(e) => updateFilter('language', e.target.value || undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">所有语言</option>
              {LANGUAGE_OPTIONS.map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </select>
          </div>

          {/* Star Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Star 数量
            </label>
            <div className="grid grid-cols-2 gap-2">
              {STAR_RANGES.map((range, index) => (
                <button
                  key={index}
                  onClick={() => updateStarRange(range.min, range.max)}
                  className={cn(
                    'px-3 py-2 rounded-md text-sm font-medium transition-colors text-left',
                    filters.minStars === range.min && filters.maxStars === range.max
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Time Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              更新时间
            </label>
            <select
              value={filters.updatedSince || ''}
              onChange={(e) => updateFilter('updatedSince', e.target.value || undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              {TIME_OPTIONS.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Labels Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              标签 (用逗号分隔)
            </label>
            <input
              type="text"
              value={filters.labels?.join(', ') || ''}
              onChange={(e) => {
                const labels = e.target.value
                  .split(',')
                  .map(label => label.trim())
                  .filter(label => label.length > 0);
                updateFilter('labels', labels.length > 0 ? labels : undefined);
              }}
              placeholder="例如: good first issue, bug, enhancement"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      )}
    </div>
  );
}