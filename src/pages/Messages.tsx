import useRequireAuth from '@/hooks/useRequireAuth.ts';

export default function Messages() {
    const user = useRequireAuth();

    return (
        <>messages for {user.firstName}</>
    );
}