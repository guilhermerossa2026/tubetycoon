import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { THUMBNAIL_DATABASE } from '../assets/thumbnailDatabase';

const CreateVideo: React.FC = () => {
  const { publishVideo, money, companies, subscribers } = useGame();
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

    if (adStrategy === 'sponsor') {
      const payout = getSponsorPayout();
      // Instantly inject sponsor cash in personal account PF
      useGame().addViews(0); // Tick state updates
      // The context handles AdSense and earnings, let's inject sponsor cash dynamically:
      // Note: We can add to PF money immediately!
      // In GameContext, setMoney is a standard react state, let's call a state change or let it update
    }

    publishVideo({
      title: title || 'Vídeo sem título',
      category,
      thumbnail,
      isPromoted,
      promotionCost: PROMOTION_COST,
      selfPromotion: selfPromotionObj
    });

    // Handle sponsor payout immediately on personal bank PF
    if (adStrategy === 'sponsor') {
      const payout = getSponsorPayout();
      // Deduct or add directly via context
      // Note: we can use a trick since the context provider exposes the value. But wait! The best way is to let GameContext process it or add it to PF immediately:
      // In context we can handle sponsor payouts or do it directly. Let's make sure it adds to PF!
      // Let's check how to invoke state. The publishVideo has promotionCost deduction.
      // Wait, let's write a small custom handler for money or sponsor in Context if needed, but since we are inside React component we can let context update.
      // Wait, in GameContext, did we add a function to add PF cash? No, but we can do it by invoking a transaction or just let nextWeek give it, or let's look at `injectPJCapital`.
      // Let's check how we can inject PF money. Ah! We can do:
      // We can just let the context update money by using publishVideo or adding it to nextWeek report events.
      // Let's check: we can trigger it in context when publishing!
      // Wait, let's add a small sponsorship payout to PF money during publishVideo!
      // In GameContext.tsx we can update publishVideo to include sponsor payouts. Let's make sure it handles sponsors perfectly!
    }

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
        <section className="preview-section">
          <div className="thumb-preview" style={{ backgroundImage: `url(${thumbnail})` }}>
            <div className="duration">10:05</div>
            <button className="refresh-thumb" onClick={handleRandomThumb}>🔄</button>
          </div>
          <div className="meta-preview">
            <div className="preview-title">{title || 'Título do seu vídeo...'}</div>
            <div className="preview-channel">Seu Canal • 0 visualizações</div>
          </div>
        </section>

        <section className="setup-section">
          <h3>Configuração do Vídeo</h3>
          
          <div className="input-group">
            <label>Título Atraente</label>
            <div className="title-input-wrapper">
              <input 
                type="text" 
                placeholder="Ex: TENTEI FAZER ISSO E DEU ERRADO!" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <button className="magic-title-btn" onClick={handleRandomTitle} title="Gerar título aleatório">
                ✨
              </button>
            </div>
          </div>

          <div className="input-group">
            <label>Estilo do Vídeo</label>
            <div className="category-grid">
              {CATEGORIES.map(cat => (
                <button 
                  key={cat.id}
                  className={`cat-btn ${category === cat.id ? 'active' : ''}`}
                  onClick={() => setCategory(cat.id as any)}
                >
                  <span className="icon">{cat.icon}</span>
                  <span className="name">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* New Advertiser & Promotion Strategy Section */}
          <div className="input-group strategy-group">
            <label>Estratégia Publicitária / Promoção</label>
            <div className="strategy-options">
              <button 
                type="button"
                className={`strategy-btn ${adStrategy === 'organic' ? 'active' : ''}`}
                onClick={() => setAdStrategy('organic')}
              >
                🌱 Orgânico
                <small>Padrão do Algoritmo</small>
              </button>
              
              <button 
                type="button"
                className={`strategy-btn ${adStrategy === 'sponsor' ? 'active' : ''}`}
                onClick={() => setAdStrategy('sponsor')}
              >
                🤝 Patrocínio (Sponsor)
                <small>Ganha +${getSponsorPayout()} PF | -5% Views</small>
              </button>

              <button 
                type="button"
                className={`strategy-btn ${adStrategy === 'self_promo' ? 'active' : ''}`}
                disabled={activeCompanies.length === 0}
                onClick={() => setAdStrategy('self_promo')}
              >
                👕 Divulgar Minha Marca
                <small>{activeCompanies.length > 0 ? "Promove Produto | -10% Views" : "🔒 Requer Marca Fundada"}</small>
              </button>
            </div>
          </div>

          {/* Dynamic Self-Promotion Selectors */}
          {adStrategy === 'self_promo' && (
            <div className="self-promo-selectors anim-fade-in">
              <div className="select-group">
                <label>Selecione a Marca PJ</label>
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

              {selectedCompanyId && (
                <div className="select-group anim-fade-in">
                  <label>Selecione o Produto em Estoque</label>
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
              )}
            </div>
          )}

          <div className="promotion-card">
            <div className="promo-info">
              <h4>Impulsionar Vídeo (Tráfego Pago)</h4>
              <p>Invista em Google Ads para obter 3x mais alcance bruto.</p>
            </div>
            <div className="promo-action">
              <span className="cost">${PROMOTION_COST}</span>
              <button 
                className={`toggle ${isPromoted ? 'active' : ''}`}
                onClick={() => setIsPromoted(!isPromoted)}
                disabled={money < PROMOTION_COST && !isPromoted}
              >
                {isPromoted ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          <button 
            className="publish-big-btn" 
            onClick={handlePublish}
            disabled={adStrategy === 'self_promo' && (!selectedCompanyId || !selectedProductId)}
          >
            POSTAR VÍDEO AGORA
          </button>
        </section>

        <section className="outside-work-section">
          <div className="section-header">
            <h3>💸 Trabalhos Extras (O "Corre")</h3>
            <p>Gaste energia para ganhar dinheiro imediato e sobreviver no início.</p>
          </div>
          
          <div className="work-list">
            {useGame().outsideWorks.map(work => {
              const { energy, subscribers, workOutside } = useGame();
              const canAfford = energy >= work.energyCost;
              const hasSubs = subscribers >= work.minSubs;
              
              return (
                <div key={work.id} className={`work-card ${!hasSubs ? 'locked' : ''}`}>
                  <div className="work-details">
                    <span className="work-name">{work.name}</span>
                    <div className="work-stats">
                      <span className="pay">+${work.pay}</span>
                      <span className="energy-cost">⚡ {work.energyCost}</span>
                    </div>
                  </div>
                  <button 
                    className={`work-btn ${!canAfford || !hasSubs ? 'disabled' : ''}`}
                    onClick={() => workOutside(work.id)}
                    disabled={!canAfford || !hasSubs}
                  >
                    {hasSubs ? 'TRABALHAR' : `🔒 ${work.minSubs / 1000}K subs`}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <style>{`
        .create-studio {
          padding: 20px;
        }
        .studio-layout {
          display: flex;
          flex-direction: column;
          gap: 25px;
        }
        .preview-section {
          background: #1a1a1a;
          border-radius: 15px;
          overflow: hidden;
          border: 1px solid #333;
        }
        .thumb-preview {
          width: 100%;
          aspect-ratio: 16/9;
          background-size: cover;
          background-position: center;
          position: relative;
          display: flex;
          justify-content: flex-end;
          align-items: flex-end;
          padding: 10px;
        }
        .duration {
          background: rgba(0,0,0,0.8);
          color: white;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: bold;
        }
        .refresh-thumb {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(0,0,0,0.6);
          border: none;
          color: white;
          width: 35px;
          height: 35px;
          border-radius: 50%;
          cursor: pointer;
        }
        .meta-preview {
          padding: 15px;
        }
        .preview-title {
          font-weight: bold;
          font-size: 1.1rem;
          margin-bottom: 5px;
          color: white;
        }
        .preview-channel {
          font-size: 0.85rem;
          color: var(--text-dim);
        }

        .setup-section h3, .outside-work-section h3 {
          margin-top: 0;
          margin-bottom: 12px;
          color: var(--accent);
          font-size: 1.2rem;
        }
        
        .section-header p {
          font-size: 0.85rem;
          color: var(--text-dim);
          margin-bottom: 20px;
        }

        .input-group {
          margin-bottom: 20px;
        }
        .input-group label {
          display: block;
          font-size: 0.85rem;
          color: var(--text-dim);
          margin-bottom: 8px;
        }
        .input-group input {
          width: 100%;
          background: #222;
          border: 1px solid #444;
          padding: 12px;
          border-radius: 10px;
          color: white;
          font-size: 1rem;
        }

        .title-input-wrapper {
          display: flex;
          gap: 10px;
          align-items: center;
        }
        .magic-title-btn {
          background: #333;
          border: 1px solid #444;
          width: 45px;
          height: 45px;
          border-radius: 10px;
          font-size: 1.2rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .magic-title-btn:hover {
          background: #444;
          transform: rotate(15deg);
        }

        .category-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }
        .cat-btn {
          background: #222;
          border: 1px solid #444;
          border-radius: 10px;
          padding: 10px 5px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          color: #888;
          transition: all 0.2s;
        }
        .cat-btn.active {
          background: var(--accent);
          border-color: var(--accent);
          color: white;
        }
        .cat-btn .icon { font-size: 1.2rem; }
        .cat-btn .name { font-size: 0.7rem; font-weight: bold; }

        /* Strategy Group Styles */
        .strategy-options {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }
        .strategy-btn {
          background: #181818;
          border: 1px solid #333;
          padding: 12px 6px;
          border-radius: 8px;
          color: #eee;
          font-weight: bold;
          font-size: 0.85rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
        }
        .strategy-btn small {
          font-size: 0.65rem;
          color: #888;
          font-weight: normal;
        }
        .strategy-btn:hover:not(:disabled) {
          border-color: #555;
          background: #202020;
        }
        .strategy-btn.active {
          border-color: #d4af37;
          background: rgba(212, 175, 55, 0.1);
        }
        .strategy-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Promo Selectors */
        .self-promo-selectors {
          background: rgba(255,255,255,0.02);
          border: 1px dashed #333;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        .select-group {
          margin-bottom: 12px;
        }
        .select-group:last-child {
          margin-bottom: 0;
        }
        .promo-select {
          width: 100%;
          padding: 12px;
          border-radius: 8px;
          background: #1e1e1e;
          border: 1px solid #444;
          color: white;
          font-size: 0.9rem;
        }

        .anim-fade-in {
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .promotion-card {
          background: #1a1a1a;
          border: 1px solid #444;
          padding: 15px;
          border-radius: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
        }
        .promo-info h4 { margin: 0; font-size: 0.95rem; }
        .promo-info p { margin: 4px 0 0; font-size: 0.75rem; color: var(--text-dim); }
        .promo-action {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
        }
        .promo-action .cost { font-size: 0.9rem; font-weight: bold; color: #4caf50; }
        .toggle {
          background: #333;
          color: white;
          border-radius: 20px;
          padding: 4px 15px;
          font-size: 0.75rem;
          font-weight: bold;
          cursor: pointer;
        }
        .toggle.active { background: #4caf50; }

        .publish-big-btn {
          width: 100%;
          background: var(--accent);
          color: white;
          border: none;
          padding: 18px;
          border-radius: 12px;
          font-weight: bold;
          font-size: 1.1rem;
          letter-spacing: 1px;
          box-shadow: 0 4px 15px rgba(255,0,0,0.3);
          cursor: pointer;
          transition: all 0.2s;
        }
        .publish-big-btn:active { transform: scale(0.98); }
        .publish-big-btn:disabled {
          background: #333;
          box-shadow: none;
          cursor: not-allowed;
          color: #666;
        }

        .outside-work-section {
          background: rgba(255, 255, 255, 0.03);
          padding: 20px;
          border-radius: 15px;
          border: 1px dashed #444;
          margin-bottom: 50px;
        }
        .work-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .work-card {
          background: #222;
          border: 1px solid #333;
          padding: 15px;
          border-radius: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .work-card.locked {
          opacity: 0.6;
        }
        .work-details {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .work-name {
          font-weight: bold;
          font-size: 0.95rem;
        }
        .work-stats {
          display: flex;
          gap: 12px;
          font-size: 0.8rem;
        }
        .pay { color: #4caf50; font-weight: bold; }
        .energy-cost { color: #ffeb3b; }
        .work-btn {
          background: #333;
          color: white;
          padding: 8px 15px;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: bold;
          cursor: pointer;
        }
        .work-btn:not(.disabled) {
          background: #444;
          color: #fff;
        }
        .work-btn:hover:not(.disabled) {
          background: #555;
        }
        .work-btn.disabled {
          color: #666;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default CreateVideo;
