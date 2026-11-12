import { SkeletonBlock, SkeletonText } from "./PageSkeleton";

export default function ListPageSkeleton({ cols = 3 }: { cols?: number }) {
  return (
    <div className="flex h-screen flex-col">
      {/* Page header */}
      <div className="border-b bg-white px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SkeletonBlock className="h-5 w-5 rounded" />
          <div className="space-y-1.5">
            <SkeletonBlock className="h-5 w-36" />
            <SkeletonBlock className="h-3 w-24" />
          </div>
        </div>
        <SkeletonBlock className="h-8 w-24 rounded-lg" />
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-auto p-6">
        <div
          className="grid gap-5"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: cols * 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-100 bg-white p-5 space-y-3"
            >
              <SkeletonBlock className="h-32 w-full rounded-xl" />
              <SkeletonBlock className="h-5 w-3/4" />
              <SkeletonText lines={2} />
              <SkeletonBlock className="h-8 w-24 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
