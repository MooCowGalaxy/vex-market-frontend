export type ListingProps = {
    id: number;
    title: string;
    description: string;
    zipFriendly: string;
    price: number;
    type: 'local' | 'shipping' | 'both';
    condition: string;
    images: string[];
    created: number;
    lastUpdated: number;
    archived: boolean;
    authorId: number;
};

export type MessageData = {
    id: number;
    authorId: number;
    timestamp: number;
    message: string;
    image: string | null;
};