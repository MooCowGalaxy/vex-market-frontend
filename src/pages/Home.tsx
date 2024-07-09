import LocationButton from '@/components/LocationButton.tsx';

export default function Home() {
    return (
        <div className="flex-1 p-4">
            <div className="flex flex-row justify-between">
                <h1 className="text-2xl font-bold">Browse Listings</h1>
                <LocationButton />
            </div>
        </div>
    );
}