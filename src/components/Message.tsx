import { MessageData } from '@/types';
import useRequireAuth from '@/hooks/useRequireAuth.ts';
import moment from 'moment';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip.tsx';

export default function Message({ data, last }: { data: MessageData, last: boolean }) {
    const { userId } = useRequireAuth();
    if (!userId) return null;

    const isSelf = data.authorId === userId;

    return (
        <div className="w-full">
            <div className={`relative ${isSelf ? 'float-right pr-4' : 'float-left pl-4'} max-w-[75%] ${last ? 'p-2' : 'p-2 pb-0'}`}>
                <div>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <div className={`${isSelf ? 'bg-primary ml-auto' : 'bg-secondary border mr-auto'} max-w-full rounded-lg rounded-br-sm shadow-sm px-4 py-1`}>
                                    <p className={`text-base ${isSelf ? 'text-primary-foreground' : 'text-secondary-foreground'} text-left`}>{data.message}</p>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{moment(data.timestamp).format('MMMM Do YYYY, h:mm A')}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                {last && <p className="text-xs text-neutral-400 float-right">{moment(data.timestamp).format('LT')}</p>}
            </div>
        </div>
    );
}