import React, { useEffect, useState, useCallback } from "react";

const isMobile = () =>
  /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
    navigator.userAgent
  );

const App = () => {
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    if (isMobile()) {
      const handler = () => setShowInstall(true);
      window.addEventListener("pwa-install-available", handler);
      // If event already fired before mount
      if (window.deferredPrompt) setShowInstall(true);
      return () => window.removeEventListener("pwa-install-available", handler);
    }
  }, []);

  const handleInstallClick = useCallback(async () => {
    if (window.deferredPrompt) {
      window.deferredPrompt.prompt();
      const { outcome } = await window.deferredPrompt.userChoice;
      window.deferredPrompt = null;
      setShowInstall(false);
    }
  }, []);

  const handleCloseClick = useCallback(() => {
    setShowInstall(false);
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white relative p-4">
      <h1 className="text-6xl font-extrabold mb-8 drop-shadow-lg">Welcome To APP</h1>
      <p className="text-2xl font-bold">Add Soon items to enhance your experience !!</p>
      {showInstall && (
        <div
          className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-white text-black p-6 rounded-lg shadow-2xl flex flex-col items-center animate-fadeIn z-50 max-w-xs w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="install-dialog-title"
        >
          <div className="mb-4 text-xl font-semibold" id="install-dialog-title">
            Install this app?
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleInstallClick}
              className="bg-blue-600 hover:bg-blue-700 transition-colors text-white px-5 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Install
            </button>
            <button
              onClick={handleCloseClick}
              className="bg-gray-300 hover:bg-gray-400 transition-colors text-black px-5 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
