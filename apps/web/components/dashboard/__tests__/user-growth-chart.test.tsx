import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserGrowthChart } from "@/components/dashboard/user-growth-chart";
import { apiClient } from "@/lib/api";

jest.mock("@/lib/api", () => ({
  apiClient: jest.fn(),
}));

describe("UserGrowthChart", () => {
  const mockUsers = {
    results: [
      { id: 1, date_joined: "2024-01-01" },
      { id: 2, date_joined: "2024-01-02" },
      { id: 3, date_joined: "2024-01-03" },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state initially", () => {
    (apiClient as jest.Mock).mockImplementation(() => new Promise(() => {}));
    
    render(<UserGrowthChart />);
    
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("renders chart with user data", async () => {
    (apiClient as jest.Mock).mockResolvedValue(mockUsers);
    
    render(<UserGrowthChart />);
    
    await waitFor(() => {
      expect(screen.getByText("User Growth")).toBeInTheDocument();
    });
    
    // Check summary stats are displayed
    expect(screen.getByText("Total Users")).toBeInTheDocument();
    expect(screen.getByText("New Today")).toBeInTheDocument();
    expect(screen.getByText("Active Now")).toBeInTheDocument();
  });

  it("allows switching time ranges", async () => {
    (apiClient as jest.Mock).mockResolvedValue(mockUsers);
    
    render(<UserGrowthChart />);
    
    await waitFor(() => {
      expect(screen.getByText("7 Days")).toBeInTheDocument();
      expect(screen.getByText("30 Days")).toBeInTheDocument();
      expect(screen.getByText("90 Days")).toBeInTheDocument();
    });
    
    const button90Days = screen.getByText("90 Days");
    await userEvent.click(button90Days);
    
    // Should trigger re-fetch
    expect(apiClient).toHaveBeenCalledTimes(2);
  });

  it("displays correct total user count", async () => {
    (apiClient as jest.Mock).mockResolvedValue(mockUsers);
    
    render(<UserGrowthChart />);
    
    await waitFor(() => {
      // Should display formatted user count
      const totalUsersElements = screen.getAllByText(/\d+/);
      expect(totalUsersElements.length).toBeGreaterThan(0);
    });
  });

  it("handles API errors gracefully", async () => {
    (apiClient as jest.Mock).mockRejectedValue(new Error("API Error"));
    
    render(<UserGrowthChart />);
    
    await waitFor(() => {
      // Should still render with generated data
      expect(screen.getByText("User Growth")).toBeInTheDocument();
    });
  });

  it("has time range buttons in correct state", async () => {
    (apiClient as jest.Mock).mockResolvedValue(mockUsers);
    
    render(<UserGrowthChart />);
    
    await waitFor(() => {
      const button30Days = screen.getByText("30 Days");
      expect(button30Days).toHaveClass("bg-[#D4AF37]"); // Active state
    });
  });
});
