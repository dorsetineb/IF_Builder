import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';
import { User, Heart, FileText, Camera } from 'lucide-react';
import { PostCard } from '../components/PostCard';
import { useToast } from '../components/ToastContext';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Post = Database['public']['Tables']['posts']['Row'] & {
    profiles: Database['public']['Tables']['profiles']['Row'];
    categories: Database['public']['Tables']['categories']['Row'];
    comments: { count: number }[];
};

const AuthorProfile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'recent' | 'popular' | 'favorites'>('recent');
    const [posts, setPosts] = useState<Post[]>([]);
    const [loadingPosts, setLoadingPosts] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);

    // Upload State
    const [uploadingCover, setUploadingCover] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchProfile();
        checkUser();
    }, [id]);

    useEffect(() => {
        if (profile) {
            fetchPosts();
        }
    }, [profile, activeTab]);

    const checkUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUser(user);
    };

    const fetchProfile = async () => {
        if (!id) return;
        setLoading(true);
        const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
        if (error) {
            console.error('Error fetching profile:', error);
        }
        if (data) setProfile(data);
        setLoading(false);
    };

    const fetchPosts = async () => {
        if (!id) return;
        setLoadingPosts(true);
        let query = supabase
            .from('posts')
            .select(`
                *,
                profiles:author_id(*),
                categories:category_id(*),
                comments(count)
            `);

        if (activeTab === 'recent') {
            query = query.eq('author_id', id).eq('status', 'published').order('created_at', { ascending: false });
        } else if (activeTab === 'popular') {
            query = query.eq('author_id', id).eq('status', 'published').order('views', { ascending: false });
        } else if (activeTab === 'favorites') {
            const { data: favs } = await supabase.from('post_favorites').select('post_id').eq('user_id', id);
            if (favs && favs.length > 0) {
                const postIds = favs.map(f => f.post_id);
                query = query.in('id', postIds).eq('status', 'published');
            } else {
                setPosts([]);
                setLoadingPosts(false);
                return;
            }
        }

        const { data, error } = await query;
        if (error) console.error('Error fetching posts:', error);
        if (data) setPosts(data as any);
        setLoadingPosts(false);
    };

    const getCoverImage = (uid: string) => {
        return `https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2070&auto=format&fit=crop`;
    };

    const onToggleFavorite = async (e: React.MouseEvent, postId: string) => {
        e.preventDefault();
        e.stopPropagation();
        if (!currentUser) return;
        console.log("Toggle favorite", postId);
    };

    const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !currentUser || !profile) return;
        if (currentUser.id !== profile.id) return;

        if (!file.type.startsWith('image/')) {
            toast('Erro', 'Selecione uma imagem válida.', 'error');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast('Erro', 'A imagem deve ter no máximo 5MB.', 'error');
            return;
        }

        setUploadingCover(true);
        const fileExt = file.name.split('.').pop();
        const fileName = `covers/${currentUser.id}_${Date.now()}.${fileExt}`;

        try {
            const { error: uploadError } = await supabase.storage
                .from('forum-images')
                .upload(fileName, file, { upsert: true });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('forum-images')
                .getPublicUrl(fileName);

            const { error: updateError } = await supabase
                .from('profiles')
                .update({ cover_url: publicUrl })
                .eq('id', currentUser.id);

            if (updateError) throw updateError;

            setProfile({ ...profile, cover_url: publicUrl });
            toast('Sucesso', 'Capa atualizada com sucesso!', 'success');
        } catch (error: any) {
            console.error('Cover upload error:', error);
            toast('Erro', 'Falha ao atualizar a capa.', 'error');
        } finally {
            setUploadingCover(false);
        }
    };

    if (loading) {
        return <div className="h-full flex items-center justify-center text-muted-foreground">Carregando perfil...</div>;
    }

    if (!profile) {
        return <div className="h-full flex items-center justify-center text-muted-foreground">Autor não encontrado.</div>;
    }

    const isOwner = currentUser?.id === profile.id;

    return (
        <div className="min-h-full font-sans text-xs bg-background overflow-y-auto">
            {/* Cover Image */}
            <div className="h-32 md:h-48 w-full relative overflow-hidden group bg-muted">
                <img
                    src={profile.cover_url || getCoverImage(profile.id)}
                    alt="Cover"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>

                {isOwner && (
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadingCover}
                            className="bg-black/60 hover:bg-black/80 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold backdrop-blur-md flex items-center gap-2 transition-all"
                        >
                            {uploadingCover ? <span className="animate-spin">⌛</span> : <Camera size={14} />}
                            Alterar Capa
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleCoverUpload}
                        />
                    </div>
                )}
            </div>

            <div className="max-w-6xl mx-auto px-6 py-6">
                {/* Profile Info Header - Row Layout */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8 border-b border-border/50 pb-8">

                    {/* 1. Avatar */}
                    <div className="flex-shrink-0">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-card border-4 border-background shadow-lg overflow-hidden relative">
                            {profile.avatar_url ? (
                                <img src={profile.avatar_url} alt={profile.username || ''} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                                    <User size={40} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 2. Name & Tags (Left Block) */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left min-w-[200px] gap-2 pt-2 md:mr-4">
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">
                                {profile.username || 'Anônimo'}
                            </h1>
                            <p className="text-sm text-muted-foreground font-medium">@{profile.username?.toLowerCase().replace(/\s+/g, '') || 'usuario'}</p>
                        </div>

                        {/* Interests / Tags */}
                        <div className="flex flex-wrap justify-center md:justify-start gap-2">
                            {profile.interests && profile.interests.length > 0 ? (
                                profile.interests.map((tag, i) => (
                                    <span key={i} className="px-2 py-1 rounded bg-secondary/50 text-secondary-foreground text-[10px] font-medium border border-border/50">
                                        # {tag}
                                    </span>
                                ))
                            ) : (
                                <span className="text-[10px] text-muted-foreground italic">Sem interesses</span>
                            )}
                        </div>
                    </div>

                    {/* 3. Bio (Middle Block - Responsive Filler) */}
                    <div className="flex-1 w-full md:w-auto pt-2">
                        <p className="text-zinc-300 text-sm leading-relaxed text-center md:text-left">
                            {profile.bio || "Este autor prefere manter o mistério e ainda não escreveu uma biografia. Normalmente uma biografia pode ocupar várias linhas e descrever os gostos do autor."}
                        </p>
                    </div>

                    {/* 4. Actions (Right Block) */}
                    <div className="flex-shrink-0 pt-2">
                        <button
                            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:border-red-500 hover:bg-red-500/5 hover:text-red-500 transition-all text-xs font-bold text-muted-foreground group"
                            onClick={() => console.log("Toggle favorite author")}
                        >
                            <Heart size={16} className="group-hover:fill-current transition-colors" />
                            <span>Favoritar</span>
                        </button>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex items-center gap-8 border-b border-border/50 mb-6 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('recent')}
                        className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all relative ${activeTab === 'recent' ? 'text-purple-400' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        TÓPICOS
                        {activeTab === 'recent' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-purple-500 rounded-t-full"></div>}
                    </button>
                    <button
                        onClick={() => setActiveTab('popular')}
                        className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all relative ${activeTab === 'popular' ? 'text-purple-400' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        POPULARES
                        {activeTab === 'popular' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-purple-500 rounded-t-full"></div>}
                    </button>
                    <button
                        onClick={() => setActiveTab('favorites')}
                        className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all relative ${activeTab === 'favorites' ? 'text-purple-400' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        FAVORITOS
                        {activeTab === 'favorites' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-purple-500 rounded-t-full"></div>}
                    </button>
                </div>

                {/* Content */}
                <div className="pb-12">
                    {loadingPosts ? (
                        <div className="py-12 text-center text-muted-foreground">Carregando...</div>
                    ) : posts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {posts.map(post => {
                                return (
                                    <PostCard
                                        key={post.id}
                                        post={post}
                                        isFavorite={false}
                                        onToggleFavorite={onToggleFavorite}
                                        currentUserId={currentUser?.id}
                                        viewMode="grid"
                                    />
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-12 text-center bg-card border border-border rounded-xl">
                            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-muted-foreground mx-auto mb-3">
                                {activeTab === 'favorites' ? <Heart size={20} /> : <FileText size={20} />}
                            </div>
                            <h3 className="text-sm font-bold text-foreground mb-1">Nada por aqui ainda</h3>
                            <p className="text-muted-foreground text-[10px]">
                                {activeTab === 'favorites' ? 'Este autor ainda não favoritou nenhuma história.' : 'Nenhuma publicação encontrada nesta seção.'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthorProfile;
