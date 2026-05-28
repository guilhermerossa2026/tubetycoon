import React, { useState } from 'react';
import { useGame } from './context/GameContext';
import CreateVideo from './components/CreateVideo';
import Channel from './components/Channel';
import Ranking from './components/Ranking';
import Shop from './components/Shop';
import Investments from './components/Investments';
import Company from './components/Company';
import Housing from './components/Housing';
import WeeklyReport from './components/WeeklyReport';
import './App.css';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'create' | 'channel' | 'ranking' | 'shop' | 'investments' | 'agency' | 'housing'>('create');
  const { money, subscribers, energy, maxEnergy, date, nextWeek, currentHousingId } = useGame();

  const isAgencyUnlocked = true; // TEMPORÁRIO PARA TESTES

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return Math.floor(num).toString();
  };

  const handleTabChange = (tab: typeof activeTab) => {
    if (tab === 'agency' && !isAgencyUnlocked) {
      alert("🏢 Área Restrita: Você precisa de uma estrutura profissional para gerenciar uma agência de talentos. Desbloqueado ao adquirir o Estúdio Gamer de Elite.");
      return;
    }
    setActiveTab(tab);
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-left">
          <div className="date-display">📅 {date}</div>
          <div className="energy-bar-container">
            <span className="icon">⚡</span>
            <div className="energy-bg">
              <div className="energy-fill" style={{ width: `${(energy / maxEnergy) * 100}%` }}></div>
            </div>
            <span className="energy-text">{Math.floor(energy)}/{maxEnergy}</span>
          </div>
        </div>
        
        <div className="header-right">
          <div className="stat">
            <span className="icon">💰</span>
            <span className="value">${formatNumber(money)}</span>
          </div>
          <button className="next-week-btn" onClick={nextWeek}>
            PASSAR SEMANA ⏩
          </button>
        </div>
      </header>

      <main className="content">
        {activeTab === 'create' && <CreateVideo />}
        {activeTab === 'channel' && <Channel />}
        {activeTab === 'ranking' && <Ranking />}
        {activeTab === 'shop' && <Shop />}
        {activeTab === 'investments' && <Investments />}
        {activeTab === 'agency' && <Company />}
        {activeTab === 'housing' && <Housing />}
      </main>

      <nav className="bottom-nav">
        <button 
          className={activeTab === 'create' ? 'active' : ''} 
          onClick={() => handleTabChange('create')}
        >
          <span className="nav-icon">📹</span>
          <span className="nav-label">Criar</span>
        </button>
        <button 
          className={activeTab === 'housing' ? 'active' : ''} 
          onClick={() => handleTabChange('housing')}
        >
          <span className="nav-icon">🏠</span>
          <span className="nav-label">Moradia</span>
        </button>
        <button 
          className={activeTab === 'channel' ? 'active' : ''} 
          onClick={() => handleTabChange('channel')}
        >
          <span className="nav-icon">👤</span>
          <span className="nav-label">Canal</span>
        </button>
        <button 
          className={activeTab === 'ranking' ? 'active' : ''} 
          onClick={() => handleTabChange('ranking')}
        >
          <span className="nav-icon">🏆</span>
          <span className="nav-label">Ranking</span>
        </button>
        <button 
          className={activeTab === 'shop' ? 'active' : ''} 
          onClick={() => handleTabChange('shop')}
        >
          <span className="nav-icon">🛒</span>
          <span className="nav-label">Loja</span>
        </button>
        <button 
          className={activeTab === 'investments' ? 'active' : ''} 
          onClick={() => handleTabChange('investments')}
        >
          <span className="nav-icon">📈</span>
          <span className="nav-label">Investir</span>
        </button>
        <button 
          className={`${activeTab === 'agency' ? 'active' : ''} ${!isAgencyUnlocked ? 'locked-nav' : ''}`} 
          onClick={() => handleTabChange('agency')}
        >
          <span className="nav-icon">{isAgencyUnlocked ? '🏢' : '🔒'}</span>
          <span className="nav-label">Agência</span>
        </button>
      </nav>
      <WeeklyReport />
    </div>
  );
};

export default App;
