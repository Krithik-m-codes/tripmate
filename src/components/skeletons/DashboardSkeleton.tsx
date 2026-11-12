import { SkeletonBlock, SkeletonText } from "./PageSkeleton";

export default function DashboardSkeleton() {
  return (
    <div className="h-screen overflow-auto p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <SkeletonBlock className="h-3 w-28" />
          <SkeletonBlock className="h-8 w-48" />
        </div>
        <SkeletonBlock className="h-10 w-28 rounded-xl" />
      </div>

      {/* Hero banner */}
      <SkeletonBlock className="h-52 w-full rounded-2xl md:h-64" />

      {/* Weather card */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5">
        <div className="flex items-center justify-between mb-4">
          <SkeletonBlock className="h-5 w-36" />
          <SkeletonBlock className="h-8 w-8 rounded-full" />
        </div>
        <SkeletonBlock className="h-12 w-28 mb-2" />
        <SkeletonBlock className="h-4 w-40 mb-2" />
        <div className="flex gap-4">
          <SkeletonBlock className="h-3 w-24" />
          <SkeletonBlock className="h-3 w-24" />
          <SkeletonBlock className="h-3 w-24" />
        </div>
      </div>

      {/* 3-col grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-2xl border border-slate-100 bg-white overflow-hidden">
            <div className="border-b bg-slate-50 px-4 py-3 flex items-center gap-2">
              <SkeletonBlock className="h-5 w-5 rounded" />
              <SkeletonBlock className="h-4 w-32" />
            </div>
            <div className="p-4 space-y-3">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="flex items-center gap-3">
                  <SkeletonBlock className="h-14 w-14 shrink-0 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <SkeletonBlock className="h-4 w-full" />
                    <SkeletonBlock className="h-3 w-20" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
