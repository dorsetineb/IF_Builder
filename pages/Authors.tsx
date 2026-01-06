import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';
import { Search, User, ExternalLink, Calendar } from 'lucide-react';

type Profile = Database['public']['Tables']['profiles']['Row'];

const Authors: React.FC = () => {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProfiles();
    }, []);

    const fetchProfiles = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('profiles').select('*').order('username', { ascending: true });
        if (error) console.error('Error fetching profiles:', error);
        if (data) setProfiles(data);
        setLoading(false);
    };

    const filteredProfiles = profiles.filter(profile =>
        (profile.username?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (profile.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (profile.bio?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-full font-sans text-xs bg-background">
            {/* Standard Header */}
            <div className="h-[61px] border-b border-border flex items-center justify-between px-8 sticky top-0 bg-background/95 backdrop-blur z-10 shrink-0">
                <h1 className="text-xl font-bold text-foreground">Comunidade de Autores</h1>

                <div className="relative w-80">
                    <input
                        type="text"
                        placeholder="Pesquisar autores..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-input border border-input rounded-lg py-1.5 pl-9 pr-3 text-xs text-foreground focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 placeholder:text-muted-foreground"
                    />
                    <Search className="absolute left-3 top-2 text-muted-foreground" size={14} />
                </div>
            </div>

            <div className="p-8 max-w-[1600px] mx-auto">
                <div className="mb-6">
                    <p className="text-muted-foreground text-xs">Conheça as mentes criativas por trás das histórias.</p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {loading ? (
                        <div className="col-span-full text-center p-8 text-muted-foreground">Carregando autores...</div>
                    ) : filteredProfiles.length > 0 ? (
                        filteredProfiles.map(profile => (
                            <div key={profile.id} className="bg-card border border-border rounded-lg p-4 flex flex-col gap-3 group hover:border-purple-500/30 transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-muted border border-border overflow-hidden flex-shrink-0">
                                        {profile.avatar_url ? (
                                            <img src={profile.avatar_url} alt={profile.username || 'User'} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                                                <User size={16} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-foreground truncate">{profile.username || 'Anônimo'}</h3>
                                        <p className="text-[10px] text-muted-foreground truncate">{profile.full_name || 'Sem nome completo'}</p>
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <p className="text-muted-foreground text-[10px] line-clamp-3 h-[45px]">
                                        {profile.bio || 'Este autor ainda não escreveu uma biografia.'}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-border/50 text-[10px] text-muted-foreground">
                                    <div className="flex items-center gap-1.5" title={`Entrou em ${new Date(profile.created_at).toLocaleDateString()}`}>
                                        <Calendar size={12} />
                                        <span>{new Date(profile.created_at).toLocaleDateString()}</span>
                                    </div>
                                    {profile.website && (
                                        <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-purple-400 transition-colors">
                                            Website <ExternalLink size={10} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center p-8 text-muted-foreground">Nenhum autor encontrado.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Authors;
