// ==UserScript==
// @name         Unlock Page Scroll
// @match        *://*/*
// @run-at       document-end
// ==/UserScript==

(function() {
    const unlock = () => {
        document.documentElement.style.setProperty('overflow', 'auto', 'important');
        document.body.style.setProperty('overflow', 'auto', 'important');
        document.body.style.setProperty('position', 'static', 'important');
    };
    unlock();
    window.addEventListener('scroll', unlock, { once: true });
})();
