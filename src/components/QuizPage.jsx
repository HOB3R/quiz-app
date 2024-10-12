import React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCw, Heart, SkipForward, Zap, Volume2, VolumeX } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameOverPage from './GameOverPage';

const QuizPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState(location.state?.questions || []);
  const [showResult, setShowResult] = useState(false);
  const [lives, setLives] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [fiftyFiftyAvailable, setFiftyFiftyAvailable] = useState(1);
  const [skipAvailable, setSkipAvailable] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(20);
  const [isMusicPlaying, setIsMusicPlaying] = useState(location.state?.isMusicPlaying || false);

  useEffect(() => {
    if (!location.state?.questions || location.state.questions.length === 0) {
      navigate('/');
    } else {
      setQuestions(location.state.questions);
      setIsLoading(false);
    }
  }, [location.state, navigate]);

  useEffect(() => {
    const audio = new Audio('/quiz.mp3');
    audio.loop = true;

    if (isMusicPlaying) {
      audio.play().catch(error => console.error("Error playing audio:", error));
    }

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [isMusicPlaying]);

  useEffect(() => {
    if (!isLoading && !showResult) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            handleTimeUp();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentQuestion, isLoading, showResult]);

  const handleTimeUp = () => {
    if (lives > 0) {
      setLives(0);
    } else {
      setGameOver(true);
      setShowResult(true);
    }
    setTimeout(goToNextQuestion, 1000);
  };

  const saveScore = (finalScore) => {
    if (finalScore > 0) {
      const newScore = { score: finalScore, date: new Date().toISOString() };
      const storedScores = JSON.parse(localStorage.getItem('quizScores')) || [];
      const updatedScores = [...storedScores, newScore];
      localStorage.setItem('quizScores', JSON.stringify(updatedScores));
      // Trigger a storage event for real-time updates
      window.dispatchEvent(new Event('storage'));
    }
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    const isCorrect = answer === questions[currentQuestion].correctAnswer;

    if (isCorrect) {
      setScore(prevScore => prevScore + 50);
    } else {
      if (lives > 0) {
        setLives(0);
      } else {
        setGameOver(true);
        setShowResult(true);
        saveScore(score);
        return;
      }
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setTimeLeft(20);
      } else {
        saveScore(score + (isCorrect ? 50 : 0));
        setShowResult(true);
      }
    }, 1000);
  };

  const goToNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setTimeLeft(20);
    } else {
      setShowResult(true);
    }
  };

  const handleFiftyFifty = () => {
    if (fiftyFiftyAvailable > 0) {
      const currentAnswers = questions[currentQuestion].answers;
      const correctAnswer = questions[currentQuestion].correctAnswer;
      let wrongAnswers = currentAnswers.filter(answer => answer !== correctAnswer);
      wrongAnswers = wrongAnswers.sort(() => 0.5 - Math.random()).slice(0, 1);
      const newAnswers = [correctAnswer, ...wrongAnswers].sort(() => 0.5 - Math.random());
      setQuestions(prevQuestions => {
        const newQuestions = [...prevQuestions];
        newQuestions[currentQuestion] = {...newQuestions[currentQuestion], answers: newAnswers};
        return newQuestions;
      });
      setFiftyFiftyAvailable(0);
    }
  };

  const handleSkipQuestion = () => {
    if (skipAvailable > 0) {
      goToNextQuestion();
      setSkipAvailable(0);
    }
  };

  const getTimerColor = () => {
    if (timeLeft > 10) return 'rgba(34, 197, 94, 0.6)'; // Grün
    if (timeLeft > 5) return 'rgba(234, 179, 8, 0.6)';  // Gelb
    return 'rgba(239, 68, 68, 0.6)'; // Rot
  };

  const toggleMusic = () => {
    setIsMusicPlaying(!isMusicPlaying);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-pattern flex items-center justify-center">
        <div className="ios-modal p-8 rounded-3xl shadow-xl text-center max-w-md w-full">
          <h2 className="text-3xl font-bold mb-4 text-white ios-text-shadow">Loading...</h2>
        </div>
      </div>
    );
  }

  if (showResult) {
    return (
      <GameOverPage
        score={score}
        totalQuestions={questions.length}
        onPlayAgain={() => window.location.reload()}
      />
    );
  }

  return (
    <>
      <style>
        {`
          .quiz-modal {
            background-color: rgba(17, 24, 39, 0.95);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 0 30px rgba(0, 0, 0, 0.2), inset 0 0 10px rgba(255, 255, 255, 0.05);
            outline: 2px solid rgba(255, 255, 255, 0.1);
            outline-offset: -2px;
          }
          .answer-button {
            background-color: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: all 0.3s ease;
          }
          .answer-button:hover:not(:disabled) {
            background-color: rgba(255, 255, 255, 0.12);
            transform: translateY(-2px);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .answer-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
          .progress-bar {
            transition: width 0.5s ease-in-out;
          }
          .question-badge {
            background-color: rgba(99, 102, 241, 0.2);
            border: 1px solid rgba(99, 102, 241, 0.4);
            padding: 0.5rem 0.75rem;
            border-radius: 0.5rem;
            font-size: 1rem;
            font-weight: bold;
            color: rgba(255, 255, 255, 0.9);
          }
          .score-container, .timer-container {
            background-color: rgba(17, 24, 39, 0.8);
            backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 0 30px rgba(0, 0, 0, 0.2), inset 0 0 10px rgba(255, 255, 255, 0.05);
            outline: 2px solid rgba(255, 255, 255, 0.1);
            outline-offset: -2px;
            border-radius: 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 70px;
            height: 70px;
          }
          .score-value {
            font-size: 1.75rem;
            font-weight: bold;
            color: white;
          }
          .timer {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: conic-gradient(
              ${getTimerColor()} ${(timeLeft / 20) * 360}deg,
              rgba(31, 41, 55, 0.4) ${(timeLeft / 20) * 360}deg
            );
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .timer-inner {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: rgba(17, 24, 39, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 1.5rem;
            font-weight: bold;
            color: white;
          }
          .powerups-container {
            position: absolute;
            bottom: 1.5rem;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 1rem;
            background-color: rgba(17, 24, 39, 0.8);
            border-radius: 1rem;
            padding: 0.75rem 1rem;
            backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
          .powerup-button {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 0.5rem;
            padding: 0.5rem 0.75rem;
            transition: all 0.3s ease;
          }
          .powerup-button:hover:not(:disabled) {
            background-color: rgba(255, 255, 255, 0.12);
            transform: translateY(-2px);
          }
          .powerup-icon {
            font-size: 1.25rem;
            margin-right: 0.5rem;
          }
          .powerup-count {
            font-size: 0.875rem;
            font-weight: bold;
            color: white;
            background-color: rgba(79, 70, 229, 0.6);
            border-radius: 0.25rem;
            padding: 0.125rem 0.25rem;
            min-width: 1.5rem;
            text-align: center;
          }
          .powerup-tooltip {
            position: absolute;
            bottom: -30px;
            left: 50%;
            transform: translateX(-50%);
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 0.25rem 0.5rem;
            border-radius: 0.25rem;
            font-size: 0.75rem;
            white-space: nowrap;
            opacity: 0;
            transition: opacity 0.3s ease, bottom 0.3s ease;
            pointer-events: none;
          }
          .powerup-button:hover .powerup-tooltip {
            opacity: 1;
            bottom: -25px;
          }
          .nav-button {
            background-color: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 0.5rem;
            padding: 0.5rem;
            transition: all 0.3s ease;
          }
          .nav-button:hover {
            background-color: rgba(255, 255, 255, 0.2);
            transform: translateY(-2px);
          }
          .music-toggle {
            position: fixed;
            bottom: 1rem;
            right: 1rem;
            background-color: rgba(17, 24, 39, 0.8);
            backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 0 30px rgba(0, 0, 0, 0.2), inset 0 0 10px rgba(255, 255, 255, 0.05);
            outline: 2px solid rgba(255, 255, 255, 0.1);
            outline-offset: -2px;
            border-radius: 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 70px;
            height: 70px;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .music-toggle:hover {
            transform: scale(1.05);
          }

          .music-icon {
            font-size: 1.75rem;
            color: white;
          }
        `}
      </style>
      <div className="min-h-screen w-full bg-pattern flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="score-container fixed top-4 left-4 z-50">
          <span className="score-value">{score}</span>
        </div>
        <div className="timer-container fixed top-4 right-4 z-50">
          <div className="timer">
            <div className="timer-inner">{timeLeft}</div>
          </div>
        </div>
        <div className="w-full max-w-3xl quiz-modal rounded-3xl shadow-xl p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent opacity-5 pointer-events-none"></div>

          <header className="flex justify-between items-center mb-8">
            <button className="nav-button" onClick={() => navigate('/')}>
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <div className="question-badge">
              Question {currentQuestion + 1}
            </div>
            <button className="nav-button" onClick={() => window.location.reload()}>
              <RefreshCw className="w-6 h-6 text-white" />
            </button>
          </header>

          {questions.length > 0 && (
            <div className="mb-24">
              <div className="flex space-x-1 mb-10">
                {[...Array(questions.length)].map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 flex-grow rounded-full progress-bar ${
                      index <= currentQuestion ? 'bg-indigo-500' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold mb-12 mt-8 text-center text-white leading-relaxed">
                {questions[currentQuestion].question}
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                {questions[currentQuestion].answers.map((answer, index) => (
                  <button
                    key={index}
                    className={`p-4 rounded-xl text-left ${
                      selectedAnswer
                        ? selectedAnswer === answer
                          ? answer === questions[currentQuestion].correctAnswer
                            ? 'bg-green-600 text-white'
                            : 'bg-red-600 text-white'
                          : 'bg-gray-800 text-gray-400 cursor-not-allowed'
                        : 'bg-white bg-opacity-10 text-white hover:bg-opacity-20'
                    } transition-all duration-300 shadow-md text-base sm:text-lg`}
                    onClick={() => handleAnswerSelect(answer)}
                    disabled={selectedAnswer !== null}
                  >
                    <span className={`font-bold mr-2 ${selectedAnswer && selectedAnswer !== answer ? 'text-gray-600' : 'text-indigo-300'}`}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    {answer}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="powerups-container">
            <button
              onClick={handleFiftyFifty}
              className={`powerup-button ${fiftyFiftyAvailable === 0 ? 'opacity-50' : ''}`}
              disabled={fiftyFiftyAvailable === 0}
            >
              <Zap className="powerup-icon text-yellow-300" />
              <span className="powerup-count">{fiftyFiftyAvailable}</span>
              <span className="powerup-tooltip">50/50</span>
            </button>
            <button
              onClick={handleSkipQuestion}
              className={`powerup-button ${skipAvailable === 0 ? 'opacity-50' : ''}`}
              disabled={skipAvailable === 0}
            >
              <SkipForward className="powerup-icon text-blue-300" />
              <span className="powerup-count">{skipAvailable}</span>
              <span className="powerup-tooltip">Skip</span>
            </button>
            <div className="powerup-button">
              <Heart className={`powerup-icon ${lives > 0 ? 'text-red-300' : 'text-gray-400'}`} />
              <span className="powerup-count">{lives}</span>
              <span className="powerup-tooltip">Lives</span>
            </div>
          </div>
        </div>

        <button onClick={toggleMusic} className="music-toggle">
          {isMusicPlaying ? (
            <Volume2 className="music-icon" />
          ) : (
            <VolumeX className="music-icon" />
          )}
        </button>
      </div>
    </>
  );
};

export default QuizPage;
