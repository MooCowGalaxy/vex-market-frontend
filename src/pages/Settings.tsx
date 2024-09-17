import { Input } from '@/components/ui/input.tsx';
import useRequireAuth from '@/hooks/useRequireAuth.ts';
import React, { useState } from 'react';
import { getPasswordRequirements, PasswordValidation } from '@/components/PasswordValidation.tsx';
import { Button } from '@/components/ui/button.tsx';
import { MoonLoader } from 'react-spinners';
import sendReq from '@/utils/sendReq.ts';
import toast from 'react-hot-toast';

export default function Settings() {
    const user = useRequireAuth();
    const [loading, setLoading] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const passwordReq = getPasswordRequirements(newPassword);

    const isFormValid = newPassword === confirmNewPassword && !Object.values(passwordReq).includes(false);

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') onSubmit();
    };

    const onSubmit = () => {
        if (!isFormValid) return;

        setLoading(true);

        sendReq('/auth/password', 'POST', {
            password: newPassword
        }).then(res => {
            setLoading(false);

            if (!res.fetched) {
                toast.error('Something went wrong while saving your changes. Please try again later.');
                return;
            } else if (!res.ok || !res.data?.success) {
                toast.error(res.data.error);
                return;
            }

            toast.success('Successfully updated settings! If you changed your password, you may be logged out.', {
                duration: 8000
            });
            user.updateUser().then();
        });
    };

    return (
        <div className="flex-1 flex flex-row justify-center pt-6 md:pt-12">
            <div className="w-full md:w-192 px-6">
                <h1 className="font-bold text-2xl mt-6 mb-10">Settings</h1>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    <div className="flex flex-row items-center">
                        <p className="w-full font-bold">First Name</p>
                    </div>
                    <div className="mb-6 md:mb-0 col-span-1 md:col-span-3">
                        <Input value={user.firstName || 'Unknown'} disabled={true}/>
                    </div>

                    <div className="flex flex-row items-center">
                        <p className="w-full font-bold">Last Name</p>
                    </div>
                    <div className="mb-6 md:mb-0 col-span-1 md:col-span-3">
                        <Input value={user.lastName || 'Unknown'} disabled={true}/>
                    </div>

                    <div className="flex flex-row items-center">
                        <p className="w-full font-bold">Email</p>
                    </div>
                    <div className="mb-6 md:mb-0 col-span-1 md:col-span-3">
                        <Input value={user.email || 'Unknown'} disabled={true}/>
                    </div>

                    <div className="col-span-1 md:col-span-4 py-6">
                        <hr/>
                    </div>

                    <div className="flex flex-row items-center">
                        <p className="w-full font-bold">New Password</p>
                    </div>
                    <div className="mb-6 md:mb-0 col-span-1 md:col-span-4">
                        <Input type="password" onKeyDown={onKeyDown} value={newPassword} onChange={e => setNewPassword(e.target.value)}/>
                    </div>

                    <div className="col-span-1 md:col-span-4 py-4">
                        <PasswordValidation password={newPassword}/>
                    </div>

                    <div className="flex flex-row items-center">
                        <p className="w-full font-bold">Confirm Password</p>
                    </div>
                    <div className="mb-6 md:mb-0 col-span-1 md:col-span-4">
                        <Input type="password" onKeyDown={onKeyDown} value={confirmNewPassword}
                               onChange={e => setConfirmNewPassword(e.target.value)}/>
                    </div>

                    <div className="col-span-1 md:col-span-4 py-4">
                        {!loading && <Button disabled={!isFormValid} onClick={onSubmit}>Save Changes</Button>}
                        {loading && <Button variant="secondary" disabled={true}>
                            <MoonLoader size={12}/>
                            <span className="ml-2">Saving changes...</span>
                        </Button>}
                    </div>
                </div>
            </div>
        </div>
    );
}