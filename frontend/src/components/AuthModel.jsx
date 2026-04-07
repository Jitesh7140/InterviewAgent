import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { FaTimes } from 'react-icons/fa'; // Asegúrate de tener react-icons instalado
import Auth from '../pages/authPages/AuthPage.jsx'; // Asumiendo que tu componente de Login/Register se llama Auth

function AuthModel({ onClose }) {
  const { userData } = useSelector((state) => state.user);
  const modelRef = useRef(null);

  // Close when user is logged in
  useEffect(() => {
    if (userData) {
      onClose();
    }
  }, [userData, onClose]);

  // Close when clicking outside the white box
  const handleOutsideClick = (e) => {
    if (modelRef.current && !modelRef.current.contains(e.target)) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-999 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={handleOutsideClick}
    >
      <div 
        ref={modelRef}
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 animate-in fade-in zoom-in duration-200"
      >
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors p-2"
        >
          <FaTimes size={20} />
        </button>

        {/* Content */}
        <div className="mt-2">
          <Auth isModel={true} onClose={onClose} />
        </div>
      </div>
    </div>
  );
}

export default AuthModel;