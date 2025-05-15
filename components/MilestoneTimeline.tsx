import { pregnancyMilestones } from '@/lib/milestoneData';

interface MilestoneTimelineProps {
  currentWeek: number;
}

export default function MilestoneTimeline({ currentWeek }: MilestoneTimelineProps) {
  // Sort milestones by week
  const sortedMilestones = [...pregnancyMilestones].sort((a, b) => a.week - b.week);
  
  return (
    <div className="py-2">
      <div className="relative">
        {/* Timeline track */}
        <div className="absolute top-5 left-5 h-full w-0.5 bg-amber-200" style={{ height: `calc(100% - 3rem)` }}></div>
        
        {/* Timeline items */}
        <div className="space-y-8">
          {sortedMilestones.map((milestone, index) => {
            const isPast = currentWeek >= milestone.week;
            const isCurrent = currentWeek === milestone.week;
            
            return (
              <div key={index} className="relative flex items-start group">
                {/* Milestone marker */}
                <div 
                  className={`flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0 z-10 ${
                    isCurrent 
                      ? 'bg-red-600 shadow-lg animate-pulse' 
                      : isPast 
                        ? 'bg-amber-600' 
                        : 'bg-gray-200'
                  }`}
                >
                  <span className="text-xs font-bold text-white">{milestone.week}</span>
                </div>
                
                {/* Milestone content */}
                <div className="min-w-0 flex-1 ml-4">
                  <div 
                    className={`text-sm font-semibold ${
                      isCurrent ? 'text-red-700' : isPast ? 'text-amber-800' : 'text-gray-600'
                    }`}
                  >
                    Week {milestone.week}: {milestone.title}
                  </div>
                  <div className="mt-1 text-sm text-gray-600">
                    {milestone.description}
                  </div>
                  
                  {/* Status indicator */}
                  <div className="mt-1 text-xs">
                    {isCurrent ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Current Week
                      </span>
                    ) : isPast ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Completed
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Coming Up
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 