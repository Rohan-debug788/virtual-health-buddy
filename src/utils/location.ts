import { Clinic } from '../types';

// Function to calculate distance between two coordinates using Haversine formula
export function calculateDistance(
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c; // Distance in km
  return distance;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI/180);
}

// Function to format distance
export function formatDistance(distance: number): string {
  if (distance < 1) {
    return `${Math.round(distance * 1000)} meters`;
  }
  return `${distance.toFixed(1)} km`;
}

// Function to get nearby clinics based on user location
export async function getNearbyMedicalFacilities(
  userLat: number, 
  userLng: number
): Promise<Clinic[]> {
  // In a real app, this would call a Maps API
  // For this MVP, we'll return mock data based on the user's location
  
  // Sample medical facilities with coordinates
  const facilities = [
    {
      id: '1',
      name: 'City General Hospital',
      address: '123 Main St',
      phone: '(555) 123-4567',
      lat: userLat + 0.01,
      lng: userLng - 0.01
    },
    {
      id: '2',
      name: 'Westside Urgent Care',
      address: '456 Oak Ave',
      phone: '(555) 987-6543',
      lat: userLat - 0.008,
      lng: userLng + 0.015
    },
    {
      id: '3',
      name: 'Community Health Center',
      address: '789 Pine Blvd',
      phone: '(555) 456-7890',
      lat: userLat + 0.02,
      lng: userLng + 0.02
    },
    {
      id: '4',
      name: 'Downtown Medical Plaza',
      address: '101 Center St',
      phone: '(555) 222-3333',
      lat: userLat - 0.015,
      lng: userLng - 0.018
    },
    {
      id: '5',
      name: 'Riverside Clinic',
      address: '222 River Rd',
      phone: '(555) 777-8888',
      lat: userLat + 0.025,
      lng: userLng - 0.005
    }
  ];
  
  // Calculate distance for each facility and sort by proximity
  const facilitiesWithDistance = facilities.map(facility => {
    const distance = calculateDistance(
      userLat, 
      userLng, 
      facility.lat, 
      facility.lng
    );
    
    return {
      ...facility,
      distance: formatDistance(distance)
    };
  });
  
  // Sort by distance (closest first)
  return facilitiesWithDistance.sort((a, b) => {
    const distA = parseFloat(a.distance);
    const distB = parseFloat(b.distance);
    return distA - distB;
  });
}