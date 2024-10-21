import { ListFormData } from '@/pages/List.tsx';
import { Label } from '@/components/ui/label.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx';
import LocationButton from '@/components/LocationButton.tsx';
import React from 'react';

export default function ListingForm({
    form,
    setForm,
    onSubmit,
    isSubmitDisabled
}: {
    form: ListFormData,
    setForm: (form: ListFormData) => void,
    onSubmit: () => void,
    isSubmitDisabled: boolean
}) {
    const onSelectInput = (key: string, value: string) => {
        setForm({ ...form, [key]: value });
    };

    const onFormInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.id]: e.target.id === 'price' ? (parseFloat(e.target.value) || 0) : e.target.value });
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!isSubmitDisabled && e.currentTarget.id !== 'description' && e.key === 'Enter') onSubmit();
    };

    return (
        <>
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
                    onKeyDown={onKeyDown} />
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
                    rows={10}/>
                <p className="text-xs text-neutral-500">{form.description.length}/8000 characters</p>
            </div>
            <div className="mb-4 grid grid-cols-1 xs:grid-cols-2 gap-x-8 gap-y-2">
                <div>
                    <Label htmlFor="price">Price</Label>
                    <div className="flex flex-row">
                        <div className="rounded-l-md bg-neutral-200 flex flex-row items-center px-3">
                            <p>$</p>
                        </div>
                        <Input
                            className="rounded-l-none border-l-0 max-w-full"
                            id="price"
                            type="number"
                            placeholder="9.99"
                            step={0.01}
                            min={0}
                            max={10000}
                            required
                            value={form.price}
                            onChange={onFormInput}
                            onKeyDown={onKeyDown}
                        />
                    </div>
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
        </>
);
}