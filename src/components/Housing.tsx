import React from 'react';
import { useGame, HOUSING_UPGRADES } from '../context/GameContext';
import './Housing.css';

const Housing: React.FC = () => {
  const { 
    money, 
    housings, 
    currentHousingId, 
    buyHousing, 
    boughtHousingUpgrades, 
    buyHousingUpgrade 
  } = useGame();

  const currentHousing = housings.find(h => h.id === currentHousingId);

  const formatNumber = (num: number) => {
    if (num === undefined || num === null) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return Math.floor(num).toLocaleString();
  };

  // Calculate current maintenance expenses
  const activeUpgrades = HOUSING_UPGRADES.filter(u => boughtHousingUpgrades.includes(u.id));
  const upgradesMaintenance = activeUpgrades.reduce((sum, u) => sum + u.weeklyMaintenance, 0);
  const totalWeeklyRent = (currentHousing?.weeklyRent || 0) + upgradesMaintenance;

  return (
    <div className="housing-dashboard scrollable-content animate-fade-in">
      
      {/* Page Title Header */}
      <header className="page-header-simple">
        <div className="title-area">
          <span className="emoji-title">🏠</span>
          <div>
            <h2>QG & Moradia</h2>
            <p>Melhore seu estilo de vida, instale melhorias no seu estúdio e impulsione sua marca!</p>
          </div>
        </div>
      </header>

      {/* Main Grid Layout for Desktop PC */}
      <div className="housing-grid-layout">
        
        {/* Left Column: Current Home & Setup Upgrades */}
        <section className="current-home-section">
          <div className="premium-panel home-showcase">
            <h3 className="section-title">🏡 Seu Lar Atual</h3>
            
            {/* Visual Card for Current House */}
            <div className={`current-home-card showcase-${currentHousingId}`}>
              <div className="card-overlay"></div>
              <div className="home-content">
                <span className="home-badge-live">Ativo</span>
                <h4>{currentHousing?.name}</h4>
                <p className="home-desc">{currentHousing?.description}</p>
                
                <div className="home-stats-row">
                  <div className="stat-pill">
                    <span className="pill-icon">📈</span>
                    <span>+{Math.round(((currentHousing?.viewMultiplier || 1) - 1) * 100)}% Views</span>
                  </div>
                  <div className="stat-pill">
                    <span className="pill-icon">⚡</span>
                    <span>+{currentHousing?.energyBonus || 0} Energia Máx</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Ledger card */}
            <div className="home-ledger">
              <h5>💰 Custo de Vida Semanal</h5>
              <div className="ledger-row">
                <span>Aluguel Base:</span>
                <span>${currentHousing?.weeklyRent}</span>
              </div>
              <div className="ledger-row">
                <span>Manutenção do Setup:</span>
                <span className="text-accent">+${upgradesMaintenance}</span>
              </div>
              <div className="ledger-divider"></div>
              <div className="ledger-row total">
                <span>Débito Semanal Total:</span>
                <span className="text-red">-${totalWeeklyRent}</span>
              </div>
            </div>

            {/* Setup & Infrastructure Upgrades Title */}
            <div className="setup-header-row">
              <h5>⚙️ Melhorias de Setup e Conectividade</h5>
              <span className="count-badge">{boughtHousingUpgrades.length} / {HOUSING_UPGRADES.length}</span>
            </div>

            {/* Setup Upgrades List */}
            <div className="setup-upgrades-list">
              {HOUSING_UPGRADES.map(upgrade => {
                const isInstalled = boughtHousingUpgrades.includes(upgrade.id);
                const isAffordable = money >= upgrade.price;

                return (
                  <div key={upgrade.id} className={`setup-upgrade-card ${isInstalled ? 'installed' : ''}`}>
                    <span className="upgrade-icon">{upgrade.icon}</span>
                    
                    <div className="upgrade-details">
                      <div className="upgrade-title-line">
                        <h6>{upgrade.name}</h6>
                        {isInstalled ? (
                          <span className="badge-installed">Ativo</span>
                        ) : (
                          <span className="badge-price">${formatNumber(upgrade.price)}</span>
                        )}
                      </div>
                      
                      <p className="upgrade-desc">{upgrade.description}</p>
                      
                      <div className="upgrade-footer">
                        <span className="upgrade-bonus">⚡ Bônus: <strong>{upgrade.bonusText}</strong></span>
                        <span className="upgrade-maint">Manut: <strong>${upgrade.weeklyMaintenance}/sem</strong></span>
                      </div>
                    </div>

                    {!isInstalled ? (
                      <button 
                        className={`btn-install ${!isAffordable ? 'disabled' : ''}`}
                        onClick={() => buyHousingUpgrade(upgrade.id)}
                        disabled={!isAffordable}
                      >
                        Comprar
                      </button>
                    ) : (
                      <div className="installed-checkmark">✓</div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </section>

        {/* Right Column: Real Estate Market */}
        <section className="real-estate-section">
          <div className="premium-panel real-estate-showcase">
            <h3 className="section-title">🏢 Imobiliária Premium Hype</h3>
            
            <div className="housing-market-list">
              {housings.map((housing) => {
                const isCurrent = housing.id === currentHousingId;
                const isAffordable = money >= housing.entryCost;
                const housingIndex = housings.findIndex(h => h.id === housing.id);
                const currentIndex = housings.findIndex(h => h.id === currentHousingId);
                const isUnlocked = housingIndex <= currentIndex + 1;

                return (
                  <div 
                    key={housing.id} 
                    className={`market-house-card ${isCurrent ? 'current' : ''} ${!isUnlocked ? 'locked' : ''}`}
                  >
                    
                    {/* Header House Card */}
                    <div className="market-house-header">
                      <div>
                        <h4>{housing.name} {isCurrent && <span className="current-badge-small">Seu Lar</span>}</h4>
                        <p>{housing.description}</p>
                      </div>
                      <span className="house-icon-large">🏠</span>
                    </div>

                    {/* Stats comparison */}
                    <div className="market-house-stats">
                      <div className="m-stat">
                        <span className="label">Multiplicador Views</span>
                        <strong className="val text-accent">+{Math.round((housing.viewMultiplier - 1) * 100)}%</strong>
                      </div>
                      <div className="m-stat">
                        <span className="label">Energia Máxima</span>
                        <strong className="val">+{housing.energyBonus} Max ⚡</strong>
                      </div>
                      {housing.minCompanyLevel && (
                        <div className="m-stat special">
                          <span className="label">Bônus Especial</span>
                          <strong className="val text-gold">🏢 Libera Aba Empresa</strong>
                        </div>
                      )}
                    </div>

                    {/* Costs / Purchase button bar */}
                    <div className="market-house-footer">
                      <div className="cost-info">
                        <div className="cost-item">
                          <span>Entrada/Caução:</span>
                          <strong className={isAffordable ? 'affordable' : 'expensive'}>
                            ${formatNumber(housing.entryCost)}
                          </strong>
                        </div>
                        <div className="cost-item">
                          <span>Aluguel:</span>
                          <strong>${formatNumber(housing.weeklyRent)}/sem</strong>
                        </div>
                      </div>

                      {!isCurrent && isUnlocked && (
                        <button 
                          className={`btn-move ${!isAffordable ? 'disabled' : ''}`}
                          onClick={() => buyHousing(housing.id)}
                          disabled={!isAffordable}
                        >
                          Mudar-se
                        </button>
                      )}

                      {isCurrent && (
                        <div className="btn-move-disabled">
                          Atual QG
                        </div>
                      )}

                      {!isUnlocked && (
                        <div className="locked-badge-card">
                          🔒 Melhore sua moradia anterior
                        </div>
                      )}

                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        </section>

      </div>
    </div>
  );
};

export default Housing;
