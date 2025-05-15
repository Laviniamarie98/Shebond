import { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FaTimes, FaCheck, FaCamera, FaTrophy, FaRunning, FaBrain, FaSmile, FaComments, FaSpinner } from 'react-icons/fa';
import styles from '../styles/BabyMilestones.module.css';
import { supabase } from '@/lib/supabase';
import MedicalDisclaimer from '@/components/MedicalDisclaimer';

// Define milestone categories and their items
const milestoneCategories = {
  physical: {
    title: 'Physical Development',
    milestones: [
      { id: 'p1', title: 'Lifts head during tummy time', typicalAge: '1-2 months' },
      { id: 'p2', title: 'Rolls over (tummy to back)', typicalAge: '2-4 months' },
      { id: 'p3', title: 'Sits without support', typicalAge: '4-7 months' },
      { id: 'p4', title: 'Crawls', typicalAge: '6-10 months' },
      { id: 'p5', title: 'Pulls up to stand', typicalAge: '9-12 months' },
      { id: 'p6', title: 'Takes first steps', typicalAge: '9-15 months' },
      { id: 'p7', title: 'Walks well', typicalAge: '12-18 months' },
      { id: 'p8', title: 'Runs', typicalAge: '18-24 months' },
    ]
  },
  cognitive: {
    title: 'Cognitive Development',
    milestones: [
      { id: 'c1', title: 'Follows moving objects', typicalAge: '2-3 months' },
      { id: 'c2', title: 'Recognizes familiar faces', typicalAge: '3-4 months' },
      { id: 'c3', title: 'Reaches for toys', typicalAge: '3-5 months' },
      { id: 'c4', title: 'Transfers objects between hands', typicalAge: '5-7 months' },
      { id: 'c5', title: 'Finds partially hidden objects', typicalAge: '6-8 months' },
      { id: 'c6', title: 'Points to objects', typicalAge: '9-12 months' },
      { id: 'c7', title: 'Follows simple commands', typicalAge: '12-15 months' },
      { id: 'c8', title: 'Sorts objects by shape/color', typicalAge: '18-24 months' },
    ]
  },
  social: {
    title: 'Social & Emotional',
    milestones: [
      { id: 's1', title: 'Smiles at people', typicalAge: '1-2 months' },
      { id: 's2', title: 'Laughs', typicalAge: '3-4 months' },
      { id: 's3', title: 'Knows familiar faces', typicalAge: '4-5 months' },
      { id: 's4', title: 'Responds to own name', typicalAge: '5-7 months' },
      { id: 's5', title: 'Shows stranger anxiety', typicalAge: '6-8 months' },
      { id: 's6', title: 'Plays peek-a-boo', typicalAge: '7-9 months' },
      { id: 's7', title: 'Waves bye-bye', typicalAge: '9-12 months' },
      { id: 's8', title: 'Shows affection', typicalAge: '12-18 months' },
    ]
  },
  language: {
    title: 'Language & Communication',
    milestones: [
      { id: 'l1', title: 'Coos and makes sounds', typicalAge: '1-3 months' },
      { id: 'l2', title: 'Babbles', typicalAge: '4-6 months' },
      { id: 'l3', title: 'Makes consonant sounds', typicalAge: '6-8 months' },
      { id: 'l4', title: 'Says "mama" or "dada"', typicalAge: '8-12 months' },
      { id: 'l5', title: 'Uses 1-2 words', typicalAge: '12-15 months' },
      { id: 'l6', title: 'Uses 6+ words', typicalAge: '15-18 months' },
      { id: 'l7', title: 'Combines two words', typicalAge: '18-24 months' },
      { id: 'l8', title: 'Uses 50+ words', typicalAge: '24+ months' },
    ]
  }
};

// Define medals for each category
const medalDefinitions = {
  physical: {
    id: 'medal-physical',
    title: 'Physical Champion',
    icon: <FaRunning />,
    description: 'Completed all physical development milestones',
    color: '#4CAF50'
  },
  cognitive: {
    id: 'medal-cognitive',
    title: 'Cognitive Achiever',
    icon: <FaBrain />,
    description: 'Completed all cognitive development milestones',
    color: '#2196F3'
  },
  social: {
    id: 'medal-social',
    title: 'Social Star',
    icon: <FaSmile />,
    description: 'Completed all social & emotional milestones',
    color: '#FF9800'
  },
  language: {
    id: 'medal-language',
    title: 'Language Master',
    icon: <FaComments />,
    description: 'Completed all language & communication milestones',
    color: '#9C27B0'
  },
  all: {
    id: 'medal-all',
    title: 'Development Champion',
    icon: <FaTrophy />,
    description: 'Completed all developmental milestones',
    color: '#ae492f'
  }
};

export default function BabyMilestones() {
  const router = useRouter();
  // State for tracking completed milestones
  const [completedMilestones, setCompletedMilestones] = useState<Record<string, { date: string; note: string; photo?: string }>>({});
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<{ id: string; title: string; typicalAge: string } | null>(null);
  const [milestoneNote, setMilestoneNote] = useState('');
  const [milestoneDate, setMilestoneDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeCategory, setActiveCategory] = useState('physical');
  const [isLoading, setIsLoading] = useState(true);
  const [justCompletedId, setJustCompletedId] = useState<string | null>(null);
  const confettiRef = useRef<HTMLDivElement>(null);
  const [earnedMedals, setEarnedMedals] = useState<string[]>([]);
  const [justEarnedMedal, setJustEarnedMedal] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Fetch user milestones on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is authenticated
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/login');
          return;
        }
        
        // Verify the user with getUser to ensure authentication is valid
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          router.push('/login');
          return;
        }
        
        fetchUserMilestones();
      } catch (error) {
        console.error('Auth error:', error);
        router.push('/login');
      }
    };
    
    checkAuth();
  }, [router]);

  // Fetch user's saved milestones from the database
  const fetchUserMilestones = async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('baby_milestones')
        .select('*')
        .eq('user_id', session.user.id);

      if (error) throw error;

      // Convert to format used by component
      const milestonesMap: Record<string, { date: string; note: string; photo?: string }> = {};
      
      if (data) {
        data.forEach(milestone => {
          milestonesMap[milestone.milestone_id] = {
            date: milestone.date_achieved,
            note: milestone.notes || '',
            photo: milestone.photo_url,
          };
        });
      }
      
      setCompletedMilestones(milestonesMap);
    } catch (error) {
      console.error('Error fetching milestones:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate progress percentage
  const calculateProgress = () => {
    const totalMilestones = Object.values(milestoneCategories).reduce(
      (total, category) => total + category.milestones.length, 0
    );
    const completedCount = Object.keys(completedMilestones).length;
    return Math.round((completedCount / totalMilestones) * 100);
  };

  // Create confetti effect
  const createConfetti = () => {
    if (!confettiRef.current) return;
    
    const colors = ['#ae492f', '#d5a676', '#6d3914', '#4CAF50', '#8BC34A'];
    
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = styles.confetti;
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.top = `${Math.random() * 100}%`;
      confetti.style.width = `${Math.random() * 10 + 5}px`;
      confetti.style.height = `${Math.random() * 10 + 5}px`;
      confetti.style.opacity = '1';
      confetti.style.animation = `${styles.confettiRain} ${Math.random() * 3 + 1}s forwards`;
      
      confettiRef.current.appendChild(confetti);
      
      setTimeout(() => {
        if (confettiRef.current && confetti.parentNode === confettiRef.current) {
          confettiRef.current.removeChild(confetti);
        }
      }, 4000);
    }
  };

  // Toggle milestone completion
  const toggleMilestone = (milestone: { id: string; title: string; typicalAge: string }) => {
    if (completedMilestones[milestone.id]) {
      // Delete milestone from database
      deleteMilestone(milestone.id);
    } else {
      setSelectedMilestone(milestone);
      setShowMilestoneModal(true);
    }
  };

  // Delete milestone from database
  const deleteMilestone = async (milestoneId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase
        .from('baby_milestones')
        .delete()
        .eq('user_id', session.user.id)
        .eq('milestone_id', milestoneId);

      if (error) throw error;

      // Update local state
      const newCompletedMilestones = { ...completedMilestones };
      delete newCompletedMilestones[milestoneId];
      setCompletedMilestones(newCompletedMilestones);
      
      // Re-check medals after removing a milestone
      setTimeout(() => checkEarnedMedals(), 300);
    } catch (error) {
      console.error('Error deleting milestone:', error);
    }
  };

  // Check for earned medals
  const checkEarnedMedals = useCallback(() => {
    // Check if all milestones in a category are completed
    const checkCategoryCompletion = (category: string) => {
      const milestones = milestoneCategories[category as keyof typeof milestoneCategories].milestones;
      return milestones.every(milestone => completedMilestones[milestone.id]);
    };

    const newEarnedMedals: string[] = [];
    
    // Check each category
    Object.keys(milestoneCategories).forEach(category => {
      if (checkCategoryCompletion(category)) {
        newEarnedMedals.push(`medal-${category}`);
      }
    });
    
    // Check if all categories are complete
    if (newEarnedMedals.length === Object.keys(milestoneCategories).length) {
      newEarnedMedals.push('medal-all');
    }
    
    // Find newly earned medals
    const newMedals = newEarnedMedals.filter(medal => !earnedMedals.includes(medal));
    
    if (newMedals.length > 0) {
      setEarnedMedals(newEarnedMedals);
      setJustEarnedMedal(newMedals[0]); // Highlight the first new medal
      setTimeout(() => setJustEarnedMedal(null), 3000);
    }
  }, [earnedMedals, completedMilestones]);

  // Save milestone details to database
  const saveMilestoneDetails = async () => {
    if (!selectedMilestone) return;
    setSaveError(null);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      
      // Get the category from the milestone ID
      const category = selectedMilestone.id.charAt(0) === 'p' ? 'physical' :
                      selectedMilestone.id.charAt(0) === 'c' ? 'cognitive' :
                      selectedMilestone.id.charAt(0) === 's' ? 'social' : 'language';
      
      // Save to Supabase
      const { error } = await supabase
        .from('baby_milestones')
        .upsert({
          user_id: session.user.id,
          milestone_id: selectedMilestone.id,
          category,
          title: selectedMilestone.title,
          date_achieved: milestoneDate,
          notes: milestoneNote,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      // Update local state
      setCompletedMilestones({
        ...completedMilestones,
        [selectedMilestone.id]: {
          date: milestoneDate,
          note: milestoneNote
        }
      });
      
      setShowMilestoneModal(false);
      setJustCompletedId(selectedMilestone.id);
      setTimeout(() => {
        createConfetti();
        setTimeout(() => setJustCompletedId(null), 1000);
        
        // Check for newly earned medals
        checkEarnedMedals();
      }, 300);
      
      setSelectedMilestone(null);
      setMilestoneNote('');
      setMilestoneDate(new Date().toISOString().split('T')[0]);
    } catch (error: unknown) {
      console.error('Error saving milestone:', error);
      setSaveError(error instanceof Error ? error.message : 'Error saving milestone');
    }
  };

  // Check for earned medals on initial load and when completed milestones change
  useEffect(() => {
    if (!isLoading) {
      checkEarnedMedals();
    }
  }, [completedMilestones, isLoading, checkEarnedMedals]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <FaSpinner className="animate-spin h-10 w-10 text-purple-600 mb-4" />
        <p className="text-gray-700">Loading your baby milestones...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Baby Milestones - SheBond</title>
      </Head>
      <div className="min-h-screen bg-amber-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MedicalDisclaimer />
          <div className={styles.milestonesContainer}>
            <main className={styles.mainContent}>
              <h1 className={styles.pageTitle}>Baby Milestones</h1>
              
              {/* Medals Display */}
              <div className={styles.medalsContainer}>
                {Object.entries(medalDefinitions).map(([, medal]) => (
                  <div 
                    key={medal.id}
                    className={`${styles.medal} ${earnedMedals.includes(medal.id) ? styles.earned : ''} ${justEarnedMedal === medal.id ? styles.justEarned : ''}`}
                    title={`${medal.title}: ${medal.description}`}
                  >
                    <div className={styles.medalIcon} style={{ '--medal-color': medal.color } as React.CSSProperties}>
                      {medal.icon}
                      {earnedMedals.includes(medal.id) && (
                        <div className={styles.medalCheck}>
                          <FaCheck />
                        </div>
                      )}
                    </div>
                    <span className={styles.medalTitle}>{medal.title}</span>
                  </div>
                ))}
              </div>
              
              <div className={styles.categoryTabs}>
                {Object.entries(milestoneCategories).map(([key, category]) => (
                  <button
                    key={key}
                    className={`${styles.categoryTab} ${activeCategory === key ? styles.active : ''}`}
                    onClick={() => setActiveCategory(key)}
                  >
                    {category.title}
                  </button>
                ))}
              </div>

              <div className={styles.milestonesGrid} ref={confettiRef}>
                {milestoneCategories[activeCategory as keyof typeof milestoneCategories].milestones.map((milestone, index) => (
                  <div
                    key={milestone.id}
                    className={`${styles.milestoneCard} ${completedMilestones[milestone.id] ? styles.completed : ''} ${justCompletedId === milestone.id ? styles.justCompleted : ''}`}
                    onClick={() => toggleMilestone(milestone)}
                    style={{ '--i': index + 1 } as React.CSSProperties}
                  >
                    <div className={styles.milestoneHeader}>
                      <h3 className={styles.milestoneTitle}>{milestone.title}</h3>
                      <span className={styles.typicalAge}>Typical age: {milestone.typicalAge}</span>
                    </div>
                    
                    {completedMilestones[milestone.id] && (
                      <div className={styles.completionDetails}>
                        <div className={styles.completionDate}>
                          Achieved: {new Date(completedMilestones[milestone.id].date).toLocaleDateString()}
                        </div>
                        {completedMilestones[milestone.id].note && (
                          <div className={styles.completionNote}>
                            {completedMilestones[milestone.id].note}
                          </div>
                        )}
                        <div className={styles.checkmark}>
                          <FaCheck />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </main>

            {/* Progress Indicator */}
            <div className={styles.progressIndicator}>
              <div 
                className={styles.progressCircle} 
                style={{ '--progress': `${calculateProgress()}%` } as React.CSSProperties}
              >
                <span className={styles.progressText}>{calculateProgress()}%</span>
              </div>
            </div>

            {showMilestoneModal && selectedMilestone && (
              <div className={styles.modal}>
                <div className={styles.modalContent}>
                  <div className={styles.modalHeader}>
                    <h3 className={styles.modalTitle}>Record Milestone</h3>
                    <button className={styles.closeButton} onClick={() => setShowMilestoneModal(false)}>
                      <FaTimes />
                    </button>
                  </div>

                  <div className={styles.modalBody}>
                    <h4 className={styles.milestoneTitle}>{selectedMilestone.title}</h4>
                    <p className={styles.typicalAge}>Typical age: {selectedMilestone.typicalAge}</p>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Date Achieved</label>
                      <input
                        type="date"
                        className={styles.formInput}
                        value={milestoneDate}
                        onChange={(e) => setMilestoneDate(e.target.value)}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Notes</label>
                      <textarea
                        className={styles.formTextarea}
                        value={milestoneNote}
                        onChange={(e) => setMilestoneNote(e.target.value)}
                        placeholder="Add any special notes or memories about this milestone..."
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <button className={styles.photoButton}>
                        <FaCamera /> Add Photo
                      </button>
                    </div>
                    
                    {saveError && (
                      <div className={styles.errorMessage}>
                        {saveError}
                      </div>
                    )}
                  </div>

                  <div className={styles.modalFooter}>
                    <button className={styles.cancelButton} onClick={() => setShowMilestoneModal(false)}>
                      Cancel
                    </button>
                    <button className={styles.saveButton} onClick={saveMilestoneDetails}>
                      <FaTrophy style={{ marginRight: '8px' }} /> Save Milestone
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
} 