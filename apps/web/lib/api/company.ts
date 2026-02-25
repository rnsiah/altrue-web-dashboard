import { getSession } from 'next-auth/react';
import { 
  Company, CompanyApplication, Campaign, MatchRule, GlobalMatchSettings,
  Reward, Wallet, Transaction, Invoice, PaymentMethod, DashboardStats,
  ActivityItem, ESGReport, AutoRefillSettings
} from '@/types/company';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  // Get auth token from session
  const session = await getSession();
  const token = session?.user?.accessToken;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Token ${token}`;
  }
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers,
    ...options,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message || `API error: ${response.status}`);
  }
  
  return response.json();
}

// Company Applications
export const companyApplicationsApi = {
  create: (data: Partial<CompanyApplication>) => 
    fetchApi<CompanyApplication>('/company-applications/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  get: (id: string) => 
    fetchApi<CompanyApplication>(`/company-applications/${id}/`),
};

// Companies
export const companiesApi = {
  completeOnboarding: (id: string, data: Partial<Company>) =>
    fetchApi<Company>(`/companies/${id}/onboarding/complete/`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  getDashboard: (id: string) =>
    fetchApi<DashboardStats>(`/companies/${id}/dashboard/`),
  
  getWallet: (id: string) =>
    fetchApi<Wallet>(`/companies/${id}/wallet/`),
  
  deposit: (id: string, amount: number, paymentMethodId?: string) =>
    fetchApi<{ success: boolean }>(`/companies/${id}/wallet/deposit/`, {
      method: 'POST',
      body: JSON.stringify({ amount, payment_method_id: paymentMethodId }),
    }),
  
  getTransactions: (id: string, filters?: { type?: string; limit?: number }) =>
    fetchApi<Transaction[]>(`/companies/${id}/transactions/?${new URLSearchParams(filters as Record<string, string>)}`),
  
  getInvoices: (id: string) =>
    fetchApi<Invoice[]>(`/companies/${id}/invoices/`),
  
  getPaymentMethods: (id: string) =>
    fetchApi<PaymentMethod[]>(`/companies/${id}/payment-methods/`),
  
  createPaymentMethod: (id: string, token: string) =>
    fetchApi<PaymentMethod>(`/companies/${id}/payment-methods/`, {
      method: 'POST',
      body: JSON.stringify({ token }),
    }),
};

// Campaigns
export const campaignsApi = {
  list: (companyId: string) =>
    fetchApi<Campaign[]>(`/companies/${companyId}/campaigns/`),
  
  create: (companyId: string, data: Partial<Campaign>) =>
    fetchApi<Campaign>(`/companies/${companyId}/campaigns/`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  get: (id: string) =>
    fetchApi<Campaign>(`/campaigns/${id}/`),
  
  update: (id: string, data: Partial<Campaign>) =>
    fetchApi<Campaign>(`/campaigns/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  
  fund: (id: string, amount: number) =>
    fetchApi<{ success: boolean }>(`/campaigns/${id}/fund/`, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    }),
  
  launch: (id: string) =>
    fetchApi<{ success: boolean }>(`/campaigns/${id}/launch/`, {
      method: 'POST',
    }),
  
  pause: (id: string) =>
    fetchApi<{ success: boolean }>(`/campaigns/${id}/pause/`, {
      method: 'POST',
    }),
  
  resume: (id: string) =>
    fetchApi<{ success: boolean }>(`/campaigns/${id}/resume/`, {
      method: 'POST',
    }),
};

// Match Rules
export const matchRulesApi = {
  get: (companyId: string) =>
    fetchApi<GlobalMatchSettings>(`/companies/${companyId}/match-rules/`),
  
  update: (companyId: string, data: Partial<GlobalMatchSettings>) =>
    fetchApi<GlobalMatchSettings>(`/companies/${companyId}/match-rules/`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Rewards
export const rewardsApi = {
  list: (companyId: string) =>
    fetchApi<Reward[]>(`/companies/${companyId}/rewards/`),
  
  create: (companyId: string, data: Partial<Reward>) =>
    fetchApi<Reward>(`/companies/${companyId}/rewards/`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  uploadCodes: (companyId: string, rewardId: string, codes: string[]) =>
    fetchApi<{ success: boolean }>(`/companies/${companyId}/rewards/${rewardId}/codes/`, {
      method: 'POST',
      body: JSON.stringify({ codes }),
    }),
};

// Reports
export const reportsApi = {
  generate: (companyId: string, data: { startDate: string; endDate: string; type: string; format: string }) =>
    fetchApi<ESGReport>(`/companies/${companyId}/esg-report/generate/`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  list: (companyId: string) =>
    fetchApi<ESGReport[]>(`/companies/${companyId}/esg-reports/`),
};

// Mock data for development
export const mockData = {
  causes: [
    'Climate Change',
    'Education',
    'Healthcare',
    'Poverty',
    'Animal Welfare',
    'Arts & Culture',
    'Human Rights',
    'Disaster Relief',
  ],
  
  tiers: [
    { id: 'free', name: 'Free', monthlyFee: 0, features: ['Basic matching', 'Standard reports'] },
    { id: 'pro', name: 'Pro', monthlyFee: 99, features: ['Advanced matching', 'Custom campaigns', 'Priority support'] },
    { id: 'enterprise', name: 'Enterprise', monthlyFee: 499, features: ['White-label', 'API access', 'Dedicated support', 'Custom integrations'] },
  ],
};
