export interface SymptomHistory {
    id: string;
    date: string;
    symptoms: string;
    tips: string[];
  }
  
  export interface HealthMetric {
    id: string;
    date: string;
    type: 'water' | 'sleep' | 'medication' | 'exercise';
    value: number;
    notes?: string;
  }
  
  export interface Clinic {
    id: string;
    name: string;
    address: string;
    phone: string;
    distance: string;
    lat: number;
    lng: number;
  }