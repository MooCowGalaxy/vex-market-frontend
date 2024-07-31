import React, { createContext, useContext, useEffect, useState } from 'react';
import sendReq from '@/utils/sendReq.ts';
import Loading from '@/components/Loading.tsx';

type UserContextType = {
    loggedIn: boolean;
    userId: number | null;
    firstName: string | null;
    lastName: string | null;
    updateUser: () => Promise<void>;
};

const UserContext = createContext<UserContextType>({
    loggedIn: false,
    userId: null,
    firstName: null,
    lastName: null,
    updateUser: async () => {}
});

// eslint-disable-next-line react-refresh/only-export-components
export function useUser() {
    return useContext(UserContext);
}

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [loggedIn, setLoggedIn] = useState(false);
    const [userId, setUserId] = useState<number | null>(null);
    const [firstName, setFirstName] = useState<string | null>(null);
    const [lastName, setLastName] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        updateUser().then();
    }, []);

    const updateUser = async () => {
        const res = await sendReq('/auth/user', 'GET');

        setLoading(false);

        if (!res.fetched || !res.ok) {
            setLoggedIn(false);
            setUserId(null);
            setFirstName(null);
            setLastName(null);
            return;
        }

        setLoggedIn(true);
        setUserId(res.data.userId);
        setFirstName(res.data.firstName);
        setLastName(res.data.lastName);
    };

    const value = {
        loggedIn,
        userId,
        firstName,
        lastName,
        updateUser
    };

    if (loading) {
        return (
            <UserContext.Provider value={value}>
                <Loading fullscreen={true} />
            </UserContext.Provider>
        );
    }

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}