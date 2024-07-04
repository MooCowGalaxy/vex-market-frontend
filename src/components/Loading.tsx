import { MoonLoader } from 'react-spinners';

export default function Loading({ fullscreen = false }: { fullscreen: boolean }) {
    if (fullscreen) {
        return (
            <div className="w-screen h-screen flex flex-row justify-center items-center">
                <MoonLoader size={36} />
            </div>
        );
    }

    return (
        <div className="flex flex-row justify-center">
            <MoonLoader size={24} />
        </div>
    );
}