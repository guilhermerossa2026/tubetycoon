import React, { createContext, useContext, useState, useEffect } from 'react';

interface Upgrade {
  id: string;
  name: string;
  basePrice: number;
  multiplier: number;
  type: 'equipment' | 'luxury';
  level: number;
}

interface Video {
  id: string;
  title: string;
  views: number;
  subscribers: number;
  earnings: number;
  date: number;
}

interface Investment {
  id: string;
  name: string;
  symbol: string;
  price: number;
  previousPrice: number;
  type: 'stock' | 'crypto';
  owned: number;
}

interface HiredYouTuber {
  id: string;
  name: string;
  subscribers: number;
  dailyEarnings: number;
  royaltyRate: number; // e.g., 0.2 for 20%
}

interface StaffMember {
  id: string;
  name: string;
  role: 'editor' | 'manager' | 'designer';
  salary: number;
}

interface CompanyState {
  exists: boolean;
  name: string;
  level: number;
  youtubers: HiredYouTuber[];
  staff: StaffMember[];
  monthlyExpenses: number;
  lastUpdate: number;
}

interface GameState {
  money: number;
  subscribers: number;
  totalViews: number;
  upgrades: Upgrade[];
  videoHistory: Video[];
  investments: Investment[];
  company: CompanyState;
  stats: {
    viewsPerClick: number;
    subGainRate: number; // 0 to 1
    moneyPerView: number;
  };
}

interface GameContextType extends GameState {
  addViews: (amount: number) => void;
  publishVideo: (progress: number) => void;
  buyUpgrade: (id: string) => void;
  buyInvestment: (id: string, amount: number) => void;
  sellInvestment: (id: string, amount: number) => void;
  createCompany: (name: string) => void;
  hireYouTuber: (name: string) => void;
  hireStaff: (role: 'editor' | 'manager' | 'designer') => void;
}

const INITIAL_UPGRADES: Upgrade[] = [
  { id: 'webcam', name: 'Webcam 720p', basePrice: 50, multiplier: 1.5, type: 'equipment', level: 0 },
  { id: 'mic', name: 'Microfone Condensador', basePrice: 150, multiplier: 2, type: 'equipment', level: 0 },
  { id: 'pc', name: 'PC Gamer Nitro', basePrice: 500, multiplier: 3, type: 'equipment', level: 0 },
  { id: 'chair', name: 'Cadeira Gamer Ergonômica', basePrice: 1000, multiplier: 1.2, type: 'luxury', level: 0 },
  { id: 'room', name: 'Quarto Customizado', basePrice: 5000, multiplier: 1.5, type: 'luxury', level: 0 },
  { id: 'apartment', name: 'Apartamento de Luxo', basePrice: 25000, multiplier: 2, type: 'luxury', level: 0 },
];

const INITIAL_INVESTMENTS: Investment[] = [
  { id: 'tube', name: 'TubeStock', symbol: 'TUBE', price: 10, previousPrice: 10, type: 'stock', owned: 0 },
  { id: 'banana', name: 'Banana Corp', symbol: 'BNNA', price: 50, previousPrice: 50, type: 'stock', owned: 0 },
  { id: 'macro', name: 'Macrosoft', symbol: 'MSFT', price: 250, previousPrice: 250, type: 'stock', owned: 0 },
  { id: 'bit', name: 'BitCoin', symbol: 'BTC', price: 1000, previousPrice: 1000, type: 'crypto', owned: 0 },
  { id: 'eth', name: 'Ether', symbol: 'ETH', price: 500, previousPrice: 500, type: 'crypto', owned: 0 },
];

const INITIAL_COMPANY: CompanyState = {
  exists: false,
  name: '',
  level: 1,
  youtubers: [],
  staff: [],
  monthlyExpenses: 0,
  lastUpdate: Date.now()
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [money, setMoney] = useState(100);
  const [subscribers, setSubscribers] = useState(0);
  const [totalViews, setTotalViews] = useState(0);
  const [upgrades, setUpgrades] = useState<Upgrade[]>(INITIAL_UPGRADES);
  const [videoHistory, setVideoHistory] = useState<Video[]>([]);
  const [investments, setInvestments] = useState<Investment[]>(INITIAL_INVESTMENTS);
  const [company, setCompany] = useState<CompanyState>(INITIAL_COMPANY);

  // Price fluctuation and Company income/expenses
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Update Investments
      setInvestments(prev => prev.map(inv => {
        const volatility = inv.type === 'crypto' ? 0.15 : 0.05;
        const change = 1 + (Math.random() * volatility * 2 - volatility);
        const newPrice = Math.max(1, inv.price * change);
        return {
          ...inv,
          previousPrice: inv.price,
          price: Number(newPrice.toFixed(2))
        };
      }));

      // 2. Company Business Cycle
      setCompany(current => {
        if (!current.exists) return current;

        // Calculate Royalties from YouTubers
        const royaltiesGain = current.youtubers.reduce((acc, yt) => {
          return acc + (yt.dailyEarnings * yt.royaltyRate);
        }, 0);

        // Calculate Staff Salaries
        const staffCosts = current.staff.reduce((acc, s) => acc + s.salary, 0);

        // Taxes (5% of royalties)
        const taxes = royaltiesGain * 0.05;

        const netIncome = royaltiesGain - staffCosts - taxes;
        
        // Update money (this is a bit tricky inside setCompany, but for simplicity we'll use the side effect)
        setMoney(prev => prev + netIncome);

        return {
          ...current,
          lastUpdate: Date.now()
        };
      });

    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Actions
  const createCompany = (name: string) => {
    setCompany({
      ...INITIAL_COMPANY,
      exists: true,
      name,
    });
  };

  const hireYouTuber = (name: string) => {
    const newYT: HiredYouTuber = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      subscribers: 1000,
      dailyEarnings: 50,
      royaltyRate: 0.15 + (Math.random() * 0.1) // 15-25%
    };
    setCompany(prev => ({
      ...prev,
      youtubers: [...prev.youtubers, newYT]
    }));
  };

  const hireStaff = (role: 'editor' | 'manager' | 'designer') => {
    const salaries = { editor: 100, manager: 250, designer: 150 };
    const newStaff: StaffMember = {
      id: Math.random().toString(36).substr(2, 9),
      name: `Colaborador ${role}`,
      role,
      salary: salaries[role]
    };
    setCompany(prev => ({
      ...prev,
      staff: [...prev.staff, newStaff]
    }));
  };

  // ... (rest of the functions: addViews, publishVideo, buyUpgrade, buyInvestment, sellInvestment)

  const viewsPerClick = upgrades
    .filter(u => u.type === 'equipment')
    .reduce((acc, u) => acc + (u.level * u.multiplier * 5), 10);

  const subMultiplier = upgrades
    .filter(u => u.type === 'luxury')
    .reduce((acc, u) => acc + (u.level * u.multiplier * 0.1), 1);

  const moneyPerView = 0.01;

  const addViews = (amount: number) => {};

  const publishVideo = (progress: number) => {
    const videoViews = Math.floor(progress * (1 + subscribers * 0.1) * 100);
    const videoSubs = Math.floor(videoViews * 0.05 * subMultiplier);
    const videoEarnings = videoViews * moneyPerView;

    const newVideo: Video = {
      id: Math.random().toString(36).substr(2, 9),
      title: `Vídeo #${videoHistory.length + 1}`,
      views: videoViews,
      subscribers: videoSubs,
      earnings: videoEarnings,
      date: Date.now()
    };

    setVideoHistory([newVideo, ...videoHistory]);
    setTotalViews(prev => prev + videoViews);
    setSubscribers(prev => prev + videoSubs);
    setMoney(prev => prev + videoEarnings);
  };

  const buyUpgrade = (id: string) => {
    const upgrade = upgrades.find(u => u.id === id);
    if (!upgrade) return;

    const price = Math.floor(upgrade.basePrice * Math.pow(1.5, upgrade.level));
    if (money >= price) {
      setMoney(prev => prev - price);
      setUpgrades(prev => prev.map(u => 
        u.id === id ? { ...u, level: u.level + 1 } : u
      ));
    }
  };

  const buyInvestment = (id: string, amount: number) => {
    const inv = investments.find(i => i.id === id);
    if (!inv) return;
    const cost = inv.price * amount;
    if (money >= cost) {
      setMoney(prev => prev - cost);
      setInvestments(prev => prev.map(i => 
        i.id === id ? { ...i, owned: i.owned + amount } : i
      ));
    }
  };

  const sellInvestment = (id: string, amount: number) => {
    const inv = investments.find(i => i.id === id);
    if (!inv || inv.owned < amount) return;
    const gain = inv.price * amount;
    setMoney(prev => prev + gain);
    setInvestments(prev => prev.map(i => 
      i.id === id ? { ...i, owned: i.owned - amount } : i
    ));
  };

  return (
    <GameContext.Provider value={{
      money, subscribers, totalViews, upgrades, videoHistory, investments, company,
      stats: { viewsPerClick, subGainRate: 0.05, moneyPerView },
      addViews, publishVideo, buyUpgrade, buyInvestment, sellInvestment,
      createCompany, hireYouTuber, hireStaff
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
};
