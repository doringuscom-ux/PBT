import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const SEOHead = () => {
    const location = useLocation();
    const [metadata, setMetadata] = useState(null);
    const [h1Title, setH1Title] = useState('');
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        const fetchMetadata = async () => {
            setMetadata(null); // Reset metadata on each navigation
            setH1Title('');   // Reset H1 title to allow fresh scraping
            try {
                const res = await axios.get(`${apiUrl}/seo/metadata`, {
                    params: { url: location.pathname }
                });
                setMetadata(res.data);
            } catch (err) {
                // Fallback handled by h1Title logic below
            }
        };

        fetchMetadata();
    }, [location.pathname, apiUrl]);

    // MutationObserver to catch the <h1> from the page content automatically
    useEffect(() => {
        // If we have database metadata for title, we don't need to fallback
        if (metadata?.title) return;

        const findH1 = () => {
            // Find first H1 on the page
            const h1 = document.querySelector('h1');
            if (h1 && h1.innerText) {
                const text = h1.innerText.replace(/'/g, '').trim();
                // Avoid redundant state updates
                if (text && text !== h1Title) {
                    setH1Title(text);
                }
            }
        };

        // Initial check after render
        const timeoutId = setTimeout(findH1, 500);

        const observer = new MutationObserver(() => {
            findH1();
        });

        observer.observe(document.body, { childList: true, subtree: true });
        
        return () => {
            clearTimeout(timeoutId);
            observer.disconnect();
        };
    }, [location.pathname, metadata, h1Title]);

    const displayTitle = metadata?.title || (h1Title ? `${h1Title} | Pbtadka` : 'Pbtadka | Film News & Updates');
    const displayDescription = metadata?.description || 'Latest film news, movie reviews, celebrity updates, and more at Pbtadka.';

    return (
        <Helmet>
            <title>{displayTitle}</title>
            <meta name="description" content={displayDescription} />
            <meta name="keywords" content={metadata?.keywords || ''} />
            {metadata?.canonical && <link rel="canonical" href={metadata.canonical} />}
            <meta name="robots" content={metadata?.robots || 'index, follow'} />
            
            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={window.location.href} />
            <meta property="og:title" content={displayTitle} />
            <meta property="og:description" content={displayDescription} />
            
            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={window.location.href} />
            <meta property="twitter:title" content={displayTitle} />
            <meta property="twitter:description" content={displayDescription} />
        </Helmet>
    );
};

export default SEOHead;
