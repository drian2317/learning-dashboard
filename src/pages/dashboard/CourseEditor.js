import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourses } from '../../context/CourseContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { FaSave, FaYoutube, FaUpload, FaTrash } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const CourseEditor = () => {
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    phases: {
      introduction: { content: '' },
      lesson1: { 
        content: '',
        videoUrl: '',
        activity: { 
          description: '',
          maxScore: 30,
          passingScore: 22.5
        }
      },
      midterm: {
        content: '',
        maxScore: 100,
        passingScore: 75
      },
      lesson2: {
        content: '',
        videoUrl: '',
        activity: {
          description: '',
          maxScore: 30,
          passingScore: 22.5
        }
      },
      final: {
        content: '',
        maxScore: 100,
        passingScore: 75
      }
    }
  });

  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState([]);
  const { createCourse } = useCourses();
  const navigate = useNavigate();

  const handleChange = (phase, field, value) => {
    setCourseData(prev => ({
      ...prev,
      phases: {
        ...prev.phases,
        [phase]: {
          ...prev.phases[phase],
          [field]: value
        }
      }
    }));
  };

  const handleActivityChange = (phase, field, value) => {
    setCourseData(prev => ({
      ...prev,
      phases: {
        ...prev.phases,
        [phase]: {
          ...prev.phases[phase],
          activity: {
            ...prev.phases[phase].activity,
            [field]: value
          }
        }
      }
    }));
  };

  const handleFileUpload = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    setUploading(true);
    
    try {
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 1500));
      setFiles(prev => [...prev, ...selectedFiles]);
      toast.success(`${selectedFiles.length} files uploaded successfully!`);
    } catch (error) {
      toast.error('File upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      const courseWithFiles = {
        ...courseData,
        attachments: files
      };
      await createCourse(courseWithFiles);
      toast.success('Course created successfully!');
      navigate('/teacher');
    } catch (error) {
      toast.error('Failed to create course');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Basic Course Info */}
      <div className="mb-8">
        <Input
          label="Course Title"
          value={courseData.title}
          onChange={(e) => setCourseData({...courseData, title: e.target.value})}
          required
        />
        <textarea
          className="w-full mt-4 p-3 border rounded-lg"
          placeholder="Course Description"
          value={courseData.description}
          onChange={(e) => setCourseData({...courseData, description: e.target.value})}
          rows={4}
        />
      </div>

      {/* File Upload Section */}
      <div className="mb-8 p-4 border rounded-lg">
        <h3 className="text-xl font-bold mb-4">Course Materials</h3>
        <div className="flex items-center">
          <label className="cursor-pointer">
            <Button 
              variant="outline" 
              icon={<FaUpload />}
              loading={uploading}
              className="mr-4"
            >
              Select Files
              <input 
                type="file" 
                className="hidden" 
                onChange={handleFileUpload}
                multiple
              />
            </Button>
          </label>
          <span className="text-sm text-gray-500">
            {files.length > 0 ? `${files.length} files ready` : 'No files selected'}
          </span>
        </div>
        
        {files.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">Uploaded Files:</h4>
            <ul className="space-y-2">
              {files.map((file, index) => (
                <li key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex-1 truncate">
                    <span className="font-medium">{file.name}</span>
                    <span className="text-gray-500 ml-2 text-sm">
                      ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    icon={<FaTrash />}
                    onClick={() => removeFile(index)}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Phase 1: Introduction */}
      <div className="mb-8 p-4 border rounded-lg">
        <h3 className="text-xl font-bold mb-4">Phase 1: Introduction</h3>
        <textarea
          className="w-full p-3 border rounded-lg"
          placeholder="Introduction content..."
          value={courseData.phases.introduction.content}
          onChange={(e) => handleChange('introduction', 'content', e.target.value)}
          rows={6}
        />
      </div>

      {/* Phase 2: Lesson 1 */}
      <div className="mb-8 p-4 border rounded-lg">
        <h3 className="text-xl font-bold mb-4">Phase 2: Lesson 1</h3>
        <textarea
          className="w-full p-3 border rounded-lg mb-4"
          placeholder="Lesson content..."
          value={courseData.phases.lesson1.content}
          onChange={(e) => handleChange('lesson1', 'content', e.target.value)}
          rows={6}
        />
        
        <div className="mb-4">
          <label className="block font-medium mb-2">YouTube Video URL</label>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-md bg-gray-200">
              <FaYoutube className="text-red-600" />
            </span>
            <input
              type="url"
              className="flex-1 p-2 border rounded-r-lg"
              placeholder="https://www.youtube.com/watch?v=..."
              value={courseData.phases.lesson1.videoUrl}
              onChange={(e) => handleChange('lesson1', 'videoUrl', e.target.value)}
            />
          </div>
        </div>

        <div className="mt-4">
          <h4 className="font-bold mb-2">Activity</h4>
          <textarea
            className="w-full p-3 border rounded-lg"
            placeholder="Activity description..."
            value={courseData.phases.lesson1.activity.description}
            onChange={(e) => handleActivityChange('lesson1', 'description', e.target.value)}
            rows={4}
          />
          <div className="mt-2 text-sm text-gray-600">
            Activity score: 30 points (75% required to pass)
          </div>
        </div>
      </div>

      {/* Phase 3: Midterm Exam */}
      <div className="mb-8 p-4 border rounded-lg">
        <h3 className="text-xl font-bold mb-4">Phase 3: Quiz 1</h3>
        <textarea
          className="w-full p-3 border rounded-lg"
          placeholder="Midterm exam content..."
          value={courseData.phases.midterm.content}
          onChange={(e) => handleChange('midterm', 'content', e.target.value)}
          rows={6}
        />
        <div className="mt-2 text-sm text-gray-600">
          Exam score: 100 points (75 required to pass)
        </div>
      </div>

      {/* Phase 4: Lesson 2 */}
      <div className="mb-8 p-4 border rounded-lg">
        <h3 className="text-xl font-bold mb-4">Phase 4: Lesson 2</h3>
        <textarea
          className="w-full p-3 border rounded-lg mb-4"
          placeholder="Lesson content..."
          value={courseData.phases.lesson2.content}
          onChange={(e) => handleChange('lesson2', 'content', e.target.value)}
          rows={6}
        />
  
        <div className="mb-4">
          <label className="block font-medium mb-2">YouTube Video URL</label>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-md bg-gray-200">
              <FaYoutube className="text-red-600" />
            </span>
            <input
              type="url"
              className="flex-1 p-2 border rounded-r-lg"
              placeholder="https://www.youtube.com/watch?v=..."
              value={courseData.phases.lesson2.videoUrl}
              onChange={(e) => handleChange('lesson2', 'videoUrl', e.target.value)}
            />
          </div>
        </div>

        <div className="mt-4">
          <h4 className="font-bold mb-2">Activity</h4>
          <textarea
            className="w-full p-3 border rounded-lg"
            placeholder="Activity description..."
            value={courseData.phases.lesson2.activity.description}
            onChange={(e) => handleActivityChange('lesson2', 'description', e.target.value)}
            rows={4}
          />
          <div className="mt-2 text-sm text-gray-600">
            Activity score: 30 points (75% required to pass)
          </div>
        </div>
      </div>

      {/* Phase 5: Final Exam */}
      <div className="mb-8 p-4 border rounded-lg">
        <h3 className="text-xl font-bold mb-4">Phase 5: Quiz 2</h3>
        <textarea
          className="w-full p-3 border rounded-lg"
          placeholder="Final exam content..."
          value={courseData.phases.final.content}
          onChange={(e) => handleChange('final', 'content', e.target.value)}
          rows={6}
        />
        <div className="mt-2 text-sm text-gray-600">
          Exam score: 100 points (75 required to pass)
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end mt-8">
        <Button 
          variant="primary" 
          size="lg"
          onClick={handleSubmit}
          icon={<FaSave />}
          disabled={uploading}
        >
          Save Course
        </Button>
      </div>
    </div>
  );
};

export default CourseEditor;