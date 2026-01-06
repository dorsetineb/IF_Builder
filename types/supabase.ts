export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    username: string | null
                    avatar_url: string | null
                    full_name: string | null
                    bio: string | null
                    website: string | null
                    created_at: string
                    updated_at: string | null
                }
                Insert: {
                    id: string
                    username?: string | null
                    avatar_url?: string | null
                    full_name?: string | null
                    bio?: string | null
                    website?: string | null
                    created_at?: string
                    updated_at?: string | null
                }
                Update: {
                    id?: string
                    username?: string | null
                    avatar_url?: string | null
                    full_name?: string | null
                    bio?: string | null
                    website?: string | null
                    created_at?: string
                    updated_at?: string | null
                }
            }
            categories: {
                Row: {
                    id: string
                    name: string
                    slug: string
                    description: string | null
                    icon_name: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    slug: string
                    description?: string | null
                    icon_name?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    slug?: string
                    description?: string | null
                    icon_name?: string | null
                    created_at?: string
                }
            }
            posts: {
                Row: {
                    id: string
                    title: string
                    content: string
                    author_id: string
                    category_id: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    content: string
                    author_id: string
                    category_id?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    content?: string
                    author_id?: string
                    category_id?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            comments: {
                Row: {
                    id: string
                    content: string
                    post_id: string
                    author_id: string
                    parent_id: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    content: string
                    post_id: string
                    author_id: string
                    parent_id?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    content?: string
                    post_id?: string
                    author_id?: string
                    parent_id?: string | null
                    created_at?: string
                }
            }
            post_reactions: {
                Row: {
                    id: string
                    post_id: string
                    user_id: string
                    type: 'like' | 'super_like' | 'dislike'
                    created_at: string
                }
                Insert: {
                    id?: string
                    post_id: string
                    user_id: string
                    type: 'like' | 'super_like' | 'dislike'
                    created_at?: string
                }
                Update: {
                    id?: string
                    post_id?: string
                    user_id?: string
                    type?: 'like' | 'super_like' | 'dislike'
                    created_at?: string
                }
            }
            post_favorites: {
                Row: {
                    id: string
                    post_id: string
                    user_id: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    post_id: string
                    user_id: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    post_id?: string
                    user_id?: string
                    created_at?: string
                }
            }
        }
    }
}
