import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { FaUserTie, FaUserGraduate, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import Loader from '../../components/ui/Loader';

const Register = () => {
  const { search } = useLocation();
  const roleParam = new URLSearchParams(search).get('role');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: roleParam || 'student'
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    
    try {
      await register(formData);
      // Navigation is handled in AuthContext after successful registration
    } catch (error) {
      toast.error(error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleRoleChange = (role) => {
    setFormData(prev => ({
      ...prev,
      role
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-1 bg-gradient-to-r from-blue-500 to-purple-600">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-full text-white hover:bg-black/10 transition-colors"
          >
            <FaArrowLeft />
          </button>
        </div>
        
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="mx-auto flex justify-center mb-4">
              {formData.role === 'teacher' ? (
                <div className="bg-purple-100 p-4 rounded-full">
                  <FaUserTie className="h-8 w-8 text-purple-600" />
                </div>
              ) : (
                <div className="bg-blue-100 p-4 rounded-full">
                  <FaUserGraduate className="h-8 w-8 text-blue-600" />
                </div>
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {formData.role === 'teacher' ? 'Teacher Registration' : 'Student Registration'}
            </h2>
          </div>

          {/* Role Selector */}
          <div className="flex justify-center space-x-4 mb-6">
            <button
              type="button"
              onClick={() => handleRoleChange('student')}
              className={`px-4 py-2 rounded-lg flex items-center ${
                formData.role === 'student'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              <FaUserGraduate className="mr-2" />
              Student
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('teacher')}
              className={`px-4 py-2 rounded-lg flex items-center ${
                formData.role === 'teacher'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              <FaUserTie className="mr-2" />
              Teacher
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                placeholder="Your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                placeholder="••••••••"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                placeholder="••••••••"
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                className="w-full justify-center"
                loading={loading}
                disabled={loading}
              >
                {formData.role === 'teacher' ? 'Register as Teacher' : 'Register as Student'}
              </Button>
            </div>

            <div className="text-center text-sm pt-2">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-purple-600 hover:text-purple-500"
              >
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;