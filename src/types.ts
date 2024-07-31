export type ListingProps = {
    id: number;
    title: string;
    description: string;
    price: string;
    type: string;
    condition: string;
    zipFriendly: string;
    images: string[];
    authorId: number;
};

export type MessageData = {
    id: number;
    authorId: number;
    timestamp: number;
    message: string;
    image: string | null;
};