// This optional code registers a service worker.
// It lets your app load faster on subsequent visits and gives offline support.

export function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then(registration => {
          console.log('ServiceWorker registered:', registration);
        })
        .catch(error => {
          console.error('ServiceWorker registration failed:', error);
        });
    });
  }
}
