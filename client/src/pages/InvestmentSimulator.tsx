import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { DollarSign, TrendingUp } from "lucide-react";

interface SimulationData {
  year: number;
  amount: number;
  invested: number;
  earnings: number;
}

export default function InvestmentSimulator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(500);
  const [annualReturn, setAnnualReturn] = useState(7);
  const [years, setYears] = useState(10);
  const [data, setData] = useState<SimulationData[]>([]);

  const calculateProjection = () => {
    const monthlyRate = annualReturn / 100 / 12;
    const projections: SimulationData[] = [];

    let balance = 0;
    let totalInvested = 0;

    for (let year = 0; year <= years; year++) {
      for (let month = 0; month < 12; month++) {
        balance = balance * (1 + monthlyRate) + monthlyInvestment;
        totalInvested += monthlyInvestment;
      }

      const earnings = balance - totalInvested;
      projections.push({
        year,
        amount: Math.round(balance),
        invested: Math.round(totalInvested),
        earnings: Math.round(earnings),
      });
    }

    setData(projections);
  };

  const finalData = data[data.length - 1];
  const totalEarnings = finalData ? finalData.earnings : 0;
  const totalAmount = finalData ? finalData.amount : 0;
  const totalInvested = finalData ? finalData.invested : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white">Simulador de Crecimiento</h1>
          <p className="text-slate-400">Visualiza cómo crecerá tu dinero con inversiones consistentes</p>
        </div>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Parámetros de Simulación</CardTitle>
            <CardDescription className="text-slate-400">Ajusta los valores para ver proyecciones personalizadas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <Label className="text-white">Inversión Mensual: ${monthlyInvestment}</Label>
                <Slider
                  value={[monthlyInvestment]}
                  onValueChange={(value) => setMonthlyInvestment(value[0])}
                  min={50}
                  max={5000}
                  step={50}
                  className="w-full"
                />
                <div className="flex gap-2">
                  {[100, 250, 500, 1000].map((amount) => (
                    <Button
                      key={amount}
                      onClick={() => setMonthlyInvestment(amount)}
                      variant="outline"
                      className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700 text-sm"
                    >
                      ${amount}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-white">Retorno Anual: {annualReturn}%</Label>
                <Slider
                  value={[annualReturn]}
                  onValueChange={(value) => setAnnualReturn(value[0])}
                  min={1}
                  max={15}
                  step={0.5}
                  className="w-full"
                />
                <div className="flex gap-2">
                  {[5, 7, 10, 12].map((rate) => (
                    <Button
                      key={rate}
                      onClick={() => setAnnualReturn(rate)}
                      variant="outline"
                      className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700 text-sm"
                    >
                      {rate}%
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-white">Período: {years} años</Label>
                <Slider
                  value={[years]}
                  onValueChange={(value) => setYears(value[0])}
                  min={1}
                  max={50}
                  step={1}
                  className="w-full"
                />
                <div className="flex gap-2">
                  {[5, 10, 20, 30].map((year) => (
                    <Button
                      key={year}
                      onClick={() => setYears(year)}
                      variant="outline"
                      className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700 text-sm"
                    >
                      {year}a
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <Button
              onClick={calculateProjection}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg"
            >
              Calcular Proyección
            </Button>
          </CardContent>
        </Card>

        {data.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">Total Invertido</CardTitle>
                  <DollarSign className="w-4 h-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">${totalInvested.toLocaleString()}</div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">Ganancias</CardTitle>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-400">${totalEarnings.toLocaleString()}</div>
                  <p className="text-xs text-slate-400 mt-1">{((totalEarnings / totalInvested) * 100).toFixed(1)}% retorno</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">Total Final</CardTitle>
                  <DollarSign className="w-4 h-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">${totalAmount.toLocaleString()}</div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Crecimiento del Portafolio</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="year" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #475569",
                        borderRadius: "8px",
                      }}
                      formatter={(value) => `$${(value as number).toLocaleString()}`}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={false}
                      name="Total"
                    />
                    <Line
                      type="monotone"
                      dataKey="invested"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={false}
                      name="Invertido"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Proyección Año a Año</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left py-2 px-4 text-slate-300 font-semibold">Año</th>
                        <th className="text-right py-2 px-4 text-slate-300 font-semibold">Total Invertido</th>
                        <th className="text-right py-2 px-4 text-slate-300 font-semibold">Ganancias</th>
                        <th className="text-right py-2 px-4 text-slate-300 font-semibold">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((row, index) => (
                        <tr key={index} className="border-b border-slate-700 hover:bg-slate-700/50">
                          <td className="py-2 px-4 text-slate-300">{row.year}</td>
                          <td className="text-right py-2 px-4 text-slate-300">${row.invested.toLocaleString()}</td>
                          <td className="text-right py-2 px-4 text-green-400">${row.earnings.toLocaleString()}</td>
                          <td className="text-right py-2 px-4 text-white font-semibold">${row.amount.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
