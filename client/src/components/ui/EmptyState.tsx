import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {/* Icon container */}
      <div
        className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400"
        aria-hidden="true"
      >
        <Icon className="h-7 w-7" />
      </div>

      {/* Title */}
      <h3 className="mt-4 text-base font-semibold text-zinc-700">
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-zinc-500 leading-relaxed">
          {description}
        </p>
      )}

      {/* Action slot */}
      {action && (
        <div className="mt-5 flex items-center justify-center">
          {action}
        </div>
      )}
    </div>
  );
}
