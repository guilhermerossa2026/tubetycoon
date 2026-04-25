import React, { useState } from 'react';
import { useGame } from '../context/GameContext';

const Investments: React.FC = () => {
  const { investments, money, buyInvestment, sellInvestment } = useGame();
  const [amounts, setAmounts] = useState<{ [key: string]: number }>({});

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(2) + 'K';
    return num.toFixed(2);
  };

  const handleAmountChange = (id: string, value: string) => {
    const num = parseInt(value) || 0;
    setAmounts(prev => ({ ...prev, [id]: Math.max(0, num) }));
  };

  const stocks = investments.filter(i => i.type === 'stock');
  const cryptos = investments.filter(i => i.type === 'crypto');

  const renderInvestment = (inv: any) => {
    const priceChange = inv.price - inv.previousPrice;
    const isUp = priceChange >= 0;
    const amount = amounts[inv.id] || 1;
    const canAfford = money >= inv.price * amount;

    return (
      <div key={inv.id} className="investment-card">
        <div className="inv-header">
          <div className="inv-info">
            <span className="symbol">{inv.symbol}</span>
            <span className="name">{inv.name}</span>
          </div>
          <div className={`price ${isUp ? 'up' : 'down'}`}>
            ${formatNumber(inv.price)}
            <span className="arrow">{isUp ? '▲' : '▼'}</span>
          </div>
        </div>

        <div className="inv-stats">
          <div className="stat">
            <span className="label">Possuído:</span>
            <span className="value">{inv.owned}</span>
          </div>
          <div className="stat">
            <span className="label">Valor Total:</span>
            <span className="value">${formatNumber(inv.owned * inv.price)}</span>
          </div>
        </div>

        <div className="inv-actions">
          <input 
            type="number" 
            min="1" 
            value={amount} 
            onChange={(e) => handleAmountChange(inv.id, e.target.value)}
            className="amount-input"
          />
          <div className="btns">
            <button 
              className={`buy-btn ${!canAfford ? 'disabled' : ''}`}
              onClick={() => buyInvestment(inv.id, amount)}
              disabled={!canAfford}
            >
              Comprar
            </button>
            <button 
              className={`sell-btn ${inv.owned < amount ? 'disabled' : ''}`}
              onClick={() => sellInvestment(inv.id, amount)}
              disabled={inv.owned < amount}
            >
              Vender
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="tab-container investments-tab">
      <h2>Investimentos</h2>
      
      <div className="money-display">
        Saldo Disponível: <span>${formatNumber(money)}</span>
      </div>

      <div className="inv-section">
        <h3>Ações</h3>
        <div className="investment-list">
          {stocks.map(renderInvestment)}
        </div>
      </div>

      <div className="inv-section">
        <h3>Criptomoedas</h3>
        <div className="investment-list">
          {cryptos.map(renderInvestment)}
        </div>
      </div>

      <style>{`
        .investments-tab h2 {
          margin-bottom: 10px;
          text-align: center;
        }
        .money-display {
          text-align: center;
          margin-bottom: 20px;
          font-size: 1.1rem;
          background: #333;
          padding: 10px;
          border-radius: 8px;
        }
        .money-display span {
          color: #4caf50;
          font-weight: bold;
        }
        .inv-section {
          margin-bottom: 30px;
        }
        .inv-section h3 {
          font-size: 1.1rem;
          margin-bottom: 15px;
          color: var(--primary);
          border-left: 4px solid var(--primary);
          padding-left: 10px;
        }
        .investment-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .investment-card {
          background-color: var(--bg-card);
          padding: 15px;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .inv-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .inv-info {
          display: flex;
          flex-direction: column;
        }
        .inv-info .symbol {
          font-weight: bold;
          font-size: 1.2rem;
          color: var(--accent);
        }
        .inv-info .name {
          font-size: 0.8rem;
          color: var(--text-dim);
        }
        .price {
          font-weight: bold;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .price.up { color: #4caf50; }
        .price.down { color: #f44336; }
        .arrow { font-size: 0.8rem; }
        
        .inv-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          background: rgba(0,0,0,0.2);
          padding: 8px;
          border-radius: 6px;
        }
        .inv-stats .stat {
          display: flex;
          flex-direction: column;
        }
        .inv-stats .label {
          font-size: 0.7rem;
          color: var(--text-dim);
        }
        .inv-stats .value {
          font-weight: bold;
          font-size: 0.9rem;
        }
        
        .inv-actions {
          display: flex;
          gap: 10px;
          align-items: center;
        }
        .amount-input {
          width: 60px;
          padding: 8px;
          border-radius: 6px;
          background: #333;
          border: 1px solid #444;
          color: white;
          font-size: 0.9rem;
        }
        .btns {
          display: flex;
          gap: 8px;
          flex: 1;
        }
        .btns button {
          flex: 1;
          padding: 8px;
          border-radius: 6px;
          font-weight: bold;
          cursor: pointer;
        }
        .buy-btn {
          background-color: #4caf50;
          color: white;
        }
        .sell-btn {
          background-color: #f44336;
          color: white;
        }
        .btns button.disabled {
          background-color: #444;
          color: #888;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default Investments;
