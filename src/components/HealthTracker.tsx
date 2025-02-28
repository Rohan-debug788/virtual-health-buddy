import React, { useState } from 'react';

const HealthTracker: React.FC = () => {
  const [symptoms, setSymptoms] = useState('');
  const [healthData, setHealthData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/SymptomsOutput.json');
      const data = await response.json();

      // Filter based on user input matching any name, text, or laytext field
      const filteredData = data.filter((item: any) =>
        [item.name, item.text, item.laytext]
          .join(' ')
          .toLowerCase()
          .includes(symptoms.toLowerCase())
      );

      setHealthData(filteredData);
    } catch (error) {
      console.error('Error fetching health data:', error);
      setHealthData([]);
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
          placeholder="Describe your symptoms or health concern..."
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
        ></textarea>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded mt-2"
          disabled={loading}
        >
          {loading ? 'Fetching data...' : 'Get Health Info'}
        </button>
      </form>

      <div>
        <h3 className="text-xl font-semibold mb-2">Matching Results:</h3>
        {healthData.length ? (
          <ul className="list-disc pl-5">
            {healthData.map((item, index) => (
              <li key={index} className="mb-2">
                <strong>{item.name}</strong>: {item.laytext || item.text}
              </li>
            ))}
          </ul>
        ) : (
          <p>No relevant data found.</p>
        )}
      </div>
    </div>
  );
};

export default HealthTracker;
