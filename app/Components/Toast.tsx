'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

type ToastVariant = 'success' | 'error' | 'info';

interface Toast {
    id: number;
    message: string;
    variant: ToastVariant;
}

interface ToastContextValue {
    toast: (message: string, variant?: ToastVariant) => void;
    success: (message: string) => void;
    error: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const DISMISS_AFTER_MS = 4000;

const VARIANTS: Record<ToastVariant, { bar: string; icon: React.ReactNode }> = {
    success: {
        bar: 'bg-green-500',
        icon: (
            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
        ),
    },
    error: {
        bar: 'bg-red-500',
        icon: (
            <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        ),
    },
    info: {
        bar: 'bg-[#C9A227]',
        icon: (
            <svg className="w-5 h-5 text-[#C9A227]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    },
};

const ToastItem: React.FC<{ toast: Toast; onDismiss: (id: number) => void }> = ({ toast, onDismiss }) => {
    const [leaving, setLeaving] = useState(false);

    useEffect(() => {
        // Start the exit animation slightly before removal so the card is not
        // yanked out from under the cursor.
        const exit = setTimeout(() => setLeaving(true), DISMISS_AFTER_MS - 200);
        const remove = setTimeout(() => onDismiss(toast.id), DISMISS_AFTER_MS);
        return () => {
            clearTimeout(exit);
            clearTimeout(remove);
        };
    }, [toast.id, onDismiss]);

    const variant = VARIANTS[toast.variant];

    return (
        <div
            role="status"
            aria-live="polite"
            className={`pointer-events-auto flex items-stretch overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg transition-all duration-200 ${
                leaving ? 'translate-x-2 opacity-0' : 'translate-x-0 opacity-100'
            }`}
        >
            <span className={`w-1 shrink-0 ${variant.bar}`} aria-hidden />
            <div className="flex items-center gap-3 px-4 py-3">
                <span className="shrink-0">{variant.icon}</span>
                <p className="text-sm text-[#17181a]">{toast.message}</p>
                <button
                    onClick={() => onDismiss(toast.id)}
                    aria-label="Dismiss notification"
                    className="ml-2 shrink-0 text-gray-400 hover:text-gray-600"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const dismiss = useCallback((id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const toast = useCallback((message: string, variant: ToastVariant = 'info') => {
        // Date.now() alone collides when two toasts fire in the same tick.
        const id = Date.now() + Math.random();
        setToasts((prev) => [...prev, { id, message, variant }]);
    }, []);

    const success = useCallback((message: string) => toast(message, 'success'), [toast]);
    const error = useCallback((message: string) => toast(message, 'error'), [toast]);

    return (
        <ToastContext.Provider value={{ toast, success, error }}>
            {children}
            <div className="pointer-events-none fixed bottom-6 right-6 z-[100] flex w-full max-w-sm flex-col gap-3">
                {toasts.map((t) => (
                    <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = (): ToastContextValue => {
    const ctx = useContext(ToastContext);
    if (!ctx) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return ctx;
};
