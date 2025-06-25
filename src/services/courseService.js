import API from './api';

/**
 * Fetch all courses from API
 * @returns {Promise<Array>} Array of course objects (empty array if no courses)
 */
export const fetchCourses = async () => {
  try {
    const response = await API.get('/courses');
    
    // Handle cases where response structure is unexpected
    if (!response.data || typeof response.data !== 'object') {
      console.warn('Unexpected API response structure');
      return [];
    }

    // Handle successful response with no courses
    if (response.data.success && (!response.data.data || response.data.data.length === 0)) {
      console.log('No courses available');
      return [];
    }

    // Normalize data structure
    const coursesData = Array.isArray(response.data.data) 
      ? response.data.data
      : [response.data.data].filter(Boolean);

    return coursesData.map(course => ({
      ...course,
      id: course._id || course.id, // Standardize ID field
      progress: course.progress || 0, // Default progress
      students: course.students || [], // Ensure students array exists
      materials: course.materials || [] // Ensure materials array exists
    }));
    
  } catch (err) {
    console.error('[courseService] Error:', err);
    // Return empty array instead of throwing error
    return [];
  }
};

/**
 * Enroll current user in a course
 * @param {string} courseId - ID of course to enroll in
 * @returns {Promise<Object>} Updated course data or null on failure
 */
export const enrollInCourse = async (courseId) => {
  try {
    const response = await API.post(`/courses/${courseId}/enroll`);
    return response.data?.data || null;
  } catch (err) {
    console.error('[courseService] Enrollment Error:', err);
    return null;
  }
};

/**
 * Update course progress for current user
 * @param {string} courseId - ID of course
 * @param {number} progress - Progress percentage (0-100)
 * @returns {Promise<Object>} Updated course data or null on failure
 */
export const updateProgress = async (courseId, progress) => {
  try {
    const response = await API.patch(`/courses/${courseId}/progress`, { progress });
    return response.data?.data || null;
  } catch (err) {
    console.error('[courseService] Progress Error:', err);
    return null;
  }
};