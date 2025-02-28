import React, { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { PhoneCall, MapPin, X, Navigation, ExternalLink } from 'lucide-react';
import { getNearbyMedicalFacilities } from '../utils/location';
import { Clinic } from '../types';

interface EmergencyContactsProps {
  userLocation: { lat: number; lng: number } | null;
}

export const EmergencyContacts: React.FC<EmergencyContactsProps> = ({ userLocation }) => {
  const [showClinics, setShowClinics] = useState(false);
  const [nearbyClinics, setNearbyClinics] = useState<Clinic[]>([]);
  const [isLoadingClinics, setIsLoadingClinics] = useState(false);

  const emergencyContacts = [
    { name: 'Emergency Services', number: '911', description: 'For life-threatening emergencies' },
    { name: 'Poison Control', number: '1-800-222-1222', description: 'For poison emergencies' },
    { name: 'Suicide Prevention Lifeline', number: '988', description: '24/7 crisis support' },
    { name: 'Non-Emergency Medical Advice', number: '111', description: 'For non-urgent medical concerns' },
  ];

  useEffect(() => {
    if (showClinics && userLocation) {
      fetchNearbyClinics();
    }
  }, [showClinics, userLocation]);

  const fetchNearbyClinics = async () => {
    if (!userLocation) return;
    
    setIsLoadingClinics(true);
    try {
      const clinics = await getNearbyMedicalFacilities(userLocation.lat, userLocation.lng);
      setNearbyClinics(clinics);
    } catch (error) {
      console.error('Error fetching nearby clinics:', error);
    } finally {
      setIsLoadingClinics(false);
    }
  };

  const getDirectionsUrl = (clinic: Clinic) => {
    if (!userLocation) return '';
    
    return `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${clinic.lat},${clinic.lng}&travelmode=driving`;
  };

  return (
    <div className="space-y-6">
      <Card className="border-l-4 border-l-red-500">
        <div className="flex items-center mb-4">
          <div className="bg-red-100 p-2 rounded-full mr-3">
            <PhoneCall size={24} className="text-red-500" />
          </div>
          <h2 className="text-xl font-semibold">Emergency Contacts</h2>
        </div>
        
        <ul className="space-y-4">
          {emergencyContacts.map((contact, index) => (
            <li key={index} className="flex items-start p-3 bg-red-50 rounded-md">
              <PhoneCall size={20} className="text-red-500 mr-3 mt-1 flex-shrink-0" />
              <div>
                <div className="flex items-center">
                  <h3 className="font-medium">{contact.name}:</h3>
                  <a 
                    href={`tel:${contact.number.replace(/\D/g, '')}`} 
                    className="ml-2 text-blue-600 font-bold"
                  >
                    {contact.number}
                  </a>
                </div>
                <p className="text-sm text-gray-600">{contact.description}</p>
              </div>
            </li>
          ))}
        </ul>
        
        <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-md">
          <p className="text-sm text-red-800 font-medium">
            In case of a medical emergency, call 911 immediately or go to your nearest emergency room.
          </p>
        </div>
      </Card>

      <div className="text-center">
        <Button 
          onClick={() => setShowClinics(!showClinics)}
          variant={showClinics ? "outline" : "default"}
          className="flex items-center mx-auto"
          disabled={!userLocation && !showClinics}
        >
          {showClinics ? (
            <>
              <X size={16} className="mr-2" />
              Hide Nearby Clinics
            </>
          ) : (
            <>
              <MapPin size={16} className="mr-2" />
              Show Nearby Clinics
            </>
          )}
        </Button>
        
        {!userLocation && !showClinics && (
          <p className="text-sm text-gray-500 mt-2">
            Location access is required to show nearby clinics
          </p>
        )}
      </div>

      {showClinics && (
        <Card className="border-l-4 border-l-blue-500">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <MapPin size={24} className="text-blue-500" />
            </div>
            <h2 className="text-xl font-semibold">Nearby Medical Facilities</h2>
          </div>
          
          {isLoadingClinics ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : nearbyClinics.length > 0 ? (
            <ul className="space-y-3">
              {nearbyClinics.map((clinic) => (
                <li key={clinic.id} className="p-3 bg-blue-50 rounded-md">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">{clinic.name}</h3>
                      <p className="text-sm text-gray-600">{clinic.address}</p>
                      <div className="flex items-center mt-1">
                        <p className="text-xs text-gray-500 mr-3">{clinic.distance} away</p>
                        <a href={`tel:${clinic.phone.replace(/\D/g, '')}`} className="text-xs text-blue-600">
                          {clinic.phone}
                        </a>
                      </div>
                    </div>
                    <a 
                      href={getDirectionsUrl(clinic)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 bg-blue-100 p-2 rounded-full text-blue-600 hover:bg-blue-200"
                      title="Get directions"
                    >
                      <Navigation size={18} />
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center py-4 text-gray-500">
              Unable to find nearby clinics. Please check your location settings.
            </p>
          )}
          
          {userLocation && (
            <div className="mt-4">
              <a 
                href={`https://www.google.com/maps/search/hospital/@${userLocation.lat},${userLocation.lng},14z`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 flex items-center justify-center"
              >
                View more medical facilities on Google Maps
                <ExternalLink size={14} className="ml-1" />
              </a>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};