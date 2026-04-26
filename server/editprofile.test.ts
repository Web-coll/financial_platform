import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId: number): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: userId,
    openId: `test-user-${userId}`,
    email: `test${userId}@example.com`,
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("financial.completeOnboarding - Edit Profile", () => {
  it("should update financial profile with variable income", async () => {
    const { ctx } = createAuthContext(101);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.financial.completeOnboarding({
      monthlyIncome: 3000,
      incomeType: "variable",
      hasFixedExpenses: true,
      fixedExpensesAmount: 800,
      hasDebts: false,
      totalDebts: 0,
      currentSavings: 500,
      riskProfile: "moderate",
      investmentExperience: "beginner",
    });

    expect(result).toBeDefined();
    expect(result?.incomeType).toBe("variable");
    expect(result?.hasFixedExpenses).toBe(1);
  });

  it("should allow updating profile with zero savings", async () => {
    const { ctx } = createAuthContext(102);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.financial.completeOnboarding({
      monthlyIncome: 2500,
      incomeType: "fixed",
      hasFixedExpenses: true,
      fixedExpensesAmount: 1000,
      hasDebts: true,
      totalDebts: 5000,
      currentSavings: 0,
      riskProfile: "conservative",
      investmentExperience: "beginner",
    });

    expect(result).toBeDefined();
    expect(result?.incomeType).toBe("fixed");
    expect(result?.hasDebts).toBe(1);
  });

  it("should update risk profile to aggressive", async () => {
    const { ctx } = createAuthContext(103);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.financial.completeOnboarding({
      monthlyIncome: 4000,
      incomeType: "fixed",
      hasFixedExpenses: false,
      hasDebts: false,
      totalDebts: 0,
      currentSavings: 2000,
      riskProfile: "aggressive",
      investmentExperience: "intermediate",
    });

    expect(result).toBeDefined();
    expect(result?.incomeType).toBe("fixed");
    expect(result?.hasFixedExpenses).toBe(0);
  });
});
