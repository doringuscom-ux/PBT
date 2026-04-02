<?php
/**
 * PHP Proxy for Dynamic Sitemap
 * This script fetches the sitemap from the backend and serves it from the frontend domain.
 * This is used to bypass [P] (Proxy) flag restrictions on shared hosts like Hostinger.
 */

// Set header to XML
header('Content-Type: application/xml; charset=utf-8');

// The live backend sitemap URL
$backendSitemapUrl = 'https://backend-mcbv.onrender.com/sitemap.xml';

// Fetch the sitemap content
$options = array(
    'http' => array(
        'method' => "GET",
        'header' => "Accept-language: en\r\n" .
                  "User-Agent: Mozilla/5.0 (Sitemap Proxy)\r\n"
    )
);

$context = stream_context_create($options);
$sitemap = @file_get_contents($backendSitemapUrl, false, $context);

if ($sitemap === false) {
    // If fetch fails, return a minimal sitemap or error
    echo '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://pbtadka.com/</loc></url></urlset>';
} else {
    echo $sitemap;
}
?>
