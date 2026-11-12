import { SkeletonBlock, SkeletonText } from "./PageSkeleton";

export default function AIPlannerSkeleton() {
  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <div className="border-b bg-white px-6 py-4">
        <SkeletonBlock className="h-6 w-48 mb-1" />
        <SkeletonBlock className="h-3 w-72" />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left panel — form */}
        <div className="w-full border-r bg-white p-6 space-y-5 md:w-2/5 lg:w-96">
          {/* Provider selector */}
          <div className="rounded-xl border border-slate-100 p-3 space-y-2">
            <SkeletonBlock className="h-3 w-20" />
            <SkeletonBlock className="h-9 w-full rounded-lg" />
          </div>
          {/* Form fields */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <SkeletonBlock className="h-3 w-24" />
              <SkeletonBlock className="h-10 w-full rounded-lg" />
            </div>
          ))}
          <SkeletonBlock className="h-11 w-full rounded-xl" />
        </div>

        {/* Right panel — output */}
        <div className="flex-1 bg-slate-50 p-6 space-y-4">
          <SkeletonBlock className="h-5 w-48" />
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonText key={i} lines={i % 3 === 0 ? 1 : 3} />
          ))}
        </div>
      </div>
    </div>
  );
}
