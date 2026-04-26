import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Loader2, TrendingUp, DollarSign, PiggyBank, Target } from "lucide-react";

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
  const generatePlanMutation = trpc.financial.generateFinancialPlan.useMutation({
    onSuccess: () => {
      utils.financial.getBudget.invalidate();
      utils.financial.getFinancialPlan.invalidate();
      planQuery.refetch();
    },
  });

  useEffect(() => {
    if (!authLoading && !user) {
      window.location.href = "/";
    }
  }, [user, authLoading]);

  if (authLoading || profileQuery.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-500" />
      </div>
    );
  }

  const profile = profileQuery.data;
  const budget = budgetQuery.data;

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Card className="bg-slate-800 border-slate-700 max-w-md">
          <CardHeader>
            <CardTitle className="text-white">Completa tu perfil</CardTitle>
            <CardDescription className="text-slate-400">
              Necesitamos que completes el onboarding para continuar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => (window.location.href = "/onboarding")}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              Ir al Onboarding
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const monthlyIncome = parseFloat(profile.monthlyIncome as unknown as string);
  const currentSavings = parseFloat(profile.currentSavings as unknown as string);

  // Budget data for pie chart
  const budgetData = budget
    ? [
        {
          name: "Gastos Fijos",
          value: parseFloat(budget.fixedExpensesPercentage as unknown as string),
          color: "#ef4444",
        },
        {
          name: "Gastos Variables",
          value: parseFloat(budget.variableExpensesPercentage as unknown as string),
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
      ].filter((item) => item.value > 0)
    : [];

  // KPI Cards
  const kpis = [
    {
      title: "Ingreso Mensual",
      value: `$${monthlyIncome.toFixed(2)}`,
      icon: DollarSign,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Ahorros Actuales",
      value: `$${currentSavings.toFixed(2)}`,
      icon: PiggyBank,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Capacidad de Inversión",
      value: budget ? `$${parseFloat(budget.investmentAmount as unknown as string).toFixed(2)}/mes` : "$0",
      icon: TrendingUp,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Ahorro Mensual",
      value: budget ? `$${parseFloat(budget.savingsAmount as unknown as string).toFixed(2)}/mes` : "$0",
      icon: Target,
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-3 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-white">¡Hola, {user?.name}!</h1>
            <p className="text-sm md:text-base text-slate-400">Aquí está tu resumen financiero personalizado</p>
          </div>
          <Button
            onClick={() => (window.location.href = "/edit-profile")}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700 w-full md:w-auto"
          >
            Editar Perfil
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {kpis.map((kpi, index) => {
            const Icon = kpi.icon;
            return (
              <Card key={index} className="bg-slate-800 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">{kpi.title}</CardTitle>
                  <div className={`${kpi.bgColor} p-2 rounded-lg`}>
                    <Icon className={`w-4 h-4 ${kpi.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{kpi.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts Section */}
        {budget && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* Pie Chart */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Distribución de Presupuesto</CardTitle>
                <CardDescription className="text-slate-400">Modelo 50/30/20 adaptado</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={budgetData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {budgetData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${typeof value === 'number' ? value.toFixed(1) : value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Budget Details */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Detalles del Presupuesto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Gastos Fijos", percentage: budget.fixedExpensesPercentage, amount: budget.fixedExpensesAmount, color: "bg-red-500" },
                  { label: "Gastos Variables", percentage: budget.variableExpensesPercentage, amount: budget.variableExpensesAmount, color: "bg-orange-500" },
                  { label: "Ahorro", percentage: budget.savingsPercentage, amount: budget.savingsAmount, color: "bg-blue-500" },
                  { label: "Inversión", percentage: budget.investmentPercentage, amount: budget.investmentAmount, color: "bg-green-500" },
                  { label: "Pago de Deudas", percentage: budget.debtPaymentPercentage, amount: budget.debtPaymentAmount, color: "bg-purple-500" },
                ].map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">{item.label}</span>
                      <span className="text-white font-semibold">
                        ${parseFloat(item.amount as unknown as string).toFixed(2)} ({parseFloat(item.percentage as unknown as string).toFixed(1)}%)
                      </span>
                    </div>
                    <Progress
                      value={parseFloat(item.percentage as unknown as string)}
                      className="h-2"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Financial Plan */}
        {planQuery.data && (
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Tu Plan Financiero Personalizado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-green-400 mb-2">Situación Actual</h3>
                <p className="text-slate-300">{planQuery.data.currentSituation}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-orange-400 mb-2">Problemas Identificados</h3>
                <p className="text-slate-300 whitespace-pre-wrap">{planQuery.data.problemsIdentified}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-2">Recomendaciones</h3>
                <p className="text-slate-300 whitespace-pre-wrap">{planQuery.data.recommendations}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-purple-400 mb-2">Plan de Acción</h3>
                <p className="text-slate-300 whitespace-pre-wrap">{planQuery.data.actionPlan}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Generate Plan Button */}
        {!planQuery.data && (
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Genera tu Plan Financiero</CardTitle>
              <CardDescription className="text-slate-400">
                Recibe un análisis personalizado con recomendaciones de IA
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => generatePlanMutation.mutate()}
                disabled={generatePlanMutation.isPending}
                className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
              >
                {generatePlanMutation.isPending ? "Generando..." : "Generar Plan Ahora"}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
