import useRequireAuth from '@/hooks/useRequireAuth.ts';
import Loading from '@/components/Loading.tsx';
import { useEffect, useState } from 'react';
import sendReq from '@/utils/sendReq.ts';
import Error from '@/components/Error.tsx';

type Message = {
    id: number;
    postName: string;
    recipientName: string;
    lastUpdate: string;
    unread: boolean;
};

export default function Messages() {
    const user = useRequireAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        setLoading(true);

        sendReq('/messages', 'GET')
            .then(res => {
                if (!res.fetched) {
                    setError('Something went wrong while fetching your messages. Please try again later.');
                    return;
                }

                if (!res.ok || !res.data?.success) {
                    setError(res.data.error);
                    return;
                }

                setMessages(res.data.chats);
                setLoading(false);
            });
    }, [user]);

    if (error.length > 0) {
        return (
            <Error error={error} />
        );
    }

    return (
        <div className="flex-1 w-full">
            <div
                className="flex-1 flex flex-col w-full sm:w-160 sm:mx-auto sm:my-6 px-6 sm:px-8 py-4 sm:py-6">
                <h1 className="text-2xl font-bold mb-8">Messages</h1>
                {loading && <Loading />}
                {!loading && messages.length === 0 && (
                    <div>Any chats that you make will be available here.</div>
                )}
                {!loading && messages.length > 0 && (
                    messages.map((message, i) => (
                        <div key={i}>{message.postName}</div>
                    ))
                )}
            </div>
        </div>
    );
}