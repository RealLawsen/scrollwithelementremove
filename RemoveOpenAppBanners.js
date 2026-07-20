// ==UserScript==
// @name         Universal iOS "Open in App" Nuke
// @namespace    https://greasyfork.org/
// @version      4.0
// @description  Globally targets and removes floating "Open in App" banners, bottom sheets, and native app nags on mobile Safari.
// @match        *://*/*
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // 1. Inject CSS for known app-nag structures across major platforms
    const style = document.createElement('style');
    style.innerHTML = `
        /* Native iOS & Ad/Tracking Frame Banners */
        meta[name="apple-itunes-app"],
        meta[name="google-play-app"],
        #branch-banner-iframe,
        [id*="branch-banner"],
        [class*="branch-banner"],
        .branch-journeys-top,
        
        /* Reddit, Quora, X/Twitter, Medium Specifics */
        xpromo-app-selector,
        xpromo-bottom-sheet,
        .XPromoPopup,
        shreddit-async-loader[async-request*="xpromo"],
        .mweb-content-gate-container,
        div[data-testid="bottomSheet"],
        div[data-testid="sheetDialog"],
        
        /* Generic Floating Banners */
        [class*="smartbanner"],
        #smartbanner,
        [class*="OpenInApp"],
        [class*="AppPrompt"],
        .open-in-app-btn {
            display: none !important;
            visibility: hidden !important;
            height: 0 !important;
            pointer-events: none !important;
        }

        /* Ensure page stays scrollable if an overlay locks overflow */
        html, body {
            overflow: auto !important;
        }
    `;
    (document.head || document.documentElement).appendChild(style);

    // 2. Universal JS Sweep to hunt down un-classed "Open in the ___ App" banners
    const nukeUniversalBanners = () => {
        // Find elements positioned at the top or bottom of screen
        const candidates = document.querySelectorAll('div, section, header, aside, [role="banner"], [role="region"]');

        candidates.forEach(el => {
            // Avoid deep recursive scanning on large wrapper containers
            if (el.children.length > 15) return;

            const text = (el.innerText || el.textContent || '').trim();
            
            // Regex matching "open in the [App Name] app", "get the app", "use app", etc.
            const isAppNag = /open in (the )?.* app/i.test(text) || 
                             /use (the )?.* app/i.test(text) || 
                             /get (the )?.* app/i.test(text) || 
                             /switch to (the )?.* app/i.test(text);

            if (isAppNag) {
                const style = window.getComputedStyle(el);
                const isFloating = style.position === 'fixed' || style.position === 'sticky' || style.position === 'absolute';

                if (isFloating) {
                    // Target the top-most floating wrapper to delete the entire bar
                    const targetContainer = el.closest('div[style*="position"], div[style*="bottom"], div[style*="top"]') || el;
                    targetContainer.remove();
                }
            }
        });
    };

    // Run when DOM loads and continuously observe for dynamic bottom sheets
    document.addEventListener('DOMContentLoaded', () => {
        nukeUniversalBanners();
        
        let timer = null;
        const observer = new MutationObserver(() => {
            if (timer) return;
            timer = setTimeout(() => {
                nukeUniversalBanners();
                timer = null;
            }, 300); // Throttled to keep battery consumption low
        });

        observer.observe(document.body, { childList: true, subtree: true });
    });
})();
