import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Loader, Clock, Share2 } from 'lucide-react';
import { SymptomHistory } from '../types';
import { format } from 'date-fns';

interface HealthTipsProps {
  tips: string[];
  isLoading: boolean;
  symptomHistory: SymptomHistory[];
}

export const HealthTips: React.FC<HealthTipsProps> = ({ tips, isLoading, symptomHistory }) => {
  const [showHistory, setShowHistory] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<SymptomHistory | null>(null);

  const handleShare = async (text: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Health Tips from Virtual Health Buddy',
          text: text
        });
      } catch (error) {
        console.error('Error sharing:', error);
        // Fallback for browsers that support clipboard but not share
        copyToClipboard(text);
      }
    } else {
      copyToClipboard(text);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert('Health tips copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  const formatTipsForSharing = (tipsArray: string[]) => {
    return `Health Tips from Virtual Health Buddy:\n\n${tipsArray.join('\n\n')}`;
  };

  const displayTips = selectedHistoryItem ? selectedHistoryItem.tips : tips;

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Health Tips</h2>
          {displayTips.length > 0 && (
            <button 
              onClick={() => handleShare(formatTipsForSharing(displayTips))}
              className="text-blue-600 p-2 hover:bg-blue-50 rounded-full"
              title="Share these tips"
            >
              <Share2 size={18} />
            </button>
          )}
        </div>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader size={32} className="animate-spin text-blue-500 mb-4" />
            <p className="text-gray-600">Analyzing your symptoms...</p>
          </div>
        ) : displayTips.length > 0 ? (
          <>
            {selectedHistoryItem && (
              <div className="mb-4 p-3 bg-blue-50 rounded-md">
                <p className="text-sm font-medium">Tips for: {selectedHistoryItem.symptoms}</p>
                <p className="text-xs text-gray-500">
                  {format(new Date(selectedHistoryItem.date), 'MMM d, yyyy - h:mm a')}
                </p>
                <button 
                  onClick={() => setSelectedHistoryItem(null)}
                  className="text-xs text-blue-600 mt-1"
                >
                  Return to current tips
                </button>
              </div>
            )}
            <ul className="space-y-3">
              {displayTips.map((tip, index) => (
                <li key={index} className="p-3 bg-blue-50 rounded-md">
                  <p className="text-gray-800">{tip}</p>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No health tips yet. Log your symptoms to get personalized advice.</p>
          </div>
        )}
        
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-100 rounded-md">
          <p className="text-sm text-yellow-800">
            <strong>Disclaimer:</strong> These tips are generated for informational purposes only and are not a substitute for professional medical advice. Always consult with a healthcare provider for medical concerns.
          </p>
        </div>
      </Card>

      {symptomHistory.length > 1 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className="text-sm text-blue-600 flex items-center"
            >
              <Clock size={16} className="mr-1" />
              {showHistory ? 'Hide previous tips' : 'Show previous tips'}
            </button>
            <span className="text-xs text-gray-500">
              {symptomHistory.length} {symptomHistory.length === 1 ? 'entry' : 'entries'}
            </span>
          </div>
          
          {showHistory && (
            <Card className="bg-gray-50">
              <h3 className="text-lg font-medium mb-3">Previous Health Tips</h3>
              <ul className="space-y-3 max-h-60 overflow-y-auto">
                {symptomHistory.map((entry) => (
                  <li 
                    key={entry.id} 
                    className="p-3 bg-white rounded-md shadow-sm cursor-pointer hover:bg-blue-50"
                    onClick={() => setSelectedHistoryItem(entry)}
                  >
                    <p className="font-medium">{entry.symptoms}</p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(entry.date), 'MMM d, yyyy - h:mm a')}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      {entry.tips.length} tips available
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