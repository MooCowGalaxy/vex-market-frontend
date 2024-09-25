import { AspectRatio } from '@/components/ui/aspect-ratio.tsx';
import ImagePicker from '@/components/ImagePicker.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Plus } from 'lucide-react';

export default function NewImage({ onNewFile }: { onNewFile: (file: File, uri: string) => void }) {
    return (
        <div className="rounded-xl border">
            <AspectRatio ratio={1}>
                <ImagePicker onNewFile={onNewFile}>
                    <Button variant="ghost" size="full">
                        <Plus className="pr-1"/>
                        <span>Upload Image</span>
                    </Button>
                </ImagePicker>
            </AspectRatio>
        </div>
    );
}