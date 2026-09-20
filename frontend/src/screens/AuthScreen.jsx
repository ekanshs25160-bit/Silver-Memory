import React, { useState } from 'react';
import { Button, Input } from '../components/ui';

export default function AuthScreen({ onSubmit, isLoading }) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: ''
  });

  const handleChange = (e, field) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, mode: activeTab });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Brand Header */}
      <div className="flex items-center space-x-2.5 mb-8">
        <div className="w-8 h-8 rounded bg-primary-container flex items-center justify-center text-on-primary font-headline-sm shadow-sm">
          <span className="material-symbols-outlined text-[18px]">grid_view</span>
        </div>
        <span className="text-headline-lg font-headline-lg font-semibold tracking-tight text-on-surface">Silver Memory</span>
      </div>

      <div className="w-full max-w-md bg-surface-container-lowest border border-surface-variant rounded-2xl shadow-lg overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-surface-variant">
          <button 
            className={`flex-1 py-3 text-center font-label-md text-label-md font-medium transition-colors ${activeTab === 'login' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
            onClick={() => setActiveTab('login')}
          >
            Log In
          </button>
          <button 
            className={`flex-1 py-3 text-center font-label-md text-label-md font-medium transition-colors ${activeTab === 'signup' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
            onClick={() => setActiveTab('signup')}
          >
            Create Account
          </button>
        </div>

        <div className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === 'signup' && (
              <Input 
                label="Full Name" 
                placeholder="Alex Rivera" 
                value={formData.fullName}
                onChange={e => handleChange(e, 'fullName')}
              />
            )}
            
            <Input 
              label="Email Address" 
              type="email"
              placeholder="alex@acme.dev" 
              value={formData.email}
              onChange={e => handleChange(e, 'email')}
            />

            {activeTab === 'signup' && (
              <Input 
                label="Username" 
                placeholder="arivera" 
                value={formData.username}
                onChange={e => handleChange(e, 'username')}
              />
            )}
            
            <div className="relative">
              <Input 
                label="Password" 
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••" 
                value={formData.password}
                onChange={e => handleChange(e, 'password')}
              />
              <button 
                type="button"
                className="absolute right-3 top-8 text-on-surface-variant hover:text-on-surface"
                onClick={() => setShowPassword(!showPassword)}
              >
                <span className="material-symbols-outlined text-[16px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>

            <Button type="submit" variant="primary" className="w-full mt-4 h-10 text-body-md" disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Continue to Workspace'}
            </Button>
          </form>

          <div className="mt-6 flex items-center">
            <div className="flex-1 border-t border-surface-variant"></div>
            <span className="px-3 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Or continue with</span>
            <div className="flex-1 border-t border-surface-variant"></div>
          </div>

          <div className="mt-6 space-y-3">
            <button className="w-full flex items-center justify-center space-x-2 bg-surface-container-lowest border border-surface-variant hover:bg-surface-container-low text-on-surface font-label-md text-label-md h-10 rounded-lg transition-colors active:scale-[0.99]">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
              <span>Google</span>
            </button>
            <button className="w-full flex items-center justify-center space-x-2 bg-surface-container-lowest border border-surface-variant hover:bg-surface-container-low text-on-surface font-label-md text-label-md h-10 rounded-lg transition-colors active:scale-[0.99]">
              <img src="https://www.svgrepo.com/show/512317/github-142.svg" alt="GitHub" className="w-4 h-4" />
              <span>GitHub</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
