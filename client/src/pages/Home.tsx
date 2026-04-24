import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { TrendingUp, PieChart, Brain, Target, BarChart3, Zap } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-8 h-8 text-green-500" />
            <span className="text-xl font-bold text-white">FinPlan</span>
          </div>
          <div className="flex gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-slate-300 py-2">Hola, {user?.name}</span>
                <div className="flex gap-2">
                  <Button
                    onClick={() => (window.location.href = "/dashboard")}
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    Dashboard
                  </Button>
                  <Button
                    onClick={() => (window.location.href = "/education")}
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    Educacion
                  </Button>
                  <Button
                    onClick={() => (window.location.href = "/chat")}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Chat IA
                  </Button>
                </div>
              </>
            ) : (
              <Button
                onClick={() => (window.location.href = getLoginUrl())}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Iniciar Sesión
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 space-y-8">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
            Toma Control de tu Dinero
            <span className="text-green-500"> Hoy</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl">
            FinPlan te ayuda a entender tu situación financiera, crear presupuestos inteligentes, 
            y comenzar a invertir desde cero. Todo con recomendaciones personalizadas impulsadas por IA.
          </p>
          <div className="flex gap-4 pt-4">
            {!isAuthenticated ? (
              <>
                <Button
                  onClick={() => (window.location.href = getLoginUrl())}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg"
                >
                  Comenzar Gratis
                </Button>
                <Button
                  onClick={() => (window.location.href = "/education")}
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700 px-8 py-6 text-lg"
                >
                  Ver Demo
                </Button>
              </>
            ) : (
              <Button
                onClick={() => (window.location.href = "/dashboard")}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg"
              >
                Ir a tu Dashboard
              </Button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-12">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <div className="text-3xl font-bold text-green-500">50/30/20</div>
            <p className="text-slate-400 mt-2">Presupuesto adaptado a tu perfil real</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <div className="text-3xl font-bold text-blue-500">100%</div>
            <p className="text-slate-400 mt-2">Análisis personalizado con IA</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <div className="text-3xl font-bold text-purple-500">∞</div>
            <p className="text-slate-400 mt-2">Educación financiera ilimitada</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-800/50 border-y border-slate-700 py-20">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-white">Características Principales</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Todo lo que necesitas para tomar control de tu dinero
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: PieChart,
                title: "Presupuesto Inteligente",
                description: "Sistema automático basado en 50/30/20 adaptado a tu situación real",
              },
              {
                icon: Brain,
                title: "Análisis con IA",
                description: "Recibe recomendaciones personalizadas basadas en tu perfil financiero",
              },
              {
                icon: Target,
                title: "Metas de Inversión",
                description: "Define tus objetivos y visualiza proyecciones a 1, 5 y 10 años",
              },
              {
                icon: BarChart3,
                title: "Dashboard Visual",
                description: "Indicadores clave en tiempo real con gráficos claros y modernos",
              },
              {
                icon: TrendingUp,
                title: "Educación Financiera",
                description: "Aprende sobre acciones, ETFs, interés compuesto y más",
              },
              {
                icon: Zap,
                title: "Asistente IA 24/7",
                description: "Haz preguntas sobre tu presupuesto y recibe respuestas instantáneas",
              },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-slate-900 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition">
                  <Icon className="w-12 h-12 text-green-500 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-6 py-20 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-white">Cómo Funciona</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Tres pasos simples para tomar control de tu dinero
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: "1",
              title: "Completa tu Perfil",
              description: "Responde preguntas sobre tu ingreso, gastos, deudas y ahorros en 5 minutos",
            },
            {
              step: "2",
              title: "Recibe tu Presupuesto",
              description: "FinPlan calcula automáticamente tu presupuesto personalizado basado en 50/30/20",
            },
            {
              step: "3",
              title: "Comienza a Invertir",
              description: "Accede a educación financiera, simuladores y recomendaciones de IA",
            },
          ].map((item, index) => (
            <div key={index} className="relative">
              <div className="bg-gradient-to-br from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-lg p-8">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-white mt-4 mb-2">{item.title}</h3>
                <p className="text-slate-400">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-y border-slate-700 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-3xl font-bold text-white">
            ¿Listo para tomar control de tu dinero?
          </h2>
          <p className="text-slate-400 text-lg">
            Únete a miles de usuarios que ya están transformando su vida financiera
          </p>
          {!isAuthenticated ? (
            <Button
              onClick={() => (window.location.href = getLoginUrl())}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg"
            >
              Comenzar Ahora
            </Button>
          ) : (
            <Button
              onClick={() => (window.location.href = "/dashboard")}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg"
            >
              Ir a tu Dashboard
            </Button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-slate-400">
          <p>© 2026 FinPlan. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
