// ==UserScript==
// @name         iOS Deep "Open in App" Nuker
// @namespace    https://greasyfork.org/
// @version      3.0
// @description  Traverses Shadow DOMs and iframes to remove stubborn "Open in App" banners.
// @match        *://*/*
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    function purgeBanners(root = document) {
        // 1. Remove standard DOM elements
        const selectors = [
            '#branch-banner-iframe',
            '[id*="branch-banner"]',
            '[class*="branch-banner"]',
            'xpromo-app-selector',
            'xpromo-bottom-sheet',
            '.XPromoPopup',
            'shreddit-async-loader[async-request*="xpromo"]',
            'smartbanner-wrapper',
            '.smartbanner',
            '#smartbanner'
        ];

        selectors.forEach(s => {
            root.querySelectorAll(s).forEach(el => el.remove());
        });

        // 2. Scan all floating elements for "Open" buttons
        const floaters = root.querySelectorAll('div, section, header, aside, button, a');
        floaters.forEach(el => {
            const text = (el.textContent || '').trim().toLowerCase();
            if (
                (text.includes('open in') || text.includes('use app') || text === 'open') &&
                (text.includes('app') || text.includes('open'))
            ) {
                const style = window.getComputedStyle(el);
                if (style.position === 'fixed' || style.position === 'sticky' || style.position === 'absolute') {
                    // Make sure we're deleting the wrapper banner, not just the text node
                    const container = el.closest('div, section, header, aside') || el;
                    container.remove();
                }
            }
        });

        // 3. Deep-scan Shadow DOMs (e.g. Reddit Shreddit components)
        root.querySelectorAll('*').forEach(el => {
            if (el.shadowRoot) {
                purgeBanners(el.shadowRoot);
            }
        });
    }

    // Run periodically to catch dynamic overlays
    setInterval(purgeBanners, 750);
})();
