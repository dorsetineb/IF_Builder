import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Copy, RefreshCw, Ticket, Check, X } from 'lucide-react';

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
    const [lastInviteCode, setLastInviteCode] = useState<string>('');
    const [copied, setCopied] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    const fetchInvites = async () => {
        try {
            // Timeout to prevent hanging
            const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout loading invites')), 5000));

            const { data, error } = await Promise.race([
                supabase
                    .from('invites')
                    .select('*')
                    .order('created_at', { ascending: false }),
                timeoutPromise
            ]) as any;

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
        setLastInviteCode('');
        try {
            const { data, error } = await supabase.rpc('create_invite', { uses: 1 });
            if (error) throw error;

            // The RPC returns the new code directly as text
            if (data && typeof data === 'string') {
                setLastInviteCode(data);
            } else {
                // Fallback
                const { data: latest } = await supabase.from('invites').select('code').order('created_at', { ascending: false }).limit(1).single();
                if (latest) setLastInviteCode(latest.code);
            }

            await fetchInvites();
        } catch (err) {
            console.error('Error generating invite:', err);
        } finally {
            setGenerating(false);
        }
    };

    const copyToClipboard = (code: string) => {
        if (!code) return;
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const copyFromList = (code: string) => {
        navigator.clipboard.writeText(code);
    }

    useEffect(() => {
        fetchInvites();
    }, []);

    if (loading) return <div className="text-sm text-zinc-500">Carregando convites...</div>;

    return (
        <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4 relative overflow-hidden group hover:border-purple-500/30 transition-all">
            {/* Header Section */}
            <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                    <Ticket size={20} />
                </div>
            </div>

            <div>
                <div className="flex justify-between items-center mb-3">
                    <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-wider">Código para Acesso Beta</p>
                    <button
                        onClick={() => setShowHistory(true)}
                        className="text-[10px] font-bold text-purple-400 hover:text-purple-300 transition-colors uppercase"
                    >
                        Ver Histórico
                    </button>
                </div>

                <div className="space-y-4">
                    {/* Control Row: Button Left, Input Right */}
                    <div className="flex gap-3">
                        <button
                            onClick={handleGenerate}
                            disabled={generating}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-bold text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-purple-900/20 whitespace-nowrap"
                        >
                            {generating ? <RefreshCw size={14} className="animate-spin" /> : null}
                            {generating ? 'Gerando...' : 'Gerar Código'}
                        </button>

                        <div className="relative flex-1 group/input">
                            <input
                                type="text"
                                readOnly
                                placeholder="Código gerado..."
                                className="w-full bg-secondary/50 border border-border rounded-lg pl-3 pr-9 py-2 text-xs font-mono text-center tracking-wider focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder:text-muted-foreground/50 cursor-copy"
                                value={lastInviteCode}
                                onClick={() => copyToClipboard(lastInviteCode)}
                            />
                            {lastInviteCode && (
                                <button
                                    onClick={() => copyToClipboard(lastInviteCode)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                                >
                                    {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* History Modal */}
                    {showHistory && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setShowHistory(false)}>
                            <div
                                className="bg-card border border-border rounded-xl p-6 w-full max-w-md shadow-2xl relative animate-in zoom-in-95 duration-200"
                                onClick={e => e.stopPropagation()}
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                                        <Ticket size={20} className="text-purple-400" />
                                        Histórico de Convites
                                    </h3>
                                    <button onClick={() => setShowHistory(false)} className="text-muted-foreground hover:text-white transition-colors">
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="max-h-[60vh] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                    {invites.length > 0 ? invites.map((invite) => (
                                        <div key={invite.id} className="flex items-center justify-between bg-secondary/50 p-3 rounded-lg border border-border hover:border-purple-500/30 transition-colors group/invite">
                                            <span className="font-mono text-sm font-bold text-foreground tracking-wider select-all">{invite.code}</span>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-[10px] px-2 py-0.5 rounded ${invite.used_count >= invite.max_uses ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                                                    {invite.used_count}/{invite.max_uses}
                                                </span>
                                                <button
                                                    onClick={() => copyFromList(invite.code)}
                                                    className="text-muted-foreground hover:text-white transition-colors p-1"
                                                    title="Copiar"
                                                >
                                                    <Copy size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    )) : (
                                        <p className="text-muted-foreground text-center py-8 text-sm">Nenhum convite gerado ainda.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
