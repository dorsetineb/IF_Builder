
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
        <aside className="w-64 bg-zinc-950 border-r border-zinc-900 flex flex-col h-full">
            {/* Logo aligned with Header */}
            <div className="p-4 flex items-center border-b border-zinc-800 h-[73px]">
                <h1 className="text-xl font-bold text-white">IF Builder</h1>
            </div>

            <nav className="flex flex-col gap-1 flex-1 px-3 py-4">
                <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
                <NavItem to="/community" icon={Users} label="Comunidade" />

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
            </nav>

            <div className="mt-auto p-4 border-t border-zinc-900">
                <Link
                    to="/editor"
                    className="flex items-center justify-center gap-3 w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-6 rounded-xl transition-all shadow-lg hover:shadow-xl text-lg group border border-zinc-700"
                >
                    <Gamepad2 size={24} className="group-hover:scale-110 transition-transform text-purple-400" />
                    Abrir Editor
                </Link>
            </div>
        </aside>
    );
};

export default PlatformSidebar;
