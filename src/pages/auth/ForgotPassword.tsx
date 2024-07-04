import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Label } from '@/components/ui/label.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip.tsx';
import { Button, buttonVariants } from '@/components/ui/button.tsx';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { emailRegex } from '@/vars.ts';
import sendReq from '@/utils/sendReq.ts';
import { IoArrowForward } from 'react-icons/io5';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [formError, setFormError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [success, setSuccess] = useState(false);

    const isSubmitDisabled = formError === null || formError.length > 0 || loading;

    const onFormInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSubmitError('');

        setEmail(e.target.value);

        if (e.target.value.length === 0) setFormError('Email is required');
        if (!emailRegex.test(e.target.value)) setFormError('Email is invalid');
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!isSubmitDisabled && e.key === 'Enter') onSubmit();
    };

    const onSubmit = () => {
        setLoading(true);
        setSubmitError('');

        sendReq('/auth/reset', 'POST', {
            email
        }).then(res => {
            setLoading(false);

            if (!res.fetched) {
                setSubmitError('Something went wrong while requesting a password reset. Please try again later.');
                return;
            }

            if (!res.ok) {
                setSubmitError(res.data.error);
                return;
            }

            setSuccess(true);
        });
    };

    if (success) {
        return (
            <>
                <CardHeader>
                    <CardTitle className="text-xl">Reset Password</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="mb-4">If there is an account associated with your email, a password reset link will be sent to you. Please check your inbox.</p>
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
                <CardTitle>Reset Password</CardTitle>
                <CardDescription>
                    Enter your email below to reset your password
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="john@example.com"
                            required
                            value={email}
                            onChange={onFormInput}
                            onKeyDown={onKeyDown}
                            disabled={loading}
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
                                    Log in
                                </TooltipTrigger>
                                <TooltipContent>
                                    {formError.split('\n').map((error, i) => <p key={i}>{error}</p>)}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        : <Button type="submit" className="w-full" onClick={onSubmit}
                                  disabled={formError === null || loading}>
                            {loading ? 'Loading...' : 'Reset password'}
                        </Button>}
                    <p className="text-red-600 -mt-2">{submitError}</p>
                </div>
                <div className="mt-4 text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link to="/auth/register" className="underline">
                        Sign up
                    </Link>
                </div>
            </CardContent>
        </>
);
}