import React, { createContext, useContext, useEffect, useState } from 'react';
import { getLocation, setLocation } from '@/utils/storage.ts';

type LocationContextType = {
    zip: string | null;
    setZip: (zip: string | null) => void
};

const LocationContext = createContext<LocationContextType>({
    zip: null,
    setZip: () => {}
});

// eslint-disable-next-line react-refresh/only-export-components
export function useZipLocation() {
    return useContext(LocationContext);
}

export function LocationProvider({ children }: { children: React.ReactNode }) {
    const [zip, setZip] = useState<string | null>(null);

    useEffect(() => {
        updateZip();
    }, []);

    const updateZip = () => {
        setZip(getLocation());
    };

    const setLoc = (z: string | null) => {
        setZip(z || null);
        setLocation(z || '');
    };

    const value = {
        zip,
        setZip: setLoc
    };

    return (
        <LocationContext.Provider value={value}>
            {children}
        </LocationContext.Provider>
    );
}