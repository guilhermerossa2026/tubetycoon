import React from 'react';
import { useGame } from '../context/GameContext';

const Channel: React.FC = () => {
  const { totalViews, subscribers, videoHistory } = useGame();

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return Math.floor(num).toString();
  };

  return (
    <div className="tab-container channel-tab">
      <div className="channel-header">
        <div className="avatar">👤</div>
        <div className="channel-info">
          <h2>Seu Canal</h2>
          <p>{formatNumber(subscribers)} inscritos • {videoHistory.length} vídeos</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="label">Total de Views</span>
          <span className="value">{formatNumber(totalViews)}</span>
        </div>
        <div className="stat-card">
          <span className="label">Engajamento</span>
          <span className="value">{(videoHistory.length > 0 ? (subscribers / totalViews * 100).toFixed(1) : 0)}%</span>
        </div>
      </div>

      <div className="video-list">
        <h3>Vídeos Recentes</h3>
        {videoHistory.length === 0 ? (
          <p className="empty-msg">Você ainda não postou nenhum vídeo.</p>
        ) : (
          videoHistory.map(video => (
            <div key={video.id} className="video-item">
              <div className="video-thumb">📹</div>
              <div className="video-details">
                <span className="title">{video.title}</span>
                <span className="meta">
                  {formatNumber(video.views)} views • +{formatNumber(video.subscribers)} subs
                </span>
                <span className="earnings">+${video.earnings.toFixed(2)}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <style>{`
        .channel-tab {
          display: flex;
          flex-direction: column;
          gap: 25px;
        }
        .channel-header {
          display: flex;
          align-items: center;
          gap: 20px;
          background-color: var(--bg-card);
          padding: 20px;
          border-radius: 15px;
        }
        .avatar {
          font-size: 3rem;
          background-color: #333;
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }
        .channel-info h2 {
          font-size: 1.4rem;
          margin-bottom: 4px;
        }
        .channel-info p {
          color: var(--text-dim);
          font-size: 0.9rem;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }
        .stat-card {
          background-color: var(--bg-card);
          padding: 15px;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .stat-card .label {
          font-size: 0.8rem;
          color: var(--text-dim);
        }
        .stat-card .value {
          font-size: 1.2rem;
          font-weight: bold;
        }
        .video-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .video-item {
          display: flex;
          gap: 15px;
          background-color: var(--bg-card);
          padding: 12px;
          border-radius: 12px;
          align-items: center;
        }
        .video-thumb {
          width: 80px;
          height: 45px;
          background-color: #333;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
        }
        .video-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .video-details .title {
          font-weight: bold;
          font-size: 0.95rem;
        }
        .video-details .meta {
          font-size: 0.8rem;
          color: var(--text-dim);
        }
        .video-details .earnings {
          font-size: 0.8rem;
          color: var(--accent);
          font-weight: bold;
        }
        .empty-msg {
          text-align: center;
          color: var(--text-dim);
          margin-top: 20px;
        }
      `}</style>
    </div>
  );
};

export default Channel;
