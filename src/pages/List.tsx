import useRequireAuth from '@/hooks/useRequireAuth.ts';
import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label.tsx';
import { Button, buttonVariants } from '@/components/ui/button.tsx';
import toast from 'react-hot-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip.tsx';
import { useZipLocation } from '@/providers/LocationProvider.tsx';
import sendReq, { sendFileReq } from '@/utils/sendReq.ts';
import { useNavigate } from 'react-router-dom';
import ListingForm from '@/components/ListingForm.tsx';
import useTitle from '@/hooks/useTitle.ts';
import NewImage from '@/components/images/NewImage.tsx';
import Image from '@/components/images/Image.tsx';

export type ListFormData = {
    title: string;
    description: string;
    price: number;
    condition: string;
    type: string;
};

export default function List() {
    useTitle(`Create Listing - VEX Market`);

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

    const onNewFile = (file: File, dataUri: string) => {
        setImages(images => [...images, dataUri]);
        setFiles(files => [...files, file]);
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
                            <Image key={index} index={index} source={image} onDelete={(id: number) => deleteImage(id)} />
                        ))}
                        {images.length < 10 && <NewImage onNewFile={onNewFile} />}
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