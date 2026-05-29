import React, { useState } from 'react';
import { useGame } from '../context/GameContext';

const Investments: React.FC = () => {
  const { 
    investments, 
    money, 
    buyInvestment, 
    sellInvestment, 
    currentMarketEvent,
    investmentWallet,
    depositToInvestmentWallet,
    withdrawFromInvestmentWallet
  } = useGame();
  const [activeCategory, setActiveCategory] = useState<'all' | 'stock' | 'crypto' | 'fii' | 'fixed'>('all');
  const [amounts, setAmounts] = useState<{ [key: string]: number }>({});

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleAmountChange = (id: string, value: string) => {
    const num = parseInt(value) || 0;
    setAmounts(prev => ({ ...prev, [id]: Math.max(0, num) }));
  };

  const adjustAmount = (id: string, delta: number, maxVal?: number) => {
    const current = amounts[id] || 1;
    let newVal = Math.max(1, current + delta);
    if (maxVal !== undefined) {
      newVal = Math.min(newVal, maxVal);
    }
    setAmounts(prev => ({ ...prev, [id]: newVal }));
  };

  const setMaxAmount = (id: string, type: 'buy' | 'sell', price: number, owned: number) => {
    if (type === 'buy') {
      const maxBuy = Math.floor(investmentWallet / price);
      setAmounts(prev => ({ ...prev, [id]: Math.max(1, maxBuy) }));
    } else {
      setAmounts(prev => ({ ...prev, [id]: Math.max(1, owned) }));
    }
  };

  // Portfolio calculations
  const portfolioEquity = investments.reduce((sum, inv) => sum + (inv.owned * inv.price), 0);
  const portfolioCost = investments.reduce((sum, inv) => sum + (inv.owned * (inv.averagePrice || 0)), 0);
  const portfolioPL = portfolioEquity - portfolioCost;
  const portfolioPLPercent = portfolioCost > 0 ? (portfolioPL / portfolioCost) * 100 : 0;

  // Category distributions
  const filterByType = (type: string) => investments.filter(inv => inv.type === type);
  const stockValue = filterByType('stock').reduce((s, i) => s + (i.owned * i.price), 0);
  const cryptoValue = filterByType('crypto').reduce((s, i) => s + (i.owned * i.price), 0);
  const fiiValue = filterByType('fii').reduce((s, i) => s + (i.owned * i.price), 0);
  const fixedValue = filterByType('fixed').reduce((s, i) => s + (i.owned * i.price), 0);

  const totalAllocated = stockValue + cryptoValue + fiiValue + fixedValue;
  const getPercentage = (value: number) => {
    if (totalAllocated === 0) return 0;
    return (value / totalAllocated) * 100;
  };

  // Filtered investments list
  const filteredInvestments = investments.filter(inv => {
    if (activeCategory === 'all') return true;
    return inv.type === activeCategory;
  });

  // Render SVG Sparkline Chart (last 8 weeks)
  const renderSparkline = (inv: any) => {
    const history = inv.history && inv.history.length > 0 ? inv.history : [inv.price, inv.price];
    const min = Math.min(...history);
    const max = Math.max(...history);
    const range = max - min === 0 ? 1 : max - min;
    
    // SVG Dimensions
    const width = 140;
    const height = 45;

    const points = history.map((val: number, idx: number) => {
      const x = (idx / (history.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 10) - 5;
      return { x, y };
    });

    const pathData = points.map((p: any, i: number) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const fillData = `${pathData} L ${width} ${height} L 0 ${height} Z`;
    
    const isUp = inv.price >= inv.previousPrice;
    const color = isUp ? '#10b981' : '#ef4444';

    return (
      <svg width={width} height={height} className="sparkline-svg">
        <defs>
          <linearGradient id={`grad-${inv.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path d={fillData} fill={`url(#grad-${inv.id})`} />
        <path d={pathData} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  };

  const getRiskLabel = (type: string, id: string) => {
    if (type === 'fixed') return { text: '🛡️ Renda Fixa', class: 'risk-zero' };
    if (type === 'fii') return { text: '🏢 FII Conservador', class: 'risk-low' };
    if (id === 'doge') return { text: '🔥 Risco Extremo', class: 'risk-extreme' };
    if (type === 'crypto') return { text: '⚡ Alta Volatilidade', class: 'risk-high' };
    return { text: '📈 Risco Moderado', class: 'risk-medium' };
  };

  return (
    <div className="investments-dashboard scrollable-content animate-fade-in">
      
      {/* Dynamic Top Banner for Active Market Events */}
      {currentMarketEvent ? (
        <div className={`market-alert-banner ${currentMarketEvent.type}`}>
          <div className="banner-pulse-icon">🚨</div>
          <div className="banner-content">
            <strong>EVENTO MACROECONÔMICO: {currentMarketEvent.title}</strong>
            <p>{currentMarketEvent.desc}</p>
          </div>
        </div>
      ) : (
        <div className="market-alert-banner neutral">
          <div className="banner-pulse-icon">☕</div>
          <div className="banner-content">
            <strong>MERCADO EM ESTABILIDADE</strong>
            <p>Nenhum grande evento macroeconômico ativo esta semana. Ótimo momento para rebalancear a carteira.</p>
          </div>
        </div>
      )}

      <div className="investments-main-grid">
        
        {/* LEFT COLUMN: Portfolio Dashboard */}
        <section className="portfolio-stats-card">
          <div className="card-header">
            <h3>💼 Sua Carteira de Ativos</h3>
            <span className="broker-seal">🛡️ Corretora Conectada</span>
          </div>

          <div className="equity-box">
            <span className="lbl">Patrimônio Líquido em Ativos</span>
            <strong className="equity-val">${formatNumber(portfolioEquity)}</strong>
            
            <div className={`portfolio-pl-row ${portfolioPL >= 0 ? 'up' : 'down'}`}>
              <span className="arrow">{portfolioPL >= 0 ? '▲' : '▼'}</span>
              <span>
                {portfolioPL >= 0 ? '+' : ''}${formatNumber(portfolioPL)} ({portfolioPLPercent.toFixed(2)}%)
              </span>
              <small className="sub-label">lucro não realizado</small>
            </div>
          </div>

          <div className="portfolio-liquid-cash">
            <div className="cash-item">
              <span className="lbl">Caixa da Carteira (Corretora):</span>
              <strong className="text-gold">${formatNumber(investmentWallet)}</strong>
            </div>
            <div className="cash-item">
              <span className="lbl">Caixa Pessoal PF:</span>
              <strong className={money >= 0 ? 'text-green' : 'text-red'}>
                {money < 0 ? '-' : ''}${formatNumber(Math.abs(money))}
              </strong>
            </div>
            <div className="cash-item">
              <span className="lbl">Estimado/semana FII + RF:</span>
              <strong className="text-blue">
                +${formatNumber(investments.reduce((sum, i) => sum + (i.owned * i.price * (i.dividendYield || 0)), 0))}
              </strong>
            </div>
          </div>

          {/* Transfer Box */}
          <div className="transfer-box">
            <h4>🔄 Movimentar Recursos</h4>
            <div className="transfer-input-row">
              <input 
                type="number" 
                placeholder="Valor $" 
                id="transfer-amount"
                min="1"
                className="transfer-input"
              />
              <div className="transfer-buttons">
                <button 
                  className="btn-transfer deposit"
                  onClick={() => {
                    const el = document.getElementById('transfer-amount') as HTMLInputElement;
                    const val = parseFloat(el?.value || '0');
                    if (val > 0) {
                      depositToInvestmentWallet(val);
                      if (el) el.value = '';
                    } else {
                      alert("Digite um valor válido para depositar!");
                    }
                  }}
                >
                  📥 Depositar na Corretora
                </button>
                <button 
                  className="btn-transfer withdraw"
                  onClick={() => {
                    const el = document.getElementById('transfer-amount') as HTMLInputElement;
                    const val = parseFloat(el?.value || '0');
                    if (val > 0) {
                      withdrawFromInvestmentWallet(val);
                      if (el) el.value = '';
                    } else {
                      alert("Digite um valor válido para resgatar!");
                    }
                  }}
                >
                  📤 Resgatar para PF
                </button>
              </div>
            </div>
            <small className="transfer-note">Transfira saldo para a corretora para operar e receber dividendos!</small>
          </div>

          {/* Allocation Breakdown Chart */}
          <div className="allocation-box">
            <h4>📊 Distribuição Patrimonial</h4>
            {totalAllocated === 0 ? (
              <p className="no-allocation-text">Nenhum ativo adquirido ainda. Comece a comprar no terminal ao lado para diversificar!</p>
            ) : (
              <div className="allocation-list">
                <div className="alloc-item">
                  <div className="alloc-header">
                    <span>📈 Ações</span>
                    <strong>{getPercentage(stockValue).toFixed(1)}%</strong>
                  </div>
                  <div className="alloc-bar-bg">
                    <div className="alloc-bar-fill stock" style={{ width: `${getPercentage(stockValue)}%` }}></div>
                  </div>
                </div>

                <div className="alloc-item">
                  <div className="alloc-header">
                    <span>🪙 Criptoativos</span>
                    <strong>{getPercentage(cryptoValue).toFixed(1)}%</strong>
                  </div>
                  <div className="alloc-bar-bg">
                    <div className="alloc-bar-fill crypto" style={{ width: `${getPercentage(cryptoValue)}%` }}></div>
                  </div>
                </div>

                <div className="alloc-item">
                  <div className="alloc-header">
                    <span>🏢 FIIs (Fundos Imobiliários)</span>
                    <strong>{getPercentage(fiiValue).toFixed(1)}%</strong>
                  </div>
                  <div className="alloc-bar-bg">
                    <div className="alloc-bar-fill fii" style={{ width: `${getPercentage(fiiValue)}%` }}></div>
                  </div>
                </div>

                <div className="alloc-item">
                  <div className="alloc-header">
                    <span>🛡️ Renda Fixa</span>
                    <strong>{getPercentage(fixedValue).toFixed(1)}%</strong>
                  </div>
                  <div className="alloc-bar-bg">
                    <div className="alloc-bar-fill fixed" style={{ width: `${getPercentage(fixedValue)}%` }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* RIGHT COLUMN: Market Assets Terminal */}
        <section className="market-terminal-card">
          <div className="terminal-header">
            <h3>📈 Terminal de Negociações</h3>
            
            {/* Sub Tabs Category Selector */}
            <nav className="terminal-tabs">
              <button className={activeCategory === 'all' ? 'active' : ''} onClick={() => setActiveCategory('all')}>Todos</button>
              <button className={activeCategory === 'stock' ? 'active' : ''} onClick={() => setActiveCategory('stock')}>📈 Ações</button>
              <button className={activeCategory === 'crypto' ? 'active' : ''} onClick={() => setActiveCategory('crypto')}>🪙 Cripto</button>
              <button className={activeCategory === 'fii' ? 'active' : ''} onClick={() => setActiveCategory('fii')}>🏢 FIIs</button>
              <button className={activeCategory === 'fixed' ? 'active' : ''} onClick={() => setActiveCategory('fixed')}>🛡️ Renda Fixa</button>
            </nav>
          </div>

          <div className="terminal-assets-list">
            {filteredInvestments.map(inv => {
              const priceChange = inv.price - inv.previousPrice;
              const priceChangePercent = inv.previousPrice > 0 ? (priceChange / inv.previousPrice) * 100 : 0;
              const isUp = priceChange >= 0;
              const amount = amounts[inv.id] || 1;
              const cost = inv.price * amount;
              const canAfford = investmentWallet >= cost;

              // Individual asset metrics
              const assetCost = inv.owned * (inv.averagePrice || 0);
              const assetValue = inv.owned * inv.price;
              const assetPL = assetValue - assetCost;
              const assetPLPercent = assetCost > 0 ? (assetPL / assetCost) * 100 : 0;

              const risk = getRiskLabel(inv.type, inv.id);

              return (
                <div key={inv.id} className="terminal-asset-card">
                  
                  {/* Left Side: Asset ID & Name */}
                  <div className="asset-main-info">
                    <div className="symbol-row">
                      <span className="symbol-badge">{inv.symbol}</span>
                      <span className={`risk-badge ${risk.class}`}>{risk.text}</span>
                    </div>
                    <span className="name">{inv.name}</span>
                    
                    {inv.type === 'fii' && (
                      <span className="yield-tag">💰 Dividend Yield: {((inv.dividendYield || 0) * 100).toFixed(2)}%/semana</span>
                    )}
                    {inv.type === 'fixed' && (
                      <span className="yield-tag">📈 Rentabilidade: +{((inv.dividendYield || 0) * 100).toFixed(2)}%/semana</span>
                    )}
                  </div>

                  {/* Sparkline Chart representation */}
                  <div className="asset-sparkline-panel">
                    {renderSparkline(inv)}
                  </div>

                  {/* Pricing and Profit indicators */}
                  <div className="asset-pricing-panel">
                    <div className="price-row">
                      <strong className={`current-price ${isUp ? 'up' : 'down'}`}>
                        ${formatNumber(inv.price)}
                      </strong>
                      <span className={`percent-badge ${isUp ? 'up' : 'down'}`}>
                        {isUp ? '▲' : '▼'} {Math.abs(priceChangePercent).toFixed(2)}%
                      </span>
                    </div>

                    {inv.owned > 0 && (
                      <div className="position-metrics">
                        <span>Preço Médio: <strong>${formatNumber(inv.averagePrice || 0)}</strong></span>
                        <span>
                          Lucro: <strong className={assetPL >= 0 ? 'text-green' : 'text-red'}>
                            {assetPL >= 0 ? '+' : ''}${formatNumber(assetPL)} ({assetPLPercent.toFixed(1)}%)
                          </strong>
                        </span>
                        <span>Posição: <strong>{inv.owned} cotas</strong> (${formatNumber(assetValue)})</span>
                      </div>
                    )}
                  </div>

                  {/* Action transaction controls */}
                  <div className="asset-actions-panel">
                    
                    {/* Amount Input and increment controls */}
                    <div className="quantity-selector">
                      <button className="qty-adj" onClick={() => adjustAmount(inv.id, -1)}>-</button>
                      <input 
                        type="number" 
                        min="1" 
                        value={amount} 
                        onChange={(e) => handleAmountChange(inv.id, e.target.value)}
                        className="qty-input"
                      />
                      <button className="qty-adj" onClick={() => adjustAmount(inv.id, 1)}>+</button>
                      
                      <div className="quick-selectors">
                        <button className="quick-btn" onClick={() => adjustAmount(inv.id, 10)}>+10</button>
                        <button className="quick-btn" onClick={() => adjustAmount(inv.id, 100)}>+100</button>
                        <button className="quick-btn max" onClick={() => setMaxAmount(inv.id, 'buy', inv.price, inv.owned)}>Comp Max</button>
                        <button className="quick-btn max" onClick={() => setMaxAmount(inv.id, 'sell', inv.price, inv.owned)}>Vend Max</button>
                      </div>
                    </div>

                    {/* Buy and Sell Action triggers */}
                    <div className="action-buttons">
                      <button 
                        className={`btn-trade buy ${!canAfford ? 'disabled' : ''}`}
                        onClick={() => buyInvestment(inv.id, amount)}
                        disabled={!canAfford}
                      >
                        Comprar (${formatNumber(cost)})
                      </button>
                      <button 
                        className={`btn-trade sell ${inv.owned < amount ? 'disabled' : ''}`}
                        onClick={() => sellInvestment(inv.id, amount)}
                        disabled={inv.owned < amount}
                      >
                        Vender (${formatNumber(inv.price * amount)})
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </div>

      <style>{`
        .investments-dashboard {
          padding: 24px;
          background: #111115;
          min-height: 100%;
        }

        /* Top Banner alerts */
        .market-alert-banner {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 20px;
          border-radius: 12px;
          margin-bottom: 24px;
          border: 1px solid rgba(255,255,255,0.05);
          animation: slide-down 0.4s ease-out;
        }

        .market-alert-banner.neutral {
          background: linear-gradient(90deg, rgba(30,30,40,0.6) 0%, rgba(15,15,22,0.8) 100%);
          border-left: 5px solid #6b7280;
        }

        .market-alert-banner.bull {
          background: linear-gradient(90deg, rgba(16,185,129,0.15) 0%, rgba(10,10,15,0.8) 100%);
          border-left: 5px solid #10b981;
          border-color: rgba(16,185,129,0.2);
        }

        .market-alert-banner.bear {
          background: linear-gradient(90deg, rgba(239,68,68,0.15) 0%, rgba(10,10,15,0.8) 100%);
          border-left: 5px solid #ef4444;
          border-color: rgba(239,68,68,0.2);
        }

        .market-alert-banner.hype {
          background: linear-gradient(90deg, rgba(245,158,11,0.15) 0%, rgba(10,10,15,0.8) 100%);
          border-left: 5px solid #f59e0b;
          border-color: rgba(245,158,11,0.2);
        }

        .banner-pulse-icon {
          font-size: 1.5rem;
          animation: pulse 1.5s infinite alternate;
        }

        .banner-content strong {
          color: white;
          font-size: 0.9rem;
          letter-spacing: 0.5px;
        }

        .banner-content p {
          color: #a0a0b0;
          font-size: 0.82rem;
          margin: 2px 0 0 0;
        }

        /* Dashboard Grid Layout */
        .investments-main-grid {
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 24px;
          align-items: start;
        }

        @media (max-width: 1080px) {
          .investments-main-grid {
            grid-template-columns: 1fr;
          }
        }

        /* LEFT CARD: Portfolio status representation */
        .portfolio-stats-card {
          background: linear-gradient(135deg, rgba(26,26,34,0.7) 0%, rgba(16,16,22,0.9) 100%);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 16px;
          padding: 20px;
          backdrop-filter: blur(10px);
        }

        .portfolio-stats-card .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          padding-bottom: 12px;
        }

        .portfolio-stats-card h3 {
          font-size: 1.05rem;
          font-weight: 800;
          color: white;
          margin: 0;
        }

        .broker-seal {
          font-size: 0.68rem;
          background: rgba(59,130,246,0.15);
          color: #60a5fa;
          padding: 3px 8px;
          border-radius: 20px;
          font-weight: 700;
        }

        .equity-box {
          margin-bottom: 20px;
        }

        .equity-box .lbl {
          font-size: 0.78rem;
          color: #808090;
        }

        .equity-val {
          display: block;
          font-size: 1.8rem;
          font-weight: 900;
          color: white;
          letter-spacing: -0.5px;
          margin: 2px 0;
        }

        .portfolio-pl-row {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          font-weight: 700;
        }

        .portfolio-pl-row.up { color: #10b981; }
        .portfolio-pl-row.down { color: #ef4444; }

        .portfolio-pl-row .sub-label {
          color: #808090;
          font-size: 0.7rem;
          font-weight: 500;
          margin-left: 4px;
        }

        .portfolio-liquid-cash {
          background: rgba(0,0,0,0.2);
          border-radius: 12px;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 24px;
        }

        .cash-item {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
        }

        .cash-item .lbl { color: #a0a0b0; }
        .cash-item strong { font-weight: 700; }
        .text-green { color: #10b981; }
        .text-blue { color: #60a5fa; }
        .text-red { color: #ef4444; }
        .transfer-box {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.04);
          border-radius: 12px;
          padding: 14px;
          margin-bottom: 24px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .transfer-box h4 {
          font-size: 0.82rem;
          font-weight: 800;
          color: white;
          margin: 0;
        }

        .transfer-input-row {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .transfer-input {
          background: rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 6px;
          padding: 8px 12px;
          color: white;
          font-size: 0.85rem;
          font-weight: bold;
          outline: none;
          text-align: center;
        }

        .transfer-input::placeholder {
          color: #505060;
        }

        .transfer-buttons {
          display: flex;
          gap: 6px;
        }

        .btn-transfer {
          flex: 1;
          border: none;
          border-radius: 6px;
          padding: 8px;
          font-size: 0.72rem;
          font-weight: 800;
          cursor: pointer;
          color: white;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
        }

        .btn-transfer.deposit {
          background: rgba(245,158,11,0.12);
          color: #fbbf24;
          border: 1px solid rgba(245,158,11,0.25);
        }

        .btn-transfer.deposit:hover {
          background: #f59e0b;
          color: black;
        }

        .btn-transfer.withdraw {
          background: rgba(59,130,246,0.12);
          color: #60a5fa;
          border: 1px solid rgba(59,130,246,0.25);
        }

        .btn-transfer.withdraw:hover {
          background: #3b82f6;
          color: white;
        }

        .transfer-note {
          font-size: 0.65rem;
          color: #606070;
          text-align: center;
          line-height: 1.3;
        }

        /* Allocation Horizontal bars representation */
        .allocation-box h4 {
          font-size: 0.85rem;
          font-weight: 800;
          color: white;
          margin: 0 0 12px 0;
        }

        .no-allocation-text {
          font-size: 0.75rem;
          color: #606070;
          line-height: 1.4;
          text-align: center;
          padding: 10px 0;
        }

        .allocation-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .alloc-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .alloc-header {
          display: flex;
          justify-content: space-between;
          font-size: 0.72rem;
          color: #a0a0b0;
        }

        .alloc-bar-bg {
          height: 6px;
          background: rgba(255,255,255,0.05);
          border-radius: 4px;
          overflow: hidden;
        }

        .alloc-bar-fill {
          height: 100%;
          border-radius: 4px;
        }

        .alloc-bar-fill.stock { background: #3b82f6; }
        .alloc-bar-fill.crypto { background: #f59e0b; }
        .alloc-bar-fill.fii { background: #10b981; }
        .alloc-bar-fill.fixed { background: #8b5cf6; }

        /* RIGHT CARD: Market broker catalog */
        .market-terminal-card {
          background: linear-gradient(135deg, rgba(20,20,25,0.6) 0%, rgba(15,15,20,0.8) 100%);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 16px;
          padding: 20px;
          backdrop-filter: blur(10px);
        }

        .terminal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 20px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          padding-bottom: 16px;
        }

        .market-terminal-card h3 {
          font-size: 1.05rem;
          font-weight: 800;
          color: white;
          margin: 0;
        }

        /* Category Nav sub tabs */
        .terminal-tabs {
          display: flex;
          background: rgba(0,0,0,0.2);
          padding: 4px;
          border-radius: 8px;
          gap: 4px;
        }

        .terminal-tabs button {
          background: none;
          color: #808090;
          border: none;
          padding: 6px 12px;
          font-size: 0.78rem;
          font-weight: 700;
          border-radius: 6px;
          transition: all 0.2s;
        }

        .terminal-tabs button:hover {
          color: white;
        }

        .terminal-tabs button.active {
          background: #3b82f6;
          color: white;
        }

        /* Asset lists */
        .terminal-assets-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .terminal-asset-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.03);
          border-radius: 12px;
          padding: 16px;
          display: grid;
          grid-template-columns: 240px 140px 180px 1fr;
          gap: 20px;
          align-items: center;
          transition: all 0.2s ease-in-out;
        }

        .terminal-asset-card:hover {
          border-color: rgba(59,130,246,0.2);
          background: rgba(255,255,255,0.03);
        }

        @media (max-width: 1400px) {
          .terminal-asset-card {
            grid-template-columns: 1fr 140px 180px;
            gap: 16px;
          }
          .asset-actions-panel {
            grid-column: span 3;
            margin-top: 10px;
            border-top: 1px solid rgba(255,255,255,0.05);
            padding-top: 12px;
          }
        }

        @media (max-width: 800px) {
          .terminal-asset-card {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          .asset-sparkline-panel {
            display: none;
          }
          .asset-actions-panel {
            grid-column: span 1;
          }
        }

        /* Asset sub panels */
        .asset-main-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .symbol-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .symbol-badge {
          font-size: 0.95rem;
          font-weight: 900;
          color: white;
          background: rgba(255,255,255,0.07);
          padding: 2px 6px;
          border-radius: 6px;
          letter-spacing: 0.5px;
        }

        .risk-badge {
          font-size: 0.65rem;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .risk-zero { background: rgba(139,92,246,0.15); color: #a78bfa; }
        .risk-low { background: rgba(16,185,129,0.15); color: #34d399; }
        .risk-medium { background: rgba(59,130,246,0.15); color: #60a5fa; }
        .risk-high { background: rgba(245,158,11,0.15); color: #fbbf24; }
        .risk-extreme { background: rgba(239,68,68,0.15); color: #f87171; animation: flash-red 1s infinite alternate; }

        .asset-main-info .name {
          font-size: 0.75rem;
          color: #808090;
        }

        .yield-tag {
          font-size: 0.68rem;
          color: #34d399;
          font-weight: 700;
          margin-top: 2px;
        }

        .asset-sparkline-panel {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .sparkline-svg {
          filter: drop-shadow(0 2px 8px rgba(0,0,0,0.15));
        }

        .asset-pricing-panel {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .price-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .current-price {
          font-size: 1.15rem;
          font-weight: 900;
          letter-spacing: -0.3px;
        }

        .current-price.up { color: #10b981; }
        .current-price.down { color: #ef4444; }

        .percent-badge {
          font-size: 0.7rem;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .percent-badge.up { background: rgba(16,185,129,0.1); color: #10b981; }
        .percent-badge.down { background: rgba(239,68,68,0.1); color: #ef4444; }

        .position-metrics {
          background: rgba(0,0,0,0.2);
          border-radius: 6px;
          padding: 6px 8px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          font-size: 0.68rem;
          color: #a0a0b0;
          line-height: 1.3;
        }

        .position-metrics strong {
          color: white;
        }

        /* Action triggers */
        .asset-actions-panel {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .quantity-selector {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .qty-adj {
          width: 24px;
          height: 24px;
          background: rgba(255,255,255,0.05);
          border: none;
          color: white;
          font-weight: bold;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .qty-adj:hover {
          background: rgba(255,255,255,0.1);
        }

        .qty-input {
          width: 48px;
          height: 24px;
          background: rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 4px;
          color: white;
          text-align: center;
          font-size: 0.75rem;
          font-weight: bold;
        }

        .quick-selectors {
          display: flex;
          gap: 4px;
          margin-left: 6px;
        }

        .quick-btn {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.02);
          color: #a0a0b0;
          font-size: 0.65rem;
          font-weight: 700;
          padding: 4px 6px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .quick-btn:hover {
          background: rgba(255,255,255,0.08);
          color: white;
        }

        .quick-btn.max {
          background: rgba(59,130,246,0.08);
          color: #60a5fa;
          border-color: rgba(59,130,246,0.1);
        }

        .quick-btn.max:hover {
          background: rgba(59,130,246,0.2);
          color: white;
        }

        .action-buttons {
          display: flex;
          gap: 6px;
        }

        .btn-trade {
          flex: 1;
          height: 28px;
          font-size: 0.75rem;
          font-weight: 800;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
          color: white;
        }

        .btn-trade.buy {
          background: #3b82f6;
          box-shadow: 0 2px 6px rgba(59,130,246,0.2);
        }

        .btn-trade.buy:hover:not(.disabled) {
          background: #2563eb;
          transform: translateY(-1px);
        }

        .btn-trade.sell {
          background: #ef4444;
          box-shadow: 0 2px 6px rgba(239,68,68,0.2);
        }

        .btn-trade.sell:hover:not(.disabled) {
          background: #dc2626;
          transform: translateY(-1px);
        }

        .btn-trade.disabled {
          background: rgba(255,255,255,0.03) !important;
          color: #505060 !important;
          box-shadow: none !important;
          cursor: not-allowed;
        }

        /* Animations */
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(1.1); opacity: 1; }
        }

        @keyframes flash-red {
          0% { background: rgba(239,68,68,0.15); box-shadow: none; }
          100% { background: rgba(239,68,68,0.3); box-shadow: 0 0 8px rgba(239,68,68,0.2); }
        }

        @keyframes slide-down {
          0% { transform: translateY(-10px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Investments;
