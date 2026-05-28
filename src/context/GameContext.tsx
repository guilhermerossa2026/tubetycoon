import React, { createContext, useContext, useState, useEffect } from 'react';

interface Upgrade {
  id: string;
  name: string;
  basePrice: number;
  multiplier: number;
  type: 'equipment' | 'luxury';
  level: number;
}

interface Housing {
  id: string;
  name: string;
  entryCost: number;
  weeklyRent: number;
  viewMultiplier: number;
  energyBonus: number;
  description: string;
  minCompanyLevel?: boolean; // Se libera a empresa
}

interface Video {
  id: string;
  title: string;
  category: 'vlog' | 'games' | 'pov' | 'challenge' | 'trend' | 'dance' | 'music';
  thumbnail: string;
  views: number;
  newViews: number;
  likes: number;
  comments: number;
  subscribers: number;
  earnings: number;
  isPromoted: boolean;
  date: number;
  weeksActive: number;
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

interface Talent {
  id: string;
  name: string;
  niche: 'gaming' | 'lifestyle' | 'tech' | 'asmr' | 'beauty' | 'finance';
  charisma: number;
  consistency: number;
  creativity: number;
  engagement: number;
  reputation: number;
  ego: number;
  potential: 'S' | 'A' | 'B' | 'C' | 'D';
  burnout: number;
  subscribers: number;
  totalViews: number;
  contract: Contract | null;
  brands: Brand[];
}

interface Brand {
  id: string;
  name: string;
  type: 'merch' | 'food' | 'tech';
  level: number;
  baseIncome: number;
  synergy: number; // 0 to 1.5
}

interface Contract {
  commissionPercent: number; // 0.1 to 0.5
  monthsRemaining: number; // usually 6 to 24
  exclusivity: boolean;
  terminationFine: number;
}

interface StaffMember {
  id: string;
  name: string;
  role: 'editor' | 'manager' | 'analyst';
  salary: number;
}

interface AgencyState {
  exists: boolean;
  name: string;
  level: number;
  reputation: number;
  specialization: 'none' | 'gaming' | 'lifestyle' | 'premium';
  talents: Talent[];
  staff: StaffMember[];
  monthlyExpenses: number;
}

interface WeeklyReport {
  views: number;
  subscribers: number;
  youtubeEarnings: number;
  companyEarnings: number;
  investmentChange: number;
  expenses: number;
  housingExpenses: number;
  netTotal: number;
  isVisible: boolean;
  events: { title: string; desc: string; type: 'positive' | 'negative' | 'neutral' }[];
}

interface GameState {
  money: number;
  subscribers: number;
  totalViews: number;
  energy: number;
  maxEnergy: number;
  week: number;
  upgrades: Upgrade[];
  currentHousingId: string;
  videoHistory: Video[];
  investments: Investment[];
  agency: AgencyState;
  weeklyReport: WeeklyReport;
  stats: {
    viewsPerClick: number;
    subGainRate: number;
    moneyPerView: number;
  };
}

interface PublishVideoData {
  title: string;
  category: Video['category'];
  thumbnail: string;
  isPromoted: boolean;
  promotionCost: number;
}

interface OutsideWork {
  id: string;
  name: string;
  pay: number;
  energyCost: number;
  minSubs: number;
}

interface GameContextType extends GameState {
  date: string;
  addViews: (amount: number) => void;
  publishVideo: (data: PublishVideoData) => void;
  buyUpgrade: (id: string) => void;
  buyHousing: (id: string) => void;
  workOutside: (id: string) => void;
  buyInvestment: (id: string, amount: number) => void;
  sellInvestment: (id: string, amount: number) => void;
  createAgency: (name: string) => void;
  hireTalent: (talent: Talent) => void;
  fireTalent: (talentId: string) => void;
  hireStaff: (role: 'editor' | 'manager' | 'analyst') => void;
  launchBrand: (talentId: string, brandName: string, type: Brand['type']) => void;
  upgradeTalentBrand: (talentId: string, brandId: string) => void;
  nextWeek: () => void;
  closeReport: () => void;
  housings: Housing[];
  outsideWorks: OutsideWork[];
}

const INITIAL_UPGRADES: Upgrade[] = [
  { id: 'webcam', name: 'Webcam 720p', basePrice: 50, multiplier: 1.5, type: 'equipment', level: 0 },
  { id: 'mic', name: 'Microfone Condensador', basePrice: 150, multiplier: 2, type: 'equipment', level: 0 },
  { id: 'pc', name: 'PC Gamer Nitro', basePrice: 500, multiplier: 3, type: 'equipment', level: 0 },
  { id: 'chair', name: 'Cadeira Gamer Ergonômica', basePrice: 1000, multiplier: 1.2, type: 'luxury', level: 0 },
];

const HOUSINGS: Housing[] = [
  { 
    id: 'parents', 
    name: 'Casa da Mãe', 
    entryCost: 0, 
    weeklyRent: 50, 
    viewMultiplier: 1.0, 
    energyBonus: 0, 
    description: 'Onde tudo começou. O Wi-Fi cai às vezes, mas a comida é por conta da casa.' 
  },
  { 
    id: 'rented_room', 
    name: 'Quarto Alugado', 
    entryCost: 1000, 
    weeklyRent: 300, 
    viewMultiplier: 1.15, 
    energyBonus: 0, 
    description: 'Seu primeiro passo rumo à independência. Mais tempo e foco para seus vídeos.' 
  },
  { 
    id: 'apartment', 
    name: 'Apartamento de Criador', 
    entryCost: 15000, 
    weeklyRent: 1200, 
    viewMultiplier: 1.3, 
    energyBonus: 20, 
    description: 'Um espaço moderno com cenário dedicado. Seus inscritos começam a notar a qualidade.' 
  },
  { 
    id: 'mansion', 
    name: 'Mansão dos Sonhos', 
    entryCost: 150000, 
    weeklyRent: 7000, 
    viewMultiplier: 1.6, 
    energyBonus: 50, 
    description: 'Piscina, área gourmet e muitos cenários para vlogs. Você é oficialmente uma celebridade.' 
  },
  { 
    id: 'studio', 
    name: 'Estúdio Gamer de Elite', 
    entryCost: 1000000, 
    weeklyRent: 20000, 
    viewMultiplier: 2.2, 
    energyBonus: 100, 
    description: 'O auge da carreira. Um prédio tecnológico onde você pode gerenciar sua marca e outros talentos.',
    minCompanyLevel: true
  },
];

const OUTSIDE_WORKS: OutsideWork[] = [
  { id: 'delivery', name: 'Entregador de App', pay: 50, energyCost: 20, minSubs: 0 },
  { id: 'freelancer', name: 'Editor Freelancer', pay: 250, energyCost: 40, minSubs: 5000 },
  { id: 'consulting', name: 'Consultoria de Mídia', pay: 1200, energyCost: 60, minSubs: 50000 },
];

const INITIAL_INVESTMENTS: Investment[] = [
  { id: 'tube', name: 'TubeStock', symbol: 'TUBE', price: 10, previousPrice: 10, type: 'stock', owned: 0 },
  { id: 'banana', name: 'Banana Corp', symbol: 'BNNA', price: 50, previousPrice: 50, type: 'stock', owned: 0 },
  { id: 'macro', name: 'Macrosoft', symbol: 'MSFT', price: 250, previousPrice: 250, type: 'stock', owned: 0 },
  { id: 'bit', name: 'BitCoin', symbol: 'BTC', price: 1000, previousPrice: 1000, type: 'crypto', owned: 0 },
  { id: 'eth', name: 'Ether', symbol: 'ETH', price: 500, previousPrice: 500, type: 'crypto', owned: 0 },
];

const INITIAL_AGENCY: AgencyState = {
  exists: false,
  name: '',
  level: 1,
  reputation: 50,
  specialization: 'none',
  talents: [],
  staff: [],
  monthlyExpenses: 0
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [money, setMoney] = useState(100);
  const [subscribers, setSubscribers] = useState(0);
  const [totalViews, setTotalViews] = useState(0);
  const [energy, setEnergy] = useState(100);
  const [maxEnergy, setMaxEnergy] = useState(100);
  const [week, setWeek] = useState(1);
  const [upgrades, setUpgrades] = useState<Upgrade[]>(INITIAL_UPGRADES);
  const [currentHousingId, setCurrentHousingId] = useState('parents');
  const [videoHistory, setVideoHistory] = useState<Video[]>([]);
  const [investments, setInvestments] = useState<Investment[]>(INITIAL_INVESTMENTS);
  const [agency, setAgency] = useState<AgencyState>(INITIAL_AGENCY);
  const [weeklyReport, setWeeklyReport] = useState<WeeklyReport>({
    views: 0, subscribers: 0, youtubeEarnings: 0, companyEarnings: 0, investmentChange: 0, expenses: 0, housingExpenses: 0, netTotal: 0, isVisible: false, events: []
  });

  const formatDate = (w: number) => {
    const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const totalMonths = Math.floor((w - 1) / 4);
    const year = 2026 + Math.floor(totalMonths / 12);
    const month = months[totalMonths % 12];
    const weekInMonth = ((w - 1) % 4) + 1;
    return `Semana ${weekInMonth} - ${month}/${year}`;
  };

  const publishVideo = (data: PublishVideoData) => {
    const energyCosts = { vlog: 20, games: 25, pov: 15, challenge: 40, trend: 30, dance: 20, music: 50 };
    const cost = energyCosts[data.category];

    if (energy < cost) {
      alert("Você está exausto! Passe a semana para recuperar as energias.");
      return;
    }

    setEnergy(prev => prev - cost);

    const newVideo: Video = {
      id: Math.random().toString(36).substr(2, 9),
      title: data.title || `Vídeo #${videoHistory.length + 1}`,
      category: data.category,
      thumbnail: data.thumbnail,
      views: 0,
      newViews: 0,
      likes: 0,
      comments: 0,
      subscribers: 0,
      earnings: 0,
      isPromoted: data.isPromoted,
      date: Date.now(),
      weeksActive: 0
    };

    if (data.isPromoted) {
      setMoney(prev => prev - data.promotionCost);
    }

    setVideoHistory([newVideo, ...videoHistory]);
  };

  const nextWeek = () => {
    let weekTotalViews = 0;
    let weekTotalSubs = 0;
    let weekYoutubeEarnings = 0;

    const housing = HOUSINGS.find(h => h.id === currentHousingId)!;

    const subMultiplier = upgrades
      .filter(u => u.type === 'luxury')
      .reduce((acc, u) => acc + (u.level * u.multiplier * 0.1), 1);

    const updatedVideos = videoHistory.map(video => {
      const performanceFactor = Math.max(0, Math.pow(0.6, video.weeksActive));
      const categoryMultipliers = { vlog: 1.0, games: 1.2, pov: 0.8, challenge: 1.5, trend: 2.0, dance: 1.3, music: 2.5 };
      const baseViews = (100 + Math.random() * 500) * (1 + subscribers * 0.05);
      const promoMultiplier = video.isPromoted ? 3.0 : 1.0;
      const generatedViews = Math.floor(baseViews * categoryMultipliers[video.category] * promoMultiplier * performanceFactor * housing.viewMultiplier);
      
      let baseRPM = 0.5;
      if (subscribers >= 1000000) baseRPM = 15.0;
      else if (subscribers >= 100000) baseRPM = 5.0 + (subscribers / 1000000) * 7;
      else if (subscribers >= 1000) baseRPM = 1.5 + (subscribers / 100000) * 3.5;
      else baseRPM = 0.5 + (subscribers / 1000) * 1.0;

      const generatedEarnings = (generatedViews / 1000) * baseRPM;
      const generatedSubs = Math.floor(generatedViews * 0.02 * subMultiplier);

      weekTotalViews += generatedViews;
      weekTotalSubs += generatedSubs;
      weekYoutubeEarnings += generatedEarnings;

      return {
        ...video,
        views: video.views + generatedViews,
        newViews: generatedViews,
        earnings: video.earnings + generatedEarnings,
        subscribers: video.subscribers + generatedSubs,
        likes: video.likes + Math.floor(generatedViews * 0.06),
        comments: video.comments + Math.floor(generatedViews * 0.01),
        weeksActive: video.weeksActive + 1
      };
    });

    let weekAgencyEarnings = 0;
    let weekBrandEarnings = 0;
    let weekExpenses = 0;
    const weekEvents: WeeklyReport['events'] = [];
    
    // Process Talents
    const updatedTalents = agency.talents.map(talent => {
      // Simulate weekly growth for each talent
      const performanceFactor = (talent.charisma * 0.5 + talent.creativity * 0.5) * talent.consistency;
      let trendMultiplier = Math.random() * 0.5 + 0.8; // 0.8 to 1.3
      const supportBonus = agency.staff.filter(s => s.role === 'editor' || s.role === 'manager').length * 0.1;
      
      // Event triggers
      const viralChance = talent.creativity / 500; // up to 20% if creativity is 100
      const cancelChance = (talent.ego + (100 - talent.reputation)) / 1000; // up to 20%
      
      if (Math.random() < viralChance) {
          trendMultiplier *= 3;
          weekEvents.push({ title: `VÍDEO VIRAL: ${talent.name}`, desc: "Um vídeo explodiu no algoritmo! Receita e inscritos triplicados esta semana.", type: 'positive' });
      } else if (Math.random() < cancelChance && talent.subscribers > 10000) {
          trendMultiplier *= 0.1;
          weekEvents.push({ title: `CANCELAMENTO: ${talent.name}`, desc: "Uma polêmica antiga surgiu. O público está furioso e o engajamento despencou.", type: 'negative' });
      }

      if (talent.burnout > 80) {
          trendMultiplier *= 0.5;
          weekEvents.push({ title: `BURNOUT: ${talent.name}`, desc: "Talento está exausto e produzindo conteúdo sem qualidade.", type: 'negative' });
      }
      
      const generatedViews = Math.floor(1000 * performanceFactor * trendMultiplier * (1 + supportBonus));
      const generatedSubs = Math.floor(generatedViews * (talent.engagement / 100));
      
      const revenue = (generatedViews / 1000) * 2.5; // Average $2.5 RPM
      
      if (talent.contract) {
        weekAgencyEarnings += revenue * talent.contract.commissionPercent;
      }

      // Brand Revenue
      talent.brands.forEach(brand => {
          const egoPenalty = 1 - (talent.ego / 200); 
          const burnoutPenalty = 1 - (talent.burnout / 150);
          const brandIncome = brand.baseIncome * Math.pow(1.5, brand.level - 1) * brand.synergy * egoPenalty * burnoutPenalty;
          weekBrandEarnings += brandIncome;
      });
      
      // Update burnout and ego
      let newBurnout = talent.burnout + (talent.consistency > 0.8 ? 8 : 4);
      const managerBonus = agency.staff.filter(s => s.role === 'manager').length * 3;
      newBurnout = Math.max(0, newBurnout - managerBonus);
      
      let newEgo = talent.ego + (generatedSubs > 10000 ? 2 : 1);
      newEgo = Math.max(0, newEgo - managerBonus * 0.5);

      return {
        ...talent,
        subscribers: talent.subscribers + generatedSubs,
        totalViews: talent.totalViews + generatedViews,
        burnout: Math.min(100, newBurnout),
        ego: Math.min(100, newEgo),
        contract: talent.contract ? { ...talent.contract, monthsRemaining: Math.max(0, talent.contract.monthsRemaining - 0.25) } : null
      };
    });

    if (agency.exists) {
      const staffCosts = agency.staff.reduce((acc, s) => acc + s.salary, 0);
      weekExpenses = staffCosts + agency.monthlyExpenses / 4;
      setAgency(prev => ({ ...prev, talents: updatedTalents }));
    }

    let invChange = 0;
    setInvestments(prev => prev.map(inv => {
      const volatility = inv.type === 'crypto' ? 0.15 : 0.05;
      const change = 1 + (Math.random() * volatility * 2 - volatility);
      const newPrice = Math.max(1, inv.price * change);
      if (inv.owned > 0) invChange += (newPrice - inv.price) * inv.owned;
      return { ...inv, previousPrice: inv.price, price: Number(newPrice.toFixed(2)) };
    }));

    const housingExpenses = housing.weeklyRent;
    const netTotal = weekYoutubeEarnings + weekAgencyEarnings + weekBrandEarnings - weekExpenses - housingExpenses;

    setMoney(prev => prev + netTotal);
    setSubscribers(prev => prev + weekTotalSubs);
    setTotalViews(prev => prev + weekTotalViews);
    setVideoHistory(updatedVideos);
    setEnergy(maxEnergy + housing.energyBonus);
    setWeek(prev => prev + 1);

    setWeeklyReport({
      views: weekTotalViews, subscribers: weekTotalSubs, youtubeEarnings: weekYoutubeEarnings,
      companyEarnings: weekAgencyEarnings + weekBrandEarnings, investmentChange: invChange, expenses: weekExpenses,
      housingExpenses, netTotal, isVisible: true, events: weekEvents
    });
  };

  const closeReport = () => setWeeklyReport(prev => ({ ...prev, isVisible: false }));

  const buyUpgrade = (id: string) => {
    const upgrade = upgrades.find(u => u.id === id);
    if (!upgrade) return;
    const price = Math.floor(upgrade.basePrice * Math.pow(1.5, upgrade.level));
    if (money >= price) {
      setMoney(prev => prev - price);
      setUpgrades(prev => prev.map(u => u.id === id ? { ...u, level: u.level + 1 } : u));
      if (upgrade.type === 'luxury') setMaxEnergy(prev => prev + 20);
    }
  };

  const buyHousing = (id: string) => {
    const housing = HOUSINGS.find(h => h.id === id);
    if (!housing) return;
    
    if (money >= housing.entryCost) {
      setMoney(prev => prev - housing.entryCost);
      setCurrentHousingId(id);
      setMaxEnergy(100 + housing.energyBonus);
      alert(`Parabéns! Você se mudou para: ${housing.name}`);
    } else {
      alert("Você não tem dinheiro suficiente para a entrada/caução!");
    }
  };

  const workOutside = (id: string) => {
    const work = OUTSIDE_WORKS.find(w => w.id === id);
    if (!work) return;

    if (energy < work.energyCost) {
      alert("Você está muito cansado para este trabalho!");
      return;
    }

    if (subscribers < work.minSubs) {
      alert(`Você precisa de pelo menos ${work.minSubs.toLocaleString()} inscritos para este trabalho.`);
      return;
    }

    setEnergy(prev => prev - work.energyCost);
    setMoney(prev => prev + work.pay);
  };

  const buyInvestment = (id: string, amount: number) => {
    const inv = investments.find(i => i.id === id);
    if (!inv) return;
    const cost = inv.price * amount;
    if (money >= cost) {
      setMoney(prev => prev - cost);
      setInvestments(prev => prev.map(i => i.id === id ? { ...i, owned: i.owned + amount } : i));
    }
  };

  const sellInvestment = (id: string, amount: number) => {
    const inv = investments.find(i => i.id === id);
    if (!inv || inv.owned < amount) return;
    const gain = inv.price * amount;
    setMoney(prev => prev + gain);
    setInvestments(prev => prev.map(i => i.id === id ? { ...i, owned: i.owned - amount } : i));
  };

  const createAgency = (name: string) => setAgency({ ...INITIAL_AGENCY, exists: true, name });
  const hireTalent = (talent: Talent) => setAgency(prev => ({ ...prev, talents: [...prev.talents, talent] }));
  const fireTalent = (talentId: string) => setAgency(prev => ({ ...prev, talents: prev.talents.filter(t => t.id !== talentId) }));
  
  const hireStaff = (role: 'editor' | 'manager' | 'analyst') => {
    const salaries = { editor: 100, manager: 250, analyst: 150 };
    const newStaff: StaffMember = { id: Math.random().toString(36).substr(2, 9), name: `Colaborador ${role}`, role, salary: salaries[role] };
    setAgency(prev => ({ ...prev, staff: [...prev.staff, newStaff] }));
  };

  const launchBrand = (talentId: string, brandName: string, type: Brand['type']) => {
    const costs = { merch: 5000, food: 25000, tech: 100000 };
    if (money >= costs[type]) {
      setMoney(prev => prev - costs[type]);
      setAgency(prev => ({
        ...prev,
        talents: prev.talents.map(t => {
          if (t.id === talentId) {
            const synergyMap = {
              merch: t.niche === 'lifestyle' || t.niche === 'beauty' ? 1.5 : 1.0,
              food: t.niche === 'lifestyle' || t.niche === 'asmr' ? 1.4 : 0.8,
              tech: t.niche === 'tech' || t.niche === 'gaming' ? 1.6 : 0.7
            };
            const newBrand: Brand = {
              id: Math.random().toString(36).substr(2, 9),
              name: brandName,
              type,
              level: 1,
              baseIncome: type === 'merch' ? 100 : type === 'food' ? 500 : 2000,
              synergy: synergyMap[type]
            };
            return { ...t, brands: [...t.brands, newBrand] };
          }
          return t;
        })
      }));
    } else {
      alert("Saldo insuficiente para lançar esta marca!");
    }
  };

  const upgradeTalentBrand = (talentId: string, brandId: string) => {
    setAgency(prev => ({
      ...prev,
      talents: prev.talents.map(t => {
        if (t.id === talentId) {
          return {
            ...t,
            brands: t.brands.map(b => {
              if (b.id === brandId) {
                const cost = b.baseIncome * 20 * b.level;
                if (money >= cost) {
                  setMoney(m => m - cost);
                  return { ...b, level: b.level + 1 };
                }
              }
              return b;
            })
          };
        }
        return t;
      })
    }));
  };

  return (
    <GameContext.Provider value={{
      money, subscribers, totalViews, energy, maxEnergy, week, date: formatDate(week), 
      upgrades, currentHousingId, videoHistory, investments, agency, weeklyReport,
      housings: HOUSINGS,
      outsideWorks: OUTSIDE_WORKS,
      stats: { viewsPerClick: 10, subGainRate: 0.05, moneyPerView: 0.01 },
      addViews: () => {}, publishVideo, buyUpgrade, buyHousing, workOutside,
      buyInvestment, sellInvestment,
      createAgency, hireTalent, fireTalent, hireStaff,
      launchBrand, upgradeTalentBrand,
      nextWeek, closeReport
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
