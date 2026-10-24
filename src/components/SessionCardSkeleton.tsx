// src/components/SessionCardSkeleton.tsx
// Shimmer placeholder card shown while sessions are loading.
export function SessionCardSkeleton() {
  return (
    <div className="glass-card p-5 flex flex-col gap-3 pointer-events-none" aria-hidden="true">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2">
          <div className="skeleton h-5 w-3/4" />
          <div className="skeleton h-3 w-full" />
          <div className="skeleton h-3 w-2/3" />
        </div>
        <div className="skeleton h-5 w-20 rounded-full flex-shrink-0" />
      </div>
      <div className="flex items-center gap-4 mt-1">
        <div className="skeleton h-3 w-12" />
        <div className="skeleton h-3 w-20" />
      </div>
      <div className="skeleton h-9 w-full rounded-xl mt-1" />
    </div>
  );
}

export default SessionCardSkeleton;
