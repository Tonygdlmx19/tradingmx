export const translations = {
  es: {
    // Header
    header: {
      greeting: 'Hola',
      settings: 'Ajustes',
      fundingSimulator: 'Simulador de Fondeo',
      economicCalendar: 'Calendario',
      admin: 'Admin',
      logout: 'Salir',
    },

    // Stats Cards
    stats: {
      balance: 'Balance',
      periodPnL: 'P&L del Periodo',
      winRate: 'Win Rate',
      maxDrawdown: 'Drawdown Máx',
      profitFactor: 'Profit Factor',
      trades: 'trades',
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
      losing: 'Perdiendo',
    },

    // View Selector
    viewSelector: {
      table: 'Tabla',
      calendar: 'Calendario',
      global: 'Global',
      monthly: 'Mensual',
      operations: 'operaciones',
      operation: 'operación',
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
        revenge: 'Revenge',
      },
      followedPlan: '¿Seguí mi plan?',
      respectedRisk: '¿Respeté mi riesgo?',
      notes: 'Notas',
      notesPlaceholder: 'Observaciones del trade...',
      screenshot: 'Screenshot',
      save: 'Guardar Trade',
      saving: 'Guardando...',
      riskCalculator: 'Calculadora de Riesgo',
    },

    // Charts
    charts: {
      equityCurve: 'Curva de Capital',
      drawdown: 'Drawdown',
      noData: 'Registra trades para ver la gráfica',
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
      clickDay: 'Haz clic en un día con trades para ver detalles',
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
      startRecording: 'Comienza a registrar tus trades',
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
      save: 'Guardar Configuración',
    },

    // Onboarding Tour
    tour: {
      welcome: {
        title: '¡Bienvenido a Trading Journal PRO!',
        description: 'Te mostraremos las funciones principales para que le saques el máximo provecho a tu journal. ¡Empecemos!',
      },
      settings: {
        title: 'Configuración',
        description: 'Aquí puedes personalizar tu journal: agrega activos, crea tu checklist de setup, define tu capital inicial y tu meta diaria.',
      },
      funding: {
        title: 'Simulador de Fondeo',
        description: 'Practica con reglas reales de empresas de fondeo como FTMO. Simula tu challenge antes de arriesgar dinero real.',
      },
      calendar: {
        title: 'Calendario Económico',
        description: 'Consulta los eventos económicos importantes del día. Nunca te pierdas un NFP, FOMC o dato de inflación.',
      },
      stats: {
        title: 'Estadísticas Principales',
        description: 'Tu balance actual, P&L del periodo, win rate, drawdown máximo y profit factor. Las métricas clave de un vistazo.',
      },
      advancedStats: {
        title: 'Métricas Avanzadas',
        description: 'Análisis detallado: mejor/peor trade, promedio de ganancias y pérdidas, racha ganadora y expectativa.',
      },
      charts: {
        title: 'Gráficas de Rendimiento',
        description: 'Visualiza tu curva de equity y drawdown. Identifica patrones en tu operativa.',
      },
      viewSelector: {
        title: 'Vista del Historial',
        description: 'Cambia entre vista de tabla o calendario. Filtra por mes o año para analizar periodos específicos.',
      },
      tradeForm: {
        title: 'Registra tus Trades',
        description: 'Usa este formulario para registrar cada operación con resultado, emoción y notas.',
      },
      complete: {
        title: '¡Listo para empezar!',
        description: 'Ya conoces las funciones principales. La consistencia en el registro es clave para mejorar. ¡Éxito en tu trading!',
      },
      step: 'Paso',
      of: 'de',
      skip: 'Omitir',
      next: 'Siguiente',
      finish: 'Finalizar',
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
      maybeLater: 'Quizás después',
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
      december: 'Diciembre',
    },
    monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    monthsFull: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    daysShort: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],

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
      back: 'Atrás',
    },
  },

  en: {
    // Header
    header: {
      greeting: 'Hello',
      settings: 'Settings',
      fundingSimulator: 'Funding Simulator',
      economicCalendar: 'Calendar',
      admin: 'Admin',
      logout: 'Logout',
    },

    // Stats Cards
    stats: {
      balance: 'Balance',
      periodPnL: 'Period P&L',
      winRate: 'Win Rate',
      maxDrawdown: 'Max Drawdown',
      profitFactor: 'Profit Factor',
      trades: 'trades',
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
      losing: 'Losing',
    },

    // View Selector
    viewSelector: {
      table: 'Table',
      calendar: 'Calendar',
      global: 'Global',
      monthly: 'Monthly',
      operations: 'operations',
      operation: 'operation',
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
        revenge: 'Revenge',
      },
      followedPlan: 'Did I follow my plan?',
      respectedRisk: 'Did I respect my risk?',
      notes: 'Notes',
      notesPlaceholder: 'Trade observations...',
      screenshot: 'Screenshot',
      save: 'Save Trade',
      saving: 'Saving...',
      riskCalculator: 'Risk Calculator',
    },

    // Charts
    charts: {
      equityCurve: 'Equity Curve',
      drawdown: 'Drawdown',
      noData: 'Record trades to see the chart',
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
      clickDay: 'Click on a day with trades to see details',
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
      startRecording: 'Start recording your trades',
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
      save: 'Save Settings',
    },

    // Onboarding Tour
    tour: {
      welcome: {
        title: 'Welcome to Trading Journal PRO!',
        description: 'We\'ll show you the main features to get the most out of your journal. Let\'s start!',
      },
      settings: {
        title: 'Settings',
        description: 'Here you can customize your journal: add assets, create your setup checklist, set your initial capital and daily goal.',
      },
      funding: {
        title: 'Funding Simulator',
        description: 'Practice with real rules from funding companies like FTMO. Simulate your challenge before risking real money.',
      },
      calendar: {
        title: 'Economic Calendar',
        description: 'Check important economic events of the day. Never miss an NFP, FOMC or inflation data.',
      },
      stats: {
        title: 'Main Statistics',
        description: 'Your current balance, period P&L, win rate, max drawdown and profit factor. Key metrics at a glance.',
      },
      advancedStats: {
        title: 'Advanced Metrics',
        description: 'Detailed analysis: best/worst trade, average wins and losses, winning streak and expectancy.',
      },
      charts: {
        title: 'Performance Charts',
        description: 'Visualize your equity curve and drawdown. Identify patterns in your trading.',
      },
      viewSelector: {
        title: 'History View',
        description: 'Switch between table or calendar view. Filter by month or year to analyze specific periods.',
      },
      tradeForm: {
        title: 'Record Your Trades',
        description: 'Use this form to record each trade with result, emotion and notes.',
      },
      complete: {
        title: 'Ready to start!',
        description: 'You now know the main features. Consistency in recording is key to improving. Good luck with your trading!',
      },
      step: 'Step',
      of: 'of',
      skip: 'Skip',
      next: 'Next',
      finish: 'Finish',
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
      maybeLater: 'Maybe later',
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
      december: 'December',
    },
    monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    monthsFull: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    daysShort: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],

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
      back: 'Back',
    },
  },
};
