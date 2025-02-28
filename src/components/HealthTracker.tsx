import React, { useState } from 'react';

const HealthTracker: React.FC = () => {
  const [symptoms, setSymptoms] = useState('');
  const [healthTips, setHealthTips] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('BOLT_AI_API_ENDPOINT', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: `Provide health tips for: ${symptoms}` }),
      });

      const data = await response.json();
      setHealthTips(data.tips || ['No tips available.']);
    } catch (error) {
      console.error('Error fetching health tips:', error);
      setHealthTips(['Failed to fetch health tips.']);
    }
    setLoading(false);
  };

  return (
    <div className="p-4 max-w-lg mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Health Tracker</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          className="w-full p-2 border rounded"
          rows={4}
          placeholder="Describe your symptoms..."
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
        ></textarea>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded mt-2"
          disabled={loading}
        >
          {loading ? 'Getting Tips...' : 'Get Health Tips'}
        </button>
      </form>

      <div>
        <h3 className="text-xl font-semibold mb-2">Health Tips:</h3>
        <ul className="list-disc pl-5">
          {healthTips.map((tip, index) => (
            <li key={index} className="mb-1">
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HealthTracker;
