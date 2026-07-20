// ==UserScript==
// @name         Dismiss Open In App Banners
// @match        *://*/*
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';
    const dismiss = () => {
        // Targets common iOS app banner classes and selectors
        const selectors = [
            'button[aria-label*="Close"]',
            '.XPromoPopup',
            'xpromo-app-selector',
            '.mweb-content-gate-container',
            'div[class*="AppPrompt"]',
            '.open-in-app-btn'
        ];

        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                if (el.tagName === 'BUTTON' || el.tagName === 'A') {
                    el.click();
                } else {
                    el.style.display = 'none';
                }
            });
        });
    };

    dismiss();
    const observer = new MutationObserver(dismiss);
    observer.observe(document.body, { childList: true, subtree: true });
})();
