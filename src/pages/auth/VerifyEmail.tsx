import { CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button.tsx';
import { useEffect, useState } from 'react';
import { MoonLoader } from 'react-spinners';
import sendReq from '@/utils/sendReq.ts';
import { IoArrowForward } from 'react-icons/io5';

export default function VerifyEmail() {
    const { token } = useParams();
    const [loading, setLoading] = useState(true);
    const [tokenError, setTokenError] = useState('');

    useEffect(() => {
        sendReq(`/auth/verify`, 'POST', {
            token
        }).then(res => {
                setLoading(false);

                if (!res.fetched) {
                    setTokenError('Something went wrong while retrieving your account. Please try again later.');
                    return;
                }

                if (!res.ok) {
                    setTokenError(res.data.error);
                    return;
                }
            });
    }, [token]);

    if (loading) return (
        <>
            <CardHeader>
                <CardTitle className="text-xl">Verify Email</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-row justify-center">
                    <MoonLoader size={24} />
                </div>
            </CardContent>
        </>
    );

    if (tokenError.length > 0) return (
        <>
            <CardHeader>
                <CardTitle className="text-xl">Verify Email</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="mb-4">{tokenError}</p>
                <div className="flex flex-row justify-center">
                    <Link to="/auth/login"><Button>Log in <IoArrowForward className="inline ml-1" size={18}/></Button></Link>
                </div>
            </CardContent>
        </>
    );

    return (
        <>
            <CardHeader>
                <CardTitle className="text-xl">Verify Email</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="mb-4">Your email was successfully verified! You may now log in.</p>
                <div className="flex flex-row justify-center">
                    <Link to="/auth/login"><Button>Log in <IoArrowForward className="inline ml-1" size={18}/></Button></Link>
                </div>
            </CardContent>
        </>
    );
}