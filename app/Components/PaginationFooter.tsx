import type { Pagination } from '@/app/lib/unwrap';

interface PaginationFooterProps {
    pagination: Pagination;
    onPageChange: (page: number) => void;
    className?: string;
}

/** The "Showing a-b of n · Prev / Next" strip every table ends with. */
export default function PaginationFooter({ pagination, onPageChange, className = '' }: PaginationFooterProps) {
    const { page, limit, total, totalPages } = pagination;
    const start = total === 0 ? 0 : (page - 1) * limit + 1;
    const end = Math.min(page * limit, total);

    return (
        <div className={`p-4 border-t border-gray-200 text-xs text-gray-500 flex justify-between items-center ${className}`}>
            <span>Showing {start}-{end} of {total}</span>
            <div className="flex gap-1">
                <button
                    disabled={page <= 1}
                    onClick={() => onPageChange(page - 1)}
                    className="px-2 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50"
                >
                    Prev
                </button>
                <button
                    disabled={page >= totalPages}
                    onClick={() => onPageChange(page + 1)}
                    className="px-2 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
