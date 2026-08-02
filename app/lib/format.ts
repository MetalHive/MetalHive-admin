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
