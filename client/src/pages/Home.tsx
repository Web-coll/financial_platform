import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Brain,
  PieChart,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";

const featureCards = [
  {
    icon: PieChart,
    title: "Presupuesto Inteligente",
    description:
      "Sistema automático basado en 50/30/20 adaptado a tu situación real",
  },
  {
    icon: Brain,
    title: "Análisis con IA",
    description:
      "Recibe recomendaciones personalizadas basadas en tu perfil financiero",
  },
  {
    icon: Target,
    title: "Metas de Inversión",
    description:
      "Define tus objetivos y visualiza proyecciones a 1, 5 y 10 años",
  },
  {
    icon: BarChart3,
    title: "Dashboard Visual",
    description:
      "Indicadores clave en tiempo real con gráficos claros y modernos",
  },
  {
    icon: TrendingUp,
    title: "Educación Financiera",
    description: "Aprende sobre acciones, ETFs, interés compuesto y más",
  },
  {
    icon: Zap,
    title: "Asistente IA 24/7",
    description:
      "Haz preguntas sobre tu presupuesto y recibe respuestas instantáneas",
  },
];

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="relative min-h-screen overflow-hidden bg-neutral-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(16,185,129,0.22),transparent_30%),radial-gradient(circle_at_85%_10%,rgba(59,130,246,0.2),transparent_34%),radial-gradient(circle_at_50%_90%,rgba(244,63,94,0.08),transparent_30%)]" />

      {isAuthenticated && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed bottom-6 left-6 z-40"
        >
          <Button
            onClick={() => (window.location.href = "/chat")}
            className="h-14 w-14 rounded-2xl border border-white/15 bg-white/10 shadow-[0_18px_45px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-all hover:scale-105 hover:bg-emerald-500"
            title="Chat IA"
          >
            <Brain className="h-6 w-6" />
          </Button>
        </motion.div>
      )}

      <nav className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/70 backdrop-blur-2xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-2 shadow-lg shadow-emerald-500/15">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
            </div>
            <span className="text-lg font-semibold tracking-wide">FinPlan</span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => (window.location.href = "/dashboard")}
              className="rounded-xl bg-white/10 hover:bg-white/20"
            >
              Dashboard
            </Button>
            <Button
              onClick={() => (window.location.href = "/education")}
              className="rounded-xl bg-white/10 hover:bg-white/20"
            >
              Educación
            </Button>
            <span className="hidden text-sm text-zinc-300 md:block">
              Modo demo: {user?.name}
            </span>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        <section className="mx-auto grid w-full max-w-7xl gap-14 px-6 pb-16 pt-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs tracking-wide text-zinc-200">
              Planificación financiera premium con IA
            </div>
            <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
              Diseña tu futuro financiero
              <span className="block bg-gradient-to-r from-emerald-400 via-emerald-300 to-blue-400 bg-clip-text text-transparent">
                con claridad total.
              </span>
            </h1>
            <p className="max-w-2xl text-lg text-zinc-300">
              FinPlan transforma tus datos en decisiones simples: presupuesto
              dinámico, foco en metas y seguimiento visual en tiempo real.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => (window.location.href = "/dashboard")}
                className="group h-12 rounded-xl bg-emerald-500 px-7 text-base hover:bg-emerald-400"
              >
                Ir al dashboard
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                onClick={() => (window.location.href = "/education")}
                className="h-12 rounded-xl border border-white/15 bg-white/5 px-7 text-base hover:bg-white/10"
              >
                Educación
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="space-y-4 rounded-3xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-2xl"
          >
            {[
              {
                metric: "50/30/20",
                text: "Modelo flexible y personalizado",
                tone: "text-emerald-400",
              },
              {
                metric: "100%",
                text: "Lectura financiera asistida por IA",
                tone: "text-blue-400",
              },
              {
                metric: "24/7",
                text: "Soporte educativo permanente",
                tone: "text-rose-400",
              },
            ].map(item => (
              <div
                key={item.metric}
                className="rounded-2xl border border-white/10 bg-black/20 p-5 transition hover:border-white/20 hover:bg-white/5"
              >
                <p className={`text-3xl font-semibold ${item.tone}`}>
                  {item.metric}
                </p>
                <p className="mt-1 text-sm text-zinc-300">{item.text}</p>
              </div>
            ))}
          </motion.div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-6 py-12">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Experiencia centrada en crecimiento
              </h2>
              <p className="mt-2 max-w-2xl text-zinc-400">
                Cada módulo está diseñado para ayudarte a actuar mejor, más
                rápido y con menos fricción.
              </p>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featureCards.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.4, delay: index * 0.04 }}
                  className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-emerald-400/50 hover:bg-white/[0.06]"
                >
                  <div className="mb-5 inline-flex rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-3">
                    <Icon className="h-5 w-5 text-emerald-400" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-zinc-400">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
