import useRequireAuth from '@/hooks/useRequireAuth.ts';
import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label.tsx';
import { Input } from '@/components/ui/input.tsx';
import { AspectRatio } from '@/components/ui/aspect-ratio.tsx';
import { Button, buttonVariants } from '@/components/ui/button.tsx';
import { Plus, X } from 'lucide-react';
import {
    Dialog,
    DialogContent, DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog.tsx';
import toast from 'react-hot-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip.tsx';
import { useZipLocation } from '@/providers/LocationProvider.tsx';
import sendReq, { sendFileReq } from '@/utils/sendReq.ts';
import { useNavigate } from 'react-router-dom';
import ListingForm from '@/components/ListingForm.tsx';

export type ListFormData = {
    title: string;
    description: string;
    price: number;
    condition: string;
    type: string;
};

export default function List() {
    const { zip } = useZipLocation();
    const user = useRequireAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState<ListFormData>({
        title: '',
        description: '',
        price: 0,
        condition: '',
        type: ''
    });
    const [files, setFiles] = useState<File[]>([]);
    const [images, setImages] = useState<string[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newFile, setNewFile] = useState<File | null>(null);
    const [formError, setFormError] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const isSubmitDisabled = formError === null || formError.length > 0;

    useEffect(() => {
        if (user) {
            setImages([]);
        }
    }, [user]);

    useEffect(() => {
        setSubmitError('');

        const formErrors = [];

        if (form.title.length === 0) formErrors.push('Title is required');
        if (form.title.length > 128) formErrors.push('Title must be 128 characters or less');
        if (form.description.length === 0) formErrors.push('Description is required');
        if (form.description.length > 8000) formErrors.push('Description must be 8000 characters or less');
        if (form.price <= 0) formErrors.push('Price must be greater than $0');
        if (form.price > 10000) formErrors.push('Price must be less than $10,000.00');
        if (form.condition.length === 0) formErrors.push('The condition is required');
        if (form.type.length === 0) formErrors.push('A delivery method must be selected');
        if (zip === null) formErrors.push('Location must be set');
        if (images.length === 0) formErrors.push('At least one image must be attached');
        if (images.length > 10) formErrors.push('At most ten images can be attached');

        setFormError(formErrors.join('\n'));
    }, [form, images, zip]);

    const onSubmit = () => {
        if (!zip) return;
        setLoading(true);

        sendReq('/listings', 'POST', {
            title: form.title,
            description: form.description,
            price: form.price,
            zip: parseInt(zip),
            condition: form.condition,
            type: form.type
        }).then(async res => {
            if (!res.fetched) {
                setSubmitError('Something went wrong while creating the listing. Please try again later.');
                setLoading(false);
                return;
            }

            if (!res.ok || !res.data?.success) {
                setSubmitError(res.data.error);
                setLoading(false);
                return;
            }

            if (!res.data.postId) {
                setSubmitError('Something went wrong while creating the listing. Please try again later.');
                setLoading(false);
                return;
            }

            await toast.promise(
                Promise.all(
                    files.map(file =>
                        sendFileReq(`/listings/${res.data.postId}/images`, file)
                    )
                ), {
                loading: `Uploading image${images.length !== 1 ? 's' : ''}...`,
                success: 'Uploaded images!',
                error: `Failed to upload image${images.length !== 1 ? 's' : ''}.`
            });

            toast.success('Created listing!');
            navigate(`/listing/${res.data.postId}`);
        });
    };

    const onNewFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null;
        if (!selectedFile) return;
        if (selectedFile.size > 5 * 1000 * 1000) {
            toast.error('Image must be less than 5 MB.');
            e.target.value = '';
            return;
        }
        setNewFile(selectedFile);
    };

    const onNewFileSubmit = () => {
        if (newFile === null) {
            toast.error('No file selected.');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            // add new image data uri to images
            setImages(images => [...images, reader.result as string]);
            setFiles(files => [...files, newFile]);
            setNewFile(null);
            setDialogOpen(false);
        };
        reader.readAsDataURL(newFile);
    };

    const deleteImage = (id: number) => {
        setImages((images) => [...images.slice(0, id), ...images.slice(id + 1, images.length)]);
        setFiles((files) => [...files.slice(0, id), ...files.slice(id + 1, files.length)]);
    };

    return (
        <div style={{
            background: 'linear-gradient(118deg, rgba(215,212,255,1) 0%, rgba(207,255,216,1) 50%, rgba(174,239,255,1) 100%)'
        }} className="w-full">
            <div className="bg-[#fafafa] flex-1 w-full sm:rounded-xl sm:w-160 sm:mx-auto sm:my-6 px-6 sm:px-8 py-4 sm:py-6">
                <h1 className="text-3xl font-bold mb-4">Create Listing</h1>

                <ListingForm form={form} setForm={setForm} onSubmit={onSubmit} isSubmitDisabled={isSubmitDisabled} />
                <div className="mb-4">
                    <Label>Images</Label>
                    <p className="text-xs text-neutral-500 mb-0.5">The first image will be used as the listing's
                        thumbnail. (up to 10 images, 5 MB each)</p>
                    <div
                        className="gap-2 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3">
                        {images.map((image, index) => (
                            <div className="relative rounded-xl border" key={index}>
                                <AspectRatio ratio={1}>
                                    <img src={image} alt="Image"
                                         className="rounded-md object-cover max-w-full max-h-full w-full h-full"/>
                                </AspectRatio>
                                <div className="absolute top-0 right-0 m-2">
                                    <Button variant="ghost" size="icon-sm" onClick={() => deleteImage(index)}>
                                        <X/>
                                    </Button>
                                </div>
                            </div>
                        ))}
                        {images.length < 10 && <div className="rounded-xl border">
                            <AspectRatio ratio={1}>
                                <Dialog open={dialogOpen} onOpenChange={open => setDialogOpen(open)}>
                                    <DialogTrigger asChild>
                                        <Button variant="ghost" size="full">
                                            <Plus className="pr-1"/>
                                            <span>Upload Image</span>
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>Upload new image</DialogTitle>
                                            <DialogDescription>
                                                Max 5 MB, png and jpg only.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="image" className="text-right">
                                                    Image
                                                </Label>
                                                <Input
                                                    id="image"
                                                    type="file"
                                                    accept="image/*"
                                                    className="col-span-3"
                                                    onChange={onNewFileChange}
                                                />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button onClick={onNewFileSubmit}>Save</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </AspectRatio>
                        </div>}
                    </div>
                </div>
                {formError !== null && formError.length > 0
                    ? <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger className={buttonVariants({
                                variant: 'default',
                                size: 'default',
                                className: 'cursor-default opacity-50'
                            })}>
                                Create Listing
                            </TooltipTrigger>
                            <TooltipContent>
                                {formError.split('\n').map((error, i) => <p key={i}>{error}</p>)}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    : <Button type="submit" onClick={onSubmit}
                              disabled={formError === null || loading}>
                        {loading ? 'Creating listing...' : 'Create Listing'}
                    </Button>}
                <p className="text-red-600">{submitError}</p>
            </div>
        </div>
    );
}