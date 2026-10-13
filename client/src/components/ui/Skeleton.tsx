interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded bg-zinc-200 ${className}`}
    />
  );
}

const WIDTH_CLASSES = ['w-full', 'w-[90%]', 'w-[75%]', 'w-[85%]', 'w-[65%]'];

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="flex flex-col gap-2.5 w-full" aria-hidden="true">
      {Array.from({ length: lines }).map((_, index) => {
        const widthClass = WIDTH_CLASSES[index % WIDTH_CLASSES.length];
        return (
          <Skeleton
            key={index}
            className={`h-3.5 ${widthClass}`}
          />
        );
      })}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div
      className="rounded-xl border border-zinc-200 bg-white p-4 shadow-xs"
      aria-hidden="true"
    >
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
      </div>
    </div>
  );
}
