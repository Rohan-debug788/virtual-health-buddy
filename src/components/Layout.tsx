import React, { ReactNode, useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [showEmergencyBanner, setShowEmergencyBanner] = useState(false);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);

  useEffect(() => {
    // Check if location permission has been granted
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then(result => {
        if (result.state === 'prompt') {
          setShowLocationPrompt(true);
        }
      });
    }
  }, []);

  const handleRequestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setShowLocationPrompt(false);
          // Reload the page to use the location
          window.location.reload();
        },
        (error) => {
          console.error('Error getting location:', error);
          setShowLocationPrompt(false);
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {showEmergencyBanner && (
        <div className="bg-red-600 text-white p-3 flex items-center justify-between">
          <div className="flex items-center">
            <AlertTriangle size={20} className="mr-2" />
            <span className="font-medium">Emergency Mode Active</span>
          </div>
          <button 
            onClick={() => setShowEmergencyBanner(false)}
            className="text-white bg-red-700 px-3 py-1 rounded-md text-sm"
          >
            Exit Emergency Mode
          </button>
        </div>
      )}
      
      {showLocationPrompt && (
        <div className="bg-yellow-50 border-b border-yellow-100 p-3 flex items-center justify-between">
          <p className="text-sm text-yellow-800">
            Enable location services for nearby medical facilities
          </p>
          <button 
            onClick={handleRequestLocation}
            className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
          >
            Enable Location
          </button>
        </div>
      )}
      
      {children}
      
      <footer className="py-6 px-4 text-center text-sm text-gray-500 mt-8">
        <div className="max-w-md mx-auto">
          <p className="mb-2">© 2025 Virtual Health Buddy. Not a substitute for professional medical advice.</p>
          <div className="flex justify-center space-x-4 mt-4">
            <button 
              onClick={() => setShowEmergencyBanner(true)}
              className="text-red-600 border border-red-200 px-3 py-1 rounded-md text-sm hover:bg-red-50"
            >
              Emergency Mode
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};