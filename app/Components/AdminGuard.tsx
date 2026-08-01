'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import useAuthStore from '@/app/store/useAuthStore';

const PUBLIC_PATHS = ['/login'];

// Every admin page sat behind no guard at all: an unauthenticated visitor, or
// any signed-in buyer or seller, could load the dashboard chrome. The API
// refuses their data with a 403, so nothing leaked, but the app looked like it
// had let them in. This blocks the render until the backend confirms the
// session belongs to an admin.
export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { isAuthenticated, checkAuth } = useAuthStore();
    const [checked, setChecked] = useState(false);

    const isPublic = PUBLIC_PATHS.includes(pathname);

    useEffect(() => {
        let active = true;
        (async () => {
            await checkAuth();
            if (active) setChecked(true);
        })();
        return () => {
            active = false;
        };
    }, [pathname, checkAuth]);

    useEffect(() => {
        if (checked && !isAuthenticated && !isPublic) {
            router.replace('/login');
        }
    }, [checked, isAuthenticated, isPublic, router]);

    if (isPublic) return <>{children}</>;

    if (!checked || !isAuthenticated) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-sm text-gray-500">Checking your session…</p>
            </div>
        );
    }

    return <>{children}</>;
}
