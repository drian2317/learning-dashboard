import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCourses } from '../../context/CourseContext';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import { FaArrowRight, FaArrowLeft, FaCheck, FaGamepad, FaBook, FaChartLine } from 'react-icons/fa';
import MiniGame from '../../components/dashboard/MiniGame';
import Loader from '../../components/ui/Loader';
import CourseVideoPlayer from '../../components/course/CourseVideoPlayer';
import { toast } from 'react-hot-toast';

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { getCourseById } = useCourses();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [scores, setScores] = useState({
    lesson1Activity: 0,
    midterm: 0,
    lesson2Activity: 0,
    final: 0,
    gamePoints: 0
  });
  const [completedPhases, setCompletedPhases] = useState([]);
  const [showGameModal, setShowGameModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const courseData = getCourseById(courseId);
        if (!courseData) throw new Error('Course not found');
        setCourse(courseData);
        
        const savedProgress = JSON.parse(localStorage.getItem(`courseProgress_${courseId}_${user.id}`)) || {};
        setScores(savedProgress.scores || {
          lesson1Activity: 0,
          midterm: 0,
          lesson2Activity: 0,
          final: 0,
          gamePoints: 0
        });
        setCompletedPhases(savedProgress.completedPhases || []);
      } catch (error) {
        console.error('Error loading course:', error);
        navigate('/student/courses', { state: { error: error.message } });
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourse();
  }, [courseId, getCourseById, navigate, user.id]);

  const saveProgress = () => {
    localStorage.setItem(
      `courseProgress_${courseId}_${user.id}`,
      JSON.stringify({ scores, completedPhases })
    );
  };

  const handleScoreChange = (phase, value) => {
    const newScores = { ...scores, [phase]: value };
    setScores(newScores);
    saveProgress();
  };

  const completePhase = () => {
    if (!completedPhases.includes(currentPhase)) {
      const newCompletedPhases = [...completedPhases, currentPhase];
      setCompletedPhases(newCompletedPhases);
      saveProgress();
    }
    
    if (currentPhase < 4) {
      setCurrentPhase(currentPhase + 1);
    } else {
      toast.success('Congratulations! You completed the course!');
    }
  };

  const isPhasePassed = (phaseIndex) => {
    if (completedPhases.includes(phaseIndex)) return true;
    
    switch(phaseIndex) {
      case 1: // Lesson 1 Activity
        return scores.lesson1Activity >= 22.5;
      case 2: // Midterm
        return (scores.midterm + scores.gamePoints) >= 75;
      case 3: // Lesson 2 Activity
        return scores.lesson2Activity >= 22.5;
      case 4: // Final
        return (scores.final + scores.gamePoints) >= 75;
      default:
        return true; // Introduction is always passed
    }
  };

  const addGamePoints = (points) => {
    setScores(prev => ({ ...prev, gamePoints: prev.gamePoints + points }));
    setShowGameModal(false);
    saveProgress();
  };

  if (loading || !course) {
    return <div className="flex justify-center p-8"><Loader /></div>;
  }

  const phases = [
    { 
      id: 0,
      title: "Introduction",
      content: course.phases?.introduction?.content || '',
      type: "content"
    },
    { 
      id: 1,
      title: "Lesson 1", 
      content: course.phases?.lesson1?.content || '',
      videoUrl: course.phases?.lesson1?.videoUrl || '',
      activity: course.phases?.lesson1?.activity || { 
        description: '', 
        maxScore: 30, 
        passingScore: 22.5 
      },
      type: "lesson"
    },
    { 
      id: 2,
      title: "Quiz 1", 
      content: course.phases?.midterm?.content || '',
      maxScore: 100,
      passingScore: 75,
      type: "exam"
    },
    { 
      id: 3,
      title: "Lesson 2", 
      content: course.phases?.lesson2?.content || '',
      videoUrl: course.phases?.lesson2?.videoUrl || '',
      activity: course.phases?.lesson2?.activity || { 
        description: '', 
        maxScore: 30, 
        passingScore: 22.5 
      },
      type: "lesson"
    },
    { 
      id: 4,
      title: "Quiz 2", 
      content: course.phases?.final?.content || '',
      maxScore: 100,
      passingScore: 75,
      type: "exam"
    }
  ];

  const currentPhaseData = phases[currentPhase];
  const phasePassed = isPhasePassed(currentPhase);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
          <p className="text-gray-600">{course.description}</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
            Progress: {completedPhases.length}/{phases.length}
          </span>
          <Button 
            variant="secondary" 
            onClick={() => navigate('/student/courses')}
            className="whitespace-nowrap"
          >
            Back to Courses
          </Button>
        </div>
      </div>

      {/* Phase Navigation */}
      <div className="flex overflow-x-auto pb-2 mb-8 gap-1">
        {phases.map((phase, index) => (
          <button
            key={phase.id}
            onClick={() => setCurrentPhase(index)}
            className={`flex flex-col items-center px-4 py-2 rounded-lg transition-colors ${
              currentPhase === index 
                ? 'bg-blue-100 text-blue-800' 
                : isPhasePassed(index) 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <span className="font-medium">{phase.title}</span>
            <span className="text-xs mt-1">
              {isPhasePassed(index) ? 'Completed' : `${index + 1}/${phases.length}`}
            </span>
          </button>
        ))}
      </div>

      {/* Current Phase Content */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            {currentPhaseData.type === 'lesson' && <FaBook className="text-blue-500" />}
            {currentPhaseData.type === 'exam' && <FaChartLine className="text-purple-500" />}
            {currentPhaseData.title}
            {completedPhases.includes(currentPhase) && (
              <span className="ml-2 text-green-500 text-sm">✓ Completed</span>
            )}
          </h2>
          {currentPhase > 0 && (
            <div className="text-sm text-gray-500">
              Passing: {currentPhaseData.passingScore || 0} points
            </div>
          )}
        </div>

        {/* Phase Content */}
        <div className="prose max-w-none mb-8">
          {currentPhaseData.content.split('\n').map((paragraph, i) => (
            <p key={i} className="mb-4">{paragraph}</p>
          ))}
        </div>

        {/* Video Player */}
        {currentPhaseData.videoUrl && (
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-3">Lesson Video</h3>
            <CourseVideoPlayer 
              youtubeUrl={currentPhaseData.videoUrl}
              className="mb-4 border border-gray-200"
            />
          </div>
        )}

        {/* Activity Section */}
        {currentPhaseData.type === 'lesson' && (
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-3">Activity</h3>
            <div className="prose max-w-none mb-4">
              {currentPhaseData.activity.description.split('\n').map((paragraph, i) => (
                <p key={i} className="mb-4">{paragraph}</p>
              ))}
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <label className="block font-medium mb-2">
                Your Score: 
                <span className="ml-2 font-bold">
                  {scores[`lesson${currentPhase === 1 ? '1' : '2'}Activity`]}/
                  {currentPhaseData.activity.maxScore}
                </span>
              </label>
              <input
                type="range"
                min="0"
                max={currentPhaseData.activity.maxScore}
                value={scores[`lesson${currentPhase === 1 ? '1' : '2'}Activity`]}
                onChange={(e) => handleScoreChange(
                  `lesson${currentPhase === 1 ? '1' : '2'}Activity`,
                  parseInt(e.target.value)
                )}
                className="w-full mb-2"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>0</span>
                <span>Pass: {currentPhaseData.activity.passingScore}</span>
                <span>{currentPhaseData.activity.maxScore}</span>
              </div>
            </div>
          </div>
        )}

        {/* Exam Section */}
        {currentPhaseData.type === 'exam' && (
          <div className="mb-8">
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <label className="block font-medium mb-2">
                Your Score: 
                <span className="ml-2 font-bold">
                  {scores[currentPhase === 2 ? 'midterm' : 'final']}/
                  {currentPhaseData.maxScore}
                </span>
                {scores.gamePoints > 0 && (
                  <span className="ml-2 text-green-600">
                    (+{scores.gamePoints} bonus)
                  </span>
                )}
              </label>
              <input
                type="range"
                min="0"
                max={currentPhaseData.maxScore}
                value={scores[currentPhase === 2 ? 'midterm' : 'final']}
                onChange={(e) => handleScoreChange(
                  currentPhase === 2 ? 'midterm' : 'final',
                  parseInt(e.target.value)
                )}
                className="w-full mb-2"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>0</span>
                <span>Pass: {currentPhaseData.passingScore}</span>
                <span>{currentPhaseData.maxScore}</span>
              </div>

              {scores[currentPhase === 2 ? 'midterm' : 'final'] < currentPhaseData.passingScore && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex-1">
                      <h4 className="font-bold text-yellow-700">Need help passing?</h4>
                      <p className="text-sm">
                        Earn bonus points by completing our learning games!
                      </p>
                    </div>
                    <Button 
                      variant="primary" 
                      onClick={() => setShowGameModal(true)}
                      icon={<FaGamepad />}
                      className="whitespace-nowrap"
                    >
                      Earn Bonus Points
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t border-gray-200">
          {currentPhase > 0 && (
            <Button 
              variant="secondary" 
              onClick={() => setCurrentPhase(currentPhase - 1)}
              icon={<FaArrowLeft />}
              className="w-full sm:w-auto"
            >
              Previous
            </Button>
          )}
          
          <div className="flex-1" />
          
          <Button 
            variant="primary" 
            onClick={completePhase}
            icon={<FaArrowRight />}
            iconPosition="right"
            disabled={!phasePassed && currentPhase > 0}
            className="w-full sm:w-auto"
          >
            {currentPhase === phases.length - 1 ? 'Complete Course' : 'Continue'}
          </Button>
        </div>
      </div>

      {/* MiniGame Modal */}
      {showGameModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <MiniGame 
              onEarnPoints={addGamePoints} 
              onClose={() => setShowGameModal(false)} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;