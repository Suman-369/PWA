import React, { useEffect, useState, useCallback } from "react";

const isMobile = () =>
  /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
    navigator.userAgent
  );

const App = () => {
  const [showInstall, setShowInstall] = useState(false);
  const [years, setYears] = useState("-");
  const [months, setMonths] = useState("-");
  const [days, setDays] = useState("-");
  const [totalDays, setTotalDays] = useState("-");

  useEffect(() => {
    if (isMobile()) {
      const handler = (e) => {
        e.preventDefault();
        window.deferredPrompt = e;
        setShowInstall(true);
      };
      window.addEventListener("beforeinstallprompt", handler);
      return () => window.removeEventListener("beforeinstallprompt", handler);
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

  const calculateAgeAndDaysAlive = useCallback((e) => {
    e.preventDefault();
    const dateInput = document.getElementById("date-input");
    let dob;

    if (isMobile()) {
      // For mobile, parse the text input
      const dateString = dateInput.value;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        alert("Please enter a valid date in YYYY-MM-DD format.");
        return;
      }
      dob = new Date(dateString);
    } else {
      // For desktop, use the date input
      dob = new Date(dateInput.value);
    }

    const today = new Date();

    if (isNaN(dob.getTime())) {
      alert("Please enter a valid date of birth.");
      return;
    }

    let years = today.getFullYear() - dob.getFullYear();
    let months = today.getMonth() - dob.getMonth();
    let days = today.getDate() - dob.getDate();

    if (months < 0 || (months === 0 && days < 0)) {
      years--;
      months += 12;
    }

    if (days < 0) {
      const previousMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += previousMonth.getDate();
      months--;
    }

    const timeDiff = today.getTime() - dob.getTime();
    const daysAlive = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    setYears(years);
    setMonths(months);
    setDays(days);
    setTotalDays(daysAlive);
  }, []);

  const handleRefresh = useCallback(() => {
    const dateInput = document.getElementById("date-input");
    dateInput.value = "";
    setYears("-");
    setMonths("-");
    setDays("-");
    setTotalDays("-");
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#7d56f3]">
      <div className="marquee-container">
        <div className="marquee-content">
          ENTER YOUR DATE OF BIRTH TO CALCULATE HOW MANY DAYS YOU ALIVE IN THIS
          EARTH
        </div>
      </div>
      <div className="container">
        <div className="input-wrapper">
          {isMobile() ? (
            <input type="text" id="date-input" placeholder="YYYY-MM-DD" />
          ) : (
            <input type="date" id="date-input" />
          )}
          <button id="calc-age-btn" onClick={calculateAgeAndDaysAlive}>
            Calculate
          </button>
        </div>
        <div className="output-wrapper">
          <div>
            <span id="years">{years}</span>
            <p>Years</p>
          </div>
          <div>
            <span id="months">{months}</span>
            <p>Months</p>
          </div>
          <div>
            <span id="days">{days}</span>
            <p>Days</p>
          </div>
          <div>
            <span id="result">{totalDays}</span>
            <p>Total days</p>
          </div>
        </div>
        <button id="refresh-btn" onClick={handleRefresh}>
          Refresh
        </button>
      </div>

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
