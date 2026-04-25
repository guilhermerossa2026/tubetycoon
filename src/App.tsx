import React, { useState } from 'react';
import { useGame } from './context/GameContext';
import CreateVideo from './components/CreateVideo';
import Channel from './components/Channel';
import Ranking from './components/Ranking';
import Shop from './components/Shop';
import Investments from './components/Investments';
import Company from './components/Company';
import './App.css';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'create' | 'channel' | 'ranking' | 'shop' | 'investments' | 'company'>('create');
  const { money, subscribers } = useGame();

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return Math.floor(num).toString();
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="stat">
          <span className="icon">💰</span>
          <span className="value">${formatNumber(money)}</span>
        </div>
        <div className="stat">
          <span className="icon">👥</span>
          <span className="value">{formatNumber(subscribers)}</span>
        </div>
      </header>

      <main className="content">
        {activeTab === 'create' && <CreateVideo />}
        {activeTab === 'channel' && <Channel />}
        {activeTab === 'ranking' && <Ranking />}
        {activeTab === 'shop' && <Shop />}
        {activeTab === 'investments' && <Investments />}
        {activeTab === 'company' && <Company />}
      </main>

      <nav className="bottom-nav">
        <button 
          className={activeTab === 'create' ? 'active' : ''} 
          onClick={() => setActiveTab('create')}
        >
          <span className="nav-icon">📹</span>
          <span className="nav-label">Criar</span>
        </button>
        <button 
          className={activeTab === 'channel' ? 'active' : ''} 
          onClick={() => setActiveTab('channel')}
        >
          <span className="nav-icon">👤</span>
          <span className="nav-label">Canal</span>
        </button>
        <button 
          className={activeTab === 'ranking' ? 'active' : ''} 
          onClick={() => setActiveTab('ranking')}
        >
          <span className="nav-icon">🏆</span>
          <span className="nav-label">Ranking</span>
        </button>
        <button 
          className={activeTab === 'shop' ? 'active' : ''} 
          onClick={() => setActiveTab('shop')}
        >
          <span className="nav-icon">🛒</span>
          <span className="nav-label">Loja</span>
        </button>
        <button 
          className={activeTab === 'investments' ? 'active' : ''} 
          onClick={() => setActiveTab('investments')}
        >
          <span className="nav-icon">📈</span>
          <span className="nav-label">Investir</span>
        </button>
        <button 
          className={activeTab === 'company' ? 'active' : ''} 
          onClick={() => setActiveTab('company')}
        >
          <span className="nav-icon">🏢</span>
          <span className="nav-label">Empresa</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
