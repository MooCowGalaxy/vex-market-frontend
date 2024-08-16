import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog.tsx';
import { Button } from '@/components/ui/button.tsx';
import { useState } from 'react';
import sendReq from '@/utils/sendReq.ts';
import toast from 'react-hot-toast';

export default function ListingTableDialog({ listingId, type, open, setOpen, reload, archive }: {
    listingId: number | null;
    type: 'archive' | 'delete';
    open: boolean;
    setOpen: (open: boolean) => void;
    reload: (func: (r: boolean) => boolean) => void;
    archive: boolean
}) {
    const [loading, setLoading] = useState(false);

    const onOpenChange = (op: boolean) => {
        setOpen(op);
        if (!op) {
            console.log(op);
            setTimeout(() => document.body.style.pointerEvents = '', 200);
        }
    };

    const onSubmit = () => {
        setLoading(true);

        if (type === 'archive') {
            sendReq(`/listings/${listingId}/archive`, 'POST', {
                archived: archive
            })
                .then(res => {
                    setLoading(false);

                    if (!res.fetched) {
                        toast.error('Something went wrong while updating the listing. Please try again later.');
                        return;
                    }

                    if (!res.ok || !res.data?.success) {
                        toast.error(res.data.error);
                        return;
                    }

                    toast.success(`Successfully ${!archive ? 'un' : ''}archived listing.`);
                    onOpenChange(false);
                    reload(r => !r);
                });
        } else if (type === 'delete') {
            sendReq(`/listings/${listingId}`, 'DELETE')
                .then(res => {
                    setLoading(false);

                    if (!res.fetched) {
                        toast.error('Something went wrong while deleting the listing. Please try again later.');
                        return;
                    }

                    if (!res.ok || !res.data?.success) {
                        toast.error(res.data.error);
                        return;
                    }

                    toast.success(`Successfully deleted listing.`);
                    onOpenChange(false);
                    reload(r => !r);
                });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you sure?</DialogTitle>
                    <DialogDescription>
                        {type === 'archive' &&
                            (archive
                                ? 'This will make your post no longer visible in search results, and it will not be accessible to the public. You can unarchive the post at any time.'
                                : 'This will make your post public again, and it will appear in search results.')
                        }
                        {type === 'delete' &&
                            'This will permanently delete your listing, including any images attached. Chats with buyers will not be deleted. This action cannot be undone.'
                        }
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-row justify-end gap-2">
                    <Button disabled={loading} variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button disabled={loading} onClick={onSubmit}>Confirm</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}