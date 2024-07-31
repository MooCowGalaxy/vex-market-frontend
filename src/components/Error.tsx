import { Button } from '@/components/ui/button.tsx';
import { useNavigate } from 'react-router-dom';

export default function Error({ error, home = false }: { error: string, home?: boolean }) {
    const navigate = useNavigate();

    return (
        <div className="flex-1 flex flex-col justify-center">
            <div>
                <p className="font-bold text-2xl text-center">Uh oh!</p>
                <p className="text-center mb-2">{error}</p>
                <div className="mx-auto w-max">
                    {home
                        ? <Button onClick={() => navigate('/')}>Go Home</Button>
                        : <Button onClick={() => navigate(-1)}>Go Back</Button>
                    }
                </div>
            </div>
        </div>
    );
}