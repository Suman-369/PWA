import React, { useEffect, useState } from "react";

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

  const handleInstallClick = async () => {
    if (window.deferredPrompt) {
      window.deferredPrompt.prompt();
      const { outcome } = await window.deferredPrompt.userChoice;
      window.deferredPrompt = null;
      setShowInstall(false);
    }
  };

  return (
    <div className="text-6xl font-bold flex justify-center items-center h-screen bg-gray-400 text-black relative">
      Welcome To APP
      {showInstall && (
        <div
          style={{
            position: "absolute",
            top: 20,
            left: 0,
            right: 0,
            margin: "auto",
            maxWidth: 320,
            zIndex: 1000,
          }}
          className="bg-white text-black p-4 rounded shadow-lg flex flex-col items-center"
        >
          <div className="mb-2 text-lg font-semibold">Install this app?</div>
          <button
            onClick={handleInstallClick}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Install
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
