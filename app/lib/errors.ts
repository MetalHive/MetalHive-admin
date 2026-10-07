import axios from 'axios';

interface ApiErrorBody {
    message?: string;
    errors?: unknown;
}

/**
 * Extracts a human-readable message from a thrown value. The backend puts its
 * message in the envelope (`response.data.message`), so that wins; anything
 * else (network failure, non-axios error) falls back to the caller's text
 * rather than surfacing "Request failed with status code 500".
 */
export const getErrorMessage = (error: unknown, fallback: string): string => {
    if (axios.isAxiosError(error)) {
        const body = error.response?.data as ApiErrorBody | undefined;
        if (body?.message) return body.message;
    }
    return fallback;
};

/** True when the error is an HTTP response with the given status. */
export const isHttpStatus = (error: unknown, status: number): boolean =>
    axios.isAxiosError(error) && error.response?.status === status;
