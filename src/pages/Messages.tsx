import useRequireAuth from '@/hooks/useRequireAuth.ts';
import Loading from '@/components/Loading.tsx';
import { useEffect, useState } from 'react';
import sendReq from '@/utils/sendReq.ts';
import Error from '@/components/Error.tsx';
import { useNavigate } from 'react-router-dom';
import { Archive, User } from 'lucide-react';
import moment from 'moment';

type Message = {
    id: number;
    postName: string | null;
    postArchived: boolean | null;
    recipientName: string;
    lastUpdate: number;
    unreadCount: number;
};

export default function Messages() {
    const user = useRequireAuth();
    const navigate = useNavigate();
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
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
                    <div className="flex flex-col gap-4">
                        {messages.sort((a, b) => b.lastUpdate - a.lastUpdate).map((message, i) => (
                            <div className="rounded-lg border p-4 flex flex-row justify-between cursor-pointer"
                                 key={i} onClick={() => navigate(`/messages/${message.id}`)}>
                                <div>
                                    <div className="font-semibold flex flex-row items-center">
                                        {message.postArchived ? <Archive className="stroke-yellow-500 mr-2" size={18} /> : ''}
                                        {message.postName !== null ? message.postName : 'Deleted Post'}
                                    </div>
                                    <div className="flex flex-row items-center">
                                        <User size={18} className="mr-2"/> {message.recipientName}
                                    </div>
                                </div>
                                <div>
                                    <p>{moment(message.lastUpdate * 1000).calendar()}</p>
                                    {message.unreadCount > 0 && <div className="ml-auto w-max bg-primary text-sm text-white rounded-full px-2.5">{message.unreadCount} unread</div>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}