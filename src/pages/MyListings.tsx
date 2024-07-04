import useRequireAuth from '@/hooks/useRequireAuth.ts';

export default function MyListings() {
    const user = useRequireAuth();
    
    return (
        <>
            <p>listings for {user.firstName}</p>
        </>
    );
}