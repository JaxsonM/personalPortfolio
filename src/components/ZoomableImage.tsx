import React, { useEffect, useState } from 'react';

// A write-up image that fits on screen and opens larger in a pop-up when clicked.
const ZoomableImage: React.FC<{ src?: string; alt?: string }> = ({ src, alt = '' }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    // Stop the page behind the pop-up from scrolling while it's open.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Enlarge image: ${alt}`}
        className="group block w-full my-8 cursor-zoom-in"
      >
        {/* On desktop, cap the height so the whole image fits on screen at once. */}
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="block mx-auto w-full h-auto md:w-auto md:max-h-[50px] bg-white border border-gray-200 rounded-xl group-hover:border-gray-300 transition-colors"
        />
        <span className="block mt-2 text-center text-sm text-gray-400 group-hover:text-gray-600">
          Click to enlarge
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-50 bg-gray-950/80 overflow-y-auto p-4 md:p-6 flex flex-col items-center"
        >
          <div className="w-full flex justify-end gap-4 mb-3 md:max-w-3xl">
            <a
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-sm text-white/80 hover:text-white underline underline-offset-4 self-center"
            >
              Open full size
            </a>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              autoFocus
              className="w-10 h-10 rounded-full bg-white/10 text-white text-2xl leading-none hover:bg-white/20"
            >
              ×
            </button>
          </div>
          {/* Phones: full width and scrollable. Desktop: as tall as the window allows. */}
          <img
            src={src}
            alt={alt}
            onClick={(e) => e.stopPropagation()}
            className="w-full h-auto md:w-auto md:max-h-[calc(100vh-6rem)] bg-white rounded-xl"
          />
        </div>
      )}
    </>
  );
};

export default ZoomableImage;
