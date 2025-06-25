import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourses } from '../../context/CourseContext';
import { useAuth } from '../../context/AuthContext';
import { FiBook, FiAlertCircle } from 'react-icons/fi';
import { FaBookOpen, FaGraduationCap } from 'react-icons/fa';
import CourseCard from '../../components/dashboard/CourseCard';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import EmptyState from '../../components/ui/EmptyState';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { courses, loading, error, refreshCourses } = useCourses();
  const { user } = useAuth();
  
  const enrolledCourses = courses.filter(course => 
    course.students?.some(student => student._id === user?.id || student === user?.id)
  );

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {[...Array(3)].map((_, i) => (
          <Loader key={i} className="h-64" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        icon={<FiAlertCircle size={48} className="text-red-500" />}
        title="Error Loading Courses"
        description={error}
        action={
          <Button
            variant="primary"
            onClick={refreshCourses}
            icon={<FaBookOpen />}
          >
            Try Again
          </Button>
        }
      />
    );
  }

  if (enrolledCourses.length === 0) {
    return (
      <EmptyState
        icon={<FiBook size={48} className="text-blue-500" />}
        title="No Enrolled Courses"
        description="You haven't enrolled in any courses yet. Browse our catalog to get started."
        action={
          <Button
            variant="primary"
            onClick={() => navigate('/courses')}
            icon={<FaGraduationCap />}
          >
            Browse Courses
          </Button>
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {enrolledCourses.map(course => (
        <CourseCard 
          key={course.id}
          course={course}
          onClick={() => navigate(`/courses/${course.id}`)}
        />
      ))}
    </div>
  );
};

export default StudentDashboard;