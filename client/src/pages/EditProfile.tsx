import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";

export default function EditProfile() {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const profileQuery = trpc.financial.getProfile.useQuery(undefined, {
    enabled: !!user,
  });

  const [formData, setFormData] = useState({
    monthlyIncome: profileQuery.data?.monthlyIncome ? parseFloat(profileQuery.data.monthlyIncome as unknown as string) : 0,
    incomeType: profileQuery.data?.incomeType || "fixed" as "fixed" | "variable",
    hasFixedExpenses: profileQuery.data?.hasFixedExpenses ? true : false,
    fixedExpensesAmount: profileQuery.data?.fixedExpensesAmount ? parseFloat(profileQuery.data.fixedExpensesAmount as unknown as string) : 0,
    hasDebts: profileQuery.data?.hasDebts ? true : false,
    totalDebts: profileQuery.data?.totalDebts ? parseFloat(profileQuery.data.totalDebts as unknown as string) : 0,
    currentSavings: profileQuery.data?.currentSavings ? parseFloat(profileQuery.data.currentSavings as unknown as string) : 0,
    riskProfile: profileQuery.data?.riskProfile || "moderate" as "conservative" | "moderate" | "aggressive",
  });

  const utils = trpc.useUtils();
  const updateMutation = trpc.financial.completeOnboarding.useMutation({
    onSuccess: () => {
      utils.financial.getProfile.invalidate();
      utils.financial.getBudget.invalidate();
      utils.financial.getFinancialPlan.invalidate();
      toast.success("Perfil actualizado exitosamente");
      setIsSaving(false);
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
      setIsSaving(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.monthlyIncome || formData.monthlyIncome <= 0) {
      toast.error("Por favor, ingresa un ingreso mensual válido");
      return;
    }

    if (formData.hasFixedExpenses && (!formData.fixedExpensesAmount || formData.fixedExpensesAmount < 0)) {
      toast.error("Por favor, ingresa el monto de gastos fijos");
      return;
    }

    if (formData.hasDebts && (!formData.totalDebts || formData.totalDebts < 0)) {
      toast.error("Por favor, ingresa el monto total de deudas");
      return;
    }

    setIsSaving(true);
    updateMutation.mutate({
      monthlyIncome: formData.monthlyIncome,
      incomeType: formData.incomeType,
      hasFixedExpenses: formData.hasFixedExpenses,
      fixedExpensesAmount: formData.fixedExpensesAmount,
      hasDebts: formData.hasDebts,
      totalDebts: formData.totalDebts,
      currentSavings: formData.currentSavings,
      riskProfile: formData.riskProfile,
      investmentExperience: profileQuery.data?.investmentExperience || "beginner",
    });
  };

  if (profileQuery.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <Button
            onClick={() => (window.location.href = "/dashboard")}
            variant="ghost"
            className="text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">Editar Perfil Financiero</h1>
            <p className="text-slate-400">Actualiza tu información financiera</p>
          </div>
        </div>

        {/* Form Card */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Tu Información Financiera</CardTitle>
            <CardDescription className="text-slate-400">
              Actualiza tus datos para recalcular tu presupuesto automáticamente
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Monthly Income */}
              <div className="space-y-2">
                <Label htmlFor="income" className="text-white">
                  Ingreso Mensual
                </Label>
                <p className="text-sm text-slate-400">
                  {formData.incomeType === "variable" 
                    ? "Ingresa tu ingreso promedio mensual" 
                    : "Ingresa tu sueldo mensual"}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">$</span>
                  <Input
                    id="income"
                    type="number"
                    placeholder="0.00"
                    value={formData.monthlyIncome || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, monthlyIncome: parseFloat(e.target.value) || 0 })
                    }
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* Income Type */}
              <div className="space-y-3">
                <Label className="text-white">Tipo de Ingreso</Label>
                <RadioGroup value={formData.incomeType} onValueChange={(value) =>
                  setFormData({ ...formData, incomeType: value as "fixed" | "variable" })
                }>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fixed" id="fixed" />
                    <Label htmlFor="fixed" className="text-slate-300 cursor-pointer">
                      Fijo (sueldo regular)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="variable" id="variable" />
                    <Label htmlFor="variable" className="text-slate-300 cursor-pointer">
                      Variable (freelance, negocios)
                    </Label>
                  </div>
                </RadioGroup>
                {formData.incomeType === "variable" && (
                  <p className="text-xs text-slate-400 mt-2">
                    💡 Tip: Si tu ingreso es variable, usa un promedio conservador para presupuestar de forma segura.
                  </p>
                )}
              </div>

              {/* Fixed Expenses */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasFixed"
                    checked={formData.hasFixedExpenses}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, hasFixedExpenses: checked as boolean })
                    }
                  />
                  <Label htmlFor="hasFixed" className="text-slate-300 cursor-pointer">
                    Tengo gastos fijos mensuales
                  </Label>
                </div>

                {formData.hasFixedExpenses && (
                  <div className="space-y-2 ml-6">
                    <Label htmlFor="fixedAmount" className="text-white">
                      Monto de Gastos Fijos (alquiler, servicios, etc.)
                    </Label>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">$</span>
                      <Input
                        id="fixedAmount"
                        type="number"
                        placeholder="0.00"
                        value={formData.fixedExpensesAmount || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, fixedExpensesAmount: parseFloat(e.target.value) || 0 })
                        }
                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Debts */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasDebts"
                    checked={formData.hasDebts}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, hasDebts: checked as boolean })
                    }
                  />
                  <Label htmlFor="hasDebts" className="text-slate-300 cursor-pointer">
                    Tengo deudas activas
                  </Label>
                </div>

                {formData.hasDebts && (
                  <div className="space-y-2 ml-6">
                    <Label htmlFor="debts" className="text-white">
                      Monto Total de Deudas
                    </Label>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">$</span>
                      <Input
                        id="debts"
                        type="number"
                        placeholder="0.00"
                        value={formData.totalDebts || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, totalDebts: parseFloat(e.target.value) || 0 })
                        }
                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Current Savings */}
              <div className="space-y-2">
                <Label htmlFor="savings" className="text-white">
                  Ahorros Actuales
                </Label>
                <p className="text-sm text-slate-400">
                  Si no tienes ahorros aún, puedes ingresar 0
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">$</span>
                  <Input
                    id="savings"
                    type="number"
                    placeholder="0.00"
                    min="0"
                    value={formData.currentSavings !== undefined ? formData.currentSavings : ""}
                    onChange={(e) =>
                      setFormData({ ...formData, currentSavings: parseFloat(e.target.value) || 0 })
                    }
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* Risk Profile */}
              <div className="space-y-3">
                <Label className="text-white">Perfil de Riesgo de Inversión</Label>
                <RadioGroup value={formData.riskProfile} onValueChange={(value) =>
                  setFormData({ ...formData, riskProfile: value as "conservative" | "moderate" | "aggressive" })
                }>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="conservative" id="conservative" />
                    <Label htmlFor="conservative" className="text-slate-300 cursor-pointer">
                      Conservador (bajo riesgo, retornos estables)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="moderate" id="moderate" />
                    <Label htmlFor="moderate" className="text-slate-300 cursor-pointer">
                      Moderado (balance entre riesgo y retorno)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="aggressive" id="aggressive" />
                    <Label htmlFor="aggressive" className="text-slate-300 cursor-pointer">
                      Agresivo (alto riesgo, alto potencial de retorno)
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-6">
                <Button
                  type="button"
                  onClick={() => (window.location.href = "/dashboard")}
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="bg-green-600 hover:bg-green-700 text-white ml-auto"
                >
                  {isSaving ? "Guardando..." : "Guardar Cambios"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
