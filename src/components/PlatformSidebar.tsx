
import React, { useState } from 'react';
import { LayoutDashboard, Users, Gamepad2, Settings, ChevronDown, ChevronRight, ChevronLeft, MessageSquare, FileText, Star, Share2, Tornado } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const PlatformSidebar: React.FC = () => {
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;

    const [isCollapsed, setIsCollapsed] = useState(false);

    const NavItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => (
        <Link
            to={to}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-r-xl rounded-l-none transition-all text-xs font-medium group relative overflow-hidden ${isActive(to)
                ? `text-primary font-bold ${isCollapsed ? 'bg-transparent' : 'bg-primary/10 border-l-4 border-primary'}`
                : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground border-l-4 border-transparent'
                } ${isCollapsed ? 'justify-center px-0 py-3 rounded-none' : ''}`}
            title={isCollapsed ? label : undefined}
        >
            {/* Hover Glow Effect */}
            <div className={`absolute inset-0 bg-primary/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ${isActive(to) ? 'translate-x-0' : ''}`} />

            <Icon size={isCollapsed ? 20 : 18} className={`flex-shrink-0 relative z-10 ${isActive(to) ? 'text-primary' : ''}`} />
            {!isCollapsed && <span className="truncate relative z-10">{label}</span>}
        </Link>
    );

    return (
        <aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-card border-r border-border flex flex-col h-full transition-all duration-300 relative`}>
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-6 bg-card border border-border rounded-full p-1 text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors z-50 shadow-sm"
            >
                {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            {/* Logo aligned with Header - EXACT MATCH with Header.tsx */}
            <div className={`flex-shrink-0 bg-card p-4 flex items-center border-b border-border relative h-[61px] ${isCollapsed ? 'justify-center' : ''}`}>
                <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-60" />
                {isCollapsed ? (
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-foreground text-xs">IF</div>
                ) : (
                    <h1 className="text-xl font-bold text-foreground truncate">IF Builder</h1>
                )}
            </div>

            <nav className="flex flex-col gap-1 flex-1 px-3 py-4 overflow-y-auto overflow-x-hidden">
                <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
                <NavItem to="/community" icon={MessageSquare} label="Fórum" />
                <NavItem to="/community/authors" icon={Users} label="Autores" />
                <NavItem to="/community/favorites" icon={Star} label="Favoritos" />

                <NavItem to="/settings" icon={Settings} label="Configurações" />
            </nav>

            <div className="mt-auto p-4 border-t border-border">
                <Link
                    to="/editor"
                    className={`flex items-center gap-3 w-full bg-secondary hover:bg-white hover:text-zinc-900 text-secondary-foreground font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl text-base group border border-border ${isCollapsed ? 'justify-center px-0' : 'justify-center'}`}
                    title={isCollapsed ? "Abrir Editor" : undefined}
                >
                    <Gamepad2 size={20} className="group-hover:scale-110 transition-transform text-primary" />
                    {!isCollapsed && <span className="truncate">Abrir Editor</span>}
                </Link>
            </div>
        </aside>
    );
};

export default PlatformSidebar;
