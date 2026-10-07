// Every backend response is the envelope {success, message, data, errors}.
// Paginated lists put the rows under data.<modelname>s (users, listings, bids,
// buyerprofiles…) next to data.pagination. These helpers are the single place
// that knows that shape, so a store never reaches into response.data.data by
// hand and silently gets `undefined` when the key is wrong.

export interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

interface Envelope<T> {
    success?: boolean;
    message?: string;
    data: T;
    errors?: unknown;
}

interface RawPagination {
    total?: number;
    page?: number;
    limit?: number;
    pages?: number;
    totalPages?: number;
}

/** Returns the `data` member of an enveloped response. */
export const unwrap = <T = unknown>(res: { data: unknown }): T =>
    (res.data as Envelope<T> | undefined)?.data as T;

/**
 * Returns `{items, pagination}` for a paginated list response, reading the
 * rows from `data[key]`. `totalPages` falls back to the older `pages` field.
 */
export const unwrapList = <T>(
    res: { data: unknown },
    key: string
): { items: T[]; pagination: Pagination } => {
    const data = (unwrap<Record<string, unknown>>(res) ?? {}) as Record<string, unknown>;
    const items = Array.isArray(data[key]) ? (data[key] as T[]) : [];
    const raw = (data.pagination ?? {}) as RawPagination;

    return {
        items,
        pagination: {
            total: raw.total ?? items.length,
            page: raw.page ?? 1,
            limit: raw.limit ?? (items.length || 20),
            totalPages: raw.totalPages ?? raw.pages ?? 1,
        },
    };
};
