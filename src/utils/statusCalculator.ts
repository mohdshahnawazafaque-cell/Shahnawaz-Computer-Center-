import { Post, ComputedStatus } from '../types';

export function calculatePostStatus(post: Post): ComputedStatus {
  if (post.manualStatusOverride) {
    return post.manualStatusOverride;
  }

  if (post.type === 'admit_card') {
    return 'ADMIT CARD AVAILABLE';
  }

  if (post.type === 'result') {
    return 'RESULT AVAILABLE';
  }

  if (post.type === 'answer_key') {
    return 'ANSWER KEY OUT';
  }

  if (post.type === 'exam_date' || post.type === 'exam_city') {
    return 'EXAM UPCOMING';
  }

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  if (post.startDate && post.startDate > todayStr) {
    return 'UPCOMING';
  }

  if (post.lastDate) {
    if (post.lastDate < todayStr) {
      if (post.resultDate && post.resultDate <= todayStr) {
        return 'RESULT AVAILABLE';
      }
      if (post.admitCardDate && post.admitCardDate <= todayStr) {
        return 'ADMIT CARD AVAILABLE';
      }
      if (post.examDate && post.examDate >= todayStr) {
        return 'EXAM UPCOMING';
      }
      return 'APPLICATION CLOSED';
    }

    // Check if closing within 5 days
    const lastDateTime = new Date(post.lastDate).getTime();
    const diffDays = Math.ceil((lastDateTime - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays >= 0 && diffDays <= 5) {
      return 'CLOSING SOON';
    }

    return 'APPLY NOW';
  }

  return 'ACTIVE';
}

export function getStatusBadgeConfig(status: ComputedStatus): {
  label: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  dotClass: string;
} {
  switch (status) {
    case 'APPLY NOW':
      return {
        label: 'APPLY NOW',
        bgClass: 'bg-emerald-50 text-emerald-700 border-emerald-300',
        textClass: 'text-emerald-800',
        borderClass: 'border-emerald-400',
        dotClass: 'bg-emerald-500 animate-pulse',
      };
    case 'CLOSING SOON':
      return {
        label: 'CLOSING SOON',
        bgClass: 'bg-red-50 text-red-700 border-red-300',
        textClass: 'text-red-800',
        borderClass: 'border-red-400',
        dotClass: 'bg-red-500 animate-ping',
      };
    case 'ADMIT CARD AVAILABLE':
      return {
        label: 'ADMIT CARD OUT',
        bgClass: 'bg-amber-50 text-amber-800 border-amber-300',
        textClass: 'text-amber-900',
        borderClass: 'border-amber-400',
        dotClass: 'bg-amber-500',
      };
    case 'RESULT AVAILABLE':
      return {
        label: 'RESULT DECLARED',
        bgClass: 'bg-blue-50 text-blue-800 border-blue-300',
        textClass: 'text-blue-900',
        borderClass: 'border-blue-400',
        dotClass: 'bg-blue-500',
      };
    case 'ANSWER KEY OUT':
      return {
        label: 'ANSWER KEY OUT',
        bgClass: 'bg-teal-50 text-teal-800 border-teal-300',
        textClass: 'text-teal-900',
        borderClass: 'border-teal-400',
        dotClass: 'bg-teal-500',
      };
    case 'EXAM UPCOMING':
      return {
        label: 'EXAM SCHEDULED',
        bgClass: 'bg-purple-50 text-purple-800 border-purple-300',
        textClass: 'text-purple-900',
        borderClass: 'border-purple-400',
        dotClass: 'bg-purple-500',
      };
    case 'UPCOMING':
      return {
        label: 'COMING SOON',
        bgClass: 'bg-indigo-50 text-indigo-800 border-indigo-300',
        textClass: 'text-indigo-900',
        borderClass: 'border-indigo-400',
        dotClass: 'bg-indigo-500',
      };
    case 'APPLICATION CLOSED':
      return {
        label: 'APPLICATIONS CLOSED',
        bgClass: 'bg-slate-100 text-slate-700 border-slate-300',
        textClass: 'text-slate-800',
        borderClass: 'border-slate-300',
        dotClass: 'bg-slate-400',
      };
    case 'ACTIVE':
    default:
      return {
        label: 'ACTIVE',
        bgClass: 'bg-blue-50 text-blue-800 border-blue-300',
        textClass: 'text-blue-900',
        borderClass: 'border-blue-300',
        dotClass: 'bg-blue-500',
      };
  }
}
