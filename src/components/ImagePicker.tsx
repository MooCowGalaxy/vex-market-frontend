import React, { ReactNode, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Label } from '@/components/ui/label.tsx';
import { Input } from '@/components/ui/input.tsx';
import toast from 'react-hot-toast';

export default function ImagePicker({ children, onNewFile }: { children: ReactNode, onNewFile: (file: File, dataUri: string) => void }) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newFile, setNewFile] = useState<File | null>(null);

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
            onNewFile(newFile, reader.result as string);
            setNewFile(null);
            setDialogOpen(false);
        };
        reader.readAsDataURL(newFile);
    };

    return (
        <Dialog open={dialogOpen} onOpenChange={open => setDialogOpen(open)}>
            <DialogTrigger asChild>
                {children}
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
    );
}