import React from 'react';

const HighScores = () => {
  // Static high scores data for this version
  const highScores = [
    { name: 'Alex', time: '01:45', mode: 'Normal', date: '2025-03-15' },
    { name: 'Sarah', time: '02:12', mode: 'Normal', date: '2025-03-10' },
    { name: 'Michael', time: '02:30', mode: 'Normal', date: '2025-03-05' },
    { name: 'Emma', time: '02:58', mode: 'Normal', date: '2025-02-28' },
    { name: 'James', time: '03:15', mode: 'Normal', date: '2025-02-20' },
    { name: 'Lisa', time: '01:20', mode: 'Easy', date: '2025-03-12' },
    { name: 'David', time: '01:35', mode: 'Easy', date: '2025-03-08' },
    { name: 'Jessica', time: '01:50', mode: 'Easy', date: '2025-03-01' }
  ];

  return (
    <div className="scores-container">
      <h1>High Scores</h1>
      
      <div className="scores-table-container">
        <table className="scores-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Time</th>
              <th>Mode</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {highScores.map((score, index) => (
              <tr 
                key={index} 
                className={
                  index === 0 ? 'gold' : 
                  index === 1 ? 'silver' : 
                  index === 2 ? 'bronze' : ''
                }
              >
                <td>{index + 1}</td>
                <td>{score.name}</td>
                <td>{score.time}</td>
                <td>{score.mode}</td>
                <td>{score.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HighScores; 