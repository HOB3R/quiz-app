import React from 'react';
import PropTypes from 'prop-types';
import { Trophy, Frown, Sparkles } from 'lucide-react';

const GameOverPage = ({ score, totalQuestions, onPlayAgain }) => {
  const maxScore = totalQuestions * 50;
  const isWinner = score === maxScore;

  return (
    <div className="min-h-screen bg-pattern flex items-center justify-center p-4">
      <style>
        {`
          .game-over-modal {
            background-color: rgba(17, 24, 39, 0.95);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 0 30px rgba(0, 0, 0, 0.2), inset 0 0 10px rgba(255, 255, 255, 0.05);
            outline: 2px solid rgba(255, 255, 255, 0.1);
            outline-offset: -2px;
          }
          .play-again-button {
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
          .play-again-button:hover {
            background-color: rgba(99, 102, 241, 0.3);
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.08);
          }
          .play-again-button:active {
            transform: translateY(1px);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          .icon-container {
            position: relative;
            width: 120px;
            height: 120px;
            margin: 0 auto 2rem;
          }
          .icon-background {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
          }
          .sparkle {
            position: absolute;
            animation: twinkle 1.5s infinite ease-in-out;
          }
          @keyframes twinkle {
            0%, 100% { opacity: 0; transform: scale(0.5); }
            50% { opacity: 1; transform: scale(1); }
          }
          .score-display {
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 1rem;
            padding: 1rem;
            margin-bottom: 1.5rem;
          }
          .score-label {
            font-size: 1.25rem;
            color: rgba(255, 255, 255, 0.7);
            margin-bottom: 0.5rem;
          }
          .score-value {
            font-size: 3rem;
            font-weight: bold;
            color: white;
          }
        `}
      </style>
      <div className="game-over-modal p-8 rounded-3xl shadow-xl text-center max-w-md w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent opacity-5 pointer-events-none"></div>
        <div className="icon-container">
          <div className="icon-background"></div>
          {isWinner ? (
            <Trophy className="w-24 h-24 text-yellow-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          ) : (
            <Frown className="w-24 h-24 text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          )}
          {isWinner && (
            <>
              <Sparkles className="sparkle text-yellow-200 w-6 h-6 absolute top-0 left-1/4" style={{animationDelay: '0s'}} />
              <Sparkles className="sparkle text-yellow-200 w-4 h-4 absolute top-1/4 right-0" style={{animationDelay: '0.5s'}} />
              <Sparkles className="sparkle text-yellow-200 w-5 h-5 absolute bottom-0 right-1/4" style={{animationDelay: '1s'}} />
            </>
          )}
        </div>
        <h2 className="text-3xl font-bold mb-6 text-white ios-text-shadow">
          {isWinner ? 'Congratulations!' : 'Game Over!'}
        </h2>
        <div className="score-display">
          <p className="score-label">Your Score</p>
          <p className="score-value">{score} / {maxScore}</p>
        </div>
        <button
          className="play-again-button"
          onClick={onPlayAgain}
        >
          Play Again
        </button>
      </div>
    </div>
  );
};

GameOverPage.propTypes = {
  score: PropTypes.number.isRequired,
  totalQuestions: PropTypes.number.isRequired,
  onPlayAgain: PropTypes.func.isRequired,
};

export default GameOverPage;
