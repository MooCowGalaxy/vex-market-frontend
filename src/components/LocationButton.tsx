import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from '@/components/ui/sheet.tsx';
import { Button, buttonVariants } from '@/components/ui/button.tsx';
import { AlertCircle, ChevronRight, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input.tsx';
import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.tsx';
import sendReq from '@/utils/sendReq.ts';
import { getLocation, setLocation } from '@/utils/storage.ts';

export default function LocationButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [currentLoc, setCurrentLoc] = useState<string | null>(null);
    const [zip, setZip] = useState('');
    const [loading, setLoading] = useState(0);
    const [submitError, setSubmitError] = useState('');

    const isDisabled = zip.length !== 5 || loading !== 0;

    useEffect(() => {
        setCurrentLoc(getLocation());
    }, []);

    const onFormInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSubmitError('');

        if (e.target.value.length === 0 || !isNaN(parseInt(e.target.value))) {
            setZip(e.target.value);
        }
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !isDisabled) {
            checkZip();
        }
    };

    const checkZip = () => {
        setLoading(1);
        setSubmitError('');

        sendReq('/location/check', 'POST', {
            zip
        }).then(res => {
            setLoading(0);

            if (!res.fetched) {
                setSubmitError('Something went wrong while verifying your ZIP code. Please try again later.');
                return;
            }

            if (!res.ok) {
                setSubmitError(res.data.error);
                return;
            }

            if (!res.data.result) {
                setSubmitError(`Sorry, we couldn't find that ZIP code. Please try again.`);
                return;
            }

            setLocation(zip);
            setIsOpen(false);
        });
    };

    const onLocationSuccess = (pos: GeolocationPosition) => {
        const coordinates = pos.coords;

        sendReq('/location/zip', 'POST', {
            lat: coordinates.latitude,
            long: coordinates.longitude
        }).then(res => {
            setLoading(0);

            if (!res.fetched) {
                setSubmitError('Something went wrong while fetching your ZIP code. Please try again later.');
                return;
            }

            if (!res.ok) {
                setSubmitError(res.data.error);
                return;
            }

            setLocation(res.data.zip);
            setIsOpen(false);
        });
    };

    const onLocationError = (err: GeolocationPositionError) => {
        setSubmitError(err.message);
    };

    const onAutoDetect = () => {
        if (!navigator.geolocation) return;
        setSubmitError('');

        navigator.permissions
            .query({ name: 'geolocation' })
            .then(function (result) {
                switch (result.state) {
                    case 'granted':
                    case 'prompt':
                        setLoading(2);
                        navigator.geolocation.getCurrentPosition(onLocationSuccess, onLocationError);
                        break;
                    case 'denied':
                        setSubmitError('Please enable location data in your browser settings, then try again.');
                        break;
                }
            });
    };

    const supportsGeolocation = !!navigator.geolocation;

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger className={buttonVariants({ variant: 'outline', size: 'default', className: '' })}>
                <MapPin className="h-5 w-5 mr-1" />
                <span>{currentLoc ? currentLoc : 'Global'}</span>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader className="mb-4">
                    <SheetTitle>Location</SheetTitle>
                    <SheetDescription>
                        Enter your location to find listings near you. Your location will only be used for search purposes.
                    </SheetDescription>
                </SheetHeader>
                <div className="flex flex-row gap-2 h-10 mb-2">
                    <Input
                        id="zip"
                        type="number"
                        className="flex-1 h-10"
                        max={5}
                        placeholder="ZIP code"
                        required
                        value={zip}
                        onChange={onFormInput}
                        onKeyDown={onKeyDown}
                        disabled={loading !== 0}
                    />
                    <Button onClick={checkZip} size="sm" className="flex-initial h-10" disabled={isDisabled}>
                        <ChevronRight />
                    </Button>
                </div>
                <p className="text-center mb-2">or</p>
                <Button className="w-full mb-2" disabled={!supportsGeolocation || loading !== 0} onClick={onAutoDetect}>
                    <MapPin className="h-5 w-5 mr-1" />
                    <span>Detect automatically</span>
                </Button>
                {!supportsGeolocation && <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4"/>
                    <AlertTitle>Detection unavailable</AlertTitle>
                    <AlertDescription>
                        Your browser doesn't support geolocation.
                    </AlertDescription>
                </Alert>}
                <p className="text-red-600">{submitError}</p>
            </SheetContent>
        </Sheet>
    );
}