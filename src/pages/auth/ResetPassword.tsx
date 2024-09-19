import { CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Link, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import sendReq from '@/utils/sendReq.ts';
import { MoonLoader } from 'react-spinners';
import { Button, buttonVariants } from '@/components/ui/button.tsx';
import { IoArrowForward } from 'react-icons/io5';
import { Label } from '@/components/ui/label.tsx';
import { Input } from '@/components/ui/input.tsx';
import { getPasswordRequirements, PasswordValidation } from '@/components/PasswordValidation.tsx';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip.tsx';
import useTitle from '@/hooks/useTitle.ts';

export default function ResetPassword() {
    useTitle('Reset Password - VEX Market');

    const { token } = useParams();
    const [loading, setLoading] = useState(true);
    const [tokenError, setTokenError] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [formError, setFormError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!token) {
            setLoading(false);
            setTokenError('The reset link is invalid.');
            return;
        }
        setLoading(true);
        setTokenError('');

        sendReq(`/auth/reset/${token}`, 'GET')
            .then(res => {
                setLoading(false);

                if (!res.fetched) {
                    setTokenError('Something went wrong while retrieving your account. Please try again later.');
                    return;
                }

                if (!res.ok) {
                    setTokenError(res.data.error);
                    return;
                }
            })
    }, [token]);

    const passwordReq = getPasswordRequirements(password);

    const isSubmitDisabled = formError === null || formError.length > 0 || Object.values(passwordReq).includes(false) || submitting;

    const onFormInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSubmitError('');

        const currentValues = {
            password,
            confirmPassword
        };

        switch (e.target.id) {
            case 'password':
                setPassword(e.target.value);
                currentValues.password = e.target.value;
                break;
            case 'passwordConfirm':
                setConfirmPassword(e.target.value);
                currentValues.confirmPassword = e.target.value;
                break;
        }

        const formErrors = [];

        if (currentValues.password.length < 8 || currentValues.password.length > 200) formErrors.push('Password must be between 8 and 200 characters');
        if (currentValues.password !== currentValues.confirmPassword) formErrors.push('Passwords do not match');

        setFormError(formErrors.join('\n'));
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!isSubmitDisabled && e.key === 'Enter') onSubmit();
    };

    const onSubmit = () => {
        setSubmitting(true);
        setSubmitError('');

        sendReq(`/auth/reset/${token}`, 'POST', {
            password
        }).then(res => {
            setSubmitting(false);

            if (!res.fetched) {
                setSubmitError('Something went wrong while resetting your password. Please try again later.');
                return;
            }

            if (!res.ok) {
                setSubmitError(res.data.error);
                return;
            }

            setSuccess(true);
        })
    };

    if (loading) return (
        <>
            <CardHeader>
                <CardTitle className="text-xl">Reset Password</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-row justify-center">
                    <MoonLoader size={24} />
                </div>
            </CardContent>
        </>
    );

    if (tokenError.length > 0) return (
        <>
            <CardHeader>
                <CardTitle className="text-xl">Reset Password</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="mb-4">{tokenError}</p>
                <div className="flex flex-row justify-center">
                    <Link to="/auth/login"><Button>Log in <IoArrowForward className="inline ml-1" size={18}/></Button></Link>
                </div>
            </CardContent>
        </>
    );

    if (success) {
        return (
            <>
                <CardHeader>
                    <CardTitle className="text-xl">Reset Password</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="mb-4">Your password has been reset. You can now log in with your new password.</p>
                    <div className="flex flex-row justify-center">
                        <Link to="/auth/login"><Button>Log in <IoArrowForward className="inline ml-1" size={18} /></Button></Link>
                    </div>
                </CardContent>
            </>
        );
    }

    return (
        <>
            <CardHeader>
                <CardTitle className="text-xl">Reset Password</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={onFormInput}
                            onKeyDown={onKeyDown}
                            disabled={submitting}
                        />
                    </div>
                    <div className="grid gap-2 text-sm -mt-2">
                        <PasswordValidation password={password}/>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="passwordConfirm">Confirm Password</Label>
                        <Input
                            id="passwordConfirm"
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={onFormInput}
                            onKeyDown={onKeyDown}
                            disabled={submitting}
                        />
                    </div>
                    {formError !== null && formError.length > 0
                        ? <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger className={buttonVariants({
                                    variant: 'default',
                                    size: 'default',
                                    className: 'cursor-default opacity-50 w-full'
                                })}>
                                    Reset password
                                </TooltipTrigger>
                                <TooltipContent>
                                    {formError.split('\n').map((error, i) => <p key={i}>{error}</p>)}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        : <Button type="submit" className="w-full" onClick={onSubmit} disabled={isSubmitDisabled}>
                            {submitting ? 'Resetting your password...' : 'Reset password'}
                        </Button>}
                    <p className="text-red-600 -mt-2">{submitError}</p>
                </div>
            </CardContent>
        </>
    );
}