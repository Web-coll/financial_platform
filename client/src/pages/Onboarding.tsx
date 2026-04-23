import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { toast } from "sonner";

type OnboardingStep = 1 | 2 | 3 | 4 | 5;

interface OnboardingData {
  monthlyIncome: number;
  incomeType: "fixed" | "variable";
  hasFixedExpenses: boolean;
  fixedExpensesAmount: number;
  hasDebts: boolean;
  totalDebts: number;
  currentSavings: number;
  riskProfile: "conservative" | "moderate" | "aggressive";
  investmentExperience: "beginner" | "intermediate" | "advanced";
}

export default function Onboarding() {
  const [, navigate] = useLocation();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(1);
  const [data, setData] = useState<Partial<OnboardingData>>({
    incomeType: "fixed",
    hasFixedExpenses: false,
    hasDebts: false,
    riskProfile: "moderate",
    investmentExperience: "beginner",
  });

  const completeOnboarding = trpc.financial.completeOnboarding.useMutation({
    onSuccess: () => {
      toast.success("¡Perfil financiero creado exitosamente!");
      window.location.href = "/dashboard";
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep((currentStep + 1) as OnboardingStep);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as OnboardingStep);
    }
  };

  const handleSubmit = async () => {
    if (!data.monthlyIncome || data.monthlyIncome <= 0) {
      toast.error("Por favor, ingresa un ingreso mensual válido");
      return;
    }

    if (data.hasFixedExpenses && (!data.fixedExpensesAmount || data.fixedExpensesAmount < 0)) {
      toast.error("Por favor, ingresa el monto de gastos fijos");
      return;
    }

    if (data.hasDebts && (!data.totalDebts || data.totalDebts < 0)) {
      toast.error("Por favor, ingresa el monto total de deudas");
      return;
    }

    if (data.currentSavings === undefined || data.currentSavings < 0) {
      toast.error("Por favor, ingresa tus ahorros actuales");
      return;
    }

    completeOnboarding.mutate({
      monthlyIncome: data.monthlyIncome,
      incomeType: data.incomeType || "fixed",
      hasFixedExpenses: data.hasFixedExpenses || false,
      fixedExpensesAmount: data.fixedExpensesAmount,
      hasDebts: data.hasDebts || false,
      totalDebts: data.totalDebts,
      currentSavings: data.currentSavings,
      riskProfile: data.riskProfile,
      investmentExperience: data.investmentExperience,
    });
  };

  const progressPercentage = (currentStep / 5) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-slate-800 border-slate-700">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl text-white">Crea tu Perfil Financiero</CardTitle>
          <CardDescription className="text-slate-400">
            Paso {currentStep} de 5 - Cuéntanos sobre tu situación financiera
          </CardDescription>
          <Progress value={progressPercentage} className="mt-4" />
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Monthly Income */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="income" className="text-white">
                  ¿Cuál es tu ingreso mensual?
                </Label>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">$</span>
                  <Input
                    id="income"
                    type="number"
                    placeholder="0.00"
                    value={data.monthlyIncome || ""}
                    onChange={(e) =>
                      setData({ ...data, monthlyIncome: parseFloat(e.target.value) || 0 })
                    }
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-white">¿Qué tipo de ingreso es?</Label>
                <RadioGroup value={data.incomeType} onValueChange={(value) =>
                  setData({ ...data, incomeType: value as "fixed" | "variable" })
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
              </div>
            </div>
          )}

          {/* Step 2: Fixed Expenses */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="space-y-3">
                <Label className="text-white">¿Tienes gastos fijos mensuales?</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasFixed"
                    checked={data.hasFixedExpenses || false}
                    onCheckedChange={(checked) =>
                      setData({ ...data, hasFixedExpenses: checked as boolean })
                    }
                  />
                  <Label htmlFor="hasFixed" className="text-slate-300 cursor-pointer">
                    Sí, tengo gastos fijos
                  </Label>
                </div>
              </div>

              {data.hasFixedExpenses && (
                <div className="space-y-2">
                  <Label htmlFor="fixedAmount" className="text-white">
                    ¿Cuál es el monto de tus gastos fijos? (alquiler, servicios, etc.)
                  </Label>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">$</span>
                    <Input
                      id="fixedAmount"
                      type="number"
                      placeholder="0.00"
                      value={data.fixedExpensesAmount || ""}
                      onChange={(e) =>
                        setData({ ...data, fixedExpensesAmount: parseFloat(e.target.value) || 0 })
                      }
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Debts */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="space-y-3">
                <Label className="text-white">¿Tienes deudas activas?</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasDebts"
                    checked={data.hasDebts || false}
                    onCheckedChange={(checked) =>
                      setData({ ...data, hasDebts: checked as boolean })
                    }
                  />
                  <Label htmlFor="hasDebts" className="text-slate-300 cursor-pointer">
                    Sí, tengo deudas
                  </Label>
                </div>
              </div>

              {data.hasDebts && (
                <div className="space-y-2">
                  <Label htmlFor="debts" className="text-white">
                    ¿Cuál es el monto total de tus deudas?
                  </Label>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">$</span>
                    <Input
                      id="debts"
                      type="number"
                      placeholder="0.00"
                      value={data.totalDebts || ""}
                      onChange={(e) =>
                        setData({ ...data, totalDebts: parseFloat(e.target.value) || 0 })
                      }
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Savings */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="savings" className="text-white">
                  ¿Cuánto tienes ahorrado actualmente?
                </Label>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">$</span>
                  <Input
                    id="savings"
                    type="number"
                    placeholder="0.00"
                    value={data.currentSavings || ""}
                    onChange={(e) =>
                      setData({ ...data, currentSavings: parseFloat(e.target.value) || 0 })
                    }
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Risk Profile */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div className="space-y-3">
                <Label className="text-white">¿Cuál es tu perfil de riesgo de inversión?</Label>
                <RadioGroup value={data.riskProfile} onValueChange={(value) =>
                  setData({ ...data, riskProfile: value as "conservative" | "moderate" | "aggressive" })
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

              <div className="space-y-3">
                <Label className="text-white">¿Cuál es tu experiencia en inversión?</Label>
                <RadioGroup value={data.investmentExperience} onValueChange={(value) =>
                  setData({ ...data, investmentExperience: value as "beginner" | "intermediate" | "advanced" })
                }>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="beginner" id="beginner" />
                    <Label htmlFor="beginner" className="text-slate-300 cursor-pointer">
                      Principiante (sin experiencia)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="intermediate" id="intermediate" />
                    <Label htmlFor="intermediate" className="text-slate-300 cursor-pointer">
                      Intermedio (algo de experiencia)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="advanced" id="advanced" />
                    <Label htmlFor="advanced" className="text-slate-300 cursor-pointer">
                      Avanzado (experiencia significativa)
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 justify-between pt-6">
            <Button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Anterior
            </Button>

            {currentStep < 5 ? (
              <Button
                onClick={handleNext}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Siguiente
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={completeOnboarding.isPending}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {completeOnboarding.isPending ? "Creando perfil..." : "Completar"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
