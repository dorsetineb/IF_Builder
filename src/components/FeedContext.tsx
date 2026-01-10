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
    invalidateCache: () => void;
}

const FeedContext = createContext<FeedContextType | undefined>(undefined);

export const FeedProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [posts, setPosts] = useState<PostWithAuthor[]>([]);
    const [lastFetched, setLastFetched] = useState<number | null>(null);
    const [scrollPosition, setScrollPosition] = useState(0);

    const invalidateCache = () => {
        setPosts([]);
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
