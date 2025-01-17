import { AspectRatio } from '@/components/ui/aspect-ratio.tsx';
import { Button } from '@/components/ui/button.tsx';
import { X } from 'lucide-react';

export default function Image({ index, source, deleted = false, disabled = false, addDisabled = false, onDelete, onAdd }: { index: number; source: string; deleted?: boolean; disabled?: boolean; addDisabled?: boolean; onDelete: (id: number) => void, onAdd?: (id: number) => void }) {
    return (
        <div className={`${deleted ? 'hidden' : ''} relative rounded-xl border`} key={index}>
            <AspectRatio ratio={1} className="overflow-hidden rounded-md">
                <img src={source} alt="Image"
                     className={`${deleted ? 'blur-[2px] grayscale' : ''} rounded-md object-cover max-w-full max-h-full w-full h-full`}/>
            </AspectRatio>
            {!deleted && <div className="absolute top-0 right-0 m-2">
                <Button variant="secondary" size="icon-sm" disabled={disabled} onClick={() => onDelete(index)}>
                    <X/>
                </Button>
            </div>}
            {deleted && <div className="absolute top-0 right-0 w-full h-full flex flex-row justify-center items-center opacity-0 hover:opacity-100 transition-opacity">
                <Button variant="secondary" size="sm" disabled={disabled || addDisabled} onClick={() => {
                    if (onAdd) {
                        onAdd(index);
                    }
                }}>
                    Re-add
                </Button>
            </div>}
        </div>
    );
}