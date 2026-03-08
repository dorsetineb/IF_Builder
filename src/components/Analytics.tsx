import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Analytics = () => {
    const location = useLocation();

    useEffect(() => {
        if (typeof window.gtag === 'function') {
            window.gtag('config', 'G-NQX4WZH86S', {
                page_path: location.pathname + location.search,
            });
        }
    }, [location]);

    return null;
};

export default Analytics;
