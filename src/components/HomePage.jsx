import { useNavigate } from 'react-router-dom';
import { Zap, SkipForward, Heart, HelpCircle, Clock, Trophy, Volume2, VolumeX, Award } from 'lucide-react';
import PropTypes from 'prop-types';
import QuizFont from '../assets/Quiz.ttf';
import { useState, useCallback, useEffect } from 'react';
import LeaderboardModal from './LeaderboardModal';

const styles = `
  @font-face {
    font-family: 'QuizFont';
    src: url(${QuizFont}) format('truetype');
    font-weight: normal;
    font-style: normal;
  }

  .pattern-background {
    background-image: radial-gradient(black 55%, #0000),
      linear-gradient(135deg, red, orange, yellow, lime, cyan, blue, indigo, deeppink);
    background-size: 100% 0.5%, contain;
  }

  .quiz-modal {
    background-color: rgba(17, 24, 39, 0.95);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.2), inset 0 0 10px rgba(255, 255, 255, 0.05);
    outline: 2px solid rgba(255, 255, 255, 0.1);
    outline-offset: -2px;
  }

  .title-gradient {
    background-image: linear-gradient(135deg, #4a00e0, #8e2de2, #e94057, #f27121, #ffaa00, #00c853);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    animation: gradient 8s ease infinite;
    background-size: 400% 400%;
  }

  @keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  .play-button {
    background-color: rgba(99, 102, 241, 0.2);
    color: #fff;
    font-weight: bold;
    padding: 0.75rem 2rem;
    border-radius: 0.5rem;
    font-size: 1.25rem;
    transition: all 0.3s ease;
    border: 2px solid rgba(99, 102, 241, 0.4);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .play-button:hover {
    background-color: rgba(99, 102, 241, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.08);
  }

  .widget-background {
    background-color: rgba(30, 41, 59, 0.7);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.15);
    transition: all 0.3s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .widget-background:hover {
    background-color: rgba(30, 41, 59, 0.8);
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }

  .powerups-container {
    background-color: rgba(30, 41, 59, 0.6);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.05);
  }

  .powerup-item {
    background-color: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;
  }

  .powerup-item:hover {
    background-color: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .start-button {
    --primary: 255, 90, 120;
    --secondary: 150, 50, 60;
    width: 70px;
    height: 60px;
    border: none;
    outline: none;
    cursor: pointer;
    user-select: none;
    touch-action: manipulation;
    outline: 10px solid rgb(var(--primary), .5);
    border-radius: 100%;
    position: relative;
    transition: .3s;
  }

  .start-button .back {
    background: rgb(var(--secondary));
    border-radius: 100%;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }

  .start-button .front {
    background: linear-gradient(0deg, rgba(var(--primary), .6) 20%, rgba(var(--primary)) 50%);
    box-shadow: 0 .5em 1em -0.2em rgba(var(--secondary), .5);
    border-radius: 100%;
    position: absolute;
    border: 1px solid rgb(var(--secondary));
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.2rem;
    font-weight: 600;
    font-family: inherit;
    transform: translateY(-15%);
    transition: .15s;
    color: rgb(var(--secondary));
  }

  .start-button:active .front {
    transform: translateY(0%);
    box-shadow: 0 0;
  }

  .start-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .start-button:disabled .front {
    transform: translateY(0%);
    box-shadow: 0 0;
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

  .leaderboard-toggle {
    position: fixed;
    bottom: 1rem;
    left: 1rem;
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

  .leaderboard-toggle:hover {
    transform: scale(1.05);
  }

  .leaderboard-icon {
    font-size: 1.75rem;
    color: white;
  }
`;

const Badge = ({ icon: Icon, text, color }) => (
  <div className="flex items-center justify-center widget-background p-4 rounded-xl shadow-md transition-all duration-300">
    <Icon className={`w-8 h-8 mr-3 ${color}`} />
    <span className="text-sm sm:text-base font-semibold text-white ios-text-shadow">{text}</span>
  </div>
);

Badge.propTypes = {
  icon: PropTypes.elementType.isRequired,
  text: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};

const PowerUp = ({ icon: Icon, title, color }) => (
  <div className="flex items-center justify-center powerup-item p-4 rounded-xl shadow-md transition-all duration-300 h-full">
    <Icon className={`w-8 h-8 mr-3 ${color}`} />
    <h3 className="text-sm text-center font-semibold text-white ios-text-shadow">{title}</h3>
  </div>
);

PowerUp.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const audio = new Audio('/quiz.mp3');
    audio.loop = true;

    if (isMusicPlaying) {
      audio.play().catch(error => console.error("Error playing audio:", error));
    } else {
      audio.pause();
      audio.currentTime = 0;
    }

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [isMusicPlaying]);

  const handlePlayClick = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://the-trivia-api.com/v2/questions?limit=10');
      const data = await response.json();
      const formattedQuestions = data.map(q => ({
        question: q.question.text,
        answers: [...q.incorrectAnswers, q.correctAnswer].sort(() => Math.random() - 0.5),
        correctAnswer: q.correctAnswer,
      }));

      // Mindestwartezeit von 1 Sekunde
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Aktiviere die Musik erst nach dem Laden und der Wartezeit
      setIsMusicPlaying(true);

      navigate('/quiz', { state: { questions: formattedQuestions, isMusicPlaying: true } });
    } catch (error) {
      console.error('Error fetching questions:', error);
      setIsLoading(false);
    }
  }, [navigate]);

  const toggleMusic = () => {
    setIsMusicPlaying(!isMusicPlaying);
  };

  const toggleLeaderboard = () => {
    setShowLeaderboard(!showLeaderboard);
  };

  return (
    <div className="flex items-center justify-center min-h-screen pattern-background p-4">
      <style>{styles}</style>
      {!showLeaderboard ? (
        <div className="w-full max-w-3xl quiz-modal rounded-3xl shadow-xl p-8 sm:p-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent opacity-5 pointer-events-none"></div>

          <h1 className="text-4xl sm:text-5xl mb-8 text-center ios-text-shadow" style={{ fontFamily: 'QuizFont' }}>
            <span className="title-gradient">QUIZ TIME</span>
          </h1>
          <p className="text-base sm:text-lg mb-10 text-center text-white leading-relaxed ios-text-shadow">
            Are you ready to prove you&apos;re the ultimate quiz master?
          </p>
          <div className="space-y-8">
            <div className="grid grid-cols-3 gap-5">
              <Badge icon={HelpCircle} text="10 Questions" color="text-emerald-300" />
              <Badge icon={Clock} text="20 Sec Each" color="text-purple-300" />
              <Badge icon={Trophy} text="Beat Highscore" color="text-yellow-300" />
            </div>
            <div className="powerups-container p-6 rounded-2xl">
              <p className="text-sm sm:text-base text-white leading-relaxed ios-text-shadow mb-6 text-center">
                Beware of incorrect answers! They lead to game over, but powerups are your lifeline. Choose wisely:
              </p>
              <div className="grid grid-cols-3 gap-5">
                <PowerUp icon={Zap} title="50/50 Joker" color="text-yellow-300" />
                <PowerUp icon={Heart} title="Extra Life" color="text-red-300" />
                <PowerUp icon={SkipForward} title="Skip Question" color="text-blue-300" />
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-10">
            <button
              onClick={handlePlayClick}
              disabled={isLoading}
              className="start-button"
            >
              <span className="back"></span>
              <span className="front">
                {isLoading ? (
                  <div className="w-6 h-6 border-t-2 border-white rounded-full animate-spin"></div>
                ) : (
                  ''
                )}
              </span>
            </button>
          </div>
        </div>
      ) : (
        <LeaderboardModal onClose={toggleLeaderboard} />
      )}
      <button onClick={toggleMusic} className="music-toggle">
        {isMusicPlaying ? (
          <Volume2 className="music-icon" />
        ) : (
          <VolumeX className="music-icon" />
        )}
      </button>
      <button onClick={toggleLeaderboard} className="leaderboard-toggle">
        <Award className="leaderboard-icon" />
      </button>
    </div>
  );
};

export default HomePage;
