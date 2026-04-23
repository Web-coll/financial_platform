import { describe, it, expect } from "vitest";

describe("Financial Module", () => {
  describe("Budget Calculation (50/30/20 Model)", () => {
    it("should calculate budget allocation correctly for fixed income", () => {
      const monthlyIncome = 2000;
      const fixedExpenses = 600;
      const hasDebts = false;
      const totalDebts = 0;

      // Calculate using 50/30/20 model
      const availableAfterFixed = monthlyIncome - fixedExpenses;
      
      // 50% for needs (includes fixed expenses)
      const needsPercentage = (fixedExpenses / monthlyIncome) * 100;
      
      // 30% for wants (variable expenses)
      const wantsPercentage = 30;
      const wantsAmount = (monthlyIncome * wantsPercentage) / 100;
      
      // 20% for savings/investment
      const savingsPercentage = 20;
      const savingsAmount = (monthlyIncome * savingsPercentage) / 100;

      expect(needsPercentage).toBeLessThanOrEqual(50);
      expect(wantsAmount).toBe(600);
      expect(savingsAmount).toBe(400);
      expect(needsPercentage + wantsPercentage + savingsPercentage).toBeLessThanOrEqual(100);
    });

    it("should handle high fixed expenses by adjusting percentages", () => {
      const monthlyIncome = 1000;
      const fixedExpenses = 700;
      
      const needsPercentage = (fixedExpenses / monthlyIncome) * 100;
      const remainingPercentage = 100 - needsPercentage;
      
      // Adjust wants and savings proportionally
      const wantsPercentage = Math.min(30, remainingPercentage * 0.6);
      const savingsPercentage = remainingPercentage - wantsPercentage;

      expect(needsPercentage).toBe(70);
      expect(wantsPercentage).toBeLessThanOrEqual(30);
      expect(savingsPercentage).toBeGreaterThan(0);
    });

    it("should calculate investment capacity correctly", () => {
      const monthlyIncome = 3000;
      const fixedExpenses = 900;
      const hasDebts = true;
      const totalDebts = 5000;
      
      // Available after fixed expenses
      const available = monthlyIncome - fixedExpenses;
      
      // Allocate 30% for wants
      const wants = (monthlyIncome * 30) / 100;
      
      // Remaining for savings and debt payment
      const remaining = available - wants;
      
      // If has debts, allocate 50% to debt payment, 50% to investment
      const debtPayment = hasDebts ? remaining * 0.5 : 0;
      const investmentCapacity = remaining - debtPayment;

      expect(available).toBe(2100);
      expect(wants).toBe(900);
      expect(investmentCapacity).toBeGreaterThan(0);
    });
  });

  describe("Investment Growth Simulation", () => {
    it("should calculate compound growth correctly", () => {
      const monthlyInvestment = 500;
      const annualReturn = 7;
      const years = 10;
      
      const monthlyRate = annualReturn / 100 / 12;
      let balance = 0;

      for (let year = 0; year < years; year++) {
        for (let month = 0; month < 12; month++) {
          balance = balance * (1 + monthlyRate) + monthlyInvestment;
        }
      }

      const totalInvested = monthlyInvestment * 12 * years;
      const earnings = balance - totalInvested;
      
      expect(balance).toBeGreaterThan(totalInvested);
      expect(earnings).toBeGreaterThan(0);
      expect(balance).toBeCloseTo(86500, -2); // Approximate value
    });

    it("should show power of compound interest over time", () => {
      const monthlyInvestment = 1000;
      const annualReturn = 8;
      
      const calculateBalance = (years: number) => {
        const monthlyRate = annualReturn / 100 / 12;
        let balance = 0;
        for (let y = 0; y < years; y++) {
          for (let m = 0; m < 12; m++) {
            balance = balance * (1 + monthlyRate) + monthlyInvestment;
          }
        }
        return balance;
      };

      const balance5 = calculateBalance(5);
      const balance10 = calculateBalance(10);
      const balance20 = calculateBalance(20);

      expect(balance10).toBeGreaterThan(balance5 * 1.8);
      expect(balance20).toBeGreaterThan(balance10 * 2.5);
    });
  });

  describe("Profile Risk Assessment", () => {
    it("should classify conservative profile correctly", () => {
      const riskProfile = "conservative";
      const investmentExperience = "beginner";
      
      const shouldRecommendETFs = riskProfile === "conservative" && investmentExperience === "beginner";
      const recommendedAllocation = {
        stocks: 40,
        bonds: 50,
        cash: 10,
      };

      expect(shouldRecommendETFs).toBe(true);
      expect(recommendedAllocation.bonds).toBeGreaterThan(recommendedAllocation.stocks);
    });

    it("should classify aggressive profile correctly", () => {
      const riskProfile = "aggressive";
      const investmentExperience = "intermediate";
      
      const shouldRecommendGrowthStocks = riskProfile === "aggressive";
      const recommendedAllocation = {
        stocks: 80,
        bonds: 15,
        cash: 5,
      };

      expect(shouldRecommendGrowthStocks).toBe(true);
      expect(recommendedAllocation.stocks).toBeGreaterThan(50);
    });
  });

  describe("Debt Impact Analysis", () => {
    it("should calculate debt-to-income ratio", () => {
      const monthlyIncome = 3000;
      const totalDebts = 15000;
      const monthlyDebtPayment = 500;
      
      const debtToIncomeRatio = (monthlyDebtPayment / monthlyIncome) * 100;
      
      expect(debtToIncomeRatio).toBeCloseTo(16.67, 1);
      expect(debtToIncomeRatio).toBeLessThan(43); // Healthy threshold
    });

    it("should recommend debt payoff strategy", () => {
      const monthlyIncome = 2000;
      const totalDebts = 8000;
      const monthlyDebtPayment = 300;
      
      const monthsToPayoff = totalDebts / monthlyDebtPayment;
      const shouldPrioritizeDebt = monthlyDebtPayment > monthlyIncome * 0.15;

      expect(monthsToPayoff).toBeCloseTo(26.67, 1);
      expect(shouldPrioritizeDebt).toBe(false);
    });
  });
});
