import Loading from '@/components/Loading.tsx';
import { useEffect } from 'react';
import sendReq from '@/utils/sendReq.ts';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useUser } from '@/providers/UserProvider.tsx';
import useTitle from '@/hooks/useTitle.ts';

export default function Logout() {
    useTitle('Logging out... - VEX Market');
    const user = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        sendReq('/auth/logout', 'POST')
            .then(() => {
                user.updateUser()
                    .then(() => {
                        navigate('/');
                        toast.success('Logged out!');
                    });
            });
    }, [navigate, user]);

    return (
        <Loading fullscreen={true} />
    );
}