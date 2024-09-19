import { useUser } from '@/providers/UserProvider.tsx';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function useRequireAuth() {
    const user = useUser();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user.loggedIn) {
            navigate(`/auth/login?to=${encodeURIComponent(location.pathname)}`);
        }
    }, [user.loggedIn, location.pathname, navigate]);

    return user;
}
