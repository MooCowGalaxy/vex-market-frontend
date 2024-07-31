import Error from '@/components/Error.tsx';

export default function NotFound() {
    return (
        <Error error={`The page you were looking for doesn't exist.`} home={true} />
    );
}