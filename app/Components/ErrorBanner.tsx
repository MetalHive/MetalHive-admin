import { AlertCircle } from 'lucide-react';

/**
 * Small red banner for a store's `error`. Tables rendered "No … found" for a
 * failed request, which read as an empty dataset rather than a broken call;
 * this makes the failure visible where the data would have been.
 */
export default function ErrorBanner({ message, className = '' }: { message: string | null | undefined; className?: string }) {
    if (!message) return null;
    return (
        <div
            role="alert"
            className={`flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 ${className}`}
        >
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{message}</span>
        </div>
    );
}
