import React, { useState } from 'react';
import { useGame } from '../context/GameContext';

const Company: React.FC = () => {
  const { agency, money, createAgency, hireTalent, fireTalent, hireStaff, launchBrand, upgradeTalentBrand } = useGame();
  const [newName, setNewName] = useState('');
  const [isHiringTalent, setIsHiringTalent] = useState(false);
  const [selectedTalentId, setSelectedTalentId] = useState<string | null>(null);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(2) + 'K';
    return num.toFixed(2);
  };

  const BRAND_OPTIONS = [
    { type: 'merch', name: 'Merchandising (Roupas)', icon: '👕', cost: 5000, desc: 'Ideal para Lifestyle/Beauty.' },
    { type: 'food', name: 'Alimentação (Snacks)', icon: '🍫', cost: 25000, desc: 'Sucesso em ASMR/Vlogs.' },
    { type: 'tech', name: 'Linha Gamer (Periféricos)', icon: '🖱️', cost: 100000, desc: 'Alta margem para Gamers/Tech.' },
  ];

  const generateRandomTalent = () => {
    const niches = ['gaming', 'lifestyle', 'tech', 'asmr', 'beauty', 'finance'] as const;
    const potentials = ['S', 'A', 'B', 'C', 'D'] as const;
    const names = ["Alex", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Jamie", "Skyler"];
    
    const niche = niches[Math.floor(Math.random() * niches.length)];
    const potential = potentials[Math.floor(Math.random() * potentials.length)];
    
    let baseMultiplier = potential === 'S' ? 1.5 : potential === 'A' ? 1.2 : potential === 'B' ? 1.0 : potential === 'C' ? 0.8 : 0.6;
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      name: `${names[Math.floor(Math.random() * names.length)]} ${Math.floor(Math.random() * 99)}`,
      niche,
      charisma: Math.floor(Math.random() * 50 * baseMultiplier) + 20,
      consistency: Math.random() * 0.5 + 0.5,
      creativity: Math.floor(Math.random() * 50 * baseMultiplier) + 20,
      engagement: Math.random() * 10 + 5,
      reputation: 50,
      ego: potential === 'S' ? 80 : potential === 'A' ? 60 : 30,
      potential,
      burnout: 0,
      subscribers: Math.floor(Math.random() * 10000) * baseMultiplier,
      totalViews: Math.floor(Math.random() * 50000) * baseMultiplier,
      contract: {
        commissionPercent: Math.random() * 0.3 + 0.1, // 10% to 40%
        monthsRemaining: 12,
        exclusivity: Math.random() > 0.5,
        terminationFine: Math.floor(Math.random() * 5000) + 1000
      },
      brands: []
    };
  };

  if (!agency.exists) {
    return (
      <div className="tab-container company-setup">
        <div className="setup-visual">🏢</div>
        <h2>Fundar Agência de Talentos</h2>
        <div className="setup-card">
          <p>Deixe de ser apenas um criador e construa um império gerenciando outros influenciadores.</p>
          <div className="input-group">
            <label>Nome da Agência</label>
            <input 
              type="text" 
              value={newName} 
              onChange={(e) => setNewName(e.target.value)} 
              placeholder="Ex: Hype Agency"
            />
          </div>
          <button 
            className="create-btn"
            onClick={() => newName && createAgency(newName)}
            disabled={!newName}
          >
            Iniciar Operações ($0)
          </button>
        </div>
        <style>{`
          .company-setup { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; height: 100%; padding: 20px; }
          .setup-visual { font-size: 5rem; margin-bottom: 10px; }
          .setup-card { background: var(--bg-card); padding: 30px; border-radius: 20px; width: 100%; max-width: 400px; margin-top: 20px; border: 1px solid #333; }
          .input-group { margin: 20px 0; text-align: left; }
          .input-group label { display: block; margin-bottom: 8px; font-size: 0.9rem; color: var(--text-dim); }
          .input-group input { width: 100%; padding: 12px; border-radius: 8px; background: #222; border: 1px solid #444; color: white; font-size: 1rem; }
          .create-btn { width: 100%; background: var(--accent); color: white; padding: 14px; border-radius: 10px; font-weight: bold; font-size: 1.1rem; cursor: pointer; }
          .create-btn:disabled { background: #444; cursor: not-allowed; }
        `}</style>
      </div>
    );
  }

  const totalTalentRevenue = agency.talents.reduce((acc, t) => acc + (t.contract ? ((t.totalViews/1000) * 2.5 * t.contract.commissionPercent) : 0), 0);
  const totalSalaries = agency.staff.reduce((acc, s) => acc + s.salary, 0);
  const netIncome = totalTalentRevenue - totalSalaries; // Simplified view for dashboard

  return (
    <div className="tab-container company-dashboard">
      <div className="company-header">
        <div className="title-area">
          <span className="emoji">🏢</span>
          <div>
            <h2>{agency.name}</h2>
            <span className="synergy-tag">Reputação: {agency.reputation}/100</span>
          </div>
        </div>
        <div className="income-badge">
          <span className="label">Receita Est. Bruta</span>
          <span className={`value ${netIncome >= 0 ? 'up' : 'down'}`}>
            ${formatNumber(netIncome)}
          </span>
        </div>
      </div>

      <div className="company-grid">
        <section className="brands-section">
          <div className="section-header">
            <h3>Meus Talentos ({agency.talents.length})</h3>
            <button className="add-brand-btn" onClick={() => setIsHiringTalent(true)}>
              + Contratar
            </button>
          </div>

          <div className="brands-list">
            {agency.talents.length === 0 && (
              <div className="empty-state">
                <p>Sua agência está vazia. Contrate talentos para gerar receita.</p>
                <button onClick={() => setIsHiringTalent(true)}>Ver Mercado</button>
              </div>
            )}
            {agency.talents.map(talent => (
              <div key={talent.id} className="brand-card talent-card">
                <div className="talent-main-info">
                    <div className="brand-icon">👤</div>
                    <div className="brand-info">
                        <h4>{talent.name} <span className="tier-badge">Tier {talent.potential}</span></h4>
                        <p className="talent-stats">
                            Subs: {formatNumber(talent.subscribers)} | Ego: {talent.ego} | Burn: {talent.burnout}
                        </p>
                        <p className="talent-niche">Nicho: {talent.niche}</p>
                    </div>
                    <div className="brand-stats">
                        <span className="income">{talent.contract ? `${(talent.contract.commissionPercent * 100).toFixed(0)}% Com.` : 'Sem Contrato'}</span>
                        <button className="fire-btn" onClick={() => fireTalent(talent.id)}>Demitir</button>
                    </div>
                </div>
                
                <div className="talent-brands-area">
                    <h5>Marcas Próprias</h5>
                    <div className="talent-brands-list">
                        {talent.brands.map(b => (
                            <div key={b.id} className="mini-brand-card">
                                <span>{BRAND_OPTIONS.find(opt => opt.type === b.type)?.icon} {b.name} (Lvl {b.level})</span>
                                <button onClick={() => upgradeTalentBrand(talent.id, b.id)}>UP</button>
                            </div>
                        ))}
                        {talent.subscribers >= 1000000 ? (
                             <button className="launch-brand-mini-btn" onClick={() => setSelectedTalentId(talent.id)}>
                                + Lançar Marca
                             </button>
                        ) : (
                            <span className="brand-lock-msg">🔒 Requer 1M subs para marcas</span>
                        )}
                    </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="side-section">
          <div className="staff-card">
            <h4>Equipe da Agência</h4>
            <div className="staff-list">
              {agency.staff.length === 0 && <span className="empty">Nenhum funcionário.</span>}
              {agency.staff.map(s => (
                <div key={s.id} className="staff-item">
                  <span>{s.role === 'manager' ? '💼' : s.role === 'editor' ? '✂️' : '📊'} {s.name}</span>
                  <span className="salary">-${formatNumber(s.salary)}</span>
                </div>
              ))}
            </div>
            <div className="hire-buttons">
              <button onClick={() => hireStaff('manager')}>+ Manager ($250)</button>
              <button onClick={() => hireStaff('editor')}>+ Editor ($100)</button>
              <button onClick={() => hireStaff('analyst')}>+ Analista ($150)</button>
            </div>
          </div>
        </section>
      </div>

      {isHiringTalent && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Mercado de Talentos</h3>
              <button className="close-btn" onClick={() => setIsHiringTalent(false)}>×</button>
            </div>
            <div className="brand-options">
              {[1, 2, 3].map((_, i) => {
                const t = generateRandomTalent();
                return (
                  <div key={i} className="brand-option">
                    <div className="opt-icon">👤</div>
                    <div className="opt-info">
                      <strong>{t.name} (Tier {t.potential})</strong>
                      <p>Nicho: {t.niche} | Subs: {formatNumber(t.subscribers)}</p>
                      <p>Contrato: {(t.contract!.commissionPercent * 100).toFixed(0)}% comissão, {t.contract!.monthsRemaining} meses.</p>
                    </div>
                    <button onClick={() => {
                        hireTalent(t as any);
                        setIsHiringTalent(false);
                      }}>
                      Contratar
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {selectedTalentId && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Lançar Marca para o Talento</h3>
              <button className="close-btn" onClick={() => setSelectedTalentId(null)}>×</button>
            </div>
            <div className="brand-options">
              {BRAND_OPTIONS.map(opt => (
                  <div key={opt.type} className="brand-option">
                    <div className="opt-icon">{opt.icon}</div>
                    <div className="opt-info">
                        <strong>{opt.name}</strong>
                        <p>{opt.desc}</p>
                        <span className="price">Custo: ${formatNumber(opt.cost)}</span>
                    </div>
                    <button 
                        disabled={money < opt.cost}
                        onClick={() => {
                            const name = prompt(`Nome para a marca de ${opt.name}:`);
                            if (name) {
                                launchBrand(selectedTalentId, name, opt.type as any);
                                setSelectedTalentId(null);
                            }
                        }}
                    >Lançar</button>
                  </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .company-dashboard { padding: 20px; color: white; }
        .company-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; background: #1a1a1a; padding: 20px; border-radius: 15px; border-bottom: 4px solid var(--accent); }
        .title-area { display: flex; align-items: center; gap: 15px; }
        .title-area .emoji { font-size: 2.5rem; }
        .synergy-tag { font-size: 0.8rem; background: #333; padding: 2px 8px; border-radius: 5px; color: var(--accent); }
        .income-badge { text-align: right; }
        .income-badge .label { display: block; font-size: 0.8rem; color: var(--text-dim); }
        .income-badge .value { font-size: 1.5rem; font-weight: bold; }
        .value.up { color: #4caf50; }
        .value.down { color: #f44336; }

        .company-grid { display: grid; grid-template-columns: 1fr 300px; gap: 20px; }
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
        .add-brand-btn { background: var(--accent); color: white; padding: 8px 15px; border-radius: 8px; font-weight: bold; cursor: pointer; border: none; }
        
        .brands-list { display: flex; flex-direction: column; gap: 12px; }
        .brand-card { background: var(--bg-card); padding: 15px; border-radius: 12px; border: 1px solid #333; display: flex; flex-direction: column; gap: 15px; }
        .talent-main-info { display: flex; align-items: center; gap: 15px; }
        .talent-card .brand-icon { font-size: 1.8rem; }
        .brand-info { flex: 1; }
        .brand-info h4 { margin: 0; font-size: 1.1rem; display: flex; align-items: center; gap: 8px; }
        .tier-badge { font-size: 0.7rem; background: #555; padding: 2px 6px; border-radius: 4px; color: gold; }
        .talent-stats { font-size: 0.8rem; color: var(--text-dim); margin-top: 4px; }
        .talent-niche { font-size: 0.7rem; color: var(--accent); text-transform: uppercase; font-weight: bold; }
        .brand-stats { display: flex; flex-direction: column; align-items: flex-end; gap: 5px; }
        .income { font-weight: bold; color: #4caf50; font-size: 0.9rem; }
        .fire-btn { background: #f44336; color: white; font-size: 0.75rem; padding: 4px 8px; border-radius: 5px; cursor: pointer; border: none; }
        
        .talent-brands-area { border-top: 1px solid #333; padding-top: 10px; }
        .talent-brands-area h5 { margin: 0 0 10px 0; color: var(--text-dim); font-size: 0.8rem; }
        .talent-brands-list { display: flex; flex-wrap: wrap; gap: 10px; }
        .mini-brand-card { background: #222; padding: 5px 10px; border-radius: 6px; font-size: 0.75rem; display: flex; align-items: center; gap: 8px; border: 1px solid #444; }
        .mini-brand-card button { background: var(--accent); color: white; border: none; padding: 2px 6px; border-radius: 4px; font-size: 0.65rem; cursor: pointer; }
        .launch-brand-mini-btn { background: #333; color: white; border: 1px dashed #555; padding: 5px 10px; border-radius: 6px; font-size: 0.75rem; cursor: pointer; }
        .brand-lock-msg { font-size: 0.7rem; color: #666; font-style: italic; }

        .side-section { display: flex; flex-direction: column; gap: 20px; }
        .staff-card { background: var(--bg-card); padding: 15px; border-radius: 12px; border: 1px solid #333; }
        .staff-card h4 { margin-top: 0; margin-bottom: 5px; color: var(--accent); }
        .staff-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px; }
        .staff-item { display: flex; justify-content: space-between; font-size: 0.85rem; background: #222; padding: 6px 10px; border-radius: 5px; }
        .staff-item .salary { color: #f44336; }
        .hire-buttons { display: flex; flex-direction: column; gap: 5px; }
        .hire-buttons button { font-size: 0.75rem; padding: 8px; background: #333; color: white; border-radius: 5px; cursor: pointer; border: none; }

        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal-content { background: #1a1a1a; width: 90%; max-width: 500px; border-radius: 20px; padding: 25px; border: 1px solid #444; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .close-btn { font-size: 1.5rem; color: #888; cursor: pointer; border: none; background: transparent; }
        .brand-options { display: flex; flex-direction: column; gap: 15px; max-height: 400px; overflow-y: auto; }
        .brand-option { background: #222; padding: 12px; border-radius: 12px; display: flex; align-items: center; gap: 15px; }
        .opt-icon { font-size: 1.5rem; }
        .opt-info { flex: 1; }
        .opt-info strong { display: block; font-size: 0.9rem; }
        .opt-info p { margin: 2px 0; font-size: 0.75rem; color: var(--text-dim); }
        .opt-info .price { font-size: 0.85rem; color: var(--accent); font-weight: bold; }
        .brand-option button { background: var(--accent); color: white; padding: 8px 15px; border-radius: 8px; font-weight: bold; cursor: pointer; border: none; }

        .empty-state { text-align: center; padding: 30px; background: #222; border-radius: 12px; border: 2px dashed #444; }
        .empty-state p { margin-bottom: 10px; font-size: 0.9rem; color: var(--text-dim); }
        .empty-state button { background: var(--accent); color: white; padding: 8px 16px; border-radius: 8px; cursor: pointer; border: none; }
      `}</style>
    </div>
  );
};

export default Company;
