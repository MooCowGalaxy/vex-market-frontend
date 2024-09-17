import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Label } from '@/components/ui/label.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Button, buttonVariants } from '@/components/ui/button.tsx';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { IoArrowForward } from 'react-icons/io5';
import sendReq from '@/utils/sendReq.ts';
import { emailRegex } from '@/vars.ts';
import { getPasswordRequirements, PasswordValidation } from '@/components/PasswordValidation.tsx';

export default function Register() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [formError, setFormError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [success, setSuccess] = useState(false);

    const passwordReq = getPasswordRequirements(password);

    const isSubmitDisabled = formError === null || formError.length > 0 || Object.values(passwordReq).includes(false) || loading;

    const onFormInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSubmitError('');

        const currentValues = {
            firstName,
            lastName,
            email,
            password,
            confirmPassword
        };
        switch (e.target.id) {
            case 'first-name':
                setFirstName(e.target.value);
                currentValues.firstName = e.target.value;
                break;
            case 'last-name':
                setLastName(e.target.value);
                currentValues.lastName = e.target.value;
                break;
            case 'email':
                setEmail(e.target.value);
                currentValues.email = e.target.value;
                break;
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

        if (currentValues.firstName.length < 2 || currentValues.firstName.length > 100) formErrors.push('First name must be between 2 and 100 characters');
        if (currentValues.lastName.length < 2 || currentValues.lastName.length > 100) formErrors.push('Last name must be between 2 and 100 characters');
        if (!emailRegex.test(currentValues.email)) formErrors.push('Invalid email address');
        if (currentValues.email.length > 255) formErrors.push('Email must be 255 characters or less');
        if (currentValues.password.length < 8 || currentValues.password.length > 200) formErrors.push('Password must be between 8 and 200 characters');
        if (currentValues.password !== currentValues.confirmPassword) formErrors.push('Passwords do not match');

        setFormError(formErrors.join('\n'));
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!isSubmitDisabled && e.key === 'Enter') onSubmit();
    };

    const onSubmit = () => {
        setLoading(true);
        setSubmitError('');

        sendReq('/auth/register', 'POST', {
            email,
            password,
            firstName,
            lastName
        }).then(res => {
            setLoading(false);

            if (!res.fetched) {
                setSubmitError('Something went wrong while creating your account. Please try again later.');
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
                    <CardTitle className="text-xl">Sign Up</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="mb-4">Your account has been successfully created! Please check your email for the verification link.</p>
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
                <CardTitle className="text-xl">Sign Up</CardTitle>
                <CardDescription>
                    Enter your information to create an account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="first-name">First name</Label>
                            <Input
                                id="first-name"
                                placeholder="John"
                                required
                                maxLength={100}
                                value={firstName}
                                onChange={onFormInput}
                                onKeyDown={onKeyDown}
                                disabled={loading}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="last-name">Last name</Label>
                            <Input
                                id="last-name"
                                placeholder="Doe"
                                required
                                maxLength={100}
                                value={lastName}
                                onChange={onFormInput}
                                onKeyDown={onKeyDown}
                                disabled={loading}
                            />
                        </div>
                    </div>
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
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={onFormInput}
                            onKeyDown={onKeyDown}
                            disabled={loading}
                        />
                    </div>
                    <div className="grid gap-2 text-sm -mt-2">
                        <PasswordValidation password={password} />
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
                            disabled={loading}
                        />
                    </div>
                    {formError !== null && formError.length > 0
                        ? <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger className={buttonVariants({ variant: 'default', size: 'default', className: 'cursor-default opacity-50 w-full' })}>
                                    Create an account
                                </TooltipTrigger>
                                <TooltipContent>
                                    {formError.split('\n').map((error, i) => <p key={i}>{error}</p>)}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        : <Button type="submit" className="w-full" onClick={onSubmit} disabled={isSubmitDisabled}>
                            {loading ? 'Creating your account...' : 'Create an account'}
                        </Button>}
                    <p className="text-xs text-neutral-500">By registering an account, you agree to our <Link to="/legal/terms" className="underline">Terms of Service</Link> and <Link to="/legal/privacy" className="underline">Privacy Policy</Link></p>
                    {/*<Button variant="outline" className="w-full">
                        Sign up with Discord
                    </Button>*/}
                    <p className="text-red-600 -mt-2">{submitError}</p>
                </div>
                <div className="mt-4 text-center text-sm">
                    Already have an account?{" "}
                    <Link to="/auth/login" className="underline">
                        Log in
                    </Link>
                </div>
            </CardContent>
        </>
    );
}