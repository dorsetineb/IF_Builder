
import React from 'react';
import PlatformSidebar from '../PlatformSidebar';
import { Outlet } from 'react-router-dom';

const PlatformLayout: React.FC = () => {
    return (
        <div className="flex h-screen bg-background text-foreground font-sans">
            <PlatformSidebar />
            <main className="flex-1 overflow-y-auto bg-background/50">
                <Outlet />
            </main>
        </div>
    );
};

export default PlatformLayout;
