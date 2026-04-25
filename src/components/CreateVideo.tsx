import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';

const CreateVideo: React.FC = () => {
  const { publishVideo, stats } = useGame();
  const [progress, setProgress] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [clickEffects, setClickEffects] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isRecording) {
      setIsRecording(true);
      setProgress(0);
    }

    const newProgress = Math.min(progress + 2, 100);
    setProgress(newProgress);

    // Click effect logic
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const id = Date.now();
    setClickEffects(prev => [...prev, { id, x: clientX, y: clientY }]);
    setTimeout(() => {
      setClickEffects(prev => prev.filter(effect => effect.id !== id));
    }, 1000);

    if (newProgress >= 100) {
      setIsRecording(false);
      publishVideo(1); // progress factor
      setProgress(0);
    }
  };

  return (
    <div className="tab-container create-tab">
      <div className="recording-area" onClick={handleTap}>
        <div className={`camera-view ${isRecording ? 'pulse' : ''}`}>
          {isRecording ? (
            <div className="rec-indicator">● REC</div>
          ) : (
            <div className="start-prompt">Toque para começar a gravar!</div>
          )}
          <div className="character-silhouette">👤</div>
        </div>

        {isRecording && (
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            <span className="progress-text">{progress}%</span>
          </div>
        )}

        {clickEffects.map(effect => (
          <span 
            key={effect.id} 
            className="click-effect" 
            style={{ left: effect.x, top: effect.y }}
          >
            +views
          </span>
        ))}
      </div>

      <div className="info-box">
        <h3>Equipamento Atual</h3>
        <p>Bônus de Cliques: +{stats.viewsPerClick} views/clique</p>
      </div>

      <style>{`
        .create-tab {
          display: flex;
          flex-direction: column;
          height: 100%;
          gap: 20px;
        }
        .recording-area {
          flex: 1;
          background-color: #000;
          border-radius: 15px;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          border: 2px solid #333;
        }
        .camera-view {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }
        .pulse {
          animation: pulse-border 2s infinite;
        }
        @keyframes pulse-border {
          0% { opacity: 1; }
          50% { opacity: 0.7; }
          100% { opacity: 1; }
        }
        .rec-indicator {
          color: #ff0000;
          font-weight: bold;
          position: absolute;
          top: 20px;
          left: 20px;
          font-size: 1.2rem;
        }
        .character-silhouette {
          font-size: 8rem;
          opacity: 0.5;
        }
        .progress-container {
          position: absolute;
          bottom: 40px;
          width: 80%;
          height: 25px;
          background-color: #333;
          border-radius: 12px;
          overflow: hidden;
        }
        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #ff0000, #ff5f5f);
          transition: width 0.1s ease-out;
        }
        .progress-text {
          position: absolute;
          width: 100%;
          text-align: center;
          top: 0;
          line-height: 25px;
          font-weight: bold;
          font-size: 0.9rem;
        }
        .click-effect {
          position: fixed;
          color: var(--accent);
          font-weight: bold;
          pointer-events: none;
          animation: float-up 1s forwards;
          z-index: 100;
        }
        @keyframes float-up {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(-100px); opacity: 0; }
        }
        .info-box {
          background-color: var(--bg-card);
          padding: 15px;
          border-radius: 12px;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default CreateVideo;
