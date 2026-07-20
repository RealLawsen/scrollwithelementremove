// ==UserScript==
// @name         Remove Google Redirects (iOS)
// @namespace    https://greasyfork.org/
// @version      1.0
// @description  Strips tracking redirects from Google search result links
// @match        *://www.google.*/search*
// @match        *://google.*/search*
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    const cleanLinks = () => {
        // Target all links on the Google search results page
        const links = document.querySelectorAll('a[href]');
        
        links.forEach(link => {
            // Remove Google's internal tracking attribute
            if (link.hasAttribute('ping')) {
                link.removeAttribute('ping');
            }

            // Remove Google's mousedown/touch redirect handlers
            link.removeAttribute('onmousedown');
            
            // Convert google.com/url?q=... redirect links into clean direct destination URLs
            const href = link.getAttribute('href');
            if (href && href.includes('/url?')) {
                try {
                    const urlParams = new URLSearchParams(href.substring(href.indexOf('?')));
                    const targetUrl = urlParams.get('q') || urlParams.get('url');
                    if (targetUrl && targetUrl.startsWith('http')) {
                        link.href = decodeURIComponent(targetUrl);
                    }
                } catch (e) {
                    // Skip malformed URLs
                }
            }
        });
    };

    // Run when the page loads
    cleanLinks();

    // Re-run whenever Google dynamically loads new search results (like infinite scroll)
    const observer = new MutationObserver(cleanLinks);
    observer.observe(document.body, { childList: true, subtree: true });
})();
