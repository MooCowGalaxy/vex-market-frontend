import { ListingProps } from '@/types.ts';
import { Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ListingCard({ listing }: { listing: ListingProps }) {
    const navigate = useNavigate();

    return (
        <div onClick={() => navigate(`/listing/${listing.id}`)} className="w-60 rounded-md border overflow-hidden cursor-pointer">
            <img className="object-cover w-60 h-48" src={listing.images[0]} alt="Listing image" />
            <div className="p-2">
                <div className="flex flex-row justify-between">
                    <div
                        className="font-bold overflow-hidden text-ellipsis whitespace-nowrap">{listing.title}</div>
                    <div className="text-neutral-500 ml-2">${listing.price}</div>
                </div>
                <div className="flex flex-row items-center text-neutral-500 text-sm">
                    {['shipping', 'both'].includes(listing.type)
                        && <Truck className="mr-1" size={16} />}
                    {/*['local', 'both'].includes(listing.type)
                        && <Home className="mr-1" size={16} />*/}

                    <p>{listing.zipFriendly}</p>
                </div>
            </div>
        </div>
    );
}