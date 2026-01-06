
import React, { useState } from 'react';
import { LayoutDashboard, Users, User, Gamepad2, Settings, ChevronDown, ChevronRight, ChevronLeft, MessageSquare, FileText, Star } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const PlatformSidebar: React.FC = () => {
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;

    const [isCommunityOpen, setIsCommunityOpen] = useState(location.pathname.startsWith('/community'));
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Auto-open if navigating to sub-page
    React.useEffect(() => {
        if (location.pathname.startsWith('/community')) {
            setIsCommunityOpen(true);
        }
    }, [location.pathname]);

    // Auto-expand sidebar if opening community menu while collapsed
    const toggleCommunity = () => {
        if (isCollapsed) {
            setIsCollapsed(false);
            setIsCommunityOpen(true);
        } else {
            setIsCommunityOpen(!isCommunityOpen);
        }
    };

    const NavItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => (
        <Link
            to={to}
            className={`flex items-center gap-3 px-4 py-2 rounded-md transition-all text-sm group relative ${isActive(to)
                ? 'bg-muted text-foreground font-medium'
                : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                } ${isCollapsed ? 'justify-center px-2' : ''}`}
            title={isCollapsed ? label : undefined}
        >
            <Icon size={18} className="flex-shrink-0" />
            {!isCollapsed && <span className="truncate">{label}</span>}
        </Link>
    );

    return (
        <aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-card border-r border-border flex flex-col h-full transition-all duration-300 relative`}>
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-6 bg-card border border-border rounded-full p-1 text-muted-foreground hover:text-foreground hover:border-primary transition-colors z-50 shadow-sm"
            >
                {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            {/* Logo aligned with Header - EXACT MATCH with Header.tsx */}
            <div className={`flex-shrink-0 bg-card p-4 flex items-center border-b border-border relative h-[61px] ${isCollapsed ? 'justify-center' : ''}`}>
                <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-60" />
                {isCollapsed ? (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center font-bold text-white text-xs">IF</div>
                ) : (
                    <h1 className="text-xl font-bold text-foreground truncate">IF Builder</h1>
                )}
            </div>

            <nav className="flex flex-col gap-1 flex-1 px-3 py-4 overflow-y-auto overflow-x-hidden">
                <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />

                {/* Collapsible Community Section */}
                <div className="space-y-1">
                    <button
                        onClick={toggleCommunity}
                        className={`flex items-center w-full px-4 py-2 rounded-md transition-all text-sm relative ${location.pathname.startsWith('/community')
                            ? 'text-foreground font-medium'
                            : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                            } ${isCollapsed ? 'justify-center px-2' : 'justify-between'}`}
                        title={isCollapsed ? "Comunidade" : undefined}
                    >
                        <div className="flex items-center gap-3">
                            <Users size={18} className="flex-shrink-0" />
                            {!isCollapsed && <span>Comunidade</span>}
                        </div>
                        {!isCollapsed && (isCommunityOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />)}
                    </button>

                    {isCommunityOpen && (
                        <div className={`${isCollapsed ? 'ml-0 flex flex-col items-center gap-1 pt-1 bg-muted/20 rounded-lg pb-1' : 'ml-7 flex flex-col gap-1 border-l border-border pl-2'}`}>
                            <NavItem to="/community" icon={MessageSquare} label="Fórum" />
                            <NavItem to="/community/authors" icon={User} label="Autores" />
                            <NavItem to="/community/my-posts" icon={FileText} label="Minhas Postagens" />
                            <NavItem to="/community/favorites" icon={Star} label="Favoritos" />
                        </div>
                    )}
                </div>

                <NavItem to="/settings" icon={Settings} label="Configurações" />
            </nav>

            <div className="mt-auto p-4 border-t border-border">
                <Link
                    to="/editor"
                    className={`flex items-center gap-3 w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl text-base group border border-border ${isCollapsed ? 'justify-center px-0' : 'justify-center'}`}
                    title={isCollapsed ? "Abrir Editor" : undefined}
                >
                    <Gamepad2 size={20} className="group-hover:scale-110 transition-transform text-purple-500" />
                    {!isCollapsed && <span className="truncate">Abrir Editor</span>}
                </Link>
            </div>
        </aside>
    );
};

export default PlatformSidebar;
