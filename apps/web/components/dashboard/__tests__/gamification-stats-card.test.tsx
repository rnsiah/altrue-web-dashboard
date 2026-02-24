import { render, screen, waitFor } from "@testing-library/react";
import { GamificationStatsCard } from "@/components/dashboard/gamification-stats-card";
import { apiClient } from "@/lib/api";

jest.mock("@/lib/api", () => ({
  apiClient: jest.fn(),
}));

describe("GamificationStatsCard", () => {
  const mockUsers = {
    results: [
      { id: 1, altruepoints: 5000, altrue_level: { level_number: 5 }, user_actions: [1, 2, 3] },
      { id: 2, altruepoints: 3000, altrue_level: { level_number: 3 }, user_actions: [1, 2] },
      { id: 3, altruepoints: 8000, altrue_level: { level_number: 8 }, user_actions: [1, 2, 3, 4, 5] },
      { id: 4, altruepoints: 1000, altrue_level: { level_number: 1 }, user_actions: [] },
      { id: 5, altruepoints: 2000, altrue_level: { level_number: 2 }, user_actions: [1] },
    ],
  };

  const mockLevels = [
    { id: 1, name: "Beginner", level_number: 1 },
    { id: 2, name: "Novice", level_number: 2 },
    { id: 3, name: "Helper", level_number: 3 },
    { id: 4, name: "Giver", level_number: 4 },
    { id: 5, name: "Champion", level_number: 5 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state initially", () => {
    (apiClient as jest.Mock).mockImplementation(() => new Promise(() => {}));
    
    render(<GamificationStatsCard />);
    
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("calculates total points correctly", async () => {
    (apiClient as jest.Mock)
      .mockResolvedValueOnce(mockUsers)
      .mockResolvedValueOnce(mockLevels);
    
    render(<GamificationStatsCard />);
    
    await waitFor(() => {
      // Total points: 5000 + 3000 + 8000 + 1000 + 2000 = 19000
      expect(screen.getByText("19,000")).toBeInTheDocument();
    });
  });

  it("calculates average points correctly", async () => {
    (apiClient as jest.Mock)
      .mockResolvedValueOnce(mockUsers)
      .mockResolvedValueOnce(mockLevels);
    
    render(<GamificationStatsCard />);
    
    await waitFor(() => {
      // Average: 19000 / 5 = 3800
      expect(screen.getByText("3,800")).toBeInTheDocument();
    });
  });

  it("displays correct number of total levels", async () => {
    (apiClient as jest.Mock)
      .mockResolvedValueOnce(mockUsers)
      .mockResolvedValueOnce(mockLevels);
    
    render(<GamificationStatsCard />);
    
    await waitFor(() => {
      expect(screen.getByText("5")).toBeInTheDocument(); // Total levels
    });
  });

  it("displays highest level reached", async () => {
    (apiClient as jest.Mock)
      .mockResolvedValueOnce(mockUsers)
      .mockResolvedValueOnce(mockLevels);
    
    render(<GamificationStatsCard />);
    
    await waitFor(() => {
      expect(screen.getByText("Level 8")).toBeInTheDocument();
    });
  });

  it("renders level distribution chart", async () => {
    (apiClient as jest.Mock)
      .mockResolvedValueOnce(mockUsers)
      .mockResolvedValueOnce(mockLevels);
    
    render(<GamificationStatsCard />);
    
    await waitFor(() => {
      expect(screen.getByText("Level Distribution")).toBeInTheDocument();
      expect(screen.getByText("Level 1")).toBeInTheDocument();
      expect(screen.getByText("Level 2")).toBeInTheDocument();
    });
  });

  it("handles API errors gracefully", async () => {
    (apiClient as jest.Mock).mockRejectedValue(new Error("API Error"));
    
    render(<GamificationStatsCard />);
    
    await waitFor(() => {
      // Should render with mock data
      expect(screen.getByText("Gamification Overview")).toBeInTheDocument();
    });
  });

  it("displays promoted actions count", async () => {
    (apiClient as jest.Mock)
      .mockResolvedValueOnce(mockUsers)
      .mockResolvedValueOnce(mockLevels);
    
    render(<GamificationStatsCard />);
    
    await waitFor(() => {
      expect(screen.getByText("Promoted")).toBeInTheDocument();
    });
  });
});
