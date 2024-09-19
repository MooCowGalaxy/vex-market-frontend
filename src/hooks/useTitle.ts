import { useUser } from '@/providers/UserProvider.tsx';
import { useEffect } from 'react';

export default function useTitle(title?: string) {
    const user = useUser();

    useEffect(() => {
        const notifications = user.notifications;
        const t = title ? title : 'VEX Market';

        if (notifications) {
            document.title = `(${notifications}) ${t}`;
        } else {
            document.title = t;
        }
    }, [user, title]);
}