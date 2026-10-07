// Listings, bids and payouts are all priced in dollars across the seller and
// buyer apps. The admin dashboard rendered a naira sign against those same
// numbers, which read as a different currency rather than a formatting quirk.
export const CURRENCY_SYMBOL = '$';

export const formatCurrency = (
    value: number | string | null | undefined,
    { decimals = 2 }: { decimals?: number } = {}
): string => {
    const amount = typeof value === 'string' ? parseFloat(value) : value;
    if (amount === null || amount === undefined || Number.isNaN(amount)) {
        return '—';
    }
    return `${CURRENCY_SYMBOL}${amount.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    })}`;
};

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Formats an ISO datetime ("2025-01-05T13:42:00Z") or a bare date
 * ("2025-01-05") as "Jan 5, 2025", optionally with the time. A bare date is
 * parsed as a local calendar day so it does not shift to the previous day in
 * timezones west of UTC. Anything unparseable is returned as given.
 */
export const formatDate = (
    value: string | null | undefined,
    { withTime = false }: { withTime?: boolean } = {}
): string => {
    if (!value) return '—';

    const date = DATE_ONLY.test(value)
        ? (() => {
            const [y, m, d] = value.split('-').map(Number);
            return new Date(y, m - 1, d);
        })()
        : new Date(value);

    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
    });
};
