import { render, screen, waitFor } from "@testing-library/react";
import DashboardPage from "@/app/dashboard/page";
import { getDashboardData } from "@/lib/api";

// Mock all the child components
jest.mock("@/components/dashboard/live-charts", () => ({
  LiveUserChart: () => <div data-testid="live-user-chart">Live User Chart</div>,
  LiveDonationChart: () => <div data-testid="live-donation-chart">Live Donation Chart</div>,
  LiveRevenueChart: () => <div data-testid="live-revenue-chart">Live Revenue Chart</div>,
  DonationCategoryChart: () => <div data-testid="category-chart">Category Chart</div>,
  LiveActivityFeed: () => <div data-testid="activity-feed">Activity Feed</div>,
}));

jest.mock("@/components/dashboard/leaderboard-card", () => ({
  LeaderboardCard: () => <div data-testid="leaderboard-card">Leaderboard</div>,
}));

jest.mock("@/components/dashboard/company-matching-card", () => ({
  CompanyMatchingCard: () => <div data-testid="company-matching-card">Company Matching</div>,
}));

jest.mock("@/components/dashboard/gamification-stats-card", () => ({
  GamificationStatsCard: () => <div data-testid="gamification-card">Gamification Stats</div>,
}));

jest.mock("@/components/dashboard/top-nonprofits-card", () => ({
  TopNonprofitsCard: () => <div data-testid="top-nonprofits-card">Top Nonprofits</div>,
}));

jest.mock("@/components/dashboard/user-growth-chart", () => ({
  UserGrowthChart: () => <div data-testid="user-growth-chart">User Growth Chart</div>,
}));

jest.mock("@/lib/api", () => ({
  getDashboardData: jest.fn(),
}));

describe("DashboardPage", () => {
  const mockDashboardData = {
    users: [
      { id: 1, username: "user1", email: "user1@test.com", date_joined: "2024-01-01", is_staff: false },
      { id: 2, username: "admin", email: "admin@test.com", date_joined: "2024-01-02", is_staff: true },
    ],
    totalUsers: 2,
    stats: {
      total_donations: 50000,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getDashboardData as jest.Mock).mockResolvedValue(mockDashboardData);
  });

  it("renders dashboard header", async () => {
    render(<DashboardPage />);
    
    await waitFor(() => {
      expect(screen.getByText("Dashboard Overview")).toBeInTheDocument();
      expect(screen.getByText(/Welcome back!/)).toBeInTheDocument();
    });
  });

  it("displays metrics cards", async () => {
    render(<DashboardPage />);
    
    await waitFor(() => {
      expect(screen.getByText("Total Users")).toBeInTheDocument();
      expect(screen.getByText("Total Donations")).toBeInTheDocument();
      expect(screen.getByText("Active Campaigns")).toBeInTheDocument();
      expect(screen.getByText("Avg. Donation")).toBeInTheDocument();
    });
  });

  it("shows real-time connection indicator", async () => {
    render(<DashboardPage />);
    
    await waitFor(() => {
      expect(screen.getByText("Real-time connected")).toBeInTheDocument();
    });
  });

  it("renders live charts section", async () => {
    render(<DashboardPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId("live-user-chart")).toBeInTheDocument();
      expect(screen.getByTestId("live-donation-chart")).toBeInTheDocument();
      expect(screen.getByTestId("live-revenue-chart")).toBeInTheDocument();
    });
  });

  it("renders activity feed and category chart", async () => {
    render(<DashboardPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId("activity-feed")).toBeInTheDocument();
      expect(screen.getByTestId("category-chart")).toBeInTheDocument();
    });
  });

  it("renders gamification section", async () => {
    render(<DashboardPage />);
    
    await waitFor(() => {
      expect(screen.getByText("Gamification & Social")).toBeInTheDocument();
      expect(screen.getByTestId("leaderboard-card")).toBeInTheDocument();
      expect(screen.getByTestId("gamification-card")).toBeInTheDocument();
      expect(screen.getByTestId("company-matching-card")).toBeInTheDocument();
      expect(screen.getByTestId("top-nonprofits-card")).toBeInTheDocument();
    });
  });

  it("renders growth analytics section", async () => {
    render(<DashboardPage />);
    
    await waitFor(() => {
      expect(screen.getByText("Growth Analytics")).toBeInTheDocument();
      expect(screen.getByTestId("user-growth-chart")).toBeInTheDocument();
    });
  });

  it("renders quick actions section", async () => {
    render(<DashboardPage />);
    
    await waitFor(() => {
      expect(screen.getByText("Quick Actions")).toBeInTheDocument();
      expect(screen.getByText("Create Campaign")).toBeInTheDocument();
      expect(screen.getByText("Invite Users")).toBeInTheDocument();
      expect(screen.getByText("View Reports")).toBeInTheDocument();
      expect(screen.getByText("Promote Actions")).toBeInTheDocument();
    });
  });

  it("displays recent users", async () => {
    render(<DashboardPage />);
    
    await waitFor(() => {
      expect(screen.getByText("Recent Users")).toBeInTheDocument();
      expect(screen.getByText("user1")).toBeInTheDocument();
      expect(screen.getByText("admin")).toBeInTheDocument();
    });
  });

  it("shows admin badge for staff users", async () => {
    render(<DashboardPage />);
    
    await waitFor(() => {
      expect(screen.getByText("Admin")).toBeInTheDocument();
    });
  });

  it("handles API errors gracefully", async () => {
    (getDashboardData as jest.Mock).mockRejectedValue(new Error("API Error"));
    
    render(<DashboardPage />);
    
    await waitFor(() => {
      expect(screen.getByText("Failed to load dashboard data")).toBeInTheDocument();
    });
  });

  it("displays correct user count", async () => {
    render(<DashboardPage />);
    
    await waitFor(() => {
      expect(screen.getByText("2")).toBeInTheDocument();
    });
  });
});
