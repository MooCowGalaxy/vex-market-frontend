import { Socket, io } from 'socket.io-client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { SOCKET_BASE_URL } from '@/vars.ts';
import sendReq from '@/utils/sendReq.ts';
import { useUser } from '@/providers/UserProvider.tsx';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast as sonnerToast } from 'sonner';
import { ArrowRight } from 'lucide-react';

const SocketContext = createContext<Socket | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export function useSocket() {
    return useContext(SocketContext);
}

export function SocketProvider({ children }: { children: React.ReactNode }) {
    const { userId, loggedIn, updateNotifications } = useUser();
    const location = useLocation();
    const navigate = useNavigate();
    const [socket, setSocket] = useState<Socket | null>(null);

    const reconnect = () => {
        setTimeout(() => {
            setSocket(socket => {
                try {
                    socket?.disconnect();
                } catch (e) { /* empty */ }
                return io(SOCKET_BASE_URL, { transports: ['websocket'] });
            });
        }, 1000);
    };

    const sendAuth = (s: Socket) => {
        sendReq('/messages/token', 'POST')
            .then(res => {
                if (!res.fetched || !res.ok || !res.data?.success) return;

                const token = res.data.token;

                s.emit('auth', { token });
            });
    };

    useEffect(() => {
        reconnect();
    }, [loggedIn]);

    useEffect(() => {
        if (socket === null) return;

        const onConnect = () => {
            sendAuth(socket);
        };

        const onDisconnect = (reason: string) => {
            if (reason !== 'io client disconnect') reconnect();
        };

        const onChat = ({
            chatId,
            chatTitle,
            authorId,
            // authorName,
            message
        }: {
            id: number;
            chatId: number;
            chatTitle: string;
            authorId: number;
            authorName: string;
            message: string;
            image: string | null;
        }) => {
            if (userId === authorId) return;
            if (location.pathname === `/messages/${chatId}`) {
                sendReq(`/messages/${chatId}/read`, 'POST').then(() => {
                    updateNotifications().then();
                });
                return;
            } else {
                updateNotifications().then();
            }
            sonnerToast(chatTitle, {
                description: message,
                action: {
                    label: <ArrowRight />,
                    onClick: () => {
                        navigate(`/messages/${chatId}`);
                    }
                }
            });
        };
        // const onAuth = () => {};
        // const onException = () => {};

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('chat', onChat);
        // socket.on('auth', onAuth);
        // socket.on('exception', onException);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('chat', onChat);
            // socket.off('auth', onAuth);
            // socket.off('exception', onException);
        };
    }, [location.pathname, navigate, socket, updateNotifications, userId]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}
