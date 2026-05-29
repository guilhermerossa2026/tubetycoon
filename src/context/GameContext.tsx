import React, { createContext, useContext, useState, useEffect } from 'react';

// --- TS INTERFACES ---

export interface Upgrade {
  id: string;
  name: string;
  basePrice: number;
  multiplier: number;
  type: 'equipment' | 'luxury';
  level: number;
}

export interface Housing {
  id: string;
  name: string;
  entryCost: number;
  weeklyRent: number;
  viewMultiplier: number;
  energyBonus: number;
  description: string;
  minCompanyLevel?: boolean;
}

export interface HousingUpgrade {
  id: string;
  name: string;
  price: number;
  weeklyMaintenance: number;
  description: string;
  icon: string;
  bonusText: string;
}

export interface Video {
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
  selfPromotion?: {
    companyId: string;
    productId: string;
  } | null;
  communityBonus?: 'views' | 'ctr' | 'subs' | null;
  score: number;
}

export interface Investment {
  id: string;
  name: string;
  symbol: string;
  price: number;
  previousPrice: number;
  type: 'stock' | 'crypto' | 'fii' | 'fixed';
  owned: number;
  averagePrice?: number;
  history?: number[];
  dividendYield?: number;
}

export interface Contract {
  commissionPercent: number; // 0.1 to 0.5
  monthsRemaining: number;
  exclusivity: boolean;
  terminationFine: number;
}

export interface Brand {
  id: string;
  name: string;
  type: 'merch' | 'food' | 'tech';
  level: number;
  baseIncome: number;
  synergy: number;
}

export interface Talent {
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

export interface AgencyState {
  exists: boolean;
  name: string;
  level: number;
  reputation: number;
  specialization: 'none' | 'gaming' | 'lifestyle' | 'premium';
  talents: Talent[];
}

export interface Loan {
  amount: number;
  remainingWeeks: number;
  weeklyPayment: number;
  totalToPay: number;
  interestRate: number;
}

export interface ProductState {
  id: string;
  name: string;
  category: string;
  insumoCost: number;
  price: number;
  stock: number;
  emoji: string;
  isUnlocked: boolean;
  totalSales: number;
  weeklySales: number;
  creatorCollab: string | null;
  collabRoyalties: number;
}

export interface ProductLicense {
  id: string;
  name: string;
  cost: number;
  productIds: string[];
  isUnlocked: boolean;
}

export interface CompanyState {
  id: 'startup' | 'merch' | 'candy' | 'food' | 'tech';
  name: string;
  niche: 'startup' | 'merch' | 'candy' | 'food' | 'tech';
  founded: boolean;
  money: number;
  weeklyMaintenance: number;
  taxRegime: 'real' | 'simples';
  licenses: ProductLicense[];
  products: ProductState[];
  weeklyNegativeCount: number; // 0 to 4
  isBankrupt: boolean;
  totalRevenue: number; // Historical gross revenue
  activeInstallments: number; // For consolidated debt
  installmentValue: number;
  creditScore: number; // 300 to 1000
  maxLoanLimit: number;
  activeLoan: Loan | null;
  web3PayEnabled: boolean;
  marketingCampaignCooldown: number;
  marketingActive: 'none' | 'instagram' | 'live' | 'dedicated';
  marketingWeeksRemaining: number;
}

export interface CryptoTokenState {
  name: string;
  symbol: string;
  price: number;
  previousPrice: number;
  totalSupply: number;
  treasuryOwnedPercent: number; // 0 to 100
  dailyVolume: number;
  hypeMultiplier: number;
}

export interface DREItem {
  name: string;
  revenue: number;
  costs: number;
  taxes: number;
  netProfit: number;
  color: string;
}

export interface WeeklyReport {
  views: number;
  subscribers: number;
  youtubeEarnings: number;
  companyEarnings: number; // Sum of PJ net profits
  investmentChange: number;
  dividendEarnings?: number; // Dividendos em dinheiro da carteira
  expenses: number;
  housingExpenses: number;
  netTotal: number;
  isVisible: boolean;
  events: { title: string; desc: string; type: 'positive' | 'negative' | 'neutral' }[];
  dreData: DREItem[];
}

export interface PublishVideoData {
  title: string;
  category: Video['category'];
  thumbnail: string;
  isPromoted: boolean;
  promotionCost: number;
  selfPromotion?: {
    companyId: string;
    productId: string;
  } | null;
  sponsorPayout?: number;
}

export interface OutsideWork {
  id: string;
  name: string;
  pay: number;
  energyCost: number;
  minSubs: number;
}

export interface GameContextType extends GameState {
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
  nextWeek: () => void;
  closeReport: () => void;
  housings: Housing[];
  outsideWorks: OutsideWork[];
  boughtHousingUpgrades: string[];
  buyHousingUpgrade: (id: string) => void;
  updateChannelProfile: (name: string, handle: string, desc: string) => void;
  makeCommunityPost: (type: 'meme' | 'spoiler' | 'thanks') => void;
  courses: { [key: string]: number };
  luxuryAssets: string[];
  netWorth: number;
  buyCourseSemester: (courseId: string) => void;
  buyLuxuryAsset: (assetId: string) => void;
  
  // PJ Holdings & Web3 Operations
  foundCompany: (niche: 'startup' | 'merch' | 'candy' | 'food' | 'tech', name: string, taxRegime: 'real' | 'simples') => void;
  buyLicense: (companyId: string, licenseId: string) => void;
  buyStock: (companyId: string, productId: string, batchSize: number) => void;
  injectPJCapital: (companyId: string, amount: number) => void;
  withdrawPJDividends: (companyId: string, amount: number) => void;
  consolidatePJDebt: (companyId: string) => void;
  takePJLoan: (companyId: string, amount: number, weeks: number) => void;
  payPJLoan: (companyId: string) => void;
  setPJProductPrice: (companyId: string, productId: string, price: number, customName?: string) => void;
  launchCryptoToken: (name: string, symbol: string) => void;
  vestCryptoTreasury: (percent: number, destination: 'PF' | 'PJ', companyId?: string) => void;
  toggleCryptoPayment: (companyId: string) => void;
  buybackBankruptCompany: (companyId: string) => void;
  startMarketingCampaign: (companyId: string, campaignType: 'instagram' | 'live' | 'dedicated') => void;
  signCreatorCollab: (companyId: string, creatorName: string) => void;
  negotiateAgencyContract: (talent: Talent, commission: number, signingFee: number) => void;
  currentMarketEvent: { title: string; desc: string; type: 'bull' | 'bear' | 'hype' | 'neutral'; assetId?: string } | null;
  depositToInvestmentWallet: (amount: number) => void;
  withdrawFromInvestmentWallet: (amount: number) => void;
  talentMarket: Talent[];
}

export interface GameState {
  money: number; // PF Cash
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
  companies: CompanyState[];
  totalTaxesPaid: number;
  cryptoToken: CryptoTokenState | null;
  boughtHousingUpgrades: string[];
  channelName: string;
  channelHandle: string;
  channelDescription: string;
  communityPostBonus: { type: 'views' | 'ctr' | 'subs'; amount: number } | null;
  currentMarketEvent: { title: string; desc: string; type: 'bull' | 'bear' | 'hype' | 'neutral'; assetId?: string } | null;
  courses: { [key: string]: number };
  luxuryAssets: string[];
  investmentWallet: number; // Caixa exclusivo para investimentos/dividendos
}

// --- STATIC CONFIGURATIONS ---

export const COMPANY_SCHEMES = {
  startup: {
    nicheName: "Produtora & Estúdio Digital",
    foundationCost: 10000,
    maintenance: 100,
    unlockedAtSubs: 15000,
    licenses: [
      {
        id: 'social_media',
        name: 'Licença de Mídias Sociais',
        cost: 3000,
        products: [
          { id: 'post', name: 'Post Patrocinado', insumoCost: 2.00, price: 19.99, emoji: '📱' },
          { id: 'banner', name: 'Design de Banner', insumoCost: 3.00, price: 29.99, emoji: '🎨' }
        ]
      },
      {
        id: 'podcast_prod',
        name: 'Licença de Podcast & Áudio',
        cost: 6000,
        products: [
          { id: 'audio', name: 'Gravação de Áudio Pro', insumoCost: 8.00, price: 79.99, emoji: '🎙️' },
          { id: 'script', name: 'Roteiro Customizado', insumoCost: 10.00, price: 99.99, emoji: '📝' }
        ]
      }
    ],
    basicProduct: { id: 'edicao_video', name: 'Edição de Vídeo Terceirizada', insumoCost: 5.00, price: 39.99, emoji: '💻' }
  },
  merch: {
    nicheName: "Grife de Roupas",
    foundationCost: 50000,
    maintenance: 500,
    unlockedAtSubs: 100000,
    licenses: [
      {
        id: 'accessories',
        name: 'Licença de Acessórios Urbanos',
        cost: 15000,
        products: [
          { id: 'bone', name: 'Boné do Canal', insumoCost: 2.00, price: 19.99, emoji: '🧢' },
          { id: 'meias', name: 'Meias Estampadas Hype', insumoCost: 1.00, price: 9.99, emoji: '🧦' }
        ]
      },
      {
        id: 'premium_wear',
        name: 'Licença de Vestuário Premium',
        cost: 35000,
        products: [
          { id: 'moletom', name: 'Moletom Canguru Premium', insumoCost: 8.00, price: 59.99, emoji: '🧥' },
          { id: 'jaqueta', name: 'Jaqueta Corta-Vento Creator', insumoCost: 12.00, price: 89.99, emoji: '🧥' }
        ]
      }
    ],
    basicProduct: { id: 'camiseta', name: 'Camiseta Básica do Canal', insumoCost: 3.00, price: 24.99, emoji: '👕' }
  },
  candy: {
    nicheName: "Fábrica de Doces",
    foundationCost: 250000,
    maintenance: 1500,
    unlockedAtSubs: 300000,
    licenses: [
      {
        id: 'trufas',
        name: 'Licença de Trufas e Bombons',
        cost: 30000,
        products: [
          { id: 'bombom', name: 'Caixa de Bombons Finos', insumoCost: 3.00, price: 14.99, emoji: '🍬' },
          { id: 'trufa', name: 'Trufa Cremosa de Avelã', insumoCost: 0.80, price: 2.99, emoji: '🍭' }
        ]
      },
      {
        id: 'viral_candy',
        name: 'Licença de Doces Virais e Especiais',
        cost: 70000,
        products: [
          { id: 'pirulito', name: 'Pirulito Gigante Neon', insumoCost: 1.00, price: 5.99, emoji: '🍭' },
          { id: 'tripla_barra', name: 'Barra de Chocolate Tripla', insumoCost: 2.50, price: 11.99, emoji: '🍫' }
        ]
      }
    ],
    basicProduct: { id: 'barra_classica', name: 'Barra de Chocolate Clássica', insumoCost: 1.50, price: 4.99, emoji: '🍫' }
  },
  food: {
    nicheName: "Rede de Fast Food",
    foundationCost: 500000,
    maintenance: 5000,
    unlockedAtSubs: 1000000,
    licenses: [
      {
        id: 'sides',
        name: 'Licença de Acompanhamentos e Bebidas',
        cost: 50000,
        products: [
          { id: 'fritas', name: 'Batata Frita Mega Crocante', insumoCost: 1.50, price: 7.99, emoji: '🍟' },
          { id: 'milkshake', name: 'Milkshake Turbinado', insumoCost: 2.00, price: 9.99, emoji: '🥤' }
        ]
      },
      {
        id: 'giga_burgers',
        name: 'Licença de Giga Burgers Premium',
        cost: 120000,
        products: [
          { id: 'triplo_cheddar', name: 'Triplo Cheddar Bacon', insumoCost: 7.50, price: 24.99, emoji: '🍔' },
          { id: 'balde_frango', name: 'Balde de Frango Frito', insumoCost: 8.00, price: 29.99, emoji: '🍗' }
        ]
      }
    ],
    basicProduct: { id: 'cheeseburger', name: 'Cheeseburger Clássico', insumoCost: 4.00, price: 14.99, emoji: '🍔' }
  },
  tech: {
    nicheName: "Periféricos Gamer",
    foundationCost: 2000000,
    maintenance: 15000,
    unlockedAtSubs: 2500000,
    licenses: [
      {
        id: 'rgb_input',
        name: 'Licença de Teclados e Mouses RGB',
        cost: 250000,
        products: [
          { id: 'mouse_rgb', name: 'Mouse Gamer RGB Óptico', insumoCost: 15.00, price: 69.99, emoji: '🖱️' },
          { id: 'teclado_compacto', name: 'Teclado Mecânico Compacto', insumoCost: 25.00, price: 119.99, emoji: '⌨️' }
        ]
      },
      {
        id: 'audio_comfort',
        name: 'Licença de Som & Conforto Pro',
        cost: 600000,
        products: [
          { id: 'headset_surround', name: 'Headset Gamer Surround 7.1', insumoCost: 45.00, price: 199.99, emoji: '🎧' },
          { id: 'cadeira_ergo', name: 'Cadeira Gamer Ergonômica Pro', insumoCost: 90.00, price: 399.99, emoji: '💺' }
        ]
      }
    ],
    basicProduct: { id: 'mousepad', name: 'Mousepad Gamer Antiderrapante', insumoCost: 5.00, price: 19.99, emoji: '⬜' }
  }
};

export const FAMOUS_CREATORS = [
  { name: "Felipe Neto", tier: 'S' as const, upfrontCost: 1000000, royaltyRate: 0.25, minRoyalty: 0.15, emoji: "🦉" },
  { name: "Alanzoka", tier: 'S' as const, upfrontCost: 850000, royaltyRate: 0.22, minRoyalty: 0.14, emoji: "🎮" },
  { name: "Casimiro", tier: 'A' as const, upfrontCost: 500000, royaltyRate: 0.20, minRoyalty: 0.12, emoji: "🍔" },
  { name: "Lofi Girl", tier: 'A' as const, upfrontCost: 350000, royaltyRate: 0.18, minRoyalty: 0.10, emoji: "🎧" },
  { name: "Windersson", tier: 'B' as const, upfrontCost: 180000, royaltyRate: 0.14, minRoyalty: 0.08, emoji: "🥊" },
  { name: "Cellbit", tier: 'B' as const, upfrontCost: 120000, royaltyRate: 0.12, minRoyalty: 0.06, emoji: "🔍" },
  { name: "Gaules", tier: 'C' as const, upfrontCost: 40000, royaltyRate: 0.09, minRoyalty: 0.05, emoji: "tribo" },
  { name: "Creator Temático", tier: 'C' as const, upfrontCost: 20000, royaltyRate: 0.07, minRoyalty: 0.04, emoji: "⭐" },
];

const INITIAL_UPGRADES: Upgrade[] = [
  { id: 'webcam', name: 'Webcam 720p', basePrice: 50, multiplier: 1.5, type: 'equipment', level: 0 },
  { id: 'mic', name: 'Microfone Condensador', basePrice: 150, multiplier: 2, type: 'equipment', level: 0 },
  { id: 'pc', name: 'PC Gamer Nitro', basePrice: 500, multiplier: 3, type: 'equipment', level: 0 },
  { id: 'chair', name: 'Cadeira Gamer Ergonômica', basePrice: 1000, multiplier: 1.2, type: 'luxury', level: 0 },
];

const HOUSINGS: Housing[] = [
  { id: 'parents', name: 'Casa da Mãe', entryCost: 0, weeklyRent: 50, viewMultiplier: 1.0, energyBonus: 0, description: 'O Wi-Fi cai às vezes, mas a comida é por conta da casa.' },
  { id: 'rented_room', name: 'Quarto Alugado', entryCost: 1000, weeklyRent: 300, viewMultiplier: 1.15, energyBonus: 0, description: 'Seu primeiro passo rumo à independência. Mais foco para gravar.' },
  { id: 'apartment', name: 'Apartamento Creator', entryCost: 15000, weeklyRent: 1200, viewMultiplier: 1.3, energyBonus: 20, description: 'Cenário dedicado moderno. Seus inscritos notam o upgrade.' },
  { id: 'mansion', name: 'Mansão dos Sonhos', entryCost: 150000, weeklyRent: 7000, viewMultiplier: 1.6, energyBonus: 50, description: 'Piscina e cenários incríveis. Você é oficialmente uma celebridade.' },
  { id: 'studio', name: 'Estúdio Gamer de Elite', entryCost: 1000000, weeklyRent: 20000, viewMultiplier: 2.2, energyBonus: 100, description: 'Prédio tecnológico para gerenciar marcas, parcerias e seu canal.', minCompanyLevel: true },
];

export const HOUSING_UPGRADES: HousingUpgrade[] = [
  { id: 'fibra', name: 'Internet Fibra 1GB', price: 1500, weeklyMaintenance: 50, description: 'Velocidade extrema de conexão para postagens instantâneas.', icon: '🌐', bonusText: '+10% views em Games, Vlog e POV' },
  { id: 'acustica', name: 'Isolamento Acústico', price: 3000, weeklyMaintenance: 20, description: 'Tratamento acústico de estúdio profissional com espumas.', icon: '🎙️', bonusText: '-5 de custo de energia para todos os vídeos' },
  { id: 'rgb', name: 'Painel Neon RGB', price: 2000, weeklyMaintenance: 30, description: 'Iluminação futurista configurável para o cenário de gravação.', icon: '💡', bonusText: '+15% views em Dança, Trend e Desafios' },
  { id: 'cafe', name: 'Cafeteira Expresso Pro', price: 4000, weeklyMaintenance: 40, description: 'Cafés gourmet italianos de altíssima octanagem e sabor.', icon: '☕', bonusText: '+10 Energia Máxima Permanente' }
];

export interface CourseInfo {
  id: string;
  name: string;
  semesterPrices: number[];
  description: string;
  icon: string;
}

export const COURSES_INFO: CourseInfo[] = [
  { id: 'storytelling', name: 'Storytelling e Roteiro para Vídeo', semesterPrices: [500, 1000, 1500, 3000], description: 'Domine a arte de prender a atenção com narrativas envolventes.', icon: '📚' },
  { id: 'marketing', name: 'Marketing Digital + SEO para YouTube', semesterPrices: [800, 1600, 2400, 4800], description: 'Aprenda os segredos do algoritmo, CTR e ranqueamento na busca.', icon: '📈' },
  { id: 'edicao', name: 'Edição de Vídeo Profissional', semesterPrices: [1200, 2400, 3600, 7200], description: 'Cortes dinâmicos, sonorização premium, efeitos e retenção.', icon: '🎞️' },
  { id: 'monetizacao', name: 'Monetização e Negócios para Creators', semesterPrices: [2000, 4000, 6000, 12000], description: 'Transforme visualizações em patrocinadores de luxo e marcas PJ.', icon: '💼' }
];

export interface LuxuryAsset {
  id: string;
  name: string;
  category: 'casas' | 'carros' | 'aviacao' | 'porto' | 'colecoes';
  price: number;
  description: string;
  icon: string;
}

export const LUXURY_ASSETS: LuxuryAsset[] = [
  // Casas
  { id: 'loft', name: 'Loft Compacto no Centro', category: 'casas', price: 30000, description: 'Um espaço moderno e prático no centro da cidade.', icon: '🏢' },
  { id: 'duplex', name: 'Duplex de Alto Padrão', category: 'casas', price: 150000, description: 'Apartamento de dois andares com vista incrível.', icon: '🏠' },
  { id: 'cobertura', name: 'Cobertura Triplex', category: 'casas', price: 800000, description: 'Piscina privativa na cobertura e acabamento em mármore.', icon: '🌇' },
  { id: 'mansao_susp', name: 'Mansão Suspensa na Riviera', category: 'casas', price: 4000000, description: 'Mansão luxuosa de frente para a praia com heliporto.', icon: '🏰' },
  { id: 'resort', name: 'Resort Privado na Ilha', category: 'casas', price: 25000000, description: 'Uma ilha inteira com resort cinco estrelas exclusivo.', icon: '🏝️' },

  // Carros
  { id: 'sedan', name: 'Sedan Executivo Alemão', category: 'carros', price: 60000, description: 'Elegância, conforto e motor turbo para o dia a dia.', icon: '🚗' },
  { id: 'suv', name: 'SUV Esportivo Importado', category: 'carros', price: 200000, description: 'Espaço, luxo e presença imponente nas ruas.', icon: '🚙' },
  { id: 'supercar', name: 'Supercarro Italiano', category: 'carros', price: 1200000, description: 'Motor V12 que vai de 0 a 100 em 2.9 segundos.', icon: '🏎️' },
  { id: 'hypercar', name: 'Hypercar Elétrico Exclusivo', category: 'carros', price: 5000000, description: 'Edição limitada de fibra de carbono com 2000 cavalos.', icon: '⚡' },

  // Aviação
  { id: 'hel_robinson', name: 'Helicóptero Robinson', category: 'aviacao', price: 450000, description: 'Evite o trânsito da cidade voando com praticidade.', icon: '🚁' },
  { id: 'hel_luxo', name: 'Helicóptero VIP Biturbina', category: 'aviacao', price: 2500000, description: 'Estofamento de grife e isolamento acústico superior.', icon: '🚁' },
  { id: 'jato_medio', name: 'Jato Executivo Médio', category: 'aviacao', price: 12000000, description: 'Autonomia para voar com total privacidade e conforto.', icon: '✈️' },
  { id: 'superjato', name: 'Gulfstream Superjato', category: 'aviacao', price: 48000000, description: 'Voe de forma intercontinental com a maior cabine do mercado.', icon: '🛩️' },

  // Porto
  { id: 'jetski', name: 'Jetski de Corrida 300hp', category: 'porto', price: 25000, description: 'Aceleração brutal na água para os fins de semana.', icon: '🚤' },
  { id: 'iate_comp', name: 'Iate Compacto Premium', category: 'porto', price: 900000, description: 'Cabine climatizada e espaço gourmet para passar o dia.', icon: '🚢' },
  { id: 'megaiate', name: 'Megaiate de 100 Metros', category: 'porto', price: 65000000, description: 'Piscina de vidro, heliponto, cinema e garagem de lanchas.', icon: '🛳️' },

  // Coleções
  { id: 'rolex', name: 'Relógio Suíço Rolex', category: 'colecoes', price: 20000, description: 'O maior símbolo de sucesso tradicional no pulso.', icon: '⌚' },
  { id: 'richard', name: 'Relógio Richard Mille Raro', category: 'colecoes', price: 350000, description: 'Alta relojoaria de fibra de carbono ultra-esportiva.', icon: '⌚' },
  { id: 'leao', name: 'Leão Branco de Estimação', category: 'colecoes', price: 180000, description: 'Um felino majestoso que vive no jardim da sua mansão.', icon: '🦁' },
  { id: 'trex', name: 'Fóssil Completo de T-Rex', category: 'colecoes', price: 1500000, description: 'Um esqueleto real de dinossauro exposto na sua entrada.', icon: '🦖' },
  { id: 'quadro', name: 'Pintura Clássica Rara', category: 'colecoes', price: 10000000, description: 'Obra de arte original de um mestre renascentista.', icon: '🖼️' }
];

const OUTSIDE_WORKS: OutsideWork[] = [
  { id: 'delivery', name: 'Entregador de App', pay: 50, energyCost: 20, minSubs: 0 },
  { id: 'freelancer', name: 'Editor Freelancer', pay: 250, energyCost: 40, minSubs: 5000 },
  { id: 'consulting', name: 'Consultoria de Mídia', pay: 1200, energyCost: 60, minSubs: 50000 },
];

const INITIAL_INVESTMENTS: Investment[] = [
  // AÇÕES (Stocks)
  { id: 'tube', name: 'TubeStock Inc.', symbol: 'TUBE', price: 10.00, previousPrice: 10.00, type: 'stock', owned: 0, averagePrice: 0, history: [10.2, 9.8, 10.1, 9.9, 10.3, 9.7, 10.0, 10.0] },
  { id: 'banana', name: 'Banana Corp.', symbol: 'BNNA', price: 50.00, previousPrice: 50.00, type: 'stock', owned: 0, averagePrice: 0, history: [47.5, 49.0, 48.2, 51.5, 52.0, 49.8, 50.0, 50.0] },
  { id: 'macro', name: 'Macrosoft S.A.', symbol: 'MSFT', price: 250.00, previousPrice: 250.00, type: 'stock', owned: 0, averagePrice: 0, history: [244.0, 248.5, 246.0, 252.0, 249.0, 251.5, 250.0, 250.0] },
  { id: 'gogl', name: 'Goolge Corp.', symbol: 'GOGL', price: 400.00, previousPrice: 400.00, type: 'stock', owned: 0, averagePrice: 0, history: [388.0, 395.0, 402.5, 397.0, 405.0, 396.5, 400.0, 400.0] },

  // CRIPTOMOEDAS (Cryptos)
  { id: 'bit', name: 'Bitcoin Cash', symbol: 'BTC', price: 1000.00, previousPrice: 1000.00, type: 'crypto', owned: 0, averagePrice: 0, history: [910.0, 1060.0, 975.0, 1120.0, 880.0, 960.0, 1000.0, 1000.0] },
  { id: 'eth', name: 'Ether Network', symbol: 'ETH', price: 500.00, previousPrice: 500.00, type: 'crypto', owned: 0, averagePrice: 0, history: [455.0, 525.0, 478.0, 545.0, 485.0, 512.0, 500.0, 500.0] },
  { id: 'doge', name: 'DogCoin Meme', symbol: 'DOGE', price: 0.50, previousPrice: 0.50, type: 'crypto', owned: 0, averagePrice: 0, history: [0.41, 0.63, 0.35, 0.48, 0.56, 0.44, 0.50, 0.50] },

  // FUNDOS IMOBILIÁRIOS (FIIs - Dividendos Semanais em Caixa)
  { id: 'reit', name: 'FII Logística Global', symbol: 'REIT11', price: 100.00, previousPrice: 100.00, type: 'fii', owned: 0, averagePrice: 0, history: [98.5, 101.2, 99.8, 100.5, 99.2, 100.0, 100.0, 100.0], dividendYield: 0.0040 }, // 0.4% semanal
  { id: 'mall', name: 'FII Shopping Centers', symbol: 'MALL11', price: 80.00, previousPrice: 80.00, type: 'fii', owned: 0, averagePrice: 0, history: [78.2, 81.5, 79.0, 80.8, 79.2, 80.0, 80.0, 80.0], dividendYield: 0.0050 }, // 0.5% semanal
  { id: 'office', name: 'FII Lajes Corporativas', symbol: 'OFFI11', price: 120.00, previousPrice: 120.00, type: 'fii', owned: 0, averagePrice: 0, history: [118.5, 121.0, 119.5, 120.8, 119.0, 120.0, 120.0, 120.0], dividendYield: 0.0045 }, // 0.45% semanal
  { id: 'agro', name: 'FII Fiagro Agronegócio', symbol: 'AGRO11', price: 90.00, previousPrice: 90.00, type: 'fii', owned: 0, averagePrice: 0, history: [88.5, 91.2, 89.0, 90.5, 89.5, 90.0, 90.0, 90.0], dividendYield: 0.0055 }, // 0.55% semanal

  // RENDA FIXA (Retorno garantido e estável, volatilidade zero!)
  { id: 'selic', name: 'Tesouro Selic Pós', symbol: 'SELIC', price: 100.00, previousPrice: 100.00, type: 'fixed', owned: 0, averagePrice: 0, history: [98.7, 98.9, 99.1, 99.3, 99.5, 99.7, 99.9, 100.0], dividendYield: 0.0018 }, // +0.18% semanal fixo
  { id: 'cdb', name: 'CDB 102% Liquidez Diária', symbol: 'CDB', price: 1.00, previousPrice: 1.00, type: 'fixed', owned: 0, averagePrice: 0, history: [0.985, 0.987, 0.989, 0.991, 0.993, 0.995, 0.997, 1.00], dividendYield: 0.0021 }, // +0.21% semanal fixo
  { id: 'ipca', name: 'Tesouro IPCA+ Inflação', symbol: 'IPCA', price: 1000.00, previousPrice: 1000.00, type: 'fixed', owned: 0, averagePrice: 0, history: [982.0, 985.0, 987.0, 990.0, 992.0, 995.0, 997.0, 1000.0], dividendYield: 0.0025 } // +0.25% semanal fixo
];

const INITIAL_AGENCY: AgencyState = {
  exists: false,
  name: '',
  level: 1,
  reputation: 50,
  specialization: 'none',
  talents: []
};

const INITIAL_COMPANIES: CompanyState[] = [
  {
    id: 'startup',
    name: 'Minha Produtora Digital',
    niche: 'startup',
    founded: false,
    money: 0,
    weeklyMaintenance: 100,
    taxRegime: 'simples',
    licenses: [],
    products: [],
    weeklyNegativeCount: 0,
    isBankrupt: false,
    totalRevenue: 0,
    activeInstallments: 0,
    installmentValue: 0,
    creditScore: 500,
    maxLoanLimit: 10000,
    activeLoan: null,
    web3PayEnabled: false,
    marketingCampaignCooldown: 0,
    marketingActive: 'none',
    marketingWeeksRemaining: 0
  },
  {
    id: 'merch',
    name: 'Minha Grife de Roupas',
    niche: 'merch',
    founded: false,
    money: 0,
    weeklyMaintenance: 500,
    taxRegime: 'simples',
    licenses: [],
    products: [],
    weeklyNegativeCount: 0,
    isBankrupt: false,
    totalRevenue: 0,
    activeInstallments: 0,
    installmentValue: 0,
    creditScore: 500,
    maxLoanLimit: 10000,
    activeLoan: null,
    web3PayEnabled: false,
    marketingCampaignCooldown: 0,
    marketingActive: 'none',
    marketingWeeksRemaining: 0
  },
  {
    id: 'candy',
    name: 'Minha Fábrica de Doces',
    niche: 'candy',
    founded: false,
    money: 0,
    weeklyMaintenance: 1500,
    taxRegime: 'simples',
    licenses: [],
    products: [],
    weeklyNegativeCount: 0,
    isBankrupt: false,
    totalRevenue: 0,
    activeInstallments: 0,
    installmentValue: 0,
    creditScore: 500,
    maxLoanLimit: 10000,
    activeLoan: null,
    web3PayEnabled: false,
    marketingCampaignCooldown: 0,
    marketingActive: 'none',
    marketingWeeksRemaining: 0
  },
  {
    id: 'food',
    name: 'Minha Rede de Fast Food',
    niche: 'food',
    founded: false,
    money: 0,
    weeklyMaintenance: 5000,
    taxRegime: 'simples',
    licenses: [],
    products: [],
    weeklyNegativeCount: 0,
    isBankrupt: false,
    totalRevenue: 0,
    activeInstallments: 0,
    installmentValue: 0,
    creditScore: 500,
    maxLoanLimit: 10000,
    activeLoan: null,
    web3PayEnabled: false,
    marketingCampaignCooldown: 0,
    marketingActive: 'none',
    marketingWeeksRemaining: 0
  },
  {
    id: 'tech',
    name: 'Meus Periféricos Gamer',
    niche: 'tech',
    founded: false,
    money: 0,
    weeklyMaintenance: 15000,
    taxRegime: 'simples',
    licenses: [],
    products: [],
    weeklyNegativeCount: 0,
    isBankrupt: false,
    totalRevenue: 0,
    activeInstallments: 0,
    installmentValue: 0,
    creditScore: 500,
    maxLoanLimit: 10000,
    activeLoan: null,
    web3PayEnabled: false,
    marketingCampaignCooldown: 0,
    marketingActive: 'none',
    marketingWeeksRemaining: 0
  }
];

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
  const [boughtHousingUpgrades, setBoughtHousingUpgrades] = useState<string[]>([]);
  const [videoHistory, setVideoHistory] = useState<Video[]>([]);
  const [investments, setInvestments] = useState<Investment[]>(INITIAL_INVESTMENTS);
  const [agency, setAgency] = useState<AgencyState>(INITIAL_AGENCY);
  const [companies, setCompanies] = useState<CompanyState[]>(INITIAL_COMPANIES);
  const [totalTaxesPaid, setTotalTaxesPaid] = useState(0);
  const [cryptoToken, setCryptoToken] = useState<CryptoTokenState | null>(null);
  const [talentMarket, setTalentMarket] = useState<Talent[]>(() => {
    const potentials = ['S', 'A', 'B', 'C'] as const;
    const names = ["Gabriel", "Juliana", "Felipe", "Mariana", "Lucas", "Beatriz", "Pedro", "Luana"];
    const niches = ['gaming', 'lifestyle', 'tech', 'asmr', 'beauty', 'finance'] as const;

    return potentials.map((pot, idx) => {
      const niche = niches[idx % niches.length];
      const subs = Math.floor(10000 * (idx + 1) * (pot === 'S' ? 5 : pot === 'A' ? 3 : 1));
      const randomName = `${names[idx % names.length]} #${Math.floor(Math.random() * 900 + 100)}`;
      return {
        id: `agency_market_${pot}_${idx}_${Math.floor(Math.random() * 100000)}`,
        name: randomName,
        niche,
        charisma: pot === 'S' ? 88 : pot === 'A' ? 76 : pot === 'B' ? 62 : 48,
        consistency: 0.8,
        creativity: pot === 'S' ? 90 : pot === 'A' ? 78 : pot === 'B' ? 64 : 50,
        engagement: 6.5,
        reputation: 60,
        ego: pot === 'S' ? 80 : 45,
        potential: pot,
        burnout: 0,
        subscribers: subs,
        totalViews: subs * 15,
        contract: null,
        brands: []
      };
    });
  });
  
  const [channelName, setChannelName] = useState('Seu Canal');
  const [channelHandle, setChannelHandle] = useState('novo_user');
  const [channelDescription, setChannelDescription] = useState('Bem-vindo ao meu império! Aqui você encontra os melhores conteúdos.');
  const [communityPostBonus, setCommunityPostBonus] = useState<{ type: 'views' | 'ctr' | 'subs'; amount: number } | null>(null);

  const [courses, setCourses] = useState<{ [key: string]: number }>({ storytelling: 0, marketing: 0, edicao: 0, monetizacao: 0 });
  const [luxuryAssets, setLuxuryAssets] = useState<string[]>([]);

  const [weeklyReport, setWeeklyReport] = useState<WeeklyReport>({
    views: 0, subscribers: 0, youtubeEarnings: 0, companyEarnings: 0, investmentChange: 0, expenses: 0, housingExpenses: 0, netTotal: 0, isVisible: false, events: [], dreData: []
  });

  const [currentMarketEvent, setCurrentMarketEvent] = useState<{ title: string; desc: string; type: 'bull' | 'bear' | 'hype' | 'neutral'; assetId?: string } | null>(null);
  const [investmentWallet, setInvestmentWallet] = useState(0);

  const formatDate = (w: number) => {
    const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const totalMonths = Math.floor((w - 1) / 4);
    const year = 2026 + Math.floor(totalMonths / 12);
    const month = months[totalMonths % 12];
    const weekInMonth = ((w - 1) % 4) + 1;
    return `Semana ${weekInMonth} - ${month}/${year}`;
  };

  const addViews = (amount: number) => {
    // Add views manually if needed
    setTotalViews(prev => prev + amount);
  };

  const publishVideo = (data: PublishVideoData) => {
    const energyCosts = { vlog: 30, games: 35, pov: 30, challenge: 50, trend: 40, dance: 30, music: 60 };
    let cost = energyCosts[data.category];

    if (boughtHousingUpgrades.includes('acustica')) {
      cost = Math.max(5, cost - 5);
    }

    if (energy < cost) {
      alert("Você está exausto! Passe a semana para recuperar as energias.");
      return;
    }

    setEnergy(prev => prev - cost);

    const sumSemesters = Object.values(courses).reduce((a, b) => a + b, 0);
    const qualityScore = Math.floor((sumSemesters / 16) * 100);
    const baseRandom = 1 + Math.random() * 5;
    const qualityBonus = (qualityScore / 100) * 4;
    const videoScore = Math.min(10, Number((baseRandom + qualityBonus).toFixed(1)));

    const newVideo: Video = {
      id: Math.random().toString(36).substring(2, 11),
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
      weeksActive: 0,
      selfPromotion: data.selfPromotion || null,
      communityBonus: communityPostBonus ? communityPostBonus.type : null,
      score: videoScore
    };

    setCommunityPostBonus(null);

    if (data.isPromoted) {
      setMoney(prev => prev - data.promotionCost);
    }

    if (data.sponsorPayout) {
      const payout = data.sponsorPayout;
      setMoney(prev => prev + payout);
    }

    setVideoHistory([newVideo, ...videoHistory]);
  };

  // --- BUSINESS CORE ACTIONS ---

  const foundCompany = (niche: 'startup' | 'merch' | 'candy' | 'food' | 'tech', name: string, taxRegime: 'real' | 'simples') => {
    const scheme = COMPANY_SCHEMES[niche];
    if (money < scheme.foundationCost) {
      alert("Saldo pessoal PF insuficiente para pagar o custo de fundação!");
      return;
    }
    if (subscribers < scheme.unlockedAtSubs) {
      alert(`Requisito de inscritos não alcançado! Requer ${scheme.unlockedAtSubs.toLocaleString()} subs.`);
      return;
    }

    setMoney(prev => prev - scheme.foundationCost);

    const initialProducts: ProductState[] = [
      {
        id: scheme.basicProduct.id,
        name: scheme.basicProduct.name,
        category: 'basic',
        insumoCost: scheme.basicProduct.insumoCost,
        price: scheme.basicProduct.price,
        stock: 0,
        emoji: scheme.basicProduct.emoji,
        isUnlocked: true,
        totalSales: 0,
        weeklySales: 0,
        creatorCollab: null,
        collabRoyalties: 0
      }
    ];

    scheme.licenses.forEach(lic => {
      lic.products.forEach(p => {
        initialProducts.push({
          id: p.id,
          name: p.name,
          category: lic.id,
          insumoCost: p.insumoCost,
          price: p.price,
          stock: 0,
          emoji: p.emoji,
          isUnlocked: false,
          totalSales: 0,
          weeklySales: 0,
          creatorCollab: null,
          collabRoyalties: 0
        });
      });
    });

    const newCompany: CompanyState = {
      id: niche,
      name,
      niche,
      founded: true,
      money: 0, // Starts at 0, needs PF injeção
      weeklyMaintenance: scheme.maintenance,
      taxRegime,
      licenses: scheme.licenses.map(lic => ({ id: lic.id, name: lic.name, cost: lic.cost, productIds: lic.products.map(p => p.id), isUnlocked: false })),
      products: initialProducts,
      weeklyNegativeCount: 0,
      isBankrupt: false,
      totalRevenue: 0,
      activeInstallments: 0,
      installmentValue: 0,
      creditScore: 500,
      maxLoanLimit: 10000,
      activeLoan: null,
      web3PayEnabled: false,
      marketingCampaignCooldown: 0,
      marketingActive: 'none',
      marketingWeeksRemaining: 0
    };

    setCompanies(prev => prev.map(c => c.id === niche ? newCompany : c));
  };

  const buyLicense = (companyId: string, licenseId: string) => {
    setCompanies(prev => prev.map(comp => {
      if (comp.id !== companyId) return comp;
      const targetLicense = comp.licenses.find(l => l.id === licenseId);
      if (!targetLicense) return comp;

      if (comp.money < targetLicense.cost) {
        alert("Caixa da Empresa (PJ) insuficiente! Você entrará em cheque especial.");
      }

      const updatedLicenses = comp.licenses.map(l => l.id === licenseId ? { ...l, isUnlocked: true } : l);
      const updatedProducts = comp.products.map(p => p.category === licenseId ? { ...p, isUnlocked: true } : p);

      return {
        ...comp,
        money: comp.money - targetLicense.cost,
        licenses: updatedLicenses,
        products: updatedProducts
      };
    }));
  };

  const buyStock = (companyId: string, productId: string, batchSize: number) => {
    setCompanies(prev => prev.map(comp => {
      if (comp.id !== companyId) return comp;
      const product = comp.products.find(p => p.id === productId);
      if (!product) return comp;

      const totalCost = product.insumoCost * batchSize;
      if (comp.money < totalCost) {
        alert("Caixa PJ insuficiente! Realizando compra com Cheque Especial.");
      }

      const updatedProducts = comp.products.map(p => p.id === productId ? { ...p, stock: p.stock + batchSize } : p);

      return {
        ...comp,
        money: comp.money - totalCost,
        products: updatedProducts
      };
    }));
  };

  const injectPJCapital = (companyId: string, amount: number) => {
    if (money < amount) {
      alert("Você não possui saldo pessoal (PF) suficiente!");
      return;
    }

    const netAmount = amount * 0.982; // 1.8% transaction fee
    setMoney(prev => prev - amount);
    setCompanies(prev => prev.map(comp => comp.id === companyId ? { ...comp, money: comp.money + netAmount } : comp));
  };

  const withdrawPJDividends = (companyId: string, amount: number) => {
    setCompanies(prev => prev.map(comp => {
      if (comp.id !== companyId) return comp;
      if (comp.money < amount) {
        alert("A empresa não possui saldo em caixa PJ suficiente para retirar este valor!");
        return comp;
      }

      let netAmount = amount;
      let taxDeducted = 0;

      if (comp.taxRegime === 'real') {
        taxDeducted = amount * 0.15; // 15% dividend tax
        netAmount = amount - taxDeducted;
        setTotalTaxesPaid(t => t + taxDeducted);
      }

      setMoney(m => m + netAmount);
      return {
        ...comp,
        money: comp.money - amount
      };
    }));
  };

  const consolidatePJDebt = (companyId: string) => {
    setCompanies(prev => prev.map(comp => {
      if (comp.id !== companyId) return comp;
      if (comp.money >= 0 && !comp.activeLoan) {
        alert("Esta empresa não possui dívidas pendentes!");
        return comp;
      }

      const loanBalance = comp.activeLoan ? comp.activeLoan.totalToPay : 0;
      const currentDebt = comp.money < 0 ? Math.abs(comp.money) : 0;
      const totalDebt = currentDebt + loanBalance;

      if (totalDebt <= 0) return comp;

      // 10% fee applied
      const totalConsolidated = totalDebt * 1.1;
      const installmentValue = totalConsolidated / 5;

      return {
        ...comp,
        money: 0,
        activeLoan: null,
        activeInstallments: 5,
        installmentValue,
        weeklyNegativeCount: 0 // Reset/Freeze bankruptcy count
      };
    }));
    alert("Dívidas consolidadas! Parceladas em 5 prestações semanais pagas pelo caixa PJ. Risco de falência pausado!");
  };

  const takePJLoan = (companyId: string, amount: number, weeks: number) => {
    setCompanies(prev => prev.map(comp => {
      if (comp.id !== companyId) return comp;
      if (comp.activeLoan) {
        alert("Esta empresa já possui um empréstimo ativo no momento!");
        return comp;
      }

      if (amount > comp.maxLoanLimit) {
        alert(`O limite máximo de crédito disponível para esta empresa é de $${comp.maxLoanLimit.toLocaleString()}!`);
        return comp;
      }

      // Juros based on score: 8% (at 300) to 1.8% (at 1000)
      const interestRate = 0.08 - ((comp.creditScore - 300) / 700) * 0.062;
      const totalToPay = amount * (1 + interestRate * weeks);
      const weeklyPayment = totalToPay / weeks;

      const newLoan: Loan = {
        amount,
        remainingWeeks: weeks,
        weeklyPayment,
        totalToPay,
        interestRate
      };

      return {
        ...comp,
        money: comp.money + amount,
        activeLoan: newLoan
      };
    }));
  };

  const payPJLoan = (companyId: string) => {
    setCompanies(prev => prev.map(comp => {
      if (comp.id !== companyId || !comp.activeLoan) return comp;
      const cost = comp.activeLoan.totalToPay;

      if (comp.money < cost) {
        alert("Caixa PJ insuficiente para quitar o empréstimo!");
        return comp;
      }

      // Successful loan payoff triples limit and adds +50 credit score
      const newScore = Math.min(1000, comp.creditScore + 50);
      const newMaxLimit = comp.maxLoanLimit * 3;

      return {
        ...comp,
        money: comp.money - cost,
        activeLoan: null,
        creditScore: newScore,
        maxLoanLimit: newMaxLimit
      };
    }));
    alert("Empréstimo quitado antecipadamente com sucesso! Score de crédito aumentado e limite de empréstimo TRIPLCADO (3x)!");
  };

  const setPJProductPrice = (companyId: string, productId: string, price: number, customName?: string) => {
    setCompanies(prev => prev.map(comp => {
      if (comp.id !== companyId) return comp;
      const updatedProducts = comp.products.map(p => {
        if (p.id === productId) {
          return {
            ...p,
            price,
            name: customName || p.name
          };
        }
        return p;
      });
      return {
        ...comp,
        products: updatedProducts
      };
    }));
  };

  const launchCryptoToken = (name: string, symbol: string) => {
    const cost = 40000000;
    if (money < cost) {
      alert("Saldo pessoal (PF) de $40M necessário para criar a criptomoeda!");
      return;
    }

    setMoney(prev => prev - cost);
    setCryptoToken({
      name,
      symbol: symbol.toUpperCase(),
      price: 1.00,
      previousPrice: 1.00,
      totalSupply: 100000000,
      treasuryOwnedPercent: 100,
      dailyVolume: 2500000,
      hypeMultiplier: 1.0
    });
    alert(`Criptomoeda ${name} ($${symbol.toUpperCase()}) lançada com sucesso no mercado Web3!`);
  };

  const vestCryptoTreasury = (percent: number, destination: 'PF' | 'PJ', companyId?: string) => {
    if (!cryptoToken) return;
    if (cryptoToken.treasuryOwnedPercent < percent) {
      alert("Você não possui tokens de tesouraria suficientes!");
      return;
    }

    const tokenAmount = (percent / 100) * cryptoToken.totalSupply;
    const dollarsGenerated = tokenAmount * cryptoToken.price;

    setCryptoToken(prev => prev ? { ...prev, treasuryOwnedPercent: prev.treasuryOwnedPercent - percent } : null);

    if (destination === 'PF') {
      setMoney(m => m + dollarsGenerated);
      alert(`Vendido ${percent}% da Tesouraria por $${dollarsGenerated.toLocaleString()} injetados na sua conta pessoal (PF)!`);
    } else if (destination === 'PJ' && companyId) {
      setCompanies(prev => prev.map(comp => comp.id === companyId ? { ...comp, money: comp.money + dollarsGenerated } : comp));
      alert(`Vendido ${percent}% da Tesouraria por $${dollarsGenerated.toLocaleString()} injetados no caixa PJ de ${companyId}!`);
    }
  };

  const toggleCryptoPayment = (companyId: string) => {
    setCompanies(prev => prev.map(comp => comp.id === companyId ? { ...comp, web3PayEnabled: !comp.web3PayEnabled } : comp));
  };

  const buybackBankruptCompany = (companyId: string) => {
    const comp = companies.find(c => c.id === companyId);
    if (!comp || !comp.isBankrupt) return;

    const buybackCost = Math.max(50000, comp.totalRevenue * 2);
    if (money < buybackCost) {
      alert(`Saldo pessoal (PF) insuficiente! Custo de compra da falência: $${buybackCost.toLocaleString()}`);
      return;
    }

    setMoney(prev => prev - buybackCost);
    setCompanies(prev => prev.map(c => {
      if (c.id === companyId) {
        return {
          ...c,
          money: 10000, // Reopens with 10k PJ cash
          isBankrupt: false,
          weeklyNegativeCount: 0,
          activeLoan: null,
          activeInstallments: 0,
          installmentValue: 0
        };
      }
      return c;
    }));
    alert(`Empresa comprada da falência por $${buybackCost.toLocaleString()}! Operações restabelecidas.`);
  };

  const startMarketingCampaign = (companyId: string, campaignType: 'instagram' | 'live' | 'dedicated') => {
    const campaignCosts = { instagram: 2000, live: 8000, dedicated: 25000 };
    const cost = campaignCosts[campaignType];

    setCompanies(prev => prev.map(comp => {
      if (comp.id !== companyId) return comp;
      if (comp.marketingCampaignCooldown > 0) {
        alert("Campanhas de marketing em cooldown de 4 semanas!");
        return comp;
      }
      if (comp.money < cost) {
        alert("Caixa PJ insuficiente! Entrando em cheque especial para pagar campanha.");
      }

      return {
        ...comp,
        money: comp.money - cost,
        marketingActive: campaignType,
        marketingWeeksRemaining: 1, // Lasts 1 week
        marketingCampaignCooldown: 4 // Cooldown 4 weeks
      };
    }));
  };

  const signCreatorCollab = (companyId: string, creatorName: string) => {
    const creator = FAMOUS_CREATORS.find(c => c.name === creatorName);
    if (!creator) return;

    setCompanies(prev => prev.map(comp => {
      if (comp.id !== companyId) return comp;
      if (comp.money < creator.upfrontCost) {
        alert(`Saldo PJ insuficiente para cachê upfront de $${creator.upfrontCost.toLocaleString()}!`);
        return comp;
      }

      // Generate special collab product
      const randomId = 'collab_' + creatorName.toLowerCase().replace(/\s+/g, '_');
      
      // Determine stats based on top tier product of this niche
      let insumo = 4.00;
      let price = 24.99;
      let emoji = "👕";
      if (comp.niche === 'candy') { insumo = 2.00; price = 9.99; emoji = "🍫"; }
      else if (comp.niche === 'food') { insumo = 6.00; price = 19.99; emoji = "🍔"; }
      else if (comp.niche === 'tech') { insumo = 50.00; price = 199.99; emoji = "⌨️"; }

      const newCollabProduct: ProductState = {
        id: randomId,
        name: `Linha Premium ${creatorName}`,
        category: 'collab',
        insumoCost: insumo,
        price,
        stock: 0,
        emoji,
        isUnlocked: true,
        totalSales: 0,
        weeklySales: 0,
        creatorCollab: creatorName,
        collabRoyalties: creator.royaltyRate
      };

      return {
        ...comp,
        money: comp.money - creator.upfrontCost,
        products: [...comp.products, newCollabProduct]
      };
    }));
    alert(`Parceria assinada com ${creatorName}! Produto Premium liberado na loja da sua empresa.`);
  };

  const negotiateAgencyContract = (talent: Talent, commission: number, signingFee: number) => {
    if (money < signingFee) {
      alert("Saldo pessoal (PF) de Signing Fee indisponível!");
      return;
    }

    // Interactive Acceptance Logic: Commission Expectation depends on subscribers & potential
    // Expectations: commission 15% (0.15) to 25% (0.25). Signing fee is compared to expectations
    const baseSigningExpectation = talent.subscribers * 0.1 * (talent.potential === 'S' ? 5 : talent.potential === 'A' ? 3 : 1) + 1000;
    const comRatio = (0.35 - commission) / 0.25; // Lower commission is better for creator, higher for agency
    const feeRatio = signingFee / baseSigningExpectation;

    // Acceptance Meter (0 to 100)
    const acceptance = Math.min(100, Math.floor(feeRatio * 40 + comRatio * 60));

    if (acceptance >= 50) {
      // Contract signed!
      const signedTalent: Talent = {
        ...talent,
        contract: {
          commissionPercent: commission,
          monthsRemaining: 12,
          exclusivity: true,
          terminationFine: Math.floor(signingFee * 1.5)
        }
      };

      setMoney(prev => prev - signingFee);
      setAgency(prev => ({
        ...prev,
        talents: [...prev.talents, signedTalent]
      }));
      setTalentMarket(prev => prev.filter(t => t.id !== talent.id));
      alert(`Parceria fechada! ${talent.name} assinou com sua agência! (Aceitação: ${acceptance}%)`);
    } else {
      alert(`${talent.name} recusou a proposta! A oferta de Signing Fee ou a comissão não foram atrativas. (Aceitação: ${acceptance}%)`);
    }
  };

  const createAgency = (name: string) => {
    const foundationFee = 30000;
    if (money < foundationFee) {
      alert("Saldo PF de $30,000 necessário para fundar a agência!");
      return;
    }
    if (subscribers < 50000) {
      alert("Sua agência exige no mínimo 50.000 inscritos!");
      return;
    }

    setMoney(prev => prev - foundationFee);
    setAgency({
      ...INITIAL_AGENCY,
      exists: true,
      name
    });
  };

  const fireTalent = (talentId: string) => {
    setAgency(prev => ({
      ...prev,
      talents: prev.talents.filter(t => t.id !== talentId)
    }));
  };

  // --- WEEKLOOP LOGIC ---

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
      
      // Promotion penalization
      const promotionalPenalty = video.selfPromotion ? 0.90 : 1.0;

      let customMultiplier = 1.0;
      if (boughtHousingUpgrades.includes('fibra') && ['games', 'vlog', 'pov'].includes(video.category)) {
        customMultiplier *= 1.10;
      }
      if (boughtHousingUpgrades.includes('rgb') && ['dance', 'trend', 'challenge'].includes(video.category)) {
        customMultiplier *= 1.15;
      }
      if (video.communityBonus === 'views') {
        customMultiplier *= 1.15;
      } else if (video.communityBonus === 'ctr') {
        customMultiplier *= 1.25;
      }

      // 1. Hardware/Equipment multiplier views
      const webcam = upgrades.find(u => u.id === 'webcam')?.level || 0;
      const mic = upgrades.find(u => u.id === 'mic')?.level || 0;
      const pc = upgrades.find(u => u.id === 'pc')?.level || 0;
      
      let equipmentMulti = 1 + (webcam * 0.10) + (mic * 0.15) + (pc * 0.20);
      customMultiplier *= equipmentMulti;

      // 2. Video Score reach multiplier
      const scoreMultiplier = 0.5 + (video.score || 5) * 0.15;
      customMultiplier *= scoreMultiplier;

      const generatedViews = Math.floor(baseViews * categoryMultipliers[video.category] * promoMultiplier * performanceFactor * housing.viewMultiplier * promotionalPenalty * customMultiplier);

      let baseRPM = 0.5;
      if (subscribers >= 1000000) baseRPM = 15.0;
      else if (subscribers >= 100000) baseRPM = 5.0 + (subscribers / 1000000) * 7;
      else if (subscribers >= 1000) baseRPM = 1.5 + (subscribers / 100000) * 3.5;
      else baseRPM = 0.5 + (subscribers / 1000) * 1.0;

      const generatedEarnings = (generatedViews / 1000) * baseRPM;

      // 3. Oratória (storytelling course) sub gain multiplier
      const oratoria = courses.storytelling || 0;
      const skillSubMultiplier = 1 + (oratoria * 0.15);
      const generatedSubs = Math.floor(generatedViews * 0.02 * subMultiplier * skillSubMultiplier);

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

    // --- 1. PROCESS TALENTS (AGENCY PF INCOME) ---
    let weekAgencyEarnings = 0;
    const weekEvents: WeeklyReport['events'] = [];

    const updatedTalents = agency.talents.map(talent => {
      const performanceFactor = (talent.charisma * 0.5 + talent.creativity * 0.5) * talent.consistency;
      let trendMultiplier = Math.random() * 0.5 + 0.8;

      const viralChance = talent.creativity / 400;
      const cancelChance = (talent.ego + (100 - talent.reputation)) / 800;

      if (Math.random() < viralChance) {
        trendMultiplier *= 3;
        weekEvents.push({ title: `VIRAL: ${talent.name}`, desc: "Vídeo explodiu no algoritmo! Ganhos triplicados.", type: 'positive' });
      } else if (Math.random() < cancelChance && talent.subscribers > 10000) {
        trendMultiplier *= 0.1;
        weekEvents.push({ title: `POLÊMICA: ${talent.name}`, desc: "Cancelamento em massa! Queda brusca no algoritmo.", type: 'negative' });
      }

      const generatedViews = Math.floor(1200 * performanceFactor * trendMultiplier);
      const generatedSubs = Math.floor(generatedViews * (talent.engagement / 100));
      const revenue = (generatedViews / 1000) * 3.0; // $3.0 RPM

      if (talent.contract) {
        weekAgencyEarnings += revenue * talent.contract.commissionPercent;
      }

      return {
        ...talent,
        subscribers: talent.subscribers + generatedSubs,
        totalViews: talent.totalViews + generatedViews,
        contract: talent.contract ? { ...talent.contract, monthsRemaining: Math.max(0, talent.contract.monthsRemaining - 0.25) } : null
      };
    });

    // --- 2. PROCESS CRYPTOCURRENCY MARKET ---
    let cryptoPassivePFIncome = 0;
    if (cryptoToken) {
      const marketVol = 0.15;
      const priceChange = 1 + (Math.random() * marketVol * 2 - marketVol) + (cryptoToken.hypeMultiplier > 1.0 ? 0.05 : -0.02);
      const newPrice = Math.max(0.01, cryptoToken.price * priceChange);

      // Volume is simulated based on price & random whales
      const volumeSim = cryptoToken.totalSupply * 0.02 * newPrice * (0.5 + Math.random());
      
      // Protocol transaction fee: 1.0% of volume deposited in PF weekly!
      cryptoPassivePFIncome = volumeSim * 0.01;

      setCryptoToken(prev => prev ? {
        ...prev,
        price: Number(newPrice.toFixed(4)),
        previousPrice: prev.price,
        dailyVolume: Math.floor(volumeSim / 7),
        hypeMultiplier: Math.max(1.0, prev.hypeMultiplier - 0.2) // Decay hype
      } : null);

      if (Math.random() < 0.15) {
        const isUp = Math.random() > 0.5;
        weekEvents.push({
          title: `MERCADO WEB3: ${cryptoToken.symbol}`,
          desc: isUp 
            ? `Baleias do ecossistema compraram milhões de tokens. ${cryptoToken.symbol} sobe!` 
            : `Um investidor antigo liquidou posições. ${cryptoToken.symbol} sofre correção.`,
          type: isUp ? 'positive' : 'negative'
        });
      }
    }

    // --- 3. PROCESS PJ COMPANIES SALES, COSTS, LOANS & BANKRUPTCIES ---
    let totalCompanyEarnings = 0; // Cumulative net profit/loss across all PJs
    const dreDataList: DREItem[] = [];

    // Calculate views for self-promotion
    const activeVideoSelfPromo = updatedVideos[0] && updatedVideos[0].weeksActive === 1 ? updatedVideos[0] : null;

    const updatedCompanies = companies.map(comp => {
      if (!comp.founded) return comp;
      if (comp.isBankrupt) {
        dreDataList.push({ name: comp.name, revenue: 0, costs: comp.weeklyMaintenance, taxes: 0, netProfit: -comp.weeklyMaintenance, color: '#ff4444' });
        return comp;
      }

      let companyRevenue = 0;
      let companyMaterialCost = 0;
      let royaltyPayment = 0;

      // Check dynamic marketing boosts
      let marketingMultiplier = 1.0;
      if (comp.marketingActive === 'instagram') marketingMultiplier = 1.5;
      else if (comp.marketingActive === 'live') marketingMultiplier = 2.5;
      else if (comp.marketingActive === 'dedicated') marketingMultiplier = 5.0;

      const web3Boost = comp.web3PayEnabled ? 1.2 : 1.0;

      // A. Process products demand and sales
      const updatedProducts = comp.products.map(prod => {
        if (!prod.isUnlocked) return prod;

        // Base weekly sales units
        let baseDemand = 10;
        if (comp.niche === 'candy') baseDemand = 60;
        else if (comp.niche === 'food') baseDemand = 120;
        else if (comp.niche === 'tech') baseDemand = 20;

        if (prod.category === 'collab') baseDemand *= 2.0;

        // Subscriber leverage
        const leverage = 1 + Math.sqrt(subscribers) * 0.03;
        const targetDemand = baseDemand * leverage * marketingMultiplier * web3Boost;
        
        let salesUnits = Math.min(prod.stock, Math.floor(targetDemand * (0.8 + Math.random() * 0.4)));

        // self promotion video conversion (2% of views)
        if (activeVideoSelfPromo && activeVideoSelfPromo.selfPromotion && activeVideoSelfPromo.selfPromotion.companyId === comp.id && activeVideoSelfPromo.selfPromotion.productId === prod.id) {
          const promoSales = Math.min(prod.stock - salesUnits, Math.floor(activeVideoSelfPromo.newViews * 0.02));
          if (promoSales > 0) {
            salesUnits += promoSales;
            // Boost token hype if Web3
            if (cryptoToken) {
              setCryptoToken(c => c ? { ...c, hypeMultiplier: c.hypeMultiplier + 0.3 } : null);
            }
          }
        }

        const grossSales = salesUnits * prod.price;
        companyRevenue += grossSales;

        // If it's a collab, subtract royalties
        let royals = 0;
        if (prod.creatorCollab) {
          royals = grossSales * prod.collabRoyalties;
          royaltyPayment += royals;
        }

        return {
          ...prod,
          stock: prod.stock - salesUnits,
          weeklySales: salesUnits,
          totalSales: prod.totalSales + salesUnits
        };
      });

      // B. Deduct taxes
      let taxValue = 0;
      if (comp.taxRegime === 'simples') {
        taxValue = companyRevenue * 0.08; // 8% flat weekly faturamento
        setTotalTaxesPaid(t => t + taxValue);
      }

      // C. Costs: Maintenance + Consolidation Installments + Active Loans + Royalties
      let fixedCosts = comp.weeklyMaintenance;
      let installmentPaid = 0;
      let loanPaid = 0;

      if (comp.activeInstallments > 0) {
        installmentPaid = comp.installmentValue;
      }

      let updatedLoan = comp.activeLoan;
      if (comp.activeLoan) {
        loanPaid = comp.activeLoan.weeklyPayment;
        const newRem = comp.activeLoan.remainingWeeks - 1;
        if (newRem <= 0) {
          // Empréstimo paid off!
          updatedLoan = null;
          comp.creditScore = Math.min(1000, comp.creditScore + 50);
          comp.maxLoanLimit *= 3;
        } else {
          updatedLoan = {
            ...comp.activeLoan,
            remainingWeeks: newRem,
            totalToPay: Math.max(0, comp.activeLoan.totalToPay - loanPaid)
          };
        }
      }

      const totalCostsThisWeek = fixedCosts + installmentPaid + loanPaid + royaltyPayment;
      const compNetProfit = companyRevenue - totalCostsThisWeek - taxValue;

      // Update balances
      let newBalance = comp.money + compNetProfit;

      // Bankruptcy & Cheque Especial Interest
      let updatedNegativeCount = comp.weeklyNegativeCount;
      let bankruptActive: boolean = comp.isBankrupt;

      if (newBalance < 0) {
        // Decrease score
        comp.creditScore = Math.max(300, comp.creditScore - 30);
        
        // Progressive interest rate: 5% up to 18%
        let jurosRate = 0.05;
        if (comp.weeklyNegativeCount === 1) jurosRate = 0.08;
        else if (comp.weeklyNegativeCount === 2) jurosRate = 0.12;
        else if (comp.weeklyNegativeCount >= 3) jurosRate = 0.18;

        const interestCharge = Math.abs(newBalance) * jurosRate;
        newBalance -= interestCharge;

        if (comp.activeInstallments > 0) {
          // Paused bankruptcy risk due to parcelamento
        } else {
          updatedNegativeCount += 1;
        }

        if (updatedNegativeCount >= 4) {
          bankruptActive = true;
          weekEvents.push({ title: `FALÊNCIA: ${comp.name}`, desc: "A empresa estourou 4 semanas consecutivas no vermelho e foi fechada por falência judicial bancária!", type: 'negative' });
        } else {
          weekEvents.push({ title: `ALERTA FINANCEIRO: ${comp.name}`, desc: `Caixa PJ negativo! Juros fiscais de ${(jurosRate*100).toFixed(0)}% cobrados. Semanas para falência: ${4 - updatedNegativeCount}.`, type: 'neutral' });
        }
      } else {
        comp.creditScore = Math.min(1000, comp.creditScore + 5);
        updatedNegativeCount = 0;
      }

      // Update marketing campaign stats
      const nextCampaignCooldown = Math.max(0, comp.marketingCampaignCooldown - 1);
      const nextMarketingWeeksRemaining = Math.max(0, comp.marketingWeeksRemaining - 1);
      const nextMarketingActive = nextMarketingWeeksRemaining === 0 ? 'none' as const : comp.marketingActive;

      totalCompanyEarnings += compNetProfit;

      const compColor = comp.id === 'startup' ? '#9b59b6' : comp.id === 'merch' ? '#ff3b30' : comp.id === 'candy' ? '#ff9500' : comp.id === 'food' ? '#4cd964' : '#007aff';
      dreDataList.push({
        name: comp.name,
        revenue: companyRevenue,
        costs: totalCostsThisWeek,
        taxes: taxValue,
        netProfit: compNetProfit,
        color: compColor
      });

      return {
        ...comp,
        money: bankruptActive ? 0 : Number(newBalance.toFixed(2)),
        products: updatedProducts,
        totalRevenue: comp.totalRevenue + companyRevenue,
        activeInstallments: Math.max(0, comp.activeInstallments - 1),
        activeLoan: updatedLoan,
        weeklyNegativeCount: updatedNegativeCount,
        isBankrupt: bankruptActive,
        marketingCampaignCooldown: nextCampaignCooldown,
        marketingWeeksRemaining: nextMarketingWeeksRemaining,
        marketingActive: nextMarketingActive
      };
    });

    setCompanies(updatedCompanies);

    // --- 4. INVESTMENTS SIMULATION (PREMIUM TERMINAL) ---
    let invChange = 0;
    let totalDividends = 0;

    let marketEvent: { title: string; desc: string; type: 'bull' | 'bear' | 'hype' | 'neutral'; assetId?: string } | null = null;
    const rollEvent = Math.random();
    if (rollEvent < 0.07) {
      marketEvent = {
        title: "🚀 CRIPTO BULL RUN",
        desc: "O otimismo atinge a lua! Criptoativos disparam com volume massivo de compras mundiais!",
        type: 'bull'
      };
    } else if (rollEvent < 0.14) {
      marketEvent = {
        title: "⚠️ CHOQUE TECNOLÓGICO",
        desc: "Gargalo severo no fornecimento global de chips semicondutores afeta as Big Techs na bolsa!",
        type: 'bear'
      };
    } else if (rollEvent < 0.20) {
      marketEvent = {
        title: "🐶 ELON MEME HYPADO",
        desc: "Uma postagem viral na internet causa uma corrida especulativa insana pela DogCoin Meme!",
        assetId: 'doge',
        type: 'hype'
      };
    } else if (rollEvent < 0.26) {
      marketEvent = {
        title: "🏢 RECORDES DE OCUPAÇÃO FIIs",
        desc: "Vacância em galpões logísticos e shoppings atinge mínimas históricas! Proventos sobem!",
        type: 'bull'
      };
    }
    setCurrentMarketEvent(marketEvent);

    if (marketEvent) {
      weekEvents.push({
        title: marketEvent.title,
        desc: marketEvent.desc,
        type: marketEvent.type === 'bear' ? 'negative' : 'positive'
      });
    }

    const updatedInvestments = investments.map(inv => {
      let volatility = 0.05;
      let eventBonus = 0;

      if (inv.type === 'crypto') {
        volatility = inv.id === 'doge' ? 0.25 : 0.18;
      } else if (inv.type === 'stock') {
        volatility = 0.06;
      } else if (inv.type === 'fii') {
        volatility = 0.02;
      } else if (inv.type === 'fixed') {
        volatility = 0;
      }

      let change = 1;
      if (volatility > 0) {
        change = 1 + (Math.random() * volatility * 2 - volatility);
      }

      if (marketEvent) {
        if (marketEvent.type === 'bull') {
          if (inv.type === 'crypto') {
            eventBonus = 0.08 + Math.random() * 0.10;
          } else if (inv.type === 'fii') {
            eventBonus = 0.03 + Math.random() * 0.03;
          }
        } else if (marketEvent.type === 'bear') {
          if (inv.type === 'stock' && ['banana', 'macro', 'gogl'].includes(inv.id)) {
            eventBonus = -(0.08 + Math.random() * 0.10);
          }
        } else if (marketEvent.type === 'hype') {
          if (inv.id === marketEvent.assetId) {
            eventBonus = 0.40 + Math.random() * 0.40;
          }
        }
      }

      let newPrice = inv.price * (change + eventBonus);

      if (inv.type === 'fixed') {
        newPrice = inv.price * (1 + (inv.dividendYield || 0.0018));
      }

      newPrice = Math.max(0.01, newPrice);

      if (inv.owned > 0) {
        invChange += (newPrice - inv.price) * inv.owned;
        
        if (inv.type === 'fii') {
          let yieldBonus = 1.0;
          if (marketEvent && marketEvent.title.includes("FIIs")) {
            yieldBonus = 1.3;
          }
          const payout = inv.owned * inv.price * (inv.dividendYield || 0.005) * yieldBonus;
          totalDividends += payout;
        }
      }

      const currentHistory = inv.history || [inv.price];
      const nextHistory = [...currentHistory, Number(newPrice.toFixed(2))].slice(-8);

      return {
        ...inv,
        previousPrice: inv.price,
        price: Number(newPrice.toFixed(2)),
        history: nextHistory
      };
    });
    setInvestments(updatedInvestments);

    // DRE Data: Add Youtube & Investments to DRE Chart
    dreDataList.push({
      name: "AdSense YouTube",
      revenue: weekYoutubeEarnings,
      costs: 0,
      taxes: 0,
      netProfit: weekYoutubeEarnings,
      color: '#ff0000'
    });

    if (agency.exists && weekAgencyEarnings > 0) {
      dreDataList.push({
        name: "Agência (Comissões)",
        revenue: weekAgencyEarnings,
        costs: 0,
        taxes: 0,
        netProfit: weekAgencyEarnings,
        color: '#ffcc00'
      });
    }

    if (cryptoPassivePFIncome > 0) {
      dreDataList.push({
        name: "Crypto Protocol Fee",
        revenue: cryptoPassivePFIncome,
        costs: 0,
        taxes: 0,
        netProfit: cryptoPassivePFIncome,
        color: '#a832a4'
      });
    }

    if (totalDividends > 0) {
      setInvestmentWallet(prev => Number((prev + totalDividends).toFixed(2)));

      dreDataList.push({
        name: "Dividendos & Rendimentos",
        revenue: totalDividends,
        costs: 0,
        taxes: 0,
        netProfit: totalDividends,
        color: '#4caf50'
      });

      weekEvents.push({
        title: "💰 DIVIDENDOS RECEBIDOS",
        desc: `Você recebeu $${totalDividends.toFixed(2)} em proventos passivos depositados na sua Conta Corretora!`,
        type: 'positive'
      });
    }

    // D. Final weekly compilation for Personal (PF) Cash
    const activeUpgradesList = HOUSING_UPGRADES.filter(u => boughtHousingUpgrades.includes(u.id));
    const upgradesExpenses = activeUpgradesList.reduce((sum, u) => sum + u.weeklyMaintenance, 0);
    const housingExpenses = housing.weeklyRent + upgradesExpenses;
    const netPFIncome = weekYoutubeEarnings + weekAgencyEarnings + cryptoPassivePFIncome - housingExpenses;

    // Apply PF Money update
    setMoney(prev => Number((prev + netPFIncome).toFixed(2)));
    setSubscribers(prev => prev + weekTotalSubs);
    setTotalViews(prev => prev + weekTotalViews);
    setVideoHistory(updatedVideos);
    setEnergy(maxEnergy + housing.energyBonus);
    setWeek(prev => prev + 1);

    // Refresh creators in the market every week
    const potentialsList = ['S', 'A', 'B', 'C'] as const;
    const namesList = ["Gabriel", "Juliana", "Felipe", "Mariana", "Lucas", "Beatriz", "Pedro", "Luana"];
    const nichesList = ['gaming', 'lifestyle', 'tech', 'asmr', 'beauty', 'finance'] as const;
    const nextMarket = potentialsList.map((pot, idx) => {
      const niche = nichesList[idx % nichesList.length];
      const subs = Math.floor(10000 * (idx + 1) * (pot === 'S' ? 5 : pot === 'A' ? 3 : 1)) + Math.floor(Math.random() * 5000);
      const randomName = `${namesList[Math.floor(Math.random() * namesList.length)]} #${Math.floor(Math.random() * 900 + 100)}`;
      return {
        id: `agency_market_${pot}_${idx}_${Math.floor(Math.random() * 100000)}`,
        name: randomName,
        niche,
        charisma: pot === 'S' ? 88 : pot === 'A' ? 76 : pot === 'B' ? 62 : 48,
        consistency: 0.8,
        creativity: pot === 'S' ? 90 : pot === 'A' ? 78 : pot === 'B' ? 64 : 50,
        engagement: 6.5,
        reputation: 60,
        ego: pot === 'S' ? 80 : 45,
        potential: pot,
        burnout: 0,
        subscribers: subs,
        totalViews: subs * 15,
        contract: null,
        brands: []
      };
    });
    setTalentMarket(nextMarket);

    if (agency.exists) {
      setAgency(prev => ({
        ...prev,
        talents: updatedTalents
      }));
    }

    // Dynamic News Generator for page 2 Gazeta
    if (Math.random() < 0.25) {
      weekEvents.push({ title: "ESTIMATIVA DE INSUMOS", desc: "A safra mundial de cacau aumentou, prevendo quedas nos insumos clássicos de doces em breve.", type: 'positive' });
    }
    if (Math.random() < 0.20) {
      weekEvents.push({ title: "HYPE GAMER", desc: "Novos jogos virtuais impulsionam periféricos gamer, aumentando a demanda geral por mouses e headsets!", type: 'positive' });
    }

    setWeeklyReport({
      views: weekTotalViews,
      subscribers: weekTotalSubs,
      youtubeEarnings: weekYoutubeEarnings,
      companyEarnings: totalCompanyEarnings, // PJ profits
      investmentChange: invChange,
      dividendEarnings: totalDividends,
      expenses: 0,
      housingExpenses,
      netTotal: netPFIncome + totalCompanyEarnings,
      isVisible: true,
      events: weekEvents,
      dreData: dreDataList
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
      setBoughtHousingUpgrades([]);
      setMaxEnergy(100 + housing.energyBonus);
      alert(`Parabéns! Você se mudou para: ${housing.name}`);
    } else {
      alert("Você não tem dinheiro suficiente para a entrada/caução!");
    }
  };

  const buyHousingUpgrade = (upgradeId: string) => {
    const upgrade = HOUSING_UPGRADES.find(u => u.id === upgradeId);
    if (!upgrade) return;
    if (boughtHousingUpgrades.includes(upgradeId)) {
      alert("Você já possui esta melhoria instalada!");
      return;
    }
    
    if (money >= upgrade.price) {
      setMoney(prev => prev - upgrade.price);
      setBoughtHousingUpgrades(prev => [...prev, upgradeId]);
      if (upgradeId === 'cafe') {
        setMaxEnergy(prev => prev + 10);
        setEnergy(prev => prev + 10);
      }
      alert(`Sucesso! Você instalou: ${upgrade.name}`);
    } else {
      alert("Saldo insuficiente para comprar esta melhoria!");
    }
  };

  const updateChannelProfile = (name: string, handle: string, desc: string) => {
    if (name.trim()) setChannelName(name.trim());
    if (handle.trim()) setChannelHandle(handle.trim().replace('@', ''));
    if (desc.trim()) setChannelDescription(desc.trim());
    alert("Perfil do canal atualizado com sucesso!");
  };

  const makeCommunityPost = (type: 'meme' | 'spoiler' | 'thanks') => {
    if (energy < 5) {
      alert("Você não tem energia suficiente para postar na comunidade (Custo: 5 ⚡)!");
      return;
    }

    setEnergy(prev => Math.max(0, prev - 5));

    if (type === 'meme') {
      setCommunityPostBonus({ type: 'views', amount: 0.15 });
      alert("Meme compartilhado! A empolgação da comunidade dará +15% views no próximo vídeo! 🎭");
    } else if (type === 'spoiler') {
      setCommunityPostBonus({ type: 'ctr', amount: 0.25 });
      alert("Spoiler revelado! O mistério deixará os inscritos ansiosos: +25% views no próximo vídeo! 🎬");
    } else if (type === 'thanks') {
      const bonusSubs = Math.floor(subscribers * 0.02) + 50;
      setSubscribers(prev => prev + bonusSubs);
      alert(`Agradecimento sincero publicado! Os fãs amaram a atenção: +${bonusSubs.toLocaleString()} inscritos novos! ❤️`);
    }
  };

  const buyCourseSemester = (courseId: string) => {
    const course = COURSES_INFO.find(c => c.id === courseId);
    if (!course) return;

    const currentLevel = courses[courseId] || 0;
    if (currentLevel >= 4) {
      alert("Você já está formado neste curso! 🎓");
      return;
    }

    const price = course.semesterPrices[currentLevel];
    if (money >= price) {
      setMoney(prev => prev - price);
      setCourses(prev => ({
        ...prev,
        [courseId]: currentLevel + 1
      }));
      
      if (currentLevel === 3) {
        alert(`Parabéns! Você se formou no curso: ${course.name}! 🎓`);
      } else {
        alert(`Matrícula confirmada! Você concluiu o Semestre ${currentLevel + 1} de ${course.name}! 📚`);
      }
    } else {
      alert("Saldo insuficiente na conta pessoal (PF)!");
    }
  };

  const buyLuxuryAsset = (assetId: string) => {
    const asset = LUXURY_ASSETS.find(a => a.id === assetId);
    if (!asset) return;

    if (luxuryAssets.includes(assetId)) {
      alert("Você já adquiriu este patrimônio!");
      return;
    }

    if (money >= asset.price) {
      setMoney(prev => prev - asset.price);
      setLuxuryAssets(prev => [...prev, assetId]);
      alert(`Parabéns! Você adquiriu o patrimônio: ${asset.name}! ${asset.icon}`);
    } else {
      alert("Saldo de caixa livre insuficiente para adquirir este patrimônio!");
    }
  };

  const getNetWorth = () => {
    const assetsVal = luxuryAssets.reduce((sum, assetId) => {
      const asset = LUXURY_ASSETS.find(a => a.id === assetId);
      return sum + (asset ? asset.price : 0);
    }, 0);

    const investmentsVal = investments.reduce((sum, inv) => {
      return sum + (inv.owned * inv.price);
    }, 0);

    return Number((money + investmentWallet + investmentsVal + assetsVal).toFixed(2));
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
    if (investmentWallet >= cost) {
      setInvestmentWallet(prev => Number((prev - cost).toFixed(2)));
      setInvestments(prev => prev.map(i => {
        if (i.id === id) {
          const prevOwned = i.owned;
          const prevAvg = i.averagePrice || 0;
          const newOwned = prevOwned + amount;
          const newAvg = ((prevOwned * prevAvg) + (amount * i.price)) / newOwned;
          return {
            ...i,
            owned: newOwned,
            averagePrice: Number(newAvg.toFixed(2))
          };
        }
        return i;
      }));
    } else {
      alert("Saldo insuficiente no caixa da Carteira! Transfira dinheiro da sua conta pessoal PF primeiro.");
    }
  };

  const sellInvestment = (id: string, amount: number) => {
    const inv = investments.find(i => i.id === id);
    if (!inv || inv.owned < amount) return;
    const gain = inv.price * amount;
    setInvestmentWallet(prev => Number((prev + gain).toFixed(2)));
    setInvestments(prev => prev.map(i => {
      if (i.id === id) {
        const newOwned = i.owned - amount;
        return {
          ...i,
          owned: newOwned,
          averagePrice: newOwned === 0 ? 0 : i.averagePrice
        };
      }
      return i;
    }));
  };

  const depositToInvestmentWallet = (amount: number) => {
    if (money >= amount) {
      setMoney(prev => Number((prev - amount).toFixed(2)));
      setInvestmentWallet(prev => Number((prev + amount).toFixed(2)));
    } else {
      alert("Saldo insuficiente em sua conta pessoal PF!");
    }
  };

  const withdrawFromInvestmentWallet = (amount: number) => {
    if (investmentWallet >= amount) {
      setInvestmentWallet(prev => Number((prev - amount).toFixed(2)));
      setMoney(prev => Number((prev + amount).toFixed(2)));
    } else {
      alert("Saldo insuficiente na sua carteira de investimentos!");
    }
  };

  return (
    <GameContext.Provider value={{
      money, subscribers, totalViews, energy, maxEnergy, week, date: formatDate(week), 
      upgrades, currentHousingId, videoHistory, investments, agency, weeklyReport,
      companies, totalTaxesPaid, cryptoToken, currentMarketEvent,
      investmentWallet, depositToInvestmentWallet, withdrawFromInvestmentWallet,
      housings: HOUSINGS,
      outsideWorks: OUTSIDE_WORKS,
      stats: { viewsPerClick: 10, subGainRate: 0.05, moneyPerView: 0.01 },
      addViews, publishVideo, buyUpgrade, buyHousing, workOutside,
      buyInvestment, sellInvestment,
      createAgency, hireTalent: () => {}, fireTalent,
      nextWeek, closeReport,
      boughtHousingUpgrades,
      buyHousingUpgrade,
      channelName,
      channelHandle,
      channelDescription,
      communityPostBonus,
      updateChannelProfile,
      makeCommunityPost,
      courses,
      luxuryAssets,
      netWorth: getNetWorth(),
      buyCourseSemester,
      buyLuxuryAsset,
      
      // PJ Holdings & Web3 Operations
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
