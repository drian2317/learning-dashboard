import React from 'react';
import Button from '../ui/Button';
import { FaBookOpen } from 'react-icons/fa';

export default function ContinueLearning({ lessonData, onContinue, onBrowseCourses }) {
  if (!lessonData) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaBookOpen className="text-blue-600 text-2xl" />
        </div>
        <h3 className="text-lg font-bold mb-2">No active courses</h3>
        <p className="text-gray-600 mb-4">You haven't enrolled in any courses yet</p>
        <Button 
          variant="primary"
          onClick={onBrowseCourses}
          icon={<FaBookOpen />}
        >
          Browse Courses
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 cursor-pointer" onClick={onContinue}>
      <div className="flex items-start">
        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mr-4" />
        <div className="flex-1">
          <div className="flex justify-between">
            <h3 className="font-bold text-lg">Continue Learning</h3>
            <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
              {lessonData.category}
            </span>
          </div>
          <h2 className="text-xl font-bold mt-2">{lessonData.title}</h2>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            <div 
              className="bg-purple-600 h-2 rounded-full" 
              style={{ width: `${lessonData.progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {lessonData.progress}% complete
          </p>
        </div>
      </div>
    </div>
  );
}