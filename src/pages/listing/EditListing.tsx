import { useNavigate, useParams } from 'react-router-dom';
import useRequireAuth from '@/hooks/useRequireAuth.ts';
import { useEffect, useState } from 'react';
import ListingForm from '@/components/ListingForm.tsx';
import sendReq, { sendFileReq } from '@/utils/sendReq.ts';
import Error from '@/components/Error.tsx';
import Loading from '@/components/Loading.tsx';
import { useZipLocation } from '@/providers/LocationProvider.tsx';
import { ListFormData } from '@/pages/List.tsx';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip.tsx';
import { Button, buttonVariants } from '@/components/ui/button.tsx';
import toast from 'react-hot-toast';
import useTitle from '@/hooks/useTitle.ts';
import Image from '@/components/images/Image.tsx';
import NewImage from '@/components/images/NewImage.tsx';

export default function EditListing() {
    useTitle('Edit Listing - VEX Market');

    const navigate = useNavigate();
    const user = useRequireAuth();
    const { zip } = useZipLocation();
    const { id: listingId } = useParams();
    const [form, setForm] = useState<ListFormData | null>(null);
    const [error, setError] = useState('');
    const [formError, setFormError] = useState<string | null>(null);

    const [currentImages, setCurrentImages] = useState<string[]>([]);
    const [currentDeleted, setCurrentDeleted] = useState<number[]>([]);
    const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
    const [newImageUris, setNewImageUris] = useState<string[]>([]);

    const [submitError, setSubmitError] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const isSubmitDisabled = formError === null || formError.length > 0;
    const imageCount = currentImages.length - currentDeleted.length + newImageFiles.length;

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

                if (res.data.authorId !== user.userId) {
                    setError('You do not have permissions to edit this listing.');
                    return;
                }

                setForm({
                    title: res.data.title,
                    description: res.data.description,
                    price: res.data.price,
                    condition: res.data.condition,
                    type: res.data.type
                });
                setCurrentImages(res.data.images);
            });
    }, [user, listingId]);

    useEffect(() => {
        setSubmitError('');
        if (form === null) return;

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
        if (imageCount === 0) formErrors.push('At least one image must be attached');
        if (imageCount > 10) formErrors.push('At most ten images can be attached');

        setFormError(formErrors.join('\n'));
    }, [form, zip, imageCount]);

    const onCurrentImageDelete = (index: number) => {
        if (!currentDeleted.includes(index)) {
            setCurrentDeleted(deleted => [...deleted, index]);
        }
    };

    const onCurrentImageAdd = (index: number) => {
        setCurrentDeleted(deleted => deleted.filter(x => x !== index));
    };

    const onNewFile = (file: File, uri: string) => {
        setNewImageFiles(files => [...files, file]);
        setNewImageUris(images => [...images, uri]);
    };

    const deleteNewImage = (id: number) => {
        setNewImageFiles((files) => [...files.slice(0, id), ...files.slice(id + 1, files.length)]);
        setNewImageUris((images) => [...images.slice(0, id), ...images.slice(id + 1, images.length)]);
    };

    const onSubmit = () => {
        if (!zip) return;
        if (!form) return;
        setLoading(true);
        setSubmitError('');

        sendReq(`/listings/${listingId}`, 'PUT', {
            ...form,
            zip: parseInt(zip)
        }).then(async res => {
            if (!res.fetched) {
                setSubmitError('Something went wrong while creating the listing. Please try again later.');
                return;
            } else if (!res.ok || !res.data?.success) {
                setSubmitError(res.data.error);
                return;
            }

            // delete requested images
            if (currentDeleted.length > 0) {
                const deleteRes = await sendReq(`/listings/${listingId}/images/delete`, 'POST', {
                    images: currentDeleted.map(x => currentImages[x])
                });

                if (!deleteRes.fetched) {
                    setLoading(false);
                    setSubmitError('Something went wrong while creating the listing. Please try again later.');
                    return;
                } else if (!deleteRes.ok || !deleteRes.data?.success) {
                    setLoading(false);
                    setSubmitError(deleteRes.data.error);
                    return;
                }
            }

            if (newImageFiles.length > 0) {
                // add new images
                await toast.promise(
                    Promise.all(
                        newImageFiles.map(file =>
                            sendFileReq(`/listings/${listingId}/images`, file)
                        )
                    ), {
                        loading: `Uploading image${newImageFiles.length !== 1 ? 's' : ''}...`,
                        success: 'Uploaded images!',
                        error: `Failed to upload image${newImageFiles.length !== 1 ? 's' : ''}.`
                    });
            }

            setLoading(false);

            navigate(`/listing/${listingId}`);
            toast.success(`Successfully updated listing!`);
        });
    };

    if (error?.length > 0) {
        return (
            <Error error={error} />
        );
    }

    if (form === null) return (
        <div className="flex-1 flex flex-col justify-center">
            <Loading />
        </div>
    );

    return (
        <div className="flex-1 w-full">
            <div
                className="flex-1 w-full sm:rounded-xl sm:w-160 sm:mx-auto sm:my-6 px-6 sm:px-8 py-4 sm:py-6">
                <h1 className="text-2xl font-bold mb-4">Edit Listing</h1>
                <ListingForm form={form} setForm={setForm} onSubmit={onSubmit} isSubmitDisabled={isSubmitDisabled}/>
                <div className="mb-4">
                    <p className="text-sm">Edit Images</p>
                    <div className="gap-2 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3">
                        {currentImages.map((image, index) => (
                            <Image key={index} index={index} source={image} disabled={loading} addDisabled={imageCount >= 10} deleted={currentDeleted.includes(index)} onDelete={onCurrentImageDelete} onAdd={onCurrentImageAdd}/>
                        ))}
                        {newImageUris.map((image, index) => (
                            <Image key={index} index={index} source={image} disabled={loading} onDelete={(id: number) => deleteNewImage(id)} />
                        ))}
                        {imageCount < 10 && <NewImage onNewFile={onNewFile} />}
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
                                Update Listing
                            </TooltipTrigger>
                            <TooltipContent>
                                {formError.split('\n').map((error, i) => <p key={i}>{error}</p>)}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    : <Button type="submit" onClick={onSubmit}
                              disabled={formError === null || loading}>
                        {loading ? 'Updating listing...' : 'Update Listing'}
                    </Button>}
                <p className="text-red-600">{submitError}</p>
            </div>
        </div>
    )
}