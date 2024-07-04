import { Card } from '@/components/ui/card';
import { Link, Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import { useUser } from '@/providers/UserProvider.tsx';
import { useEffect } from 'react';
import { Package2 } from 'lucide-react';

export default function AuthLayout() {
    const user = useUser();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        if (user.loggedIn) navigate(searchParams.get('to') || '/');
    }, [navigate, searchParams, user]);

    return (
        <div className="flex flex-col w-screen h-screen">
            <div className="flex h-16 items-center gap-4 border-b bg-background px-6">
                <nav
                    className="text-lg font-medium flex flex-row items-center gap-6">
                    <Link
                        to="/"
                        className="flex items-center gap-2 text-lg font-semibold md:text-base"
                    >
                        <Package2 className="h-6 w-6" />
                        <span className="sr-only">VEX Market</span>
                    </Link>
                </nav>
            </div>
            <div className="flex-1 flex flex-row items-center">
                <div className="mx-auto max-w-sm">
                    <Card>
                        <Outlet/>
                    </Card>
                </div>
            </div>
        </div>

);
}