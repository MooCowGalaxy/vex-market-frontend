import Loading from '@/components/Loading.tsx';
import { ListingProps } from '@/types.ts';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import sendReq from '@/utils/sendReq.ts';
import ImageGallery from 'react-image-gallery';
import '@/assets/react-gallery.css';
import { Button } from '@/components/ui/button.tsx';
import { Archive, ArrowLeft, ChevronLeft, ChevronRight, MapPin, SendHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input.tsx';
import { MoonLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import { useUser } from '@/providers/UserProvider.tsx';
import Error from '@/components/Error.tsx';

const deliveryText: { [key: string]: string } = {
    shipping: 'Shipping only',
    local: 'Pickup only',
    both: 'Shipping or pickup'
};

export default function ListingDetails() {
    const user = useUser();
    const { id: listingId } = useParams();
    const navigate = useNavigate();
    const [listing, setListing] = useState<ListingProps | null>(null);
    const [error, setError] = useState('');

    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        sendReq(`/listings/${listingId}`, 'GET')
            .then(res => {
                if (!res.fetched) {
                    setError('Something went wrong while fetching this listing. Please try again later.');
                    return;
                }

                if (!res.ok || !res.data?.success) {
                    setError(res.data.error);
                    return;
                }

                setListing(res.data);
            });
    }, [listingId]);

    const onMessageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') onSubmit();
    };

    const onSubmit = () => {
        if (message.length === 0) return;
        if (!listingId) return;

        setLoading(true);

        sendReq('/messages', 'POST', {
            postId: parseInt(listingId),
            initialMessage: message
        }).then(res => {
            if (!res.fetched) {
                toast.error('Something went wrong while sending your message. Please try again later.');
                setLoading(false);
                return;
            }

            if (!res.ok || !res.data?.success) {
                toast.error(res.data.error);
                setLoading(false);
                return;
            }

            navigate(`/messages/${res.data.chatId}`);
        });
    };

    if (error.length > 0) {
        return (
            <Error error={error} />
        );
    }

    if (listing === null) return (
        <div className="flex-1 flex flex-col justify-center">
            <Loading text="Loading listing details..." />
        </div>
    );

    const isAuthor = user.userId === listing.authorId;

    return (
        <>
            <div className="mx-6 md:mx-12 my-6">
                <div className="flex flex-row items-center w-max cursor-pointer" onClick={() => navigate(-1)}>
                    <ArrowLeft size={18} className="mr-1" /> Back
                </div>
            </div>
            <div className="flex-1 p-6 md:p-12 md:pt-0 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <div className="sticky top-20 bg-white">
                        <ImageGallery
                            items={listing.images.map(image => ({ original: image, thumbnail: image }))}
                            renderLeftNav={(onClick, disabled) => (
                                <Button size="sm" variant="ghost" className="absolute z-10 image-gallery-left-nav"
                                        onClick={onClick} disabled={disabled}>
                                    <ChevronLeft/>
                                </Button>
                            )}
                            renderRightNav={(onClick, disabled) => (
                                <Button size="sm" variant="ghost" className="absolute z-10 image-gallery-right-nav"
                                        onClick={onClick} disabled={disabled}>
                                    <ChevronRight/>
                                </Button>
                            )}
                            renderPlayPauseButton={() => (
                                <></>
                            )}
                            renderFullscreenButton={() => (
                                <></>
                            )}
                        />
                    </div>
                </div>
                <div>
                    {listing.archived && <div className="flex flex-row items-center text-yellow-500 mb-4">
                        <Archive className="stroke-yellow-500 mr-2" size={18}/>
                        Archived
                    </div>}
                    <div className="flex flex-row items-center text-neutral-500 text-md -ml-0.5 mb-1">
                        <MapPin size={20}/>
                        <p className="ml-1">{listing.zipFriendly}</p>
                    </div>
                    <h1 className="text-4xl font-bold text-neutral-900 mb-4">
                        {listing.title}
                    </h1>
                    <p className="text-2xl font-semibold text-neutral-900 mb-4">${parseFloat(listing.price.toString()).toFixed(2)}</p>
                    <p className="mt-6 font-bold text-lg">About this item</p>
                    <div className="font-reading mb-4">
                        {listing.description.split('\n').map((text, i) => <p className="mb-1 text-neutral-700"
                                                                             key={i}>{text}</p>)}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="font-bold">Condition</p>
                            <p>{listing.condition}</p>
                        </div>
                        <div>
                            <p className="font-bold">Delivery method</p>
                            <p>{deliveryText[listing.type]}</p>
                        </div>
                    </div>
                    {!listing.archived && !isAuthor && <div className="sticky bg-white bottom-6 rounded-lg shadow border mt-4 p-2">
                        <p className="text-sm font-semibold mb-2">Send a message to the seller</p>
                        <div className="flex flex-row gap-2">
                            {user.loggedIn && <>
                                <Input
                                    className="flex-1"
                                    type="text"
                                    required
                                    value={message}
                                    onChange={onMessageInput}
                                    onKeyDown={onKeyDown}
                                    disabled={loading}
                                    maxLength={2000}
                                />
                                <Button size="sm" disabled={loading || message.length === 0} onClick={onSubmit}>
                                    {
                                        !loading
                                            ? <SendHorizontal/>
                                            : <MoonLoader size={16} color='white'/>
                                    }
                                </Button>
                            </>}
                            {!user.loggedIn &&
                                <Button size="sm" className="w-full" onClick={() => navigate('/auth/register')}>
                                    Create an account
                                </Button>}
                        </div>
                    </div>}
                    {!listing.archived && isAuthor && <Button className="w-full mt-4" onClick={() => {
                        navigate(`/listing/${listingId}/edit`);
                    }}>Edit Post</Button>}
                    {listing.archived && <div className="w-full mt-4 rounded-lg px-4 py-2 bg-secondary cursor-not-allowed text-center">
                        Post is archived
                    </div>}
                </div>
            </div>
        </>
    );
}