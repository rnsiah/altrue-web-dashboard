import { getSession } from "next-auth/react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export async function apiClient(endpoint: string, options: RequestInit = {}) {
  const session = await getSession();
  const token = session?.user?.accessToken;

  const url = `${API_BASE_URL}/api${endpoint}`;
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Token ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`API Error ${response.status}:`, error);
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}

// Users API
export async function getUsers() {
  return apiClient("/users/");
}

export async function getUser(id: string) {
  return apiClient(`/users/${id}/`);
}

export async function updateUser(id: string, data: any) {
  return apiClient(`/users/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

// User Profile API
export async function getUserProfile(userId: string) {
  return apiClient(`/userprofile/?user=${userId}`);
}

export async function updateUserProfile(profileId: string, data: any) {
  return apiClient(`/userprofile/${profileId}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

// Donations API
export async function getDonations() {
  return apiClient("/userdonations/");
}

export async function getDonation(id: string) {
  return apiClient(`/userdonations/${id}/`);
}

// NonProfits API
export async function getNonProfits() {
  return apiClient("/nonprofits/");
}

// Stats API
export async function getAltrueStatistics() {
  return apiClient("/altruestatistics/");
}

// Dashboard data
export async function getDashboardData() {
  const [users, stats] = await Promise.all([
    getUsers().catch(() => ({ results: [], count: 0 })),
    getAltrueStatistics().catch(() => null),
  ]);

  return {
    users: users.results || users || [],
    totalUsers: users.count || users.length || 0,
    stats,
  };
}
