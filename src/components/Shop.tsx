import React, { useState } from 'react';
import { useGame, COURSES_INFO, LUXURY_ASSETS } from '../context/GameContext';

const Shop: React.FC = () => {
  const { 
    upgrades, 
    money, 
    buyUpgrade, 
    courses, 
    luxuryAssets, 
    netWorth, 
    buyCourseSemester, 
    buyLuxuryAsset 
  } = useGame();

  const [activeTab, setActiveTab] = useState<'hardware' | 'courses' | 'luxury'>('hardware');
  const [luxurySubTab, setLuxurySubTab] = useState<'casas' | 'veiculos' | 'colecoes'>('casas');

  const getUpgradePrice = (upgrade: any) => {
    return Math.floor(upgrade.basePrice * Math.pow(1.5, upgrade.level));
  };

  const formatNumber = (num: number) => {
    if (num === undefined || num === null) return '0';
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return Math.floor(num).toLocaleString();
  };

  // Compute Quality Level (0-100%)
  const sumSemesters = Object.values(courses).reduce((a, b) => a + b, 0);
  const qualityLevel = Math.floor((sumSemesters / 16) * 100);
  
  // Calculate average Video Quality (1.0 to 10.0)
  const minEstScore = (1 + (qualityLevel / 100) * 4).toFixed(1);
  const maxEstScore = (6 + (qualityLevel / 100) * 4).toFixed(1);

  const hardwareUpgrades = upgrades.filter(u => u.type === 'equipment');
  const luxuryEnergyUpgrades = upgrades.filter(u => u.type === 'luxury'); // Cadeira Gamer

  // Filter luxury assets by sub-category
  const currentImoveis = LUXURY_ASSETS.filter(a => a.category === 'casas');
  const currentVeiculos = LUXURY_ASSETS.filter(a => ['carros', 'aviacao', 'porto'].includes(a.category));
  const currentColecoes = LUXURY_ASSETS.filter(a => a.category === 'colecoes');

  return (
    <div className="shop-dashboard-v2 scrollable-content animate-fade-in">
      
      {/* Creator Profile & Status Header */}
      <header className="shop-profile-header">
        <div className="profile-QI-box">
          <div className="profile-QI-header">
            <span>🎓 Nível de Qualificação do Criador</span>
            <strong className="text-blue">{qualityLevel}%</strong>
          </div>
          <div className="QI-progress-bar">
            <div className="QI-progress-fill" style={{ width: `${qualityLevel}%` }}></div>
          </div>
          <small className="QI-subtitle">
            Qualidade média dos vídeos estimada: ⭐ <strong>{minEstScore} a {maxEstScore} / 10</strong>
          </small>
        </div>

        <div className="profile-fortune-box">
          <span className="lbl">🛡️ Fortuna & Patrimônio Total</span>
          <strong className="text-gold">${formatNumber(netWorth)}</strong>
          <small className="sub">Dinheiro Líquido PF: ${formatNumber(money)}</small>
        </div>
      </header>

      {/* Main Tab Navigation */}
      <nav className="shop-tabs-nav">
        <button className={activeTab === 'hardware' ? 'active' : ''} onClick={() => setActiveTab('hardware')}>🛠️ Hardware & Estúdio</button>
        <button className={activeTab === 'courses' ? 'active' : ''} onClick={() => setActiveTab('courses')}>📚 Cursos & Faculdades</button>
        <button className={activeTab === 'luxury' ? 'active' : ''} onClick={() => setActiveTab('luxury')}>💎 Patrimônio & Ostentação</button>
      </nav>

      {/* Tab Body View */}
      <div className="shop-tab-body">
        
        {/* TAB 1: HARDWARE & SETUP */}
        {activeTab === 'hardware' && (
          <div className="shop-section-view">
            <div className="section-intro">
              <h4>🛠️ Estúdio & Upgrades de Hardware</h4>
              <p>Adquira equipamentos profissionais de estúdio para impulsionar a retenção e multiplicar visualizações semanais.</p>
            </div>

            <div className="upgrades-vertical-list">
              {hardwareUpgrades.map(upgrade => {
                const price = getUpgradePrice(upgrade);
                const canAfford = money >= price;
                
                // Details description
                const bonusText = upgrade.id === 'webcam' ? '+10% views gerais por nível' :
                                  upgrade.id === 'mic' ? '+15% views gerais (Qualidade sonora)' :
                                  '+20% views gerais (Processamento/Edição rápida)';

                return (
                  <div key={upgrade.id} className="shop-upgrade-card">
                    <div className="upgrade-icon-box">
                      {upgrade.id === 'webcam' ? '📹' : upgrade.id === 'mic' ? '🎙️' : '💻'}
                    </div>

                    <div className="upgrade-main-info">
                      <div className="title-row">
                        <h5>{upgrade.name}</h5>
                        <span className="lvl-badge">Nível {upgrade.level}</span>
                      </div>
                      <p className="desc">Ideal para otimizar suas produções digitais de vídeo.</p>
                      <span className="bonus-lbl">⚡ Bônus: <strong>{bonusText}</strong></span>
                    </div>

                    <button 
                      className={`btn-shop-buy ${!canAfford ? 'disabled' : ''}`}
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
        )}

        {/* TAB 2: SKILLS & COURSES */}
        {activeTab === 'courses' && (
          <div className="shop-section-view">
            <div className="section-intro">
              <h4>📚 Qualificação Intelectual & Cursos</h4>
              <p>Matricule-se e conclua semestres de especialização acadêmica para elevar permanentemente o Nível de Qualidade e o Alcance dos seus vídeos!</p>
            </div>

            <div className="upgrades-vertical-list">
              {COURSES_INFO.map(course => {
                const currentLevel = courses[course.id] || 0;
                const isFormado = currentLevel >= 4;
                const price = !isFormado ? course.semesterPrices[currentLevel] : 0;
                const canAfford = money >= price;

                // Description of unique benefits
                const bonus = course.id === 'storytelling' ? '+15% inscritos gerados por nível' :
                              course.id === 'marketing' ? '+10% views gerais por nível (Visibilidade/Algoritmo)' :
                              course.id === 'edicao' ? '+15% views gerais (Retenção/Efeitos FX)' :
                              '+25% de faturamento de vídeos patrocinados por nível (Estratégia comercial)';

                return (
                  <div key={course.id} className={`shop-upgrade-card course-card ${isFormado ? 'completed' : ''}`}>
                    <div className="upgrade-icon-box course-icon">
                      {course.icon}
                    </div>

                    <div className="upgrade-main-info">
                      <div className="title-row">
                        <h5>{course.name}</h5>
                        {isFormado ? (
                          <span className="badge-formado">🎓 FORMADO!</span>
                        ) : (
                          <span className="lvl-badge">Semestre {currentLevel}/4</span>
                        )}
                      </div>
                      <p className="desc">{course.description}</p>
                      <span className="bonus-lbl">⚡ Bônus: <strong>{bonus}</strong></span>
                    </div>

                    {!isFormado ? (
                      <button 
                        className={`btn-shop-buy ${!canAfford ? 'disabled' : ''}`}
                        onClick={() => buyCourseSemester(course.id)}
                        disabled={!canAfford}
                      >
                        Matrícula: ${formatNumber(price)}
                      </button>
                    ) : (
                      <div className="formado-badge-checkmark">✓ Concluído</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: ASSETS & LUXURY (OSTENTAÇÃO) */}
        {activeTab === 'luxury' && (
          <div className="shop-section-view">
            <div className="section-intro">
              <h4>💎 Patrimônio Pessoal & Ostentação</h4>
              <p>Adquira ativos luxuosos e colecionáveis raros para demonstrar riqueza e expandir sua Fortuna Total na classificação do Ranking de Magnatas!</p>
            </div>

            {/* Sub navigation for Luxury categories */}
            <nav className="luxury-subtabs">
              <button className={luxurySubTab === 'casas' ? 'active' : ''} onClick={() => setLuxurySubTab('casas')}>🏠 Imóveis & Mansões</button>
              <button className={luxurySubTab === 'veiculos' ? 'active' : ''} onClick={() => setLuxurySubTab('veiculos')}>🏎️ Veículos & Hangar</button>
              <button className={luxurySubTab === 'colecoes' ? 'active' : ''} onClick={() => setLuxurySubTab('colecoes')}>📦 Coleções & Ego</button>
            </nav>

            {/* SUBCATEGORY 1: IMOVEIS */}
            {luxurySubTab === 'casas' && (
              <div className="luxury-grid-view">
                {currentImoveis.map(asset => {
                  const isOwned = luxuryAssets.includes(asset.id);
                  const canAfford = money >= asset.price;

                  return (
                    <div key={asset.id} className={`luxury-asset-card ${isOwned ? 'owned' : ''}`}>
                      <span className="asset-icon">{asset.icon}</span>
                      <div className="asset-details">
                        <h6>{asset.name}</h6>
                        <p>{asset.description}</p>
                        <span className="asset-price">${formatNumber(asset.price)}</span>
                      </div>

                      {!isOwned ? (
                        <button 
                          className={`btn-asset-buy ${!canAfford ? 'disabled' : ''}`}
                          onClick={() => buyLuxuryAsset(asset.id)}
                          disabled={!canAfford}
                        >
                          Adquirir
                        </button>
                      ) : (
                        <span className="badge-acquired">✓ Adquirido</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* SUBCATEGORY 2: VEICULOS */}
            {luxurySubTab === 'veiculos' && (
              <div className="veiculos-sub-sections">
                
                {/* Collapsible Section: Carros */}
                <div className="veiculos-block">
                  <h5>🏎️ Supercarros & Hypercars</h5>
                  <div className="luxury-grid-view">
                    {currentVeiculos.filter(a => a.category === 'carros').map(asset => {
                      const isOwned = luxuryAssets.includes(asset.id);
                      const canAfford = money >= asset.price;

                      return (
                        <div key={asset.id} className={`luxury-asset-card ${isOwned ? 'owned' : ''}`}>
                          <span className="asset-icon">{asset.icon}</span>
                          <div className="asset-details">
                            <h6>{asset.name}</h6>
                            <p>{asset.description}</p>
                            <span className="asset-price">${formatNumber(asset.price)}</span>
                          </div>

                          {!isOwned ? (
                            <button 
                              className={`btn-asset-buy ${!canAfford ? 'disabled' : ''}`}
                              onClick={() => buyLuxuryAsset(asset.id)}
                              disabled={!canAfford}
                            >
                              Adquirir
                            </button>
                          ) : (
                            <span className="badge-acquired">✓ Adquirido</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Collapsible Section: Aviação */}
                <div className="veiculos-block">
                  <h5>🚁 Aviação Executiva & Hangar</h5>
                  <div className="luxury-grid-view">
                    {currentVeiculos.filter(a => a.category === 'aviacao').map(asset => {
                      const isOwned = luxuryAssets.includes(asset.id);
                      const canAfford = money >= asset.price;

                      return (
                        <div key={asset.id} className={`luxury-asset-card ${isOwned ? 'owned' : ''}`}>
                          <span className="asset-icon">{asset.icon}</span>
                          <div className="asset-details">
                            <h6>{asset.name}</h6>
                            <p>{asset.description}</p>
                            <span className="asset-price">${formatNumber(asset.price)}</span>
                          </div>

                          {!isOwned ? (
                            <button 
                              className={`btn-asset-buy ${!canAfford ? 'disabled' : ''}`}
                              onClick={() => buyLuxuryAsset(asset.id)}
                              disabled={!canAfford}
                            >
                              Adquirir
                            </button>
                          ) : (
                            <span className="badge-acquired">✓ Adquirido</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Collapsible Section: Porto */}
                <div className="veiculos-block">
                  <h5>⚓ Náutica & Megaiates</h5>
                  <div className="luxury-grid-view">
                    {currentVeiculos.filter(a => a.category === 'porto').map(asset => {
                      const isOwned = luxuryAssets.includes(asset.id);
                      const canAfford = money >= asset.price;

                      return (
                        <div key={asset.id} className={`luxury-asset-card ${isOwned ? 'owned' : ''}`}>
                          <span className="asset-icon">{asset.icon}</span>
                          <div className="asset-details">
                            <h6>{asset.name}</h6>
                            <p>{asset.description}</p>
                            <span className="asset-price">${formatNumber(asset.price)}</span>
                          </div>

                          {!isOwned ? (
                            <button 
                              className={`btn-asset-buy ${!canAfford ? 'disabled' : ''}`}
                              onClick={() => buyLuxuryAsset(asset.id)}
                              disabled={!canAfford}
                            >
                              Adquirir
                            </button>
                          ) : (
                            <span className="badge-acquired">✓ Adquirido</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}

            {/* SUBCATEGORY 3: COLECOES */}
            {luxurySubTab === 'colecoes' && (
              <div className="luxury-grid-view">
                {currentColecoes.map(asset => {
                  const isOwned = luxuryAssets.includes(asset.id);
                  const canAfford = money >= asset.price;

                  return (
                    <div key={asset.id} className={`luxury-asset-card ${isOwned ? 'owned' : ''}`}>
                      <span className="asset-icon">{asset.icon}</span>
                      <div className="asset-details">
                        <h6>{asset.name}</h6>
                        <p>{asset.description}</p>
                        <span className="asset-price">${formatNumber(asset.price)}</span>
                      </div>

                      {!isOwned ? (
                        <button 
                          className={`btn-asset-buy ${!canAfford ? 'disabled' : ''}`}
                          onClick={() => buyLuxuryAsset(asset.id)}
                          disabled={!canAfford}
                        >
                          Adquirir
                        </button>
                      ) : (
                        <span className="badge-acquired">✓ Adquirido</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

      </div>

      <style>{`
        .shop-dashboard-v2 {
          padding: 24px;
          background: #111115;
          min-height: 100%;
        }

        /* Profile Header */
        .shop-profile-header {
          display: grid;
          grid-template-columns: 55% 45%;
          gap: 24px;
          background: linear-gradient(135deg, rgba(30,30,38,0.6) 0%, rgba(20,20,25,0.8) 100%);
          padding: 20px;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.05);
          margin-bottom: 24px;
          backdrop-filter: blur(10px);
        }

        @media (max-width: 900px) {
          .shop-profile-header {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }

        .profile-QI-box {
          display: flex;
          flex-direction: column;
        }

        .profile-QI-header {
          display: flex;
          justify-content: space-between;
          font-size: 0.88rem;
          color: #a0a0b0;
          margin-bottom: 8px;
          font-weight: 700;
        }

        .text-blue { color: #3b82f6; }
        .text-gold { color: #fbbf24; }

        .QI-progress-bar {
          height: 8px;
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .QI-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%);
          border-radius: 10px;
        }

        .QI-subtitle {
          font-size: 0.75rem;
          color: #808090;
        }

        .profile-fortune-box {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          text-align: right;
          justify-content: center;
        }

        @media (max-width: 900px) {
          .profile-fortune-box {
            align-items: flex-start;
            text-align: left;
          }
        }

        .profile-fortune-box .lbl {
          font-size: 0.78rem;
          color: #808090;
          margin-bottom: 2px;
        }

        .profile-fortune-box strong {
          font-size: 1.6rem;
          font-weight: 900;
          letter-spacing: -0.5px;
        }

        .profile-fortune-box .sub {
          font-size: 0.72rem;
          color: #808090;
        }

        /* Tabs Nav */
        .shop-tabs-nav {
          display: flex;
          background: rgba(0,0,0,0.2);
          border-bottom: 1px solid rgba(255,255,255,0.05);
          padding: 0 20px;
          margin-bottom: 24px;
        }

        .shop-tabs-nav button {
          background: none;
          border: none;
          color: #888;
          padding: 16px 14px;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          border-bottom: 3px solid transparent;
        }

        .shop-tabs-nav button:hover {
          color: #ddd;
        }

        .shop-tabs-nav button.active {
          color: white;
          border-bottom-color: #3b82f6;
        }

        /* Section Intro */
        .section-intro {
          margin-bottom: 20px;
        }

        .section-intro h4 {
          font-size: 1.15rem;
          font-weight: 800;
          color: white;
          margin: 0 0 4px 0;
          border-left: 4px solid #3b82f6;
          padding-left: 10px;
        }

        .section-intro p {
          font-size: 0.8rem;
          color: #808090;
          margin: 0;
        }

        /* Upgrades Lists */
        .upgrades-vertical-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .shop-upgrade-card {
          background: rgba(26, 26, 32, 0.55);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 16px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 16px;
          transition: all 0.2s ease;
          backdrop-filter: blur(10px);
        }

        .shop-upgrade-card:hover {
          background: rgba(26, 26, 32, 0.7);
          border-color: rgba(255,255,255,0.06);
        }

        .shop-upgrade-card.completed {
          border-color: rgba(76, 175, 80, 0.2);
          background: rgba(76, 175, 80, 0.02);
        }

        .upgrade-icon-box {
          font-size: 2rem;
          background: rgba(255,255,255,0.03);
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          flex-shrink: 0;
        }

        .upgrade-icon-box.course-icon {
          background: rgba(59, 130, 246, 0.08);
          border: 1px solid rgba(59, 130, 246, 0.15);
        }

        .upgrade-main-info {
          flex: 1;
        }

        .upgrade-main-info .title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }

        .upgrade-main-info .title-row h5 {
          font-size: 0.95rem;
          font-weight: 700;
          color: white;
          margin: 0;
        }

        .lvl-badge {
          font-size: 0.72rem;
          background: rgba(255,255,255,0.05);
          color: #a0a0b0;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 4px;
        }

        .badge-formado {
          font-size: 0.65rem;
          background: rgba(251, 191, 36, 0.15);
          border: 1px solid #fbbf24;
          color: #fbbf24;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 20px;
          animation: glow-award 1.5s infinite alternate;
        }

        @keyframes glow-award {
          0% { box-shadow: 0 0 5px rgba(251, 191, 36, 0.1); }
          100% { box-shadow: 0 0 12px rgba(251, 191, 36, 0.4); }
        }

        .upgrade-main-info .desc {
          font-size: 0.78rem;
          color: #808090;
          margin: 0 0 8px 0;
          line-height: 1.35;
        }

        .bonus-lbl {
          font-size: 0.72rem;
          color: #808090;
        }

        .bonus-lbl strong {
          color: #3b82f6;
        }

        .btn-shop-buy {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 800;
          font-size: 0.82rem;
          cursor: pointer;
          transition: all 0.2s ease;
          min-width: 120px;
          text-align: center;
        }

        .btn-shop-buy:hover:not(:disabled) {
          background: #2563eb;
          transform: translateY(-1px);
        }

        .btn-shop-buy:disabled {
          background: #2a2a30;
          color: #555560;
          cursor: not-allowed;
        }

        .formado-badge-checkmark {
          background: rgba(76, 175, 80, 0.15);
          border: 1px solid #4caf50;
          color: #4caf50;
          font-weight: 800;
          font-size: 0.78rem;
          padding: 6px 16px;
          border-radius: 8px;
          text-align: center;
          min-width: 120px;
        }

        /* Luxury subtabs style */
        .luxury-subtabs {
          display: flex;
          background: rgba(0,0,0,0.15);
          border-radius: 8px;
          padding: 3px;
          gap: 4px;
          margin-bottom: 20px;
          border: 1px solid rgba(255,255,255,0.02);
        }

        .luxury-subtabs button {
          flex: 1;
          background: none;
          border: none;
          color: #808090;
          padding: 8px;
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .luxury-subtabs button:hover {
          color: white;
        }

        .luxury-subtabs button.active {
          background: rgba(255,255,255,0.05);
          color: white;
        }

        /* Ostentacao grid view */
        .luxury-grid-view {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
        }

        .luxury-asset-card {
          background: rgba(26, 26, 32, 0.55);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 16px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 14px;
          transition: all 0.25s ease;
          position: relative;
        }

        .luxury-asset-card:hover {
          border-color: rgba(255,255,255,0.08);
          background: rgba(26, 26, 32, 0.7);
        }

        .luxury-asset-card.owned {
          border-color: rgba(76, 175, 80, 0.2);
          background: rgba(76, 175, 80, 0.01);
        }

        .asset-icon {
          font-size: 2.2rem;
          background: rgba(255,255,255,0.02);
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          flex-shrink: 0;
        }

        .asset-details {
          flex: 1;
        }

        .asset-details h6 {
          font-size: 0.88rem;
          font-weight: 700;
          color: white;
          margin: 0 0 2px 0;
        }

        .asset-details p {
          font-size: 0.72rem;
          color: #808090;
          margin: 0 0 6px 0;
          line-height: 1.3;
        }

        .asset-price {
          font-size: 0.78rem;
          color: #fbbf24;
          font-weight: 800;
        }

        .btn-asset-buy {
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 6px 12px;
          font-size: 0.75rem;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-asset-buy:hover:not(:disabled) {
          background: #2563eb;
          transform: translateY(-1px);
        }

        .btn-asset-buy:disabled {
          background: #2a2a30;
          color: #555560;
          cursor: not-allowed;
        }

        .badge-acquired {
          background: rgba(76, 175, 80, 0.15);
          color: #4caf50;
          font-weight: 800;
          font-size: 0.7rem;
          padding: 4px 8px;
          border-radius: 4px;
          border: 1px solid rgba(76,175,80,0.3);
        }

        /* Veiculos collapsible sections */
        .veiculos-sub-sections {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .veiculos-block h5 {
          font-size: 0.92rem;
          font-weight: 800;
          color: #fff;
          margin: 0 0 12px 0;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          padding-bottom: 6px;
        }
      `}</style>

    </div>
  );
};

export default Shop;
