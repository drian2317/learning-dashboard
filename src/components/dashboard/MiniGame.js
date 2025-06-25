import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import Button from '../ui/Button';

const MiniGame = ({ onEarnPoints, onClose }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [gameStatus, setGameStatus] = useState('playing'); // playing, ended

  // Sample questions
  const sampleQuestions = [
    {
      question: "What does HTML stand for?",
      options: [
        "Hyper Text Markup Language",
        "Hyperlinks and Text Markup Language",
        "Home Tool Markup Language",
        "Hyper Transfer Markup Language"
      ],
      correct: 0
    },
    {
      question: "Which language runs in a web browser?",
      options: ["Java", "C", "Python", "JavaScript"],
      correct: 3
    },
    {
      question: "What does CSS stand for?",
      options: [
        "Computer Style Sheets",
        "Creative Style System",
        "Cascading Style Sheets",
        "Colorful Style Sheets"
      ],
      correct: 2
    },
    {
      question: "Which is not a JavaScript framework?",
      options: ["React", "Angular", "Vue", "Django"],
      correct: 3
    },
    {
      question: "What is the correct syntax for referring to an external script?",
      options: [
        '<script src="script.js">',
        '<script href="script.js">',
        '<script name="script.js">',
        '<script file="script.js">'
      ],
      correct: 0
    }
  ];

  useEffect(() => {
    // Initialize game
    setQuestions(sampleQuestions.sort(() => Math.random() - 0.5).slice(0, 10));
    setCurrentQuestion(0);
    
    // Set up timer
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameStatus('ended');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const handleAnswer = (index) => {
    if (gameStatus !== 'playing') return;
    
    setSelectedAnswer(index);
    
    // Check if correct
    if (index === questions[currentQuestion].correct) {
      setScore(prev => prev + 10);
    }
    
    // Move to next question after delay
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        setGameStatus('ended');
      }
    }, 1000);
  };

  const handleClaimPoints = () => {
    onEarnPoints(score);
    onClose();
  };

  return (
    <div className="bg-gray-800 text-white rounded-xl p-6 w-full max-w-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Sniper Scholar</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <FaTimes size={24} />
        </button>
      </div>
      
      <div className="flex justify-between mb-4">
        <div className="text-xl">
          Score: <span className="font-bold text-yellow-400">{score}</span>
        </div>
        <div className="text-xl">
          Time: <span className="font-bold">{timeLeft}s</span>
        </div>
      </div>
      
      {gameStatus === 'playing' && questions.length > 0 && (
        <div>
          <div className="bg-gray-700 rounded-lg p-4 mb-6">
            <h3 className="text-xl font-bold mb-4">
              {questions[currentQuestion].question}
            </h3>
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedAnswer === index
                      ? index === questions[currentQuestion].correct
                        ? 'bg-green-600'
                        : 'bg-red-600'
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                  onClick={() => handleAnswer(index)}
                  disabled={selectedAnswer !== null}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          
          <div className="text-center text-gray-400">
            Question {currentQuestion + 1} of {questions.length}
          </div>
        </div>
      )}
      
      {gameStatus === 'ended' && (
        <div className="text-center py-8">
          <div className="text-6xl mb-6">🎯</div>
          <h3 className="text-2xl font-bold mb-2">Game Over!</h3>
          <p className="text-xl mb-6">Your final score: <span className="text-yellow-400">{score}</span></p>
          <p className="mb-6">
            You earned <span className="font-bold text-yellow-400">{score} points</span>!
            These will be added to your course total.
          </p>
          <Button 
            variant="primary" 
            size="lg"
            className="w-full"
            onClick={handleClaimPoints}
          >
            Claim {score} Points
          </Button>
        </div>
      )}
    </div>
  );
};

export default MiniGame;