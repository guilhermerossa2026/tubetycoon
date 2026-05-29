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
  const { subscribers, money, agency, channelName } = useGame();
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
  const playerName = activeTab === 'company' && agency.exists ? agency.name : (channelName || 'Você');

  // Build the unified list of all creators
  const allTubers: any[] = [
    ...RIVALS.map(r => ({ ...r, isPlayer: false })), 
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
    return Math.floor(num).toLocaleString();
  };

  const getDisplayName = (tuber: any) => {
    if (activeTab === 'company') return tuber.companyName;
    return tuber.name;
  };

  const getMetricValue = (tuber: any) => {
    if (activeTab === 'subs') return `${formatNumber(tuber.subscribers)} subs`;
    if (activeTab === 'money') return `$${formatNumber(tuber.money)}`;
    return `$${formatNumber(tuber.companyValue)} (Valuation)`;
  };

  // Find Player position & Direct Rival
  const playerIndex = allTubers.findIndex(t => t.isPlayer);
  const isPlayerNumberOne = playerIndex === 0;
  const directRival = !isPlayerNumberOne ? allTubers[playerIndex - 1] : null;

  // Calculate difference to Direct Rival
  const getDifferenceToRival = () => {
    if (!directRival) return 0;
    if (activeTab === 'subs') return directRival.subscribers - subscribers;
    if (activeTab === 'money') return directRival.money - money;
    return directRival.companyValue - playerCompanyValue;
  };

  const rivalDiff = getDifferenceToRival();

  // Get Custom Tier and Color based on metric and active tab
  const getTierAndColor = (tuber: any) => {
    if (activeTab === 'subs') {
      if (tuber.subscribers >= 100000000) return { label: '💎 Elite Diamante', color: '#60a5fa' };
      if (tuber.subscribers >= 10000000) return { label: '🥇 Mestre Ouro', color: '#fbbf24' };
      if (tuber.subscribers >= 1000000) return { label: '🥈 Estrela Prata', color: '#ced4da' };
      return { label: '🥉 Iniciante Bronze', color: '#b45309' };
    } else if (activeTab === 'money') {
      if (tuber.money >= 100000000) return { label: '💎 Bilionário', color: '#60a5fa' };
      if (tuber.money >= 20000000) return { label: '💰 Multimilionário', color: '#fbbf24' };
      if (tuber.money >= 1000000) return { label: '💵 Milionário', color: '#ced4da' };
      return { label: '📈 Promissor', color: '#34d399' };
    } else {
      if (tuber.companyValue >= 500000000) return { label: '🏢 Conglomerado', color: '#c084fc' };
      if (tuber.companyValue >= 100000000) return { label: '💼 Corporação', color: '#60a5fa' };
      if (tuber.companyValue >= 15000000) return { label: '📈 Holding de Elite', color: '#ced4da' };
      return { label: '🌱 Empresa Local', color: '#34d399' };
    }
  };

  // Get dynamic trends based on name
  const getTrendBadge = (tuber: any) => {
    if (tuber.isPlayer) return { label: '⚡ Exponencial', class: 'trend-viral' };
    
    const trends: { [key: string]: { label: string; class: string } } = {
      'MrBeast': { label: '🔥 Alta', class: 'trend-up' },
      'PewDiePie': { label: '➡️ Estável', class: 'trend-neutral' },
      'Felipe Neto': { label: '🔥 Alta', class: 'trend-up' },
      'Enaldinho': { label: '🔥 Alta', class: 'trend-up' },
      'Ryan Trahan': { label: '🔥 Alta', class: 'trend-up' },
      'Casey Neistat': { label: '📉 Queda', class: 'trend-down' },
      'Marques Brownlee': { label: '➡️ Estável', class: 'trend-neutral' },
      'Lofi Girl': { label: '➡️ Estável', class: 'trend-neutral' },
    };

    return trends[tuber.name] || { label: '➡️ Estável', class: 'trend-neutral' };
  };

  // Extract Top 3 for the Podium
  const topThree = allTubers.slice(0, 3);

  return (
    <div className="ranking-dashboard-v2 scrollable-content animate-fade-in">
      
      {/* Dynamic Header Tab Buttons */}
      <header className="ranking-header-v2">
        <div className="title-section">
          <h2>🏆 Classificação Global</h2>
          <p>Compita com as maiores celebridades do mundo digital e assuma o controle do império!</p>
        </div>
        
        <nav className="ranking-nav-v2">
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
            💰 Fortuna PF
          </button>
          <button 
            className={activeTab === 'company' ? 'active' : ''} 
            onClick={() => setActiveTab('company')}
          >
            🏢 Empresas PJ
          </button>
        </nav>
      </header>

      {/* Grid Layout for PC */}
      <div className="ranking-grid-layout">
        
        {/* Left Column: Podium 3D & Rival Challenge */}
        <section className="podium-and-rival-section">
          
          {/* Podium Visual Card */}
          <div className="premium-panel podium-card">
            <h3 className="panel-title">🏁 O Pódio de Líderes</h3>
            
            <div className="podium-3d-wrapper">
              
              {/* Position #2 (Silver) */}
              {topThree[1] && (
                <div className="podium-place place-2">
                  <div className="podium-avatar-wrapper silver-ring">
                    <img src={topThree[1].avatar} alt={topThree[1].name} />
                    <span className="medal-badge">🥈</span>
                  </div>
                  <div className="podium-base base-silver">
                    <span className="creator-podium-name">{getDisplayName(topThree[1])}</span>
                    <span className="creator-podium-val">{getMetricValue(topThree[1])}</span>
                    <div className="place-number">#2</div>
                  </div>
                </div>
              )}

              {/* Position #1 (Gold) */}
              {topThree[0] && (
                <div className="podium-place place-1">
                  <span className="king-crown">👑</span>
                  <div className="podium-avatar-wrapper gold-ring">
                    <img src={topThree[0].avatar} alt={topThree[0].name} />
                    <span className="medal-badge">🥇</span>
                  </div>
                  <div className="podium-base base-gold">
                    <span className="creator-podium-name">{getDisplayName(topThree[0])}</span>
                    <span className="creator-podium-val">{getMetricValue(topThree[0])}</span>
                    <div className="place-number">#1</div>
                  </div>
                </div>
              )}

              {/* Position #3 (Bronze) */}
              {topThree[2] && (
                <div className="podium-place place-3">
                  <div className="podium-avatar-wrapper bronze-ring">
                    <img src={topThree[2].avatar} alt={topThree[2].name} />
                    <span className="medal-badge">🥉</span>
                  </div>
                  <div className="podium-base base-bronze">
                    <span className="creator-podium-name">{getDisplayName(topThree[2])}</span>
                    <span className="creator-podium-val">{getMetricValue(topThree[2])}</span>
                    <div className="place-number">#3</div>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Direct Rival Target Card */}
          <div className="premium-panel rival-card">
            <h3 className="panel-title">🎯 Sua Ficha no Ranking</h3>
            
            <div className="player-ranking-status">
              <div className="status-header">
                <span>Sua Posição Atual:</span>
                <strong className="badge-position">#{playerIndex + 1} de {allTubers.length}</strong>
              </div>

              {!isPlayerNumberOne && directRival ? (
                <div className="rival-details-box animate-pulse-border">
                  <div className="rival-avatar-mini">
                    <img src={directRival.avatar} alt={directRival.name} />
                  </div>
                  <div className="rival-text-info">
                    <h6>Seu Rival Direto: <strong>{getDisplayName(directRival)}</strong></h6>
                    <p className="rival-distance">
                      Diferença: 
                      <strong className="text-accent-gold"> 
                        {activeTab === 'subs' ? `${formatNumber(rivalDiff)} subs` : 
                         activeTab === 'money' ? `$${formatNumber(rivalDiff)}` : 
                         `$${formatNumber(rivalDiff)} de valuation`}
                      </strong>
                    </p>
                    <small className="encouragement-tag">Falta pouco para você superá-lo! Continue produzindo!</small>
                  </div>
                </div>
              ) : (
                <div className="king-congrats-box">
                  <span className="king-emoji">👑</span>
                  <h6>Você é o Líder Supremo!</h6>
                  <p>MrBeast e todos os outros criadores do mundo agora olham para cima para te ver. Mantenha o seu domínio corporativo no topo!</p>
                </div>
              )}
            </div>
          </div>

        </section>

        {/* Right Column: Complete Feed Leaderboard */}
        <section className="complete-leaderboard-section">
          <div className="premium-panel leaderboard-card">
            <h3 className="panel-title">📋 Classificação Completa</h3>
            
            <div className="ranking-feed-list">
              {allTubers.map((tuber, index) => {
                const isCurrentPlayer = tuber.isPlayer;
                const tier = getTierAndColor(tuber);
                const trend = getTrendBadge(tuber);

                return (
                  <div 
                    key={tuber.name} 
                    className={`leaderboard-row-item ${isCurrentPlayer ? 'player-row' : ''}`}
                  >
                    {/* Rank Position */}
                    <div className="row-pos-col">
                      <span className={`row-pos-number ${index < 3 ? `top-${index + 1}` : ''}`}>
                        #{index + 1}
                      </span>
                    </div>

                    {/* Avatar */}
                    <div className="row-avatar-col">
                      <img src={tuber.avatar} alt={tuber.name} className="row-avatar-img" />
                    </div>

                    {/* Name & Tier */}
                    <div className="row-info-col">
                      <div className="row-name-line">
                        <span className="row-name">
                          {getDisplayName(tuber)} {isCurrentPlayer && <span className="player-tag-row">Você</span>}
                        </span>
                        
                        {/* Trend Tag */}
                        <span className={`trend-badge-row ${trend.class}`}>
                          {trend.label}
                        </span>
                      </div>

                      <div className="row-tier-line">
                        <span className="row-tier" style={{ color: tier.color }}>{tier.label}</span>
                      </div>
                    </div>

                    {/* Metric value display */}
                    <div className="row-metric-col">
                      <strong className="row-metric-value">{getMetricValue(tuber)}</strong>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        </section>

      </div>

      <style>{`
        .ranking-dashboard-v2 {
          padding: 24px;
          background: #111115;
          min-height: 100%;
        }

        .ranking-header-v2 {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(135deg, rgba(30,30,38,0.6) 0%, rgba(20,20,25,0.8) 100%);
          padding: 20px;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.05);
          margin-bottom: 24px;
          backdrop-filter: blur(10px);
        }

        @media (max-width: 900px) {
          .ranking-header-v2 {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }
        }

        .ranking-header-v2 .title-section h2 {
          font-size: 1.6rem;
          font-weight: 800;
          color: white;
          margin: 0 0 4px 0;
          letter-spacing: -0.5px;
        }

        .ranking-header-v2 .title-section p {
          font-size: 0.85rem;
          color: #a0a0b0;
          margin: 0;
        }

        .ranking-nav-v2 {
          display: flex;
          background: rgba(0,0,0,0.25);
          padding: 4px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.04);
        }

        .ranking-nav-v2 button {
          background: none;
          border: none;
          color: #888;
          padding: 8px 16px;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .ranking-nav-v2 button:hover {
          color: #fff;
        }

        .ranking-nav-v2 button.active {
          background: #3b82f6;
          color: white;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
        }

        /* 2 Column Layout */
        .ranking-grid-layout {
          display: grid;
          grid-template-columns: 44% 56%;
          gap: 24px;
          align-items: start;
        }

        @media (max-width: 1024px) {
          .ranking-grid-layout {
            grid-template-columns: 1fr;
          }
        }

        .premium-panel {
          background: rgba(26, 26, 32, 0.55);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 20px;
          padding: 20px;
          backdrop-filter: blur(16px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
          margin-bottom: 24px;
        }

        .premium-panel .panel-title {
          font-size: 1.1rem;
          font-weight: 800;
          color: white;
          margin: 0 0 20px 0;
          border-left: 4px solid #3b82f6;
          padding-left: 10px;
          letter-spacing: -0.3px;
        }

        /* 3D Podium Layout */
        .podium-3d-wrapper {
          display: flex;
          justify-content: center;
          align-items: flex-end;
          padding: 20px 0 10px 0;
          min-height: 240px;
          gap: 12px;
        }

        .podium-place {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 31%;
          position: relative;
        }

        .podium-avatar-wrapper {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: #333;
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: -10px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.4);
        }

        .podium-avatar-wrapper img {
          width: 90%;
          height: 90%;
          border-radius: 50%;
        }

        .medal-badge {
          position: absolute;
          bottom: -4px;
          right: -4px;
          font-size: 1.1rem;
        }

        .gold-ring { border: 3px solid #fbbf24; background: linear-gradient(135deg, #ffe259, #ffa751); width: 68px; height: 68px; }
        .silver-ring { border: 2px solid #cbd5e1; background: linear-gradient(135deg, #757f9a, #d7dde8); }
        .bronze-ring { border: 2px solid #b45309; background: linear-gradient(135deg, #805300, #b47f09); }

        .king-crown {
          font-size: 1.8rem;
          margin-bottom: 2px;
          z-index: 3;
          animation: crown-float 2.5s infinite ease-in-out;
        }

        @keyframes crown-float {
          0% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-4px) rotate(4deg); }
          100% { transform: translateY(0) rotate(0); }
        }

        /* Bases of the Podium */
        .podium-base {
          width: 100%;
          border-radius: 8px 8px 4px 4px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          padding: 24px 8px 16px 8px;
          text-align: center;
          position: relative;
        }

        .base-gold {
          height: 140px;
          background: linear-gradient(180deg, rgba(251, 191, 36, 0.15) 0%, rgba(251, 191, 36, 0.02) 100%);
          border: 1px solid rgba(251, 191, 36, 0.2);
        }
        .base-silver {
          height: 110px;
          background: linear-gradient(180deg, rgba(206, 212, 218, 0.12) 0%, rgba(206, 212, 218, 0.02) 100%);
          border: 1px solid rgba(206, 212, 218, 0.15);
        }
        .base-bronze {
          height: 90px;
          background: linear-gradient(180deg, rgba(180, 83, 9, 0.12) 0%, rgba(180, 83, 9, 0.02) 100%);
          border: 1px solid rgba(180, 83, 9, 0.15);
        }

        .creator-podium-name {
          font-weight: 800;
          color: white;
          font-size: 0.8rem;
          margin-bottom: 4px;
          line-height: 1.25;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .creator-podium-val {
          font-size: 0.72rem;
          color: #808090;
          font-weight: 600;
        }

        .place-number {
          position: absolute;
          bottom: 8px;
          font-size: 1.5rem;
          font-weight: 900;
          opacity: 0.12;
          color: white;
        }

        /* Rival Card */
        .player-ranking-status .status-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          font-size: 0.88rem;
          color: #a0a0b0;
        }

        .badge-position {
          background: #3b82f6;
          color: white;
          font-size: 0.8rem;
          padding: 3px 10px;
          border-radius: 20px;
          box-shadow: 0 2px 8px rgba(59,130,246,0.3);
        }

        .rival-details-box {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 14px;
          padding: 16px;
          display: flex;
          gap: 16px;
          align-items: center;
        }

        .rival-avatar-mini {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: 2px solid #3b82f6;
          flex-shrink: 0;
        }

        .rival-avatar-mini img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }

        .rival-text-info {
          flex: 1;
        }

        .rival-text-info h6 {
          font-size: 0.88rem;
          font-weight: 600;
          color: white;
          margin: 0 0 2px 0;
        }

        .rival-text-info h6 strong {
          color: #3b82f6;
        }

        .rival-distance {
          font-size: 0.8rem;
          color: #a0a0b0;
          margin: 0 0 4px 0;
        }

        .text-accent-gold {
          color: #fbbf24 !important;
          font-weight: 800;
        }

        .encouragement-tag {
          font-size: 0.7rem;
          color: #4caf50;
          font-weight: 600;
        }

        .king-congrats-box {
          text-align: center;
          padding: 24px 16px;
          background: rgba(251, 191, 36, 0.05);
          border: 1px solid rgba(251, 191, 36, 0.15);
          border-radius: 14px;
          animation: box-glow-gold 3s infinite alternate;
        }

        @keyframes box-glow-gold {
          0% { box-shadow: 0 0 5px rgba(251, 191, 36, 0.1); }
          100% { box-shadow: 0 0 15px rgba(251, 191, 36, 0.25); }
        }

        .king-emoji {
          font-size: 2.2rem;
          display: block;
          margin-bottom: 8px;
          animation: crown-float 2s infinite ease-in-out;
        }

        .king-congrats-box h6 {
          font-size: 0.95rem;
          font-weight: 800;
          color: #fbbf24;
          margin: 0 0 4px 0;
        }

        .king-congrats-box p {
          font-size: 0.78rem;
          color: #a0a0b0;
          margin: 0;
          line-height: 1.4;
        }

        /* Complete Leaderboard list */
        .ranking-feed-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .leaderboard-row-item {
          display: flex;
          align-items: center;
          gap: 16px;
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 14px;
          padding: 12px 18px;
          transition: all 0.2s ease;
        }

        .leaderboard-row-item:hover {
          background: rgba(255, 255, 255, 0.03);
          border-color: rgba(255, 255, 255, 0.06);
          transform: translateX(2px);
        }

        .player-row {
          border-color: rgba(59, 130, 246, 0.35);
          background: rgba(59, 130, 246, 0.03);
          box-shadow: 0 0 15px rgba(59,130,246,0.05);
        }

        .row-pos-col {
          width: 36px;
          text-align: center;
        }

        .row-pos-number {
          font-weight: 900;
          font-size: 0.95rem;
          color: #606070;
        }

        .row-pos-number.top-1 { color: #fbbf24; font-size: 1.1rem; }
        .row-pos-number.top-2 { color: #94a3b8; font-size: 1rem; }
        .row-pos-number.top-3 { color: #b45309; font-size: 1rem; }

        .row-avatar-col {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: #333;
          flex-shrink: 0;
        }

        .row-avatar-img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }

        .row-info-col {
          flex: 1;
        }

        .row-name-line {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 2px;
        }

        .row-name {
          font-weight: 700;
          font-size: 0.92rem;
          color: white;
        }

        .player-tag-row {
          background: rgba(59, 130, 246, 0.15);
          color: #3b82f6;
          font-size: 0.65rem;
          font-weight: 800;
          padding: 1px 6px;
          border-radius: 4px;
          vertical-align: middle;
          margin-left: 6px;
        }

        .trend-badge-row {
          font-size: 0.62rem;
          font-weight: 800;
          padding: 1px 6px;
          border-radius: 4px;
          text-transform: uppercase;
        }

        .trend-viral { background: rgba(59, 130, 246, 0.12); color: #3b82f6; }
        .trend-up { background: rgba(76, 175, 80, 0.12); color: #4caf50; }
        .trend-neutral { background: rgba(255,255,255,0.05); color: #888; }
        .trend-down { background: rgba(239, 68, 68, 0.12); color: #ef4444; }

        .row-tier-line {
          font-size: 0.72rem;
        }

        .row-tier {
          font-weight: 700;
        }

        .row-metric-col {
          text-align: right;
        }

        .row-metric-value {
          font-size: 0.9rem;
          color: white;
          font-weight: 800;
        }

        /* Animations */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in {
          animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-pulse-border {
          animation: pulse-border 2s infinite alternate;
        }

        @keyframes pulse-border {
          0% { border-color: rgba(59, 130, 246, 0.1); }
          100% { border-color: rgba(59, 130, 246, 0.4); }
        }
      `}</style>

    </div>
  );
};

export default Ranking;
