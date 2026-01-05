
import React from 'react';
import PlatformSidebar from '../PlatformSidebar';
import { Outlet } from 'react-router-dom';

const PlatformLayout: React.FC = () => {
    return (
        <div className="flex h-screen bg-zinc-950 text-zinc-100 font-sans">
            <PlatformSidebar />
            <main className="flex-1 overflow-y-auto bg-black">
                <Outlet />
            </main>
        </div>
    );
};

export default PlatformLayout;
