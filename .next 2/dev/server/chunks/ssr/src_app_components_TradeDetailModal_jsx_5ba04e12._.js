module.exports = [
"[project]/src/app/components/TradeDetailModal.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TradeDetailModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar.js [app-ssr] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-ssr] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/save.js [app-ssr] (ecmascript) <export default as Save>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-ssr] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/image.js [app-ssr] (ecmascript) <export default as Image>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PlusCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-plus.js [app-ssr] (ecmascript) <export default as PlusCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardCheck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clipboard-check.js [app-ssr] (ecmascript) <export default as ClipboardCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-ssr] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-ssr] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-x.js [app-ssr] (ecmascript) <export default as XCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-ssr] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zoom$2d$in$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ZoomIn$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/zoom-in.js [app-ssr] (ecmascript) <export default as ZoomIn>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zoom$2d$out$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ZoomOut$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/zoom-out.js [app-ssr] (ecmascript) <export default as ZoomOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/rotate-ccw.js [app-ssr] (ecmascript) <export default as RotateCcw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$briefcase$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Briefcase$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/briefcase.js [app-ssr] (ecmascript) <export default as Briefcase>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$line$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit3$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pen-line.js [app-ssr] (ecmascript) <export default as Edit3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trending-up.js [app-ssr] (ecmascript) <export default as TrendingUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trending-down.js [app-ssr] (ecmascript) <export default as TrendingDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/dollar-sign.js [app-ssr] (ecmascript) <export default as DollarSign>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chart-column.js [app-ssr] (ecmascript) <export default as BarChart3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-ssr] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bot.js [app-ssr] (ecmascript) <export default as Bot>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-ssr] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ThemeProvider$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/ThemeProvider.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$LanguageProvider$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/LanguageProvider.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$PostTradeResultModal$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/PostTradeResultModal.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$firebase$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/firebase.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.node.mjs [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
// AI Query limits by plan
const AI_QUERY_LIMITS = {
    trial: 5,
    '1month': 5,
    '3months': 10,
    '1year': 20,
    lifetime: 30,
    paid: 30
};
// Users with unlimited AI queries
const UNLIMITED_AI_EMAILS = [
    'tonytrader19@gmail.com'
];
const TEMPORALIDADES = [
    '1D',
    '4H',
    '1H',
    '30M',
    '15M',
    '5M',
    '1M',
    'Ejecución'
];
const EMOCIONES = [
    'Neutral',
    'Calmado',
    'Ansioso',
    'Venganza',
    'Miedo',
    'Eufórico',
    'Frustrado'
];
function TradeDetailModal({ trade, isOpen, onClose, onUpdate, onDelete, cuentasBroker = [], userId, userEmail, userType, userPlan }) {
    const { isDark } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ThemeProvider$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTheme"])();
    const { language } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$LanguageProvider$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLanguage"])();
    // Estados editables
    const [editData, setEditData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [notas, setNotas] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [imagenes, setImagenes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isSaving, setIsSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [hasChanges, setHasChanges] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [viewingImage, setViewingImage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isEditMode, setIsEditMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // AI Analysis state
    const [aiAnalysis, setAiAnalysis] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [analyzingIndex, setAnalyzingIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [aiQueriesUsed, setAiQueriesUsed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [aiQueriesLimit, setAiQueriesLimit] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(5);
    const [showPostTradeModal, setShowPostTradeModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // Zoom state
    const [zoom, setZoom] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(1);
    const [position, setPosition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        x: 0,
        y: 0
    });
    const [isDragging, setIsDragging] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [dragStart, setDragStart] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        x: 0,
        y: 0
    });
    const lastTouchDistance = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const imageContainerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const labels = {
        es: {
            editTrade: 'Editar',
            direction: 'Dirección',
            entryDate: 'Fecha Entrada',
            exitDate: 'Fecha Salida',
            tradeTime: 'Hora',
            lots: 'Lotes',
            result: 'Resultado',
            entryPrice: 'Entrada',
            exitPrice: 'Salida',
            emotion: 'Estado Emocional',
            swap: 'Swap/Comisión',
            account: 'Cuenta',
            selectAccount: 'Sin cuenta',
            saveChanges: 'Guardar Cambios',
            saving: 'Guardando...',
            delete: 'Eliminar',
            close: 'Cerrar',
            confirmDelete: '¿Estás seguro de eliminar este trade?',
            points: 'Puntos',
            metrics: 'Métricas',
            prices: 'Precios',
            netResult: 'Neto',
            swing: 'Swing Trade',
            screenshots: 'Captura del Trade',
            addScreenshot: 'Agregar captura',
            addAnotherScreenshot: 'Agregar otra captura',
            notes: 'Notas y Comentarios',
            notesPlaceholder: 'Agrega tus observaciones sobre este trade...',
            analyzeWithAI: 'Analizar con IA',
            analyzing: 'Analizando...',
            aiAnalysis: 'Análisis de IA',
            aiError: 'Error al analizar',
            hideAnalysis: 'Ocultar análisis',
            showAnalysis: 'Ver análisis',
            queriesRemaining: 'consultas restantes hoy',
            queryLimitReached: 'Límite de consultas alcanzado por hoy'
        },
        en: {
            editTrade: 'Edit',
            direction: 'Direction',
            entryDate: 'Entry Date',
            exitDate: 'Exit Date',
            tradeTime: 'Time',
            lots: 'Lots',
            result: 'Result',
            entryPrice: 'Entry',
            exitPrice: 'Exit',
            emotion: 'Emotional State',
            swap: 'Swap/Commission',
            account: 'Account',
            selectAccount: 'No account',
            saveChanges: 'Save Changes',
            saving: 'Saving...',
            delete: 'Delete',
            close: 'Close',
            confirmDelete: 'Are you sure you want to delete this trade?',
            points: 'Points',
            metrics: 'Metrics',
            prices: 'Prices',
            netResult: 'Net',
            swing: 'Swing Trade',
            screenshots: 'Trade Screenshot',
            addScreenshot: 'Add screenshot',
            addAnotherScreenshot: 'Add another screenshot',
            notes: 'Notes & Comments',
            notesPlaceholder: 'Add your observations about this trade...',
            analyzeWithAI: 'Analyze with AI',
            analyzing: 'Analyzing...',
            aiAnalysis: 'AI Analysis',
            aiError: 'Analysis error',
            hideAnalysis: 'Hide analysis',
            showAnalysis: 'View analysis',
            queriesRemaining: 'queries remaining today',
            queryLimitReached: 'Daily query limit reached'
        }
    };
    const t = labels[language];
    // Emotion translations
    const emotionLabels = {
        es: {
            'Neutral': 'Neutral',
            'Calmado': 'Calmado',
            'Ansioso': 'Ansioso',
            'Venganza': 'Venganza',
            'Miedo': 'Miedo',
            'Eufórico': 'Eufórico',
            'Frustrado': 'Frustrado'
        },
        en: {
            'Neutral': 'Neutral',
            'Calmado': 'Calm',
            'Ansioso': 'Anxious',
            'Venganza': 'Revenge',
            'Miedo': 'Fear',
            'Eufórico': 'Euphoric',
            'Frustrado': 'Frustrated'
        }
    };
    const getEmotionLabel = (emo)=>emotionLabels[language]?.[emo] || emo;
    // Check if user has unlimited AI queries
    const hasUnlimitedQueries = ()=>{
        if (!userEmail) return false;
        return UNLIMITED_AI_EMAILS.includes(userEmail.toLowerCase());
    };
    // Get AI query limit based on user plan
    const getQueryLimit = ()=>{
        if (hasUnlimitedQueries()) return 999999;
        if (userType === 'lifetime' || userType === 'paid') return AI_QUERY_LIMITS.lifetime;
        if (userType === 'trial') return AI_QUERY_LIMITS.trial;
        if (userType === 'subscription' && userPlan) {
            return AI_QUERY_LIMITS[userPlan] || AI_QUERY_LIMITS.trial;
        }
        return AI_QUERY_LIMITS.trial;
    };
    // Get today's date string for tracking
    const getTodayKey = ()=>{
        const today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    };
    // Load AI query count for today
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const loadQueryCount = async ()=>{
            if (!userId || !isOpen) return;
            const limit = getQueryLimit();
            setAiQueriesLimit(limit);
            try {
                const todayKey = getTodayKey();
                const queryDocRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$firebase$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"], 'ai_queries', `${userId}_${todayKey}`);
                const queryDoc = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDoc"])(queryDocRef);
                if (queryDoc.exists()) {
                    setAiQueriesUsed(queryDoc.data().count || 0);
                } else {
                    setAiQueriesUsed(0);
                }
            } catch (error) {
                console.error('Error loading AI query count:', error);
                setAiQueriesUsed(0);
            }
        };
        loadQueryCount();
    }, [
        userId,
        isOpen,
        userType,
        userPlan
    ]);
    // Increment AI query count
    const incrementQueryCount = async ()=>{
        if (!userId) {
            console.error('Cannot increment query count: userId is missing');
            return false;
        }
        // Immediately update local state for instant UI feedback
        const previousCount = aiQueriesUsed;
        setAiQueriesUsed((prev)=>prev + 1);
        try {
            const todayKey = getTodayKey();
            const queryDocRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$firebase$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"], 'ai_queries', `${userId}_${todayKey}`);
            // Get current count from Firestore to avoid stale state issues
            const currentDoc = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDoc"])(queryDocRef);
            const currentCount = currentDoc.exists() ? currentDoc.data().count || 0 : 0;
            const newCount = currentCount + 1;
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setDoc"])(queryDocRef, {
                userId,
                date: todayKey,
                count: newCount,
                lastQuery: new Date().toISOString()
            });
            // Sync with actual Firestore count
            setAiQueriesUsed(newCount);
            console.log(`AI Post-Trade query count updated: ${newCount}/${aiQueriesLimit}`);
            return true;
        } catch (error) {
            console.error('Error updating AI query count:', error);
            // Revert on error
            setAiQueriesUsed(previousCount);
            return false;
        }
    };
    const canMakeQuery = ()=>aiQueriesUsed < aiQueriesLimit;
    const queriesRemaining = Math.max(0, aiQueriesLimit - aiQueriesUsed);
    // Reset state when trade changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (trade) {
            setEditData({
                activo: trade.activo || '',
                dir: trade.dir || 'Long',
                fechaEntrada: trade.fechaEntrada || trade.fecha || '',
                fechaSalida: trade.fechaSalida || trade.fecha || '',
                hora: trade.hora || '',
                lotes: trade.lotes || 1,
                res: Math.abs(trade.res || 0),
                esGanancia: (trade.res || 0) >= 0,
                entrada: trade.entrada || '',
                salida: trade.salida || '',
                emo: trade.emo || 'Neutral',
                swap: trade.swap || 0,
                cuentaId: trade.cuentaId || ''
            });
            setNotas(trade.notas || '');
            // Compatibilidad: convertir imagen antigua (singular) a array
            let imgs = trade.imagenes || [];
            if (imgs.length === 0 && trade.imagen) {
                imgs = [
                    {
                        data: trade.imagen,
                        temporalidad: '1H'
                    }
                ];
            }
            setImagenes(imgs);
            setHasChanges(false);
            setIsEditMode(false);
            // Load saved AI analysis from trade if exists
            if (trade.aiAnalysis) {
                setAiAnalysis({
                    0: {
                        text: trade.aiAnalysis,
                        expanded: true
                    }
                });
            } else {
                setAiAnalysis({});
            }
            setAnalyzingIndex(null);
        }
    }, [
        trade
    ]);
    if (!isOpen || !trade) return null;
    const currentRes = editData.esGanancia ? Math.abs(editData.res || 0) : -Math.abs(editData.res || 0);
    const isWin = currentRes >= 0;
    const formatDate = (dateStr)=>{
        if (!dateStr) return '-';
        const [y, m, d] = dateStr.split('-');
        const monthsEs = [
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
        ];
        const monthsEn = [
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
        ];
        const months = language === 'en' ? monthsEn : monthsEs;
        // American format: Month Day, Year
        return language === 'en' ? `${months[parseInt(m) - 1]} ${parseInt(d)}, ${y}` : `${parseInt(d)} de ${months[parseInt(m) - 1]}, ${y}`;
    };
    const getEmojiForEmotion = (emo)=>{
        const emojis = {
            'Neutral': '😐',
            'Calmado': '😌',
            'Ansioso': '😰',
            'Venganza': '😤',
            'Miedo': '😨',
            'Euforico': '🤑',
            'Frustrado': '😔'
        };
        return emojis[emo] || '😐';
    };
    // Comprimir imagen
    const compressImage = (file, maxWidth = 800)=>{
        return new Promise((resolve, reject)=>{
            const reader = new FileReader();
            reader.onerror = ()=>reject(new Error('Error leyendo archivo'));
            reader.onload = (event)=>{
                const img = document.createElement('img');
                img.onerror = ()=>reject(new Error('Error cargando imagen'));
                img.onload = ()=>{
                    try {
                        const canvas = document.createElement('canvas');
                        let width = img.width;
                        let height = img.height;
                        if (width > height && width > maxWidth) {
                            height = height * maxWidth / width;
                            width = maxWidth;
                        } else if (height > maxWidth) {
                            width = width * maxWidth / height;
                            height = maxWidth;
                        }
                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, width, height);
                        resolve(canvas.toDataURL('image/jpeg', 0.7));
                    } catch (err) {
                        reject(err);
                    }
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        });
    };
    const agregarImagen = async (file)=>{
        if (!file) return;
        if (imagenes.length >= 1) {
            alert(language === 'en' ? 'Maximum 1 image per trade' : 'Máximo 1 imagen por trade');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert('La imagen es muy grande (max 5MB)');
            return;
        }
        try {
            const compressed = await compressImage(file);
            setImagenes((prev)=>[
                    ...prev,
                    {
                        data: compressed,
                        temporalidad: '1H'
                    }
                ]);
            setHasChanges(true);
        } catch (error) {
            console.error('Error procesando imagen:', error);
            alert('Error al procesar la imagen');
        }
    };
    const handleTemporalidadChange = (index, temporalidad)=>{
        const nuevasImagenes = [
            ...imagenes
        ];
        nuevasImagenes[index] = {
            ...nuevasImagenes[index],
            temporalidad
        };
        setImagenes(nuevasImagenes);
        setHasChanges(true);
    };
    const removeImage = (index)=>{
        setImagenes((prev)=>prev.filter((_, i)=>i !== index));
        setHasChanges(true);
    };
    const handleSaveChanges = async ()=>{
        setIsSaving(true);
        // Calcular resultado del trade (el swap se descuenta del balance, no del trade)
        const resultadoFinal = editData.esGanancia ? Math.abs(parseFloat(editData.res) || 0) : -Math.abs(parseFloat(editData.res) || 0);
        // Obtener info de cuenta
        const cuentaSeleccionada = editData.cuentaId ? cuentasBroker.find((c)=>c.id === editData.cuentaId) : null;
        // Calcular puntos según dirección
        let puntos = null;
        if (editData.entrada && editData.salida) {
            const entrada = parseFloat(editData.entrada);
            const salida = parseFloat(editData.salida);
            puntos = editData.dir === 'Long' ? salida - entrada : entrada - salida;
        }
        // Get the latest AI analysis text if available
        const latestAiAnalysis = Object.values(aiAnalysis).find((a)=>a?.text)?.text || trade.aiAnalysis || null;
        const updates = {
            activo: editData.activo,
            dir: editData.dir,
            fecha: editData.fechaSalida,
            fechaEntrada: editData.fechaEntrada,
            fechaSalida: editData.fechaSalida,
            hora: editData.hora || null,
            lotes: parseFloat(editData.lotes) || 1,
            res: resultadoFinal,
            entrada: editData.entrada ? parseFloat(editData.entrada) : null,
            salida: editData.salida ? parseFloat(editData.salida) : null,
            puntos: puntos,
            emo: editData.emo,
            swap: parseFloat(editData.swap) || 0,
            cuentaId: editData.cuentaId || null,
            broker: cuentaSeleccionada?.broker || null,
            numeroCuenta: cuentaSeleccionada?.numero || null,
            notas,
            imagenes,
            imagen: null,
            aiAnalysis: latestAiAnalysis
        };
        await onUpdate(trade.id, updates);
        setHasChanges(false);
        setIsEditMode(false);
        setIsSaving(false);
    };
    const handleFieldChange = (field, value)=>{
        setEditData((prev)=>({
                ...prev,
                [field]: value
            }));
        setHasChanges(true);
    };
    const handleNotasChange = (value)=>{
        setNotas(value);
        setHasChanges(true);
    };
    const handleDelete = ()=>{
        if (window.confirm(t.confirmDelete)) {
            onDelete(trade.id);
            onClose();
        }
    };
    // AI Analysis handler
    const analyzeWithAI = async (imageIndex)=>{
        const img = imagenes[imageIndex];
        if (!img?.data) return;
        // Check query limit
        if (!canMakeQuery()) {
            setAiAnalysis((prev)=>({
                    ...prev,
                    [imageIndex]: {
                        error: t.queryLimitReached,
                        expanded: true
                    }
                }));
            return;
        }
        setAnalyzingIndex(imageIndex);
        try {
            const response = await fetch('/api/analyze-trade', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    imageBase64: img.data,
                    tradeData: {
                        activo: editData.activo,
                        dir: editData.dir,
                        res: editData.esGanancia ? Math.abs(editData.res) : -Math.abs(editData.res),
                        entrada: editData.entrada,
                        salida: editData.salida,
                        puntos: trade.puntos
                    },
                    userNotes: notas || '',
                    language
                })
            });
            const data = await response.json();
            if (data.error) {
                setAiAnalysis((prev)=>({
                        ...prev,
                        [imageIndex]: {
                            error: data.error
                        }
                    }));
            } else {
                // Increment query count on successful analysis (only if not unlimited)
                if (!hasUnlimitedQueries()) {
                    const incremented = await incrementQueryCount();
                    if (!incremented) {
                        console.warn('Failed to increment query count, but analysis was successful');
                    }
                }
                setAiAnalysis((prev)=>({
                        ...prev,
                        [imageIndex]: {
                            text: data.analysis,
                            expanded: true
                        }
                    }));
                // Mark as having changes so user can save the analysis
                setHasChanges(true);
                // Open the result modal
                setShowPostTradeModal(true);
            }
        } catch (error) {
            setAiAnalysis((prev)=>({
                    ...prev,
                    [imageIndex]: {
                        error: error.message
                    }
                }));
        } finally{
            setAnalyzingIndex(null);
        }
    };
    const toggleAnalysisExpanded = (index)=>{
        setAiAnalysis((prev)=>({
                ...prev,
                [index]: {
                    ...prev[index],
                    expanded: !prev[index]?.expanded
                }
            }));
    };
    // Zoom handlers
    const resetZoom = ()=>{
        setZoom(1);
        setPosition({
            x: 0,
            y: 0
        });
    };
    const handleZoomIn = ()=>{
        setZoom((prev)=>Math.min(prev + 0.5, 4));
    };
    const handleZoomOut = ()=>{
        setZoom((prev)=>{
            const newZoom = Math.max(prev - 0.5, 1);
            if (newZoom === 1) setPosition({
                x: 0,
                y: 0
            });
            return newZoom;
        });
    };
    const handleImageClick = (e)=>{
        e.stopPropagation();
        // Double tap to zoom
        if (zoom === 1) {
            setZoom(2);
        } else {
            resetZoom();
        }
    };
    const handleTouchStart = (e)=>{
        if (e.touches.length === 2) {
            // Pinch start
            const distance = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
            lastTouchDistance.current = distance;
        } else if (e.touches.length === 1 && zoom > 1) {
            // Pan start
            setIsDragging(true);
            setDragStart({
                x: e.touches[0].clientX - position.x,
                y: e.touches[0].clientY - position.y
            });
        }
    };
    const handleTouchMove = (e)=>{
        if (e.touches.length === 2 && lastTouchDistance.current) {
            // Pinch zoom
            const distance = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
            const delta = distance - lastTouchDistance.current;
            lastTouchDistance.current = distance;
            setZoom((prev)=>{
                const newZoom = prev + delta * 0.01;
                return Math.max(1, Math.min(4, newZoom));
            });
        } else if (e.touches.length === 1 && isDragging && zoom > 1) {
            // Pan
            const newX = e.touches[0].clientX - dragStart.x;
            const newY = e.touches[0].clientY - dragStart.y;
            // Limit pan based on zoom level
            const maxPan = (zoom - 1) * 150;
            setPosition({
                x: Math.max(-maxPan, Math.min(maxPan, newX)),
                y: Math.max(-maxPan, Math.min(maxPan, newY))
            });
        }
    };
    const handleTouchEnd = ()=>{
        lastTouchDistance.current = null;
        setIsDragging(false);
        if (zoom <= 1) {
            resetZoom();
        }
    };
    const openImageViewer = (img)=>{
        setViewingImage(img);
        resetZoom();
    };
    const closeImageViewer = ()=>{
        setViewingImage(null);
        resetZoom();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `rounded-2xl shadow-2xl border max-h-[90vh] overflow-hidden flex flex-col ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`,
                style: {
                    width: '100%',
                    maxWidth: '500px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `px-4 py-3 border-b flex items-center justify-between ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `text-xl font-black ${isDark ? 'text-white' : 'text-slate-800'}`,
                                        children: editData.activo
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                        lineNumber: 622,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `px-2 py-1 rounded-lg text-xs font-bold uppercase flex items-center gap-1 ${editData.dir === 'Long' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`,
                                        children: [
                                            editData.dir === 'Long' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"], {
                                                size: 12
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                lineNumber: 630,
                                                columnNumber: 42
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingDown$3e$__["TrendingDown"], {
                                                size: 12
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                lineNumber: 630,
                                                columnNumber: 68
                                            }, this),
                                            editData.dir
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                        lineNumber: 625,
                                        columnNumber: 13
                                    }, this),
                                    editData.fechaEntrada !== editData.fechaSalida && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "px-2 py-1 rounded-lg text-[10px] font-bold bg-amber-500/20 text-amber-500",
                                        children: "SWING"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                        lineNumber: 634,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                lineNumber: 621,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setIsEditMode(!isEditMode),
                                        className: `px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${isEditMode ? 'bg-blue-500 text-white' : isDark ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$line$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit3$3e$__["Edit3"], {
                                                size: 14
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                lineNumber: 648,
                                                columnNumber: 15
                                            }, this),
                                            t.editTrade
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                        lineNumber: 640,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: onClose,
                                        className: `p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-400'}`,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                            size: 18
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                            lineNumber: 657,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                        lineNumber: 651,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                lineNumber: 639,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                        lineNumber: 618,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `px-4 py-4 border-b ${isWin ? 'bg-gradient-to-r from-green-500/10 to-green-500/5' : 'bg-gradient-to-r from-red-500/10 to-red-500/5'} ${isDark ? 'border-slate-700' : 'border-slate-200'}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: `text-4xl font-black ${isWin ? 'text-green-500' : 'text-red-500'}`,
                                        children: [
                                            isWin ? '+' : '-',
                                            "$",
                                            Math.abs(currentRes).toFixed(2)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                        lineNumber: 669,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `px-3 py-1.5 rounded-lg ${isDark ? 'bg-slate-700/80' : 'bg-white/80'}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: `text-[9px] font-bold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`,
                                                children: t.lots
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                lineNumber: 673,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: `text-base font-black ${isDark ? 'text-white' : 'text-slate-800'}`,
                                                children: editData.lotes
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                lineNumber: 676,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                        lineNumber: 672,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                lineNumber: 668,
                                columnNumber: 11
                            }, this),
                            editData.swap > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: `text-sm mt-2 text-center ${isDark ? 'text-slate-400' : 'text-slate-500'}`,
                                children: [
                                    t.netResult,
                                    ": ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: isWin ? 'text-green-500' : 'text-red-500',
                                        children: [
                                            isWin ? '+' : '-',
                                            "$",
                                            (Math.abs(currentRes) - editData.swap).toFixed(2)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                        lineNumber: 683,
                                        columnNumber: 30
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-amber-500 ml-2",
                                        children: [
                                            "(Swap: -$",
                                            parseFloat(editData.swap).toFixed(2),
                                            ")"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                        lineNumber: 686,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                lineNumber: 682,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                        lineNumber: 663,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 overflow-y-auto p-5 space-y-4",
                        children: [
                            isEditMode ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: `text-[10px] font-bold uppercase mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-500'}`,
                                                children: t.direction
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                lineNumber: 698,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-2 gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>handleFieldChange('dir', 'Long'),
                                                        className: `p-2 rounded-xl font-bold text-sm transition-all ${editData.dir === 'Long' ? 'bg-green-500 text-white' : isDark ? 'bg-slate-700 border border-slate-600 text-slate-400' : 'bg-slate-50 border border-slate-200 text-slate-500'}`,
                                                        children: "↑ LONG"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                        lineNumber: 702,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>handleFieldChange('dir', 'Short'),
                                                        className: `p-2 rounded-xl font-bold text-sm transition-all ${editData.dir === 'Short' ? 'bg-red-500 text-white' : isDark ? 'bg-slate-700 border border-slate-600 text-slate-400' : 'bg-slate-50 border border-slate-200 text-slate-500'}`,
                                                        children: "↓ SHORT"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                        lineNumber: 713,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                lineNumber: 701,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                        lineNumber: 697,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-2 gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: `text-[10px] font-bold uppercase mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-500'}`,
                                                        children: t.entryDate
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                        lineNumber: 730,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "date",
                                                        className: `w-full p-2 border rounded-xl text-sm font-bold outline-none focus:border-blue-500 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-700'}`,
                                                        value: editData.fechaEntrada,
                                                        onChange: (e)=>handleFieldChange('fechaEntrada', e.target.value)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                        lineNumber: 733,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                lineNumber: 729,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: `text-[10px] font-bold uppercase mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-500'}`,
                                                        children: t.exitDate
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                        lineNumber: 743,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "date",
                                                        className: `w-full p-2 border rounded-xl text-sm font-bold outline-none focus:border-blue-500 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-700'}`,
                                                        value: editData.fechaSalida,
                                                        onChange: (e)=>handleFieldChange('fechaSalida', e.target.value)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                        lineNumber: 746,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                lineNumber: 742,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                        lineNumber: 728,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: `text-[10px] font-bold uppercase mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-500'}`,
                                                children: t.tradeTime
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                lineNumber: 759,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "time",
                                                className: `w-full p-2 border rounded-xl text-sm font-bold outline-none focus:border-blue-500 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-700'}`,
                                                value: editData.hora || '',
                                                onChange: (e)=>handleFieldChange('hora', e.target.value)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                lineNumber: 762,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                        lineNumber: 758,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-2 gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: `text-[10px] font-bold uppercase mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-500'}`,
                                                        children: t.lots
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                        lineNumber: 775,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "number",
                                                        step: "0.01",
                                                        className: `w-full p-2 border rounded-xl text-sm font-bold outline-none focus:border-blue-500 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-700'}`,
                                                        value: editData.lotes,
                                                        onChange: (e)=>handleFieldChange('lotes', e.target.value)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                        lineNumber: 778,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                lineNumber: 774,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: `text-[10px] font-bold uppercase mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-500'}`,
                                                        children: [
                                                            t.result,
                                                            " ($)"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                        lineNumber: 789,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: `flex rounded-lg p-0.5 mb-1 ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                onClick: ()=>handleFieldChange('esGanancia', true),
                                                                className: `flex-1 py-1 rounded-md text-[10px] font-bold transition-all ${editData.esGanancia ? 'bg-green-500 text-white' : isDark ? 'text-slate-400' : 'text-slate-500'}`,
                                                                children: "+ WIN"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                                lineNumber: 793,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                onClick: ()=>handleFieldChange('esGanancia', false),
                                                                className: `flex-1 py-1 rounded-md text-[10px] font-bold transition-all ${!editData.esGanancia ? 'bg-red-500 text-white' : isDark ? 'text-slate-400' : 'text-slate-500'}`,
                                                                children: "− LOSS"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                                lineNumber: 802,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                        lineNumber: 792,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "number",
                                                        step: "0.01",
                                                        className: `w-full p-2 border rounded-xl text-sm font-bold outline-none ${editData.esGanancia ? isDark ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-green-50 border-green-200 text-green-600' : isDark ? 'bg-red-500/10 border-red-500/50 text-red-400' : 'bg-red-50 border-red-200 text-red-600'}`,
                                                        value: editData.res,
                                                        onChange: (e)=>handleFieldChange('res', e.target.value)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                        lineNumber: 812,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                lineNumber: 788,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                        lineNumber: 773,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-2 gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: `text-[10px] font-bold uppercase mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-500'}`,
                                                        children: t.entryPrice
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                        lineNumber: 829,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "number",
                                                        step: "0.01",
                                                        placeholder: "-",
                                                        className: `w-full p-2 border rounded-xl text-sm font-bold outline-none focus:border-blue-500 ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-700 placeholder-slate-400'}`,
                                                        value: editData.entrada || '',
                                                        onChange: (e)=>handleFieldChange('entrada', e.target.value)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                        lineNumber: 832,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                lineNumber: 828,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: `text-[10px] font-bold uppercase mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-500'}`,
                                                        children: t.exitPrice
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                        lineNumber: 844,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "number",
                                                        step: "0.01",
                                                        placeholder: "-",
                                                        className: `w-full p-2 border rounded-xl text-sm font-bold outline-none focus:border-blue-500 ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-700 placeholder-slate-400'}`,
                                                        value: editData.salida || '',
                                                        onChange: (e)=>handleFieldChange('salida', e.target.value)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                        lineNumber: 847,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                lineNumber: 843,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                        lineNumber: 827,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: `text-[10px] font-bold uppercase mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-500'}`,
                                                children: t.emotion
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                lineNumber: 862,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                className: `w-full p-2 border rounded-xl text-sm font-bold outline-none focus:border-blue-500 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-700'}`,
                                                value: editData.emo,
                                                onChange: (e)=>handleFieldChange('emo', e.target.value),
                                                children: EMOCIONES.map((e)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: e,
                                                        children: [
                                                            getEmojiForEmotion(e),
                                                            " ",
                                                            e
                                                        ]
                                                    }, e, true, {
                                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                        lineNumber: 873,
                                                        columnNumber: 21
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                lineNumber: 865,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                        lineNumber: 861,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: `text-[10px] font-bold uppercase mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-500'}`,
                                                children: t.swap
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                lineNumber: 880,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "number",
                                                step: "0.01",
                                                placeholder: "0.00",
                                                className: `w-full p-2 border rounded-xl text-sm font-bold outline-none focus:border-amber-500 ${isDark ? 'bg-slate-700 border-slate-600 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-600'}`,
                                                value: editData.swap || '',
                                                onChange: (e)=>handleFieldChange('swap', e.target.value)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                lineNumber: 883,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                        lineNumber: 879,
                                        columnNumber: 15
                                    }, this),
                                    cuentasBroker.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: `text-[10px] font-bold uppercase mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-500'}`,
                                                children: t.account
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                lineNumber: 898,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                className: `w-full p-2 border rounded-xl text-sm font-bold outline-none focus:border-purple-500 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-purple-50 border-purple-200 text-slate-700'}`,
                                                value: editData.cuentaId || '',
                                                onChange: (e)=>handleFieldChange('cuentaId', e.target.value),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "",
                                                        children: t.selectAccount
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                        lineNumber: 908,
                                                        columnNumber: 21
                                                    }, this),
                                                    cuentasBroker.map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: c.id,
                                                            children: [
                                                                c.broker,
                                                                " - #",
                                                                c.numero
                                                            ]
                                                        }, c.id, true, {
                                                            fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                            lineNumber: 910,
                                                            columnNumber: 23
                                                        }, this))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                lineNumber: 901,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                        lineNumber: 897,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `p-3 rounded-xl ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'}`,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                                            size: 16,
                                                            className: isDark ? 'text-slate-400' : 'text-slate-500'
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                            lineNumber: 924,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: editData.fechaEntrada !== editData.fechaSalida ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: `text-sm font-medium ${isDark ? 'text-white' : 'text-slate-700'}`,
                                                                children: [
                                                                    formatDate(editData.fechaEntrada),
                                                                    " → ",
                                                                    formatDate(editData.fechaSalida)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                                lineNumber: 927,
                                                                columnNumber: 25
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: `text-sm font-medium ${isDark ? 'text-white' : 'text-slate-700'}`,
                                                                children: formatDate(editData.fechaSalida || editData.fechaEntrada)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                                lineNumber: 931,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                            lineNumber: 925,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                    lineNumber: 923,
                                                    columnNumber: 19
                                                }, this),
                                                editData.hora && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                            size: 14,
                                                            className: isDark ? 'text-slate-500' : 'text-slate-400'
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                            lineNumber: 939,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: `text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`,
                                                            children: editData.hora
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                            lineNumber: 940,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                    lineNumber: 938,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                            lineNumber: 922,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                        lineNumber: 921,
                                        columnNumber: 15
                                    }, this),
                                    (editData.entrada || editData.salida) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `p-3 rounded-xl ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2 mb-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"], {
                                                        size: 14,
                                                        className: isDark ? 'text-slate-400' : 'text-slate-500'
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                        lineNumber: 950,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: `text-[10px] font-bold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`,
                                                        children: t.prices
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                        lineNumber: 951,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                lineNumber: 949,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-3 gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: `text-[9px] uppercase ${isDark ? 'text-slate-500' : 'text-slate-400'}`,
                                                                children: t.entryPrice
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                                lineNumber: 957,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: `text-base font-bold ${isDark ? 'text-white' : 'text-slate-800'}`,
                                                                children: editData.entrada || '-'
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                                lineNumber: 958,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                        lineNumber: 956,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: `text-[9px] uppercase ${isDark ? 'text-slate-500' : 'text-slate-400'}`,
                                                                children: t.exitPrice
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                                lineNumber: 963,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: `text-base font-bold ${isDark ? 'text-white' : 'text-slate-800'}`,
                                                                children: editData.salida || '-'
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                                lineNumber: 964,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                        lineNumber: 962,
                                                        columnNumber: 21
                                                    }, this),
                                                    trade.puntos !== null && trade.puntos !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: `p-2 -m-2 rounded-lg ${isDark ? 'bg-cyan-500/10' : 'bg-cyan-50'}`,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: `text-[9px] uppercase ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`,
                                                                children: t.points
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                                lineNumber: 970,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: `text-base font-black ${trade.puntos >= 0 ? 'text-cyan-500' : 'text-red-500'}`,
                                                                children: [
                                                                    trade.puntos >= 0 ? '+' : '',
                                                                    trade.puntos.toFixed(1)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                                lineNumber: 971,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                        lineNumber: 969,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                lineNumber: 955,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                        lineNumber: 948,
                                        columnNumber: 17
                                    }, this),
                                    editData.swap > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `p-3 rounded-xl flex items-center justify-between ${isDark ? 'bg-amber-500/10' : 'bg-amber-50'}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: `text-[9px] font-bold uppercase ${isDark ? 'text-amber-400' : 'text-amber-600'}`,
                                                        children: "Swap/Comisión"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                        lineNumber: 984,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-lg font-black text-amber-500",
                                                        children: [
                                                            "-$",
                                                            parseFloat(editData.swap).toFixed(2)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                        lineNumber: 987,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                lineNumber: 983,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__["DollarSign"], {
                                                size: 20,
                                                className: "text-amber-500"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                lineNumber: 991,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                        lineNumber: 982,
                                        columnNumber: 17
                                    }, this),
                                    trade.broker && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `p-3 rounded-xl flex items-center gap-3 ${isDark ? 'bg-purple-500/10' : 'bg-purple-50'}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$briefcase$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Briefcase$3e$__["Briefcase"], {
                                                size: 16,
                                                className: "text-purple-500"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                lineNumber: 998,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: `text-[9px] font-bold uppercase ${isDark ? 'text-purple-400' : 'text-purple-600'}`,
                                                        children: t.account
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                        lineNumber: 1000,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: `text-sm font-bold ${isDark ? 'text-white' : 'text-slate-700'}`,
                                                        children: [
                                                            trade.broker,
                                                            " ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: isDark ? 'text-slate-400' : 'text-slate-500',
                                                                children: [
                                                                    "#",
                                                                    trade.numeroCuenta
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                                lineNumber: 1004,
                                                                columnNumber: 38
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                        lineNumber: 1003,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                lineNumber: 999,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                        lineNumber: 997,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `p-3 rounded-xl flex items-center justify-between ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: `text-[9px] font-bold uppercase ${isDark ? 'text-slate-500' : 'text-slate-400'}`,
                                                        children: t.emotion
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                        lineNumber: 1013,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: `text-base font-medium ${isDark ? 'text-white' : 'text-slate-800'}`,
                                                        children: getEmotionLabel(editData.emo)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                        lineNumber: 1016,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                lineNumber: 1012,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-3xl",
                                                children: getEmojiForEmotion(editData.emo)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                lineNumber: 1020,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                        lineNumber: 1011,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true),
                            trade.checklist && trade.checklist.reglas && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `p-4 rounded-xl ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between mb-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: `text-[10px] font-bold uppercase flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardCheck$3e$__["ClipboardCheck"], {
                                                        size: 12
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                        lineNumber: 1030,
                                                        columnNumber: 19
                                                    }, this),
                                                    " Checklist de Setup"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                lineNumber: 1029,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `text-sm font-black flex items-center gap-1 ${trade.checklist.porcentaje >= 70 ? 'text-green-500' : trade.checklist.porcentaje >= 50 ? 'text-amber-500' : 'text-red-500'}`,
                                                children: [
                                                    trade.checklist.porcentaje >= 70 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                                        size: 14
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                        lineNumber: 1036,
                                                        columnNumber: 55
                                                    }, this) : trade.checklist.porcentaje >= 50 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                                        size: 14
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                        lineNumber: 1037,
                                                        columnNumber: 55
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"], {
                                                        size: 14
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                        lineNumber: 1037,
                                                        columnNumber: 84
                                                    }, this),
                                                    trade.checklist.porcentaje,
                                                    "%"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                lineNumber: 1032,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                        lineNumber: 1028,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `w-full h-2 rounded-full mb-3 ${isDark ? 'bg-slate-600' : 'bg-slate-200'}`,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `h-full rounded-full ${trade.checklist.porcentaje >= 70 ? 'bg-green-500' : trade.checklist.porcentaje >= 50 ? 'bg-amber-500' : 'bg-red-500'}`,
                                            style: {
                                                width: `${trade.checklist.porcentaje}%`
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                            lineNumber: 1043,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                        lineNumber: 1042,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-1.5",
                                        children: trade.checklist.reglas.map((regla, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: `w-4 h-4 rounded flex items-center justify-center flex-shrink-0 ${regla.cumplida ? 'bg-green-500' : isDark ? 'bg-slate-600' : 'bg-slate-300'}`,
                                                        children: regla.cumplida && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                            className: "w-3 h-3 text-white",
                                                            fill: "none",
                                                            viewBox: "0 0 24 24",
                                                            stroke: "currentColor",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                strokeLinecap: "round",
                                                                strokeLinejoin: "round",
                                                                strokeWidth: 3,
                                                                d: "M5 13l4 4L19 7"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                                lineNumber: 1059,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                            lineNumber: 1058,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                        lineNumber: 1054,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: `text-xs ${regla.cumplida ? isDark ? 'text-green-400' : 'text-green-600' : isDark ? 'text-slate-500' : 'text-slate-400'}`,
                                                        children: regla.nombre
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                        lineNumber: 1063,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, idx, true, {
                                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                lineNumber: 1053,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                        lineNumber: 1051,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                lineNumber: 1027,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: `text-[10px] font-bold uppercase mb-2 flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__["Image"], {
                                                size: 12
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                lineNumber: 1079,
                                                columnNumber: 15
                                            }, this),
                                            " ",
                                            t.screenshots
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                        lineNumber: 1078,
                                        columnNumber: 13
                                    }, this),
                                    imagenes.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-3 mb-3",
                                        children: imagenes.map((img, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `p-2 rounded-xl border ${isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border-slate-200'}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "relative w-full aspect-square rounded-xl overflow-hidden border-2 border-blue-500 cursor-pointer hover:opacity-90 mb-2",
                                                        onClick: ()=>openImageViewer(img),
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                            src: img.data,
                                                            alt: `Captura ${index + 1}`,
                                                            className: "w-full h-full object-cover"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                            lineNumber: 1092,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                        lineNumber: 1088,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                value: img.temporalidad,
                                                                onChange: (e)=>handleTemporalidadChange(index, e.target.value),
                                                                className: `flex-1 p-2 border rounded-lg text-sm font-bold outline-none focus:border-blue-500 ${isDark ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-slate-200 text-slate-700'}`,
                                                                children: TEMPORALIDADES.map((temp)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        value: temp,
                                                                        children: temp
                                                                    }, temp, false, {
                                                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                                        lineNumber: 1107,
                                                                        columnNumber: 27
                                                                    }, this))
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                                lineNumber: 1097,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                onClick: ()=>analyzeWithAI(index),
                                                                disabled: analyzingIndex === index || !canMakeQuery(),
                                                                className: `p-2 rounded-lg flex-shrink-0 transition-colors ${!canMakeQuery() ? 'bg-slate-500/20 text-slate-400 cursor-not-allowed' : analyzingIndex === index ? 'bg-purple-500/20 text-purple-400 cursor-wait' : aiAnalysis[index]?.text ? 'bg-purple-500/20 text-purple-500 hover:bg-purple-500/30' : isDark ? 'hover:bg-purple-500/20 text-purple-400' : 'hover:bg-purple-100 text-purple-500'}`,
                                                                title: canMakeQuery() ? `${t.analyzeWithAI} (${queriesRemaining} ${t.queriesRemaining})` : t.queryLimitReached,
                                                                children: analyzingIndex === index ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                                    size: 18,
                                                                    className: "animate-spin"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                                    lineNumber: 1130,
                                                                    columnNumber: 27
                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__["Bot"], {
                                                                    size: 24
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                                    lineNumber: 1132,
                                                                    columnNumber: 27
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                                lineNumber: 1112,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                onClick: ()=>removeImage(index),
                                                                className: "p-2 rounded-lg hover:bg-red-500/20 text-red-500 flex-shrink-0",
                                                                title: "Eliminar imagen",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                                    size: 18
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                                    lineNumber: 1143,
                                                                    columnNumber: 25
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                                lineNumber: 1137,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                        lineNumber: 1096,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: `flex items-center justify-between mt-2 px-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-[10px] flex items-center gap-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__["Bot"], {
                                                                        size: 16
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                                        lineNumber: 1150,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    queriesRemaining,
                                                                    "/",
                                                                    aiQueriesLimit,
                                                                    " ",
                                                                    t.queriesRemaining
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                                lineNumber: 1149,
                                                                columnNumber: 23
                                                            }, this),
                                                            !canMakeQuery() && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-[10px] text-amber-500 font-medium",
                                                                children: t.queryLimitReached
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                                lineNumber: 1154,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                        lineNumber: 1148,
                                                        columnNumber: 21
                                                    }, this),
                                                    aiAnalysis[index] && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: `mt-2 rounded-lg overflow-hidden ${isDark ? 'bg-purple-500/10 border border-purple-500/30' : 'bg-purple-50 border border-purple-200'}`,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                onClick: ()=>toggleAnalysisExpanded(index),
                                                                className: `w-full px-3 py-2 flex items-center justify-between ${isDark ? 'hover:bg-purple-500/20' : 'hover:bg-purple-100'}`,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: `text-xs font-bold flex items-center gap-2 ${isDark ? 'text-purple-400' : 'text-purple-600'}`,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__["Bot"], {
                                                                                size: 18
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                                                lineNumber: 1175,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            t.aiAnalysis
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                                        lineNumber: 1172,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: `text-[10px] ${isDark ? 'text-purple-400' : 'text-purple-500'}`,
                                                                        children: aiAnalysis[index]?.expanded ? t.hideAnalysis : t.showAnalysis
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                                        lineNumber: 1178,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                                lineNumber: 1165,
                                                                columnNumber: 25
                                                            }, this),
                                                            aiAnalysis[index]?.expanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: `px-3 pb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`,
                                                                children: aiAnalysis[index]?.error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-red-500 text-sm",
                                                                    children: [
                                                                        t.aiError,
                                                                        ": ",
                                                                        aiAnalysis[index].error
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                                    lineNumber: 1186,
                                                                    columnNumber: 31
                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "text-xs leading-relaxed whitespace-pre-wrap line-clamp-6",
                                                                            children: aiAnalysis[index]?.text
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                                            lineNumber: 1189,
                                                                            columnNumber: 33
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            type: "button",
                                                                            onClick: ()=>setShowPostTradeModal(true),
                                                                            className: `mt-2 w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors ${isDark ? 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-400' : 'bg-purple-100 hover:bg-purple-200 text-purple-600'}`,
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                                                    size: 14
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                                                    lineNumber: 1201,
                                                                                    columnNumber: 35
                                                                                }, this),
                                                                                language === 'es' ? 'Ver análisis completo' : 'View full analysis'
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                                            lineNumber: 1192,
                                                                            columnNumber: 33
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                                lineNumber: 1184,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                        lineNumber: 1162,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, index, true, {
                                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                lineNumber: 1086,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                        lineNumber: 1084,
                                        columnNumber: 15
                                    }, this),
                                    imagenes.length < 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "file",
                                                accept: "image/*",
                                                onChange: async (e)=>{
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        await agregarImagen(file);
                                                    }
                                                    e.target.value = '';
                                                },
                                                className: "hidden",
                                                id: "trade-detail-add-image"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                lineNumber: 1218,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                htmlFor: "trade-detail-add-image",
                                                className: `flex items-center justify-center gap-2 p-3 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${isDark ? 'border-slate-600 hover:border-blue-500 text-slate-400 hover:text-blue-400' : 'border-slate-300 hover:border-blue-500 text-slate-400 hover:text-blue-500'}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PlusCircle$3e$__["PlusCircle"], {
                                                        size: 18
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                        lineNumber: 1239,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-sm font-bold",
                                                        children: imagenes.length === 0 ? t.addScreenshot : t.addAnotherScreenshot
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                        lineNumber: 1240,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                lineNumber: 1231,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                        lineNumber: 1217,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                lineNumber: 1077,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: `text-[10px] font-bold uppercase mb-2 flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                size: 12
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                                lineNumber: 1251,
                                                columnNumber: 15
                                            }, this),
                                            " ",
                                            t.notes
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                        lineNumber: 1250,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                        placeholder: t.notesPlaceholder,
                                        rows: 4,
                                        className: `w-full p-3 border rounded-xl text-sm outline-none focus:border-blue-500 resize-none ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'}`,
                                        value: notas,
                                        onChange: (e)=>handleNotasChange(e.target.value)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                        lineNumber: 1253,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                lineNumber: 1249,
                                columnNumber: 11
                            }, this),
                            hasChanges && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleSaveChanges,
                                disabled: isSaving,
                                className: "w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 transition-colors",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__["Save"], {
                                        size: 18
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                        lineNumber: 1273,
                                        columnNumber: 15
                                    }, this),
                                    isSaving ? t.saving : t.saveChanges
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                lineNumber: 1268,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                        lineNumber: 692,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `p-4 border-t flex justify-between ${isDark ? 'border-slate-700' : 'border-slate-200'}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleDelete,
                                className: "px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-sm font-bold rounded-lg flex items-center gap-2 transition-colors",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                        size: 16
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                        lineNumber: 1285,
                                        columnNumber: 13
                                    }, this),
                                    t.delete
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                lineNumber: 1281,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onClose,
                                className: `px-6 py-2 rounded-lg text-sm font-bold transition-colors ${isDark ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`,
                                children: t.close
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                lineNumber: 1288,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                        lineNumber: 1280,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                lineNumber: 611,
                columnNumber: 7
            }, this),
            viewingImage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black/95 flex flex-col z-[60]",
                onClick: closeImageViewer,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between p-4 bg-black/50",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-white font-bold text-sm bg-white/20 px-3 py-1 rounded-full",
                                        children: viewingImage.temporalidad
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                        lineNumber: 1310,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-white/60 text-xs",
                                        children: [
                                            Math.round(zoom * 100),
                                            "%"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                        lineNumber: 1313,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                lineNumber: 1309,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: (e)=>{
                                            e.stopPropagation();
                                            handleZoomOut();
                                        },
                                        className: "p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors",
                                        disabled: zoom <= 1,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zoom$2d$out$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ZoomOut$3e$__["ZoomOut"], {
                                            size: 20,
                                            className: zoom <= 1 ? 'text-white/30' : 'text-white'
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                            lineNumber: 1325,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                        lineNumber: 1320,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: (e)=>{
                                            e.stopPropagation();
                                            handleZoomIn();
                                        },
                                        className: "p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors",
                                        disabled: zoom >= 4,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zoom$2d$in$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ZoomIn$3e$__["ZoomIn"], {
                                            size: 20,
                                            className: zoom >= 4 ? 'text-white/30' : 'text-white'
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                            lineNumber: 1332,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                        lineNumber: 1327,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: (e)=>{
                                            e.stopPropagation();
                                            resetZoom();
                                        },
                                        className: "p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__["RotateCcw"], {
                                            size: 20,
                                            className: "text-white"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                            lineNumber: 1338,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                        lineNumber: 1334,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: closeImageViewer,
                                        className: "p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors ml-2",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                            size: 20,
                                            className: "text-white"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                            lineNumber: 1344,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                        lineNumber: 1340,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                                lineNumber: 1318,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                        lineNumber: 1308,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: imageContainerRef,
                        className: "flex-1 flex items-center justify-center overflow-hidden touch-none",
                        onClick: (e)=>e.stopPropagation(),
                        onTouchStart: handleTouchStart,
                        onTouchMove: handleTouchMove,
                        onTouchEnd: handleTouchEnd,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: viewingImage.data,
                            alt: `Captura ${viewingImage.temporalidad}`,
                            className: "max-w-full max-h-full object-contain transition-transform duration-100",
                            style: {
                                transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                                cursor: zoom > 1 ? 'grab' : 'zoom-in'
                            },
                            onClick: handleImageClick,
                            draggable: false
                        }, void 0, false, {
                            fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                            lineNumber: 1358,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                        lineNumber: 1350,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-3 text-center bg-black/50",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-white/50 text-xs",
                            children: zoom === 1 ? 'Toca para hacer zoom · Pellizca para ajustar' : 'Arrastra para mover · Toca para restablecer'
                        }, void 0, false, {
                            fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                            lineNumber: 1373,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                        lineNumber: 1372,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                lineNumber: 1303,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$PostTradeResultModal$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                isOpen: showPostTradeModal,
                onClose: ()=>setShowPostTradeModal(false),
                analysis: Object.values(aiAnalysis).find((a)=>a?.text)?.text || '',
                trade: {
                    activo: editData.activo,
                    dir: editData.dir,
                    res: editData.esGanancia ? Math.abs(editData.res) : -Math.abs(editData.res),
                    entrada: editData.entrada,
                    salida: editData.salida
                },
                image: imagenes[0]
            }, void 0, false, {
                fileName: "[project]/src/app/components/TradeDetailModal.jsx",
                lineNumber: 1381,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/components/TradeDetailModal.jsx",
        lineNumber: 610,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=src_app_components_TradeDetailModal_jsx_5ba04e12._.js.map