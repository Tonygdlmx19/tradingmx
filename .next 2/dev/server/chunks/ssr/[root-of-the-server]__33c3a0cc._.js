module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/src/app/components/ThemeProvider.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeProvider",
    ()=>ThemeProvider,
    "useTheme",
    ()=>useTheme
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
const ThemeContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function useTheme() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(ThemeContext);
    if (context === undefined) {
        // Valor por defecto si no hay provider
        return {
            isDark: false,
            toggleTheme: ()=>{}
        };
    }
    return context;
}
function ThemeProvider({ children }) {
    const [isDark, setIsDark] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) return false;
        //TURBOPACK unreachable
        ;
        // Leer preferencia guardada
        const saved = undefined;
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }, [
        isDark
    ]);
    const toggleTheme = ()=>{
        setIsDark((prev)=>!prev);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ThemeContext.Provider, {
        value: {
            isDark,
            toggleTheme
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/app/components/ThemeProvider.jsx",
        lineNumber: 38,
        columnNumber: 7
    }, this);
}
}),
"[project]/src/app/translations.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "translations",
    ()=>translations
]);
const translations = {
    es: {
        // Header
        header: {
            greeting: 'Hola',
            settings: 'Ajustes',
            fundingSimulator: 'Simulador de Fondeo',
            economicCalendar: 'Calendario',
            admin: 'Admin',
            logout: 'Salir'
        },
        // Stats Cards
        stats: {
            balance: 'Balance',
            periodPnL: 'P&L del Periodo',
            winRate: 'Win Rate',
            maxDrawdown: 'Drawdown Máx',
            profitFactor: 'Profit Factor',
            trades: 'trades'
        },
        // Advanced Stats
        advancedStats: {
            title: 'Métricas Avanzadas',
            accountGrowth: 'Crecimiento de Cuenta',
            capital: 'Capital',
            avgWin: 'Prom. Ganancia',
            avgLoss: 'Prom. Pérdida',
            bestStreak: 'Mejor Racha',
            expectancy: 'Expectativa',
            bestTrade: 'Mejor Trade',
            worstTrade: 'Peor Trade',
            perTrade: 'por operación',
            wins: 'wins',
            distribution: 'Distribución',
            current: 'Actual',
            losing: 'Perdiendo'
        },
        // View Selector
        viewSelector: {
            table: 'Tabla',
            calendar: 'Calendario',
            global: 'Global',
            monthly: 'Mensual',
            operations: 'operaciones',
            operation: 'operación'
        },
        // Trade Form
        tradeForm: {
            title: 'Registrar Operación',
            result: 'Resultado',
            win: 'Ganancia',
            loss: 'Pérdida',
            amount: 'Monto',
            asset: 'Activo',
            direction: 'Dirección',
            lots: 'Lotes',
            entry: 'Entrada',
            exit: 'Salida',
            emotion: 'Emoción',
            emotions: {
                confident: 'Confiado',
                neutral: 'Neutral',
                fearful: 'Con miedo',
                anxious: 'Ansioso',
                frustrated: 'Frustrado',
                euphoric: 'Eufórico',
                revenge: 'Revenge'
            },
            followedPlan: '¿Seguí mi plan?',
            respectedRisk: '¿Respeté mi riesgo?',
            notes: 'Notas',
            notesPlaceholder: 'Observaciones del trade...',
            screenshot: 'Screenshot',
            save: 'Guardar Trade',
            saving: 'Guardando...',
            riskCalculator: 'Calculadora de Riesgo'
        },
        // Charts
        charts: {
            equityCurve: 'Curva de Capital',
            drawdown: 'Drawdown',
            noData: 'Registra trades para ver la gráfica'
        },
        // Calendar View
        calendarView: {
            mon: 'Lun',
            tue: 'Mar',
            wed: 'Mié',
            thu: 'Jue',
            fri: 'Vie',
            sat: 'Sáb',
            sun: 'Dom',
            tradesOf: 'Trades del',
            noTrades: 'No hay trades este día',
            clickDay: 'Haz clic en un día con trades para ver detalles'
        },
        // Trades Table
        tradesTable: {
            title: 'Historial de Operaciones',
            date: 'Fecha',
            asset: 'Activo',
            direction: 'Dir',
            result: 'Resultado',
            emotion: 'Emoción',
            noTrades: 'No hay operaciones registradas',
            startRecording: 'Comienza a registrar tus trades'
        },
        // Settings Modal
        settings: {
            title: 'Ajustes',
            personalization: 'Personalización',
            traderName: 'Tu nombre de trader',
            traderNamePlaceholder: 'Ej: Carlos, El Trader, etc.',
            motivationalPhrase: 'Frase motivadora',
            phrasePlaceholder: 'Tu frase para mantenerte enfocado...',
            suggestedPhrases: 'Frases sugeridas (toca para seleccionar):',
            initialCapital: 'Capital Inicial',
            dailyGoal: 'Meta Diaria',
            myAssets: 'Mis Activos',
            assetsDescription: 'Agrega los pares o activos que operas frecuentemente',
            searchAsset: 'Escribe o busca un activo...',
            noAssets: 'No has agregado activos aún',
            setupRules: 'Reglas de Setup',
            rulesDescription: 'Define tus criterios para tomar un trade. Se usarán como checklist antes de operar.',
            rulePlaceholder: 'Ej: Confluencia de soportes...',
            noRules: 'No has agregado reglas de setup aún',
            viewTour: 'Ver tour de la app',
            save: 'Guardar Configuración'
        },
        // Onboarding Tour
        tour: {
            welcome: {
                title: '¡Bienvenido a Trading Journal PRO!',
                description: 'Te mostraremos las funciones principales para que le saques el máximo provecho a tu journal. ¡Empecemos!'
            },
            settings: {
                title: 'Configuración',
                description: 'Aquí puedes personalizar tu journal: agrega activos, crea tu checklist de setup, define tu capital inicial y tu meta diaria.'
            },
            funding: {
                title: 'Simulador de Fondeo',
                description: 'Practica con reglas reales de empresas de fondeo como FTMO. Simula tu challenge antes de arriesgar dinero real.'
            },
            calendar: {
                title: 'Calendario Económico',
                description: 'Consulta los eventos económicos importantes del día. Nunca te pierdas un NFP, FOMC o dato de inflación.'
            },
            stats: {
                title: 'Estadísticas Principales',
                description: 'Tu balance actual, P&L del periodo, win rate, drawdown máximo y profit factor. Las métricas clave de un vistazo.'
            },
            advancedStats: {
                title: 'Métricas Avanzadas',
                description: 'Análisis detallado: mejor/peor trade, promedio de ganancias y pérdidas, racha ganadora y expectativa.'
            },
            charts: {
                title: 'Gráficas de Rendimiento',
                description: 'Visualiza tu curva de equity y drawdown. Identifica patrones en tu operativa.'
            },
            viewSelector: {
                title: 'Vista del Historial',
                description: 'Cambia entre vista de tabla o calendario. Filtra por mes o año para analizar periodos específicos.'
            },
            tradeForm: {
                title: 'Registra tus Trades',
                description: 'Usa este formulario para registrar cada operación con resultado, emoción y notas.'
            },
            complete: {
                title: '¡Listo para empezar!',
                description: 'Ya conoces las funciones principales. La consistencia en el registro es clave para mejorar. ¡Éxito en tu trading!'
            },
            step: 'Paso',
            of: 'de',
            skip: 'Omitir',
            next: 'Siguiente',
            finish: 'Finalizar'
        },
        // Trial Alert
        trialAlert: {
            title: 'Tu prueba está por terminar',
            daysLeft: 'días restantes',
            dayLeft: 'día restante',
            description: 'Adquiere tu licencia para seguir usando todas las funciones.',
            selectPlan: 'Selecciona tu plan:',
            month: 'Mes',
            months: 'Meses',
            year: 'Año',
            lifetime: 'De por vida',
            popular: 'Popular',
            subscribe: 'Suscribirse',
            maybeLater: 'Quizás después'
        },
        // Months
        months: {
            january: 'Enero',
            february: 'Febrero',
            march: 'Marzo',
            april: 'Abril',
            may: 'Mayo',
            june: 'Junio',
            july: 'Julio',
            august: 'Agosto',
            september: 'Septiembre',
            october: 'Octubre',
            november: 'Noviembre',
            december: 'Diciembre'
        },
        monthsShort: [
            'Ene',
            'Feb',
            'Mar',
            'Abr',
            'May',
            'Jun',
            'Jul',
            'Ago',
            'Sep',
            'Oct',
            'Nov',
            'Dic'
        ],
        monthsFull: [
            'Enero',
            'Febrero',
            'Marzo',
            'Abril',
            'Mayo',
            'Junio',
            'Julio',
            'Agosto',
            'Septiembre',
            'Octubre',
            'Noviembre',
            'Diciembre'
        ],
        daysShort: [
            'Lun',
            'Mar',
            'Mié',
            'Jue',
            'Vie',
            'Sáb',
            'Dom'
        ],
        // Common
        common: {
            loading: 'Cargando...',
            error: 'Error',
            success: 'Éxito',
            cancel: 'Cancelar',
            confirm: 'Confirmar',
            delete: 'Eliminar',
            edit: 'Editar',
            close: 'Cerrar',
            back: 'Atrás'
        }
    },
    en: {
        // Header
        header: {
            greeting: 'Hello',
            settings: 'Settings',
            fundingSimulator: 'Funding Simulator',
            economicCalendar: 'Calendar',
            admin: 'Admin',
            logout: 'Logout'
        },
        // Stats Cards
        stats: {
            balance: 'Balance',
            periodPnL: 'Period P&L',
            winRate: 'Win Rate',
            maxDrawdown: 'Max Drawdown',
            profitFactor: 'Profit Factor',
            trades: 'trades'
        },
        // Advanced Stats
        advancedStats: {
            title: 'Advanced Metrics',
            accountGrowth: 'Account Growth',
            capital: 'Capital',
            avgWin: 'Avg. Win',
            avgLoss: 'Avg. Loss',
            bestStreak: 'Best Streak',
            expectancy: 'Expectancy',
            bestTrade: 'Best Trade',
            worstTrade: 'Worst Trade',
            perTrade: 'per trade',
            wins: 'wins',
            distribution: 'Distribution',
            current: 'Current',
            losing: 'Losing'
        },
        // View Selector
        viewSelector: {
            table: 'Table',
            calendar: 'Calendar',
            global: 'Global',
            monthly: 'Monthly',
            operations: 'operations',
            operation: 'operation'
        },
        // Trade Form
        tradeForm: {
            title: 'Record Trade',
            result: 'Result',
            win: 'Win',
            loss: 'Loss',
            amount: 'Amount',
            asset: 'Asset',
            direction: 'Direction',
            lots: 'Lots',
            entry: 'Entry',
            exit: 'Exit',
            emotion: 'Emotion',
            emotions: {
                confident: 'Confident',
                neutral: 'Neutral',
                fearful: 'Fearful',
                anxious: 'Anxious',
                frustrated: 'Frustrated',
                euphoric: 'Euphoric',
                revenge: 'Revenge'
            },
            followedPlan: 'Did I follow my plan?',
            respectedRisk: 'Did I respect my risk?',
            notes: 'Notes',
            notesPlaceholder: 'Trade observations...',
            screenshot: 'Screenshot',
            save: 'Save Trade',
            saving: 'Saving...',
            riskCalculator: 'Risk Calculator'
        },
        // Charts
        charts: {
            equityCurve: 'Equity Curve',
            drawdown: 'Drawdown',
            noData: 'Record trades to see the chart'
        },
        // Calendar View
        calendarView: {
            mon: 'Mon',
            tue: 'Tue',
            wed: 'Wed',
            thu: 'Thu',
            fri: 'Fri',
            sat: 'Sat',
            sun: 'Sun',
            tradesOf: 'Trades on',
            noTrades: 'No trades this day',
            clickDay: 'Click on a day with trades to see details'
        },
        // Trades Table
        tradesTable: {
            title: 'Trade History',
            date: 'Date',
            asset: 'Asset',
            direction: 'Dir',
            result: 'Result',
            emotion: 'Emotion',
            noTrades: 'No trades recorded',
            startRecording: 'Start recording your trades'
        },
        // Settings Modal
        settings: {
            title: 'Settings',
            personalization: 'Personalization',
            traderName: 'Your trader name',
            traderNamePlaceholder: 'Ex: John, The Trader, etc.',
            motivationalPhrase: 'Motivational phrase',
            phrasePlaceholder: 'Your phrase to stay focused...',
            suggestedPhrases: 'Suggested phrases (tap to select):',
            initialCapital: 'Initial Capital',
            dailyGoal: 'Daily Goal',
            myAssets: 'My Assets',
            assetsDescription: 'Add the pairs or assets you trade frequently',
            searchAsset: 'Type or search for an asset...',
            noAssets: 'You haven\'t added any assets yet',
            setupRules: 'Setup Rules',
            rulesDescription: 'Define your criteria for taking a trade. They\'ll be used as a checklist before trading.',
            rulePlaceholder: 'Ex: Support confluence...',
            noRules: 'You haven\'t added any setup rules yet',
            viewTour: 'View app tour',
            save: 'Save Settings'
        },
        // Onboarding Tour
        tour: {
            welcome: {
                title: 'Welcome to Trading Journal PRO!',
                description: 'We\'ll show you the main features to get the most out of your journal. Let\'s start!'
            },
            settings: {
                title: 'Settings',
                description: 'Here you can customize your journal: add assets, create your setup checklist, set your initial capital and daily goal.'
            },
            funding: {
                title: 'Funding Simulator',
                description: 'Practice with real rules from funding companies like FTMO. Simulate your challenge before risking real money.'
            },
            calendar: {
                title: 'Economic Calendar',
                description: 'Check important economic events of the day. Never miss an NFP, FOMC or inflation data.'
            },
            stats: {
                title: 'Main Statistics',
                description: 'Your current balance, period P&L, win rate, max drawdown and profit factor. Key metrics at a glance.'
            },
            advancedStats: {
                title: 'Advanced Metrics',
                description: 'Detailed analysis: best/worst trade, average wins and losses, winning streak and expectancy.'
            },
            charts: {
                title: 'Performance Charts',
                description: 'Visualize your equity curve and drawdown. Identify patterns in your trading.'
            },
            viewSelector: {
                title: 'History View',
                description: 'Switch between table or calendar view. Filter by month or year to analyze specific periods.'
            },
            tradeForm: {
                title: 'Record Your Trades',
                description: 'Use this form to record each trade with result, emotion and notes.'
            },
            complete: {
                title: 'Ready to start!',
                description: 'You now know the main features. Consistency in recording is key to improving. Good luck with your trading!'
            },
            step: 'Step',
            of: 'of',
            skip: 'Skip',
            next: 'Next',
            finish: 'Finish'
        },
        // Trial Alert
        trialAlert: {
            title: 'Your trial is ending soon',
            daysLeft: 'days left',
            dayLeft: 'day left',
            description: 'Get your license to keep using all features.',
            selectPlan: 'Select your plan:',
            month: 'Month',
            months: 'Months',
            year: 'Year',
            lifetime: 'Lifetime',
            popular: 'Popular',
            subscribe: 'Subscribe',
            maybeLater: 'Maybe later'
        },
        // Months
        months: {
            january: 'January',
            february: 'February',
            march: 'March',
            april: 'April',
            may: 'May',
            june: 'June',
            july: 'July',
            august: 'August',
            september: 'September',
            october: 'October',
            november: 'November',
            december: 'December'
        },
        monthsShort: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
        ],
        monthsFull: [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ],
        daysShort: [
            'Mon',
            'Tue',
            'Wed',
            'Thu',
            'Fri',
            'Sat',
            'Sun'
        ],
        // Common
        common: {
            loading: 'Loading...',
            error: 'Error',
            success: 'Success',
            cancel: 'Cancel',
            confirm: 'Confirm',
            delete: 'Delete',
            edit: 'Edit',
            close: 'Close',
            back: 'Back'
        }
    }
};
}),
"[project]/src/app/components/LanguageProvider.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LanguageProvider",
    ()=>LanguageProvider,
    "useLanguage",
    ()=>useLanguage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$translations$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/translations.js [app-ssr] (ecmascript)");
"use client";
;
;
;
const LanguageContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])();
function LanguageProvider({ children }) {
    const [language, setLanguage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('es');
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Cargar idioma guardado
        const savedLang = localStorage.getItem('app_language');
        if (savedLang && (savedLang === 'es' || savedLang === 'en')) {
            setLanguage(savedLang);
        }
        setMounted(true);
    }, []);
    const toggleLanguage = ()=>{
        const newLang = language === 'es' ? 'en' : 'es';
        setLanguage(newLang);
        localStorage.setItem('app_language', newLang);
    };
    const setLang = (lang)=>{
        if (lang === 'es' || lang === 'en') {
            setLanguage(lang);
            localStorage.setItem('app_language', lang);
        }
    };
    const t = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$translations$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["translations"][language];
    // Evitar hydration mismatch
    if (!mounted) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
            children: children
        }, void 0, false);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(LanguageContext.Provider, {
        value: {
            language,
            toggleLanguage,
            setLang,
            t
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/app/components/LanguageProvider.jsx",
        lineNumber: 41,
        columnNumber: 5
    }, this);
}
function useLanguage() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(LanguageContext);
    if (!context) {
        // Fallback para cuando no está dentro del provider
        return {
            language: 'es',
            toggleLanguage: ()=>{},
            setLang: ()=>{},
            t: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$translations$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["translations"].es
        };
    }
    return context;
}
}),
"[project]/node_modules/@swc/helpers/cjs/_interop_require_default.cjs [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
exports._ = _interop_require_default;
}),
"[project]/node_modules/@swc/helpers/cjs/_interop_require_wildcard.cjs [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) return obj;
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") return {
        default: obj
    };
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) return cache.get(obj);
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) Object.defineProperty(newObj, key, desc);
            else newObj[key] = obj[key];
        }
    }
    newObj.default = obj;
    if (cache) cache.set(obj, newObj);
    return newObj;
}
exports._ = _interop_require_wildcard;
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    else {
        if ("TURBOPACK compile-time truthy", 1) {
            if ("TURBOPACK compile-time truthy", 1) {
                module.exports = __turbopack_context__.r("[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)");
            } else //TURBOPACK unreachable
            ;
        } else //TURBOPACK unreachable
        ;
    }
} //# sourceMappingURL=module.compiled.js.map
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactJsxRuntime; //# sourceMappingURL=react-jsx-runtime.js.map
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-dom.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactDOM; //# sourceMappingURL=react-dom.js.map
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].React; //# sourceMappingURL=react.js.map
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/contexts/head-manager-context.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['contexts'].HeadManagerContext; //# sourceMappingURL=head-manager-context.js.map
}),
"[project]/node_modules/next/dist/client/set-attributes-from-props.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "setAttributesFromProps", {
    enumerable: true,
    get: function() {
        return setAttributesFromProps;
    }
});
const DOMAttributeNames = {
    acceptCharset: 'accept-charset',
    className: 'class',
    htmlFor: 'for',
    httpEquiv: 'http-equiv',
    noModule: 'noModule'
};
const ignoreProps = [
    'onLoad',
    'onReady',
    'dangerouslySetInnerHTML',
    'children',
    'onError',
    'strategy',
    'stylesheets'
];
function isBooleanScriptAttribute(attr) {
    return [
        'async',
        'defer',
        'noModule'
    ].includes(attr);
}
function setAttributesFromProps(el, props) {
    for (const [p, value] of Object.entries(props)){
        if (!props.hasOwnProperty(p)) continue;
        if (ignoreProps.includes(p)) continue;
        // we don't render undefined props to the DOM
        if (value === undefined) {
            continue;
        }
        const attr = DOMAttributeNames[p] || p.toLowerCase();
        if (el.tagName === 'SCRIPT' && isBooleanScriptAttribute(attr)) {
            // Correctly assign boolean script attributes
            // https://github.com/vercel/next.js/pull/20748
            ;
            el[attr] = !!value;
        } else {
            el.setAttribute(attr, String(value));
        }
        // Remove falsy non-zero boolean attributes so they are correctly interpreted
        // (e.g. if we set them to false, this coerces to the string "false", which the browser interprets as true)
        if (value === false || el.tagName === 'SCRIPT' && isBooleanScriptAttribute(attr) && (!value || value === 'false')) {
            // Call setAttribute before, as we need to set and unset the attribute to override force async:
            // https://html.spec.whatwg.org/multipage/scripting.html#script-force-async
            el.setAttribute(attr, '');
            el.removeAttribute(attr);
        }
    }
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=set-attributes-from-props.js.map
}),
"[project]/node_modules/next/dist/client/request-idle-callback.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    cancelIdleCallback: null,
    requestIdleCallback: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    cancelIdleCallback: function() {
        return cancelIdleCallback;
    },
    requestIdleCallback: function() {
        return requestIdleCallback;
    }
});
const requestIdleCallback = typeof self !== 'undefined' && self.requestIdleCallback && self.requestIdleCallback.bind(window) || function(cb) {
    let start = Date.now();
    return self.setTimeout(function() {
        cb({
            didTimeout: false,
            timeRemaining: function() {
                return Math.max(0, 50 - (Date.now() - start));
            }
        });
    }, 1);
};
const cancelIdleCallback = typeof self !== 'undefined' && self.cancelIdleCallback && self.cancelIdleCallback.bind(window) || function(id) {
    return clearTimeout(id);
};
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=request-idle-callback.js.map
}),
"[project]/node_modules/next/dist/client/script.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    default: null,
    handleClientScriptLoad: null,
    initScriptLoader: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    default: function() {
        return _default;
    },
    handleClientScriptLoad: function() {
        return handleClientScriptLoad;
    },
    initScriptLoader: function() {
        return initScriptLoader;
    }
});
const _interop_require_default = __turbopack_context__.r("[project]/node_modules/@swc/helpers/cjs/_interop_require_default.cjs [app-ssr] (ecmascript)");
const _interop_require_wildcard = __turbopack_context__.r("[project]/node_modules/@swc/helpers/cjs/_interop_require_wildcard.cjs [app-ssr] (ecmascript)");
const _jsxruntime = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
const _reactdom = /*#__PURE__*/ _interop_require_default._(__turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-dom.js [app-ssr] (ecmascript)"));
const _react = /*#__PURE__*/ _interop_require_wildcard._(__turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)"));
const _headmanagercontextsharedruntime = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/contexts/head-manager-context.js [app-ssr] (ecmascript)");
const _setattributesfromprops = __turbopack_context__.r("[project]/node_modules/next/dist/client/set-attributes-from-props.js [app-ssr] (ecmascript)");
const _requestidlecallback = __turbopack_context__.r("[project]/node_modules/next/dist/client/request-idle-callback.js [app-ssr] (ecmascript)");
const ScriptCache = new Map();
const LoadCache = new Set();
const insertStylesheets = (stylesheets)=>{
    // Case 1: Styles for afterInteractive/lazyOnload with appDir injected via handleClientScriptLoad
    //
    // Using ReactDOM.preinit to feature detect appDir and inject styles
    // Stylesheets might have already been loaded if initialized with Script component
    // Re-inject styles here to handle scripts loaded via handleClientScriptLoad
    // ReactDOM.preinit handles dedup and ensures the styles are loaded only once
    if (_reactdom.default.preinit) {
        stylesheets.forEach((stylesheet)=>{
            _reactdom.default.preinit(stylesheet, {
                as: 'style'
            });
        });
        return;
    }
    // Case 2: Styles for afterInteractive/lazyOnload with pages injected via handleClientScriptLoad
    //
    // We use this function to load styles when appdir is not detected
    // TODO: Use React float APIs to load styles once available for pages dir
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
};
const loadScript = (props)=>{
    const { src, id, onLoad = ()=>{}, onReady = null, dangerouslySetInnerHTML, children = '', strategy = 'afterInteractive', onError, stylesheets } = props;
    const cacheKey = id || src;
    // Script has already loaded
    if (cacheKey && LoadCache.has(cacheKey)) {
        return;
    }
    // Contents of this script are already loading/loaded
    if (ScriptCache.has(src)) {
        LoadCache.add(cacheKey);
        // It is possible that multiple `next/script` components all have same "src", but has different "onLoad"
        // This is to make sure the same remote script will only load once, but "onLoad" are executed in order
        ScriptCache.get(src).then(onLoad, onError);
        return;
    }
    /** Execute after the script first loaded */ const afterLoad = ()=>{
        // Run onReady for the first time after load event
        if (onReady) {
            onReady();
        }
        // add cacheKey to LoadCache when load successfully
        LoadCache.add(cacheKey);
    };
    const el = document.createElement('script');
    const loadPromise = new Promise((resolve, reject)=>{
        el.addEventListener('load', function(e) {
            resolve();
            if (onLoad) {
                onLoad.call(this, e);
            }
            afterLoad();
        });
        el.addEventListener('error', function(e) {
            reject(e);
        });
    }).catch(function(e) {
        if (onError) {
            onError(e);
        }
    });
    if (dangerouslySetInnerHTML) {
        // Casting since lib.dom.d.ts doesn't have TrustedHTML yet.
        el.innerHTML = dangerouslySetInnerHTML.__html || '';
        afterLoad();
    } else if (children) {
        el.textContent = typeof children === 'string' ? children : Array.isArray(children) ? children.join('') : '';
        afterLoad();
    } else if (src) {
        el.src = src;
        // do not add cacheKey into LoadCache for remote script here
        // cacheKey will be added to LoadCache when it is actually loaded (see loadPromise above)
        ScriptCache.set(src, loadPromise);
    }
    (0, _setattributesfromprops.setAttributesFromProps)(el, props);
    if (strategy === 'worker') {
        el.setAttribute('type', 'text/partytown');
    }
    el.setAttribute('data-nscript', strategy);
    // Load styles associated with this script
    if (stylesheets) {
        insertStylesheets(stylesheets);
    }
    document.body.appendChild(el);
};
function handleClientScriptLoad(props) {
    const { strategy = 'afterInteractive' } = props;
    if (strategy === 'lazyOnload') {
        window.addEventListener('load', ()=>{
            (0, _requestidlecallback.requestIdleCallback)(()=>loadScript(props));
        });
    } else {
        loadScript(props);
    }
}
function loadLazyScript(props) {
    if (document.readyState === 'complete') {
        (0, _requestidlecallback.requestIdleCallback)(()=>loadScript(props));
    } else {
        window.addEventListener('load', ()=>{
            (0, _requestidlecallback.requestIdleCallback)(()=>loadScript(props));
        });
    }
}
function addBeforeInteractiveToCache() {
    const scripts = [
        ...document.querySelectorAll('[data-nscript="beforeInteractive"]'),
        ...document.querySelectorAll('[data-nscript="beforePageRender"]')
    ];
    scripts.forEach((script)=>{
        const cacheKey = script.id || script.getAttribute('src');
        LoadCache.add(cacheKey);
    });
}
function initScriptLoader(scriptLoaderItems) {
    scriptLoaderItems.forEach(handleClientScriptLoad);
    addBeforeInteractiveToCache();
}
/**
 * Load a third-party scripts in an optimized way.
 *
 * Read more: [Next.js Docs: `next/script`](https://nextjs.org/docs/app/api-reference/components/script)
 */ function Script(props) {
    const { id, src = '', onLoad = ()=>{}, onReady = null, strategy = 'afterInteractive', onError, stylesheets, ...restProps } = props;
    // Context is available only during SSR
    let { updateScripts, scripts, getIsSsr, appDir, nonce } = (0, _react.useContext)(_headmanagercontextsharedruntime.HeadManagerContext);
    // if a nonce is explicitly passed to the script tag, favor that over the automatic handling
    nonce = restProps.nonce || nonce;
    /**
   * - First mount:
   *   1. The useEffect for onReady executes
   *   2. hasOnReadyEffectCalled.current is false, but the script hasn't loaded yet (not in LoadCache)
   *      onReady is skipped, set hasOnReadyEffectCalled.current to true
   *   3. The useEffect for loadScript executes
   *   4. hasLoadScriptEffectCalled.current is false, loadScript executes
   *      Once the script is loaded, the onLoad and onReady will be called by then
   *   [If strict mode is enabled / is wrapped in <OffScreen /> component]
   *   5. The useEffect for onReady executes again
   *   6. hasOnReadyEffectCalled.current is true, so entire effect is skipped
   *   7. The useEffect for loadScript executes again
   *   8. hasLoadScriptEffectCalled.current is true, so entire effect is skipped
   *
   * - Second mount:
   *   1. The useEffect for onReady executes
   *   2. hasOnReadyEffectCalled.current is false, but the script has already loaded (found in LoadCache)
   *      onReady is called, set hasOnReadyEffectCalled.current to true
   *   3. The useEffect for loadScript executes
   *   4. The script is already loaded, loadScript bails out
   *   [If strict mode is enabled / is wrapped in <OffScreen /> component]
   *   5. The useEffect for onReady executes again
   *   6. hasOnReadyEffectCalled.current is true, so entire effect is skipped
   *   7. The useEffect for loadScript executes again
   *   8. hasLoadScriptEffectCalled.current is true, so entire effect is skipped
   */ const hasOnReadyEffectCalled = (0, _react.useRef)(false);
    (0, _react.useEffect)(()=>{
        const cacheKey = id || src;
        if (!hasOnReadyEffectCalled.current) {
            // Run onReady if script has loaded before but component is re-mounted
            if (onReady && cacheKey && LoadCache.has(cacheKey)) {
                onReady();
            }
            hasOnReadyEffectCalled.current = true;
        }
    }, [
        onReady,
        id,
        src
    ]);
    const hasLoadScriptEffectCalled = (0, _react.useRef)(false);
    (0, _react.useEffect)(()=>{
        if (!hasLoadScriptEffectCalled.current) {
            if (strategy === 'afterInteractive') {
                loadScript(props);
            } else if (strategy === 'lazyOnload') {
                loadLazyScript(props);
            }
            hasLoadScriptEffectCalled.current = true;
        }
    }, [
        props,
        strategy
    ]);
    if (strategy === 'beforeInteractive' || strategy === 'worker') {
        if (updateScripts) {
            scripts[strategy] = (scripts[strategy] || []).concat([
                {
                    id,
                    src,
                    onLoad,
                    onReady,
                    onError,
                    ...restProps,
                    nonce
                }
            ]);
            updateScripts(scripts);
        } else if (getIsSsr && getIsSsr()) {
            // Script has already loaded during SSR
            LoadCache.add(id || src);
        } else if (getIsSsr && !getIsSsr()) {
            loadScript({
                ...props,
                nonce
            });
        }
    }
    // For the app directory, we need React Float to preload these scripts.
    if (appDir) {
        // Injecting stylesheets here handles beforeInteractive and worker scripts correctly
        // For other strategies injecting here ensures correct stylesheet order
        // ReactDOM.preinit handles loading the styles in the correct order,
        // also ensures the stylesheet is loaded only once and in a consistent manner
        //
        // Case 1: Styles for beforeInteractive/worker with appDir - handled here
        // Case 2: Styles for beforeInteractive/worker with pages dir - Not handled yet
        // Case 3: Styles for afterInteractive/lazyOnload with appDir - handled here
        // Case 4: Styles for afterInteractive/lazyOnload with pages dir - handled in insertStylesheets function
        if (stylesheets) {
            stylesheets.forEach((styleSrc)=>{
                _reactdom.default.preinit(styleSrc, {
                    as: 'style'
                });
            });
        }
        // Before interactive scripts need to be loaded by Next.js' runtime instead
        // of native <script> tags, because they no longer have `defer`.
        if (strategy === 'beforeInteractive') {
            if (!src) {
                // For inlined scripts, we put the content in `children`.
                if (restProps.dangerouslySetInnerHTML) {
                    // Casting since lib.dom.d.ts doesn't have TrustedHTML yet.
                    restProps.children = restProps.dangerouslySetInnerHTML.__html;
                    delete restProps.dangerouslySetInnerHTML;
                }
                return /*#__PURE__*/ (0, _jsxruntime.jsx)("script", {
                    nonce: nonce,
                    dangerouslySetInnerHTML: {
                        __html: `(self.__next_s=self.__next_s||[]).push(${JSON.stringify([
                            0,
                            {
                                ...restProps,
                                id
                            }
                        ])})`
                    }
                });
            } else {
                // @ts-ignore
                _reactdom.default.preload(src, restProps.integrity ? {
                    as: 'script',
                    integrity: restProps.integrity,
                    nonce,
                    crossOrigin: restProps.crossOrigin
                } : {
                    as: 'script',
                    nonce,
                    crossOrigin: restProps.crossOrigin
                });
                return /*#__PURE__*/ (0, _jsxruntime.jsx)("script", {
                    nonce: nonce,
                    dangerouslySetInnerHTML: {
                        __html: `(self.__next_s=self.__next_s||[]).push(${JSON.stringify([
                            src,
                            {
                                ...restProps,
                                id
                            }
                        ])})`
                    }
                });
            }
        } else if (strategy === 'afterInteractive') {
            if (src) {
                // @ts-ignore
                _reactdom.default.preload(src, restProps.integrity ? {
                    as: 'script',
                    integrity: restProps.integrity,
                    nonce,
                    crossOrigin: restProps.crossOrigin
                } : {
                    as: 'script',
                    nonce,
                    crossOrigin: restProps.crossOrigin
                });
            }
        }
    }
    return null;
}
Object.defineProperty(Script, '__nextScript', {
    value: true
});
const _default = Script;
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=script.js.map
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactJsxDevRuntime; //# sourceMappingURL=react-jsx-dev-runtime.js.map
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__33c3a0cc._.js.map