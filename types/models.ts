export type User = {
    id: number;
    name: string;
    avatar_custom: number;
    avatar_file: string;
    avatar_full: string;
    avatar_small: string;
    avatar_inline: string;
};

export type Shout = {
    id: number;
    user_id: number;
    content: string;
    created_at: string;
    updated_at: string;
    user: User;
};