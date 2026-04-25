import React, { useState } from 'react';
import { useGame } from '../context/GameContext';

const Company: React.FC = () => {
  const { company, money, createCompany, hireYouTuber, hireStaff } = useGame();
  const [newName, setNewName] = useState('');
  const [ytName, setYtName] = useState('');

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(2) + 'K';
    return num.toFixed(2);
  };

  if (!company.exists) {
    return (
      <div className="tab-container company-setup">
        <h2>Criar Agência de YouTubers</h2>
        <div className="setup-card">
          <p>Gerencie talentos, feche contratos e construa um império na internet.</p>
          <div className="input-group">
            <label>Nome da Agência</label>
            <input 
              type="text" 
              value={newName} 
              onChange={(e) => setNewName(e.target.value)} 
              placeholder="Ex: Tube Media Group"
            />
          </div>
          <button 
            className="create-btn"
            onClick={() => newName && createCompany(newName)}
            disabled={!newName}
          >
            Fundar Empresa ($0)
          </button>
        </div>

        <style>{`
          .company-setup {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            height: 100%;
          }
          .setup-card {
            background: var(--bg-card);
            padding: 30px;
            border-radius: 15px;
            width: 100%;
            max-width: 400px;
            margin-top: 20px;
          }
          .input-group {
            margin: 20px 0;
            text-align: left;
          }
          .input-group label {
            display: block;
            margin-bottom: 8px;
            font-size: 0.9rem;
            color: var(--text-dim);
          }
          .input-group input {
            width: 100%;
            padding: 12px;
            border-radius: 8px;
            background: #333;
            border: 1px solid #444;
            color: white;
          }
          .create-btn {
            width: 100%;
            background: var(--accent);
            color: white;
            padding: 12px;
            border-radius: 8px;
            font-weight: bold;
            font-size: 1rem;
          }
          .create-btn:disabled {
            background: #444;
            cursor: not-allowed;
          }
        `}</style>
      </div>
    );
  }

  const totalRoyalties = company.youtubers.reduce((acc, yt) => acc + (yt.dailyEarnings * yt.royaltyRate), 0);
  const totalSalaries = company.staff.reduce((acc, s) => acc + s.salary, 0);
  const taxes = totalRoyalties * 0.05;

  return (
    <div className="tab-container company-dashboard">
      <div className="company-header">
        <h2>{company.name}</h2>
        <div className="level-badge">Nível {company.level}</div>
      </div>

      <div className="stats-grid">
        <div className="stat-card highlight">
          <span className="label">Lucro / 5s</span>
          <span className={`value ${(totalRoyalties - totalSalaries - taxes) >= 0 ? 'up' : 'down'}`}>
            ${formatNumber(totalRoyalties - totalSalaries - taxes)}
          </span>
        </div>
        <div className="stat-card">
          <span className="label">Royalties</span>
          <span className="value">+${formatNumber(totalRoyalties)}</span>
        </div>
        <div className="stat-card">
          <span className="label">Salários</span>
          <span className="value">-${formatNumber(totalSalaries)}</span>
        </div>
        <div className="stat-card">
          <span className="label">Impostos (5%)</span>
          <span className="value">-${formatNumber(taxes)}</span>
        </div>
      </div>

      <div className="company-section">
        <div className="section-header">
          <h3>YouTubers Contratados ({company.youtubers.length})</h3>
          <button className="add-btn" onClick={() => setYtName(prompt('Nome do YouTuber:') || '')}>
            + Contratar
          </button>
        </div>
        <div className="list">
          {company.youtubers.length === 0 && <p className="empty">Nenhum YouTuber contratado.</p>}
          {company.youtubers.map(yt => (
            <div key={yt.id} className="item-card">
              <div className="info">
                <span className="name">{yt.name}</span>
                <span className="sub-info">{formatNumber(yt.subscribers)} inscritos</span>
              </div>
              <div className="royalty">
                <span className="rate">{(yt.royaltyRate * 100).toFixed(0)}% Royalty</span>
                <span className="gain">+${formatNumber(yt.dailyEarnings * yt.royaltyRate)}</span>
              </div>
            </div>
          ))}
          {ytName && (hireYouTuber(ytName), setYtName(''))}
        </div>
      </div>

      <div className="company-section">
        <div className="section-header">
          <h3>Equipe Interna ({company.staff.length})</h3>
          <div className="hire-actions">
            <button onClick={() => hireStaff('editor')}>+ Editor</button>
            <button onClick={() => hireStaff('manager')}>+ Manager</button>
          </div>
        </div>
        <div className="list">
          {company.staff.length === 0 && <p className="empty">Nenhum funcionário contratado.</p>}
          {company.staff.map(s => (
            <div key={s.id} className="item-card">
              <div className="info">
                <span className="name">{s.name}</span>
                <span className="sub-info">{s.role.toUpperCase()}</span>
              </div>
              <div className="salary">
                <span className="gain">-${formatNumber(s.salary)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .company-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .level-badge {
          background: var(--accent);
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: bold;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 25px;
        }
        .stat-card {
          background: var(--bg-card);
          padding: 12px;
          border-radius: 10px;
          display: flex;
          flex-direction: column;
        }
        .stat-card.highlight {
          grid-column: span 2;
          background: #333;
          border-left: 4px solid var(--accent);
        }
        .stat-card .label {
          font-size: 0.7rem;
          color: var(--text-dim);
          margin-bottom: 4px;
        }
        .stat-card .value {
          font-weight: bold;
          font-size: 1.1rem;
        }
        .value.up { color: #4caf50; }
        .value.down { color: #f44336; }

        .company-section {
          margin-bottom: 25px;
        }
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .section-header h3 {
          font-size: 1rem;
          color: var(--primary);
        }
        .add-btn, .hire-actions button {
          background: #333;
          color: white;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.8rem;
        }
        .hire-actions {
          display: flex;
          gap: 5px;
        }
        .list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .empty {
          font-size: 0.85rem;
          color: var(--text-dim);
          text-align: center;
          padding: 10px;
        }
        .item-card {
          background: var(--bg-card);
          padding: 12px;
          border-radius: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .info {
          display: flex;
          flex-direction: column;
        }
        .info .name {
          font-weight: bold;
          font-size: 0.9rem;
        }
        .info .sub-info {
          font-size: 0.75rem;
          color: var(--text-dim);
        }
        .royalty, .salary {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
        .royalty .rate {
          font-size: 0.7rem;
          color: var(--accent);
        }
        .gain {
          font-weight: bold;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
};

export default Company;
