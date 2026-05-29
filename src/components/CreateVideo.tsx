import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { THUMBNAIL_DATABASE } from '../assets/thumbnailDatabase';

const CreateVideo: React.FC = () => {
  const { 
    publishVideo, 
    money, 
    companies, 
    subscribers, 
    energy, 
    outsideWorks, 
    workOutside 
  } = useGame();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'vlog' | 'games' | 'pov' | 'challenge' | 'trend' | 'dance' | 'music'>('vlog');
  const [isPromoted, setIsPromoted] = useState(false);
  const [thumbnail, setThumbnail] = useState('https://img.youtube.com/vi/0e3GPea1Tyg/mqdefault.jpg');

  // New ad / promotion strategies states
  const [adStrategy, setAdStrategy] = useState<'organic' | 'sponsor' | 'self_promo'>('organic');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [selectedProductId, setSelectedProductId] = useState<string>('');

  const TITLES_DATABASE = {
    vlog: [
      "UM DIA COMIGO EM SÃO PAULO!",
      "MINHA ROTINA DA MANHÃ (MORANDO SOZINHO)",
      "NÃO ACREDITO QUE ISSO ACONTECEU...",
      "COMPREI MINHA CASA NOVA!",
      "TOUR PELO MEU QUARTO 2026",
      "COMO EU EDITO MEUS VÍDEOS",
      "VIAJEI PARA O LUGAR MAIS CARO DO MUNDO"
    ],
    games: [
      "ZEREI O JOGO MAIS DIFÍCIL DO MUNDO!",
      "ESSA NOVA ATUALIZAÇÃO MUDOU TUDO",
      "COMO GANHAR SEMPRE NO MODO RANKED",
      "REAGINDO AOS MELHORES PLAYERS",
      "FIZ UMA SPEEDRUN DE 5 MINUTOS",
      "O FINAL DESSE JOGO ME SURPREENDEU",
      "DICAS PARA QUEM ESTÁ COMEÇANDO"
    ],
    pov: [
      "POV: VOCÊ É MEU EDITOR POR UM DIA",
      "POV: A GENTE FOI NO LUGAR MAIS ASSUSTADOR",
      "POV: VOCÊ ESTÁ NA MINHA LIVE",
      "COMO É SER UM YOUTUBER EM 2026",
      "MINHA PERSPECTIVA SOBRE O ASSUNTO",
      "VOCÊ NÃO IA ACREDITAR SE NÃO FOSSE POV"
    ],
    challenge: [
      "24 HORAS SOBREVIVENDO NO DESERTO!",
      "QUEM SAIR POR ÚLTIMO GANHA $100.000",
      "COMI APENAS COMIDA AZUL POR UM DIA",
      "DESAFIO DO BALDE DE GELO (VERSÃO EXTREMA)",
      "NÃO PODE RIR - NÍVEL IMPOSSÍVEL",
      "TENTEI VIVER COM 1 REAL POR 24H"
    ],
    trend: [
      "REAGINDO ÀS TRENDS MAIS ABSURDAS",
      "ENTREI NA MAIOR TREND DO TIKTOK",
      "O QUE TODO MUNDO ESTÁ FALANDO AGORA",
      "MINHA OPINIÃO SOBRE A NOVA TREND",
      "VALE A PENA FAZER ESSA TREND?",
      "TODO MUNDO ESTÁ FAZENDO ISSO!"
    ],
    dance: [
      "COREOGRAFIA DA MÚSICA DO MOMENTO!",
      "APRENDI A DANÇAR EM 1 HORA",
      "TUTORIAL: COMO FAZER O PASSO NOVO",
      "DANÇANDO NO MEIO DA RUA (DEU ERRADO)",
      "MELHORES DANÇAS DE 2026",
      "FIZ A DANÇA MAIS DIFÍCIL DA INTERNET"
    ],
    music: [
      "MEU NOVO CLIPE OFICIAL!",
      "BASTIDORES DA MINHA NOVA MÚSICA",
      "FIZ UM BEAT EM 30 SEGUNDOS",
      "REAGINDO À MINHA PRIMEIRA MÚSICA",
      "A LETRA DESSA MÚSICA É UM DESABAFO",
      "COMO EU COMPUS MEU MAIOR HIT"
    ]
  };

  const handleRandomThumb = () => {
    const urls = THUMBNAIL_DATABASE[category] || THUMBNAIL_DATABASE['vlog'];
    const randomIndex = Math.floor(Math.random() * urls.length);
    const selectedUrl = urls[randomIndex];
    setThumbnail(selectedUrl);
  };

  const handleRandomTitle = () => {
    const titles = TITLES_DATABASE[category] || TITLES_DATABASE['vlog'];
    const randomIndex = Math.floor(Math.random() * titles.length);
    setTitle(titles[randomIndex]);
  };

  useEffect(() => {
    handleRandomThumb();
  }, [category]);

  const CATEGORIES = [
    { id: 'vlog', name: 'Vlog', icon: '🤳' },
    { id: 'games', name: 'Games', icon: '🎮' },
    { id: 'pov', name: 'POV', icon: '👀' },
    { id: 'challenge', name: 'Desafio', icon: '🔥' },
    { id: 'trend', name: 'Trend', icon: '📈' },
    { id: 'dance', name: 'Dança', icon: '💃' },
    { id: 'music', name: 'Clipe', icon: '🎵' },
  ];

  const PROMOTION_COST = 500;

  // Active founded companies list
  const activeCompanies = companies.filter(c => c.founded && !c.isBankrupt);
  const selectedComp = activeCompanies.find(c => c.id === selectedCompanyId);
  const availableProducts = selectedComp ? selectedComp.products.filter(p => p.isUnlocked) : [];

  // Sponsor dynamic payouts based on channel subscribers
  const getSponsorPayout = () => {
    if (subscribers >= 2500000) return 15000;
    if (subscribers >= 1000000) return 6000;
    if (subscribers >= 300000) return 2500;
    if (subscribers >= 100000) return 1000;
    return 300;
  };

  const handlePublish = () => {
    // Generate self promotion object if applicable
    const selfPromotionObj = adStrategy === 'self_promo' && selectedCompanyId && selectedProductId
      ? { companyId: selectedCompanyId, productId: selectedProductId }
      : null;

    const sponsorPayout = adStrategy === 'sponsor' ? getSponsorPayout() : undefined;

    publishVideo({
      title: title || 'Vídeo sem título',
      category,
      thumbnail,
      isPromoted,
      promotionCost: PROMOTION_COST,
      selfPromotion: selfPromotionObj,
      sponsorPayout
    });

    // Reset form
    setTitle('');
    setIsPromoted(false);
    setAdStrategy('organic');
    setSelectedCompanyId('');
    setSelectedProductId('');
    handleRandomThumb();
    alert("Vídeo publicado com sucesso!");
  };

  return (
    <div className="tab-container create-studio scrollable-content">
      <div className="studio-layout">
        <div className="studio-sidebar">
          {/* Authentic YouTube Player Card Preview */}
          <section className="preview-section">
            <div className="player-wrapper">
              <div className="thumb-preview" style={{ backgroundImage: `url(${thumbnail})` }}>
                <div className="player-overlay">
                  <div className="play-button-overlay">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="play-svg">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                <div className="duration">10:05</div>
                <div className="play-progress-bar">
                  <div className="play-progress-fill"></div>
                </div>
                <button className="refresh-thumb" onClick={handleRandomThumb} title="Trocar Thumbnail">
                  🔄
                </button>
              </div>
            </div>
            <div className="meta-preview">
              <div className="meta-brand">
                <div className="mock-avatar">
                  <span>S</span>
                </div>
                <div className="meta-text-details">
                  <div className="preview-title" title={title || 'Título do seu vídeo...'}>
                    {title || 'Título do seu vídeo...'}
                  </div>
                  <div className="preview-channel">Seu Canal • 0 visualizações • Agora mesmo</div>
                </div>
              </div>
            </div>
          </section>

          {/* Jobs Sidebar ("O Corre") */}
          <section className="outside-work-section">
            <div className="section-header">
              <h3>💸 Trabalhos Extras</h3>
              <p>Trabalhe por fora para cobrir despesas e expandir seu canal.</p>
            </div>
            
            <div className="work-list">
              {outsideWorks.map(work => {
                const canAfford = energy >= work.energyCost;
                const hasSubs = subscribers >= work.minSubs;
                
                return (
                  <div key={work.id} className={`work-card ${!hasSubs ? 'locked' : ''} ${!canAfford && hasSubs ? 'no-energy' : ''}`}>
                    <div className="work-details">
                      <div className="work-header">
                        <span className="work-name">{work.name}</span>
                        {!hasSubs && (
                          <span className="lock-badge">
                            🔒 {work.minSubs >= 1000000 ? `${work.minSubs / 1000000}M` : `${work.minSubs / 1000}K`} subs
                          </span>
                        )}
                      </div>
                      <div className="work-stats">
                        <span className="pay">+${work.pay}</span>
                        <span className="energy-cost">⚡ {work.energyCost}</span>
                      </div>
                    </div>
                    <button 
                      className={`work-btn ${!canAfford || !hasSubs ? 'disabled' : 'active'}`}
                      onClick={() => workOutside(work.id)}
                      disabled={!canAfford || !hasSubs}
                    >
                      {hasSubs ? 'TRABALHAR' : 'BLOQUEADO'}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Video Creator Panel */}
        <section className="setup-section">
          <div className="setup-header">
            <h3>🎬 Estúdio de Criação</h3>
            <span className="studio-badge">PC Studio Mode</span>
          </div>
          
          {/* Title Input */}
          <div className="input-group">
            <div className="label-row">
              <label>Título do Vídeo</label>
              <span className={`char-counter ${title.length >= 90 ? 'danger' : title.length >= 70 ? 'warning' : ''}`}>
                {title.length}/100
              </span>
            </div>
            <div className="title-input-wrapper">
              <input 
                type="text" 
                placeholder="Ex: TENTEI FAZER ISSO E DEU ERRADO!" 
                value={title}
                onChange={(e) => setTitle(e.target.value.slice(0, 100))}
                maxLength={100}
              />
              <button className="magic-title-btn" onClick={handleRandomTitle} title="Gerar título aleatório">
                ✨ Sugerir
              </button>
            </div>
          </div>

          {/* Categories Grid -> Modern YouTube Tags */}
          <div className="input-group">
            <label>Nicho / Estilo do Vídeo</label>
            <div className="category-chips-flex">
              {CATEGORIES.map(cat => (
                <button 
                  key={cat.id}
                  className={`cat-chip-btn ${category === cat.id ? 'active' : ''}`}
                  onClick={() => setCategory(cat.id as any)}
                >
                  <span className="icon">{cat.icon}</span>
                  <span className="name">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Monetization / Sponsorship Strategy cards */}
          <div className="input-group strategy-group">
            <label>Estratégia de Monetização / Divulgação</label>
            <div className="strategy-options">
              <button 
                type="button"
                className={`strategy-card ${adStrategy === 'organic' ? 'active' : ''}`}
                onClick={() => setAdStrategy('organic')}
              >
                <div className="strategy-badge green">🌱 ORGÂNICO</div>
                <span className="strategy-title">Padrão do Algoritmo</span>
                <span className="strategy-desc">Alcance integral do algoritmo, sem penalidades de engajamento.</span>
              </button>
              
              <button 
                type="button"
                className={`strategy-card ${adStrategy === 'sponsor' ? 'active' : ''}`}
                onClick={() => setAdStrategy('sponsor')}
              >
                <div className="strategy-badge gold">🤝 PATROCÍNIO</div>
                <span className="strategy-title">Sponsor Payout</span>
                <span className="strategy-desc">Ganha instantâneo <strong className="payout-highlight">+${getSponsorPayout()}</strong> na conta PF.</span>
                <span className="strategy-penalty">-5% visualizações</span>
              </button>

              <button 
                type="button"
                className={`strategy-card ${adStrategy === 'self_promo' ? 'active' : ''}`}
                disabled={activeCompanies.length === 0}
                onClick={() => setAdStrategy('self_promo')}
              >
                <div className="strategy-badge blue">👕 PROMOVER MARCA</div>
                <span className="strategy-title">Merchandising PJ</span>
                <span className="strategy-desc">
                  {activeCompanies.length > 0 
                    ? "Divulga seus produtos licenciados em estoque." 
                    : "🔒 Requer empresa fundada."}
                </span>
                <span className="strategy-penalty">-10% visualizações</span>
              </button>
            </div>
          </div>

          {/* Dynamic Self-Promotion Selectors */}
          {adStrategy === 'self_promo' && (
            <div className="self-promo-selectors anim-fade-in">
              <div className="promo-selectors-grid">
                <div className="select-group">
                  <label>Selecione a Marca PJ</label>
                  <div className="select-wrapper">
                    <select 
                      value={selectedCompanyId} 
                      onChange={(e) => {
                        setSelectedCompanyId(e.target.value);
                        setSelectedProductId('');
                      }}
                      className="promo-select"
                    >
                      <option value="">-- Escolha uma Empresa Fundada --</option>
                      {activeCompanies.map(c => (
                        <option key={c.id} value={c.id}>{c.name} ({c.niche.toUpperCase()})</option>
                      ))}
                    </select>
                  </div>
                </div>

                {selectedCompanyId && (
                  <div className="select-group anim-fade-in">
                    <label>Selecione o Produto em Estoque</label>
                    <div className="select-wrapper">
                      <select 
                        value={selectedProductId} 
                        onChange={(e) => setSelectedProductId(e.target.value)}
                        className="promo-select"
                      >
                        <option value="">-- Escolha um Produto para Divulgar --</option>
                        {availableProducts.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.emoji} {p.name} (Estoque: {p.stock} un. | Preço: ${p.price})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Google Ads promotion card with professional custom toggle switch */}
          <div className="promotion-card">
            <div className="promo-info">
              <div className="promo-tag">GOOGLE ADS</div>
              <h4>Impulsionar Vídeo (Tráfego Pago)</h4>
              <p>Invista na campanha de Ads para triplicar (3x) o alcance base do algoritmo.</p>
            </div>
            <div className="promo-action">
              <span className="cost">${PROMOTION_COST}</span>
              <label className="switch">
                <input 
                  type="checkbox"
                  checked={isPromoted}
                  onChange={() => setIsPromoted(!isPromoted)}
                  disabled={money < PROMOTION_COST && !isPromoted}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>

          {/* Action button */}
          <div className="publish-action-area">
            <button 
              className="publish-big-btn" 
              onClick={handlePublish}
              disabled={adStrategy === 'self_promo' && (!selectedCompanyId || !selectedProductId)}
            >
              <span className="btn-icon">📤</span>
              <span className="btn-text">POSTAR VÍDEO AGORA</span>
            </button>
          </div>
        </section>
      </div>

      <style>{`
        .create-studio {
          padding: 20px;
          display: flex;
          flex-direction: column;
        }
        .studio-layout {
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        @media (min-width: 950px) {
          .studio-layout {
            display: grid;
            grid-template-columns: 350px 1fr;
            gap: 25px;
            align-items: start;
          }
          .studio-sidebar {
            display: flex;
            flex-direction: column;
            gap: 20px;
            position: sticky;
            top: 10px;
          }
        }

        /* --- PREVIEW SECTION --- */
        .preview-section {
          background: #181818;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid #2d2d2d;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
          transition: all 0.3s ease;
        }
        .preview-section:hover {
          border-color: #444;
          box-shadow: 0 6px 20px rgba(0,0,0,0.4);
        }
        .player-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 16/9;
          overflow: hidden;
        }
        .thumb-preview {
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          position: relative;
          display: flex;
          justify-content: flex-end;
          align-items: flex-end;
          padding: 8px;
          cursor: pointer;
        }
        .player-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.4);
          display: flex;
          justify-content: center;
          align-items: center;
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .thumb-preview:hover .player-overlay {
          opacity: 1;
        }
        .play-button-overlay {
          width: 50px;
          height: 50px;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(8px);
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          border: 1px solid rgba(255,255,255,0.4);
          box-shadow: 0 0 15px rgba(0,0,0,0.5);
          transform: scale(0.9);
          transition: transform 0.2s ease;
        }
        .thumb-preview:hover .play-button-overlay {
          transform: scale(1);
        }
        .play-svg {
          width: 24px;
          height: 24px;
          color: white;
          margin-left: 2px;
        }
        .duration {
          background: rgba(17, 17, 17, 0.85);
          color: white;
          padding: 3px 6px;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: bold;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
          z-index: 2;
        }
        .play-progress-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: rgba(255, 255, 255, 0.2);
          z-index: 2;
        }
        .play-progress-fill {
          width: 45%;
          height: 100%;
          background: #ff0000;
          box-shadow: 0 0 8px #ff0000;
        }
        .refresh-thumb {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(24, 24, 24, 0.7);
          backdrop-filter: blur(5px);
          border: 1px solid #3d3d3d;
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          z-index: 3;
        }
        .refresh-thumb:hover {
          background: #ff3b30;
          border-color: #ff3b30;
          transform: rotate(180deg);
        }
        .meta-preview {
          padding: 12px 15px;
        }
        .meta-brand {
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }
        .mock-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ff007f, #7f00ff);
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
          font-weight: bold;
          font-size: 0.9rem;
          flex-shrink: 0;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .meta-text-details {
          flex: 1;
          min-width: 0;
        }
        .preview-title {
          font-weight: 600;
          font-size: 0.95rem;
          line-height: 1.35;
          margin-bottom: 4px;
          color: #fff;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          word-break: break-word;
        }
        .preview-channel {
          font-size: 0.75rem;
          color: var(--text-dim);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* --- SETUP SECTION --- */
        .setup-section {
          background: #181818;
          border: 1px solid #2d2d2d;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .setup-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #2d2d2d;
          padding-bottom: 12px;
        }
        .setup-header h3 {
          margin: 0;
          font-size: 1.15rem;
          color: #fff;
          font-weight: 600;
        }
        .studio-badge {
          background: rgba(255, 0, 0, 0.1);
          color: #ff3333;
          border: 1px solid rgba(255, 0, 0, 0.2);
          font-size: 0.65rem;
          font-weight: bold;
          padding: 3px 8px;
          border-radius: 20px;
          letter-spacing: 0.5px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .input-group label {
          font-size: 0.8rem;
          color: var(--text-dim);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .char-counter {
          font-size: 0.7rem;
          color: #888;
        }
        .char-counter.warning {
          color: #ff9f0a;
        }
        .char-counter.danger {
          color: #ff3b30;
          font-weight: bold;
        }

        .title-input-wrapper {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .input-group input {
          flex: 1;
          background: #111;
          border: 1px solid #333;
          padding: 10px 14px;
          border-radius: 8px;
          color: white;
          font-size: 0.9rem;
          transition: all 0.2s ease;
        }
        .input-group input:focus {
          border-color: #ff3333;
          box-shadow: 0 0 8px rgba(255, 51, 51, 0.15);
          outline: none;
          background: #161616;
        }
        .magic-title-btn {
          background: linear-gradient(135deg, #8a2be2 0%, #4b0082 100%);
          border: 1px solid #7a1ee2;
          color: white;
          height: 38px;
          padding: 0 16px;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: bold;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(138, 43, 226, 0.25);
          white-space: nowrap;
        }
        .magic-title-btn:hover {
          filter: brightness(1.15);
          box-shadow: 0 4px 12px rgba(138, 43, 226, 0.4);
          transform: translateY(-1px);
        }
        .magic-title-btn:active {
          transform: translateY(1px);
        }

        /* --- CATEGORIES TAGS (CHIPS) --- */
        .category-chips-flex {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .cat-chip-btn {
          background: #1e1e1e;
          border: 1px solid #333;
          border-radius: 20px;
          padding: 6px 14px;
          display: flex;
          align-items: center;
          gap: 6px;
          color: #aaa;
          transition: all 0.2s ease;
          font-size: 0.75rem;
          font-weight: 500;
        }
        .cat-chip-btn:hover {
          background: #282828;
          border-color: #555;
          color: #fff;
        }
        .cat-chip-btn.active {
          background: #ff0000;
          border-color: #ff0000;
          color: white;
          box-shadow: 0 2px 10px rgba(255, 0, 0, 0.3);
          font-weight: bold;
        }
        .cat-chip-btn .icon {
          font-size: 0.9rem;
        }

        /* --- STRATEGY CARDS --- */
        .strategy-options {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
        }
        @media (min-width: 600px) {
          .strategy-options {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        .strategy-card {
          background: #1f1f1f;
          border: 1px solid #333;
          padding: 15px;
          border-radius: 10px;
          color: #eee;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }
        .strategy-card:hover:not(:disabled) {
          border-color: #555;
          background: #252525;
          transform: translateY(-2px);
        }
        .strategy-card.active {
          border-color: #ff9f0a;
          background: rgba(255, 159, 10, 0.05);
          box-shadow: 0 0 12px rgba(255, 159, 10, 0.1);
        }
        .strategy-card.active::after {
          content: '✓';
          position: absolute;
          top: 10px;
          right: 10px;
          background: #ff9f0a;
          color: #111;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          font-size: 0.65rem;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .strategy-card:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        
        .strategy-badge {
          font-size: 0.6rem;
          font-weight: bold;
          padding: 2px 6px;
          border-radius: 4px;
          margin-bottom: 8px;
          letter-spacing: 0.5px;
        }
        .strategy-badge.green { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .strategy-badge.gold { background: rgba(255, 159, 10, 0.15); color: #ff9f0a; }
        .strategy-badge.blue { background: rgba(59, 130, 246, 0.15); color: #3b82f6; }

        .strategy-title {
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 6px;
          color: white;
        }
        .strategy-desc {
          font-size: 0.7rem;
          color: #999;
          line-height: 1.35;
          margin-bottom: 8px;
          flex-grow: 1;
        }
        .payout-highlight {
          color: #ff9f0a;
          font-weight: bold;
        }
        .strategy-penalty {
          font-size: 0.65rem;
          font-weight: bold;
          color: #ff453a;
          background: rgba(255, 69, 58, 0.1);
          padding: 1px 5px;
          border-radius: 3px;
        }

        /* --- SELF PROMO SELECTORS --- */
        .self-promo-selectors {
          background: rgba(255,255,255,0.02);
          border: 1px dashed #3d3d3d;
          padding: 15px;
          border-radius: 10px;
        }
        .promo-selectors-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }
        @media (min-width: 600px) {
          .promo-selectors-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        .select-wrapper {
          position: relative;
        }
        .promo-select {
          width: 100%;
          padding: 10px;
          border-radius: 8px;
          background: #111;
          border: 1px solid #333;
          color: white;
          font-size: 0.8rem;
          appearance: none;
          cursor: pointer;
          outline: none;
          transition: all 0.2s ease;
        }
        .promo-select:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 8px rgba(59, 130, 246, 0.2);
        }
        .select-wrapper::after {
          content: '▼';
          font-size: 0.6rem;
          color: #666;
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
        }

        /* --- PROMOTION (ADS) CARD --- */
        .promotion-card {
          background: linear-gradient(135deg, #1b263b 0%, #0d1b2a 100%);
          border: 1px solid #233d4d;
          padding: 15px 20px;
          border-radius: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 4px 12px rgba(13, 27, 42, 0.3);
        }
        .promo-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .promo-tag {
          font-size: 0.6rem;
          font-weight: 800;
          color: #4cc9f0;
          letter-spacing: 1px;
        }
        .promo-info h4 {
          margin: 0;
          font-size: 0.9rem;
          font-weight: bold;
          color: white;
        }
        .promo-info p {
          margin: 0;
          font-size: 0.7rem;
          color: #a5a5a5;
          line-height: 1.35;
        }
        .promo-action {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .promo-action .cost {
          font-size: 1rem;
          font-weight: 800;
          color: #4caf50;
        }

        /* --- TOGGLE SWITCH --- */
        .switch {
          position: relative;
          display: inline-block;
          width: 44px;
          height: 24px;
        }
        .switch input { 
          opacity: 0;
          width: 0;
          height: 0;
        }
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #333;
          transition: .3s;
          border: 1px solid #444;
        }
        .slider:before {
          position: absolute;
          content: "";
          height: 16px;
          width: 16px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .3s;
        }
        input:checked + .slider {
          background-color: #4caf50;
          border-color: #4caf50;
        }
        input:focus + .slider {
          box-shadow: 0 0 1px #4caf50;
        }
        input:checked + .slider:before {
          transform: translateX(20px);
        }
        .slider.round {
          border-radius: 34px;
        }
        .slider.round:before {
          border-radius: 50%;
        }

        /* --- PUBLISH ACTION --- */
        .publish-action-area {
          display: flex;
          justify-content: flex-end;
          margin-top: 5px;
        }
        .publish-big-btn {
          width: 100%;
          background: linear-gradient(135deg, #ff0000 0%, #b30000 100%);
          color: white;
          border: none;
          padding: 14px 24px;
          border-radius: 10px;
          font-weight: bold;
          font-size: 0.95rem;
          letter-spacing: 0.5px;
          box-shadow: 0 4px 15px rgba(255,0,0,0.25);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.25s ease;
        }
        .publish-big-btn:hover:not(:disabled) {
          filter: brightness(1.1);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255,0,0,0.4);
        }
        .publish-big-btn:active:not(:disabled) {
          transform: translateY(0);
        }
        .publish-big-btn:disabled {
          background: #252525;
          border: 1px solid #333;
          box-shadow: none;
          cursor: not-allowed;
          color: #555;
        }

        /* --- OUTSIDE WORK ("O CORRE") --- */
        .outside-work-section {
          background: #181818;
          padding: 15px;
          border-radius: 12px;
          border: 1px solid #2d2d2d;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        }
        .outside-work-section .section-header h3 {
          margin: 0;
          font-size: 0.95rem;
          font-weight: bold;
          color: #fff;
          margin-bottom: 4px;
        }
        .outside-work-section .section-header p {
          font-size: 0.75rem;
          color: var(--text-dim);
          margin-bottom: 15px;
        }
        .work-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .work-card {
          background: #1f1f1f;
          border: 1px solid #2a2a2a;
          padding: 10px 12px;
          border-radius: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.2s ease;
        }
        .work-card:hover:not(.locked) {
          border-color: #3d3d3d;
          background: #232323;
        }
        .work-card.locked {
          opacity: 0.45;
          background: rgba(255,255,255,0.01);
          border-style: dashed;
        }
        .work-card.no-energy {
          border-color: rgba(255, 235, 59, 0.2);
        }
        .work-details {
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
          flex-grow: 1;
          margin-right: 10px;
        }
        .work-header {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .work-name {
          font-weight: 600;
          font-size: 0.8rem;
          color: white;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .lock-badge {
          font-size: 0.6rem;
          background: rgba(0,0,0,0.4);
          color: #aaa;
          padding: 1px 4px;
          border-radius: 3px;
          font-weight: 500;
          white-space: nowrap;
        }
        .work-stats {
          display: flex;
          gap: 10px;
          font-size: 0.75rem;
        }
        .pay { color: #10b981; font-weight: bold; }
        .energy-cost { color: #ffeb3b; font-weight: 600; }
        
        .work-btn {
          background: #2d2d2d;
          border: 1px solid #3d3d3d;
          color: #ddd;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 0.7rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .work-btn:hover:not(.disabled) {
          background: #ff3b30;
          border-color: #ff3b30;
          color: white;
          box-shadow: 0 0 8px rgba(255, 59, 48, 0.3);
        }
        .work-btn.disabled {
          background: #151515;
          border-color: #222;
          color: #444;
          cursor: not-allowed;
        }

        .anim-fade-in {
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default CreateVideo;
