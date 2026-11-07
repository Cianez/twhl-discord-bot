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

export type Forum = {
    id: number;
    slug: string;
    name: string;
    description: string;
    permission_id: number | null;
    stat_threads: number;
    stat_posts: number;
    last_post_id: number;
    order_index: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
};

export type ForumThread = {
    id: number;
    forum_id: number;
    user_id: number;
    title: string;
    stat_views: number;
    stat_posts: number;
    last_post_id: number;
    last_post_at: string;
    is_open: boolean;
    is_sticky: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;

    user: User;
    forum: Forum;
    last_post: ForumPost;
};

export type ForumPost = {
    id: number;
    forum_id: number;
    thread_id: number;
    user_id: number;
    content_text: string;
    content_html: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
};
