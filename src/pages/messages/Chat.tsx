import React, { useEffect, useRef, useState } from 'react';
import sendReq from '@/utils/sendReq.ts';
import useRequireAuth from '@/hooks/useRequireAuth.ts';
import { Link, useParams } from 'react-router-dom';
import Loading from '@/components/Loading.tsx';
import Error from '@/components/Error.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { ImagePlus, SendHorizontal } from 'lucide-react';
import { MoonLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import { MessageData } from '@/types';
import Message from '@/components/Message.tsx';
import moment from 'moment';
import { useSocket } from '@/providers/SocketProvider.tsx';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';

export default function Chat() {
    const { userId } = useRequireAuth();
    const { chatId } = useParams();
    const socket = useSocket();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [hasMoreMessages, setHasMoreMessages] = useState<boolean>(false);
    const [chatInfo, setChatInfo] = useState<{ postName: string | null; postId: number | null; recipientName: string } | null>(null);
    const [messages, setMessages] = useState<MessageData[]>([]);
    const [message, setMessage] = useState('');
    const messageInput = useRef<HTMLInputElement>(null);
    const messageList = useRef<HTMLDivElement>(null);

    const addMessages = (newMessages: MessageData[], live: boolean = false) => {
        setMessages(msgs => {
            const combined = [...msgs, ...newMessages];

            return combined.sort((a, b) => a.id - b.id);
        });

        if (messageList.current && live) {
            const childDiv = messageList.current.children.item(1);
            if (childDiv && childDiv.scrollHeight - childDiv.clientHeight === childDiv.scrollTop) {
                setTimeout(() => {
                    childDiv.scrollTo({ left: 0, top: childDiv.scrollHeight, behavior: 'smooth' });
                }, 50);
            }
        }
    };

    const fetchMessages = (cId: number, before?: number) => {
        setLoading(true);
        const url = before ? `/messages/${cId}?before=${before}` : `/messages/${cId}`;

        sendReq(url, 'GET')
            .then(res => {
                if (!res.fetched) {
                    setError('Something went wrong while fetching your messages. Please try again later.');
                    return;
                }

                if (!res.ok || !res.data?.success) {
                    setError(res.data.error);
                    return;
                }

                setLoading(false);
                setError('');
                setChatInfo({
                    postName: res.data.postName,
                    postId: res.data.postId,
                    recipientName: res.data.recipientName
                });
                setHasMoreMessages(res.data.messages.length === 25);
                setMessages(msgs => {
                    const combined = [...msgs, ...res.data.messages];

                    return combined.sort((a, b) => a.id - b.id);
                });
                if (!before) setTimeout(() => {
                    if (messageList.current) {
                        const childDiv = messageList.current.children.item(1);
                        if (childDiv) {
                            childDiv.scrollTo(0, childDiv.scrollHeight);
                        }
                    }
                }, 50);
            });
    };

    useEffect(() => {
        if (!chatId || isNaN(parseInt(chatId))) return;

        setMessages([]);
        fetchMessages(parseInt(chatId));
    }, [userId, chatId]);

    useEffect(() => {
        if (!socket) return;

        const onMessage = (newMessage: MessageData & { chatId: number }) => {
            if (newMessage.chatId.toString() !== chatId) return;

            addMessages([newMessage], true);
        };

        socket.on('chat', onMessage);

        return () => {
            socket.off('chat', onMessage);
        }
    }, [chatId, socket]);

    const onMessageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') onSubmit();
    };

    const onSubmit = () => {
        if (message.length === 0) return;

        setLoading(true);

        sendReq(`/messages/${chatId}`, 'POST', {
            message: message
        }).then(res => {
            setLoading(false);

            if (!res.fetched) {
                toast.error('Something went wrong while sending your message. Please try again later.');
                return;
            } else if (!res.ok || !res.data?.success) {
                toast.error(res.data.error);
                return;
            }

            setMessage('');
            if (messageInput.current) {
                messageInput.current.disabled = false;
                messageInput.current.focus();
            }
        });
    };

    const onImageDialogOpen = () => {};

    if (error.length > 0) {
        return (
            <Error error={error} />
        );
    }

    if (messages.length === 0 || chatInfo === null) {
        return (
            <div className="flex-1 w-full flex flex-row">
                <Loading />
            </div>
        );
    }

    const renderedMessages = [];
    let currentId = null;
    let currentDate = null;
    let current: MessageData[] = [];
    for (const data of messages) {
        const date = moment(data.timestamp).format('MMMM Do, YYYY');

        if (data.authorId !== currentId || date !== currentDate) {
            for (let i = 0; i < current.length; i++) {
                renderedMessages.push(
                    <Message key={current[i].id} data={current[i]} last={i === current.length - 1} />
                );
            }

            currentId = data.authorId;
            current = [];
        }

        if (date !== currentDate) {
            renderedMessages.push(
                <div key={date} className="w-full py-2 px-4 flex flex-row gap-2 items-center">
                    <div className="flex-1 h-[1px] bg-neutral-200"/>
                    <p className="text-center text-sm">{date}</p>
                    <div className="flex-1 h-[1px] bg-neutral-200"/>
                </div>
            );
            currentDate = date;
        }

        current.push(data);
    }

    for (let i = 0; i < current.length; i++) {
        renderedMessages.push(
            <Message key={current[i].id} data={current[i]} last={i === current.length - 1} />
        );
    }

    return (
        <div className="flex-1 w-full flex flex-row justify-center">
            <div className="w-160 h-[calc(100vh-6rem)] border-x flex flex-col">
                <div className="w-full p-4 border-b">
                    {chatInfo.postId
                        ? <Link to={`/listing/${chatInfo.postId}`} className="font-bold text-xl">{chatInfo.postName}</Link>
                        : <p className="font-bold text-xl">Deleted post</p>}

                    <p>{chatInfo.recipientName}</p>
                </div>
                <ScrollArea className="flex-1" ref={messageList}>
                    <div className="flex flex-col py-4">
                        <div className="w-full flex flex-row justify-center">
                            {hasMoreMessages
                                ? <Button variant="outline" disabled={loading} onClick={() => fetchMessages(parseInt(chatId || '0'), messages[0].id)}>
                                    {!loading
                                        ? 'Load More'
                                        : <MoonLoader size={16} />}
                                </Button>
                                : <span className="text-neutral-400">You have reached the beginning of this conversation.</span>}
                        </div>
                        {renderedMessages}
                    </div>
                </ScrollArea>
                <div className="w-full p-4 border-t">
                    <div className="flex flex-row gap-2">
                        <Button size="sm" variant="outline" disabled={loading} onClick={onImageDialogOpen}>
                            {!loading
                                ? <ImagePlus/>
                                : <MoonLoader size={16} color='white'/>}
                        </Button>
                        <Input
                            className="flex-1"
                            type="text"
                            placeholder="Type your message here..."
                            required
                            value={message}
                            onChange={onMessageInput}
                            onKeyDown={onKeyDown}
                            disabled={loading}
                            maxLength={2000}
                            ref={messageInput}
                        />
                        <Button size="sm" disabled={loading || message.length === 0} onClick={onSubmit}>
                            {!loading
                                ? <SendHorizontal/>
                                : <MoonLoader size={16} color='white'/>}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}