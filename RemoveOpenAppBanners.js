// ==UserScript==
// @name         Block iOS "Open in App" Banners (Efficient)
// @namespace    https://greasyfork.org/
// @version      2.0
// @description  Lightweight & fast: instantly hides mobile app banners and restores scrolling.
// @match        *://*/*
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // 1. Inject instant CSS hiding rules (Zero CPU overhead)
    const style = document.createElement('style');
    style.innerHTML = `
        /* Native Meta & Branch.io Banners */
        meta[name="apple-itunes-app"],
        meta[name="google-play-app"],
        #branch-banner-iframe,
        [id*="branch-banner"],
        [class*="branch-banner"],
        .branch-journeys-top,
        
        /* Reddit & Common App Overlays */
        xpromo-app-selector,
        xpromo-bottom-sheet,
        .XPromoPopup,
        shreddit-async-loader[async-request*="xpromo"],
        .mweb-content-gate-container,
        [class*="AppPrompt"],
        .open-in-app-btn,
        [class*="OpenInApp"],
        [class*="smartbanner"],
        #smartbanner,
        
        /* Common Floating "Open in App" Bars */
        [class*="app-banner"],
        [class*="open-app"],
        [id*="app-banner"] {
            display: none !important;
            visibility: hidden !important;
            height: 0 !important;
            pointer-events: none !important;
        }

        /* Force scrollability if overlays locked it */
        html, body {
            overflow: auto !important;
        }
    `;
    (document.head || document.documentElement).appendChild(style);

    // 2. Fast removal of native meta tags from DOM
    const removeMeta = () => {
        document.querySelectorAll('meta[name="apple-itunes-app"], meta[name="google-play-app"]').forEach(el => el.remove());
    };
    removeMeta();

    // 3. Debounced observer to delete hidden nodes completely without lagging the browser
    let timeout = null;
    const observer = new MutationObserver(() => {
        if (timeout) return;
        timeout = setTimeout(() => {
            removeMeta();
            timeout = null;
        }, 300);
    });

    document.addEventListener('DOMContentLoaded', () => {
        observer.observe(document.body, { childList: true, subtree: true });
    });
})();
