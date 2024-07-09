import useRequireAuth from '@/hooks/useRequireAuth.ts';
import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import LocationButton from '@/components/LocationButton.tsx';
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
import sendReq from '@/utils/sendReq.ts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx';
import { useNavigate } from 'react-router-dom';

type FormData = {
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
    const [form, setForm] = useState<FormData>({
        title: '',
        description: '',
        price: 0,
        condition: '',
        type: ''
    });
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

    const onSelectInput = (key: string, value: string) => {
        setForm({ ...form, [key]: value });
    };

    const onFormInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.id]: e.target.id === 'price' ? (parseFloat(e.target.value) || 0) : e.target.value });
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!isSubmitDisabled && e.key === 'Enter') onSubmit();
    };

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
        }).then(res => {
            setLoading(false);

            if (!res.fetched) {
                setSubmitError('Something went wrong while creating the listing. Please try again later.');
                return;
            }

            if (!res.ok) {
                setSubmitError(res.data.error);
                return;
            }

            // todo upload images

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
            setNewFile(null);
            setDialogOpen(false);
        };
        reader.readAsDataURL(newFile);
    };

    const deleteImage = (id: number) => {
        setImages((images) => [...images.slice(0, id), ...images.slice(id + 1, images.length)]);
    };

    return (
        <div style={{
            background: 'linear-gradient(118deg, rgba(215,212,255,1) 0%, rgba(207,255,216,1) 50%, rgba(174,239,255,1) 100%)'
        }} className="w-full">
            <div className="bg-[#fafafa] flex-1 w-full sm:rounded-xl sm:w-160 sm:mx-auto sm:my-6 px-6 sm:px-8 py-4 sm:py-6">
                <h1 className="text-2xl font-bold mb-4">Create Listing</h1>

                <div className="mb-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                        className="max-w-full"
                        id="title"
                        type="text"
                        placeholder="Custom Screwdrivers"
                        maxLength={128}
                        required
                        value={form.title}
                        onChange={onFormInput}
                        onKeyDown={onKeyDown}
                    />
                    <p className="text-xs text-neutral-500">{form.title.length}/128 characters</p>
                </div>
                <div className="mb-4">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        className="max-w-full"
                        id="description"
                        placeholder="Description goes here..."
                        maxLength={8000}
                        required
                        value={form.description}
                        onChange={onFormInput}
                        onKeyDown={onKeyDown}
                    />
                    <p className="text-xs text-neutral-500">{form.description.length}/8000 characters</p>
                </div>
                <div className="mb-4 grid grid-cols-1 xs:grid-cols-2 gap-x-8 gap-y-2">
                    <div>
                        <Label htmlFor="price">Price</Label>
                        <Input
                            className="max-w-full"
                            id="price"
                            type="number"
                            placeholder="$9.99"
                            step={0.01}
                            min={0}
                            max={10000}
                            required
                            value={form.price}
                            onChange={onFormInput}
                            onKeyDown={onKeyDown}
                        />
                        <p className="text-xs text-neutral-500">Price per each unit</p>
                    </div>
                    <div>
                        <Label>Condition</Label>
                        <Select value={form.condition} onValueChange={v => onSelectInput('condition', v)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Choose a condition"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="New">New</SelectItem>
                                <SelectItem value="Like new">Like new</SelectItem>
                                <SelectItem value="Good">Good</SelectItem>
                                <SelectItem value="Used">Used</SelectItem>
                                <SelectItem value="Poor">Poor</SelectItem>
                                <SelectItem value="Parts only">Parts only</SelectItem>
                                <SelectItem value="N/A">N/A</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="mb-4 grid grid-cols-1 xs:grid-cols-2 gap-x-8 gap-y-2">
                    <div>
                        <Label>Location</Label>
                        <div>
                            <LocationButton/>
                        </div>
                    </div>
                    <div>
                        <Label>Delivery method</Label>
                        <Select value={form.type} onValueChange={v => onSelectInput('type', v)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a method"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="shipping">Shipping only</SelectItem>
                                <SelectItem value="local">Pickup only</SelectItem>
                                <SelectItem value="both">Shipping + Pickup</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
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