import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { SymptomLogger } from './components/SymptomLogger';
import { HealthTips } from './components/HealthTips';
import { EmergencyContacts } from './components/EmergencyContacts';
import  HealthTracker  from './components/HealthTracker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/Tabs';
import { AlertCircle, Activity, PhoneCall, LineChart } from 'lucide-react';
import { SymptomHistory } from './types.ts';
import { getLocalStorage, setLocalStorage } from './utils/storage';

function App() {
  const [healthTips, setHealthTips] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [symptomHistory, setSymptomHistory] = useState<SymptomHistory[]>(() => {
    return getLocalStorage('symptomHistory', []);
  });

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  useEffect(() => {
    // Save symptom history to localStorage whenever it changes
    setLocalStorage('symptomHistory', symptomHistory);
  }, [symptomHistory]);

  const handleGetHealthTips = async (symptoms: string) => {
    setIsLoading(true);
    try {
      const tips = await getHealthTips(symptoms);
      setHealthTips(tips);
      
      // Add to symptom history
      const newEntry: SymptomHistory = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        symptoms,
        tips
      };
      
      setSymptomHistory(prev => [newEntry, ...prev]);
    } catch (error) {
      console.error('Error getting health tips:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">Virtual Health Buddy</h1>
          <p className="text-gray-600">Your personal health assistant</p>
        </header>

        <Tabs defaultValue="symptoms" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="symptoms" className="flex items-center gap-2">
              <Activity size={16} />
              <span className="hidden sm:inline">Symptoms</span>
            </TabsTrigger>
            <TabsTrigger value="tips" className="flex items-center gap-2">
              <AlertCircle size={16} />
              <span className="hidden sm:inline">Tips</span>
            </TabsTrigger>
            <TabsTrigger value="tracker" className="flex items-center gap-2">
              <LineChart size={16} />
              <span className="hidden sm:inline">Tracker</span>
            </TabsTrigger>
            <TabsTrigger value="emergency" className="flex items-center gap-2">
              <PhoneCall size={16} />
              <span className="hidden sm:inline">Emergency</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="symptoms">
            <SymptomLogger 
              onSubmit={handleGetHealthTips} 
              isLoading={isLoading} 
              symptomHistory={symptomHistory}
            />
          </TabsContent>
          
          <TabsContent value="tips">
            <HealthTips 
              tips={healthTips} 
              isLoading={isLoading} 
              symptomHistory={symptomHistory}
            />
          </TabsContent>
          
          <TabsContent value="tracker">
            <HealthTracker />
          </TabsContent>
          
          <TabsContent value="emergency">
            <EmergencyContacts userLocation={userLocation} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

// Enhanced function to simulate AI response with more realistic health tips
async function getHealthTips(symptoms: string): Promise<string[]> {
  // In a real application, this would call an actual AI API
  // For this MVP, we'll simulate a response with more realistic tips
  return new Promise((resolve) => {
    setTimeout(() => {
      const lowerSymptoms = symptoms.toLowerCase();
      let tips: string[] = [];
      
      // Provide more specific tips based on common symptoms
      if (lowerSymptoms.includes('headache')) {
        tips.push("For headaches, try resting in a dark, quiet room and applying a cold compress.");
        tips.push("Stay hydrated and consider over-the-counter pain relievers like acetaminophen or ibuprofen if appropriate.");
      }
      
      if (lowerSymptoms.includes('fever')) {
        tips.push("For fever, stay hydrated and rest. Consider taking acetaminophen or ibuprofen to reduce fever.");
        tips.push("If fever persists above 103°F (39.4°C) for adults or 102°F (38.9°C) for children, seek medical attention.");
      }
      
      if (lowerSymptoms.includes('cough')) {
        tips.push("For coughs, try drinking warm liquids like tea with honey to soothe your throat.");
        tips.push("Use a humidifier or take a steamy shower to help loosen congestion.");
      }
      
      if (lowerSymptoms.includes('nausea') || lowerSymptoms.includes('vomit')) {
        tips.push("For nausea, try eating small, bland meals and avoid spicy or fatty foods.");
        tips.push("Stay hydrated with small sips of clear liquids. Ginger tea may help reduce nausea.");
      }
      
      if (lowerSymptoms.includes('sore throat')) {
        tips.push("For a sore throat, gargle with warm salt water (1/4 to 1/2 teaspoon of salt in 8 ounces of warm water).");
        tips.push("Throat lozenges or sprays may provide temporary relief. Stay hydrated with warm liquids.");
      }
      
      // Add general tips if specific symptoms aren't recognized or as additional advice
      if (tips.length < 3) {
        tips.push(`Based on your symptoms: "${symptoms}", ensure you're getting adequate rest to help your body recover.`);
        tips.push("Stay hydrated by drinking plenty of water throughout the day.");
        tips.push("Monitor your symptoms and consult a healthcare provider if they worsen or persist.");
        tips.push("Consider a balanced diet rich in fruits and vegetables to support your immune system.");
      }
      
      // Add a reminder about seeking professional help
      tips.push("If symptoms are severe or persistent, please consult with a healthcare professional.");
      
      resolve(tips);
    }, 1500); // Simulate network delay
  });
}

export default App;