// ==UserScript==
// @name         Dismiss Open In App Banners (Improved)
// @match        *://*/*
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // 1. Instantly nuke native iOS Smart App Banners before they render
    const removeMetaBanners = () => {
        const metaBanners = document.querySelectorAll('meta[name="apple-itunes-app"], meta[name="google-play-app"]');
        metaBanners.forEach(meta => meta.remove());
    };

    // Run as early as possible
    removeMetaBanners();

    // 2. Main cleanup function for DOM banners and popups
    const dismiss = () => {
        removeMetaBanners();

        // Common button/container selectors for web app prompts
        const selectors = [
            // Reddit
            'xpromo-app-selector',
            'xpromo-bottom-sheet',
            '.XPromoPopup',
            'shreddit-async-loader[async-request*="xpromo"]',
            // Quora, Medium, LinkedIn, Generic
            '.mweb-content-gate-container',
            'div[class*="AppPrompt"]',
            '.open-in-app-btn',
            'div[class*="OpenInApp"]',
            'div[class*="smartbanner"]',
            '.smartbanner',
            '#smartbanner',
            'button[aria-label*="Open in app"i]',
            'button[aria-label*="Use app"i]'
        ];

        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.remove(); // Completely delete from DOM instead of just hiding
            });
        });

        // Restore page scrolling if an overlay locked it
        if (document.body) {
            const bodyStyle = window.getComputedStyle(document.body);
            if (bodyStyle.overflow === 'hidden') {
                document.body.style.setProperty('overflow', 'auto', 'important');
            }
        }
        if (document.documentElement) {
            const htmlStyle = window.getComputedStyle(document.documentElement);
            if (htmlStyle.overflow === 'hidden') {
                document.documentElement.style.setProperty('overflow', 'auto', 'important');
            }
        }
    };

    // Run when DOM is ready and observe for dynamic popups
    document.addEventListener('DOMContentLoaded', () => {
        dismiss();
        const observer = new MutationObserver(dismiss);
        observer.observe(document.body, { childList: true, subtree: true });
    });
})();
