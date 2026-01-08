import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Copy, Plus, RefreshCw, Ticket } from 'lucide-react';

interface Invite {
    id: string;
    code: string;
    max_uses: number;
    used_count: number;
    created_at: string;
}

export const InviteManager: React.FC = () => {
    const [invites, setInvites] = useState<Invite[]>([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    const fetchInvites = async () => {
        try {
            const { data, error } = await supabase
                .from('invites')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setInvites(data || []);
        } catch (err) {
            console.error('Error fetching invites:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerate = async () => {
        setGenerating(true);
        try {
            const { data, error } = await supabase.rpc('create_invite', { uses: 1 });
            if (error) throw error;
            await fetchInvites();
        } catch (err) {
            console.error('Error generating invite:', err);
        } finally {
            setGenerating(false);
        }
    };

    const copyToClipboard = (code: string) => {
        navigator.clipboard.writeText(code);
        // Could add toast here
    };

    useEffect(() => {
        fetchInvites();
    }, []);

    if (loading) return <div className="text-sm text-zinc-500">Carregando convites...</div>;

    return (
        <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                        <Ticket size={24} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-foreground">Convites Beta</h2>
                        <p className="text-xs text-muted-foreground">Gerencie o acesso de novos membros.</p>
                    </div>
                </div>
                <button
                    onClick={handleGenerate}
                    disabled={generating}
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
                >
                    {generating ? <RefreshCw size={16} className="animate-spin" /> : <Plus size={16} />}
                    Gerar Código
                </button>
            </div>

            {invites.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground bg-zinc-900/50 rounded-lg border border-dashed border-zinc-800">
                    Nenhum convite gerado ainda.
                </div>
            ) : (
                <div className="limit-h-60 overflow-y-auto space-y-3">
                    {invites.map((invite) => (
                        <div key={invite.id} className="flex items-center justify-between bg-zinc-900/50 p-3 rounded-lg border border-border hover:border-purple-500/30 transition-colors">
                            <div className="flex flex-col">
                                <span className="font-mono text-xl font-bold tracking-wider text-purple-300">{invite.code}</span>
                                <span className="text-xs text-muted-foreground">
                                    {new Date(invite.created_at).toLocaleDateString()} • {invite.used_count}/{invite.max_uses} usos
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                {invite.used_count >= invite.max_uses ? (
                                    <span className="text-xs bg-red-500/10 text-red-400 px-2 py-1 rounded">Esgotado</span>
                                ) : (
                                    <span className="text-xs bg-green-500/10 text-green-400 px-2 py-1 rounded">Ativo</span>
                                )}
                                <button
                                    onClick={() => copyToClipboard(invite.code)}
                                    className="p-2 hover:bg-white/10 rounded-md text-zinc-400 hover:text-white transition-colors"
                                    title="Copiar código"
                                >
                                    <Copy size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
