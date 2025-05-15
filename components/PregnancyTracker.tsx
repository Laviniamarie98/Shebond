import React, { useEffect } from 'react';
import { PregnancyEntry } from '@/lib/types';

interface PregnancyEntryWithSymptoms extends PregnancyEntry {
  symptoms?: string[];
}

interface PregnancyTrackerProps {
  entries: PregnancyEntryWithSymptoms[];
  onEntriesChange: (newEntries: PregnancyEntryWithSymptoms[]) => Promise<void>;
  onWeekChange: (week: number) => void;
}

const PregnancyTracker: React.FC<PregnancyTrackerProps> = ({
  entries,
  onEntriesChange,
  onWeekChange,
}) => {
  // Calculate current week based on entries
  useEffect(() => {
    if (entries.length > 0) {
      const latestEntry = entries[0];
      const currentWeek = Math.floor(
        (new Date().getTime() - new Date(latestEntry.date).getTime()) / 
        (1000 * 60 * 60 * 24 * 7)
      );
      onWeekChange(currentWeek);
    }
  }, [entries, onWeekChange]);

  const handleEntryUpdate = async (updatedEntry: PregnancyEntryWithSymptoms, index: number) => {
    const newEntries = [...entries];
    newEntries[index] = updatedEntry;
    await onEntriesChange(newEntries);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Pregnancy Tracker</h2>
      <div className="space-y-4">
        {entries.map((entry, index) => (
          <div key={entry.id || index} className="border rounded p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Week {entry.week}</h3>
                <p className="text-gray-600">{new Date(entry.date).toLocaleDateString()}</p>
              </div>
              <button
                onClick={() => handleEntryUpdate({ ...entry, symptoms: [...(entry.symptoms || []), 'New Symptom'] }, index)}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
              >
                Update
              </button>
            </div>
            {entry.symptoms && entry.symptoms.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium">Symptoms:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {entry.symptoms.map((symptom, sympIndex) => (
                    <span key={sympIndex} className="px-2 py-1 bg-gray-100 rounded text-sm">
                      {symptom}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PregnancyTracker; 