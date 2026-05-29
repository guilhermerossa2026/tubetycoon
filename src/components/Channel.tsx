import React, { useState } from 'react';
import { useGame } from '../context/GameContext';

const Channel: React.FC = () => {
  const { 
    totalViews, 
    subscribers, 
    energy,
    videoHistory, 
    channelName, 
    channelHandle, 
    channelDescription, 
    communityPostBonus, 
    updateChannelProfile, 
    makeCommunityPost 
  } = useGame();

  const [activeTab, setActiveTab] = useState<'videos' | 'shorts' | 'community' | 'analytics'>('videos');
  
  // Customization Form States
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(channelName);
  const [editHandle, setEditHandle] = useState(channelHandle);
  const [editDesc, setEditDesc] = useState(channelDescription);

  // Plaque celebratory Modal States
  const [showPlaqueModal, setShowPlaqueModal] = useState<string | null>(null);

  // Fictitious Shorts List (with ability to create/post a short)
  const [shortsList, setShortsList] = useState<{ id: string; title: string; views: number; likes: number }[]>([
    { id: 's1', title: 'Minha reação ao primeiro 1K de inscritos! 😂', views: 25000, likes: 1800 },
    { id: 's2', title: 'Quando o editor esquece de cortar o bocejo...', views: 45000, likes: 3200 },
    { id: 's3', title: 'O cafezinho das 3h da manhã bateu forte! ☕⚡', views: 12000, likes: 980 }
  ]);

  const handlePostShort = () => {
    if (energy < 5) {
      alert("Você não tem energia suficiente para postar um Short (Custo: 5 ⚡)!");
      return;
    }
    // We deduct energy by making a community-like post internally or simulate it
    alert("Short gravado e postado! Em 60 segundos você alcançou novos públicos! 📱");
    const titles = [
      "Aquela dancinha rápida no estúdio... 🕺",
      "POV: Você é um Youtuber milionário morando com a mãe",
      "Dicas de setup que ninguém te conta! 💡",
      "Zerei o chefe mais difícil e gritei alto! 🎮"
    ];
    const randomTitle = titles[Math.floor(Math.random() * titles.length)];
    const generatedViews = Math.floor(5000 + Math.random() * 20000);
    const newShort = {
      id: Math.random().toString(),
      title: randomTitle,
      views: generatedViews,
      likes: Math.floor(generatedViews * 0.08)
    };
    setShortsList([newShort, ...shortsList]);
    // Small boost
    makeCommunityPost('thanks'); // Uses thanks logic to add subs and consumes energy!
  };

  const formatNumber = (num: number) => {
    if (num === undefined || num === null) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return Math.floor(num).toLocaleString();
  };

  const getTimeAgo = (date: number) => {
    const seconds = Math.floor((Date.now() - date) / 1000);
    if (seconds < 60) return 'agora';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min atrás`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h atrás`;
    return `${Math.floor(seconds / 86400)}d atrás`;
  };

  const handleSaveProfile = () => {
    updateChannelProfile(editName, editHandle, editDesc);
    setIsEditing(false);
  };

  // Get Video Performance Tag
  const getVideoTag = (views: number) => {
    if (views >= 1000000) return { label: "LENDÁRIO! 🏆", color: "#fbbf24" };
    if (views >= 250000) return { label: "VIRALIZOU! 🔥", color: "#f87171" };
    if (views >= 50000) return { label: "ESTOURO 🚀", color: "#60a5fa" };
    if (views >= 10000) return { label: "MUITO BOM 📈", color: "#34d399" };
    if (views >= 1000) return { label: "MÉDIA 📊", color: "#a78bfa" };
    return { label: "FRIO ❄️", color: "#9ca3af" };
  };

  // Calculate Niche Metrics for Analytics
  const getNicheAnalytics = () => {
    const categories = ['vlog', 'games', 'pov', 'challenge', 'trend', 'dance', 'music'] as const;
    return categories.map(cat => {
      const catVideos = videoHistory.filter(v => v.category === cat);
      const totalCatViews = catVideos.reduce((sum, v) => sum + v.views, 0);
      const totalCatEarnings = catVideos.reduce((sum, v) => sum + v.earnings, 0);
      return {
        category: cat,
        count: catVideos.length,
        views: totalCatViews,
        earnings: totalCatEarnings
      };
    }).sort((a, b) => b.views - a.views);
  };

  const nicheStats = getNicheAnalytics();
  const maxNicheViews = Math.max(...nicheStats.map(s => s.views), 1);

  return (
    <div className="channel-studio-dashboard scrollable-content animate-fade-in">
      
      {/* Visual Header Banner */}
      <div className={`channel-studio-banner banner-tier-${subscribers >= 10000000 ? 'ruby' : subscribers >= 1000000 ? 'diamond' : 'normal'}`}>
        <div className="banner-logo">TUBE CREATOR STUDIO PRO</div>
      </div>

      {/* Main 2-Column Grid Layout for PC */}
      <div className="studio-grid-layout">
        
        {/* Left Column: Profile Card & Interactive Plaques */}
        <section className="studio-left-column">
          
          {/* Channel Identity Card */}
          <div className="studio-card profile-card">
            <div className="profile-identity">
              <div className="studio-avatar">👑</div>
              
              {!isEditing ? (
                <div className="profile-text">
                  <h3>{channelName}</h3>
                  <span className="profile-handle">@{channelHandle}</span>
                  <div className="profile-stats-inline">
                    <span><strong>{formatNumber(subscribers)}</strong> inscritos</span>
                    <span>•</span>
                    <span><strong>{videoHistory.length}</strong> vídeos</span>
                  </div>
                  <p className="profile-bio">"{channelDescription}"</p>
                  <button className="btn-edit-profile" onClick={() => setIsEditing(true)}>⚙️ Editar Perfil</button>
                </div>
              ) : (
                <div className="profile-edit-form">
                  <input 
                    type="text" 
                    placeholder="Nome do Canal" 
                    value={editName} 
                    onChange={e => setEditName(e.target.value)} 
                  />
                  <input 
                    type="text" 
                    placeholder="Handle (sem @)" 
                    value={editHandle} 
                    onChange={e => setEditHandle(e.target.value)} 
                  />
                  <textarea 
                    placeholder="Descrição / Bio do canal"
                    value={editDesc}
                    onChange={e => setEditDesc(e.target.value)}
                  />
                  <div className="edit-buttons">
                    <button className="btn-save-profile" onClick={handleSaveProfile}>Salvar</button>
                    <button className="btn-cancel-profile" onClick={() => setIsEditing(false)}>Cancelar</button>
                  </div>
                </div>
              )}
            </div>

            {/* Aggregated Analytics Badge */}
            <div className="channel-totals-ledger">
              <div className="ledger-cell">
                <span className="label">Visualizações Totais</span>
                <strong>👁️ {formatNumber(totalViews)}</strong>
              </div>
              <div className="ledger-cell">
                <span className="label">Receita Estimada (PF)</span>
                <strong className="text-accent">💰 ${formatNumber(videoHistory.reduce((sum, v) => sum + v.earnings, 0))}</strong>
              </div>
            </div>
          </div>

          {/* Interactive Subscriber Awards (Placas do Youtube) */}
          <div className="studio-card awards-card">
            <h4 className="card-title">🏆 Galeria de Conquistas do Canal</h4>
            <p className="subtitle">Alcançar marcos de inscritos desbloqueia placas exclusivas do YouTube no seu estúdio!</p>
            
            <div className="plaques-grid">
              
              {/* Placa de Prata (100K) */}
              <div 
                className={`plaque-item plaque-silver ${subscribers >= 100000 ? 'unlocked' : 'locked'}`}
                onClick={() => subscribers >= 100000 && setShowPlaqueModal('silver')}
              >
                <div className="plaque-shine"></div>
                <span className="plaque-icon">🥈</span>
                <span className="plaque-name">100K</span>
                <span className="plaque-status">{subscribers >= 100000 ? 'Desbloqueado ✓' : '🔒 100K subs'}</span>
              </div>

              {/* Placa de Ouro (1M) */}
              <div 
                className={`plaque-item plaque-gold ${subscribers >= 1000000 ? 'unlocked' : 'locked'}`}
                onClick={() => subscribers >= 1000000 && setShowPlaqueModal('gold')}
              >
                <div className="plaque-shine"></div>
                <span className="plaque-icon">🥇</span>
                <span className="plaque-name">1M</span>
                <span className="plaque-status">{subscribers >= 1000000 ? 'Desbloqueado ✓' : '🔒 1M subs'}</span>
              </div>

              {/* Placa de Diamante (10M) */}
              <div 
                className={`plaque-item plaque-diamond ${subscribers >= 10000000 ? 'unlocked' : 'locked'}`}
                onClick={() => subscribers >= 10000000 && setShowPlaqueModal('diamond')}
              >
                <div className="plaque-shine"></div>
                <span className="plaque-icon">💎</span>
                <span className="plaque-name">10M</span>
                <span className="plaque-status">{subscribers >= 10000000 ? 'Desbloqueado ✓' : '🔒 10M subs'}</span>
              </div>

              {/* Placa de Rubi (50M) */}
              <div 
                className={`plaque-item plaque-ruby ${subscribers >= 50000000 ? 'unlocked' : 'locked'}`}
                onClick={() => subscribers >= 50000000 && setShowPlaqueModal('ruby')}
              >
                <div className="plaque-shine"></div>
                <span className="plaque-icon">🔴</span>
                <span className="plaque-name">50M</span>
                <span className="plaque-status">{subscribers >= 50000000 ? 'Desbloqueado ✓' : '🔒 50M subs'}</span>
              </div>

            </div>
          </div>

        </section>

        {/* Right Column: Dynamic Tabs (Videos, Shorts, Community, Analytics) */}
        <section className="studio-right-column">
          <div className="studio-card tabbed-panel">
            
            {/* Horizontal Tabs Header */}
            <nav className="studio-tabs-nav">
              <button className={activeTab === 'videos' ? 'active' : ''} onClick={() => setActiveTab('videos')}>🎬 Vídeos</button>
              <button className={activeTab === 'shorts' ? 'active' : ''} onClick={() => setActiveTab('shorts')}>📱 Shorts</button>
              <button className={activeTab === 'community' ? 'active' : ''} onClick={() => setActiveTab('community')}>💬 Comunidade</button>
              <button className={activeTab === 'analytics' ? 'active' : ''} onClick={() => setActiveTab('analytics')}>📊 Analytics</button>
            </nav>

            {/* Tab Contents */}
            <div className="tab-body-content">
              
              {/* TAB 1: VIDEOS */}
              {activeTab === 'videos' && (
                <div className="videos-tab-view">
                  {videoHistory.length === 0 ? (
                    <div className="empty-tab">
                      <span>🎬</span>
                      <p>Você ainda não postou nenhum vídeo longo no canal.</p>
                    </div>
                  ) : (
                    <div className="studio-videos-grid">
                      {videoHistory.map(video => {
                        const success = getVideoTag(video.views);
                        return (
                          <div key={video.id} className="studio-video-card">
                            <div className="sv-thumb" style={{ backgroundImage: `url(${video.thumbnail})` }}>
                              <span className="sv-duration">11:45</span>
                              {video.isPromoted && <span className="sv-ad-badge">AD</span>}
                              {video.communityBonus && <span className="sv-boost-badge">Boosted</span>}
                            </div>
                            
                            <div className="sv-info">
                              <div className="sv-title-line">
                                <h5>{video.title}</h5>
                                <span className="sv-performance-badge" style={{ borderColor: success.color, color: success.color, background: `${success.color}15` }}>
                                  {success.label}
                                </span>
                              </div>

                              <div className="sv-meta">
                                <span>👁️ {formatNumber(video.views)} views</span>
                                <span>•</span>
                                <span>{getTimeAgo(video.date)}</span>
                                <span>•</span>
                                <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>⭐ {video.score ? video.score.toFixed(1) : '5.0'}/10</span>
                              </div>

                              <div className="sv-stats-ledger">
                                <span>👍 {formatNumber(video.likes)}</span>
                                <span>💬 {formatNumber(video.comments)}</span>
                                <span className="sv-earnings">💰 ${video.earnings.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: SHORTS */}
              {activeTab === 'shorts' && (
                <div className="shorts-tab-view">
                  <div className="shorts-action-header">
                    <div>
                      <h5>📱 YouTube Shorts Hub</h5>
                      <p>Grave vídeos curtos de alta viralidade em troca de inscritos rápidos!</p>
                    </div>
                    <button className="btn-create-short" onClick={handlePostShort}>
                      🎥 Gravar Short (-5 ⚡)
                    </button>
                  </div>

                  <div className="shorts-grid">
                    {shortsList.map(short => (
                      <div key={short.id} className="short-card">
                        <div className="short-thumb-placeholder">
                          <span className="short-logo-badge">Shorts</span>
                          <span className="short-play">▶</span>
                        </div>
                        <div className="short-info">
                          <h6>{short.title}</h6>
                          <div className="short-meta">
                            <span>🔥 {formatNumber(short.views)} views</span>
                            <span>•</span>
                            <span>❤️ {formatNumber(short.likes)} likes</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: COMMUNITY */}
              {activeTab === 'community' && (
                <div className="community-tab-view">
                  <div className="community-intro">
                    <h5>💬 Mural de Interação da Comunidade</h5>
                    <p>Poste atualizações e interaja com os inscritos para acumular bônus virais no seu próximo vídeo gravado!</p>
                  </div>

                  {communityPostBonus && (
                    <div className="community-active-bonus">
                      <span className="pulse-dot"></span>
                      <div>
                        <h6>Bônus de Comunidade Ativo!</h6>
                        <p>
                          O seu próximo vídeo receberá 
                          <strong> {communityPostBonus.type === 'views' ? '+15% Views (Meme)' : '+25% Views (Spoiler)'}</strong> assim que for postado!
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="community-posting-options">
                    
                    {/* Option 1: Meme */}
                    <div className="post-option-card">
                      <span className="post-icon">🎭</span>
                      <div className="post-details">
                        <h6>Compartilhar Meme Viral</h6>
                        <p>Poste um meme super engraçado no seu feed para divertir os fãs e impulsionar a curiosidade.</p>
                        <span className="post-cost">Custo: 5 ⚡ | Recompensa: +15% views no próximo vídeo</span>
                      </div>
                      <button className="btn-post-community" onClick={() => makeCommunityPost('meme')}>Postar Meme</button>
                    </div>

                    {/* Option 2: Spoiler */}
                    <div className="post-option-card">
                      <span className="post-icon">🎬</span>
                      <div className="post-details">
                        <h6>Revelar Spoiler/Bastidores</h6>
                        <p>Mostre trechos das gravações para criar mistério e elevar a taxa de cliques dos inscritos.</p>
                        <span className="post-cost">Custo: 5 ⚡ | Recompensa: +25% views no próximo vídeo</span>
                      </div>
                      <button className="btn-post-community" onClick={() => makeCommunityPost('spoiler')}>Postar Spoiler</button>
                    </div>

                    {/* Option 3: Thanks */}
                    <div className="post-option-card">
                      <span className="post-icon">❤️</span>
                      <div className="post-details">
                        <h6>Agradecimento aos Inscritos</h6>
                        <p>Publique uma mensagem sincera de gratidão, aproximando o canal da sua base de fãs.</p>
                        <span className="post-cost">Custo: 5 ⚡ | Recompensa: +2% de inscritos imediatos</span>
                      </div>
                      <button className="btn-post-community" onClick={() => makeCommunityPost('thanks')}>Enviar Obrigado</button>
                    </div>

                  </div>
                </div>
              )}

              {/* TAB 4: ANALYTICS */}
              {activeTab === 'analytics' && (
                <div className="analytics-tab-view">
                  <h5>📊 Desempenho do Canal por Niche</h5>
                  <p className="subtitle">Descubra quais categorias estão dando maior engajamento e receitas no seu ecossistema.</p>
                  
                  <div className="analytics-niche-grid">
                    {nicheStats.map(stat => {
                      const percent = Math.max(5, Math.min(100, (stat.views / maxNicheViews) * 100));
                      return (
                        <div key={stat.category} className="niche-stat-row">
                          <div className="niche-info-line">
                            <span className="niche-title text-capitalize">{stat.category}</span>
                            <span className="niche-counts">
                              <strong>{stat.count}</strong> vídeos • 👁️ {formatNumber(stat.views)} views
                            </span>
                            <span className="niche-cash">💰 ${formatNumber(stat.earnings)}</span>
                          </div>
                          
                          <div className="niche-chart-bar-container">
                            <div className="niche-chart-bar-fill" style={{ width: `${percent}%` }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          </div>
        </section>

      </div>

      {/* Celebration Modal for plaque unlocks */}
      {showPlaqueModal && (
        <div className="plaque-celebration-overlay" onClick={() => setShowPlaqueModal(null)}>
          <div className="plaque-celebration-modal animate-scale-up" onClick={e => e.stopPropagation()}>
            <span className="sparkles">✨ 🎉 ✨</span>
            
            {showPlaqueModal === 'silver' && (
              <div className="plaque-modal-content text-silver">
                <span className="large-badge">🥈</span>
                <h3>Placa de Prata do YouTube</h3>
                <p className="congrats-text">Parabéns oficial de Tube Tycoon!</p>
                <p className="desc">Esta honraria é concedida a @{channelHandle} por superar a marca lendária de **100.000 inscritos** no canal!</p>
                <span className="reward">+50 Reputação Corporativa</span>
              </div>
            )}

            {showPlaqueModal === 'gold' && (
              <div className="plaque-modal-content text-gold">
                <span className="large-badge">🥇</span>
                <h3>Placa de Ouro do YouTube</h3>
                <p className="congrats-text">Parabéns oficial de Tube Tycoon!</p>
                <p className="desc">Esta honraria é concedida a @{channelHandle} por superar a marca de **1.000.000 de inscritos**! Você é um criador classe de elite!</p>
                <span className="reward">+150 Reputação Corporativa</span>
              </div>
            )}

            {showPlaqueModal === 'diamond' && (
              <div className="plaque-modal-content text-diamond">
                <span className="large-badge">💎</span>
                <h3>Placa de Diamante do YouTube</h3>
                <p className="congrats-text">Uma Lenda Viva da Internet!</p>
                <p className="desc">Parabéns @{channelHandle}! Atingir **10.000.000 de inscritos** é um feito para pouquíssimos no mundo inteiro.</p>
                <span className="reward">+500 Reputação Corporativa</span>
              </div>
            )}

            {showPlaqueModal === 'ruby' && (
              <div className="plaque-modal-content text-ruby">
                <span className="large-badge">🔴</span>
                <h3>Placa de Rubi Customizada</h3>
                <p className="congrats-text">O Topo Absoluto da Galáxia!</p>
                <p className="desc">@{channelHandle}, você cruzou a insana barreira de **50.000.000 de inscritos**! Uma placa feita de cristal rubi lapidado brilha agora no seu estúdio.</p>
                <span className="reward">+2000 Reputação Corporativa</span>
              </div>
            )}

            <button className="btn-close-plaque" onClick={() => setShowPlaqueModal(null)}>Fechar Placa</button>
          </div>
        </div>
      )}

      {/* Embed Styles directly inside Channel component */}
      <style>{`
        .channel-studio-dashboard {
          padding: 24px;
          background: #111115;
          min-height: 100%;
        }

        .channel-studio-banner {
          height: 120px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
          font-weight: 900;
          letter-spacing: 2px;
          font-size: 1.2rem;
          color: white;
          text-shadow: 0 2px 4px rgba(0,0,0,0.6);
        }

        .banner-tier-normal {
          background: linear-gradient(135deg, #1f1f2e 0%, #111119 100%);
        }
        .banner-tier-diamond {
          background: linear-gradient(135deg, #2b3a4a 0%, #0d1622 100%);
          border-color: rgba(96, 165, 250, 0.3);
        }
        .banner-tier-ruby {
          background: linear-gradient(135deg, #4c1d1d 0%, #1e0505 100%);
          border-color: rgba(239, 68, 68, 0.3);
          animation: ruby-banner-glow 6s infinite alternate;
        }

        @keyframes ruby-banner-glow {
          0% { box-shadow: 0 0 10px rgba(239, 68, 68, 0.1); }
          100% { box-shadow: 0 0 25px rgba(239, 68, 68, 0.3); }
        }

        .studio-grid-layout {
          display: grid;
          grid-template-columns: 40% 60%;
          gap: 24px;
          align-items: start;
        }

        @media (max-width: 1024px) {
          .studio-grid-layout {
            grid-template-columns: 1fr;
          }
        }

        .studio-card {
          background: rgba(26, 26, 32, 0.55);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 20px;
          padding: 20px;
          backdrop-filter: blur(16px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
          margin-bottom: 24px;
        }

        .profile-card {
          padding: 24px;
        }

        .profile-identity {
          display: flex;
          align-items: flex-start;
          gap: 20px;
          margin-bottom: 20px;
        }

        .studio-avatar {
          width: 70px;
          height: 70px;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.2rem;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
          border: 2px solid rgba(255, 255, 255, 0.1);
          flex-shrink: 0;
        }

        .profile-text {
          flex: 1;
        }

        .profile-text h3 {
          font-size: 1.4rem;
          font-weight: 800;
          color: white;
          margin: 0 0 4px 0;
          letter-spacing: -0.5px;
        }

        .profile-handle {
          font-size: 0.82rem;
          color: #3b82f6;
          font-weight: 700;
          background: rgba(59, 130, 246, 0.1);
          padding: 2px 8px;
          border-radius: 20px;
        }

        .profile-stats-inline {
          display: flex;
          gap: 8px;
          font-size: 0.8rem;
          color: #808090;
          margin: 10px 0;
        }

        .profile-bio {
          font-size: 0.8rem;
          color: #a0a0b0;
          line-height: 1.4;
          margin: 8px 0 12px 0;
        }

        .btn-edit-profile {
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          padding: 6px 12px;
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-edit-profile:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        /* Profile Editing Form */
        .profile-edit-form {
          display: flex;
          flex-direction: column;
          gap: 10px;
          flex: 1;
        }

        .profile-edit-form input, .profile-edit-form textarea {
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: white;
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 0.85rem;
          width: 100%;
        }

        .profile-edit-form textarea {
          min-height: 70px;
          resize: none;
        }

        .edit-buttons {
          display: flex;
          gap: 10px;
        }

        .btn-save-profile {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 700;
          cursor: pointer;
        }

        .btn-cancel-profile {
          background: #ef4444;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 700;
          cursor: pointer;
        }

        .channel-totals-ledger {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          background: rgba(0,0,0,0.15);
          border-radius: 12px;
          padding: 12px;
          border: 1px solid rgba(255, 255, 255, 0.02);
        }

        .ledger-cell {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .ledger-cell .label {
          font-size: 0.72rem;
          color: #808090;
        }

        .ledger-cell strong {
          font-size: 0.95rem;
          color: white;
        }

        /* Achievements awards style */
        .awards-card .card-title {
          font-size: 1.05rem;
          font-weight: 800;
          color: white;
          margin: 0 0 4px 0;
          letter-spacing: -0.3px;
        }

        .awards-card .subtitle {
          font-size: 0.75rem;
          color: #808090;
          margin: 0 0 16px 0;
        }

        .plaques-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .plaque-item {
          position: relative;
          border-radius: 12px;
          padding: 16px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255,255,255,0.03);
          cursor: pointer;
          overflow: hidden;
          transition: all 0.25s ease;
        }

        .plaque-shine {
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%);
          transform: skewX(-20deg);
          transition: left 0.6s ease;
        }

        .plaque-item:hover .plaque-shine {
          left: 150%;
        }

        .plaque-item.locked {
          opacity: 0.35;
          cursor: not-allowed;
          background: rgba(0,0,0,0.2);
        }

        .plaque-icon {
          font-size: 2.2rem;
          margin-bottom: 6px;
        }

        .plaque-name {
          font-weight: 800;
          font-size: 0.95rem;
          color: white;
          margin-bottom: 2px;
        }

        .plaque-status {
          font-size: 0.65rem;
          color: #808090;
        }

        .plaque-silver.unlocked {
          background: linear-gradient(135deg, #373b44 0%, #4286f4 100%);
          border-color: rgba(255,255,255,0.15);
          box-shadow: 0 4px 15px rgba(66, 134, 244, 0.2);
        }
        .plaque-silver.unlocked .plaque-status { color: #e0e0e0; }

        .plaque-gold.unlocked {
          background: linear-gradient(135deg, #ffe259 0%, #ffa751 100%);
          border-color: rgba(255,255,255,0.15);
          box-shadow: 0 4px 15px rgba(255, 167, 81, 0.2);
        }
        .plaque-gold.unlocked .plaque-status { color: #fff; }

        .plaque-diamond.unlocked {
          background: linear-gradient(135deg, #00c6ff 0%, #0072ff 100%);
          border-color: rgba(255,255,255,0.15);
          box-shadow: 0 4px 15px rgba(0, 114, 255, 0.2);
        }
        .plaque-diamond.unlocked .plaque-status { color: #fff; }

        .plaque-ruby.unlocked {
          background: linear-gradient(135deg, #cb2d3e 0%, #ef473a 100%);
          border-color: rgba(255,255,255,0.15);
          box-shadow: 0 4px 15px rgba(239, 71, 58, 0.35);
          animation: ruby-plaque-pulse 2s infinite alternate;
        }
        .plaque-ruby.unlocked .plaque-status { color: #fff; }

        @keyframes ruby-plaque-pulse {
          0% { transform: scale(1); }
          100% { transform: scale(1.03); box-shadow: 0 6px 20px rgba(239, 71, 58, 0.55); }
        }

        /* Right column Tabs style */
        .tabbed-panel {
          padding: 0;
          overflow: hidden;
        }

        .studio-tabs-nav {
          display: flex;
          background: rgba(0, 0, 0, 0.2);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding: 0 20px;
        }

        .studio-tabs-nav button {
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

        .studio-tabs-nav button:hover {
          color: #ddd;
        }

        .studio-tabs-nav button.active {
          color: white;
          border-bottom-color: #3b82f6;
        }

        .tab-body-content {
          padding: 20px;
        }

        .empty-tab {
          text-align: center;
          padding: 60px 20px;
          color: #555;
        }
        .empty-tab span { font-size: 3.5rem; display: block; margin-bottom: 12px; }

        /* Videos List */
        .studio-videos-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .studio-video-card {
          background: rgba(255,255,255,0.01);
          border: 1px solid rgba(255,255,255,0.03);
          border-radius: 12px;
          padding: 12px;
          display: flex;
          gap: 16px;
          transition: all 0.2s ease;
        }

        .studio-video-card:hover {
          background: rgba(255,255,255,0.03);
          border-color: rgba(255,255,255,0.06);
          transform: translateY(-1px);
        }

        .sv-thumb {
          width: 140px;
          aspect-ratio: 16/9;
          background-size: cover;
          background-position: center;
          border-radius: 8px;
          position: relative;
          flex-shrink: 0;
        }

        .sv-duration {
          position: absolute;
          bottom: 4px;
          right: 4px;
          background: rgba(0,0,0,0.85);
          color: white;
          font-size: 0.65rem;
          font-weight: 700;
          padding: 1px 4px;
          border-radius: 4px;
        }

        .sv-ad-badge {
          position: absolute;
          top: 4px;
          left: 4px;
          background: #fbbf24;
          color: black;
          font-size: 0.6rem;
          font-weight: 800;
          padding: 1px 4px;
          border-radius: 4px;
        }

        .sv-boost-badge {
          position: absolute;
          top: 4px;
          right: 4px;
          background: #3b82f6;
          color: white;
          font-size: 0.6rem;
          font-weight: 800;
          padding: 1px 4px;
          border-radius: 4px;
        }

        .sv-info {
          flex: 1;
        }

        .sv-title-line {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 4px;
        }

        .sv-title-line h5 {
          font-size: 0.95rem;
          font-weight: 700;
          margin: 0;
          color: white;
          line-height: 1.3;
        }

        .sv-performance-badge {
          font-size: 0.65rem;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 4px;
          border: 1px solid;
          white-space: nowrap;
        }

        .sv-meta {
          font-size: 0.78rem;
          color: #808090;
          display: flex;
          gap: 6px;
          margin-bottom: 10px;
        }

        .sv-stats-ledger {
          display: flex;
          gap: 14px;
          font-size: 0.78rem;
          color: #a0a0b0;
        }

        .sv-earnings {
          margin-left: auto;
          color: #4caf50;
          font-weight: 800;
        }

        /* Shorts styles */
        .shorts-action-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          margin-bottom: 16px;
        }

        .shorts-action-header h5 {
          font-size: 0.95rem;
          font-weight: 800;
          color: white;
          margin: 0 0 4px 0;
        }

        .shorts-action-header p {
          font-size: 0.75rem;
          color: #808090;
          margin: 0;
        }

        .btn-create-short {
          background: #ef4444;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-create-short:hover {
          background: #dc2626;
          transform: translateY(-1px);
        }

        .shorts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 16px;
        }

        .short-card {
          background: rgba(0,0,0,0.15);
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.03);
          transition: all 0.2s ease;
        }

        .short-card:hover {
          border-color: rgba(255,255,255,0.06);
          transform: scale(1.02);
        }

        .short-thumb-placeholder {
          aspect-ratio: 9/16;
          background: linear-gradient(180deg, #111 0%, #222 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .short-logo-badge {
          position: absolute;
          top: 8px;
          left: 8px;
          background: #ef4444;
          color: white;
          font-size: 0.58rem;
          font-weight: 900;
          padding: 1px 4px;
          border-radius: 4px;
        }

        .short-play {
          font-size: 1.5rem;
          color: rgba(255,255,255,0.4);
        }

        .short-info {
          padding: 10px;
        }

        .short-info h6 {
          font-size: 0.78rem;
          font-weight: 700;
          color: white;
          margin: 0 0 6px 0;
          line-height: 1.35;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .short-meta {
          font-size: 0.65rem;
          color: #808090;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        /* Community style */
        .community-intro h5 {
          font-size: 0.95rem;
          font-weight: 800;
          color: white;
          margin: 0 0 4px 0;
        }

        .community-intro p {
          font-size: 0.75rem;
          color: #808090;
          margin: 0 0 20px 0;
        }

        .community-active-bonus {
          background: rgba(59, 130, 246, 0.08);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 12px;
          padding: 14px;
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .pulse-dot {
          width: 8px;
          height: 8px;
          background: #3b82f6;
          border-radius: 50%;
          box-shadow: 0 0 10px #3b82f6;
          animation: pulse 1.5s infinite alternate;
        }

        @keyframes pulse {
          0% { opacity: 0.4; }
          100% { opacity: 1; }
        }

        .community-active-bonus h6 {
          font-size: 0.85rem;
          font-weight: 700;
          color: white;
          margin: 0 0 2px 0;
        }

        .community-active-bonus p {
          font-size: 0.75rem;
          color: #a0a0b0;
          margin: 0;
        }

        .community-posting-options {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .post-option-card {
          background: rgba(255,255,255,0.01);
          border: 1px solid rgba(255,255,255,0.03);
          border-radius: 12px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 16px;
          transition: all 0.2s ease;
        }

        .post-option-card:hover {
          background: rgba(255,255,255,0.03);
          border-color: rgba(255,255,255,0.06);
        }

        .post-icon {
          font-size: 2.2rem;
          background: rgba(255,255,255,0.03);
          padding: 10px;
          border-radius: 12px;
        }

        .post-details {
          flex: 1;
        }

        .post-details h6 {
          font-size: 0.9rem;
          font-weight: 700;
          color: white;
          margin: 0 0 4px 0;
        }

        .post-details p {
          font-size: 0.78rem;
          color: #808090;
          margin: 0 0 6px 0;
          line-height: 1.35;
        }

        .post-cost {
          font-size: 0.72rem;
          color: #3b82f6;
          font-weight: 700;
        }

        .btn-post-community {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.78rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-post-community:hover {
          background: #2563eb;
          transform: translateY(-1px);
        }

        /* Analytics Tab */
        .analytics-tab-view h5 {
          font-size: 0.95rem;
          font-weight: 800;
          color: white;
          margin: 0 0 4px 0;
        }

        .analytics-tab-view .subtitle {
          font-size: 0.75rem;
          color: #808090;
          margin: 0 0 20px 0;
        }

        .analytics-niche-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .niche-stat-row {
          background: rgba(0,0,0,0.15);
          border: 1px solid rgba(255,255,255,0.02);
          border-radius: 12px;
          padding: 16px;
        }

        .niche-info-line {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          margin-bottom: 10px;
        }

        .niche-title {
          font-weight: 700;
          color: white;
        }

        .niche-counts {
          color: #808090;
        }

        .niche-cash {
          color: #4caf50;
          font-weight: 700;
        }

        .niche-chart-bar-container {
          height: 6px;
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
          overflow: hidden;
        }

        .niche-chart-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%);
          border-radius: 10px;
        }

        /* Celebration Plaque Modal Overlay */
        .plaque-celebration-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 100;
          backdrop-filter: blur(10px);
        }

        .plaque-celebration-modal {
          background: #15151b;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          padding: 40px;
          max-width: 500px;
          width: 90%;
          text-align: center;
          box-shadow: 0 10px 40px rgba(0,0,0,0.6);
        }

        .sparkles {
          font-size: 1.5rem;
          color: #fbbf24;
          display: block;
          margin-bottom: 10px;
        }

        .plaque-modal-content .large-badge {
          font-size: 4.5rem;
          display: block;
          margin-bottom: 14px;
          filter: drop-shadow(0 4px 10px rgba(0,0,0,0.3));
        }

        .plaque-modal-content h3 {
          font-size: 1.6rem;
          font-weight: 800;
          margin: 0 0 6px 0;
          color: white;
          letter-spacing: -0.5px;
        }

        .plaque-modal-content .congrats-text {
          font-size: 0.82rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 0 0 16px 0;
        }

        .plaque-modal-content .desc {
          font-size: 0.88rem;
          color: #a0a0b0;
          line-height: 1.4;
          margin: 0 0 24px 0;
        }

        .plaque-modal-content .reward {
          display: inline-block;
          font-size: 0.8rem;
          font-weight: 800;
          padding: 4px 12px;
          border-radius: 20px;
          border: 1px solid;
          margin-bottom: 24px;
        }

        /* Coloring rules for Plaque modals */
        .text-silver .congrats-text, .text-silver .reward {
          color: #ced4da;
          border-color: #ced4da;
          background: rgba(206, 212, 218, 0.1);
        }
        .text-gold .congrats-text, .text-gold .reward {
          color: #f5af19;
          border-color: #f5af19;
          background: rgba(245, 175, 25, 0.1);
        }
        .text-diamond .congrats-text, .text-diamond .reward {
          color: #00c6ff;
          border-color: #00c6ff;
          background: rgba(0, 198, 255, 0.1);
        }
        .text-ruby .congrats-text, .text-ruby .reward {
          color: #ef473a;
          border-color: #ef473a;
          background: rgba(239, 71, 58, 0.1);
          animation: ruby-pulse-reward 1.5s infinite alternate;
        }

        @keyframes ruby-pulse-reward {
          0% { box-shadow: 0 0 5px rgba(239, 71, 58, 0.2); }
          100% { box-shadow: 0 0 15px rgba(239, 71, 58, 0.5); }
        }

        .btn-close-plaque {
          background: white;
          color: black;
          border: none;
          border-radius: 12px;
          padding: 10px 28px;
          font-weight: 800;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-close-plaque:hover {
          background: #e0e0e0;
          transform: scale(1.03);
        }

        .animate-scale-up {
          animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }

        .text-capitalize { text-transform: capitalize; }
      `}</style>
    </div>
  );
};

export default Channel;
