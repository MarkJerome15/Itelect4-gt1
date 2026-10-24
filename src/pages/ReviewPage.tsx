// src/pages/ReviewPage.tsx
// AI Review Page for Peer Tutoring Platform (Session 11 / GT5).
// Sends project or tutoring description to Gemini via POST /api/ai and displays structured feedback.
// Professional UI with Lucide icons and zero emojis.

import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Sparkles,
  Send,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
  Check,
  ListPlus,
} from 'lucide-react';
import type { AiReview } from '../types';
import { askAi } from '../api/client';
import { reviewFormSchema, type ReviewFormValues } from '../schemas/reviewSchema';

const READINESS_CONFIG: Record<
  AiReview['readiness'],
  { label: string; badgeClass: string; icon: typeof CheckCircle2 }
> = {
  ready: {
    label: 'Ready for Submission',
    badgeClass:
      'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800',
    icon: CheckCircle2,
  },
  almost: {
    label: 'Almost Ready',
    badgeClass:
      'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800',
    icon: AlertTriangle,
  },
  'not-yet': {
    label: 'Not Ready Yet',
    badgeClass:
      'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800',
    icon: XCircle,
  },
};

export function ReviewPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: { prompt: '' },
  });

  const promptValue = watch('prompt') || '';

  const review = useMutation({
    mutationFn: askAi,
  });

  const onSubmit = (values: ReviewFormValues): void => {
    review.mutate(values.prompt);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* ── Page Header ── */}
      <div className="space-y-1 pb-4 border-b border-gray-200/80 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            AI Project & Submission Review
          </h1>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Describe your peer tutoring platform project or features to receive automated Gemini AI feedback before submission.
        </p>
      </div>

      {/* ── Input Form ── */}
      <div className="glass-card p-6 rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="prompt"
                className="text-sm font-semibold text-gray-900 dark:text-white"
              >
                Project Description
              </label>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {promptValue.trim().length} / 2000 characters
              </span>
            </div>

            <textarea
              id="prompt"
              rows={6}
              {...register('prompt')}
              aria-invalid={errors.prompt ? true : undefined}
              placeholder="Describe what your app does, how it is built, features implemented (such as tutor/tutee accounts, session creation, bookings), technologies used, and deployment status..."
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/60 transition resize-y leading-relaxed"
            />

            {errors.prompt && (
              <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                {errors.prompt.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="submit"
              disabled={review.isPending}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-500 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {review.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Reviewing with Gemini...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Review My Project</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Error notice */}
        {review.isError && (
          <div
            role="alert"
            className="mt-4 p-4 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/80 dark:bg-rose-950/40 text-sm text-rose-700 dark:text-rose-300"
          >
            {review.error instanceof Error
              ? review.error.message
              : 'The AI service did not answer properly. Try again.'}
          </div>
        )}
      </div>

      {/* ── Structured Review Result ── */}
      {review.data && (
        <div className="glass-card p-6 md:p-8 rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-md space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {/* Header & Readiness Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-gray-800">
            <div className="space-y-0.5">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Evaluation Report
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Generated by Gemini AI based on your project description
              </p>
            </div>

            {(() => {
              const cfg = READINESS_CONFIG[review.data.readiness] || READINESS_CONFIG['almost'];
              const Icon = cfg.icon;
              return (
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border self-start sm:self-auto ${cfg.badgeClass}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cfg.label}</span>
                </span>
              );
            })()}
          </div>

          {/* Summary */}
          <div className="space-y-1.5">
            <h3 className="text-xs uppercase font-bold tracking-wider text-gray-400">
              Project Summary
            </h3>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-relaxed bg-gray-50 dark:bg-gray-800/40 p-3.5 rounded-xl border border-gray-100 dark:border-gray-800">
              {review.data.summary}
            </p>
          </div>

          {/* Strengths */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Strengths & Demonstrated Capabilities
              </h3>
            </div>
            <ul className="space-y-2 pl-2">
              {review.data.strengths.map((s, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-xs text-gray-700 dark:text-gray-300"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Improvements */}
          <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <ListPlus className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Recommendations Before Final Submission
              </h3>
            </div>
            <ul className="space-y-2 pl-2">
              {review.data.improvements.map((imp, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-xs text-gray-700 dark:text-gray-300"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span>{imp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReviewPage;
