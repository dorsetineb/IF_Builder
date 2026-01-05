
import React, { useState } from 'react';
import { LayoutDashboard, Users, User, Gamepad2, Settings, ChevronDown, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const PlatformSidebar: React.FC = () => {
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;

    const NavItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => (
        <Link
            to={to}
            className={`flex items-center gap-3 px-4 py-2 rounded-md transition-all text-sm ${isActive(to)
                    ? 'bg-zinc-800 text-white font-medium'
                    : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
                }`}
        >
            <Icon size={18} />
            <span>{label}</span>
        </Link>
    );

    return (
        <aside className="w-64 bg-zinc-950 border-r border-zinc-900 flex flex-col h-full py-4 px-3">
            {/* Logo text only */}
            <div className="px-4 mb-8 mt-2">
                <h1 className="text-lg font-bold text-white tracking-tight">IF Builder</h1>
            </div>

            <nav className="flex flex-col gap-1 flex-1">
                <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
                <NavItem to="/community" icon={Users} label="Comunidade" />

                {/* Configurações with nested Perfil logic implied or linked */}
                <Link
                    to="/profile"
                    className={`flex items-center gap-3 px-4 py-2 rounded-md transition-all text-sm ${isActive('/profile') || isActive('/settings')
                            ? 'bg-zinc-800 text-white font-medium'
                            : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
                        }`}
                >
                    <Settings size={18} />
                    <span>Configurações</span>
                </Link>
                {/* Perfil logically inside configurations, but for now we link Configurações -> Profile page */}
            </nav>

            <div className="mt-auto pt-4 border-t border-zinc-900">
                <Link
                    to="/editor"
                    className="flex items-center justify-center gap-2 w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-4 rounded-lg transition-all shadow-lg hover:shadow-purple-900/20 text-sm group"
                >
                    <Gamepad2 size={20} className="group-hover:scale-110 transition-transform" />
                    Abrir Editor
                </Link>
            </div>
        </aside>
    );
};

export default PlatformSidebar;
