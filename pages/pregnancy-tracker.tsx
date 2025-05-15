import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { FaPlus, FaCalendarAlt, FaWeight, FaSmile, FaNotesMedical, FaRuler, FaChild, FaBaby, FaArrowLeft, FaArrowRight, FaChartLine, FaListUl } from 'react-icons/fa';
import { weeklyFruitData } from '@/lib/weeklyData';
import WeightChart from '@/components/WeightChart';
import MilestoneTimeline from '@/components/MilestoneTimeline';
import { PregnancyEntry } from '@/types/pregnancy';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/hooks/useUser';
import MedicalDisclaimer from '@/components/MedicalDisclaimer';

export default function PregnancyTrackerPage() {
  const { user } = useUser();
  const [entries, setEntries] = useState<PregnancyEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(20);
  const [dueDate, setDueDate] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'weight' | 'milestones'>('summary');
  
  // Form state
  const [weight, setWeight] = useState<number>(0);
  const [mood, setMood] = useState<string>('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null);

  const fetchUserData = useCallback(async () => {
    try {
      const { data: userData, error } = await supabase
        .from('users')
        .select('due_date')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      
      if (userData?.due_date) {
        setDueDate(userData.due_date);
        // Calculate current week based on due date
        const dueDateTime = new Date(userData.due_date).getTime();
        const now = new Date().getTime();
        const diffTime = dueDateTime - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const weeksLeft = Math.floor(diffDays / 7);
        const calculatedWeek = 40 - weeksLeft;
        
        if (calculatedWeek > 0 && calculatedWeek <= 40) {
          setCurrentWeek(calculatedWeek);
        }
      }
    } catch (error: unknown) {
      console.error('Error fetching user data:', error instanceof Error ? error.message : 'Unknown error');
    }
  }, [user?.id]);

  const fetchEntries = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('pregnancy_entries')
        .select('*')
        .eq('user_id', user?.id)
        .order('entry_date', { ascending: false });

      if (error) throw error;

      if (data) {
        setEntries(data);
      }
    } catch (error: unknown) {
      console.error('Error fetching entries:', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Fetch entries from Supabase
  useEffect(() => {
    if (user) {
      fetchEntries();
      fetchUserData();
    }
  }, [user, fetchEntries, fetchUserData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const newEntry = {
        user_id: user?.id,
        weight,
        mood,
        symptoms: selectedSymptoms,
        notes,
        entry_date: new Date().toISOString(),
        pregnancy_week: currentWeek
      };
      
      const { data, error } = await supabase
        .from('pregnancy_entries')
        .insert([newEntry])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setEntries([data, ...entries]);
        setMessage('Entry saved successfully!');
        setShowForm(false);
      }
      
      // Reset form
      setWeight(0);
      setMood('');
      setSelectedSymptoms([]);
      setNotes('');
    } catch (error: unknown) {
      console.error('Error saving entry:', error instanceof Error ? error.message : 'Unknown error');
      setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSetDueDate = async () => {
    const date = prompt('Enter your due date (YYYY-MM-DD):');
    if (date) {
      try {
        const { error } = await supabase
          .from('users')
          .update({ due_date: date })
          .eq('id', user?.id);

        if (error) throw error;

        setDueDate(date);
        
        // Calculate current week based on due date
        const dueDateTime = new Date(date).getTime();
        const now = new Date().getTime();
        const diffTime = dueDateTime - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const weeksLeft = Math.floor(diffDays / 7);
        const calculatedWeek = 40 - weeksLeft;
        
        if (calculatedWeek > 0 && calculatedWeek <= 40) {
          setCurrentWeek(calculatedWeek);
        }
      } catch (error: unknown) {
        console.error('Error updating due date:', error instanceof Error ? error.message : 'Unknown error');
        setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };

  // Common pregnancy symptoms
  const commonSymptoms: string[] = [
    'Nausea', 'Vomiting', 'Fatigue', 'Headache', 'Backache', 
    'Breast Tenderness', 'Constipation', 'Heartburn', 'Swelling'
  ];

  // Mood options
  const moodOptions: string[] = [
    'Happy', 'Anxious', 'Tired', 'Energetic', 'Emotional', 
    'Calm', 'Irritable', 'Excited', 'Worried', 'Content'
  ];

  const handleSymptomToggle = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const weekData = weeklyFruitData.find(w => w.week === currentWeek) || weeklyFruitData[0];
  
  const handleNextWeek = () => {
    if (currentWeek < 40) {
      setCurrentWeek(currentWeek + 1);
    }
  };
  
  const handlePrevWeek = () => {
    if (currentWeek > 1) {
      setCurrentWeek(currentWeek - 1);
    }
  };

  return (
    <>
      <Head>
        <title>Pregnancy Tracker - SheBond</title>
      </Head>
      <div className="min-h-screen bg-amber-50 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <MedicalDisclaimer />
          <div className="bg-gradient-to-r from-amber-900 to-red-700 text-white rounded-xl p-8 mb-8 shadow-lg">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0 md:mr-6">
                <h1 className="text-3xl md:text-4xl font-bold mb-2 font-lovelace">Your Pregnancy Journey</h1>
                <p className="text-amber-100 text-lg">
                  Track your pregnancy with personalized insights and weekly updates
                </p>
                {dueDate && (
                  <div className="mt-4 bg-white/20 px-4 py-2 rounded-lg inline-block">
                    <span className="font-semibold">Due Date:</span> {new Date(dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                )}
                <div className="mt-4 flex space-x-2">
                  <button 
                    onClick={handleSetDueDate}
                    className="bg-white text-amber-900 hover:bg-amber-50 font-medium py-2 px-4 rounded-md"
                  >
                    {dueDate ? 'Update Due Date' : 'Set Due Date'}
                  </button>
                </div>
              </div>
              <div>
                <div className="text-center">
                  <div className="inline-block bg-white p-4 rounded-full shadow-lg">
                    <div className="text-3xl font-bold text-amber-900">{currentWeek}</div>
                    <div className="text-sm text-amber-800 font-medium">Week{currentWeek === 1 ? '' : 's'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex border-b border-gray-200 mb-8">
            <button
              onClick={() => setActiveTab('summary')}
              className={`py-3 px-6 font-medium text-sm focus:outline-none ${
                activeTab === 'summary'
                  ? 'border-b-2 border-amber-500 text-amber-700'
                  : 'text-gray-500 hover:text-amber-700'
              }`}
            >
              Weekly Summary
            </button>
            <button
              onClick={() => setActiveTab('weight')}
              className={`py-3 px-6 font-medium text-sm focus:outline-none flex items-center ${
                activeTab === 'weight'
                  ? 'border-b-2 border-amber-500 text-amber-700'
                  : 'text-gray-500 hover:text-amber-700'
              }`}
            >
              <FaChartLine className="mr-2" />
              Weight Tracker
            </button>
            <button
              onClick={() => setActiveTab('milestones')}
              className={`py-3 px-6 font-medium text-sm focus:outline-none flex items-center ${
                activeTab === 'milestones'
                  ? 'border-b-2 border-amber-500 text-amber-700'
                  : 'text-gray-500 hover:text-amber-700'
              }`}
            >
              <FaListUl className="mr-2" />
              Milestones
            </button>
          </div>
          
          {activeTab === 'summary' && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 font-lovelace">Week {currentWeek}: Baby Size Visualization</h2>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={handlePrevWeek} 
                    disabled={currentWeek <= 1}
                    className={`p-2 rounded-full ${currentWeek <= 1 ? 'bg-gray-200 text-gray-400' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'}`}
                  >
                    <FaArrowLeft />
                  </button>
                  <button 
                    onClick={handleNextWeek} 
                    disabled={currentWeek >= 40}
                    className={`p-2 rounded-full ${currentWeek >= 40 ? 'bg-gray-200 text-gray-400' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'}`}
                  >
                    <FaArrowRight />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col items-center justify-center">
                  <div className="relative mb-4">
                    <div className="w-48 h-48 flex items-center justify-center bg-amber-50 rounded-full p-4">
                      <Image 
                        src={`/fruits/${weekData.fruit}.svg`} 
                        alt={weekData.fruitName} 
                        width={150} 
                        height={150}
                        style={{ objectFit: 'contain' }}
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-red-700 text-white text-sm font-bold rounded-full w-10 h-10 flex items-center justify-center">
                      W{weekData.week}
                  </div>
                  </div>
                  <h3 className="text-xl font-semibold text-amber-800 font-lovelace">{weekData.fruitName}</h3>
                  <p className="text-center text-gray-600 mt-2">{weekData.description}</p>
                </div>
                
                <div className="bg-amber-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-amber-900 mb-4 font-lovelace">Baby Development</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <FaRuler className="text-amber-700 mt-1 mr-3" />
                      <div>
                        <p className="font-medium text-gray-800">Size</p>
                        <p className="text-gray-600">{weekData.babySize}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaWeight className="text-amber-700 mt-1 mr-3" />
                      <div>
                        <p className="font-medium text-gray-800">Weight</p>
                        <p className="text-gray-600">{weekData.babyWeight}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaChild className="text-amber-700 mt-1 mr-3" />
                      <div>
                        <p className="font-medium text-gray-800">Length</p>
                        <p className="text-gray-600">{weekData.babyLength}</p>
                      </div>
                  </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'weight' && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold mb-6 text-amber-900 font-lovelace">Weight Tracker</h2>
              
              <div className="mb-6">
                <WeightChart 
                  entries={entries}
                />
              </div>
              
              <div className="bg-amber-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg text-amber-800 font-lovelace">About Weight Tracking</h3>
                <p className="text-gray-600 text-sm">
                  Regular weight tracking helps monitor your pregnancy progress. Add regular entries to visualize your weight changes.
                  The chart will show your progress over time along with the pregnancy week at each entry.
                </p>
              </div>
            </div>
          )}
          
          {activeTab === 'milestones' && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold mb-6 text-amber-900 font-lovelace">Pregnancy Milestones</h2>
              
              <div className="mb-6">
                <MilestoneTimeline currentWeek={currentWeek} />
            </div>
            
              <div className="bg-amber-50 p-4 rounded-lg mt-6">
                <h3 className="font-semibold text-lg text-amber-800 font-lovelace">Your Progress</h3>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div 
                    className="bg-amber-600 h-2.5 rounded-full" 
                    style={{ width: `${(currentWeek / 40) * 100}%` }}
                  ></div>
                </div>
                <p className="text-gray-600 text-sm">
                  You&apos;re {Math.round((currentWeek / 40) * 100)}% through your pregnancy journey. 
                  {currentWeek <= 13 ? 
                    'You&apos;re in the first trimester, a crucial time for your baby&apos;s development.' :
                    currentWeek <= 26 ? 
                      'You&apos;re in the second trimester, often called the &quot;golden period&quot; of pregnancy.' :
                      'You&apos;re in the third trimester, the final stretch before meeting your baby!'}
                </p>
              </div>
            </div>
          )}
          
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-gradient-to-r from-amber-700 to-red-700 hover:from-amber-800 hover:to-red-800 text-white font-bold py-3 px-6 rounded-lg shadow-md flex items-center"
            >
              <FaPlus className="mr-2" />
              {showForm ? 'Cancel' : 'Add Entry'}
            </button>
                </div>

          {message && (
            <div className={`p-4 rounded-lg mb-6 ${message.includes('Error') ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>
              {message}
            </div>
          )}

          {showForm && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold mb-6 text-amber-900 flex items-center font-lovelace">
                <FaBaby className="mr-3 text-amber-700" />
                Record Today&apos;s Status
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 flex items-center">
                      <FaWeight className="mr-2 text-amber-700" />
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(parseFloat(e.target.value))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                      step="0.1"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 flex items-center">
                      <FaSmile className="mr-2 text-amber-700" />
                      Mood
                    </label>
                    <select
                      value={mood}
                      onChange={(e) => setMood(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                    >
                      <option value="">Select mood</option>
                      {moodOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">Symptoms</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {commonSymptoms.map(symptom => (
                      <div key={symptom} className="flex items-center">
                        <input 
                          type="checkbox" 
                          id={`symptom-${symptom}`}
                          checked={selectedSymptoms.includes(symptom)} 
                          onChange={() => handleSymptomToggle(symptom)}
                          className="mr-2 h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`symptom-${symptom}`} className="text-gray-700">{symptom}</label>
                </div>
              ))}
            </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2 flex items-center">
                    <FaNotesMedical className="mr-2 text-amber-700" />
                    Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg h-32 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Any notes or observations..."
                  />
        </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`py-3 px-6 rounded-lg font-bold flex items-center ${
                      loading ? 'bg-gray-400 text-white' : 'bg-gradient-to-r from-amber-700 to-red-700 hover:from-amber-800 hover:to-red-800 text-white'
                    }`}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      'Save Entry'
                    )}
              </button>
            </div>
              </form>
        </div>
      )}

          {activeTab === 'summary' && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6 text-amber-900 flex items-center font-lovelace">
                <FaCalendarAlt className="mr-3 text-amber-700" />
                Your Journey Entries
              </h2>
              
              {entries.length === 0 ? (
                <div className="bg-amber-50 rounded-lg p-8 text-center">
                  <p className="text-gray-600 mb-4">No entries yet. Add your first entry to start tracking your pregnancy journey.</p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-700 to-red-700 hover:from-amber-800 hover:to-red-800 text-white font-medium rounded-md"
                  >
                    <FaPlus className="mr-2" />
                    Add First Entry
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {entries.map((entry, index) => (
                    <div key={entry.id || index} className="border-b border-gray-200 pb-6 last:border-0">
                      <div className="flex flex-wrap justify-between items-center mb-3">
                        <h3 className="font-bold text-lg text-amber-800 font-lovelace">
                          {new Date(entry.entry_date).toLocaleDateString('en-US', { 
                            weekday: 'long',
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </h3>
                        <div className="flex items-center">
                          {entry.pregnancy_week && (
                            <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full font-semibold mr-2">
                              Week {entry.pregnancy_week}
                            </span>
                          )}
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            Entry {entries.length - index}
                          </span>
              </div>
              </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-3">
                        <div className="bg-amber-50 p-3 rounded-lg flex items-center">
                          <FaWeight className="text-amber-700 mr-2" />
                          <span className="font-medium text-gray-700">Weight:</span>
                          <span className="ml-2 text-gray-800">{entry.weight} kg</span>
              </div>
                        
                        {entry.mood && (
                          <div className="bg-amber-100 p-3 rounded-lg flex items-center">
                            <FaSmile className="text-amber-700 mr-2" />
                            <span className="font-medium text-gray-700">Mood:</span>
                            <span className="ml-2 text-gray-800">{entry.mood}</span>
              </div>
                        )}
              </div>
                      
                      {entry.symptoms && entry.symptoms.length > 0 && (
                        <div className="mb-3">
                          <span className="font-medium text-gray-700">Symptoms:</span> 
                          <div className="flex flex-wrap gap-1 mt-1">
                            {entry.symptoms.map(symptom => (
                              <span key={symptom} className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                                {symptom}
                              </span>
                            ))}
          </div>
        </div>
      )}

                      {entry.notes && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium text-gray-700">Notes:</span>
                          <p className="mt-1 text-gray-600">{entry.notes}</p>
            </div>
                      )}
              </div>
                  ))}
              </div>
              )}
            </div>
          )}
        </div>
    </div>
    </>
  );
} 