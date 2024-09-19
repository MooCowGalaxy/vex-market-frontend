import Error from '@/components/Error.tsx';
import useTitle from '@/hooks/useTitle.ts';

export default function NotFound() {
    useTitle('404 Page Not Found - VEX Market');

    return (
        <Error error={`The page you were looking for doesn't exist.`} home={true} />
    );
}