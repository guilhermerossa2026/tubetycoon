import React, { useState } from 'react';
import { useGame, COMPANY_SCHEMES, FAMOUS_CREATORS } from '../context/GameContext';
import type { CompanyState, ProductState, Talent } from '../context/GameContext';

const Company: React.FC = () => {
  const {
    money,
    subscribers,
    agency,
    companies,
    cryptoToken,
    totalTaxesPaid,
    createAgency,
    fireTalent,
    foundCompany,
    buyLicense,
    buyStock,
    injectPJCapital,
    withdrawPJDividends,
    consolidatePJDebt,
    takePJLoan,
    payPJLoan,
    setPJProductPrice,
    launchCryptoToken,
    vestCryptoTreasury,
    toggleCryptoPayment,
    buybackBankruptCompany,
    startMarketingCampaign,
    signCreatorCollab,
    negotiateAgencyContract,
    talentMarket
  } = useGame();

  // Navigation sub-tabs
  const [subTab, setSubTab] = useState<'brands' | 'bank' | 'agency' | 'crypto'>('brands');

  // Foundation modal / state
  const [foundingNiche, setFoundingNiche] = useState<string | null>(null);
  const [brandNameInput, setBrandNameInput] = useState('');
  const [agencyNameInput, setAgencyNameInput] = useState('');
  const [taxRegime, setTaxRegime] = useState<'real' | 'simples'>('simples');

  // Input states for injections/withdrawals
  const [transferAmount, setTransferAmount] = useState<{ [key: string]: string }>({});
  const [withdrawAmount, setWithdrawAmount] = useState<{ [key: string]: string }>({});

  // Dynamic products settings states
  const [customPrice, setCustomPrice] = useState<{ [key: string]: string }>({});
  const [customName, setCustomName] = useState<{ [key: string]: string }>({});

  // Bank loan state
  const [selectedCompIdForLoan, setSelectedCompIdForLoan] = useState<string>('');
  const [loanAmount, setLoanAmount] = useState(5000);
  const [loanWeeks, setLoanWeeks] = useState(4);

  // Agency Negotiation State
  const [isNegotiating, setIsNegotiating] = useState(false);
  const [negotiatingTalent, setNegotiatingTalent] = useState<Talent | null>(null);
  const [negotiatedCom, setNegotiatedCom] = useState(0.20);
  const [negotiatedFee, setNegotiatedFee] = useState(5000);

  // Web3 Vesting State
  const [vestPercent, setVestPercent] = useState(0.5);
  const [vestDestination, setVestDestination] = useState<'PF' | 'PJ'>('PF');
  const [vestSelectedPJ, setVestSelectedPJ] = useState<string>('merch');

  // Cripto creation state
  const [cryptoNameInput, setCryptoNameInput] = useState('');
  const [cryptoSymbolInput, setCryptoSymbolInput] = useState('');

  const formatNumber = (num: number) => {
    if (num === undefined || num === null) return '0.00';
    if (Math.abs(num) >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (Math.abs(num) >= 1000) return (num / 1000).toFixed(2) + 'K';
    return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const getAcceptanceMeterColor = (acc: number) => {
    if (acc >= 75) return '#2ecc71';
    if (acc >= 50) return '#f1c40f';
    return '#e74c3c';
  };



  const getExpectations = (talent: Talent) => {
    const baseSigningExpectation = talent.subscribers * 0.1 * (talent.potential === 'S' ? 5 : talent.potential === 'A' ? 3 : 1) + 1000;
    return Math.floor(baseSigningExpectation);
  };

  const handleProposeContract = () => {
    if (!negotiatingTalent) return;
    negotiateAgencyContract(negotiatingTalent, negotiatedCom, negotiatedFee);
    setIsNegotiating(false);
    setNegotiatingTalent(null);
  };

  return (
    <div className="tab-container company-dashboard scrollable-content">
      {/* Dynamic Header */}
      <header className="holding-header">
        <div className="header-info">
          <span className="holding-emoji">🏢</span>
          <div>
            <h2>Tube Holdings Corporation</h2>
            <span className="tax-gauge">Prestígio Fiscal: <strong>${formatNumber(totalTaxesPaid)} pagos</strong></span>
          </div>
        </div>
        
        <div className="holding-accounts">
          <div className="acc-card pf-card">
            <span className="acc-label">Conta Pessoal (PF)</span>
            <span className="acc-val">${formatNumber(money)}</span>
          </div>
        </div>
      </header>

      {/* Main Tab Navigation */}
      <nav className="holding-nav">
        <button className={subTab === 'brands' ? 'active' : ''} onClick={() => setSubTab('brands')}>
          🏢 Minhas Empresas ({companies.filter(c => c.founded).length}/{companies.length})
        </button>
        <button className={subTab === 'bank' ? 'active' : ''} onClick={() => setSubTab('bank')}>
          🏦 Portal do Banco {companies.some(c => c.founded && c.money < 0) ? '⚠️' : ''}
        </button>
        <button className={subTab === 'agency' ? 'active' : ''} onClick={() => setSubTab('agency')}>
          🤝 Agência & Collabs {agency.exists ? `(${agency.talents.length})` : ''}
        </button>
        <button className={subTab === 'crypto' ? 'active' : ''} onClick={() => setSubTab('crypto')}>
          🪙 Token Web3 {cryptoToken ? `(${cryptoToken.symbol})` : ''}
        </button>
      </nav>

      {/* SUB-TAB CONTENTS */}
      <div className="holding-body animate-fade-in">

        {/* 1. BRANDS / ENTERPRISES */}
        {subTab === 'brands' && (
          <div className="brands-grid">
            {companies.map(comp => {
              const scheme = COMPANY_SCHEMES[comp.id];
              const progressPercent = Math.min(100, (subscribers / scheme.unlockedAtSubs) * 100);

              // UNFOUNDED BRAND CARD
              if (!comp.founded) {
                const canFund = subscribers >= scheme.unlockedAtSubs && money >= scheme.foundationCost;

                return (
                  <div key={comp.id} className="brand-card locked-card">
                    <div className="card-lock-icon">🔒</div>
                    <h4>{scheme.nicheName}</h4>
                    <p className="requirement-text">
                      Requer: <strong>{scheme.unlockedAtSubs.toLocaleString()} inscritos</strong> + <strong>${scheme.foundationCost.toLocaleString()} PF</strong>
                    </p>

                    <div className="card-progress">
                      <div className="progress-bg">
                        <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
                      </div>
                      <span className="progress-text">{subscribers.toLocaleString()} / {scheme.unlockedAtSubs.toLocaleString()} subs</span>
                    </div>

                    <button 
                      className={`found-btn ${canFund ? 'active' : 'disabled'}`}
                      disabled={!canFund}
                      onClick={() => {
                        setFoundingNiche(comp.id);
                        setBrandNameInput(`Empresa de ${scheme.nicheName}`);
                      }}
                    >
                      Fundar Marca
                    </button>
                  </div>
                );
              }

              // BANKRUPT BRAND CARD
              if (comp.isBankrupt) {
                const buybackCost = Math.max(50000, comp.totalRevenue * 2);
                return (
                  <div key={comp.id} className="brand-card bankrupt-card">
                    <div className="card-lock-icon">💀</div>
                    <h4>{comp.name} (FALIDA)</h4>
                    <p className="bankrupt-desc">
                      Esta empresa foi liquidada judicialmente por estourar 4 semanas consecutivas em cheque especial sem parcelamento ativo.
                    </p>
                    <p className="buyback-text">
                      Custo de Compra Judicial da Falência (2x Faturamento): <strong>${formatNumber(buybackCost)} PF</strong>
                    </p>
                    <button 
                      className="buyback-btn"
                      onClick={() => buybackBankruptCompany(comp.id)}
                    >
                      Recomprar Empresa
                    </button>
                  </div>
                );
              }

              // FOUNDED BRAND CARD (ACTIVE INTERNET OPERATIONS)
              const nicheTintClass = `niche-${comp.id}`;
              const activeCampaign = comp.marketingActive !== 'none';

              return (
                <div key={comp.id} className={`brand-card founded-card ${nicheTintClass}`}>
                  {/* Brand Card Header */}
                  <div className="brand-card-header">
                    <div>
                      <h3>{comp.name}</h3>
                      <span className="badge tax-badge-regime">{comp.taxRegime.toUpperCase()}</span>
                    </div>
                    <div className="pj-money-badge">
                      <span className="pj-lbl">Caixa PJ:</span>
                      <span className={`pj-val ${comp.money >= 0 ? 'pos' : 'neg'}`}>
                        ${formatNumber(comp.money)}
                      </span>
                    </div>
                  </div>

                  {/* Red alert for bank failure */}
                  {comp.money < 0 && (
                    <div className="bank-danger-alert">
                      ⚠️ <strong>FALÊNCIA IMINENTE!</strong> Juros fiscais de cheque especial cobrados. {4 - comp.weeklyNegativeCount} semanas restantes.
                    </div>
                  )}

                  {/* Corporate Statistics */}
                  <div className="comp-stats-table">
                    <div className="comp-stat-row">
                      <span>Faturamento Histórico:</span>
                      <strong>${formatNumber(comp.totalRevenue)}</strong>
                    </div>
                    <div className="comp-stat-row">
                      <span>Custo Semanal Operacional:</span>
                      <span className="red-text">-${comp.weeklyMaintenance} PJ</span>
                    </div>
                    {comp.activeInstallments > 0 && (
                      <div className="comp-stat-row debt-installments">
                        <span>Parcelamento de Dívida:</span>
                        <strong className="orange-text">${formatNumber(comp.installmentValue)}/sem ({comp.activeInstallments} rest.)</strong>
                      </div>
                    )}
                    {comp.activeLoan && (
                      <div className="comp-stat-row active-loan-row">
                        <span>Empréstimo PJ Ativo:</span>
                        <strong className="orange-text">${formatNumber(comp.activeLoan.weeklyPayment)}/sem ({comp.activeLoan.remainingWeeks} rest.)</strong>
                      </div>
                    )}
                  </div>

                  {/* Transfer / Dividends Actions */}
                  <div className="banking-actions">
                    <div className="bank-action-col">
                      <label>Injetar Capital (PF ➔ PJ)</label>
                      <div className="action-input-wrapper">
                        <input 
                          type="number" 
                          placeholder="Valor $"
                          value={transferAmount[comp.id] || ''}
                          onChange={(e) => setTransferAmount({ ...transferAmount, [comp.id]: e.target.value })}
                        />
                        <button onClick={() => {
                          const val = parseFloat(transferAmount[comp.id]);
                          if (val > 0) {
                            injectPJCapital(comp.id, val);
                            setTransferAmount({ ...transferAmount, [comp.id]: '' });
                          }
                        }}>Injetar</button>
                      </div>
                      <small className="fee-notice">Taxa bancária: 1.8%</small>
                    </div>

                    <div className="bank-action-col">
                      <label>Retirar Dividendos (PJ ➔ PF)</label>
                      <div className="action-input-wrapper">
                        <input 
                          type="number" 
                          placeholder="Valor $"
                          value={withdrawAmount[comp.id] || ''}
                          onChange={(e) => setWithdrawAmount({ ...withdrawAmount, [comp.id]: e.target.value })}
                        />
                        <button onClick={() => {
                          const val = parseFloat(withdrawAmount[comp.id]);
                          if (val > 0) {
                            withdrawPJDividends(comp.id, val);
                            setWithdrawAmount({ ...withdrawAmount, [comp.id]: '' });
                          }
                        }}>Retirar</button>
                      </div>
                      <small className="fee-notice">
                        {comp.taxRegime === 'real' ? "Imposto: 15% retido" : "Isento (taxado semanalmente)"}
                      </small>
                    </div>
                  </div>

                  {/* Marketing Campaigns Panel */}
                  <div className="marketing-panel">
                    <h4>Campanha de Marketing Corporativo</h4>
                    {comp.marketingWeeksRemaining > 0 ? (
                      <div className="active-marketing-badge">
                        📢 Campanha Ativa: <strong>{comp.marketingActive.toUpperCase()} (+{(comp.marketingActive === 'instagram' ? 50 : comp.marketingActive === 'live' ? 150 : 400)}% Vendas)</strong>
                      </div>
                    ) : comp.marketingCampaignCooldown > 0 ? (
                      <div className="cooldown-marketing-badge">
                        ⏳ Cooldown Operacional: {comp.marketingCampaignCooldown} semanas restantes
                      </div>
                    ) : (
                      <div className="marketing-buttons">
                        <button onClick={() => startMarketingCampaign(comp.id, 'instagram')}>
                          Insta (+50% faturamento) <span className="cost-tag">$2K PJ</span>
                        </button>
                        <button onClick={() => startMarketingCampaign(comp.id, 'live')}>
                          Live (+150% faturamento) <span className="cost-tag">$8K PJ</span>
                        </button>
                        <button onClick={() => startMarketingCampaign(comp.id, 'dedicated')}>
                          Vídeo (+400% faturamento) <span className="cost-tag">$25K PJ</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Product Inventory Catalog */}
                  <div className="product-inventory">
                    <h4>Gestão de Produtos e Inventário</h4>
                    <div className="products-list-pj">
                      {comp.products.map(prod => {
                        const priceInputVal = customPrice[prod.id] || '';
                        const nameInputVal = customName[prod.id] || '';

                        return (
                          <div key={prod.id} className={`product-item-card ${prod.isUnlocked ? 'unlocked' : 'locked'}`}>
                            <div className="prod-meta">
                              <span className="prod-emoji">{prod.emoji}</span>
                              <div className="prod-desc">
                                <strong>{prod.name}</strong>
                                <span className="category-tag">{prod.category.toUpperCase()}</span>
                                <span className="insumo-lbl">Insumo: ${prod.insumoCost} | Venda: ${prod.price}</span>
                              </div>
                              <div className="prod-stock-badge">
                                {prod.isUnlocked ? (
                                  prod.stock > 0 ? (
                                    <span className="stock-count">Estoque: <strong>{prod.stock}</strong> un.</span>
                                  ) : (
                                    <span className="stock-esgotado">ESGOTADO!</span>
                                  )
                                ) : (
                                  <span className="stock-locked">BLOQUEADO</span>
                                )}
                              </div>
                            </div>

                            {/* Product interactive settings if unlocked */}
                            {prod.isUnlocked ? (
                              <div className="product-actions-pj">
                                <div className="restock-actions">
                                  <span>Fabricar Lote:</span>
                                  <button onClick={() => buyStock(comp.id, prod.id, 100)}>100 un. <small>(${(100 * prod.insumoCost).toFixed(0)})</small></button>
                                  <button onClick={() => buyStock(comp.id, prod.id, 500)}>500 un. <small>(${(500 * prod.insumoCost).toFixed(0)})</small></button>
                                  <button onClick={() => buyStock(comp.id, prod.id, 2000)}>2K un. <small>(${(2000 * prod.insumoCost).toFixed(0)})</small></button>
                                  <button onClick={() => buyStock(comp.id, prod.id, 5000)}>5K un. <small>(${(5000 * prod.insumoCost).toFixed(0)})</small></button>
                                </div>

                                <div className="price-customization">
                                  <div className="price-input">
                                    <label>Alterar Nome</label>
                                    <input 
                                      type="text" 
                                      placeholder="Novo nome"
                                      value={nameInputVal}
                                      onChange={(e) => setCustomName({ ...customName, [prod.id]: e.target.value })}
                                    />
                                  </div>
                                  <div className="price-input">
                                    <label>Definir Preço ($)</label>
                                    <input 
                                      type="number" 
                                      placeholder={prod.price.toString()}
                                      value={priceInputVal}
                                      onChange={(e) => setCustomPrice({ ...customPrice, [prod.id]: e.target.value })}
                                    />
                                  </div>
                                  <button className="apply-price-btn" onClick={() => {
                                    const parsedPrice = parseFloat(priceInputVal) || prod.price;
                                    setPJProductPrice(comp.id, prod.id, parsedPrice, nameInputVal || prod.name);
                                    setCustomPrice({ ...customPrice, [prod.id]: '' });
                                    setCustomName({ ...customName, [prod.id]: '' });
                                    alert("Produto customizado com sucesso!");
                                  }}>Aplicar</button>
                                </div>
                              </div>
                            ) : (
                              <div className="product-locked-actions">
                                🔒 Adquira a licença correspondente no painel acima para desbloquear as vendas.
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Licenses Acquisition Panel */}
                  <div className="licenses-panel">
                    <h4>Licenças de Produtos Especiais</h4>
                    <div className="licenses-grid">
                      {comp.licenses.map(lic => (
                        <div key={lic.id} className={`license-card ${lic.isUnlocked ? 'unlocked' : 'locked'}`}>
                          <span>{lic.name}</span>
                          {lic.isUnlocked ? (
                            <span className="lic-status">🔓 Ativa</span>
                          ) : (
                            <button onClick={() => buyLicense(comp.id, lic.id)}>
                              Licenciar por <strong>${lic.cost.toLocaleString()} PJ</strong>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 2. BANK PORTAL (HYPE BANK) */}
        {subTab === 'bank' && (
          <div className="bank-portal">
            <div className="bank-overview">
              <h3>🏦 Hype Bank & Holding Financeiro</h3>
              <p>Gerencie score de crédito, consolide dívidas acumuladas e quite empréstimos corporativos.</p>
            </div>

            <div className="bank-grid">
              {/* Credit Score visual circular representation */}
              <div className="credit-score-widget">
                <h4>Score de Crédito da Holding</h4>
                {/* Dynamically average or show company specific scores */}
                {companies.filter(c => c.founded).length === 0 ? (
                  <div className="empty-score">Fundar uma empresa para obter Score de Crédito.</div>
                ) : (
                  companies.filter(c => c.founded).map(comp => {
                    const scoreColor = comp.creditScore >= 700 ? '#2ecc71' : comp.creditScore >= 500 ? '#f1c40f' : '#e74c3c';
                    const scorePercent = ((comp.creditScore - 300) / 700) * 100;

                    return (
                      <div key={comp.id} className="company-score-bar">
                        <div className="score-label-info">
                          <span>{comp.name}</span>
                          <strong style={{ color: scoreColor }}>{comp.creditScore} PTS</strong>
                        </div>
                        <div className="score-track-bg">
                          <div className="score-fill" style={{ width: `${scorePercent}%`, backgroundColor: scoreColor }}></div>
                        </div>
                        <small className="loan-limit-text">Limite de Empréstimo PJ: <strong>${comp.maxLoanLimit.toLocaleString()}</strong></small>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Debt Consolidation Plan */}
              <div className="consolidation-card-bank">
                <h4>📦 Consolidação e Parcelamento Judicial de Dívidas</h4>
                <p>Possui caixa PJ no vermelho ou empréstimos empilhados? Consolide tudo em 5 prestações semanais pagas pela empresa, e congele o contador de semanas negativas de falência judicial!</p>
                
                <div className="consolidation-select-wrapper">
                  <label>Selecione a Empresa:</label>
                  <select 
                    onChange={(e) => {
                      const cid = e.target.value;
                      if (cid) consolidatePJDebt(cid);
                    }}
                    defaultValue=""
                  >
                    <option value="" disabled>-- Selecionar empresa para parcelar dívida --</option>
                    {companies.filter(c => c.founded && !c.isBankrupt).map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} (Caixa PJ: ${formatNumber(c.money)} | Empréstimo: {c.activeLoan ? "Sim" : "Não"})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Loan Options Panel */}
            <div className="loans-bank-panel">
              <h4>🏦 Contratação de Empréstimos Hype Bank</h4>
              <div className="loan-calculator-grid">
                <div className="loan-inputs">
                  <div className="loan-select-row">
                    <label>Empresa Solicitante:</label>
                    <select 
                      value={selectedCompIdForLoan} 
                      onChange={(e) => setSelectedCompIdForLoan(e.target.value)}
                    >
                      <option value="">-- Escolher Empresa Fundada --</option>
                      {companies.filter(c => c.founded && !c.isBankrupt && !c.activeLoan).map(c => (
                        <option key={c.id} value={c.id}>{c.name} (Máx: ${c.maxLoanLimit.toLocaleString()})</option>
                      ))}
                    </select>
                  </div>

                  <div className="loan-select-row">
                    <label>Valor Desejado ($):</label>
                    <input 
                      type="number" 
                      value={loanAmount} 
                      onChange={(e) => setLoanAmount(Math.max(100, parseInt(e.target.value) || 0))}
                    />
                  </div>

                  <div className="loan-select-row">
                    <label>Prazo de Quitação (Semanas):</label>
                    <select value={loanWeeks} onChange={(e) => setLoanWeeks(parseInt(e.target.value))}>
                      <option value={4}>4 Semanas</option>
                      <option value={8}>8 Semanas</option>
                      <option value={12}>12 Semanas</option>
                    </select>
                  </div>

                  <button 
                    className="request-loan-btn"
                    disabled={!selectedCompIdForLoan}
                    onClick={() => {
                      takePJLoan(selectedCompIdForLoan, loanAmount, loanWeeks);
                      alert("Empréstimo concedido e creditado no caixa PJ!");
                    }}
                  >
                    Solicitar Empréstimo PJ
                  </button>
                </div>

                {/* Quitação de Empréstimos Ativos */}
                <div className="active-loans-payoff">
                  <h5>Quitar Empréstimos Ativos</h5>
                  <div className="payoff-list">
                    {companies.filter(c => c.founded && c.activeLoan).length === 0 ? (
                      <div className="empty-payoff">Nenhum empréstimo ativo no momento.</div>
                    ) : (
                      companies.filter(c => c.founded && c.activeLoan).map(comp => (
                        <div key={comp.id} className="payoff-item-card">
                          <div>
                            <strong>{comp.name}</strong>
                            <p>Saldo Devedor total: ${formatNumber(comp.activeLoan!.totalToPay)}</p>
                            <p>Pagamento Semanal: ${formatNumber(comp.activeLoan!.weeklyPayment)} ({comp.activeLoan!.remainingWeeks} sem. rest.)</p>
                          </div>
                          <button onClick={() => payPJLoan(comp.id)}>
                            Quitar Agora (3x Limite!)
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. PARCERIAS (TALENT AGENCY & COLLABS) */}
        {subTab === 'agency' && (
          <div className="agency-collabs-tab">
            
            {/* TALENT AGENCY PANEL */}
            <div className="agency-section-panel">
              <h3>👤 Agência de Talentos Tube Agency</h3>
              <p>Gerencie outros influenciadores digitais e ganhe uma porcentagem semanal vitalícia em cima de suas visualizações e AdSense.</p>
              
              {!agency.exists ? (
                <div className="agency-setup-card-box">
                  <div className="lock-icon-agency">🏢</div>
                  <h4>Fundar Agência de Talentos</h4>
                  <p>Requisitos de Fundação: <strong>50.000 inscritos</strong> + Taxa de fundação de <strong>$30,000 PF</strong>.</p>
                  
                  <div className="input-agency-group">
                    <input 
                      type="text" 
                      placeholder="Ex: Hype Creators Agency" 
                      value={agencyNameInput} 
                      onChange={(e) => setAgencyNameInput(e.target.value)} 
                    />
                    <button 
                      onClick={() => agencyNameInput && createAgency(agencyNameInput)}
                      disabled={subscribers < 50000 || money < 30000}
                    >
                      Fundar Agência
                    </button>
                  </div>
                </div>
              ) : (
                <div className="active-agency-layout">
                  <div className="agency-sub-header">
                    <h4>{agency.name} (Reputação: {agency.reputation}/100)</h4>
                    <p>Contrate creators do mercado e negocie seus contratos de agenciamento.</p>
                  </div>

                  {/* Contracted Influencers Grid */}
                  <div className="contracted-talents-grid">
                    <h5>Creators Agenciados ({agency.talents.length})</h5>
                    {agency.talents.length === 0 ? (
                      <div className="empty-talents">Nenhum criador agenciado no momento.</div>
                    ) : (
                      <div className="talents-grid-pj">
                        {agency.talents.map(tal => (
                          <div key={tal.id} className="talent-profile-card">
                            <div className="tal-header">
                              <strong>👤 {tal.name}</strong>
                              <span className="tier-badge-pot">Tier {tal.potential}</span>
                            </div>
                            <div className="tal-info">
                              <p>Nicho: {tal.niche.toUpperCase()} | Subs: {tal.subscribers.toLocaleString()}</p>
                              <p>Comissão negociada: <strong>{(tal.contract!.commissionPercent * 100).toFixed(0)}%</strong></p>
                              <p>Tempo de contrato: {Math.ceil(tal.contract!.monthsRemaining * 4)} semanas rest.</p>
                            </div>
                            <button className="fire-talent-btn" onClick={() => fireTalent(tal.id)}>Encerrar Parceria</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Hire Creator (Interactive negotiations) */}
                  <div className="talents-market-panel">
                    <h5>Mercado de Creators Livres (Disponíveis)</h5>
                    <div className="market-creators-list">
                      {talentMarket.length === 0 ? (
                        <div className="empty-talents" style={{ textAlign: 'center', padding: '15px', color: '#888' }}>
                          Nenhum criador disponível esta semana. Novos creators surgirão na próxima semana!
                        </div>
                      ) : (
                        talentMarket.map(tal => {
                          const feeExpectation = getExpectations(tal);
                          
                          return (
                            <div key={tal.id} className="market-talent-row">
                              <div className="opt-desc-tal">
                                <strong>{tal.name} (Tier {tal.potential})</strong>
                                <span>Nicho: {tal.niche.toUpperCase()} | Inscritos: {tal.subscribers.toLocaleString()}</span>
                              </div>
                              <button onClick={() => {
                                setNegotiatingTalent(tal);
                                setNegotiatedCom(0.20);
                                setNegotiatedFee(feeExpectation);
                                setIsNegotiating(true);
                              }}>
                                Entrar em Negociação
                              </button>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* FAMOUS CREATORS COLLABS */}
            <div className="global-collabs-panel">
              <h3>🤝 Colaborações de Nomes Famosos (Produtos Assinados)</h3>
              <p>Feche parcerias comerciais com grandes celebridades mundiais, pagando um cachê upfront e uma taxa permanente de royalties PJ.</p>
              
              <div className="famous-collabs-grid">
                {FAMOUS_CREATORS.map(c => {
                  return (
                    <div key={c.name} className="collab-creator-card">
                      <div className="collab-header-sec">
                        <span className="collab-emoji-big">{c.emoji === "tribo" ? "🎮" : c.emoji}</span>
                        <div>
                          <h4>{c.name}</h4>
                          <span className="tier-badge-sec">Tier {c.tier}</span>
                        </div>
                      </div>

                      <div className="collab-details-table">
                        <p>Cachê Upfront: <strong>${c.upfrontCost.toLocaleString()} PJ</strong></p>
                        <p>Royalties de Saída: <strong>{(c.royaltyRate * 100).toFixed(0)}%</strong></p>
                      </div>

                      <div className="collab-sign-action">
                        <label>Assinar na Empresa:</label>
                        <select 
                          onChange={(e) => {
                            const compId = e.target.value;
                            if (compId) signCreatorCollab(compId, c.name);
                          }}
                          defaultValue=""
                        >
                          <option value="" disabled>-- Selecione para Assinar --</option>
                          {companies.filter(comp => comp.founded && !comp.isBankrupt).map(comp => (
                            <option key={comp.id} value={comp.id}>{comp.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 4. WEB3 & TOKEN LAUNCH */}
        {subTab === 'crypto' && (
          <div className="web3-tab">
            {!cryptoToken ? (
              <div className="crypto-setup-card">
                <div className="setup-web3-banner">🪙</div>
                <h3>Lance Seu Próprio Token de Utilidade Web3</h3>
                <p>Entre no ecossistema Web3 definitivo e lance seu token de utilidade corporativo. Isso lhe concederá bônus massivos e receitas fiduciárias!</p>
                <div className="crypto-cost-alert">
                  Custo de Lançamento: <strong>$40,000,000 Pessoais (PF)</strong>
                </div>

                <div className="crypto-setup-inputs">
                  <div className="setup-field">
                    <label>Nome do Token:</label>
                    <input 
                      type="text" 
                      placeholder="Ex: TubeCoin" 
                      value={cryptoNameInput}
                      onChange={(e) => setCryptoNameInput(e.target.value)}
                    />
                  </div>
                  <div className="setup-field">
                    <label>Símbolo (Sigla):</label>
                    <input 
                      type="text" 
                      placeholder="Ex: TUBE" 
                      maxLength={5}
                      value={cryptoSymbolInput}
                      onChange={(e) => setCryptoSymbolInput(e.target.value)}
                    />
                  </div>
                  <button 
                    className="launch-token-btn"
                    disabled={money < 40000000 || !cryptoNameInput || !cryptoSymbolInput}
                    onClick={() => launchCryptoToken(cryptoNameInput, cryptoSymbolInput)}
                  >
                    Lançar Moeda no Mercado ($40M PF)
                  </button>
                </div>
              </div>
            ) : (
              <div className="active-crypto-dashboard">
                {/* Live market card */}
                <div className="crypto-live-market">
                  <div className="market-flex">
                    <div>
                      <h3>{cryptoToken.name} ({cryptoToken.symbol})</h3>
                      <span className="price-live">${cryptoToken.price.toFixed(4)}</span>
                      <span className={`price-indicator ${cryptoToken.price >= cryptoToken.previousPrice ? 'up' : 'down'}`}>
                        {cryptoToken.price >= cryptoToken.previousPrice ? '▲ Alta' : '▼ Queda'}
                      </span>
                    </div>
                    <div className="vol-info-web3">
                      <span>Volume 24h:</span>
                      <strong>${formatNumber(cryptoToken.dailyVolume * 7)}</strong>
                    </div>
                  </div>

                  <div className="live-simulation-chart">
                    {/* Simulated visual bar representations */}
                    <div className="chart-bar" style={{ height: '30%' }}></div>
                    <div className="chart-bar" style={{ height: '45%' }}></div>
                    <div className="chart-bar" style={{ height: '25%' }}></div>
                    <div className="chart-bar" style={{ height: '60%' }}></div>
                    <div className="chart-bar" style={{ height: '80%' }}></div>
                    <div className="chart-bar" style={{ height: `${Math.min(100, cryptoToken.price * 50)}%`, backgroundColor: '#d4af37' }}></div>
                    <small className="chart-label-live">Tendência em Tempo Real</small>
                  </div>
                </div>

                {/* Treasury and vesting operations */}
                <div className="treasury-card-web3">
                  <h4>Venda Regulada de Tesouraria (Treasury Vesting)</h4>
                  <p>Liquide uma fatia regulada da sua tesouraria corporativa de tokens para injetar milhões de dólares diretamente na sua conta pessoal (PF) ou no caixa corporativo (PJ) de sua preferência!</p>
                  
                  <div className="vesting-stats">
                    <span>Tokens de Tesouraria Restantes:</span>
                    <strong>{cryptoToken.treasuryOwnedPercent.toFixed(1)}% de Supply</strong>
                  </div>

                  <div className="vesting-simulator-form">
                    <div className="vest-row">
                      <label>Percentual a Liquidar:</label>
                      <select value={vestPercent} onChange={(e) => setVestPercent(parseFloat(e.target.value))}>
                        <option value={0.5}>0.5% do Supply</option>
                        <option value={1.0}>1.0% do Supply</option>
                      </select>
                    </div>

                    <div className="vest-row">
                      <label>Destino dos Fundos:</label>
                      <div className="dest-toggle-group">
                        <button className={vestDestination === 'PF' ? 'active' : ''} onClick={() => setVestDestination('PF')}>PF (Pessoal)</button>
                        <button className={vestDestination === 'PJ' ? 'active' : ''} onClick={() => setVestDestination('PJ')}>PJ (Empresa)</button>
                      </div>
                    </div>

                    {vestDestination === 'PJ' && (
                      <div className="vest-row">
                        <label>Selecione a Marca:</label>
                        <select value={vestSelectedPJ} onChange={(e) => setVestSelectedPJ(e.target.value)}>
                          {companies.filter(c => c.founded && !c.isBankrupt).map(comp => (
                            <option key={comp.id} value={comp.id}>{comp.name}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    <button 
                      className="execute-vesting-btn"
                      onClick={() => vestCryptoTreasury(vestPercent, vestDestination, vestSelectedPJ)}
                    >
                      Liquidamento Semanal de Tokens
                    </button>
                  </div>
                </div>

                {/* Web3 Pay integrations */}
                <div className="web3-pay-integrations">
                  <h4>Aceitação Comercial Web3 Pay</h4>
                  <p>Habilite pagamentos com sua moeda nas lojas das suas marcas PJ. Isso atrai entusiastas de criptomoedas, impulsionando suas vendas brutas em **+20% permanente**!</p>
                  
                  <div className="web3-toggles-grid">
                    {companies.filter(comp => comp.founded && !comp.isBankrupt).map(comp => {
                      return (
                        <div key={comp.id} className="web3-toggle-card">
                          <span>{comp.name}</span>
                          <button 
                            className={`toggle-web3-btn ${comp.web3PayEnabled ? 'active' : ''}`}
                            onClick={() => toggleCryptoPayment(comp.id)}
                          >
                            {comp.web3PayEnabled ? "WEB3 PAY: ATIVO (+20%)" : "WEB3 PAY: INATIVO"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL FOR FOUNDING COMPANY NAME AND TAX REGIME */}
      {foundingNiche && (
        <div className="modal-overlay">
          <div className="modal-content found-modal animate-fade-in">
            <h3>📝 Fundar Nova Holding PJ</h3>
            <p>Insira as diretrizes principais da sua nova estrutura de negócios fiduciários.</p>
            
            <div className="found-modal-fields">
              <div className="modal-field">
                <label>Nome Corporativo da Empresa:</label>
                <input 
                  type="text" 
                  value={brandNameInput} 
                  onChange={(e) => setBrandNameInput(e.target.value)} 
                  placeholder="Nome fantasia"
                />
              </div>

              <div className="modal-field">
                <label>Regime Tributário Corporativo:</label>
                <div className="regime-toggles">
                  <button 
                    className={taxRegime === 'simples' ? 'active' : ''} 
                    onClick={() => setTaxRegime('simples')}
                  >
                    Simples Nacional
                    <small>Isento na retirada | 8% de imposto passivo semanal</small>
                  </button>
                  <button 
                    className={taxRegime === 'real' ? 'active' : ''} 
                    onClick={() => setTaxRegime('real')}
                  >
                    Lucro Real
                    <small>Imposto de 15% nas retiradas PJ ➔ PF | Operations tax-free</small>
                  </button>
                </div>
              </div>
            </div>

            <div className="found-modal-actions">
              <button className="cancel-found-btn" onClick={() => setFoundingNiche(null)}>Cancelar</button>
              <button className="confirm-found-btn" onClick={() => {
                if (brandNameInput) {
                  foundCompany(foundingNiche as any, brandNameInput, taxRegime);
                  setFoundingNiche(null);
                  alert("Empresa fundada com sucesso!");
                }
              }}>Fundar PJ</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL FOR TALENT NEGOTIATION */}
      {isNegotiating && negotiatingTalent && (
        <div className="modal-overlay">
          <div className="modal-content negotiate-modal animate-fade-in">
            <h3>🤝 Negociar Contrato de Agenciamento</h3>
            <p>Negocie os termos de agenciamento de <strong>{negotiatingTalent.name}</strong>.</p>
            
            <div className="negotiate-table-data">
              <p>Inscritos do Creator: <strong>{negotiatingTalent.subscribers.toLocaleString()}</strong></p>
              <p>Nicho: <strong>{negotiatingTalent.niche.toUpperCase()}</strong></p>
              <p>Expectativa Mínima de Signing Fee: <strong className="gold-text">${getExpectations(negotiatingTalent).toLocaleString()}</strong></p>
            </div>

            <div className="negotiation-sliders">
              <div className="slider-group">
                <label>Sua Comissão Semanal: <strong>{(negotiatedCom * 100).toFixed(0)}%</strong></label>
                <input 
                  type="range" 
                  min={0.10} 
                  max={0.50} 
                  step={0.01} 
                  value={negotiatedCom} 
                  onChange={(e) => setNegotiatedCom(parseFloat(e.target.value))}
                />
              </div>

              <div className="slider-group">
                <label>Signing Fee (Bônus de Entrada): <strong>${negotiatedFee.toLocaleString()} PF</strong></label>
                <input 
                  type="range" 
                  min={500} 
                  max={Math.floor(getExpectations(negotiatingTalent) * 3)} 
                  step={100} 
                  value={negotiatedFee} 
                  onChange={(e) => setNegotiatedFee(parseInt(e.target.value))}
                />
              </div>
            </div>

            {/* ACCEPTANCE THERMOMETER */}
            {(() => {
              const base = getExpectations(negotiatingTalent);
              const feeRatio = negotiatedFee / base;
              const comRatio = (0.35 - negotiatedCom) / 0.25;
              const acceptance = Math.min(100, Math.floor(feeRatio * 40 + comRatio * 60));
              const tempColor = getAcceptanceMeterColor(acceptance);

              return (
                <div className="acceptance-thermometer">
                  <span>Chance de Aceitação do Creator:</span>
                  <div className="therm-track">
                    <div className="therm-fill" style={{ width: `${acceptance}%`, backgroundColor: tempColor }}></div>
                  </div>
                  <strong className="therm-lbl" style={{ color: tempColor }}>{acceptance}% {acceptance >= 50 ? "(Propensa a assinar!)" : "(Recusará a proposta!)"}</strong>
                </div>
              );
            })()}

            <div className="negotiate-actions-btns">
              <button className="cancel-negotiate-btn" onClick={() => setIsNegotiating(false)}>Voltar atrás</button>
              <button 
                className="propose-btn"
                disabled={money < negotiatedFee}
                onClick={handleProposeContract}
              >
                Propor Contrato
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CORE CSS STYLING */}
      <style>{`
        .company-dashboard {
          padding: 20px;
          color: white;
          font-family: 'Outfit', sans-serif;
        }

        /* Header holding style */
        .holding-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #151515;
          border: 1px solid #282828;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 20px;
        }
        .header-info {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .holding-emoji {
          font-size: 2.8rem;
        }
        .header-info h2 {
          margin: 0;
          font-size: 1.4rem;
          font-weight: 800;
          color: #fff;
        }
        .tax-gauge {
          font-size: 0.8rem;
          color: #888;
        }
        .tax-gauge strong {
          color: #d4af37;
        }

        .holding-accounts {
          display: flex;
          gap: 15px;
        }
        .acc-card {
          background: #1f1f1f;
          border: 1px solid #333;
          padding: 12px 20px;
          border-radius: 8px;
          text-align: right;
        }
        .pf-card {
          border-left: 4px solid #d4af37;
        }
        .acc-label {
          display: block;
          font-size: 0.75rem;
          color: #888;
          text-transform: uppercase;
        }
        .acc-val {
          font-size: 1.25rem;
          font-weight: 900;
          color: #fff;
        }

        /* Nav holding buttons */
        .holding-nav {
          display: flex;
          gap: 10px;
          margin-bottom: 25px;
          border-bottom: 2px solid #252525;
          padding-bottom: 12px;
        }
        .holding-nav button {
          background: #181818;
          border: 1px solid #333;
          color: #aaa;
          padding: 12px 18px;
          font-weight: bold;
          font-size: 0.9rem;
          cursor: pointer;
          border-radius: 6px;
          transition: all 0.2s;
        }
        .holding-nav button:hover {
          color: white;
          border-color: #555;
        }
        .holding-nav button.active {
          background: var(--accent);
          color: white;
          border-color: var(--accent);
          box-shadow: 0 0 10px rgba(255,0,0,0.15);
        }

        /* Brand list styles */
        .brands-grid {
          display: flex;
          flex-direction: column;
          gap: 25px;
        }
        .brand-card {
          background: #181818;
          border: 1px solid #282828;
          border-radius: 12px;
          padding: 20px;
          position: relative;
        }
        .locked-card {
          opacity: 0.65;
          text-align: center;
          padding: 40px 20px;
        }
        .card-lock-icon {
          font-size: 3rem;
          margin-bottom: 15px;
          color: #d4af37;
        }
        .requirement-text {
          font-size: 0.9rem;
          color: #aaa;
          margin-bottom: 20px;
        }
        .card-progress {
          max-width: 400px;
          margin: 0 auto 20px auto;
        }
        .progress-bg {
          background: #252525;
          height: 10px;
          border-radius: 5px;
          overflow: hidden;
          margin-bottom: 6px;
        }
        .progress-fill {
          height: 100%;
          background: var(--accent);
        }
        .progress-text {
          font-size: 0.75rem;
          color: #888;
        }
        .found-btn {
          padding: 12px 24px;
          font-weight: bold;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.95rem;
        }
        .found-btn.active {
          background: #d4af37;
          color: #121212;
          border: none;
        }
        .found-btn.disabled {
          background: #252525;
          color: #666;
          border: 1px solid #333;
          cursor: not-allowed;
        }

        /* Bankrupt brand style */
        .bankrupt-card {
          border: 2px solid #ff3b30;
          background: rgba(255, 59, 48, 0.05);
          text-align: center;
          padding: 40px 20px;
        }
        .bankrupt-desc {
          font-size: 0.9rem;
          color: #ccc;
          margin-bottom: 15px;
        }
        .buyback-btn {
          background: #ff3b30;
          color: white;
          border: none;
          padding: 12px 24px;
          font-weight: bold;
          border-radius: 6px;
          cursor: pointer;
        }

        /* Founded brands color-tints */
        .niche-startup { border-left: 6px solid #9b59b6; }
        .niche-merch { border-left: 6px solid #ff3b30; }
        .niche-candy { border-left: 6px solid #ff9500; }
        .niche-food { border-left: 6px solid #4cd964; }
        .niche-tech { border-left: 6px solid #007aff; }

        .brand-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #282828;
          padding-bottom: 15px;
          margin-bottom: 15px;
        }
        .brand-card-header h3 {
          margin: 0;
          font-size: 1.3rem;
          font-weight: 800;
        }
        .badge {
          font-size: 0.7rem;
          background: #333;
          color: #fff;
          padding: 3px 6px;
          border-radius: 4px;
          margin-top: 4px;
          display: inline-block;
        }
        .tax-badge-regime {
          background: #4caf50;
        }
        .pj-money-badge {
          text-align: right;
        }
        .pj-lbl {
          font-size: 0.75rem;
          color: #888;
          display: block;
          text-transform: uppercase;
        }
        .pj-val {
          font-size: 1.4rem;
          font-weight: 900;
        }
        .pj-val.pos { color: #4cd964; }
        .pj-val.neg { color: #ff3b30; }

        .bank-danger-alert {
          background: rgba(255, 59, 48, 0.15);
          border: 1px solid #ff3b30;
          color: #ff3b30;
          padding: 10px 15px;
          border-radius: 6px;
          margin-bottom: 15px;
          font-size: 0.85rem;
        }

        /* Stats list in Brand PJ */
        .comp-stats-table {
          display: flex;
          flex-direction: column;
          gap: 8px;
          background: rgba(255,255,255,0.02);
          padding: 12px;
          border-radius: 6px;
          margin-bottom: 15px;
        }
        .comp-stat-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          color: #ccc;
        }
        .debt-installments {
          border-top: 1px dashed #333;
          padding-top: 6px;
        }

        /* Banking / Capital Action columns */
        .banking-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-bottom: 20px;
        }
        .bank-action-col {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .bank-action-col label {
          font-size: 0.8rem;
          color: #aaa;
          font-weight: bold;
        }
        .action-input-wrapper {
          display: flex;
          gap: 8px;
        }
        .action-input-wrapper input {
          flex: 1;
          background: #1f1f1f;
          border: 1px solid #383838;
          padding: 8px 12px;
          border-radius: 6px;
          color: white;
        }
        .action-input-wrapper button {
          background: var(--accent);
          color: white;
          border: none;
          padding: 8px 15px;
          font-weight: bold;
          border-radius: 6px;
          cursor: pointer;
        }
        .fee-notice {
          font-size: 0.7rem;
          color: #777;
        }

        /* Marketing campaigns styles */
        .marketing-panel {
          border-top: 1px solid #282828;
          padding-top: 15px;
          margin-bottom: 20px;
        }
        .marketing-panel h4 {
          margin: 0 0 10px 0;
          font-size: 0.95rem;
          color: #d4af37;
        }
        .active-marketing-badge {
          background: rgba(76, 217, 100, 0.15);
          border: 1px solid #4cd964;
          color: #4cd964;
          padding: 10px;
          border-radius: 6px;
          font-size: 0.85rem;
          text-align: center;
        }
        .cooldown-marketing-badge {
          background: #222;
          color: #777;
          border: 1px solid #333;
          padding: 10px;
          border-radius: 6px;
          font-size: 0.85rem;
          text-align: center;
        }
        .marketing-buttons {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }
        .marketing-buttons button {
          background: #1f1f1f;
          border: 1px solid #333;
          padding: 10px 6px;
          border-radius: 6px;
          color: white;
          cursor: pointer;
          font-size: 0.75rem;
          font-weight: bold;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          transition: background 0.2s;
        }
        .marketing-buttons button:hover {
          background: #252525;
        }
        .cost-tag {
          font-size: 0.65rem;
          color: #e74c3c;
        }

        /* Product Catalog inside Brand PJ */
        .product-inventory {
          border-top: 1px solid #282828;
          padding-top: 15px;
          margin-bottom: 20px;
        }
        .product-inventory h4 {
          margin: 0 0 12px 0;
          font-size: 0.95rem;
          color: #d4af37;
        }
        .products-list-pj {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .product-item-card {
          background: #1c1c1c;
          border: 1px solid #282828;
          border-radius: 8px;
          padding: 12px;
        }
        .product-item-card.locked {
          opacity: 0.5;
        }
        .prod-meta {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .prod-emoji {
          font-size: 1.8rem;
        }
        .prod-desc {
          flex: 1;
        }
        .prod-desc strong {
          display: block;
          font-size: 0.9rem;
        }
        .category-tag {
          font-size: 0.65rem;
          background: #333;
          padding: 1px 4px;
          border-radius: 3px;
          margin: 2px 0;
          display: inline-block;
        }
        .insumo-lbl {
          display: block;
          font-size: 0.75rem;
          color: #888;
        }
        .prod-stock-badge {
          text-align: right;
        }
        .stock-count {
          font-size: 0.85rem;
        }
        .stock-esgotado {
          font-size: 0.8rem;
          color: #ff3b30;
          font-weight: bold;
          background: rgba(255, 59, 48, 0.15);
          padding: 3px 6px;
          border-radius: 4px;
        }

        .product-actions-pj {
          border-top: 1px dashed #333;
          padding-top: 10px;
          margin-top: 8px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .restock-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
          font-size: 0.75rem;
        }
        .restock-actions button {
          background: #2a2a2a;
          border: 1px solid #444;
          color: white;
          padding: 5px 10px;
          border-radius: 4px;
          cursor: pointer;
        }
        .restock-actions button:hover {
          background: #333;
        }

        .price-customization {
          display: grid;
          grid-template-columns: 1.5fr 1fr 80px;
          gap: 8px;
          align-items: flex-end;
        }
        .price-input {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .price-input label {
          font-size: 0.65rem;
          color: #888;
        }
        .price-input input {
          background: #1f1f1f;
          border: 1px solid #333;
          padding: 6px 10px;
          border-radius: 4px;
          color: white;
          font-size: 0.8rem;
        }
        .apply-price-btn {
          background: #d4af37;
          color: #121212;
          border: none;
          padding: 6px 10px;
          border-radius: 4px;
          font-weight: bold;
          cursor: pointer;
          font-size: 0.8rem;
        }

        .product-locked-actions {
          font-size: 0.75rem;
          color: #666;
          font-style: italic;
          margin-top: 6px;
        }

        /* Licenses acquisition panel */
        .licenses-panel {
          border-top: 1px solid #282828;
          padding-top: 15px;
        }
        .licenses-panel h4 {
          margin: 0 0 10px 0;
          font-size: 0.95rem;
          color: #d4af37;
        }
        .licenses-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .license-card {
          background: #1f1f1f;
          border: 1px solid #333;
          padding: 10px;
          border-radius: 6px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8rem;
        }
        .license-card.unlocked {
          border-color: #4cd964;
          background: rgba(76, 217, 100, 0.03);
        }
        .lic-status {
          color: #4cd964;
          font-weight: bold;
        }
        .license-card button {
          background: #333;
          color: white;
          border: 1px solid #444;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
        }

        /* 2. BANK PORTAL */
        .bank-portal {
          background: #181818;
          border: 1px solid #282828;
          border-radius: 12px;
          padding: 20px;
        }
        .bank-overview {
          border-bottom: 1px solid #282828;
          padding-bottom: 15px;
          margin-bottom: 20px;
        }
        .bank-overview h3 {
          margin: 0;
          font-size: 1.3rem;
          color: #d4af37;
        }
        .bank-overview p {
          color: #888;
          font-size: 0.85rem;
          margin: 4px 0 0;
        }

        .bank-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 25px;
        }
        .credit-score-widget {
          background: #1a1a1a;
          border: 1px solid #333;
          padding: 15px;
          border-radius: 8px;
        }
        .credit-score-widget h4 {
          margin: 0 0 15px 0;
          font-size: 0.95rem;
          color: #d4af37;
        }
        .company-score-bar {
          margin-bottom: 12px;
        }
        .score-label-info {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          margin-bottom: 4px;
        }
        .score-track-bg {
          height: 8px;
          background: #252525;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 4px;
        }
        .score-fill {
          height: 100%;
        }
        .loan-limit-text {
          font-size: 0.7rem;
          color: #888;
        }

        .consolidation-card-bank {
          background: #1a1a1a;
          border: 1px dashed #333;
          padding: 15px;
          border-radius: 8px;
        }
        .consolidation-card-bank h4 {
          margin: 0 0 8px 0;
          font-size: 0.95rem;
          color: #d4af37;
        }
        .consolidation-card-bank p {
          font-size: 0.8rem;
          color: #aaa;
          line-height: 1.4;
          margin-bottom: 15px;
        }
        .consolidation-select-wrapper select {
          width: 100%;
          padding: 10px;
          border-radius: 6px;
          background: #222;
          border: 1px solid #444;
          color: white;
          font-size: 0.9rem;
        }

        /* Loan form simulator */
        .loans-bank-panel {
          background: #1a1a1a;
          border: 1px solid #333;
          padding: 15px;
          border-radius: 8px;
        }
        .loans-bank-panel h4 {
          margin: 0 0 15px 0;
          font-size: 0.95rem;
          color: #d4af37;
        }
        .loan-calculator-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 20px;
        }
        .loan-inputs {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .loan-select-row {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .loan-select-row label {
          font-size: 0.8rem;
          color: #888;
        }
        .loan-select-row select, .loan-select-row input {
          width: 100%;
          padding: 10px;
          border-radius: 6px;
          background: #222;
          border: 1px solid #444;
          color: white;
        }
        .request-loan-btn {
          background: #d4af37;
          color: #121212;
          border: none;
          padding: 12px;
          font-weight: bold;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
          margin-top: 10px;
        }
        .request-loan-btn:disabled {
          background: #333;
          color: #666;
          cursor: not-allowed;
        }

        .active-loans-payoff h5 {
          margin: 0 0 10px 0;
          color: #fff;
          font-size: 0.9rem;
        }
        .payoff-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .payoff-item-card {
          background: #222;
          border: 1px solid #333;
          padding: 12px;
          border-radius: 6px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .payoff-item-card p {
          margin: 2px 0 0 0;
          font-size: 0.75rem;
          color: #888;
        }
        .payoff-item-card button {
          background: #2ecc71;
          color: #121212;
          border: none;
          padding: 8px 12px;
          font-weight: bold;
          border-radius: 4px;
          cursor: pointer;
        }

        /* 3. PARCERIAS & COLLABS */
        .agency-collabs-tab {
          display: flex;
          flex-direction: column;
          gap: 25px;
        }
        .agency-section-panel {
          background: #181818;
          border: 1px solid #282828;
          border-radius: 12px;
          padding: 20px;
        }
        .agency-section-panel h3 {
          margin: 0 0 5px 0;
          color: #d4af37;
        }
        .agency-section-panel p {
          margin: 0 0 20px 0;
          font-size: 0.85rem;
          color: #888;
        }

        .agency-setup-card-box {
          border: 1px dashed #444;
          padding: 30px;
          border-radius: 8px;
          text-align: center;
          max-width: 400px;
          margin: 0 auto;
        }
        .lock-icon-agency {
          font-size: 3.5rem;
          margin-bottom: 12px;
        }
        .input-agency-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 15px;
        }
        .input-agency-group input {
          padding: 10px;
          border-radius: 6px;
          background: #222;
          border: 1px solid #444;
          color: white;
        }
        .input-agency-group button {
          background: #d4af37;
          color: #121212;
          border: none;
          padding: 10px;
          font-weight: bold;
          border-radius: 6px;
          cursor: pointer;
        }
        .input-agency-group button:disabled {
          background: #333;
          color: #666;
          cursor: not-allowed;
        }

        .active-agency-layout {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .agency-sub-header {
          border-bottom: 1px solid #282828;
          padding-bottom: 10px;
        }
        .agency-sub-header h4 {
          margin: 0;
          font-size: 1.15rem;
          color: #fff;
        }
        .agency-sub-header p {
          margin: 2px 0 0 0;
          color: #666;
        }

        .contracted-talents-grid h5, .talents-market-panel h5 {
          margin: 0 0 10px 0;
          font-size: 0.95rem;
          color: #d4af37;
        }
        .talents-grid-pj {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 15px;
        }
        .talent-profile-card {
          background: #222;
          border: 1px solid #333;
          padding: 12px;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .tal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .tier-badge-pot {
          background: #333;
          color: gold;
          padding: 2px 5px;
          border-radius: 3px;
          font-size: 0.65rem;
          font-weight: bold;
        }
        .tal-info p {
          margin: 2px 0;
          font-size: 0.75rem;
          color: #ccc;
        }
        .fire-talent-btn {
          background: #ff3b30;
          color: white;
          border: none;
          padding: 6px;
          font-weight: bold;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.75rem;
        }

        .market-creators-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .market-talent-row {
          background: #222;
          border: 1px solid #333;
          padding: 12px;
          border-radius: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .opt-desc-tal {
          display: flex;
          flex-direction: column;
        }
        .opt-desc-tal strong {
          font-size: 0.9rem;
        }
        .opt-desc-tal span {
          font-size: 0.75rem;
          color: #888;
        }
        .market-talent-row button {
          background: #d4af37;
          color: #121212;
          border: none;
          padding: 8px 15px;
          font-weight: bold;
          border-radius: 4px;
          cursor: pointer;
        }

        /* Global Collabs style */
        .global-collabs-panel {
          background: #181818;
          border: 1px solid #282828;
          border-radius: 12px;
          padding: 20px;
        }
        .global-collabs-panel h3 {
          margin: 0 0 5px 0;
          color: #d4af37;
        }
        .global-collabs-panel p {
          margin: 0 0 20px 0;
          font-size: 0.85rem;
          color: #888;
        }
        .famous-collabs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 20px;
        }
        .collab-creator-card {
          background: #1f1f1f;
          border: 1px solid #333;
          padding: 15px;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .collab-header-sec {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .collab-emoji-big {
          font-size: 2.2rem;
        }
        .tier-badge-sec {
          background: #d4af37;
          color: #121212;
          padding: 1px 4px;
          border-radius: 3px;
          font-size: 0.65rem;
          font-weight: bold;
        }
        .collab-details-table p {
          margin: 2px 0;
          font-size: 0.8rem;
          color: #ccc;
        }
        .collab-sign-action {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .collab-sign-action label {
          font-size: 0.7rem;
          color: #888;
        }
        .collab-sign-action select {
          padding: 8px;
          border-radius: 4px;
          background: #151515;
          border: 1px solid #333;
          color: white;
          font-size: 0.75rem;
        }

        /* 4. WEB3 / CRYPTO DASHBOARD */
        .web3-tab {
          background: #181818;
          border: 1px solid #282828;
          border-radius: 12px;
          padding: 20px;
        }
        .crypto-setup-card {
          text-align: center;
          max-width: 440px;
          margin: 0 auto;
          padding: 30px;
          border: 1px dashed #d4af37;
          border-radius: 12px;
          background: rgba(212, 175, 55, 0.02);
        }
        .setup-web3-banner {
          font-size: 4rem;
          margin-bottom: 10px;
        }
        .crypto-cost-alert {
          background: rgba(255, 235, 59, 0.15);
          border: 1px solid #f1c40f;
          color: #f1c40f;
          padding: 12px;
          border-radius: 6px;
          margin-bottom: 20px;
          font-size: 0.9rem;
        }
        .crypto-setup-inputs {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .setup-field {
          display: flex;
          flex-direction: column;
          gap: 5px;
          text-align: left;
        }
        .setup-field label {
          font-size: 0.8rem;
          color: #aaa;
        }
        .setup-field input {
          padding: 10px;
          border-radius: 6px;
          background: #222;
          border: 1px solid #444;
          color: white;
        }
        .launch-token-btn {
          background: #d4af37;
          color: #121212;
          border: none;
          padding: 14px;
          font-weight: 900;
          font-size: 0.95rem;
          border-radius: 6px;
          cursor: pointer;
        }
        .launch-token-btn:disabled {
          background: #333;
          color: #666;
          cursor: not-allowed;
        }

        .active-crypto-dashboard {
          display: flex;
          flex-direction: column;
          gap: 25px;
        }
        .crypto-live-market {
          background: #1c1c1c;
          border: 1px solid #333;
          padding: 18px;
          border-radius: 8px;
        }
        .market-flex {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }
        .price-live {
          font-size: 2.2rem;
          font-weight: 900;
          color: #fff;
          display: block;
        }
        .price-indicator {
          font-size: 0.85rem;
          font-weight: bold;
          padding: 3px 8px;
          border-radius: 4px;
        }
        .price-indicator.up { background: rgba(46, 204, 113, 0.15); color: #2ecc71; }
        .price-indicator.down { background: rgba(231, 76, 60, 0.15); color: #e74c3c; }

        .vol-info-web3 {
          text-align: right;
        }
        .vol-info-web3 span {
          display: block;
          font-size: 0.75rem;
          color: #888;
        }
        .vol-info-web3 strong {
          font-size: 1.25rem;
          color: #fff;
        }

        .live-simulation-chart {
          height: 100px;
          background: #121212;
          border-radius: 6px;
          display: flex;
          align-items: flex-end;
          justify-content: space-around;
          padding: 10px;
          position: relative;
          border: 1px solid #252525;
        }
        .chart-bar {
          width: 8%;
          background: #252525;
          border-radius: 2px;
          transition: height 0.5s ease;
        }
        .chart-label-live {
          position: absolute;
          left: 10px;
          top: 8px;
          font-size: 0.65rem;
          color: #777;
          text-transform: uppercase;
        }

        .treasury-card-web3 {
          background: #1c1c1c;
          border: 1px solid #333;
          padding: 15px;
          border-radius: 8px;
        }
        .treasury-card-web3 h4 {
          margin: 0 0 8px 0;
          color: #d4af37;
        }
        .treasury-card-web3 p {
          font-size: 0.8rem;
          color: #bbb;
          line-height: 1.4;
          margin-bottom: 15px;
        }
        .vesting-stats {
          font-size: 0.85rem;
          margin-bottom: 15px;
        }
        .vesting-simulator-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: #151515;
          padding: 15px;
          border-radius: 6px;
        }
        .vest-row {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .vest-row label {
          font-size: 0.75rem;
          color: #888;
        }
        .vest-row select {
          padding: 10px;
          border-radius: 6px;
          background: #222;
          border: 1px solid #333;
          color: white;
        }
        .dest-toggle-group {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        .dest-toggle-group button {
          background: #222;
          border: 1px solid #333;
          color: white;
          padding: 10px;
          font-weight: bold;
          border-radius: 6px;
          cursor: pointer;
        }
        .dest-toggle-group button.active {
          background: #d4af37;
          color: #121212;
          border-color: #d4af37;
        }
        .execute-vesting-btn {
          background: #d4af37;
          color: #121212;
          border: none;
          padding: 12px;
          font-weight: 900;
          border-radius: 6px;
          cursor: pointer;
          margin-top: 5px;
        }

        .web3-pay-integrations {
          background: #1c1c1c;
          border: 1px solid #333;
          padding: 15px;
          border-radius: 8px;
        }
        .web3-pay-integrations h4 {
          margin: 0 0 6px 0;
          color: #d4af37;
        }
        .web3-pay-integrations p {
          font-size: 0.8rem;
          color: #bbb;
          line-height: 1.4;
          margin-bottom: 15px;
        }
        .web3-toggles-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 12px;
        }
        .web3-toggle-card {
          background: #222;
          border: 1px solid #333;
          padding: 12px;
          border-radius: 6px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          text-align: center;
        }
        .toggle-web3-btn {
          background: #333;
          color: white;
          border: 1px solid #444;
          padding: 8px;
          border-radius: 4px;
          font-weight: bold;
          font-size: 0.75rem;
          cursor: pointer;
        }
        .toggle-web3-btn.active {
          background: #a832a4;
          border-color: #a832a4;
        }

        /* 5. MODAL POPUPS */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2500;
          padding: 20px;
        }
        .modal-content {
          background: #181818;
          border: 1px solid #333;
          width: 100%;
          max-width: 440px;
          border-radius: 12px;
          padding: 20px;
        }
        .modal-field {
          display: flex;
          flex-direction: column;
          gap: 5px;
          margin-bottom: 15px;
        }
        .modal-field label {
          font-size: 0.85rem;
          color: #aaa;
          font-weight: bold;
        }
        .modal-field input {
          padding: 10px;
          border-radius: 6px;
          background: #222;
          border: 1px solid #444;
          color: white;
        }

        .regime-toggles {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        .regime-toggles button {
          background: #222;
          border: 1px solid #333;
          color: #ccc;
          padding: 10px 6px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.8rem;
          font-weight: bold;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          text-align: center;
        }
        .regime-toggles button small {
          font-size: 0.6rem;
          color: #888;
          font-weight: normal;
        }
        .regime-toggles button.active {
          border-color: #d4af37;
          background: rgba(212, 175, 55, 0.08);
          color: #d4af37;
        }

        .found-modal-actions, .negotiate-actions-btns {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          border-top: 1px solid #282828;
          padding-top: 15px;
          margin-top: 15px;
        }
        .cancel-found-btn, .cancel-negotiate-btn {
          background: #333;
          border: 1px solid #444;
          color: white;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
        }
        .confirm-found-btn, .propose-btn {
          background: #d4af37;
          color: #121212;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
        }

        /* Negotiation modal styles */
        .negotiate-table-data {
          background: #222;
          padding: 12px;
          border-radius: 6px;
          margin-bottom: 15px;
        }
        .negotiate-table-data p {
          margin: 3px 0;
          font-size: 0.8rem;
          color: #ccc;
        }
        .slider-group {
          margin-bottom: 15px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .slider-group label {
          font-size: 0.8rem;
          color: #bbb;
        }
        .slider-group input {
          width: 100%;
        }

        .acceptance-thermometer {
          background: #222;
          padding: 15px;
          border-radius: 6px;
          margin-top: 15px;
        }
        .acceptance-thermometer span {
          font-size: 0.8rem;
          color: #888;
          display: block;
          margin-bottom: 8px;
        }
        .therm-track {
          height: 12px;
          background: #333;
          border-radius: 6px;
          overflow: hidden;
          margin-bottom: 6px;
        }
        .therm-fill {
          height: 100%;
          transition: width 0.3s ease;
        }
        .therm-lbl {
          font-size: 0.85rem;
          display: block;
          text-align: right;
        }

        .animate-fade-in {
          animation: fadeIn 0.35s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Company;
