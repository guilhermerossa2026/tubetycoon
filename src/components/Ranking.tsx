import React from 'react';
import { useGame } from '../context/GameContext';

const RIVALS = [
  { name: 'PewDiePie', subscribers: 111000000 },
  { name: 'MrBeast', subscribers: 200000000 },
  { name: 'Felipe Neto', subscribers: 45000000 },
  { name: 'ResendEevil', subscribers: 30000000 },
  { name: 'Gamer Master', subscribers: 10000000 },
  { name: 'Pro Player', subscribers: 5000000 },
  { name: 'Vlog King', subscribers: 1000000 },
  { name: 'Newbie Tuber', subscribers: 100000 },
  { name: 'Starter Guy', subscribers: 1000 },
];

const Ranking: React.FC = () => {
  const { subscribers } = useGame();

  const allTubers = [...RIVALS, { name: 'Você', subscribers, isPlayer: true }]
    .sort((a, b) => b.subscribers - a.subscribers);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return Math.floor(num).toString();
  };

  return (
    <div className="tab-container ranking-tab">
      <h2>Ranking Global</h2>
      <div className="ranking-list">
        {allTubers.map((tuber, index) => (
          <div 
            key={tuber.name} 
            className={`ranking-item ${tuber.isPlayer ? 'player-rank' : ''}`}
          >
            <span className="rank-pos">#{index + 1}</span>
            <div className="tuber-avatar">
              {tuber.isPlayer ? '⭐' : '👤'}
            </div>
            <div className="tuber-info">
              <span className="name">{tuber.name}</span>
              <span className="subs">{formatNumber(tuber.subscribers)} subs</span>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .ranking-tab h2 {
          margin-bottom: 20px;
          text-align: center;
        }
        .ranking-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .ranking-item {
          display: flex;
          align-items: center;
          gap: 15px;
          background-color: var(--bg-card);
          padding: 12px 15px;
          border-radius: 12px;
          transition: transform 0.2s;
        }
        .player-rank {
          border: 2px solid var(--primary);
          transform: scale(1.02);
          z-index: 2;
        }
        .rank-pos {
          font-weight: bold;
          color: var(--primary);
          width: 35px;
          font-size: 1.1rem;
        }
        .tuber-avatar {
          width: 45px;
          height: 45px;
          background-color: #333;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
        }
        .tuber-info {
          display: flex;
          flex-direction: column;
        }
        .tuber-info .name {
          font-weight: bold;
        }
        .tuber-info .subs {
          font-size: 0.85rem;
          color: var(--text-dim);
        }
      `}</style>
    </div>
  );
};

export default Ranking;
