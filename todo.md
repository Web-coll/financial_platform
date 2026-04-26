# FinPlan - TODO

## Fase 1: Arquitectura de Datos
- [x] Diseñar schema de base de datos para perfiles financieros
- [x] Crear tablas: financial_profiles, budget_allocations, investment_goals, transactions, financial_plans
- [x] Implementar migraciones SQL

## Fase 2: Onboarding Inteligente
- [x] Crear componente de onboarding paso a paso
- [x] Implementar formulario de recopilación de datos (ingresos, tipo de ingreso, gastos, deudas, ahorros)
- [x] Crear lógica de generación automática de perfil financiero
- [x] Validar datos y guardar perfil en base de datos

## Fase 3: Dashboard y Presupuesto Automático
- [x] Diseñar layout de dashboard con sidebar
- [x] Implementar cálculo automático del modelo 50/30/20 adaptado
- [x] Crear componentes visuales: barras de progreso, gráficos circulares, indicadores
- [x] Mostrar dinero disponible, % gastado, % ahorrado, capacidad de inversión
- [x] Integrar datos del usuario con el dashboard

## Fase 4: Plan Financiero Personalizado con IA
- [x] Crear procedimiento tRPC para generar plan financiero con LLM
- [x] Implementar análisis de situación actual del usuario
- [x] Generar recomendaciones personalizadas basadas en perfil
- [x] Crear componente UI para mostrar plan financiero
- [x] Guardar planes generados en base de datos

## Fase 5: Módulo Educativo e Inversión
- [x] Crear sección educativa con conceptos básicos (acciones, ETFs)
- [x] Implementar contenido sobre estrategia de largo plazo e interés compuesto
- [x] Crear guía práctica para abrir cuenta en brokers internacionales
- [x] Implementar simulador de crecimiento de inversión
- [x] Crear gráficos interactivos para proyecciones a 1, 5, 10 años

## Fase 6: Chat/Asistente LLM
- [x] Integrar componente de chat con LLM
- [x] Implementar respuestas a preguntas sobre presupuesto e inversiones
- [x] Crear recomendaciones adaptativas basadas en perfil financiero
- [x] Almacenar historial de conversaciones

## Fase 7: Estética y Pulido
- [x] Implementar tema oscuro con acentos verdes y azules
- [x] Diseñar colores y tipografía para app bancaria moderna
- [x] Aplicar estilos consistentes en toda la aplicación
- [x] Optimizar responsividad para móviles
- [x] Revisar accesibilidad y contraste de colores

## Fase 8: Testing y Entrega
- [x] Escribir tests vitest para funcionalidades críticas
- [x] Realizar testing manual de flujos completos
- [x] Crear checkpoint final
- [x] Entregar aplicación funcional al usuario

## Bugs Corregidos
- [x] Botón "Generar Plan Financiero" no funcionaba - conectado a mutación correcta
- [x] Botón "Ver Demo" no hacía nada - agregado onClick para navegar a Educación
- [x] No permitía ingresar 0 en ahorros - corregida validación para permitir cero
- [x] No hay opción para cambiar ingreso variable - agregada descripción dinámica y tip de ayuda
- [x] No se podía modificar ingreso mensual después del onboarding - creada página de Editar Perfil
