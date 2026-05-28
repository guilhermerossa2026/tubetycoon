import React from 'react';
import { useGame } from '../context/GameContext';

const WeeklyReport: React.FC = () => {
  const { weeklyReport, closeReport } = useGame();

  if (!weeklyReport.isVisible) return null;

  const formatNumber = (num: number) => {
    if (Math.abs(num) >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (Math.abs(num) >= 1000) return (num / 1000).toFixed(1) + 'K';
    return Math.floor(num).toString();
  };

  return (
    <div className="report-overlay">
      <div className="report-modal">
        <div className="report-header">
          <h2>📊 Resumo da Semana</h2>
          <p>Seu desempenho nos últimos 7 dias</p>
        </div>

        <div className="report-grid">
          {weeklyReport.events.length > 0 && (
            <section className="report-section events-section">
              <h3>Notícias e Eventos</h3>
              <div className="events-list">
                {weeklyReport.events.map((ev, i) => (
                  <div key={i} className={`event-card ${ev.type}`}>
                    <strong>{ev.title}</strong>
                    <p>{ev.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="report-section">
            <h3>Crescimento</h3>
            <div className="report-item">
              <span>Visualizações:</span>
              <span className="value up">+{formatNumber(weeklyReport.views)}</span>
            </div>
            <div className="report-item">
              <span>Inscritos:</span>
              <span className="value up">+{formatNumber(weeklyReport.subscribers)}</span>
            </div>
          </section>

          <section className="report-section">
            <h3>Financeiro</h3>
            <div className="report-item">
              <span>YouTube AdSense:</span>
              <span className="value up">+${weeklyReport.youtubeEarnings.toFixed(2)}</span>
            </div>
            <div className="report-item">
              <span>Empresas (Lucro):</span>
              <span className="value up">+${weeklyReport.companyEarnings.toFixed(2)}</span>
            </div>
            <div className="report-item">
              <span>Investimentos:</span>
              <span className={`value ${weeklyReport.investmentChange >= 0 ? 'up' : 'down'}`}>
                {weeklyReport.investmentChange >= 0 ? '+' : ''}${weeklyReport.investmentChange.toFixed(2)}
              </span>
            </div>
            <div className="report-item">
              <span>Custos Operacionais:</span>
              <span className="value down">-${weeklyReport.expenses.toFixed(2)}</span>
            </div>
            <div className="report-item">
              <span>Aluguel/Manutenção (Casa):</span>
              <span className="value down">-${weeklyReport.housingExpenses.toFixed(2)}</span>
            </div>
          </section>
        </div>

        <div className="report-total">
          <span>Saldo Líquido da Semana:</span>
          <span className={`total-value ${weeklyReport.netTotal >= 0 ? 'up' : 'down'}`}>
            ${weeklyReport.netTotal.toFixed(2)}
          </span>
        </div>

        <button className="close-report-btn" onClick={closeReport}>
          CONTINUAR CARREIRA
        </button>
      </div>

      <style>{`
        .report-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 20px;
        }
        .report-modal {
          background: #1a1a1a;
          width: 100%;
          max-width: 500px;
          border-radius: 20px;
          padding: 30px;
          border: 2px solid #333;
          animation: slideUp 0.4s ease-out;
        }
        @keyframes slideUp {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .report-header {
          text-align: center;
          margin-bottom: 30px;
        }
        .report-header h2 { margin: 0; color: var(--accent); }
        .report-header p { color: #888; font-size: 0.9rem; margin: 5px 0 0; }

        .report-grid {
          display: flex;
          flex-direction: column;
          gap: 25px;
          margin-bottom: 30px;
          max-height: 400px;
          overflow-y: auto;
          padding-right: 10px;
        }
        .events-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .event-card {
          padding: 12px;
          border-radius: 8px;
          font-size: 0.85rem;
          border-left: 4px solid #888;
          background: #252525;
        }
        .event-card.positive { border-left-color: #4caf50; }
        .event-card.negative { border-left-color: #f44336; }
        .event-card strong { display: block; margin-bottom: 3px; }
        .event-card p { margin: 0; color: #aaa; }
        .report-section h3 {
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #666;
          margin-bottom: 12px;
          border-bottom: 1px solid #333;
          padding-bottom: 5px;
        }
        .report-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 0.95rem;
        }
        .value.up { color: #4caf50; font-weight: bold; }
        .value.down { color: #f44336; font-weight: bold; }

        .report-total {
          background: #222;
          padding: 20px;
          border-radius: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
        }
        .total-value {
          font-size: 1.4rem;
          font-weight: 900;
        }

        .close-report-btn {
          width: 100%;
          background: var(--accent);
          color: white;
          padding: 15px;
          border-radius: 12px;
          font-weight: bold;
          font-size: 1rem;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default WeeklyReport;
