/**
 * TechNexus Chatbot Embed Widget
 * 
 * Add this script to any website to embed the TechNexus support chatbot.
 * 
 * Usage (iframe):
 *   <iframe 
 *     src="YOUR_DEPLOYED_URL" 
 *     style="position:fixed;bottom:0;right:0;width:420px;height:600px;border:none;z-index:9999;"
 *     allow="clipboard-write"
 *   ></iframe>
 * 
 * Usage (JS widget - add to your site):
 *   <script src="YOUR_DEPLOYED_URL/embed.js"></script>
 *   <script>
 *     TechNexusChat.init({ position: 'bottom-right' });
 *   </script>
 */

(function () {
  const CHAT_URL = document.currentScript?.getAttribute('data-url') || window.location.origin;

  window.TechNexusChat = {
    init: function (options = {}) {
      const position = options.position || 'bottom-right';
      const iframe = document.createElement('iframe');
      iframe.src = CHAT_URL;
      iframe.id = 'technexus-chat-widget';
      iframe.style.cssText = `
        position: fixed;
        border: none;
        width: 100%;
        height: 100%;
        max-width: 100vw;
        max-height: 100vh;
        bottom: 0;
        right: 0;
        z-index: 99999;
        background: transparent;
        pointer-events: auto;
      `;
      if (position === 'bottom-left') {
        iframe.style.right = 'auto';
        iframe.style.left = '0';
      }
      document.body.appendChild(iframe);
    },
    destroy: function () {
      const el = document.getElementById('technexus-chat-widget');
      if (el) el.remove();
    }
  };
})();
