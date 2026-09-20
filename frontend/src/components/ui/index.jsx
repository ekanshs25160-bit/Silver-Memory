import React from 'react';

export function Avatar({ src, alt, initials, size = 'md', extraClasses = '' }) {
  const sizeClasses = {
    sm: 'w-6 h-6 text-[10px]',
    md: 'w-8 h-8 text-xs',
    lg: 'w-10 h-10 text-sm'
  };
  
  if (src) {
    return (
      <img 
        src={src} 
        alt={alt} 
        className={`${sizeClasses[size]} rounded-full border border-surface-container-lowest object-cover ${extraClasses}`} 
      />
    );
  }
  
  return (
    <div className={`${sizeClasses[size]} rounded-full border border-surface-container-lowest bg-surface-container-high text-on-surface font-semibold flex items-center justify-center ${extraClasses}`}>
      {initials}
    </div>
  );
}

export function Badge({ children, variant = 'primary', extraClasses = '' }) {
  const variants = {
    primary: 'bg-primary-fixed text-on-primary-fixed',
    secondary: 'bg-sky-50 border border-sky-200 text-secondary',
    admin: 'bg-indigo-50 border border-indigo-200 text-primary',
    success: 'bg-emerald-50 border border-emerald-200 text-emerald-700',
    warning: 'bg-amber-50 border border-amber-200 text-amber-700'
  };
  
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full font-label-sm text-label-sm font-medium ${variants[variant]} ${extraClasses}`}>
      {children}
    </span>
  );
}

export function Button({ children, variant = 'primary', icon, onClick, className = '', type = 'button' }) {
  const baseClasses = "inline-flex items-center justify-center space-x-1.5 font-label-md text-label-md h-8 px-3 rounded-lg transition-all duration-150 active:scale-[0.99]";
  const variants = {
    primary: "bg-primary-container hover:bg-surface-tint text-on-primary shadow-sm",
    secondary: "bg-surface-container-low hover:bg-surface-container-high border border-surface-variant text-on-surface",
    ghost: "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
  };
  
  return (
    <button type={type} onClick={onClick} className={`${baseClasses} ${variants[variant]} ${className}`}>
      {icon && <span className="material-symbols-outlined text-[16px]">{icon}</span>}
      {children && <span>{children}</span>}
    </button>
  );
}

export function Input({ label, type = 'text', placeholder, value, onChange, className = '', icon }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="font-label-md text-label-md text-on-surface font-medium">{label}</label>}
      <div className="relative">
        {icon && <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">{icon}</span>}
        <input 
          type={type} 
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full h-8 ${icon ? 'pl-8' : 'px-3'} pr-3 bg-surface-container-lowest border border-surface-variant rounded-lg font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none`}
        />
      </div>
    </div>
  );
}

export function Modal({ isOpen, onClose, title, children, actions }) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl border border-surface-variant shadow-2xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-variant">
          <h2 className="font-headline-md text-headline-md font-semibold text-on-surface">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
        <div className="p-5 flex-1 overflow-y-auto">
          {children}
        </div>
        {actions && (
          <div className="px-5 py-4 border-t border-surface-variant bg-surface-container-low flex justify-end space-x-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
