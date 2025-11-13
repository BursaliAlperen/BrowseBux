export interface User {
  uid: string;
  name: string;
  email: string;
  avatarUrl: string;
  balanceRobux: number;
  balanceUSD: number;
  bonusPoints: number;
  referralLink: string;
  level: number;
  experience: number;
  experienceToNextLevel: number;
  totalEarned: number;
  tasksCompleted: number;
  activityTime: number; // in minutes
}

export enum Tab {
  Browser = 'Browser',
  Balance = 'Balance',
  Tasks = 'Tasks',
  Profile = 'Profile',
  Settings = 'Settings',
}

export enum View {
  Browser = 'Browser',
  Balance = 'Balance',
  Tasks = 'Tasks',
  Profile = 'Profile',
  Settings = 'Settings',
  // Keep old views for now in case they are referenced, but they are no longer top-level tabs
  AccountSettings = 'AccountSettings',
  Support = 'Support',
  PrivacyPolicy = 'PrivacyPolicy',
}

export interface DailyTask {
    id: string;
    title: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    rewardRobux: number;
    rewardXp: number;
    rewardUsd: number;
}


export interface Metric {
  label: string;
  value: string;
  description: string;
}

export enum WithdrawalStatus {
  Pending = 'Beklemede',
  Approved = 'Onaylandı',
  Rejected = 'Reddedildi',
}

export interface Withdrawal {
  id: string;
  date: string;
  amount: number;
  fee: number;
  status: WithdrawalStatus;
  gamepassLink: string;
}

export interface AiSiteSuggestion {
    title: string;
    url: string;
    summary: string;
    safety: 'Güvenli' | 'İzleniyor' | 'Potensiyel Risk';
}

export interface AiSearchResult {
    summary: string;
    sites: AiSiteSuggestion[];
}