import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Label } from '@/components/ui/label.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button, buttonVariants } from '@/components/ui/button.tsx';
import React, { useState } from 'react';
import { emailRegex } from '@/vars.ts';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip.tsx';
import sendReq from '@/utils/sendReq.ts';
import toast from 'react-hot-toast';
import { useUser } from '@/providers/UserProvider.tsx';

export default function Login() {
    const user = useUser();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formError, setFormError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const isSubmitDisabled = formError === null || formError.length > 0 || loading;

    const onFormInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSubmitError('');

        const currentValues = {
            email, password
        };
        switch (e.target.id) {
            case 'email':
                setEmail(e.target.value);
                currentValues.email = e.target.value;
                break;
            case 'password':
                setPassword(e.target.value);
                currentValues.password = e.target.value;
                break;
        }

        const formErrors = [];

        if (currentValues.email.length === 0) formErrors.push('Email is required');
        if (!emailRegex.test(currentValues.email)) formErrors.push('Invalid email address');
        if (currentValues.password.length === 0) formErrors.push('Password is required');

        setFormError(formErrors.join('\n'));
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!isSubmitDisabled && e.key === 'Enter') onSubmit();
    };

    const onSubmit = () => {
        setLoading(true);
        setSubmitError('');

        sendReq('/auth/login', 'POST', {
            email,
            password
        }).then(res => {
            setLoading(false);

            if (!res.fetched) {
                setSubmitError('Something went wrong while logging in. Please try again later.');
                return;
            }

            if (!res.ok) {
                setSubmitError(res.data.error);
                return;
            }

            user.updateUser().then(() => {
                navigate(searchParams.get('to') || '/');
                toast.success('Logged in!');
            });
        });
    };

    return (
        <>
            <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>
                    Enter your email below to login to your account
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
                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password">Password</Label>
                            <Link to="/auth/forgot" className="ml-auto inline-block text-sm underline">
                                Forgot your password?
                            </Link>
                        </div>
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
                            {loading ? 'Logging in...' : 'Log in'}
                        </Button>}
                    {/*<Button variant="outline" className="w-full">
                            Login with Discord
                        </Button>*/}
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