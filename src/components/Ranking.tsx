import React, { useState } from 'react';
import { useGame } from '../context/GameContext';

const RIVALS = [
  { name: 'MrBeast', companyName: 'Beast Holdings', subscribers: 250000000, money: 500000000, companyValue: 1200000000, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jimmy' },
  { name: 'PewDiePie', companyName: 'Bro Army Media', subscribers: 111000000, money: 150000000, companyValue: 300000000, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' },
  { name: 'Felipe Neto', companyName: 'NetLab Group', subscribers: 45000000, money: 80000000, companyValue: 250000000, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felipe' },
  { name: 'Enaldinho', companyName: 'Enaldo Corp', subscribers: 35000000, money: 40000000, companyValue: 180000000, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Enaldo' },
  { name: 'Ryan Trahan', companyName: 'Penny Studios', subscribers: 15000000, money: 12000000, companyValue: 45000000, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ryan' },
  { name: 'Casey Neistat', companyName: 'Beme Media', subscribers: 12000000, money: 25000000, companyValue: 95000000, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Casey' },
  { name: 'Marques Brownlee', companyName: 'MKBHD Tech Inc', subscribers: 18000000, money: 30000000, companyValue: 120000000, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MKBHD' },
  { name: 'Lofi Girl', companyName: 'Lofi Records & Co', subscribers: 14000000, money: 5000000, companyValue: 200000000, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lofi' },
];

const Ranking: React.FC = () => {
  const { subscribers, money, agency } = useGame();
  const [activeTab, setActiveTab] = useState<'subs' | 'money' | 'company'>('subs');

  const calculatePlayerValuation = () => {
    if (!agency.exists) return 0;
    
    // Valuation based on talents and reputation
    const talentValue = agency.talents.reduce((acc, talent) => {
        return acc + (talent.subscribers * 5) + (talent.charisma * 10000);
    }, 0);
    
    const repMultiplier = 1 + (agency.reputation / 100);
    
    return Math.floor(talentValue * repMultiplier);
  };

  const playerCompanyValue = calculatePlayerValuation();
  const playerName = activeTab === 'company' && agency.exists ? agency.name : 'Você';

  const allTubers = [
    ...RIVALS, 
    { 
      name: playerName, 
      companyName: agency.exists ? agency.name : 'Sua Agência',
      subscribers, 
      money, 
      companyValue: playerCompanyValue, 
      isPlayer: true, 
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You' 
    }
  ].sort((a, b) => {
    if (activeTab === 'subs') return b.subscribers - a.subscribers;
    if (activeTab === 'money') return b.money - a.money;
    return b.companyValue - a.companyValue;
  });

  const formatNumber = (num: number) => {
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return Math.floor(num).toString();
  };

  const getDisplayName = (tuber: any) => {
    if (activeTab === 'company') return tuber.companyName;
    return tuber.name;
  };

  const getMetricValue = (tuber: any) => {
    if (activeTab === 'subs') return `${formatNumber(tuber.subscribers)} subs`;
    if (activeTab === 'money') return `$${formatNumber(tuber.money)}`;
    return `$${formatNumber(tuber.companyValue)} (Valor)`;
  };

  return (
    <div className="tab-container ranking-tab">
      <div className="ranking-header">
        <h2>Ranking Global</h2>
        <div className="ranking-nav">
          <button 
            className={activeTab === 'subs' ? 'active' : ''} 
            onClick={() => setActiveTab('subs')}
          >
            👥 Inscritos
          </button>
          <button 
            className={activeTab === 'money' ? 'active' : ''} 
            onClick={() => setActiveTab('money')}
          >
            💰 Fortuna
          </button>
          <button 
            className={activeTab === 'company' ? 'active' : ''} 
            onClick={() => setActiveTab('company')}
          >
            🏢 Empresas
          </button>
        </div>
      </div>

      <div className="ranking-list">
        {allTubers.map((tuber: any, index) => (
          <div 
            key={tuber.name} 
            className={`ranking-item ${tuber.isPlayer ? 'player-rank' : ''}`}
          >
            <div className="rank-pos-wrapper">
              <span className={`rank-pos ${index < 3 ? 'top-three' : ''}`}>#{index + 1}</span>
            </div>
            
            <img src={tuber.avatar} alt={tuber.name} className="tuber-img" />
            
            <div className="tuber-info">
              <span className="name">{getDisplayName(tuber)} {tuber.isPlayer && activeTab !== 'company' && '(Você)'}</span>
              <span className="metric">{getMetricValue(tuber)}</span>
            </div>

            {index === 0 && <span className="crown">👑</span>}
          </div>
        ))}
      </div>

      <style>{`
        .ranking-tab {
          padding: 20px;
        }
        .ranking-header {
          margin-bottom: 25px;
          text-align: center;
        }
        .ranking-nav {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-top: 15px;
          background: #1a1a1a;
          padding: 5px;
          border-radius: 12px;
        }
        .ranking-nav button {
          flex: 1;
          background: none;
          border: none;
          color: #888;
          padding: 10px;
          font-size: 0.8rem;
          font-weight: bold;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .ranking-nav button.active {
          background: var(--accent);
          color: white;
        }

        .ranking-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .ranking-item {
          display: flex;
          align-items: center;
          gap: 15px;
          background-color: var(--bg-card);
          padding: 12px 15px;
          border-radius: 15px;
          border: 1px solid #333;
          position: relative;
        }
        .player-rank {
          border: 2px solid var(--accent);
          background: #251010;
        }
        
        .rank-pos-wrapper {
          width: 40px;
          text-align: center;
        }
        .rank-pos {
          font-weight: 900;
          color: #666;
          font-size: 1.1rem;
        }
        .rank-pos.top-three {
          color: var(--accent);
        }

        .tuber-img {
          width: 50px;
          height: 50px;
          background-color: #333;
          border-radius: 50%;
          border: 2px solid #444;
        }
        
        .tuber-info {
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .tuber-info .name {
          font-weight: bold;
          font-size: 1rem;
        }
        .tuber-info .metric {
          font-size: 0.85rem;
          color: var(--accent);
          font-weight: bold;
        }

        .crown {
          font-size: 1.5rem;
          position: absolute;
          right: 15px;
          top: -10px;
        }
      `}</style>
    </div>
  );
};

export default Ranking;
