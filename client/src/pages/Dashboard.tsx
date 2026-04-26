import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  Loader2,
  TrendingUp,
  DollarSign,
  PiggyBank,
  Target,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const profileQuery = trpc.financial.getProfile.useQuery(undefined, {
    enabled: !!user,
  });
  const budgetQuery = trpc.financial.getBudget.useQuery(undefined, {
    enabled: !!user,
  });
  const planQuery = trpc.financial.getFinancialPlan.useQuery(undefined, {
    enabled: !!user,
  });
  const utils = trpc.useUtils();
  const generatePlanMutation = trpc.financial.generateFinancialPlan.useMutation(
    {
      onSuccess: () => {
        utils.financial.getBudget.invalidate();
        utils.financial.getFinancialPlan.invalidate();
        planQuery.refetch();
      },
    }
  );

  useEffect(() => {
    if (!authLoading && !user) {
      window.location.href = "/";
    }
  }, [user, authLoading]);

  if (authLoading || profileQuery.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
      </div>
    );
  }

  const profile = profileQuery.data;
  const budget = budgetQuery.data;

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950 p-4">
        <Card className="w-full max-w-md border-white/10 bg-white/[0.04] backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white">Completa tu perfil</CardTitle>
            <CardDescription className="text-zinc-400">
              Necesitamos que completes el onboarding para continuar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => (window.location.href = "/onboarding")}
              className="w-full bg-emerald-500 hover:bg-emerald-400"
            >
              Ir al Onboarding
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const monthlyIncome = parseFloat(profile.monthlyIncome as unknown as string);
  const currentSavings = parseFloat(
    profile.currentSavings as unknown as string
  );

  const budgetData = budget
    ? [
        {
          name: "Gastos Fijos",
          value: parseFloat(
            budget.fixedExpensesPercentage as unknown as string
          ),
          color: "#f43f5e",
        },
        {
          name: "Gastos Variables",
          value: parseFloat(
            budget.variableExpensesPercentage as unknown as string
          ),
          color: "#f97316",
        },
        {
          name: "Ahorro",
          value: parseFloat(budget.savingsPercentage as unknown as string),
          color: "#3b82f6",
        },
        {
          name: "Inversión",
          value: parseFloat(budget.investmentPercentage as unknown as string),
          color: "#10b981",
        },
        {
          name: "Pago de Deudas",
          value: parseFloat(budget.debtPaymentPercentage as unknown as string),
          color: "#8b5cf6",
        },
      ].filter(item => item.value > 0)
    : [];

  const kpis = [
    {
      title: "Ingreso Mensual",
      value: `$${monthlyIncome.toFixed(2)}`,
      icon: DollarSign,
      color: "text-emerald-400",
      ring: "from-emerald-500/30 to-transparent",
    },
    {
      title: "Ahorros Actuales",
      value: `$${currentSavings.toFixed(2)}`,
      icon: PiggyBank,
      color: "text-blue-400",
      ring: "from-blue-500/30 to-transparent",
    },
    {
      title: "Capacidad de Inversión",
      value: budget
        ? `$${parseFloat(budget.investmentAmount as unknown as string).toFixed(2)}/mes`
        : "$0",
      icon: TrendingUp,
      color: "text-violet-400",
      ring: "from-violet-500/30 to-transparent",
    },
    {
      title: "Ahorro Mensual",
      value: budget
        ? `$${parseFloat(budget.savingsAmount as unknown as string).toFixed(2)}/mes`
        : "$0",
      icon: Target,
      color: "text-cyan-400",
      ring: "from-cyan-500/30 to-transparent",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-neutral-950 p-3 md:p-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(16,185,129,0.16),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.14),transparent_30%)]" />
      <div className="relative mx-auto max-w-7xl space-y-6 md:space-y-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="space-y-2">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              Resumen financiero inteligente
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
              ¡Hola, {user?.name}!
            </h1>
            <p className="text-sm text-zinc-400 md:text-base">
              Aquí está tu panel financiero personalizado.
            </p>
          </div>
          <Button
            onClick={() => (window.location.href = "/edit-profile")}
            className="rounded-xl border border-white/15 bg-white/5 text-zinc-100 hover:bg-white/10"
          >
            Editar perfil
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((kpi, index) => {
            const Icon = kpi.icon;
            return (
              <motion.div
                key={kpi.title}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
              >
                <Card className="overflow-hidden border-white/10 bg-white/[0.04] backdrop-blur-xl">
                  <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                    <div
                      className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${kpi.ring}`}
                    />
                    <CardTitle className="relative text-sm font-medium text-zinc-300">
                      {kpi.title}
                    </CardTitle>
                    <div className="relative rounded-lg border border-white/10 bg-black/20 p-2">
                      <Icon className={`h-4 w-4 ${kpi.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-semibold text-white">
                      {kpi.value}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {budget && (
          <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2">
            <Card className="border-white/10 bg-white/[0.04] backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white">
                  Distribución de Presupuesto
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  Modelo 50/30/20 adaptado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={budgetData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) =>
                        `${name}: ${value.toFixed(1)}%`
                      }
                      outerRadius={102}
                      innerRadius={66}
                      dataKey="value"
                    >
                      {budgetData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          stroke="rgba(255,255,255,0.12)"
                          strokeWidth={1.5}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={value =>
                        `${typeof value === "number" ? value.toFixed(1) : value}%`
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/[0.04] backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white">
                  Detalles del Presupuesto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {[
                  {
                    label: "Gastos Fijos",
                    percentage: budget.fixedExpensesPercentage,
                    amount: budget.fixedExpensesAmount,
                    barColor: "bg-rose-500",
                  },
                  {
                    label: "Gastos Variables",
                    percentage: budget.variableExpensesPercentage,
                    amount: budget.variableExpensesAmount,
                    barColor: "bg-orange-500",
                  },
                  {
                    label: "Ahorro",
                    percentage: budget.savingsPercentage,
                    amount: budget.savingsAmount,
                    barColor: "bg-blue-500",
                  },
                  {
                    label: "Inversión",
                    percentage: budget.investmentPercentage,
                    amount: budget.investmentAmount,
                    barColor: "bg-emerald-500",
                  },
                  {
                    label: "Pago de Deudas",
                    percentage: budget.debtPaymentPercentage,
                    amount: budget.debtPaymentAmount,
                    barColor: "bg-violet-500",
                  },
                ].map(item => (
                  <div key={item.label} className="space-y-2.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-300">{item.label}</span>
                      <span className="font-semibold text-white">
                        $
                        {parseFloat(item.amount as unknown as string).toFixed(
                          2
                        )}{" "}
                        (
                        {parseFloat(
                          item.percentage as unknown as string
                        ).toFixed(1)}
                        %)
                      </span>
                    </div>
                    <div className="relative">
                      <Progress
                        value={parseFloat(item.percentage as unknown as string)}
                        className="h-2.5 bg-white/10"
                      />
                      <div
                        className={`pointer-events-none absolute inset-y-0 left-0 rounded-full ${item.barColor} opacity-15`}
                        style={{
                          width: `${parseFloat(item.percentage as unknown as string)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {planQuery.data && (
          <Card className="border-white/10 bg-white/[0.04] backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white">
                Tu Plan Financiero Personalizado
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2 rounded-xl border border-emerald-400/20 bg-emerald-500/5 p-4">
                <h3 className="text-base font-semibold text-emerald-300">
                  Situación Actual
                </h3>
                <p className="text-sm leading-relaxed text-zinc-300">
                  {planQuery.data.currentSituation}
                </p>
              </div>
              <div className="space-y-2 rounded-xl border border-rose-400/20 bg-rose-500/5 p-4">
                <h3 className="text-base font-semibold text-rose-300">
                  Problemas Identificados
                </h3>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-300">
                  {planQuery.data.problemsIdentified}
                </p>
              </div>
              <div className="space-y-2 rounded-xl border border-blue-400/20 bg-blue-500/5 p-4">
                <h3 className="text-base font-semibold text-blue-300">
                  Recomendaciones
                </h3>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-300">
                  {planQuery.data.recommendations}
                </p>
              </div>
              <div className="space-y-2 rounded-xl border border-violet-400/20 bg-violet-500/5 p-4">
                <h3 className="text-base font-semibold text-violet-300">
                  Plan de Acción
                </h3>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-300">
                  {planQuery.data.actionPlan}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {!planQuery.data && (
          <Card className="border-white/10 bg-white/[0.04] backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white">
                Genera tu Plan Financiero
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Recibe un análisis personalizado con recomendaciones de IA
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => generatePlanMutation.mutate()}
                disabled={generatePlanMutation.isPending}
                className="rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50"
              >
                {generatePlanMutation.isPending
                  ? "Generando..."
                  : "Generar Plan Ahora"}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
