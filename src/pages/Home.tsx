import LocationButton from '@/components/LocationButton.tsx';
import { useEffect, useState } from 'react';
import { ListingProps } from '@/types.ts';
import sendReq from '@/utils/sendReq.ts';
import Loading from '@/components/Loading.tsx';
import { Button } from '@/components/ui/button.tsx';
import ListingCard from '@/components/ListingCard.tsx';
import EmptyListingCard from '@/components/EmptyListingCard.tsx';
import { useZipLocation } from '@/providers/LocationProvider.tsx';

export default function Home() {
    const { zip } = useZipLocation();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [listings, setListings] = useState<{ local: ListingProps[], shipping: ListingProps[] }>({ local: [], shipping: [] });

    const reloadListing = (z: string | null) => {
        setLoading(true);

        sendReq(z ? `/listings?zip=${z}` : '/listings', 'GET')
            .then(res => {
                if (!res.fetched) {
                    setError('Something went wrong while fetching listings. Please try again later.');
                    return;
                }

                if (!res.ok || !res.data?.success) {
                    setError(res.data.error);
                    return;
                }

                setLoading(false);
                setListings({
                    local: res.data.local,
                    shipping: res.data.shipping
                });
            });
    };

    useEffect(() => {
        reloadListing(zip);
    }, [zip]);

    if (error.length > 0) {
        return (
            <div className="flex-1 flex flex-row justify-center items-center">
                <div>
                    <h1 className="font-bold text-2xl text-center">Uh oh!</h1>
                    <p className="text-center mb-2">{error}</p>
                    <div className="mx-auto w-max">
                        <Button onClick={() => reloadListing(zip)}>Retry</Button>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <Loading text="Loading listings..." />
        );
    }

    return (
        <div className="flex-1 p-4 flex flex-col">
            <div className="flex flex-row justify-between mb-6">
                <h1 className="text-2xl font-bold">Browse Listings</h1>
                <LocationButton/>
            </div>
            <div className="mb-6">
                <h2 className="text-xl font-bold mb-2">Local Listings</h2>
                <div className="w-full overflow-x-auto">
                    <div className="w-max flex flex-row gap-2">
                        {listings.local.length > 0
                            ? listings.local.map((local, i) => <ListingCard listing={local} key={i} />)
                            : <EmptyListingCard/>
                        }
                    </div>
                </div>
            </div>
            <div className="mb-4">
                <h2 className="text-xl font-bold mb-2">Shipping Listings</h2>
                <div className="w-full overflow-x-auto">
                    <div className="w-max flex flex-row gap-2">
                        {listings.shipping.length > 0
                            ? listings.shipping.map((shipping, i) => <ListingCard listing={shipping} key={i} />)
                            : <EmptyListingCard/>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}