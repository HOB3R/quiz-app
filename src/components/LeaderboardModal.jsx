import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { X, Trophy, AlertCircle } from 'lucide-react';

const LeaderboardModal = ({ onClose }) => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const fetchScores = () => {
      const storedScores = JSON.parse(localStorage.getItem('quizScores')) || [];
      const filteredScores = storedScores.filter(score => score.score > 0);
      return filteredScores.sort((a, b) => b.score - a.score).slice(0, 10);
    };

    setScores(fetchScores());

    const handleStorageChange = () => {
      setScores(fetchScores());
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  return (
    <div className="w-full max-w-3xl quiz-modal rounded-3xl shadow-xl p-8 sm:p-10 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent opacity-5 pointer-events-none"></div>
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-white flex items-center ios-text-shadow">
            <Trophy className="w-8 h-8 mr-3 text-yellow-400" />
            Leaderboard
          </h2>
          <button onClick={onClose} className="text-white hover:text-gray-300 transition-colors">
            <X size={24} />
          </button>
        </div>
        {scores.length > 0 ? (
          <ul className="space-y-3">
            {scores.map((score, index) => (
              <li key={index} className="widget-background flex justify-between items-center rounded-xl p-4 transition-all">
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-white mr-4 ios-text-shadow">{index + 1}.</span>
                  <span className="text-lg text-white ios-text-shadow">{formatDate(score.date)}</span>
                </div>
                <span className="text-2xl font-bold text-yellow-300 ios-text-shadow">{score.score}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="widget-background rounded-xl p-6 text-center">
            <AlertCircle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <p className="text-white text-xl font-bold mb-2 ios-text-shadow">No scores yet</p>
            <p className="text-gray-300 ios-text-shadow">Play a game to set a record!</p>
          </div>
        )}
      </div>
    </div>
  );
};

LeaderboardModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default LeaderboardModal;
