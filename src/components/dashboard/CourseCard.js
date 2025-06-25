import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserGraduate, FaStar, FaEdit, FaTrash, FaUpload } from 'react-icons/fa';
import Button from '../ui/Button';

const CourseCard = ({ course, onEdit, onDelete, isTeacherView = false, onClick }) => {
  const navigate = useNavigate();

  return (
    <div
      className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full flex flex-col cursor-pointer"
      onClick={onClick}
    >
      <div className="bg-gray-200 border-2 border-dashed w-full h-48" />

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg">{course.title}</h3>
          <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
            {course.category}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
          {course.description}
        </p>

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <FaUserGraduate className="mr-1" />
            <span>{course.students?.length || 0} students</span>
          </div>
          <div className="flex items-center text-sm text-yellow-600">
            <FaStar className="mr-1" />
            <span>{course.rating}</span>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-purple-600 h-2 rounded-full"
            style={{ width: `${course.progress || 0}%` }}
          ></div>
        </div>

        {isTeacherView && (
          <div className="grid grid-cols-3 gap-2 mt-auto">
            <Button
              onClick={onEdit}
              variant="outline"
              size="sm"
              icon={<FaEdit />}
              className="truncate"
            >
              Edit
            </Button>
            <Button
              onClick={() => navigate(`/teacher/courses/${course.id}/uploads`)}
              variant="secondary"
              size="sm"
              icon={<FaUpload />}
              className="truncate"
            >
              Upload
            </Button>
            <Button
              onClick={onDelete}
              variant="danger"
              size="sm"
              icon={<FaTrash />}
              className="truncate"
            >
              Delete
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
