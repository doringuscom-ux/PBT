import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const GlobalRedirector = () => {
    const location = useLocation();
    const [redirects, setRedirects] = useState([]);
    
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        // Fetch active redirects on mount
        const fetchRedirects = async () => {
            try {
                const res = await axios.get(`${apiUrl}/redirects/active`);
                setRedirects(res.data);
            } catch (err) {
                console.error("Failed to load redirects", err);
            }
        };
        fetchRedirects();
    }, [apiUrl]);

    useEffect(() => {
        if (redirects.length === 0) return;

        const currentPath = location.pathname;
        const matchedRedirect = redirects.find(r => r.fromPath === currentPath || r.fromPath === currentPath + '/');

        if (matchedRedirect) {
            // Perform external or internal redirect
            window.location.replace(matchedRedirect.toUrl);
        }
    }, [location.pathname, redirects]);

    return null; // This is a utility component, no UI
};

export default GlobalRedirector;
