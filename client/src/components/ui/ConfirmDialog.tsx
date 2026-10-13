import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Loader2 } from 'lucide-react';

export interface ConfirmDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  description?: string;
  confirmLabel?: string; // default "Delete"
  cancelLabel?: string; // default "Cancel"
  variant?: 'danger' | 'default'; // danger = red confirm button
  loading?: boolean;
}

export default function ConfirmDialog({
  open,
  onConfirm,
  onCancel,
  title,
  description,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  variant = 'danger',
  loading = false,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  // Prevent background scrolling when open
  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  // Handle Escape key to cancel
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        if (!loading) {
          onCancel();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, loading, onCancel]);

  // Focus management when dialog opens
  useEffect(() => {
    if (open) {
      confirmButtonRef.current?.focus();
    }
  }, [open]);

  if (!open) return null;

  const isDanger = variant === 'danger';

  const dialogContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        aria-hidden="true"
        onClick={() => {
          if (!loading) {
            onCancel();
          }
        }}
      />

      {/* Modal Dialog Card */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby={description ? 'confirm-dialog-description' : undefined}
        className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="confirm-dialog-title"
          className="text-lg font-semibold text-zinc-900"
        >
          {title}
        </h2>

        {description && (
          <p
            id="confirm-dialog-description"
            className="mt-2 text-sm text-zinc-500 leading-relaxed"
          >
            {description}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={onCancel}
            className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-2xs hover:bg-zinc-50 focus:outline-hidden focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelLabel}
          </button>

          <button
            ref={confirmButtonRef}
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white shadow-2xs transition-colors focus:outline-hidden focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
              isDanger
                ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                : 'bg-zinc-900 hover:bg-zinc-800 focus:ring-zinc-900'
            }`}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin text-white" aria-hidden="true" />}
            <span>{confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(dialogContent, document.body);
}
