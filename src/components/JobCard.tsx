import React from 'react';
import {
  Calendar,
  Building2,
  Users,
  MapPin,
  ArrowRight,
  Sparkles,
  Award,
  CreditCard,
  Key,
  HelpCircle,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { Post } from '../types';
import { calculatePostStatus, getStatusBadgeConfig } from '../utils/statusCalculator';

interface JobCardProps {
  post: Post;
  onClick: () => void;
  layout?: 'grid' | 'list' | 'compact' | 'sarkari_list';
}

export const JobCard: React.FC<JobCardProps> = ({ post, onClick, layout = 'grid' }) => {
  const status = calculatePostStatus(post);
  const badge = getStatusBadgeConfig(status);

  const getPostIcon = () => {
    switch (post.type) {
      case 'admit_card':
        return <CreditCard className="w-4 h-4 text-amber-600" />;
      case 'result':
        return <Award className="w-4 h-4 text-blue-600" />;
      case 'answer_key':
        return <Key className="w-4 h-4 text-teal-600" />;
      case 'sarkari_yojana':
        return <HelpCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-indigo-600" />;
    }
  };

  // Authentic Sarkari Result 3-Column Table List Row (Exact match to screenshot 2.JPG)
  if (layout === 'sarkari_list') {
    const isNew = post.isFeatured || post.isPinned || (Date.now() - new Date(post.createdAt).getTime()) < (7 * 24 * 60 * 60 * 1000);
    return (
      <div
        id={`sarkari-item-${post.id}`}
        onClick={onClick}
        className="group px-2.5 py-1.5 hover:bg-red-50/60 border-b border-slate-200/80 transition-colors cursor-pointer flex items-start justify-between gap-1.5 select-none"
      >
        <div className="flex items-start gap-1.5 min-w-0 flex-1">
          <span className="text-slate-800 font-black text-sm leading-tight select-none shrink-0">•</span>
          <div className="min-w-0 flex-1">
            <div className="text-[12.5px] leading-tight">
              <span className="font-semibold text-[#0000CC] hover:underline group-hover:text-[#990000] transition-colors">
                {post.title}
              </span>
              {isNew && (
                <span className="ml-1.5 inline-block px-1 py-0.2 text-[8.5px] font-black uppercase tracking-wider bg-[#CC0000] text-white rounded shrink-0 align-middle">
                  NEW
                </span>
              )}
              {post.lastDate && (
                <span className="ml-1 text-[11px] font-semibold text-red-600">
                  (Last: {post.lastDate})
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (layout === 'compact') {
    return (
      <div
        id={`compact-card-${post.id}`}
        onClick={onClick}
        className="p-3 bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-400 rounded-xl transition-all cursor-pointer group flex items-center justify-between gap-3 shadow-xs"
      >
        <div className="flex items-start gap-2.5 min-w-0 flex-1">
          <div className="mt-0.5 p-1.5 bg-slate-100 rounded-lg group-hover:bg-blue-100 transition-colors flex-shrink-0">
            {getPostIcon()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <span className={`px-1.5 py-0.2 rounded text-[10px] font-black border ${badge.bgClass} ${badge.borderClass}`}>
                {badge.label}
              </span>
              <span className="text-[10px] font-bold text-slate-500 truncate">
                {post.category}
              </span>
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-900 line-clamp-1">
              {post.title}
            </h4>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
      </div>
    );
  }

  return (
    <article
      id={`post-card-${post.id}`}
      onClick={onClick}
      className="bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between p-4 cursor-pointer group relative overflow-hidden"
    >
      {/* Top badges bar */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-1.5 mb-2">
          <div className="flex items-center gap-1.5">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${badge.bgClass} ${badge.borderClass}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${badge.dotClass}`}></span>
              {badge.label}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
              {post.category}
            </span>
          </div>

          {post.state && (
            <span className="text-[10px] font-semibold text-slate-600 flex items-center gap-0.5 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-150">
              <MapPin className="w-2.5 h-2.5 text-blue-600" />
              <span>{post.state}</span>
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#0B2545] leading-snug tracking-tight line-clamp-2 mb-2 font-sans">
          {post.title}
        </h3>

        {/* Metadata summary */}
        <div className="space-y-1.5 text-xs text-slate-600 mb-3 bg-slate-50/80 p-2.5 rounded-lg border border-slate-150">
          {post.department && (
            <div className="flex items-center gap-1.5 text-slate-700 font-medium truncate">
              <Building2 className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
              <span className="truncate">{post.department}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] pt-1 border-t border-slate-200/60">
            {post.totalVacancy ? (
              <span className="flex items-center gap-1 font-bold text-emerald-800">
                <Users className="w-3 h-3 text-emerald-600" />
                <span>Vacancy: {post.totalVacancy}</span>
              </span>
            ) : post.cutOffInfo ? (
              <span className="font-semibold text-blue-800 truncate">
                Cut Off: {post.cutOffInfo}
              </span>
            ) : (
              <span className="text-slate-500">Regular Update</span>
            )}

            {post.lastDate && (
              <span className="flex items-center gap-1 font-semibold text-red-700">
                <Calendar className="w-3 h-3 text-red-500" />
                <span>Last Date: {post.lastDate}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer Action */}
      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-[11px] text-slate-400 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        </span>
        <button
          id={`view-details-btn-${post.id}`}
          className="inline-flex items-center gap-1 font-bold text-[#0B2545] group-hover:text-red-600 transition-colors"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </article>
  );
};
