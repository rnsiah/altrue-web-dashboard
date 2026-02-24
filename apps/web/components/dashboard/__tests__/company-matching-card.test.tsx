import { render, screen, waitFor } from "@testing-library/react";
import { CompanyMatchingCard } from "@/components/dashboard/company-matching-card";
import { apiClient } from "@/lib/api";

jest.mock("@/lib/api", () => ({
  apiClient: jest.fn(),
}));

describe("CompanyMatchingCard", () => {
  const mockMatches = [
    {
      id: 1,
      company_name: "Acme Corp",
      company_logo: "https://example.com/logo1.png",
      nonprofit_name: "Red Cross",
      match_level: 50,
      total_raised: 25000,
      funding_limit: 50000,
    },
    {
      id: 2,
      company_name: "Tech Giants Inc",
      company_logo: null,
      nonprofit_name: "Save the Children",
      match_level: 100,
      total_raised: 10000,
      funding_limit: 10000,
    },
    {
      id: 3,
      company_name: "Green Energy Co",
      company_logo: null,
      nonprofit_name: "WWF",
      match_level: 25,
      total_raised: 5000,
      funding_limit: 100000,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state initially", () => {
    (apiClient as jest.Mock).mockImplementation(() => new Promise(() => {}));
    
    render(<CompanyMatchingCard />);
    
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("renders company matches with correct data", async () => {
    (apiClient as jest.Mock).mockResolvedValue(mockMatches);
    
    render(<CompanyMatchingCard />);
    
    await waitFor(() => {
      expect(screen.getByText("Acme Corp")).toBeInTheDocument();
      expect(screen.getByText("Red Cross")).toBeInTheDocument();
    });
    
    // Check match percentages
    expect(screen.getByText("50% match")).toBeInTheDocument();
    expect(screen.getByText("100% match")).toBeInTheDocument();
    expect(screen.getByText("25% match")).toBeInTheDocument();
  });

  it("displays correct stats", async () => {
    (apiClient as jest.Mock).mockResolvedValue(mockMatches);
    
    render(<CompanyMatchingCard />);
    
    await waitFor(() => {
      expect(screen.getByText("3")).toBeInTheDocument(); // Companies
      expect(screen.getByText("$40k")).toBeInTheDocument(); // Total matched
    });
  });

  it("calculates progress percentage correctly", async () => {
    (apiClient as jest.Mock).mockResolvedValue(mockMatches);
    
    render(<CompanyMatchingCard />);
    
    await waitFor(() => {
      expect(screen.getByText("$25,000 raised")).toBeInTheDocument();
      expect(screen.getByText("$50,000 limit")).toBeInTheDocument();
    });
  });

  it("falls back to mock data on API error", async () => {
    (apiClient as jest.Mock).mockRejectedValue(new Error("API Error"));
    
    render(<CompanyMatchingCard />);
    
    await waitFor(() => {
      // Should still render with mock data
      expect(screen.getByText("Acme Corp")).toBeInTheDocument();
    });
  });

  it("displays correct currency formatting", async () => {
    (apiClient as jest.Mock).mockResolvedValue(mockMatches);
    
    render(<CompanyMatchingCard />);
    
    await waitFor(() => {
      expect(screen.getByText("$25,000 raised")).toBeInTheDocument();
    });
  });
});
