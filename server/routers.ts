import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  getOrCreateFinancialProfile,
  createFinancialProfile,
  updateFinancialProfile,
  getOrCreateBudgetAllocation,
  createBudgetAllocation,
  getLatestFinancialPlan,
  createFinancialPlan,
  getInvestmentGoals,
  createInvestmentGoal,
  getChatConversation,
  createOrUpdateChatConversation,
} from "./db";
import { invokeLLM } from "./_core/llm";

// Helper function to generate budget allocation
async function generateBudgetAllocation(userId: number, financialProfileId: number) {
  const profile = await getOrCreateFinancialProfile(userId);
  if (!profile) return;

  const monthlyIncome = typeof profile.monthlyIncome === 'string' ? parseFloat(profile.monthlyIncome) : Number(profile.monthlyIncome);
  const fixedExpensesAmount = profile.hasFixedExpenses ? (typeof profile.fixedExpensesAmount === 'string' ? parseFloat(profile.fixedExpensesAmount) : Number(profile.fixedExpensesAmount || 0)) : 0;
  const totalDebts = profile.hasDebts ? (typeof profile.totalDebts === 'string' ? parseFloat(profile.totalDebts) : Number(profile.totalDebts || 0)) : 0;

  // Adapt 50/30/20 model based on user profile
  let fixedExpensesPercentage = (fixedExpensesAmount / monthlyIncome) * 100;
  let variableExpensesPercentage = 30;
  let savingsPercentage = 20;
  let investmentPercentage = 0;
  let debtPaymentPercentage = 0;

  // Adjust for debts
  if (totalDebts > 0) {
    debtPaymentPercentage = Math.min(15, (totalDebts / (monthlyIncome * 12)) * 100);
    savingsPercentage -= debtPaymentPercentage / 2;
  }

  // Adjust for fixed expenses
  if (fixedExpensesPercentage > 50) {
    variableExpensesPercentage = Math.max(10, 100 - fixedExpensesPercentage - 20);
  } else if (fixedExpensesPercentage < 30) {
    investmentPercentage = 10;
    savingsPercentage = 30;
  }

  // Normalize percentages
  const total = fixedExpensesPercentage + variableExpensesPercentage + savingsPercentage + investmentPercentage + debtPaymentPercentage;
  if (total !== 100) {
    const factor = 100 / total;
    fixedExpensesPercentage *= factor;
    variableExpensesPercentage *= factor;
    savingsPercentage *= factor;
    investmentPercentage *= factor;
    debtPaymentPercentage *= factor;
  }

  await createBudgetAllocation(userId, {
    financialProfileId,
    fixedExpensesPercentage: fixedExpensesPercentage.toString(),
    fixedExpensesAmount: fixedExpensesAmount.toString(),
    variableExpensesPercentage: variableExpensesPercentage.toString(),
    variableExpensesAmount: ((monthlyIncome * variableExpensesPercentage) / 100).toString(),
    savingsPercentage: savingsPercentage.toString(),
    savingsAmount: ((monthlyIncome * savingsPercentage) / 100).toString(),
    investmentPercentage: investmentPercentage.toString(),
    investmentAmount: ((monthlyIncome * investmentPercentage) / 100).toString(),
    debtPaymentPercentage: debtPaymentPercentage.toString(),
    debtPaymentAmount: ((monthlyIncome * debtPaymentPercentage) / 100).toString(),
  });
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Financial profile and onboarding
  financial: router({
    getProfile: protectedProcedure.query(async ({ ctx }) => {
      return await getOrCreateFinancialProfile(ctx.user.id);
    }),

    completeOnboarding: protectedProcedure
      .input(
        z.object({
          monthlyIncome: z.number().positive(),
          incomeType: z.enum(["fixed", "variable"]),
          hasFixedExpenses: z.boolean(),
          fixedExpensesAmount: z.number().nonnegative().optional(),
          hasDebts: z.boolean(),
          totalDebts: z.number().nonnegative().optional(),
          currentSavings: z.number().nonnegative(),
          riskProfile: z.enum(["conservative", "moderate", "aggressive"]).optional(),
          investmentExperience: z.enum(["beginner", "intermediate", "advanced"]).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const existingProfile = await getOrCreateFinancialProfile(ctx.user.id);

        if (existingProfile) {
          await updateFinancialProfile(ctx.user.id, {
            monthlyIncome: input.monthlyIncome.toString(),
            incomeType: input.incomeType,
            hasFixedExpenses: input.hasFixedExpenses ? 1 : 0,
            fixedExpensesAmount: input.fixedExpensesAmount?.toString(),
            hasDebts: input.hasDebts ? 1 : 0,
            totalDebts: input.totalDebts?.toString(),
            currentSavings: input.currentSavings.toString(),
            riskProfile: input.riskProfile,
            investmentExperience: input.investmentExperience,
            completedOnboarding: 1,
          });
          return existingProfile;
        }

        await createFinancialProfile(ctx.user.id, {
          monthlyIncome: input.monthlyIncome.toString(),
          incomeType: input.incomeType,
          hasFixedExpenses: input.hasFixedExpenses ? 1 : 0,
          fixedExpensesAmount: input.fixedExpensesAmount?.toString(),
          hasDebts: input.hasDebts ? 1 : 0,
          totalDebts: input.totalDebts?.toString(),
          currentSavings: input.currentSavings.toString(),
          riskProfile: input.riskProfile,
          investmentExperience: input.investmentExperience,
          completedOnboarding: 1,
        });

        // Generate budget allocation after onboarding
        const profile = await getOrCreateFinancialProfile(ctx.user.id);
        if (profile) {
          await generateBudgetAllocation(ctx.user.id, profile.id);
        }

        return profile;
      }),

    getBudget: protectedProcedure.query(async ({ ctx }) => {
      return await getOrCreateBudgetAllocation(ctx.user.id);
    }),

    getFinancialPlan: protectedProcedure.query(async ({ ctx }) => {
      return await getLatestFinancialPlan(ctx.user.id);
    }),

    generateFinancialPlan: protectedProcedure.mutation(async ({ ctx }) => {
      const profile = await getOrCreateFinancialProfile(ctx.user.id);
      if (!profile) {
        throw new Error("Financial profile not found. Complete onboarding first.");
      }

      const budget = await getOrCreateBudgetAllocation(ctx.user.id);

      const prompt = `
Analiza el siguiente perfil financiero de un usuario y proporciona un plan financiero personalizado en español:

Perfil Financiero:
- Ingreso mensual: $${profile.monthlyIncome}
- Tipo de ingreso: ${profile.incomeType === "fixed" ? "Fijo" : "Variable"}
- Gastos fijos: ${profile.hasFixedExpenses ? `$${profile.fixedExpensesAmount}` : "No tiene"}
- Deudas: ${profile.hasDebts ? `$${profile.totalDebts}` : "No tiene"}
- Ahorros actuales: $${profile.currentSavings}
- Perfil de riesgo: ${profile.riskProfile}
- Experiencia en inversión: ${profile.investmentExperience}

Presupuesto Asignado:
- Gastos fijos: ${budget?.fixedExpensesPercentage}% ($${budget?.fixedExpensesAmount})
- Gastos variables: ${budget?.variableExpensesPercentage}% ($${budget?.variableExpensesAmount})
- Ahorro: ${budget?.savingsPercentage}% ($${budget?.savingsAmount})
- Inversión: ${budget?.investmentPercentage}% ($${budget?.investmentAmount})
- Pago de deudas: ${budget?.debtPaymentPercentage}% ($${budget?.debtPaymentAmount})

Proporciona:
1. Análisis de la situación actual (2-3 párrafos)
2. Problemas identificados (lista de 3-5 problemas clave)
3. Recomendaciones personalizadas (lista de 5-7 recomendaciones concretas)
4. Plan de acción (pasos específicos a seguir en los próximos 30, 90 y 180 días)

Formatea la respuesta en JSON con las siguientes claves: currentSituation, problemsIdentified, recommendations, actionPlan`;

      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: "Eres un asesor financiero experto. Proporciona análisis y recomendaciones personalizadas basadas en el perfil financiero del usuario. Responde siempre en español.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "financial_plan",
            strict: true,
            schema: {
              type: "object",
              properties: {
                currentSituation: { type: "string" },
                problemsIdentified: { type: "string" },
                recommendations: { type: "string" },
                actionPlan: { type: "string" },
              },
              required: ["currentSituation", "problemsIdentified", "recommendations", "actionPlan"],
              additionalProperties: false,
            },
          },
        },
      });

      const content = response.choices[0]?.message.content;
      if (!content || typeof content !== 'string') {
        throw new Error("Failed to generate financial plan");
      }

      const plan = JSON.parse(content);

      await createFinancialPlan(ctx.user.id, {
        financialProfileId: profile.id,
        currentSituation: plan.currentSituation,
        problemsIdentified: plan.problemsIdentified,
        recommendations: plan.recommendations,
        actionPlan: plan.actionPlan,
      });

      return plan;
    }),

    getInvestmentGoals: protectedProcedure.query(async ({ ctx }) => {
      return await getInvestmentGoals(ctx.user.id);
    }),

    createInvestmentGoal: protectedProcedure
      .input(
        z.object({
          goalName: z.string(),
          targetAmount: z.number().positive(),
          timelineYears: z.number().positive(),
          monthlyInvestment: z.number().positive(),
          expectedAnnualReturn: z.number().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await createInvestmentGoal(ctx.user.id, {
          goalName: input.goalName,
          targetAmount: input.targetAmount.toString(),
          timelineYears: input.timelineYears,
          monthlyInvestment: input.monthlyInvestment.toString(),
          expectedAnnualReturn: input.expectedAnnualReturn?.toString(),
        });
        return { success: true };
      }),
  }),

  chat: router({
    getConversation: protectedProcedure.query(async ({ ctx }) => {
      const conv = await getChatConversation(ctx.user.id);
      return conv ? JSON.parse(conv.messages as unknown as string) : [];
    }),

    sendMessage: protectedProcedure
      .input(
        z.object({
          message: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const profile = await getOrCreateFinancialProfile(ctx.user.id);
        const budget = await getOrCreateBudgetAllocation(ctx.user.id);
        const conv = await getChatConversation(ctx.user.id);
        const messages = conv ? JSON.parse(conv.messages as unknown as string) : [];

        messages.push({
          role: "user",
          content: input.message,
        });

        const systemPrompt = `Eres un asesor financiero personal inteligente. Tienes acceso al perfil financiero del usuario y debes proporcionar recomendaciones personalizadas y educación financiera.

Perfil del usuario:
- Ingreso mensual: $${profile?.monthlyIncome || "No especificado"}
- Tipo de ingreso: ${profile?.incomeType === "fixed" ? "Fijo" : "Variable"}
- Ahorros actuales: $${profile?.currentSavings || "No especificado"}
- Perfil de riesgo: ${profile?.riskProfile || "No especificado"}

Presupuesto:
- Inversión disponible: $${budget?.investmentAmount || "No especificado"} mensual

Responde siempre en español. Sé conciso, práctico y enfocado en acciones específicas que el usuario pueda tomar.`;

        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            ...messages,
          ],
        });

        const assistantContent = response.choices[0]?.message.content;
        const assistantMessage = typeof assistantContent === 'string' ? assistantContent : "No pude procesar tu pregunta.";

        messages.push({
          role: "assistant",
          content: assistantMessage,
        });

        await createOrUpdateChatConversation(ctx.user.id, messages);

        return {
          message: assistantMessage,
          messages,
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;

// Export helper for testing
export { generateBudgetAllocation };
