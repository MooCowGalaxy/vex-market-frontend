import { Outlet, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function LegalLayout() {
    const navigate = useNavigate();
    return (
        <div className="flex-1 flex flex-row justify-center pt-6 md:pt-12">
            <div className="w-full md:w-192 px-6">
                <div className="flex flex-row items-center w-max cursor-pointer mb-2 text-sm"
                     onClick={() => navigate(-1)}>
                    <ArrowLeft size={14} className="mr-1"/> Back
                </div>
                <Outlet/>
            </div>
        </div>
    );
}