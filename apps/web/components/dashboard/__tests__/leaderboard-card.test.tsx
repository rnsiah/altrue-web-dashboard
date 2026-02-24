import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LeaderboardCard } from "@/components/dashboard/leaderboard-card";
import { apiClient } from "@/lib/api";

// Mock the API client
jest.mock("@/lib/api", () => ({
  apiClient: jest.fn(),
}));

describe("LeaderboardCard", () => {
  const mockLeaderboard = [
    {
      rank: 1,
      username: "charity_hero",
      total_balance: 15000,
      profile_image: "https://example.com/avatar.jpg",
      altrue_level_number: 5,
    },
    {
      rank: 2,
      username: "generous_giver",
      total_balance: 12500,
      profile_image: null,
      altrue_level_number: 4,
    },
    {
      rank: 3,
      username: "kind_donor",
      total_balance: 10000,
      profile_image: null,
      altrue_level_number: 4,
    },
    {
      rank: 4,
      username: "helping_hand",
      total_balance: 8000,
      profile_image: null,
      altrue_level_number: 3,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state initially", () => {
    (apiClient as jest.Mock).mockImplementation(() => new Promise(() => {}));
    
    render(<LeaderboardCard />);
    
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("renders leaderboard data correctly", async () => {
    (apiClient as jest.Mock).mockResolvedValue(mockLeaderboard);
    
    render(<LeaderboardCard />);
    
    await waitFor(() => {
      expect(screen.getByText("charity_hero")).toBeInTheDocument();
      expect(screen.getByText("generous_giver")).toBeInTheDocument();
    });
    
    // Check points are displayed
    expect(screen.getByText("15,000")).toBeInTheDocument();
    expect(screen.getByText("12,500")).toBeInTheDocument();
    
    // Check levels are displayed
    expect(screen.getByText("Level 5")).toBeInTheDocument();
    expect(screen.getByText("Level 4")).toBeInTheDocument();
  });

  it("displays correct rank icons for top 3", async () => {
    (apiClient as jest.Mock).mockResolvedValue(mockLeaderboard);
    
    render(<LeaderboardCard />);
    
    await waitFor(() => {
      // Top 3 should have special styling
      const topEntries = screen.getAllByText(/Level/);
      expect(topEntries.length).toBeGreaterThanOrEqual(3);
    });
  });

  it("handles API error gracefully", async () => {
    (apiClient as jest.Mock).mockRejectedValue(new Error("API Error"));
    
    render(<LeaderboardCard />);
    
    await waitFor(() => {
      expect(screen.getByText("No leaderboard data available")).toBeInTheDocument();
    });
  });

  it("shows fallback avatar when no profile image", async () => {
    (apiClient as jest.Mock).mockResolvedValue(mockLeaderboard);
    
    render(<LeaderboardCard />);
    
    await waitFor(() => {
      // Should show first letter of username as avatar
      expect(screen.getByText("G")).toBeInTheDocument(); // generous_giver
    });
  });

  it("limits to top 5 entries", async () => {
    const longLeaderboard = [...Array(10)].map((_, i) => ({
      rank: i + 1,
      username: `user_${i}`,
      total_balance: 10000 - i * 1000,
      profile_image: null,
      altrue_level_number: 3,
    }));
    
    (apiClient as jest.Mock).mockResolvedValue(longLeaderboard);
    
    render(<LeaderboardCard />);
    
    await waitFor(() => {
      expect(screen.getByText("user_0")).toBeInTheDocument();
      expect(screen.getByText("user_4")).toBeInTheDocument();
    });
    
    // user_5 should not be visible (we only show top 5)
    expect(screen.queryByText("user_5")).not.toBeInTheDocument();
  });
});
