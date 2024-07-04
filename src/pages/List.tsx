import useRequireAuth from '@/hooks/useRequireAuth.ts';

export default function List() {
    const user = useRequireAuth();

    return (
        <>create listing for {user.firstName}</>
    );
}