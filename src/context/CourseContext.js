import React, { createContext, useState, useEffect, useContext } from 'react';
import { fetchCourses, enrollInCourse } from '../services/courseService';

const CourseContext = createContext();

export const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError(null);
    
      const { courses, message, success } = await fetchCourses();
    
      setCourses(courses);
    
      if (!success) {
        setError(message || 'Failed to load courses');
      } else if (!courses.length) {
        setError(message || 'No courses available');
      }
    
    } catch (err) {
      setError(err.message);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      setLoading(true);
      const updatedCourse = await enrollInCourse(courseId);
      
      if (updatedCourse) {
        await loadCourses(); // Refresh the course list
        return true; // Success
      }
      return false; // Failed
    } catch (err) {
      console.error('Enrollment failed:', err);
      setError(err.message || 'Enrollment failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  return (
    <CourseContext.Provider
      value={{
        courses,
        loading,
        error,
        lastUpdated,
        enrollCourse: handleEnroll,
        refreshCourses: loadCourses
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

export const useCourses = () => {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error('useCourses must be used within a CourseProvider');
  }
  return context;
};