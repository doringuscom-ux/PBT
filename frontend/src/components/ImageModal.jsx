import React, { useEffect } from 'react';

const ImageModal = ({ isOpen, onClose, imageSrc, altText }) => {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md transition-all duration-300 animate-in fade-in"
      onClick={onClose}
    >
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 text-white bg-white/10 hover:bg-white/20 w-12 h-12 rounded-full flex items-center justify-center transition-all z-[10001] group"
      >
        <i className="fas fa-times text-xl group-hover:rotate-90 transition-transform"></i>
      </button>

      <div 
        className="relative max-w-[95vw] max-h-[90vh] flex items-center justify-center p-4 animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <img 
          src={imageSrc} 
          alt={altText || 'Full View'} 
          className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl ring-1 ring-white/10"
        />
        {altText && (
            <div className="absolute -bottom-10 left-0 right-0 text-center text-white/60 text-xs font-black uppercase tracking-widest italic truncate px-4">
                {altText}
            </div>
        )}
      </div>
    </div>
  );
};

export default ImageModal;
