import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Loader, Clock, RefreshCw } from 'lucide-react';
import { SymptomHistory } from '../types';
import { format } from 'date-fns';

interface SymptomLoggerProps {
  onSubmit: (symptoms: string) => void;
  isLoading: boolean;
  symptomHistory: SymptomHistory[];
}

export const SymptomLogger: React.FC<SymptomLoggerProps> = ({ 
  onSubmit, 
  isLoading,
  symptomHistory
}) => {
  const [symptoms, setSymptoms] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (symptoms.trim()) {
      onSubmit(symptoms);
    }
  };

  const handleQuickSymptom = (quickSymptom: string) => {
    setSymptoms(prev => {
      const newSymptoms = prev ? `${prev}, ${quickSymptom}` : quickSymptom;
      return newSymptoms;
    });
  };

  const quickSymptoms = [
    'Headache', 'Fever', 'Cough', 'Sore Throat', 
    'Fatigue', 'Nausea', 'Dizziness', 'Shortness of Breath'
  ];

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-semibold mb-4">Log Your Symptoms</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 mb-1">
              Describe your symptoms
            </label>
            <textarea
              id="symptoms"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="E.g., I have a headache, sore throat, and feel tired"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Quick add:</p>
            <div className="flex flex-wrap gap-2">
              {quickSymptoms.map((symptom, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleQuickSymptom(symptom)}
                  className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100"
                >
                  + {symptom}
                </button>
              ))}
            </div>
          </div>
          
          <Button 
            type="submit" 
            disabled={isLoading || !symptoms.trim()}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader size={16} className="mr-2 animate-spin" />
                Getting Health Tips...
              </>
            ) : (
              'Get Health Tips'
            )}
          </Button>
        </form>
      </Card>
      
      {symptomHistory.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className="text-sm text-blue-600 flex items-center"
            >
              <Clock size={16} className="mr-1" />
              {showHistory ? 'Hide symptom history' : 'Show symptom history'}
            </button>
            <span className="text-xs text-gray-500">
              {symptomHistory.length} {symptomHistory.length === 1 ? 'entry' : 'entries'}
            </span>
          </div>
          
          {showHistory && (
            <Card className="bg-gray-50">
              <h3 className="text-lg font-medium mb-3">Recent Symptoms</h3>
              <ul className="space-y-3 max-h-60 overflow-y-auto">
                {symptomHistory.map((entry) => (
                  <li key={entry.id} className="p-3 bg-white rounded-md shadow-sm">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-medium">{entry.symptoms}</p>
                      <button
                        onClick={() => {
                          setSymptoms(entry.symptoms);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="text-blue-600 p-1 hover:bg-blue-50 rounded-full"
                        title="Use these symptoms again"
                      >
                        <RefreshCw size={14} />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">
                      {format(new Date(entry.date), 'MMM d, yyyy - h:mm a')}
                    </p>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};