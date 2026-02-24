import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TopNonprofitsCard } from "@/components/dashboard/top-nonprofits-card";
import { apiClient } from "@/lib/api";

jest.mock("@/lib/api", () => ({
  apiClient: jest.fn(),
}));

describe("TopNonprofitsCard", () => {
  const mockNonprofits = [
    {
      id: 1,
      name: "Red Cross",
      logo: "https://example.com/redcross.png",
      total_balance: 125000,
      no_of_ratings: 45,
      average_rating: 4.8,
      projects_count: 12,
      contributors_count: 850,
    },
    {
      id: 2,
      name: "Save the Children",
      logo: null,
      total_balance: 98000,
      no_of_ratings: 38,
      average_rating: 4.7,
      projects_count: 8,
      contributors_count: 620,
    },
    {
      id: 3,
      name: "WWF",
      logo: null,
      total_balance: 87000,
      no_of_ratings: 52,
      average_rating: 4.9,
      projects_count: 15,
      contributors_count: 780,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state initially", () => {
    (apiClient as jest.Mock).mockImplementation(() => new Promise(() => {}));
    
    render(<TopNonprofitsCard />);
    
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("renders nonprofits sorted by balance by default", async () => {
    (apiClient as jest.Mock).mockResolvedValue({ results: mockNonprofits });
    
    render(<TopNonprofitsCard />);
    
    await waitFor(() => {
      expect(screen.getByText("Red Cross")).toBeInTheDocument();
      expect(screen.getByText("Save the Children")).toBeInTheDocument();
    });
    
    // Check donation amounts
    expect(screen.getByText("$125k")).toBeInTheDocument();
    expect(screen.getByText("$98k")).toBeInTheDocument();
  });

  it("allows sorting by rating", async () => {
    (apiClient as jest.Mock).mockResolvedValue({ results: mockNonprofits });
    
    render(<TopNonprofitsCard />);
    
    await waitFor(() => {
      expect(screen.getByText("Red Cross")).toBeInTheDocument();
    });
    
    const select = screen.getByRole("combobox");
    await userEvent.selectOptions(select, "rating");
    
    // Should trigger re-fetch with different sorting
    expect(apiClient).toHaveBeenCalledTimes(2);
  });

  it("displays star ratings correctly", async () => {
    (apiClient as jest.Mock).mockResolvedValue({ results: mockNonprofits });
    
    render(<TopNonprofitsCard />);
    
    await waitFor(() => {
      expect(screen.getByText("(45)")).toBeInTheDocument();
      expect(screen.getByText("(38)")).toBeInTheDocument();
    });
  });

  it("displays project and contributor counts", async () => {
    (apiClient as jest.Mock).mockResolvedValue({ results: mockNonprofits });
    
    render(<TopNonprofitsCard />);
    
    await waitFor(() => {
      expect(screen.getByText("12")).toBeInTheDocument(); // Projects
      expect(screen.getByText("850")).toBeInTheDocument(); // Supporters
    });
  });

  it("handles missing logos gracefully", async () => {
    (apiClient as jest.Mock).mockResolvedValue({ results: mockNonprofits });
    
    render(<TopNonprofitsCard />);
    
    await waitFor(() => {
      // Should show heart icon for nonprofits without logos
      expect(screen.getByText("Save the Children")).toBeInTheDocument();
    });
  });

  it("falls back to mock data on API error", async () => {
    (apiClient as jest.Mock).mockRejectedValue(new Error("API Error"));
    
    render(<TopNonprofitsCard />);
    
    await waitFor(() => {
      expect(screen.getByText("Red Cross")).toBeInTheDocument();
    });
  });

  it("displays ranking numbers", async () => {
    (apiClient as jest.Mock).mockResolvedValue({ results: mockNonprofits });
    
    render(<TopNonprofitsCard />);
    
    await waitFor(() => {
      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
    });
  });
});
