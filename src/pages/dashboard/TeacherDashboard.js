import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourses } from '../../context/CourseContext';
import { useAuth } from '../../context/AuthContext';
import { FiBook, FiAlertCircle, FiPlus } from 'react-icons/fi';
import CourseCard from '../../components/dashboard/CourseCard';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import EmptyState from '../../components/ui/EmptyState';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { courses, loading, error, refreshCourses } = useCourses();
  const { user } = useAuth();
  const teacherCourses = courses.filter(course => course.instructorId === user?.id);

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
        title="Error Loading Your Courses"
        description={error}
        action={
          <Button
            variant="primary"
            onClick={refreshCourses}
          >
            Refresh Courses
          </Button>
        }
      />
    );
  }

  if (teacherCourses.length === 0) {
    return (
      <EmptyState
        icon={<FiBook size={48} className="text-purple-500" />}
        title="No Courses Created"
        description="You haven't created any courses yet. Get started by creating your first course."
        action={
          <Button
            variant="primary"
            onClick={() => navigate('/courses/create')}
            icon={<FiPlus />}
          >
            Create First Course
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          variant="primary"
          onClick={() => navigate('/courses/create')}
          icon={<FiPlus />}
        >
          New Course
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teacherCourses.map(course => (
          <CourseCard 
            key={course.id}
            course={course}
            isTeacherView={true}
            onEdit={() => navigate(`/courses/${course.id}/edit`)}
          />
        ))}
      </div>
    </div>
  );
};

export default TeacherDashboard;