// src/main.jsx
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import Preloader from './components/PreLoader.jsx'; 
import './index.css';
import App from './App.jsx';


const Main = () => {
  // State untuk melacak apakah preloader masih aktif
  const [isLoading, setIsLoading] = useState(true);

  // Fungsi callback yang akan dipanggil oleh Preloader saat animasinya selesai
  const handlePreloaderFinished = () => {
    setIsLoading(false);
  };

  return (
    <>
      {/* Secara kondisional merender Preloader atau App berdasarkan state 'isLoading'. */}
      {isLoading ? (
        <Preloader onFinished={handlePreloaderFinished} />
      ) : (
        <App />
      )}
    </>
  );
};

// Render komponen Main ke dalam DOM
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>,
);