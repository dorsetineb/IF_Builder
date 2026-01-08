import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';
import { Search, User, Star, LayoutGrid, List } from 'lucide-react'; // Added LayoutGrid, List
import { useNavigate } from 'react-router-dom';

type Profile = Database['public']['Tables']['profiles']['Row'] & {
    posts: { count: number }[];
    comments: { count: number }[];
};

const Authors: React.FC = () => {
    const navigate = useNavigate();
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid'); // View mode state

    useEffect(() => {
        fetchProfiles();
        checkUser();
    }, []);

    const checkUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) setCurrentUser(user);
    };

    const fetchProfiles = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('profiles')
            .select(`
                *,
                posts:posts(count),
                comments:comments(count)
            `)
            .order('username', { ascending: true });

        if (error) console.error('Error fetching profiles:', error);

        if (data) setProfiles(data as any);
        setLoading(false);
    };

    const [favorites, setFavorites] = useState<Set<string>>(new Set());

    const toggleFavorite = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setFavorites(prev => {
            const newFavs = new Set(prev);
            if (newFavs.has(id)) newFavs.delete(id);
            else newFavs.add(id);
            return newFavs;
        });
    };

    const getCoverImage = (uid: string) => {
        return `https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2070&auto=format&fit=crop`;
    };

    const filteredProfiles = profiles.filter(profile =>
        (profile.username?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (profile.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (profile.bio?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-full font-sans text-xs bg-background flex flex-col">
            {/* Header */}
            <div className="h-[61px] border-b border-border flex items-center justify-between px-8 sticky top-0 bg-background/95 backdrop-blur z-20 shrink-0">
                <div className="flex flex-col justify-center h-full">
                    <h1 className="text-xl font-bold text-foreground">Comunidade de Autores</h1>
                    <p className="text-[10px] text-muted-foreground hidden md:block">Conheça as mentes criativas por trás das histórias.</p>
                </div>
                <div className="flex items-center gap-3"></div>
            </div>

            <div className="flex-1 p-8 max-w-[1600px] mx-auto w-full">

                {/* Search Bar & View Toggle Row */}
                <div className="flex flex-row gap-4 mb-8 items-center">
                    <div className="relative flex-1 group">
                        <input
                            type="text"
                            placeholder="Pesquisar autores..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-input border border-input rounded-xl py-2.5 pl-10 pr-4 text-sm text-foreground focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 placeholder:text-muted-foreground transition-all group-hover:border-purple-500/30"
                        />
                        <Search className="absolute left-3.5 top-3 text-muted-foreground group-hover:text-purple-400 transition-colors" size={16} />
                    </div>

                    {/* View Toggles */}
                    <div className="flex bg-muted/50 p-1 rounded-lg border border-border/50 shrink-0">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-background shadow-sm text-purple-400' : 'text-muted-foreground hover:text-foreground'}`}
                            title="Visualização em Grade"
                        >
                            <LayoutGrid size={16} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-background shadow-sm text-purple-400' : 'text-muted-foreground hover:text-foreground'}`}
                            title="Visualização em Lista"
                        >
                            <List size={16} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="text-center p-8 text-muted-foreground">Carregando autores...</div>
                ) : filteredProfiles.length > 0 ? (
                    <div className={viewMode === 'grid'
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        : "flex flex-col gap-4"
                    }>
                        {filteredProfiles.map(profile => {
                            const postCount = profile.posts?.[0]?.count || 0;
                            const replyCount = profile.comments?.[0]?.count || 0;
                            const displayTags = profile.interests && profile.interests.length > 0
                                ? profile.interests.slice(0, 3)
                                : ['Criador'];
                            const coverUrl = profile.cover_url || getCoverImage(profile.id);
                            const isFavorite = favorites.has(profile.id);

                            if (viewMode === 'grid') {
                                // Grid Card Implementation
                                return (
                                    <div
                                        key={profile.id}
                                        onClick={() => navigate(`/community/author/${profile.id}`)}
                                        className="relative bg-card border border-border rounded-xl flex flex-col items-center text-center group hover:border-purple-500/30 transition-all cursor-pointer hover:shadow-lg hover:shadow-purple-500/5 overflow-hidden"
                                    >
                                        {/* Cover Image - Adjusted Height to h-36 and overlap */}
                                        <div className="w-full h-36 bg-muted z-0 overflow-hidden relative shrink-0">
                                            <img
                                                src={coverUrl}
                                                alt="Cover"
                                                className="w-full h-full object-cover opacity-50 group-hover:opacity-75 group-hover:scale-110 transition-all duration-700"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-card/90"></div>
                                        </div>

                                        <button
                                            onClick={(e) => toggleFavorite(e, profile.id)}
                                            className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-lg border transition-all z-20 backdrop-blur-sm shadow-sm ${isFavorite
                                                ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50 hover:bg-yellow-500 hover:text-white'
                                                : 'bg-black/40 text-muted-foreground border-white/10 hover:bg-black/60 hover:text-white hover:border-white/30'
                                                }`}
                                            title="Favoritar Autor"
                                        >
                                            <Star size={14} fill={isFavorite ? "currentColor" : "none"} />
                                        </button>

                                        {/* Content Container - Increased negative margin for ~80% overlap (80px of 96px) */}
                                        <div className="w-full px-4 flex flex-col items-center z-10 relative flex-1 -mt-20">
                                            <div className="w-24 h-24 rounded-full border-4 border-card shadow-md mb-2 group-hover:scale-105 transition-transform duration-300 bg-muted shrink-0">
                                                {profile.avatar_url ? (
                                                    <img src={profile.avatar_url} alt={profile.username || 'User'} className="w-full h-full object-cover rounded-full" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground rounded-full">
                                                        <User size={32} />
                                                    </div>
                                                )}
                                            </div>

                                            <h3 className="font-bold text-base text-foreground mb-1.5">{profile.username || 'Anônimo'}</h3>

                                            <div className="flex flex-wrap gap-1 justify-center mb-3 min-h-[20px]">
                                                {displayTags.map((tag, i) => (
                                                    <span key={i} className="bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-[4px]">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>

                                            <p className="text-muted-foreground text-[11px] leading-relaxed mb-4 line-clamp-3 px-1 w-full">
                                                {profile.bio || 'Criando mundos e histórias interativas.'}
                                            </p>

                                            <div className="flex-1"></div>

                                            <div className="grid grid-cols-2 w-full bg-muted/40 rounded-lg py-2 px-2 gap-px border border-border/50 mb-4 shrink-0">
                                                <div className="flex flex-col items-center border-r border-border/50">
                                                    <span className="text-base font-bold text-foreground">{postCount}</span>
                                                    <span className="text-[9px] text-muted-foreground uppercase tracking-wider font-medium">Tópicos</span>
                                                </div>
                                                <div className="flex flex-col items-center">
                                                    <span className="text-base font-bold text-foreground">{replyCount}</span>
                                                    <span className="text-[9px] text-muted-foreground uppercase tracking-wider font-medium">Respostas</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            } else {
                                // List Card Implementation (Wide Layout)
                                return (
                                    <div
                                        key={profile.id}
                                        onClick={() => navigate(`/community/author/${profile.id}`)}
                                        className="relative bg-card border border-border rounded-xl flex flex-col group hover:border-purple-500/30 transition-all cursor-pointer hover:shadow-md hover:shadow-purple-500/5 overflow-hidden h-auto"
                                    >
                                        {/* Cover Banner (Top) */}
                                        <div className="w-full h-24 bg-muted z-0 overflow-hidden relative shrink-0">
                                            <img
                                                src={coverUrl}
                                                alt="Cover"
                                                className="w-full h-full object-cover opacity-50 group-hover:opacity-75 group-hover:scale-110 transition-all duration-700"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-card/90"></div>
                                        </div>

                                        {/* Favorite Action - Top Right (Full Button) */}
                                        <button
                                            onClick={(e) => toggleFavorite(e, profile.id)}
                                            className={`absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all z-20 backdrop-blur-sm ${isFavorite
                                                ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/50 hover:bg-yellow-500 hover:text-white'
                                                : 'bg-black/40 text-muted-foreground border-white/10 hover:bg-black/60 hover:text-white hover:border-white/30'
                                                }`}
                                            title="Favoritar Autor"
                                        >
                                            <Star size={14} fill={isFavorite ? "currentColor" : "none"} />
                                            <span className="font-bold text-[10px] uppercase tracking-wide">Favorito</span>
                                        </button>

                                        {/* Content Container */}
                                        <div className="flex flex-col md:flex-row items-stretch w-full px-6 pb-6 relative z-10 -mt-[52px]"> {/* Changed items-start to items-stretch for bottom align */}

                                            {/* Avatar Area (Left overlapping) */}
                                            <div className="shrink-0 mr-12 relative"> {/* Increased margin to mr-12 for larger gap */}
                                                <div className="w-24 h-24 rounded-lg border-4 border-card shadow-md group-hover:scale-105 transition-transform duration-300 bg-muted">
                                                    {profile.avatar_url ? (
                                                        <img src={profile.avatar_url} alt={profile.username || 'User'} className="w-full h-full object-cover rounded-lg" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground rounded-lg">
                                                            <User size={32} />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Info Column */}
                                            <div className="flex-1 pt-14 md:pt-14 flex flex-col min-w-0 mr-4 justify-center">
                                                <div className="flex items-center gap-3 mb-1.5">
                                                    <h3 className="font-bold text-lg text-foreground truncate">{profile.username || 'Anônimo'}</h3>
                                                    <div className="flex gap-1">
                                                        {displayTags.map((tag, i) => (
                                                            <span key={i} className="bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-[4px]">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2 w-full max-w-2xl">
                                                    {profile.bio || 'Criando mundos e histórias interativas.'}
                                                </p>
                                            </div>

                                            {/* Stats (Bottom Aligned) */}
                                            <div className="flex items-end gap-8 pb-1 shrink-0 pl-4 self-end"> {/* self-end forces it to bottom of container if stretch is on */}
                                                <div className="flex flex-col items-center">
                                                    <span className="text-lg font-bold text-foreground">{postCount}</span>
                                                    <span className="text-[9px] text-muted-foreground uppercase tracking-wider font-medium">Tópicos</span>
                                                </div>
                                                <div className="flex flex-col items-center">
                                                    <span className="text-lg font-bold text-foreground">{replyCount}</span>
                                                    <span className="text-[9px] text-muted-foreground uppercase tracking-wider font-medium">Respostas</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                        })}
                    </div>
                ) : (
                    <div className="text-center p-8 text-muted-foreground">Nenhum autor encontrado.</div>
                )}
            </div>
        </div>
    );
};

export default Authors;
