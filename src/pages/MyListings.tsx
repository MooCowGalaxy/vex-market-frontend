import useRequireAuth from '@/hooks/useRequireAuth.ts';

export default function MyListings() {
    const user = useRequireAuth();
    
    return (
        <div className="flex-1">
            <p>listings for {user.firstName}</p>
        </div>
    );
}