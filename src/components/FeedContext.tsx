import React, { createContext, useContext, useState, useRef, ReactNode } from 'react';
import { Database } from '../types/supabase';

type PostWithAuthor = Database['public']['Tables']['posts']['Row'] & {
    profiles: Database['public']['Tables']['profiles']['Row'];
    categories: Database['public']['Tables']['categories']['Row'];
    comments: { count: number }[];
    post_reactions: { type: string }[];
};

interface FeedContextType {
    posts: PostWithAuthor[];
    setPosts: (posts: PostWithAuthor[]) => void;
    lastFetched: number | null;
    setLastFetched: (timestamp: number) => void;
    scrollPosition: number;
    setScrollPosition: (pos: number) => void;
    categories: Database['public']['Tables']['categories']['Row'][];
    setCategories: (categories: Database['public']['Tables']['categories']['Row'][]) => void;
    categoryGroups: (Database['public']['Tables']['category_groups']['Row'] & { categories: Database['public']['Tables']['categories']['Row'][] })[];
    setCategoryGroups: (groups: (Database['public']['Tables']['category_groups']['Row'] & { categories: Database['public']['Tables']['categories']['Row'][] })[]) => void;
    invalidateCache: () => void;
}

const FeedContext = createContext<FeedContextType | undefined>(undefined);

export const FeedProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [posts, setPosts] = useState<PostWithAuthor[]>(() => {
        try {
            const saved = localStorage.getItem('community_posts_cache');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error('Failed to load posts from cache', e);
            return [];
        }
    });

    // Valid cache time could also be stored, but let's start with posts
    const [lastFetched, setLastFetched] = useState<number | null>(() => {
        const saved = localStorage.getItem('community_posts_timestamp');
        return saved ? parseInt(saved) : null;
    });

    const [scrollPosition, setScrollPosition] = useState(0);

    // Effect to modify setPosts to also save to local storage would be cleaner if we wrap it,
    // but useEffect is easier for now to catch all changes.
    React.useEffect(() => {
        localStorage.setItem('community_posts_cache', JSON.stringify(posts));
    }, [posts]);

    React.useEffect(() => {
        if (lastFetched) {
            localStorage.setItem('community_posts_timestamp', lastFetched.toString());
        }
    }, [lastFetched]);

    const [categories, setCategories] = useState<Database['public']['Tables']['categories']['Row'][]>(() => {
        try {
            const saved = localStorage.getItem('community_categories_cache');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error('Failed to load categories from cache', e);
            return [];
        }
    });

    const [categoryGroups, setCategoryGroups] = useState<(Database['public']['Tables']['category_groups']['Row'] & { categories: Database['public']['Tables']['categories']['Row'][] })[]>(() => {
        try {
            const saved = localStorage.getItem('community_groups_cache');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error('Failed to load groups from cache', e);
            return [];
        }
    });

    React.useEffect(() => {
        localStorage.setItem('community_categories_cache', JSON.stringify(categories));
    }, [categories]);

    React.useEffect(() => {
        localStorage.setItem('community_groups_cache', JSON.stringify(categoryGroups));
    }, [categoryGroups]);

    const invalidateCache = () => {
        setPosts([]);
        setCategories([]);
        setCategoryGroups([]);
        setLastFetched(null);
        setScrollPosition(0);
    };

    return (
        <FeedContext.Provider value={{
            posts,
            setPosts,
            lastFetched,
            setLastFetched,
            scrollPosition,
            setScrollPosition,
            categories,
            setCategories,
            categoryGroups,
            setCategoryGroups,
            invalidateCache
        }}>
            {children}
        </FeedContext.Provider>
    );
};

export const useFeed = () => {
    const context = useContext(FeedContext);
    if (context === undefined) {
        throw new Error('useFeed must be used within a FeedProvider');
    }
    return context;
};
