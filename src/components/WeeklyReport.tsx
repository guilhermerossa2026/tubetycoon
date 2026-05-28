import React, { useState } from 'react';
import { useGame } from '../context/GameContext';

const WeeklyReport: React.FC = () => {
  const { weeklyReport, closeReport, totalTaxesPaid, cryptoToken } = useGame();
  const [currentPage, setCurrentPage] = useState<1 | 2>(1);

  if (!weeklyReport.isVisible) return null;

  const formatNumber = (num: number) => {
    if (Math.abs(num) >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (Math.abs(num) >= 1000) return (num / 1000).toFixed(2) + 'K';
    return Math.floor(num).toLocaleString();
  };

  const maxProfitVal = weeklyReport.dreData && weeklyReport.dreData.length > 0
    ? Math.max(...weeklyReport.dreData.map(item => Math.max(item.revenue, Math.abs(item.netProfit), 1)))
    : 1;

  return (
    <div className="report-overlay">
      <div className="report-modal gazeta-modal">
        {/* Gazeta Header Banner */}
        <header className="gazeta-header">
          <div className="gazeta-top-line">
            <span>Edição Fiduciária Especial</span>
            <span>Tube Tycoon Corporate</span>
          </div>
          <h1>📰 GAZETA DE TUBE TYCOON</h1>
          <div className="gazeta-sub-banner">
            <span>Semana {useGame().week - 1}</span>
            <span>Prestígio Fiscal (Impostos): <strong>${formatNumber(totalTaxesPaid)}</strong></span>
          </div>
        </header>

        {/* Tab Navigation for Gazeta Pages */}
        <nav className="gazeta-tabs">
          <button 
            className={`gazeta-tab-btn ${currentPage === 1 ? 'active' : ''}`}
            onClick={() => setCurrentPage(1)}
          >
            📊 Página 1: Demonstrativo DRE
          </button>
          <button 
            className={`gazeta-tab-btn ${currentPage === 2 ? 'active' : ''}`}
            onClick={() => setCurrentPage(2)}
          >
            🗞️ Página 2: Noticiário do Mercado
          </button>
        </nav>

        {/* Page Content */}
        <div className="gazeta-body">
          {currentPage === 1 ? (
            <div className="gazeta-page page-dre">
              <h3>Demonstrativo Comparativo Semanal (DRE)</h3>
              <p className="page-desc">Análise gráfica de faturamento bruto vs margem líquida por empresa ativa e receitas secundárias.</p>
              
              <div className="dre-chart-container">
                {(!weeklyReport.dreData || weeklyReport.dreData.length === 0) ? (
                  <div className="empty-chart">Nenhuma operação corporativa registrada nesta semana.</div>
                ) : (
                  weeklyReport.dreData.map((item, idx) => {
                    const revPercent = Math.min(100, (item.revenue / maxProfitVal) * 100);
                    const netPercent = Math.min(100, (Math.max(0, item.netProfit) / maxProfitVal) * 100);
                    const lossPercent = Math.min(100, (Math.abs(Math.min(0, item.netProfit)) / maxProfitVal) * 100);

                    return (
                      <div key={idx} className="dre-chart-row">
                        <div className="dre-row-header">
                          <span className="comp-name" style={{ color: item.color }}>■ {item.name}</span>
                          <span className="comp-vals">
                            Rev: <strong className="val-up">${formatNumber(item.revenue)}</strong> | 
                            Lucro: <strong className={item.netProfit >= 0 ? 'val-up' : 'val-down'}>
                              ${formatNumber(item.netProfit)}
                            </strong>
                          </span>
                        </div>
                        
                        <div className="dre-bar-visuals">
                          {/* Revenue Bar */}
                          <div className="bar-track">
                            <div className="bar-fill revenue-bar" style={{ width: `${revPercent}%`, backgroundColor: item.color }}></div>
                            <span className="bar-label">Bruto</span>
                          </div>
                          
                          {/* Net Profit Bar */}
                          {item.netProfit >= 0 ? (
                            <div className="bar-track">
                              <div className="bar-fill profit-bar" style={{ width: `${netPercent}%` }}></div>
                              <span className="bar-label green-text">Lucro</span>
                            </div>
                          ) : (
                            <div className="bar-track">
                              <div className="bar-fill loss-bar" style={{ width: `${lossPercent}%` }}></div>
                              <span className="bar-label red-text">Prejuízo</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* General Financial Summary */}
              <div className="pf-summary-box">
                <h4>Fluxo Pessoal do Canal (PF)</h4>
                <div className="pf-summary-grid">
                  <div className="pf-summary-item">
                    <span>AdSense YouTube:</span>
                    <span className="val-up">+${weeklyReport.youtubeEarnings.toFixed(2)}</span>
                  </div>
                  <div className="pf-summary-item">
                    <span>Custos Moradia/Aluguel:</span>
                    <span className="val-down">-${weeklyReport.housingExpenses.toFixed(2)}</span>
                  </div>
                  <div className="pf-summary-item">
                    <span>Variação de Ações:</span>
                    <span className={weeklyReport.investmentChange >= 0 ? 'val-up' : 'val-down'}>
                      {weeklyReport.investmentChange >= 0 ? '+' : ''}${weeklyReport.investmentChange.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="gazeta-page page-news">
              <h3>Noticiário Geral e Insights</h3>
              <p className="page-desc">Informações exclusivas que afetam a bolsa de valores fictícia, commodities físicas e reputação corporativa.</p>
              
              <div className="gazeta-news-feed">
                {weeklyReport.events.length === 0 ? (
                  <div className="news-item-card neutral">
                    <strong>NENHUMA ANOMALIA DE MERCADO</strong>
                    <p>Os mercados de commodities e ações continuaram estáveis nesta semana. Nenhuma flutuação brusca detectada pelos nossos correspondentes.</p>
                  </div>
                ) : (
                  weeklyReport.events.map((ev, i) => (
                    <div key={i} className={`news-item-card ${ev.type}`}>
                      <div className="news-bullet"></div>
                      <div className="news-content">
                        <strong>📢 {ev.title}</strong>
                        <p>{ev.desc}</p>
                      </div>
                    </div>
                  ))
                )}

                {cryptoToken && (
                  <div className="news-item-card web3-card">
                    <div className="news-bullet crypto-bullet"></div>
                    <div className="news-content">
                      <strong>🪙 MERCADO DO SEU TOKEN ({cryptoToken.symbol})</strong>
                      <p>
                        Cotação Atual: <strong className="gold-text">${cryptoToken.price.toFixed(4)}</strong> | 
                        Volume 24h: <strong>${formatNumber(cryptoToken.dailyVolume)}</strong>. 
                        {cryptoToken.price >= cryptoToken.previousPrice 
                          ? " Alta impulsionada por investidores institucionais que acreditam na holding." 
                          : " Queda técnica causada por correções de liquidez."}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Gazeta Footer Balance recap */}
        <div className="gazeta-footer">
          <div className="gazeta-net-total">
            <span>Saldo Líquido PF da Semana:</span>
            <span className={`net-val ${weeklyReport.netTotal >= 0 ? 'val-up' : 'val-down'}`}>
              ${formatNumber(weeklyReport.netTotal)}
            </span>
          </div>
          
          <button className="gazeta-action-btn" onClick={closeReport}>
            FECHAR GAZETA & CARREGAR PRÓXIMA SEMANA
          </button>
        </div>
      </div>

      <style>{`
        .report-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 20px;
        }
        .gazeta-modal {
          background: #121212;
          border: 3px double #d4af37;
          box-shadow: 0 0 30px rgba(212, 175, 55, 0.15);
          width: 100%;
          max-width: 600px;
          border-radius: 4px;
          padding: 20px;
          color: #eee;
          font-family: 'Outfit', 'Georgia', serif;
          animation: paperUnroll 0.5s cubic-bezier(0.1, 0.9, 0.2, 1);
        }

        @keyframes paperUnroll {
          from { transform: translateY(-50px) scale(0.95); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }

        /* Gazeta Header Styles */
        .gazeta-header {
          border-bottom: 2px solid #333;
          padding-bottom: 12px;
          margin-bottom: 15px;
          text-align: center;
        }
        .gazeta-top-line {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: #999;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          border-bottom: 1px solid #222;
          padding-bottom: 4px;
        }
        .gazeta-header h1 {
          font-size: 2.1rem;
          font-family: 'Times New Roman', Times, serif;
          font-weight: 900;
          letter-spacing: 0.5px;
          margin: 10px 0;
          color: #fff;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
        }
        .gazeta-sub-banner {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          color: #bbb;
          border-top: 1px solid #222;
          padding-top: 5px;
        }
        .gazeta-sub-banner strong {
          color: #d4af37;
        }

        /* Navigation Tabs */
        .gazeta-tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 15px;
          border-bottom: 1px solid #333;
          padding-bottom: 8px;
        }
        .gazeta-tab-btn {
          flex: 1;
          background: #1e1e1e;
          border: 1px solid #333;
          color: #bbb;
          padding: 10px;
          font-weight: bold;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
          border-radius: 4px;
        }
        .gazeta-tab-btn.active {
          background: #d4af37;
          color: #121212;
          border-color: #d4af37;
        }

        /* Gazeta Content Body */
        .gazeta-body {
          max-height: 380px;
          overflow-y: auto;
          margin-bottom: 15px;
          padding-right: 8px;
        }
        .gazeta-page {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .gazeta-page h3 {
          margin: 0;
          font-family: 'Times New Roman', serif;
          font-size: 1.25rem;
          color: #fff;
          border-bottom: 1px dashed #444;
          padding-bottom: 4px;
        }
        .page-desc {
          font-size: 0.8rem;
          color: #999;
          margin: 0;
          margin-top: -8px;
          line-height: 1.4;
        }

        /* DRE Comparative Chart Styles */
        .dre-chart-container {
          display: flex;
          flex-direction: column;
          gap: 14px;
          background: #181818;
          padding: 12px;
          border-radius: 6px;
          border: 1px solid #222;
        }
        .dre-chart-row {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .dre-row-header {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
        }
        .comp-name {
          font-weight: bold;
        }
        .comp-vals {
          font-size: 0.8rem;
          color: #ccc;
        }
        .dre-bar-visuals {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .bar-track {
          background: #252525;
          height: 14px;
          border-radius: 3px;
          position: relative;
          overflow: hidden;
        }
        .bar-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.6s ease-out;
        }
        .revenue-bar {
          background-color: var(--accent);
        }
        .profit-bar {
          background-color: #2ecc71;
        }
        .loss-bar {
          background-color: #e74c3c;
        }
        .bar-label {
          position: absolute;
          left: 6px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 0.65rem;
          font-weight: 900;
          text-shadow: 1px 1px 1px #000;
          color: white;
          text-transform: uppercase;
        }
        .green-text { color: #2ecc71 !important; }
        .red-text { color: #e74c3c !important; }

        .empty-chart {
          text-align: center;
          padding: 20px;
          color: #666;
          font-size: 0.85rem;
        }

        /* PF Summary Box */
        .pf-summary-box {
          background: #181818;
          padding: 12px;
          border-radius: 6px;
          border: 1px solid #222;
        }
        .pf-summary-box h4 {
          margin: 0 0 8px 0;
          font-size: 0.9rem;
          color: #d4af37;
          text-transform: uppercase;
        }
        .pf-summary-grid {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .pf-summary-item {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
        }

        /* Gazette News Feed Styles */
        .gazeta-news-feed {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .news-item-card {
          display: flex;
          gap: 12px;
          background: #1c1c1c;
          border: 1px solid #282828;
          padding: 12px;
          border-radius: 4px;
          font-size: 0.85rem;
          line-height: 1.45;
        }
        .news-bullet {
          width: 4px;
          min-width: 4px;
          background: #bbb;
          border-radius: 2px;
        }
        .news-item-card.positive .news-bullet { background: #2ecc71; }
        .news-item-card.negative .news-bullet { background: #e74c3c; }
        .news-item-card.web3-card .news-bullet { background: #a832a4; }
        .news-content strong {
          display: block;
          margin-bottom: 3px;
          font-family: 'Times New Roman', serif;
          font-size: 0.95rem;
        }
        .news-content p {
          margin: 0;
          color: #bbb;
        }

        .gold-text { color: #d4af37; }
        .val-up { color: #2ecc71; font-weight: bold; }
        .val-down { color: #e74c3c; font-weight: bold; }

        /* Gazeta Footer */
        .gazeta-footer {
          border-top: 2px solid #333;
          padding-top: 15px;
          margin-top: 15px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .gazeta-net-total {
          display: flex;
          justify-content: space-between;
          font-size: 1.05rem;
          font-weight: bold;
          background: #181818;
          padding: 12px;
          border-radius: 4px;
          border: 1px solid #222;
        }
        .net-val {
          font-size: 1.25rem;
        }
        .gazeta-action-btn {
          width: 100%;
          background: #d4af37;
          color: #121212;
          border: none;
          padding: 14px;
          font-weight: 900;
          font-size: 0.95rem;
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 1.0px;
          transition: background 0.2s;
          border-radius: 4px;
        }
        .gazeta-action-btn:hover {
          background: #c5a02c;
        }
      `}</style>
    </div>
  );
};

export default WeeklyReport;
