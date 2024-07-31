import { MoonLoader } from 'react-spinners';

export default function Loading({ fullscreen = false, text = undefined }: { fullscreen?: boolean, text?: string }) {
    if (fullscreen) {
        return (
            <div className="w-screen h-screen flex flex-col justify-center items-center">
                <div className={`mb-2 ${!text ? 'hidden' : ''}`}>{text}</div>
                <div>
                    <MoonLoader size={36} />
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-row justify-center items-center">
            <MoonLoader size={24} />
        </div>
    );
}