import React from 'react';
import { useGame } from '../context/GameContext';

const Shop: React.FC = () => {
  const { upgrades, money, buyUpgrade } = useGame();

  const getPrice = (upgrade: any) => {
    return Math.floor(upgrade.basePrice * Math.pow(1.5, upgrade.level));
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return Math.floor(num).toString();
  };

  const equipment = upgrades.filter(u => u.type === 'equipment');
  const luxury = upgrades.filter(u => u.type === 'luxury');

  return (
    <div className="tab-container shop-tab">
      <h2>Loja de Upgrades</h2>

      <div className="shop-section">
        <h3>Equipamento</h3>
        <div className="upgrade-list">
          {equipment.map(upgrade => {
            const price = getPrice(upgrade);
            const canAfford = money >= price;
            return (
              <div key={upgrade.id} className="upgrade-card">
                <div className="upgrade-icon">🛠️</div>
                <div className="upgrade-details">
                  <span className="name">{upgrade.name} (Nível {upgrade.level})</span>
                  <span className="desc">+{upgrade.multiplier}x views por clique</span>
                </div>
                <button 
                  className={`buy-btn ${!canAfford ? 'disabled' : ''}`}
                  onClick={() => buyUpgrade(upgrade.id)}
                  disabled={!canAfford}
                >
                  ${formatNumber(price)}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="shop-section">
        <h3>Luxúria & Casas</h3>
        <div className="upgrade-list">
          {luxury.map(upgrade => {
            const price = getPrice(upgrade);
            const canAfford = money >= price;
            return (
              <div key={upgrade.id} className="upgrade-card">
                <div className="upgrade-icon">🏠</div>
                <div className="upgrade-details">
                  <span className="name">{upgrade.name} (Nível {upgrade.level})</span>
                  <span className="desc">+{upgrade.multiplier * 10}% bônus de inscritos</span>
                </div>
                <button 
                  className={`buy-btn ${!canAfford ? 'disabled' : ''}`}
                  onClick={() => buyUpgrade(upgrade.id)}
                  disabled={!canAfford}
                >
                  ${formatNumber(price)}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .shop-tab h2 {
          margin-bottom: 20px;
          text-align: center;
        }
        .shop-section {
          margin-bottom: 30px;
        }
        .shop-section h3 {
          font-size: 1.1rem;
          margin-bottom: 15px;
          color: var(--primary);
          border-left: 4px solid var(--primary);
          padding-left: 10px;
        }
        .upgrade-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .upgrade-card {
          background-color: var(--bg-card);
          padding: 15px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .upgrade-icon {
          font-size: 1.5rem;
          background-color: #333;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
        }
        .upgrade-details {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .upgrade-details .name {
          font-weight: bold;
          font-size: 0.95rem;
        }
        .upgrade-details .desc {
          font-size: 0.8rem;
          color: var(--text-dim);
        }
        .buy-btn {
          background-color: var(--accent);
          color: white;
          padding: 8px 12px;
          border-radius: 8px;
          font-weight: bold;
          font-size: 0.9rem;
          min-width: 80px;
        }
        .buy-btn.disabled {
          background-color: #444;
          color: #888;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default Shop;
