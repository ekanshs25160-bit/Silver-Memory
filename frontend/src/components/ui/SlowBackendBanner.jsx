import React, { useState, useEffect } from 'react';
import { subscribeSlowBackend } from '../../lib/apiClient';

export default function SlowBackendBanner() {
  const [isSlow, setIsSlow] = useState(false);

  useEffect(() => {
    return subscribeSlowBackend(setIsSlow);
  }, []);

  if (!isSlow) return null;

  return (
    <aside
      aria-label="Server status alert"
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none max-w-md w-[92%] sm:w-auto transition-all animate-bounce duration-1000"
    >
      <div className="flex items-center space-x-2.5 px-4 py-2.5 rounded-full bg-surface-container-lowest/95 border border-amber-500/50 text-on-surface shadow-xl backdrop-blur-md">
        <span className="material-symbols-outlined text-[18px] text-amber-500 animate-spin shrink-0">
          progress_activity
        </span>
        <span className="text-body-sm font-label-md font-medium text-on-surface">
          Backend is a bit slow, but dont worry it will work😉
        </span>
      </div>
    </aside>
  );
}
