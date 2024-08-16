import { useNavigate, useSearchParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input.tsx';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search as SearchIcon, Truck } from 'lucide-react';
import Loading from '@/components/Loading.tsx';
import { ListingProps } from '@/types.ts';
import sendReq from '@/utils/sendReq.ts';
import { useZipLocation } from '@/providers/LocationProvider.tsx';
import { Button } from '@/components/ui/button.tsx';

export default function Search() {
    const navigate = useNavigate();
    const { zip } = useZipLocation();
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('q');
    const searchPage = parseInt(searchParams.get('page') || '1') || 1;
    const [maxPage, setMaxPage] = useState(1);
    const [searchResults, setSearchResults] = useState<ListingProps[] | null>(null);
    const [error, setError] = useState('');

    const [searchInput, setSearchInput] = useState('');

    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);
    };

    const onSearchKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            navigate(`/search?q=${encodeURIComponent(searchInput)}`);
        }
    };

    const fetchListings = (page: number, query: string, zipCode: string | undefined) => {
        sendReq(`/listings/search?page=${page}`, 'POST', {
            query: query,
            zipCode,
            type: 'both'
        }).then(res => {
            if (!res.fetched) {
                setError('Something went wrong while fetching listings. Please try again later.');
                return;
            }

            if (!res.ok || !res.data?.success) {
                setError(res.data.error);
                return;
            }

            setSearchResults(res.data.listings);
            setMaxPage(res.data.estimatedPages);
        });
    };

    useEffect(() => {
        if (searchQuery) fetchListings(searchPage, searchQuery, zip?.toString());
    }, [searchPage, searchQuery, zip]);

    if (error) {
        return (
            <div className="flex-1 flex flex-row justify-center items-center">
                <div>
                    <h1 className="font-bold text-2xl text-center">Uh oh!</h1>
                    <p className="text-center mb-2">{error}</p>
                    <div className="mx-auto w-max">
                        <Button onClick={() => {
                            if (searchQuery) {
                                fetchListings(searchPage, searchQuery, zip?.toString());
                            }
                        }}>Retry</Button>
                    </div>
                </div>
            </div>
        );
    }

    if (!searchQuery) {
        return (
            <div className="flex-1 p-4 flex flex-col">
                <div className="w-160 mx-auto">
                    <h1 className="text-4xl font-bold text-center mb-6">Search</h1>
                    <div className="relative">
                        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                        <Input
                            type="search"
                            placeholder="Search here..."
                            className="py-4 pl-8 w-full text-lg"
                            maxLength={200}
                            value={searchInput}
                            onChange={onSearchChange}
                            onKeyDown={onSearchKey}
                        />
                    </div>
                </div>
            </div>
        );
    }

    const pageButtons = (
        <div className="flex flex-row justify-center items-center gap-2 mt-6 mb-4">
            <Button variant="ghost" size="sm" className="p-2 h-max" disabled={searchPage === 1} onClick={() => {
                navigate(`/search?q=${encodeURIComponent(searchQuery)}&page=1`);
            }}>
                <ChevronsLeft size={20} />
            </Button>
            <Button variant="ghost" size="sm" className="p-2 h-max" disabled={searchPage === 1} onClick={() => {
                navigate(`/search?q=${encodeURIComponent(searchQuery)}&page=${searchPage - 1}`);
            }}>
                <ChevronLeft size={20} />
            </Button>
            <div className="px-4">Page {searchPage} of {maxPage}</div>
            <Button variant="ghost" size="sm" className="p-2 h-max" disabled={searchPage === maxPage} onClick={() => {
                navigate(`/search?q=${encodeURIComponent(searchQuery)}&page=${searchPage + 1}`);
            }}>
                <ChevronRight size={20} />
            </Button>
            <Button variant="ghost" size="sm" className="p-2 h-max" disabled={searchPage === maxPage} onClick={() => {
                navigate(`/search?q=${encodeURIComponent(searchQuery)}&page=${maxPage}`);
            }}>
                <ChevronsRight size={20} />
            </Button>
        </div>
    );

    return (
        <div className="flex-1 p-4 flex flex-col">
            <div className="w-160 mx-auto flex-1 flex flex-col">
                <div className="text-2xl font-bold mt-8 mb-6">Search Results for "{searchQuery}"</div>
                {searchResults === null && <Loading/>}
                {searchResults !== null && searchResults.length === 0 && (
                    <>

                    </>
                )}
                {searchResults !== null && searchResults.length > 0 && (
                    <>
                        <div className="flex flex-col gap-4">
                            {searchResults.map((listing, i) => (
                                <div className="rounded-lg border p-4 flex flex-row justify-between gap-4 cursor-pointer h-52" key={i} onClick={() => {
                                    navigate(`/listing/${listing.id}`);
                                }}>
                                    <div className="flex-grow flex flex-col">
                                        <div className="flex-initial flex flex-row justify-between">
                                            <div
                                                className="font-bold overflow-hidden text-ellipsis whitespace-nowrap">{listing.title}</div>
                                            <div className="text-neutral-500 ml-2">${listing.price}</div>
                                        </div>
                                        <div className="flex-initial flex flex-row items-center text-neutral-500 text-sm mb-4">
                                            {['shipping', 'both'].includes(listing.type)
                                                && <Truck className="mr-1" size={16}/>}
                                            <p>{listing.zipFriendly}</p>
                                        </div>
                                        <div className="overflow-hidden text-ellipsis line-clamp-4 leading-6 h-24">
                                            {listing.description}
                                        </div>
                                    </div>
                                    <div className="flex-none rounded-sm overflow-hidden">
                                        <img className="object-cover w-60 h-48" src={listing.images[0]}
                                             alt="Listing image"/>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {pageButtons}
                    </>
                )}
            </div>
        </div>
    );
}