// Shared phantom skeleton primitives — match the real page layout shapes

export const SkeletonBlock = ({
  className = "",
}: {
  className?: string;
}) => (
  <div className={`skeleton-shimmer rounded-lg ${className}`} />
);

export const SkeletonText = ({
  lines = 3,
  className = "",
}: {
  lines?: number;
  className?: string;
}) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <SkeletonBlock
        key={i}
        className={`h-4 ${i === lines - 1 ? "w-3/4" : "w-full"}`}
      />
    ))}
  </div>
);

export const SkeletonCard = ({ className = "" }: { className?: string }) => (
  <div className={`rounded-2xl border border-slate-100 bg-white p-5 ${className}`}>
    <div className="flex items-center gap-3 mb-4">
      <SkeletonBlock className="h-10 w-10 rounded-xl" />
      <div className="flex-1 space-y-2">
        <SkeletonBlock className="h-4 w-32" />
        <SkeletonBlock className="h-3 w-20" />
      </div>
    </div>
    <SkeletonText lines={3} />
  </div>
);
