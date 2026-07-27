// ==UserScript==
// @name         Remove 'Open in App' Banners
// @namespace    https://greasyfork.org/
// @version      1.0
// @description  Removes mobile app promotional banners and smart app banners from websites
// @match        *://*/*
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // 1. Strip iOS system-level Smart App Banners (<meta name="apple-itunes-app">)
    function removeMetaBanners() {
        document.querySelectorAll('meta[name="apple-itunes-app"]').forEach(meta => meta.remove());
    }

    // 2. Hide web-based app prompt overlays via CSS
    const css = `
        /* Generic "Open in App" containers & floating banners */
        [class*="app-banner"],
        [class*="AppBanner"],
        [class*="smartbanner"],
        [class*="open-in-app"],
        [class*="openInApp"],
        [id*="app-banner"],
        [id*="smartbanner"],
        div[aria-label*="Open in app"],
        /* Common Reddit, Quora, and Medium app prompts */
        shreddit-app-banner,
        .branch-journeys-top,
        #branch-banner-iframe {
            display: none !important;
        }

        /* Restore body scrolling if a site locks it behind a banner */
        body {
            position: static !important;
            overflow: auto !important;
        }
    `;

    // Inject styles as early as possible
    const style = document.createElement('style');
    style.textContent = css;
    (document.head || document.documentElement).appendChild(style);

    // Clean up meta tags on load and dynamically added banners
    removeMetaBanners();
    const observer = new MutationObserver(() => {
        removeMetaBanners();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
})();
