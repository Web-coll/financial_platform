import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, TrendingUp, PieChart, Target, ArrowRight } from "lucide-react";

export default function Education() {
  const lessons = [
    {
      id: "stocks",
      title: "¿Qué son las Acciones?",
      icon: TrendingUp,
      content: `Una acción es una parte de la propiedad de una empresa. Cuando compras una acción, te conviertes en propietario de una pequeña parte de esa empresa.

**Ventajas:**
- Potencial de crecimiento a largo plazo
- Dividendos (ganancias compartidas)
- Liquidez (fácil de comprar y vender)

**Riesgos:**
- Volatilidad (el precio fluctúa)
- Pérdida de capital
- Requiere investigación`,
    },
    {
      id: "etf",
      title: "¿Qué son los ETFs?",
      icon: PieChart,
      content: `Un ETF (Exchange-Traded Fund) es un fondo que contiene múltiples acciones o bonos, permitiendo diversificación automática.

**Ventajas:**
- Diversificación inmediata
- Menor riesgo que acciones individuales
- Bajo costo
- Fácil de comprar y vender

**Tipos populares:**
- ETFs de índices (S&P 500, Nasdaq)
- ETFs de sectores
- ETFs internacionales`,
    },
    {
      id: "compound",
      title: "Interés Compuesto",
      icon: Target,
      content: `El interés compuesto es el "interés sobre el interés". Es la fuerza más poderosa en finanzas.

**Fórmula:**
A = P(1 + r/n)^(nt)

**Ejemplo:**
- Inviertes $1,000 a 7% anual
- En 10 años: $1,967
- En 20 años: $3,870
- En 30 años: $7,612

**Lección:** Comenzar temprano multiplica tus ganancias exponencialmente.`,
    },
    {
      id: "strategy",
      title: "Estrategia de Largo Plazo",
      icon: BookOpen,
      content: `La mejor estrategia para principiantes es invertir a largo plazo con consistencia.

**Principios:**
1. **Comienza temprano** - El tiempo es tu mayor aliado
2. **Invierte regularmente** - Dollar-cost averaging reduce riesgo
3. **Diversifica** - No pongas todos los huevos en una canasta
4. **Mantén la calma** - Ignora la volatilidad a corto plazo
5. **Reinvierte ganancias** - Aprovecha el interés compuesto

**Objetivo:** Construir riqueza gradualmente sin estrés.`,
    },
  ];

  const brokers = [
    {
      name: "Interactive Brokers",
      description: "Plataforma profesional con comisiones bajas",
      features: ["Acciones USA", "Opciones", "Futuros", "Criptomonedas"],
      link: "https://www.interactivebrokers.com",
    },
    {
      name: "TD Ameritrade",
      description: "Excelente para principiantes con educación",
      features: ["Acciones USA", "Opciones", "Educación", "Herramientas"],
      link: "https://www.tdameritrade.com",
    },
    {
      name: "Fidelity",
      description: "Confiable y con muchos recursos educativos",
      features: ["Acciones USA", "Fondos", "ETFs", "Asesoría"],
      link: "https://www.fidelity.com",
    },
    {
      name: "Charles Schwab",
      description: "Comisiones cero y excelente servicio",
      features: ["Acciones USA", "Opciones", "ETFs", "Fondos"],
      link: "https://www.schwab.com",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white">Educación Financiera</h1>
          <p className="text-slate-400">Aprende los conceptos fundamentales de inversión</p>
        </div>

        {/* Lessons Tabs */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Conceptos Fundamentales</CardTitle>
            <CardDescription className="text-slate-400">
              Domina los conceptos básicos de inversión
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="stocks" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-slate-700">
                {lessons.map((lesson) => (
                  <TabsTrigger key={lesson.id} value={lesson.id} className="text-slate-300">
                    {lesson.title.split("?")[0]}
                  </TabsTrigger>
                ))}
              </TabsList>

              {lessons.map((lesson) => {
                const Icon = lesson.icon;
                return (
                  <TabsContent key={lesson.id} value={lesson.id} className="space-y-4">
                    <div className="flex items-start gap-4 mt-6">
                      <Icon className="w-12 h-12 text-green-500 flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="text-2xl font-semibold text-white mb-4">{lesson.title}</h3>
                        <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                          {lesson.content}
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                );
              })}
            </Tabs>
          </CardContent>
        </Card>

        {/* Brokers Guide */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Guía de Brokers Internacionales</CardTitle>
            <CardDescription className="text-slate-400">
              Cómo abrir una cuenta para invertir en bolsa de EE.UU.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-400">Pasos para Comenzar:</h3>
              <ol className="space-y-3 text-slate-300">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">
                    1
                  </span>
                  <span>Elige un broker (recomendamos Interactive Brokers o TD Ameritrade)</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">
                    2
                  </span>
                  <span>Crea una cuenta y verifica tu identidad</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">
                    3
                  </span>
                  <span>Deposita dinero (comienza con lo que puedas ahorrar)</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">
                    4
                  </span>
                  <span>Comienza con ETFs de bajo costo (VOO, VTI, VXUS)</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">
                    5
                  </span>
                  <span>Invierte regularmente (mensual es ideal)</span>
                </li>
              </ol>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {brokers.map((broker, index) => (
                <div key={index} className="bg-slate-700 border border-slate-600 rounded-lg p-4 space-y-3">
                  <div>
                    <h4 className="text-lg font-semibold text-white">{broker.name}</h4>
                    <p className="text-sm text-slate-400">{broker.description}</p>
                  </div>
                  <div className="space-y-1">
                    {broker.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                        {feature}
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={() => window.open(broker.link, "_blank")}
                    className="w-full bg-green-600 hover:bg-green-700 text-white text-sm"
                  >
                    Visitar Sitio <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Investment Tips */}
        <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Consejos de Oro para Invertir</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: "Comienza Pequeño",
                description: "No necesitas mucho dinero para comenzar. $100/mes es un excelente inicio.",
              },
              {
                title: "Sé Consistente",
                description: "Invierte regularmente, sin importar el mercado. El tiempo en el mercado vence el timing.",
              },
              {
                title: "Diversifica",
                description: "No pongas todo en una acción. Los ETFs ofrecen diversificación automática.",
              },
              {
                title: "Piensa a Largo Plazo",
                description: "Las inversiones son para 10+ años. Ignora la volatilidad a corto plazo.",
              },
              {
                title: "Aprende Continuamente",
                description: "Lee libros, sigue expertos, toma cursos. La educación es tu mejor inversión.",
              },
              {
                title: "Evita Emociones",
                description: "No vendas por pánico. No compres por FOMO. Mantén la disciplina.",
              },
            ].map((tip, index) => (
              <div key={index} className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <h4 className="text-green-400 font-semibold mb-2">{tip.title}</h4>
                <p className="text-slate-300 text-sm">{tip.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
