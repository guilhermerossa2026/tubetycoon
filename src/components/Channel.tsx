import React from 'react';
import { useGame } from '../context/GameContext';

const Channel: React.FC = () => {
  const { totalViews, subscribers, videoHistory } = useGame();

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return Math.floor(num).toString();
  };

  const getTimeAgo = (date: number) => {
    const seconds = Math.floor((Date.now() - date) / 1000);
    if (seconds < 60) return 'agora';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min atrás`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h atrás`;
    return `${Math.floor(seconds / 86400)}d atrás`;
  };

  return (
    <div className="tab-container channel-tab">
      <div className="channel-profile">
        <div className="profile-top">
          <div className="avatar">👤</div>
          <div className="profile-main">
            <h2>Seu Canal</h2>
            <div className="meta">
              <span>@{subscribers > 1000 ? 'creator_pro' : 'novo_user'}</span>
              <span>{formatNumber(subscribers)} inscritos</span>
              <span>{videoHistory.length} vídeos</span>
            </div>
            <p className="description">Bem-vindo ao meu império! Aqui você encontra os melhores conteúdos de {videoHistory[0]?.category || 'vários estilos'}.</p>
          </div>
        </div>
      </div>

      <nav className="channel-nav">
        <button className="active">VÍDEOS</button>
        <button>SHORTS</button>
        <button>PLAYLISTS</button>
        <button>COMUNIDADE</button>
      </nav>

      <div className="video-grid">
        {videoHistory.length === 0 ? (
          <div className="empty-channel">
            <div className="icon">🎬</div>
            <p>Você ainda não tem vídeos. Comece a criar!</p>
          </div>
        ) : (
          videoHistory.map(video => (
            <div key={video.id} className="video-card">
              <div className="card-thumb" style={{ backgroundImage: `url(${video.thumbnail})` }}>
                <div className="duration">12:30</div>
                {video.isPromoted && <div className="promo-badge">AD</div>}
              </div>
              <div className="card-content">
                <h4 className="card-title">{video.title}</h4>
                <div className="card-meta">
                  <span>{formatNumber(video.views)} visualizações</span>
                  <span>•</span>
                  <span>{getTimeAgo(video.date)}</span>
                </div>
                <div className="card-stats">
                  <span title="Likes">👍 {formatNumber(video.likes)}</span>
                  <span title="Comentários">💬 {formatNumber(video.comments)}</span>
                  <span className="earnings" title="Ganhos">💰 ${video.earnings.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <style>{`
        .channel-tab {
          padding-bottom: 30px;
        }
        .channel-banner {
          height: 120px;
          background: linear-gradient(45deg, #222, #444);
          border-radius: 15px 15px 0 0;
        }
        .channel-profile {
          padding: 20px;
          background: var(--bg-card);
          margin-bottom: 2px;
        }
        .profile-top {
          display: flex;
          gap: 25px;
          align-items: center;
        }
        .avatar {
          width: 90px;
          height: 90px;
          background: #333;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          border: 2px solid #444;
          flex-shrink: 0;
        }
        .profile-main h2 { margin: 0; font-size: 1.6rem; }
        .profile-main .meta {
          display: flex;
          gap: 10px;
          font-size: 0.85rem;
          color: var(--text-dim);
          margin: 5px 0;
        }
        .profile-main .description {
          font-size: 0.85rem;
          color: #aaa;
          margin: 10px 0 0;
          max-width: 500px;
        }

        .channel-nav {
          display: flex;
          border-bottom: 1px solid #333;
          background: var(--bg-card);
          padding: 0 20px;
          margin-bottom: 20px;
        }
        .channel-nav button {
          background: none;
          border: none;
          color: #888;
          padding: 15px 10px;
          font-size: 0.85rem;
          font-weight: bold;
          cursor: pointer;
          border-bottom: 3px solid transparent;
        }
        .channel-nav button.active {
          color: white;
          border-bottom-color: white;
        }

        .video-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
          padding: 0 20px;
        }
        
        @media (max-width: 600px) {
          .video-grid {
            grid-template-columns: 1fr;
          }
        }

        .video-card {
          display: flex;
          flex-direction: column;
          gap: 10px;
          transition: transform 0.2s;
        }
        .video-card:hover { transform: translateY(-5px); }
        
        .card-thumb {
          width: 100%;
          aspect-ratio: 16/9;
          background-size: cover;
          background-position: center;
          border-radius: 12px;
          position: relative;
        }
        .card-thumb .duration {
          position: absolute;
          bottom: 8px;
          right: 8px;
          background: rgba(0,0,0,0.8);
          color: white;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: bold;
        }
        .promo-badge {
          position: absolute;
          top: 8px;
          left: 8px;
          background: #fbc02d;
          color: black;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: bold;
        }

        .card-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .card-title {
          margin: 0;
          font-size: 1rem;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          color: white;
        }
        .card-meta {
          font-size: 0.85rem;
          color: var(--text-dim);
          display: flex;
          gap: 5px;
        }
        .card-stats {
          display: flex;
          gap: 15px;
          font-size: 0.8rem;
          color: #aaa;
          margin-top: 5px;
        }
        .card-stats .earnings {
          margin-left: auto;
          color: #4caf50;
          font-weight: bold;
        }

        .empty-channel {
          grid-column: 1 / -1;
          text-align: center;
          padding: 60px 20px;
          color: #555;
        }
        .empty-channel .icon { font-size: 4rem; margin-bottom: 10px; }
      `}</style>
    </div>
  );
};

export default Channel;
