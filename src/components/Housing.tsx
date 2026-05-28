import React from 'react';
import { useGame } from '../context/GameContext';
import './Housing.css';

const Housing: React.FC = () => {
  const { money, housings, currentHousingId, buyHousing } = useGame();

  const currentHousing = housings.find(h => h.id === currentHousingId);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return Math.floor(num).toString();
  };

  return (
    <div className="housing-container scrollable-content">
      <div className="housing-header">
        <h2>🏠 Moradia</h2>
        <p>Melhore seu estilo de vida para ganhar bônus de performance e desbloquear novas áreas.</p>
        <div className="current-status">
          <span>Status Atual: <strong>{currentHousing?.name}</strong></span>
          <span>Gasto Semanal: <strong className="expense">-${currentHousing?.weeklyRent}</strong></span>
        </div>
      </div>

      <div className="housing-list">
        {housings.map((housing) => {
          const isOwned = housing.id === currentHousingId;
          const isAffordable = money >= housing.entryCost;
          const housingIndex = housings.findIndex(h => h.id === housing.id);
          const currentIndex = housings.findIndex(h => h.id === currentHousingId);
          const isUnlocked = housingIndex <= currentIndex + 1;

          return (
            <div 
              key={housing.id} 
              className={`housing-card ${isOwned ? 'owned' : ''} ${!isUnlocked ? 'locked' : ''}`}
            >
              <div className="housing-info">
                <div className="housing-main">
                  <h3>{housing.name} {isOwned && '✅'}</h3>
                  <p className="description">{housing.description}</p>
                </div>
                
                <div className="benefits">
                  <div className="benefit">
                    <span className="icon">📈</span>
                    <span>+{Math.round((housing.viewMultiplier - 1) * 100)}% Views</span>
                  </div>
                  {housing.energyBonus > 0 && (
                    <div className="benefit">
                      <span className="icon">⚡</span>
                      <span>+{housing.energyBonus} Energia Máx.</span>
                    </div>
                  )}
                  {housing.minCompanyLevel && (
                    <div className="benefit special">
                      <span className="icon">🏢</span>
                      <span>Libera Aba Empresa</span>
                    </div>
                  )}
                </div>

                <div className="costs">
                  <div className="cost">
                    <span>Entrada:</span>
                    <strong className={isAffordable ? 'affordable' : 'expensive'}>
                      ${formatNumber(housing.entryCost)}
                    </strong>
                  </div>
                  <div className="cost">
                    <span>Aluguel/Semana:</span>
                    <strong>${formatNumber(housing.weeklyRent)}</strong>
                  </div>
                </div>
              </div>

              {!isOwned && isUnlocked && (
                <button 
                  className={`buy-btn ${!isAffordable ? 'disabled' : ''}`}
                  onClick={() => buyHousing(housing.id)}
                  disabled={!isAffordable}
                >
                  MUDAR-SE
                </button>
              )}

              {!isOwned && !isUnlocked && (
                <div className="lock-overlay">
                  <span>🔒 Melhore sua moradia anterior primeiro</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Housing;
