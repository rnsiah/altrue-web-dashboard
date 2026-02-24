export interface Company {
  id: string;
  name: string;
  ein: string;
  website?: string;
  yearStarted?: number;
  mission?: string;
  description?: string;
  causes: string[];
  logo?: string;
  contactName?: string;
  email: string;
  phone?: string;
  address?: string;
  status: 'pending' | 'approved' | 'rejected' | 'active';
  tier: 'free' | 'pro' | 'enterprise';
  createdAt: string;
}

export interface CompanyApplication {
  id: string;
  companyName: string;
  ein: string;
  website?: string;
  yearStarted?: number;
  mission?: string;
  description?: string;
  causes: string[];
  annualCommitment: number;
  monthlyBudget: number;
  logo?: string;
  contactName: string;
  email: string;
  phone?: string;
  address?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

export interface Campaign {
  id: string;
  companyId: string;
  name: string;
  description?: string;
  image?: string;
  startDate: string;
  endDate: string;
  matchMultiplier: number;
  maxMatchPerDonation?: number;
  eligibleCauses: string[];
  eligibleNonprofits?: string[];
  minDonationAmount?: number;
  budgetCap: number;
  matchedAmount: number;
  escrowAmount: number;
  escrowFunded: boolean;
  status: 'draft' | 'pending_funding' | 'active' | 'paused' | 'completed' | 'cancelled';
  donorCount: number;
  totalDonations: number;
  createdAt: string;
}

export interface MatchRule {
  id: string;
  companyId: string;
  causeId?: string;
  multiplier: number;
  minDonation?: number;
  maxMatch?: number;
}

export interface GlobalMatchSettings {
  defaultMultiplier: number;
  monthlyBudgetCap: number;
  autoPauseThreshold: number;
  eligibleCauses: string[];
  excludedNonprofits: string[];
  minDonationAmount: number;
  maxMatchPerDonation: number;
}

export interface AutoRefillSettings {
  enabled: boolean;
  threshold: number;
  amount: number;
  paymentMethodId?: string;
}

export interface Reward {
  id: string;
  companyId: string;
  name: string;
  description: string;
  type: 'digital' | 'physical' | 'experience';
  image?: string;
  minDonationAmount: number;
  minLevel?: number;
  minStreakDays?: number;
  specificCause?: string;
  specificNonprofit?: string;
  totalQuantity: number;
  claimedCount: number;
  unlockedCount: number;
  redeemedCount: number;
  startDate?: string;
  expirationDate?: string;
  campaignId?: string;
  status: 'active' | 'paused' | 'expired';
}

export interface Wallet {
  companyId: string;
  balance: number;
  monthlyBudget: number;
  matchedThisMonth: number;
  remainingBudget: number;
  autoRefill: AutoRefillSettings;
}

export interface Transaction {
  id: string;
  companyId: string;
  type: 'deposit' | 'match' | 'refund' | 'withdrawal';
  amount: number;
  description: string;
  balanceAfter: number;
  createdAt: string;
}

export interface Invoice {
  id: string;
  companyId: string;
  month: string;
  monthlyFee: number;
  transactionFees: number;
  totalDue: number;
  status: 'paid' | 'pending' | 'overdue';
  paidAt?: string;
}

export interface PaymentMethod {
  id: string;
  companyId: string;
  type: 'card';
  last4: string;
  brand: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

export interface DashboardStats {
  matchedThisMonth: number;
  budgetRemaining: number;
  uniqueDonors: number;
  activeCampaigns: number;
  totalMatchedAllTime: number;
  nonprofitsSupported: number;
}

export interface ActivityItem {
  id: string;
  type: 'donation_matched' | 'reward_claimed' | 'campaign_milestone' | 'funding_received';
  description: string;
  amount?: number;
  createdAt: string;
}

export interface ESGReport {
  id: string;
  companyId: string;
  name: string;
  startDate: string;
  endDate: string;
  type: 'summary' | 'detailed' | 'campaign';
  format: 'pdf' | 'csv';
  downloadUrl: string;
  createdAt: string;
}
