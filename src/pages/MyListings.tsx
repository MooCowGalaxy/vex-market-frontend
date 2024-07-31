import useRequireAuth from '@/hooks/useRequireAuth.ts';
import { useEffect, useState } from 'react';
import sendReq from '@/utils/sendReq.ts';
import toast from 'react-hot-toast';
import Loading from '@/components/Loading.tsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.tsx';
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu.tsx';
import { EllipsisVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx';
import ListingTableDialog from '@/components/ListingTableDialog.tsx';

type PartialListing = {
    id: number;
    title: string;
    description: string;
    price: number;
    lastUpdated: number;
    archived: boolean;
};

export default function MyListings() {
    const user = useRequireAuth();
    const navigate = useNavigate();
    const [tab, setTab] = useState('active');
    const [reload, setReload] = useState(false);
    const [loading, setLoading] = useState(true);
    const [listings, setListings] = useState<PartialListing[]>([]);
    const [archiveId, setArchiveId] = useState<number | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState<'archive' | 'delete'>('archive');

    useEffect(() => {
        setLoading(true);
        setListings([]);

        sendReq(`/listings/self?type=${tab}`, 'GET')
            .then(res => {
                if (!res.fetched) {
                    toast.error('Something went wrong while fetching this listing. Please try again later.');
                    return;
                }

                if (!res.ok || !res.data?.success) {
                    toast.error(res.data.error);
                    return;
                }

                setLoading(false);
                setListings(res.data.listings);
            });
    }, [user, tab, reload]);

    const tabsElement = <Tabs defaultValue="active" value={tab} onValueChange={setTab} className="w-[400px] mb-4">
        <TabsList>
            <TabsTrigger value="active" disabled={loading}>Active</TabsTrigger>
            <TabsTrigger value="archived" disabled={loading}>Archived</TabsTrigger>
        </TabsList>
    </Tabs>;

    if (loading) {
        return (
            <div className="flex-1 p-4 flex flex-col">
                <h1 className="text-2xl font-bold mb-6">My Listings</h1>

                {tabsElement}

                <div className="flex-1 flex flex-col justify-center">
                    <Loading/>
                </div>
            </div>

        );
    }

    return (
        <div className="flex-1 p-4">
            <h1 className="text-2xl font-bold mb-6">My Listings</h1>

            {tabsElement}

            <div className="rounded border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[96px] pl-4">Listing ID</TableHead>
                            <TableHead className="w-[160px]">Title</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="w-20">Price</TableHead>
                            <TableHead className="w-[192px]">Last Updated</TableHead>
                            <TableHead className="w-12" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {listings.map(listing => (
                            <TableRow key={listing.id}>
                                <TableCell className="font-medium pl-4">{listing.id}</TableCell>
                                <TableCell className="max-w-0 overflow-hidden text-ellipsis whitespace-nowrap">{listing.title}</TableCell>
                                <TableCell className="max-w-0 overflow-hidden text-ellipsis whitespace-nowrap">{listing.description}</TableCell>
                                <TableCell>${listing.price}</TableCell>
                                <TableCell>{new Date(listing.lastUpdated * 1000).toLocaleString()}</TableCell>
                                <TableCell className="flex flex-row items-center justify-center p-4">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <EllipsisVertical size={20} />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="mr-2">
                                            <DropdownMenuItem className="cursor-pointer" onClick={() => {
                                                navigate(`/listing/${listing.id}`);
                                            }}>View</DropdownMenuItem>
                                            <DropdownMenuItem className="cursor-pointer" onClick={() => {
                                                navigate(`/listing/${listing.id}/edit`);
                                            }}>Edit</DropdownMenuItem>
                                            <DropdownMenuItem className="cursor-pointer" onClick={() => {
                                                setArchiveId(listing.id);
                                                setDialogType('archive');
                                                setDialogOpen(true);
                                            }}>{tab === 'active' ? 'Archive' : 'Unarchive'}</DropdownMenuItem>
                                            <DropdownMenuItem className="cursor-pointer text-red-500 focus:text-red-500" onClick={() => {
                                                setArchiveId(listing.id);
                                                setDialogType('delete');
                                                setDialogOpen(true);
                                            }}>Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {
                    listings.length === 0 &&
                    <div className="w-full text-center text-neutral-400 my-4">
                        No listings were found.
                    </div>
                }
            </div>
            <ListingTableDialog listingId={archiveId} type={dialogType} open={dialogOpen} setOpen={setDialogOpen} reload={setReload} archive={tab !== 'archived'} />
        </div>
    );
}