export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    // Allows to automatically instantiate createClient with right options
    // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
    __InternalSupabase: {
        PostgrestVersion: "14.1"
    }
    public: {
        Tables: {
            categories: {
                Row: {
                    created_at: string
                    description: string | null
                    group_id: string | null
                    icon_name: string | null
                    id: string
                    name: string
                    order_index: number | null
                    slug: string
                }
                Insert: {
                    created_at?: string
                    description?: string | null
                    group_id?: string | null
                    icon_name?: string | null
                    id?: string
                    name: string
                    order_index?: number | null
                    slug: string
                }
                Update: {
                    created_at?: string
                    description?: string | null
                    group_id?: string | null
                    icon_name?: string | null
                    id?: string
                    name?: string
                    order_index?: number | null
                    slug?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "categories_group_id_fkey"
                        columns: ["group_id"]
                        isOneToOne: false
                        referencedRelation: "category_groups"
                        referencedColumns: ["id"]
                    },
                ]
            }
            category_groups: {
                Row: {
                    created_at: string | null
                    id: string
                    name: string
                    order_index: number | null
                    slug: string
                }
                Insert: {
                    created_at?: string | null
                    id?: string
                    name: string
                    order_index?: number | null
                    slug: string
                }
                Update: {
                    created_at?: string | null
                    id?: string
                    name?: string
                    order_index?: number | null
                    slug?: string
                }
                Relationships: []
            }
            comments: {
                Row: {
                    author_id: string
                    content: string
                    created_at: string
                    id: string
                    post_id: string
                    updated_at: string
                }
                Insert: {
                    author_id: string
                    content: string
                    created_at?: string
                    id?: string
                    post_id: string
                    updated_at?: string
                }
                Update: {
                    author_id?: string
                    content?: string
                    created_at?: string
                    id?: string
                    post_id?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "comments_author_id_fkey"
                        columns: ["author_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "comments_post_id_fkey"
                        columns: ["post_id"]
                        isOneToOne: false
                        referencedRelation: "posts"
                        referencedColumns: ["id"]
                    },
                ]
            }
            post_favorites: {
                Row: {
                    created_at: string
                    id: string
                    post_id: string
                    user_id: string
                }
                Insert: {
                    created_at?: string
                    id?: string
                    post_id: string
                    user_id: string
                }
                Update: {
                    created_at?: string
                    id?: string
                    post_id?: string
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "post_favorites_post_id_fkey"
                        columns: ["post_id"]
                        isOneToOne: false
                        referencedRelation: "posts"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "post_favorites_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            post_reactions: {
                Row: {
                    created_at: string
                    id: string
                    post_id: string
                    type: string
                    user_id: string
                }
                Insert: {
                    created_at?: string
                    id?: string
                    post_id: string
                    type: string
                    user_id: string
                }
                Update: {
                    created_at?: string
                    id?: string
                    post_id?: string
                    type?: string
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "post_reactions_post_id_fkey"
                        columns: ["post_id"]
                        isOneToOne: false
                        referencedRelation: "posts"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "post_reactions_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            posts: {
                Row: {
                    author_id: string
                    category_id: string | null
                    content: string
                    created_at: string
                    id: string
                    image_url: string | null
                    status: string
                    tags: string[] | null
                    title: string
                    updated_at: string
                    views: number | null
                }
                Insert: {
                    author_id: string
                    category_id?: string | null
                    content: string
                    created_at?: string
                    id?: string
                    image_url?: string | null
                    status?: string
                    tags?: string[] | null
                    title: string
                    updated_at?: string
                    views?: number | null
                }
                Update: {
                    author_id?: string
                    category_id?: string | null
                    content?: string
                    created_at?: string
                    id?: string
                    image_url?: string | null
                    status?: string
                    tags?: string[] | null
                    title?: string
                    updated_at?: string
                    views?: number | null
                }
                Relationships: [
                    {
                        foreignKeyName: "posts_author_id_fkey"
                        columns: ["author_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "posts_category_id_fkey"
                        columns: ["category_id"]
                        isOneToOne: false
                        referencedRelation: "categories"
                        referencedColumns: ["id"]
                    },
                ]
            }
            profiles: {
                Row: {
                    avatar_url: string | null
                    bio: string | null
                    full_name: string | null
                    id: string
                    updated_at: string | null
                    username: string | null
                    website: string | null
                    cover_url: string | null
                    is_approved: boolean | null
                }
                Insert: {
                    avatar_url?: string | null
                    bio?: string | null
                    full_name?: string | null
                    id: string
                    updated_at?: string | null
                    username?: string | null
                    website?: string | null
                    cover_url?: string | null
                    is_approved?: boolean | null
                }
                Update: {
                    avatar_url?: string | null
                    bio?: string | null
                    full_name?: string | null
                    id?: string
                    updated_at?: string | null
                    username?: string | null
                    website?: string | null
                    cover_url?: string | null
                    is_approved?: boolean | null
                }
                Relationships: []
            }
            invites: {
                Row: {
                    code: string
                    created_at: string
                    id: string
                    max_uses: number
                    used_count: number
                }
                Insert: {
                    code?: string
                    created_at?: string
                    id?: string
                    max_uses?: number
                    used_count?: number
                }
                Update: {
                    code?: string
                    created_at?: string
                    id?: string
                    max_uses?: number
                    used_count?: number
                }
                Relationships: []
            }
            access_requests: {
                Row: {
                    id: string
                    user_id: string
                    status: string
                    created_at: string
                    updated_at: string | null
                }
                Insert: {
                    id?: string
                    user_id: string
                    status?: string
                    created_at?: string
                    updated_at?: string | null
                }
                Update: {
                    id?: string
                    user_id?: string
                    status?: string
                    created_at?: string
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "access_requests_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
            landing_page_requests: {
                Row: {
                    id: string
                    email: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    email: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    created_at?: string
                }
                Relationships: []
            }
            user_follows: {
                Row: {
                    created_at: string
                    follower_id: string
                    following_id: string
                    id: string
                }
                Insert: {
                    created_at?: string
                    follower_id: string
                    following_id: string
                    id?: string
                }
                Update: {
                    created_at?: string
                    follower_id?: string
                    following_id?: string
                    id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "user_follows_follower_id_fkey"
                        columns: ["follower_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "user_follows_following_id_fkey"
                        columns: ["following_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
            comment_reactions: {
                Row: {
                    comment_id: string
                    created_at: string
                    id: string
                    type: string
                    user_id: string
                }
                Insert: {
                    comment_id: string
                    created_at?: string
                    id?: string
                    type: string
                    user_id: string
                }
                Update: {
                    comment_id?: string
                    created_at?: string
                    id?: string
                    type?: string
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "comment_reactions_comment_id_fkey"
                        columns: ["comment_id"]
                        isOneToOne: false
                        referencedRelation: "comments"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "comment_reactions_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            check_invite: {
                Args: {
                    code_input: string
                }
                Returns: boolean
            }
            create_invite: {
                Args: {
                    uses: number
                }
                Returns: string
            }
            get_post_favorites: {
                Args: {
                    target_post_id: string
                }
                Returns: {
                    user_id: string
                    username: string
                    avatar_url: string
                }[]
            }
            toggle_favorite: {
                Args: {
                    target_post_id: string
                }
                Returns: boolean
            }
            delete_topic_fully: {
                Args: {
                    target_post_id: string
                }
                Returns: void
            }
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
