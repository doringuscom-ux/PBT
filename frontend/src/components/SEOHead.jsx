import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const SEOHead = () => {
    const location = useLocation();
    const [metadata, setMetadata] = useState(null);
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const res = await axios.get(`${apiUrl}/seo/metadata`, {
                    params: { url: location.pathname }
                });
                setMetadata(res.data);
            } catch (err) {
                // Fallback or clear metadata if not found
                setMetadata(null);
            }
        };

        fetchMetadata();
    }, [location.pathname, apiUrl]);

    if (!metadata) {
        return (
            <Helmet>
                <title>Pbtadka | Punjabi Film News & Updates</title>
                <meta name="description" content="Latest Punjabi film news, movie reviews, celebrity updates, and more at Pbtadka." />
            </Helmet>
        );
    }

    return (
        <Helmet>
            <title>{metadata.title || 'Pbtadka'}</title>
            <meta name="description" content={metadata.description || ''} />
            <meta name="keywords" content={metadata.keywords || ''} />
            {metadata.canonical && <link rel="canonical" href={metadata.canonical} />}
            <meta name="robots" content={metadata.robots || 'index, follow'} />
            
            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={window.location.href} />
            <meta property="og:title" content={metadata.title || 'Pbtadka'} />
            <meta property="og:description" content={metadata.description || ''} />
            
            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={window.location.href} />
            <meta property="twitter:title" content={metadata.title || 'Pbtadka'} />
            <meta property="twitter:description" content={metadata.description || ''} />
        </Helmet>
    );
};

export default SEOHead;
