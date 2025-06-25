import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaArrowRight, 
  FaRobot, 
  FaChartLine, 
  FaGlobe, 
  FaUserAstronaut,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaLightbulb
} from 'react-icons/fa';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/ui/Loader';

const Landing = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const letters = ['P', 'L', 'E', 'G'];

  const features = [
    {
      icon: <FaRobot className="text-3xl text-blue-400" />,
      title: "AI-Powered",
      description: "Smart algorithms adapt to your learning style"
    },
    {
      icon: <FaChartLine className="text-3xl text-purple-400" />,
      title: "Progress Tracking",
      description: "Real-time analytics for measurable growth"
    },
    {
      icon: <FaGlobe className="text-3xl text-green-400" />,
      title: "Global Community",
      description: "Connect with learners worldwide"
    },
    {
      icon: <FaUserAstronaut className="text-3xl text-orange-400" />,
      title: "Personalized Paths",
      description: "Customized learning journeys for everyone"
    }
  ];

  // Redirect if already logged in
  React.useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden opacity-20">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-blue-500 rounded-full"
            style={{
              width: Math.random() * 300 + 100,
              height: Math.random() * 300 + 100,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, (Math.random() - 0.5) * 100],
              y: [0, (Math.random() - 0.5) * 100],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Futuristic Header */}
        <header className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center space-x-2 sm:space-x-4 mb-8"
          >
            {letters.map((letter, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  delay: index * 0.1,
                  type: 'spring',
                  stiffness: 100
                }}
                className="bg-gradient-to-br from-blue-500 to-purple-600 w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-lg shadow-lg border border-blue-300"
              >
                <span className="text-3xl sm:text-4xl font-bold">{letter}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-4xl sm:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
          >
            The Future of Learning
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto mb-10"
          >
            An immersive platform blending AI, neuroscience, and gamification to revolutionize education
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link to="/login" className="group">
              <Button 
                size="xl" 
                variant="primary"
                className="group w-full sm:w-auto"
              >
                <FaUserGraduate className="mr-2 group-hover:animate-bounce" />
                Existing User Login
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            
            <Link to="/register" className="group">
              <Button 
                size="xl" 
                variant="secondary"
                className="group w-full sm:w-auto"
              >
                <FaUserGraduate className="mr-2 group-hover:animate-bounce" />
                Register as Student
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </header>

        {/* Features Grid */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -10 }}
              className="bg-gray-800 bg-opacity-60 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-blue-400 transition-all"
            >
              <div className="bg-gray-900 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-center mb-2">{feature.title}</h3>
              <p className="text-gray-300 text-center">{feature.description}</p>
            </motion.div>
          ))}
        </motion.section>

        {/* Teacher CTA Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-2xl p-8 mb-16"
        >
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/4 flex justify-center mb-6 md:mb-0">
                <div className="bg-purple-100 w-24 h-24 rounded-full flex items-center justify-center">
                  <FaChalkboardTeacher className="text-4xl text-purple-600" />
                </div>
              </div>
              <div className="md:w-3/4 text-center md:text-left">
                <h2 className="text-3xl font-bold mb-4">Are you an educator?</h2>
                <p className="text-xl mb-6">
                  Join our platform to create engaging courses, track student progress, 
                  and revolutionize your teaching approach with AI-powered tools.
                </p>
                <Link to="/register?role=teacher">
                  <Button 
                    variant="white"
                    size="lg"
                    className="group"
                  >
                    <FaLightbulb className="mr-2 text-yellow-500 group-hover:animate-pulse" />
                    Register as Teacher
                    <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Final CTA */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Learning?</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
            Join thousands of pioneers experiencing education reimagined
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register">
              <Button size="xl" variant="primary" className="group">
                <FaUserGraduate className="mr-2" />
                Get Started Now
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="xl" variant="outline">
                Existing User Login
              </Button>
            </Link>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default Landing;