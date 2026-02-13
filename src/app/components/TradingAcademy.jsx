"use client";
import { useState, useEffect } from 'react';
import {
  GraduationCap, BookOpen, TrendingUp, BarChart3, CandlestickChart,
  ChevronRight, ChevronDown, CheckCircle2, Circle, Lock, X,
  ArrowUp, ArrowDown, Target, Layers, BookMarked, Award, Zap,
  ArrowLeft, ChevronLeft
} from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useLanguage } from './LanguageProvider';
import { db } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// =====================================================
// SVG DIAGRAM COMPONENTS
// =====================================================

// Support and Resistance Diagram
const SupportResistanceSVG = ({ isDark }) => (
  <svg viewBox="0 0 400 200" className="w-full h-48">
    {/* Background grid */}
    <defs>
      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke={isDark ? '#334155' : '#e2e8f0'} strokeWidth="0.5"/>
      </pattern>
    </defs>
    <rect width="400" height="200" fill={isDark ? '#1e293b' : '#f8fafc'}/>
    <rect width="400" height="200" fill="url(#grid)"/>

    {/* Resistance line */}
    <line x1="20" y1="50" x2="380" y2="50" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5"/>
    <text x="385" y="55" fill="#ef4444" fontSize="12" fontWeight="bold">Resistencia</text>

    {/* Support line */}
    <line x1="20" y1="150" x2="380" y2="150" stroke="#22c55e" strokeWidth="2" strokeDasharray="5,5"/>
    <text x="385" y="155" fill="#22c55e" fontSize="12" fontWeight="bold">Soporte</text>

    {/* Price action bouncing */}
    <path
      d="M 30 100 L 60 60 L 90 80 L 120 55 L 150 90 L 180 145 L 210 120 L 240 145 L 270 100 L 300 55 L 330 80 L 360 60"
      fill="none"
      stroke={isDark ? '#60a5fa' : '#3b82f6'}
      strokeWidth="2"
    />

    {/* Bounce arrows */}
    <circle cx="120" cy="55" r="6" fill="#ef4444" opacity="0.8"/>
    <circle cx="300" cy="55" r="6" fill="#ef4444" opacity="0.8"/>
    <circle cx="180" cy="145" r="6" fill="#22c55e" opacity="0.8"/>
    <circle cx="240" cy="145" r="6" fill="#22c55e" opacity="0.8"/>
  </svg>
);

// Trend Lines Diagram
const TrendLineSVG = ({ isDark }) => (
  <svg viewBox="0 0 400 200" className="w-full h-48">
    <rect width="400" height="200" fill={isDark ? '#1e293b' : '#f8fafc'}/>

    {/* Uptrend */}
    <g transform="translate(0, 0)">
      <text x="100" y="20" fill={isDark ? '#fff' : '#1e293b'} fontSize="12" fontWeight="bold" textAnchor="middle">Tendencia Alcista</text>
      <line x1="20" y1="180" x2="180" y2="40" stroke="#22c55e" strokeWidth="2"/>
      <path d="M 20 160 L 50 120 L 80 140 L 110 100 L 140 120 L 170 60" fill="none" stroke={isDark ? '#60a5fa' : '#3b82f6'} strokeWidth="2"/>
      <circle cx="20" cy="160" r="4" fill="#22c55e"/>
      <circle cx="80" cy="140" r="4" fill="#22c55e"/>
      <circle cx="140" cy="120" r="4" fill="#22c55e"/>
    </g>

    {/* Downtrend */}
    <g transform="translate(200, 0)">
      <text x="100" y="20" fill={isDark ? '#fff' : '#1e293b'} fontSize="12" fontWeight="bold" textAnchor="middle">Tendencia Bajista</text>
      <line x1="20" y1="40" x2="180" y2="180" stroke="#ef4444" strokeWidth="2"/>
      <path d="M 20 60 L 50 100 L 80 80 L 110 120 L 140 100 L 170 160" fill="none" stroke={isDark ? '#60a5fa' : '#3b82f6'} strokeWidth="2"/>
      <circle cx="50" cy="100" r="4" fill="#ef4444"/>
      <circle cx="110" cy="120" r="4" fill="#ef4444"/>
      <circle cx="170" cy="160" r="4" fill="#ef4444"/>
    </g>
  </svg>
);

// Channel Diagram
const ChannelSVG = ({ isDark }) => (
  <svg viewBox="0 0 400 200" className="w-full h-48">
    <rect width="400" height="200" fill={isDark ? '#1e293b' : '#f8fafc'}/>

    {/* Ascending channel */}
    <g transform="translate(0, 0)">
      <text x="100" y="20" fill={isDark ? '#fff' : '#1e293b'} fontSize="11" fontWeight="bold" textAnchor="middle">Canal Ascendente</text>
      {/* Upper line */}
      <line x1="20" y1="60" x2="180" y2="30" stroke="#22c55e" strokeWidth="2"/>
      {/* Lower line */}
      <line x1="20" y1="140" x2="180" y2="110" stroke="#22c55e" strokeWidth="2"/>
      {/* Price zigzag */}
      <path d="M 25 130 L 50 70 L 75 120 L 100 60 L 125 110 L 150 50 L 175 100" fill="none" stroke={isDark ? '#60a5fa' : '#3b82f6'} strokeWidth="2"/>
      {/* Fill */}
      <path d="M 20 60 L 180 30 L 180 110 L 20 140 Z" fill="#22c55e" opacity="0.1"/>
    </g>

    {/* Descending channel */}
    <g transform="translate(200, 0)">
      <text x="100" y="20" fill={isDark ? '#fff' : '#1e293b'} fontSize="11" fontWeight="bold" textAnchor="middle">Canal Descendente</text>
      <line x1="20" y1="30" x2="180" y2="80" stroke="#ef4444" strokeWidth="2"/>
      <line x1="20" y1="100" x2="180" y2="150" stroke="#ef4444" strokeWidth="2"/>
      <path d="M 25 40 L 50 90 L 75 50 L 100 100 L 125 70 L 150 120 L 175 90" fill="none" stroke={isDark ? '#60a5fa' : '#3b82f6'} strokeWidth="2"/>
      <path d="M 20 30 L 180 80 L 180 150 L 20 100 Z" fill="#ef4444" opacity="0.1"/>
    </g>

    {/* Horizontal channel */}
    <text x="200" y="175" fill={isDark ? '#94a3b8' : '#64748b'} fontSize="10" textAnchor="middle">Los canales muestran zonas de trading entre dos lineas paralelas</text>
  </svg>
);

// Candlestick Types Diagram
const CandlestickTypesSVG = ({ isDark }) => (
  <svg viewBox="0 0 400 220" className="w-full h-56">
    <rect width="400" height="220" fill={isDark ? '#1e293b' : '#f8fafc'}/>

    {/* Bullish candle */}
    <g transform="translate(30, 30)">
      <text x="25" y="0" fill={isDark ? '#fff' : '#1e293b'} fontSize="10" fontWeight="bold" textAnchor="middle">Alcista</text>
      <line x1="25" y1="20" x2="25" y2="40" stroke="#22c55e" strokeWidth="1"/>
      <rect x="15" y="40" width="20" height="60" fill="#22c55e" rx="2"/>
      <line x1="25" y1="100" x2="25" y2="120" stroke="#22c55e" strokeWidth="1"/>
      <text x="25" y="140" fill={isDark ? '#94a3b8' : '#64748b'} fontSize="8" textAnchor="middle">Cuerpo verde</text>
      <text x="25" y="150" fill={isDark ? '#94a3b8' : '#64748b'} fontSize="8" textAnchor="middle">Cierre {'>'} Apertura</text>
    </g>

    {/* Bearish candle */}
    <g transform="translate(100, 30)">
      <text x="25" y="0" fill={isDark ? '#fff' : '#1e293b'} fontSize="10" fontWeight="bold" textAnchor="middle">Bajista</text>
      <line x1="25" y1="20" x2="25" y2="40" stroke="#ef4444" strokeWidth="1"/>
      <rect x="15" y="40" width="20" height="60" fill="#ef4444" rx="2"/>
      <line x1="25" y1="100" x2="25" y2="120" stroke="#ef4444" strokeWidth="1"/>
      <text x="25" y="140" fill={isDark ? '#94a3b8' : '#64748b'} fontSize="8" textAnchor="middle">Cuerpo rojo</text>
      <text x="25" y="150" fill={isDark ? '#94a3b8' : '#64748b'} fontSize="8" textAnchor="middle">Cierre {'<'} Apertura</text>
    </g>

    {/* Doji */}
    <g transform="translate(170, 30)">
      <text x="25" y="0" fill={isDark ? '#fff' : '#1e293b'} fontSize="10" fontWeight="bold" textAnchor="middle">Doji</text>
      <line x1="25" y1="20" x2="25" y2="60" stroke={isDark ? '#94a3b8' : '#64748b'} strokeWidth="1"/>
      <line x1="15" y1="60" x2="35" y2="60" stroke={isDark ? '#94a3b8' : '#64748b'} strokeWidth="2"/>
      <line x1="25" y1="60" x2="25" y2="100" stroke={isDark ? '#94a3b8' : '#64748b'} strokeWidth="1"/>
      <text x="25" y="125" fill={isDark ? '#94a3b8' : '#64748b'} fontSize="8" textAnchor="middle">Indecision</text>
      <text x="25" y="135" fill={isDark ? '#94a3b8' : '#64748b'} fontSize="8" textAnchor="middle">Apertura = Cierre</text>
    </g>

    {/* Hammer */}
    <g transform="translate(240, 30)">
      <text x="25" y="0" fill={isDark ? '#fff' : '#1e293b'} fontSize="10" fontWeight="bold" textAnchor="middle">Martillo</text>
      <rect x="18" y="30" width="14" height="15" fill="#22c55e" rx="2"/>
      <line x1="25" y1="45" x2="25" y2="100" stroke="#22c55e" strokeWidth="1"/>
      <text x="25" y="125" fill={isDark ? '#94a3b8' : '#64748b'} fontSize="8" textAnchor="middle">Reversal alcista</text>
      <text x="25" y="135" fill={isDark ? '#94a3b8' : '#64748b'} fontSize="8" textAnchor="middle">Mecha larga abajo</text>
    </g>

    {/* Shooting Star */}
    <g transform="translate(310, 30)">
      <text x="25" y="0" fill={isDark ? '#fff' : '#1e293b'} fontSize="10" fontWeight="bold" textAnchor="middle">Estrella</text>
      <line x1="25" y1="20" x2="25" y2="75" stroke="#ef4444" strokeWidth="1"/>
      <rect x="18" y="75" width="14" height="15" fill="#ef4444" rx="2"/>
      <line x1="25" y1="90" x2="25" y2="100" stroke="#ef4444" strokeWidth="1"/>
      <text x="25" y="125" fill={isDark ? '#94a3b8' : '#64748b'} fontSize="8" textAnchor="middle">Reversal bajista</text>
      <text x="25" y="135" fill={isDark ? '#94a3b8' : '#64748b'} fontSize="8" textAnchor="middle">Mecha larga arriba</text>
    </g>

    {/* Anatomy labels */}
    <g transform="translate(30, 165)">
      <text x="185" y="15" fill={isDark ? '#fff' : '#1e293b'} fontSize="9" textAnchor="middle" fontWeight="bold">Anatomia de una vela:</text>
      <text x="185" y="30" fill={isDark ? '#94a3b8' : '#64748b'} fontSize="8" textAnchor="middle">Mecha superior = Maximo | Cuerpo = Apertura/Cierre | Mecha inferior = Minimo</text>
    </g>
  </svg>
);

// Engulfing Pattern
const EngulfingPatternSVG = ({ isDark }) => (
  <svg viewBox="0 0 400 180" className="w-full h-44">
    <rect width="400" height="180" fill={isDark ? '#1e293b' : '#f8fafc'}/>

    {/* Bullish Engulfing */}
    <g transform="translate(40, 20)">
      <text x="60" y="0" fill={isDark ? '#fff' : '#1e293b'} fontSize="11" fontWeight="bold" textAnchor="middle">Envolvente Alcista</text>
      {/* Small bearish */}
      <line x1="40" y1="25" x2="40" y2="35" stroke="#ef4444" strokeWidth="1"/>
      <rect x="30" y="35" width="20" height="30" fill="#ef4444" rx="2"/>
      <line x1="40" y1="65" x2="40" y2="80" stroke="#ef4444" strokeWidth="1"/>
      {/* Large bullish */}
      <line x1="80" y1="20" x2="80" y2="30" stroke="#22c55e" strokeWidth="1"/>
      <rect x="65" y="30" width="30" height="55" fill="#22c55e" rx="2"/>
      <line x1="80" y1="85" x2="80" y2="95" stroke="#22c55e" strokeWidth="1"/>
      {/* Arrow */}
      <path d="M 110 60 L 130 40" fill="none" stroke="#22c55e" strokeWidth="2" markerEnd="url(#arrowGreen)"/>
      <text x="60" y="115" fill={isDark ? '#94a3b8' : '#64748b'} fontSize="9" textAnchor="middle">Senal de compra</text>
    </g>

    {/* Bearish Engulfing */}
    <g transform="translate(220, 20)">
      <text x="60" y="0" fill={isDark ? '#fff' : '#1e293b'} fontSize="11" fontWeight="bold" textAnchor="middle">Envolvente Bajista</text>
      {/* Small bullish */}
      <line x1="40" y1="25" x2="40" y2="35" stroke="#22c55e" strokeWidth="1"/>
      <rect x="30" y="35" width="20" height="30" fill="#22c55e" rx="2"/>
      <line x1="40" y1="65" x2="40" y2="80" stroke="#22c55e" strokeWidth="1"/>
      {/* Large bearish */}
      <line x1="80" y1="20" x2="80" y2="30" stroke="#ef4444" strokeWidth="1"/>
      <rect x="65" y="30" width="30" height="55" fill="#ef4444" rx="2"/>
      <line x1="80" y1="85" x2="80" y2="95" stroke="#ef4444" strokeWidth="1"/>
      {/* Arrow */}
      <path d="M 110 50 L 130 70" fill="none" stroke="#ef4444" strokeWidth="2"/>
      <text x="60" y="115" fill={isDark ? '#94a3b8' : '#64748b'} fontSize="9" textAnchor="middle">Senal de venta</text>
    </g>

    <text x="200" y="155" fill={isDark ? '#94a3b8' : '#64748b'} fontSize="9" textAnchor="middle">La vela grande "envuelve" completamente a la anterior</text>
  </svg>
);

// Double Top/Bottom
const DoublePatternSVG = ({ isDark }) => (
  <svg viewBox="0 0 400 180" className="w-full h-44">
    <rect width="400" height="180" fill={isDark ? '#1e293b' : '#f8fafc'}/>

    {/* Double Top */}
    <g transform="translate(10, 10)">
      <text x="90" y="10" fill={isDark ? '#fff' : '#1e293b'} fontSize="11" fontWeight="bold" textAnchor="middle">Doble Techo</text>
      <path d="M 20 120 L 50 40 L 80 80 L 110 40 L 140 120 L 170 140" fill="none" stroke={isDark ? '#60a5fa' : '#3b82f6'} strokeWidth="2"/>
      <line x1="20" y1="40" x2="140" y2="40" stroke="#ef4444" strokeWidth="1" strokeDasharray="4,2"/>
      <line x1="20" y1="80" x2="140" y2="80" stroke="#22c55e" strokeWidth="1" strokeDasharray="4,2"/>
      <text x="155" y="43" fill="#ef4444" fontSize="8">Resistencia</text>
      <text x="155" y="83" fill="#22c55e" fontSize="8">Neckline</text>
      <circle cx="50" cy="40" r="4" fill="#ef4444"/>
      <circle cx="110" cy="40" r="4" fill="#ef4444"/>
      <text x="90" y="160" fill={isDark ? '#94a3b8' : '#64748b'} fontSize="8" textAnchor="middle">Patron de reversal bajista</text>
    </g>

    {/* Double Bottom */}
    <g transform="translate(200, 10)">
      <text x="90" y="10" fill={isDark ? '#fff' : '#1e293b'} fontSize="11" fontWeight="bold" textAnchor="middle">Doble Piso</text>
      <path d="M 20 40 L 50 120 L 80 80 L 110 120 L 140 40 L 170 20" fill="none" stroke={isDark ? '#60a5fa' : '#3b82f6'} strokeWidth="2"/>
      <line x1="20" y1="120" x2="140" y2="120" stroke="#22c55e" strokeWidth="1" strokeDasharray="4,2"/>
      <line x1="20" y1="80" x2="140" y2="80" stroke="#ef4444" strokeWidth="1" strokeDasharray="4,2"/>
      <text x="155" y="123" fill="#22c55e" fontSize="8">Soporte</text>
      <text x="155" y="83" fill="#ef4444" fontSize="8">Neckline</text>
      <circle cx="50" cy="120" r="4" fill="#22c55e"/>
      <circle cx="110" cy="120" r="4" fill="#22c55e"/>
      <text x="90" y="160" fill={isDark ? '#94a3b8' : '#64748b'} fontSize="8" textAnchor="middle">Patron de reversal alcista</text>
    </g>
  </svg>
);

// Head and Shoulders
const HeadShouldersSVG = ({ isDark }) => (
  <svg viewBox="0 0 400 180" className="w-full h-44">
    <rect width="400" height="180" fill={isDark ? '#1e293b' : '#f8fafc'}/>

    <text x="200" y="15" fill={isDark ? '#fff' : '#1e293b'} fontSize="12" fontWeight="bold" textAnchor="middle">Hombro-Cabeza-Hombro (HCH)</text>

    {/* Pattern */}
    <path d="M 30 130 L 70 80 L 100 110 L 150 30 L 200 110 L 250 80 L 290 130 L 350 150"
          fill="none" stroke={isDark ? '#60a5fa' : '#3b82f6'} strokeWidth="2.5"/>

    {/* Neckline */}
    <line x1="100" y1="110" x2="290" y2="110" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,3"/>

    {/* Labels */}
    <text x="70" y="70" fill={isDark ? '#94a3b8' : '#64748b'} fontSize="9" textAnchor="middle">Hombro Izq</text>
    <text x="150" y="22" fill={isDark ? '#94a3b8' : '#64748b'} fontSize="9" textAnchor="middle">Cabeza</text>
    <text x="250" y="70" fill={isDark ? '#94a3b8' : '#64748b'} fontSize="9" textAnchor="middle">Hombro Der</text>
    <text x="320" y="105" fill="#ef4444" fontSize="9">Neckline</text>

    {/* Breakdown arrow */}
    <path d="M 290 120 L 320 150" fill="none" stroke="#ef4444" strokeWidth="2"/>
    <polygon points="320,150 315,140 325,142" fill="#ef4444"/>

    <text x="200" y="170" fill={isDark ? '#94a3b8' : '#64748b'} fontSize="9" textAnchor="middle">Patron de reversal bajista - Ruptura del neckline confirma la senal</text>
  </svg>
);

// Order Book / Order Flow
const OrderBookSVG = ({ isDark }) => (
  <svg viewBox="0 0 400 200" className="w-full h-52">
    <rect width="400" height="200" fill={isDark ? '#1e293b' : '#f8fafc'}/>

    <text x="200" y="18" fill={isDark ? '#fff' : '#1e293b'} fontSize="12" fontWeight="bold" textAnchor="middle">Libro de Ordenes (Order Book)</text>

    {/* Buy side */}
    <g transform="translate(30, 35)">
      <text x="70" y="0" fill="#22c55e" fontSize="10" fontWeight="bold" textAnchor="middle">COMPRADORES (Bids)</text>
      <rect x="0" y="10" width="140" height="20" fill="#22c55e" opacity="0.8" rx="2"/>
      <text x="70" y="24" fill="white" fontSize="9" textAnchor="middle">$50,000 - 15.5 BTC</text>
      <rect x="20" y="35" width="100" height="20" fill="#22c55e" opacity="0.6" rx="2"/>
      <text x="70" y="49" fill="white" fontSize="9" textAnchor="middle">$49,950 - 8.2 BTC</text>
      <rect x="40" y="60" width="60" height="20" fill="#22c55e" opacity="0.4" rx="2"/>
      <text x="70" y="74" fill={isDark ? '#fff' : '#1e293b'} fontSize="9" textAnchor="middle">$49,900 - 3.1 BTC</text>
    </g>

    {/* Sell side */}
    <g transform="translate(230, 35)">
      <text x="70" y="0" fill="#ef4444" fontSize="10" fontWeight="bold" textAnchor="middle">VENDEDORES (Asks)</text>
      <rect x="0" y="10" width="140" height="20" fill="#ef4444" opacity="0.8" rx="2"/>
      <text x="70" y="24" fill="white" fontSize="9" textAnchor="middle">$50,100 - 12.3 BTC</text>
      <rect x="20" y="35" width="100" height="20" fill="#ef4444" opacity="0.6" rx="2"/>
      <text x="70" y="49" fill="white" fontSize="9" textAnchor="middle">$50,150 - 6.8 BTC</text>
      <rect x="40" y="60" width="60" height="20" fill="#ef4444" opacity="0.4" rx="2"/>
      <text x="70" y="74" fill={isDark ? '#fff' : '#1e293b'} fontSize="9" textAnchor="middle">$50,200 - 2.4 BTC</text>
    </g>

    {/* Current price */}
    <rect x="150" y="70" width="100" height="25" fill={isDark ? '#3b82f6' : '#2563eb'} rx="4"/>
    <text x="200" y="87" fill="white" fontSize="11" fontWeight="bold" textAnchor="middle">$50,050</text>

    {/* Explanation */}
    <text x="200" y="135" fill={isDark ? '#94a3b8' : '#64748b'} fontSize="9" textAnchor="middle">Las barras muestran la liquidez en cada nivel de precio</text>
    <text x="200" y="150" fill={isDark ? '#94a3b8' : '#64748b'} fontSize="9" textAnchor="middle">Mayor liquidez = zona de interes para el precio</text>
    <text x="200" y="165" fill={isDark ? '#94a3b8' : '#64748b'} fontSize="9" textAnchor="middle">Los grandes traders colocan ordenes en estas zonas</text>
  </svg>
);

// Accumulation/Distribution (Wyckoff)
const WyckoffSVG = ({ isDark }) => (
  <svg viewBox="0 0 400 220" className="w-full h-56">
    <rect width="400" height="220" fill={isDark ? '#1e293b' : '#f8fafc'}/>

    {/* Accumulation */}
    <g transform="translate(10, 10)">
      <text x="95" y="12" fill={isDark ? '#fff' : '#1e293b'} fontSize="11" fontWeight="bold" textAnchor="middle">ACUMULACION</text>
      <text x="95" y="24" fill="#22c55e" fontSize="9" textAnchor="middle">(Grandes compran en silencio)</text>

      {/* Range box */}
      <rect x="10" y="35" width="170" height="50" fill="#22c55e" opacity="0.1" stroke="#22c55e" strokeDasharray="4,2"/>

      {/* Price action */}
      <path d="M 15 80 L 30 45 L 45 75 L 60 50 L 75 70 L 90 55 L 105 72 L 120 48 L 135 68 L 150 52 L 165 65 L 180 30"
            fill="none" stroke={isDark ? '#60a5fa' : '#3b82f6'} strokeWidth="2"/>

      {/* Breakout arrow */}
      <path d="M 175 35 L 185 20" fill="none" stroke="#22c55e" strokeWidth="2"/>
      <polygon points="185,20 178,25 182,30" fill="#22c55e"/>

      {/* Labels */}
      <text x="95" y="100" fill={isDark ? '#94a3b8' : '#64748b'} fontSize="8" textAnchor="middle">Rango lateral</text>
      <text x="95" y="112" fill={isDark ? '#94a3b8' : '#64748b'} fontSize="8" textAnchor="middle">Volumen bajo</text>
    </g>

    {/* Distribution */}
    <g transform="translate(200, 10)">
      <text x="95" y="12" fill={isDark ? '#fff' : '#1e293b'} fontSize="11" fontWeight="bold" textAnchor="middle">DISTRIBUCION</text>
      <text x="95" y="24" fill="#ef4444" fontSize="9" textAnchor="middle">(Grandes venden al publico)</text>

      {/* Range box */}
      <rect x="10" y="35" width="170" height="50" fill="#ef4444" opacity="0.1" stroke="#ef4444" strokeDasharray="4,2"/>

      {/* Price action */}
      <path d="M 15 40 L 30 75 L 45 45 L 60 70 L 75 50 L 90 65 L 105 48 L 120 72 L 135 52 L 150 68 L 165 55 L 180 90"
            fill="none" stroke={isDark ? '#60a5fa' : '#3b82f6'} strokeWidth="2"/>

      {/* Breakdown arrow */}
      <path d="M 175 85 L 185 100" fill="none" stroke="#ef4444" strokeWidth="2"/>
      <polygon points="185,100 178,95 182,90" fill="#ef4444"/>

      {/* Labels */}
      <text x="95" y="100" fill={isDark ? '#94a3b8' : '#64748b'} fontSize="8" textAnchor="middle">Rango lateral</text>
      <text x="95" y="112" fill={isDark ? '#94a3b8' : '#64748b'} fontSize="8" textAnchor="middle">Volumen alto</text>
    </g>

    {/* Key insight */}
    <rect x="30" y="135" width="340" height="75" fill={isDark ? '#334155' : '#e2e8f0'} rx="8"/>
    <text x="200" y="155" fill={isDark ? '#fff' : '#1e293b'} fontSize="10" fontWeight="bold" textAnchor="middle">Concepto Wyckoff</text>
    <text x="200" y="172" fill={isDark ? '#94a3b8' : '#64748b'} fontSize="9" textAnchor="middle">Los grandes jugadores (instituciones, bancos) necesitan tiempo</text>
    <text x="200" y="186" fill={isDark ? '#94a3b8' : '#64748b'} fontSize="9" textAnchor="middle">para acumular o distribuir sus posiciones sin mover el precio.</text>
    <text x="200" y="200" fill={isDark ? '#94a3b8' : '#64748b'} fontSize="9" textAnchor="middle">Despues del rango, el precio explota en la direccion de su interes.</text>
  </svg>
);

// =====================================================
// LESSON CONTENT
// =====================================================

const ACADEMY_CONTENT = {
  es: {
    title: 'Academia de Trading',
    subtitle: 'Aprende los fundamentos del analisis tecnico',
    progress: 'Progreso',
    completed: 'Completado',
    markComplete: 'Marcar como completado',
    markIncomplete: 'Marcar como incompleto',
    keyPoints: 'Puntos clave',
    nextLesson: 'Siguiente leccion',
    prevLesson: 'Leccion anterior',
    backToLevels: 'Volver a niveles',
    levels: {
      basic: {
        title: 'Nivel Basico',
        description: 'Conceptos fundamentales del analisis tecnico',
        icon: BookOpen,
        color: 'emerald',
        lessons: [
          {
            id: 'support-resistance',
            title: 'Soportes y Resistencias',
            duration: '5 min',
            content: `Los soportes y resistencias son los conceptos mas importantes del analisis tecnico. Son niveles de precio donde el mercado tiende a detenerse y cambiar de direccion.

**Soporte:** Es un nivel de precio donde la demanda (compradores) es lo suficientemente fuerte para evitar que el precio caiga mas. Piensa en el como un "piso" que sostiene el precio.

**Resistencia:** Es un nivel de precio donde la oferta (vendedores) es lo suficientemente fuerte para evitar que el precio suba mas. Es como un "techo" que frena el precio.

**Por que funcionan?**
- En soportes, los compradores recuerdan que el precio subio desde ese nivel antes, asi que compran nuevamente
- En resistencias, los vendedores recuerdan que el precio cayo desde ese nivel, asi que venden nuevamente
- Cuantas mas veces el precio "rebota" en un nivel, mas fuerte se vuelve

**Regla de oro:** Un soporte roto se convierte en resistencia, y una resistencia rota se convierte en soporte.`,
            keyPoints: [
              'El soporte es un piso donde los compradores defienden',
              'La resistencia es un techo donde los vendedores defienden',
              'Mas toques = nivel mas fuerte',
              'Los niveles rotos cambian de rol'
            ],
            diagram: SupportResistanceSVG
          },
          {
            id: 'trend-lines',
            title: 'Lineas de Tendencia',
            duration: '5 min',
            content: `Una linea de tendencia es una herramienta simple pero poderosa que te ayuda a identificar la direccion del mercado.

**Tendencia alcista (bullish):**
- Se dibuja conectando los minimos ascendentes
- Cada minimo es mas alto que el anterior
- Indica que los compradores tienen el control
- Mientras el precio se mantenga sobre la linea, la tendencia sigue vigente

**Tendencia bajista (bearish):**
- Se dibuja conectando los maximos descendentes
- Cada maximo es mas bajo que el anterior
- Indica que los vendedores tienen el control
- Mientras el precio se mantenga bajo la linea, la tendencia continua

**Como dibujarlas correctamente:**
1. Necesitas al menos 2 puntos para dibujar la linea
2. Con 3 o mas toques, la linea se considera valida
3. Usa las mechas o los cuerpos de forma consistente

**Ruptura de tendencia:**
Cuando el precio cruza la linea de tendencia con fuerza, puede indicar un cambio de direccion del mercado.`,
            keyPoints: [
              'Conecta minimos en tendencia alcista',
              'Conecta maximos en tendencia bajista',
              '3+ toques validan la linea',
              'La ruptura puede senalar cambio de tendencia'
            ],
            diagram: TrendLineSVG
          },
          {
            id: 'channels',
            title: 'Canales de Precio',
            duration: '4 min',
            content: `Un canal es una extension de las lineas de tendencia. Consiste en dos lineas paralelas que contienen el movimiento del precio.

**Canal ascendente:**
- Linea inferior: conecta los minimos (soporte dinamico)
- Linea superior: conecta los maximos (resistencia dinamica)
- El precio oscila entre ambas lineas subiendo
- Oportunidad: comprar en la linea inferior, vender en la superior

**Canal descendente:**
- Linea superior: conecta los maximos
- Linea inferior: conecta los minimos
- El precio oscila entre ambas lineas bajando
- Oportunidad: vender en la linea superior

**Canal lateral (rango):**
- Lineas horizontales paralelas
- El precio se mueve de lado sin tendencia clara
- Oportunidad: comprar en soporte, vender en resistencia

**Estrategia con canales:**
- Operar dentro del canal: comprar en el piso, vender en el techo
- Operar la ruptura: esperar que el precio salga del canal con volumen`,
            keyPoints: [
              'Dos lineas paralelas contienen el precio',
              'El canal te da zonas claras de compra/venta',
              'La ruptura del canal senala movimiento fuerte',
              'Usa el ancho del canal para medir objetivos'
            ],
            diagram: ChannelSVG
          }
        ]
      },
      intermediate: {
        title: 'Nivel Intermedio',
        description: 'Velas japonesas y patrones de precio',
        icon: CandlestickChart,
        color: 'blue',
        lessons: [
          {
            id: 'candle-types',
            title: 'Tipos de Velas Japonesas',
            duration: '8 min',
            content: `Las velas japonesas son la forma mas popular de visualizar el precio. Cada vela te cuenta una historia sobre la batalla entre compradores y vendedores.

**Anatomia de una vela:**
- Cuerpo: espacio entre apertura y cierre
- Mecha superior: maximo alcanzado
- Mecha inferior: minimo alcanzado

**Vela alcista (verde/blanca):**
- El cierre es MAYOR que la apertura
- Los compradores ganaron la batalla
- Cuerpo grande = fuerza compradora

**Vela bajista (roja/negra):**
- El cierre es MENOR que la apertura
- Los vendedores ganaron la batalla
- Cuerpo grande = fuerza vendedora

**Doji:**
- Apertura y cierre casi iguales
- Indica indecision en el mercado
- Puede senalar cambio de tendencia

**Martillo (Hammer):**
- Cuerpo pequeno arriba, mecha larga abajo
- Aparece en tendencia bajista
- Senal de posible reversal alcista

**Estrella fugaz (Shooting Star):**
- Cuerpo pequeno abajo, mecha larga arriba
- Aparece en tendencia alcista
- Senal de posible reversal bajista`,
            keyPoints: [
              'El cuerpo muestra quien gano (compradores vs vendedores)',
              'Las mechas muestran rechazo de niveles',
              'Velas con cuerpo grande = momentum fuerte',
              'Doji y martillo = posibles reversiones'
            ],
            diagram: CandlestickTypesSVG
          },
          {
            id: 'engulfing',
            title: 'Patron Envolvente',
            duration: '5 min',
            content: `El patron envolvente (engulfing) es uno de los patrones de velas mas confiables. Consiste en dos velas donde la segunda "envuelve" completamente a la primera.

**Envolvente alcista (Bullish Engulfing):**
- Primera vela: bajista pequena
- Segunda vela: alcista grande que cubre todo el cuerpo de la primera
- Aparece despues de una tendencia bajista
- Senal de compra

**Envolvente bajista (Bearish Engulfing):**
- Primera vela: alcista pequena
- Segunda vela: bajista grande que cubre todo el cuerpo de la primera
- Aparece despues de una tendencia alcista
- Senal de venta

**Claves para identificarlo:**
1. Debe aparecer en zona de soporte/resistencia
2. La segunda vela debe cerrar mas alla del cuerpo de la primera
3. Mayor volumen en la segunda vela = mas confiable

**Como operarlo:**
- Entrada: al cierre de la vela envolvente o en retroceso
- Stop loss: detras del minimo/maximo del patron
- Take profit: siguiente nivel de soporte/resistencia`,
            keyPoints: [
              'La segunda vela debe cubrir todo el cuerpo de la primera',
              'Es mas fuerte en zonas de soporte/resistencia',
              'El volumen confirma la validez del patron',
              'Es un patron de reversal de alta probabilidad'
            ],
            diagram: EngulfingPatternSVG
          },
          {
            id: 'double-patterns',
            title: 'Doble Techo y Doble Piso',
            duration: '6 min',
            content: `El doble techo y doble piso son patrones de reversal que indican agotamiento de la tendencia actual.

**Doble Techo (Double Top):**
- Forma una "M" en el grafico
- El precio sube, baja, vuelve a subir al mismo nivel y vuelve a bajar
- Indica que los compradores no pueden superar ese nivel
- Es un patron BAJISTA
- Confirmacion: ruptura del "neckline" (el minimo entre los dos techos)

**Doble Piso (Double Bottom):**
- Forma una "W" en el grafico
- El precio baja, sube, vuelve a bajar al mismo nivel y vuelve a subir
- Indica que los vendedores no pueden romper ese nivel
- Es un patron ALCISTA
- Confirmacion: ruptura del "neckline" (el maximo entre los dos pisos)

**Como medir el objetivo:**
La distancia desde el neckline hasta el techo/piso, se proyecta desde el punto de ruptura.

**Errores comunes:**
- Entrar antes de la confirmacion (ruptura del neckline)
- No usar stop loss
- Ignorar el contexto de tendencia mayor`,
            keyPoints: [
              'Doble techo = M = bajista',
              'Doble piso = W = alcista',
              'Esperar la ruptura del neckline para confirmar',
              'El objetivo es la altura del patron proyectada'
            ],
            diagram: DoublePatternSVG
          },
          {
            id: 'head-shoulders',
            title: 'Hombro-Cabeza-Hombro',
            duration: '7 min',
            content: `El patron Hombro-Cabeza-Hombro (HCH) es uno de los patrones de reversal mas confiables en analisis tecnico.

**Estructura del patron:**
1. Hombro izquierdo: primer pico seguido de una caida
2. Cabeza: pico mas alto (el maximo de la tendencia)
3. Hombro derecho: pico similar al hombro izquierdo
4. Neckline: linea que conecta los minimos entre los hombros

**HCH Normal (bajista):**
- Aparece al final de una tendencia alcista
- La cabeza es el punto mas alto
- La ruptura del neckline confirma el patron
- Objetivo: altura de la cabeza proyectada hacia abajo

**HCH Invertido (alcista):**
- Aparece al final de una tendencia bajista
- La cabeza es el punto mas bajo
- La ruptura del neckline hacia arriba confirma
- Objetivo: altura de la cabeza proyectada hacia arriba

**Claves para operar:**
- NO entrar antes de la ruptura del neckline
- El volumen debe aumentar en la ruptura
- El re-test del neckline puede ser buena entrada
- Stop loss: detras del hombro derecho`,
            keyPoints: [
              'Tres picos donde el central es el mas extremo',
              'La ruptura del neckline confirma el patron',
              'El objetivo es la altura de la cabeza',
              'Es uno de los patrones mas confiables'
            ],
            diagram: HeadShouldersSVG
          }
        ]
      },
      advanced: {
        title: 'Nivel Avanzado',
        description: 'Order flow y conceptos institucionales',
        icon: Layers,
        color: 'purple',
        lessons: [
          {
            id: 'order-book',
            title: 'Libro de Ordenes (Order Book)',
            duration: '10 min',
            content: `El libro de ordenes (order book) te muestra la liquidez real del mercado: donde estan las ordenes de compra y venta esperando ser ejecutadas.

**Estructura del Order Book:**
- Lado de compra (Bids): ordenes de compra esperando
- Lado de venta (Asks): ordenes de venta esperando
- Spread: diferencia entre mejor bid y mejor ask
- Profundidad: cantidad de ordenes en cada nivel

**Que puedes ver:**
- Zonas de alta liquidez (mucho volumen acumulado)
- Desequilibrios entre compradores y vendedores
- Muros de ordenes (grandes cantidades en un nivel)
- Ordenes que aparecen y desaparecen (spoofing)

**Como usarlo en trading:**
1. Los precios tienden a moverse hacia zonas de alta liquidez
2. Los "muros" de ordenes pueden actuar como soporte/resistencia
3. Un desequilibrio fuerte puede predecir la direccion
4. Las ordenes grandes pueden ser "trampas" (spoofing)

**Order Flow:**
Es el analisis del flujo de ordenes en tiempo real:
- Delta: diferencia entre compras y ventas agresivas
- CVD (Cumulative Volume Delta): delta acumulado
- Footprint: mapa de volumen por nivel de precio

**Importante:** El order book cambia constantemente. Los grandes jugadores pueden manipularlo colocando y cancelando ordenes.`,
            keyPoints: [
              'Muestra la liquidez real del mercado',
              'El precio busca zonas de liquidez',
              'Los desequilibrios indican presion direccional',
              'Cuidado con la manipulacion (spoofing)'
            ],
            diagram: OrderBookSVG
          },
          {
            id: 'accumulation-distribution',
            title: 'Acumulacion y Distribucion',
            duration: '12 min',
            content: `Los conceptos de acumulacion y distribucion vienen de la metodologia Wyckoff y explican como los grandes jugadores (instituciones, fondos, bancos) construyen y liquidan sus posiciones.

**ACUMULACION:**
Proceso donde los grandes compran gradualmente:
- Ocurre despues de una tendencia bajista
- El precio se mueve en un rango lateral
- El volumen es bajo (no llama la atencion)
- Los grandes compran cada vez que el precio baja al soporte
- Dura semanas o meses
- Termina con una ruptura alcista explosiva

**DISTRIBUCION:**
Proceso donde los grandes venden gradualmente:
- Ocurre despues de una tendencia alcista
- El precio se mueve en un rango lateral
- El volumen es alto (venden al publico emocionado)
- Los grandes venden cada vez que el precio sube a resistencia
- El publico retail compra pensando que seguira subiendo
- Termina con una caida fuerte

**Fases de Wyckoff:**
1. PS (Preliminary Support/Supply): primer intento de parar
2. SC/BC (Selling/Buying Climax): climax de la tendencia
3. AR (Automatic Rally/Reaction): rebote automatico
4. ST (Secondary Test): prueba del climax
5. Spring/UTAD: trampa final antes del movimiento

**Como identificarlos:**
- Acumulacion: minimos en soporte respetados, volumen bajo
- Distribucion: maximos en resistencia frenados, volumen alto
- La ruptura del rango confirma la direccion`,
            keyPoints: [
              'Los grandes necesitan tiempo para acumular/distribuir',
              'Acumulacion = rango + ruptura alcista',
              'Distribucion = rango + ruptura bajista',
              'El volumen diferencia acumulacion de distribucion',
              'El Spring/UTAD es la trampa final'
            ],
            diagram: WyckoffSVG
          },
          {
            id: 'liquidity-concepts',
            title: 'Zonas de Liquidez',
            duration: '10 min',
            content: `La liquidez es donde esta el dinero. Los grandes jugadores necesitan liquidez para entrar y salir de sus posiciones sin mover demasiado el precio.

**Donde se acumula la liquidez:**
1. Detras de maximos y minimos obvios (donde estan los stop loss)
2. En numeros redondos (100, 1000, 50000, etc.)
3. En maximos/minimos del dia, semana, mes anterior
4. Detras de lineas de tendencia y soportes/resistencias obvios

**Concepto de "Caza de Stops":**
- Los grandes saben donde el publico coloca sus stops
- Mueven el precio a esas zonas para activar los stops
- Esto les da liquidez para sus ordenes grandes
- Despues el precio se mueve en la direccion real

**Order Blocks:**
- Zonas donde los grandes colocaron ordenes
- Se identifican por velas con cuerpo grande seguidas de movimiento fuerte
- El precio tiende a regresar a estas zonas
- Son buenos puntos de entrada

**Fair Value Gaps (FVG) / Imbalances:**
- Espacios donde el precio se movio tan rapido que dejo "huecos"
- El precio tiende a regresar a llenar estos huecos
- Son zonas de interes institucional

**Como operar con liquidez:**
1. Identifica donde estan los stops obvios
2. Espera que el precio los active (el "fakeout")
3. Entra en la direccion opuesta cuando veas rechazo
4. Tu stop va detras de la zona de liquidez tomada`,
            keyPoints: [
              'La liquidez esta detras de maximos/minimos obvios',
              'Los grandes cazan los stops del retail',
              'Los Order Blocks son zonas de entrada institucional',
              'Los FVG/imbalances tienden a llenarse',
              'Opera el "fakeout", no el "breakout" obvio'
            ],
            diagram: null // Complex concept, text is enough
          }
        ]
      }
    }
  },
  en: {
    title: 'Trading Academy',
    subtitle: 'Learn the fundamentals of technical analysis',
    progress: 'Progress',
    completed: 'Completed',
    markComplete: 'Mark as completed',
    markIncomplete: 'Mark as incomplete',
    keyPoints: 'Key Points',
    nextLesson: 'Next lesson',
    prevLesson: 'Previous lesson',
    backToLevels: 'Back to levels',
    levels: {
      basic: {
        title: 'Basic Level',
        description: 'Fundamental concepts of technical analysis',
        icon: BookOpen,
        color: 'emerald',
        lessons: [
          {
            id: 'support-resistance',
            title: 'Support and Resistance',
            duration: '5 min',
            content: `Support and resistance are the most important concepts in technical analysis. They are price levels where the market tends to stop and reverse direction.

**Support:** A price level where demand (buyers) is strong enough to prevent the price from falling further. Think of it as a "floor" that holds the price up.

**Resistance:** A price level where supply (sellers) is strong enough to prevent the price from rising further. It's like a "ceiling" that stops the price.

**Why do they work?**
- At support, buyers remember the price went up from that level before, so they buy again
- At resistance, sellers remember the price fell from that level, so they sell again
- The more times price "bounces" off a level, the stronger it becomes

**Golden rule:** A broken support becomes resistance, and a broken resistance becomes support.`,
            keyPoints: [
              'Support is a floor where buyers defend',
              'Resistance is a ceiling where sellers defend',
              'More touches = stronger level',
              'Broken levels switch roles'
            ],
            diagram: SupportResistanceSVG
          },
          {
            id: 'trend-lines',
            title: 'Trend Lines',
            duration: '5 min',
            content: `A trend line is a simple but powerful tool that helps you identify market direction.

**Uptrend (bullish):**
- Drawn by connecting ascending lows
- Each low is higher than the previous one
- Indicates buyers are in control
- As long as price stays above the line, the trend continues

**Downtrend (bearish):**
- Drawn by connecting descending highs
- Each high is lower than the previous one
- Indicates sellers are in control
- As long as price stays below the line, the trend continues

**How to draw them correctly:**
1. You need at least 2 points to draw the line
2. With 3 or more touches, the line is considered valid
3. Use wicks or bodies consistently

**Trend break:**
When price crosses the trend line with force, it may indicate a change in market direction.`,
            keyPoints: [
              'Connect lows in an uptrend',
              'Connect highs in a downtrend',
              '3+ touches validate the line',
              'A break may signal trend change'
            ],
            diagram: TrendLineSVG
          },
          {
            id: 'channels',
            title: 'Price Channels',
            duration: '4 min',
            content: `A channel is an extension of trend lines. It consists of two parallel lines that contain price movement.

**Ascending channel:**
- Lower line: connects lows (dynamic support)
- Upper line: connects highs (dynamic resistance)
- Price oscillates between both lines going up
- Opportunity: buy at lower line, sell at upper

**Descending channel:**
- Upper line: connects highs
- Lower line: connects lows
- Price oscillates between both lines going down
- Opportunity: sell at upper line

**Sideways channel (range):**
- Horizontal parallel lines
- Price moves sideways without clear trend
- Opportunity: buy at support, sell at resistance

**Channel strategy:**
- Trade inside: buy at floor, sell at ceiling
- Trade the breakout: wait for price to exit with volume`,
            keyPoints: [
              'Two parallel lines contain price',
              'Channel gives clear buy/sell zones',
              'Channel break signals strong move',
              'Use channel width to measure targets'
            ],
            diagram: ChannelSVG
          }
        ]
      },
      intermediate: {
        title: 'Intermediate Level',
        description: 'Japanese candlesticks and price patterns',
        icon: CandlestickChart,
        color: 'blue',
        lessons: [
          {
            id: 'candle-types',
            title: 'Japanese Candlestick Types',
            duration: '8 min',
            content: `Japanese candlesticks are the most popular way to visualize price. Each candle tells a story about the battle between buyers and sellers.

**Candle anatomy:**
- Body: space between open and close
- Upper wick: highest point reached
- Lower wick: lowest point reached

**Bullish candle (green/white):**
- Close is HIGHER than open
- Buyers won the battle
- Large body = strong buying

**Bearish candle (red/black):**
- Close is LOWER than open
- Sellers won the battle
- Large body = strong selling

**Doji:**
- Open and close almost equal
- Indicates market indecision
- May signal trend change

**Hammer:**
- Small body at top, long wick below
- Appears in downtrend
- Signal of possible bullish reversal

**Shooting Star:**
- Small body at bottom, long wick above
- Appears in uptrend
- Signal of possible bearish reversal`,
            keyPoints: [
              'Body shows who won (buyers vs sellers)',
              'Wicks show rejection of levels',
              'Large body candles = strong momentum',
              'Doji and hammer = possible reversals'
            ],
            diagram: CandlestickTypesSVG
          },
          {
            id: 'engulfing',
            title: 'Engulfing Pattern',
            duration: '5 min',
            content: `The engulfing pattern is one of the most reliable candlestick patterns. It consists of two candles where the second "engulfs" the first completely.

**Bullish Engulfing:**
- First candle: small bearish
- Second candle: large bullish covering entire body of first
- Appears after a downtrend
- Buy signal

**Bearish Engulfing:**
- First candle: small bullish
- Second candle: large bearish covering entire body of first
- Appears after an uptrend
- Sell signal

**Keys to identify it:**
1. Must appear at support/resistance zone
2. Second candle must close beyond first candle's body
3. Higher volume on second candle = more reliable

**How to trade it:**
- Entry: at close of engulfing candle or on pullback
- Stop loss: behind pattern's low/high
- Take profit: next support/resistance level`,
            keyPoints: [
              'Second candle must cover entire body of first',
              'Stronger at support/resistance zones',
              'Volume confirms pattern validity',
              'High probability reversal pattern'
            ],
            diagram: EngulfingPatternSVG
          },
          {
            id: 'double-patterns',
            title: 'Double Top and Double Bottom',
            duration: '6 min',
            content: `Double top and double bottom are reversal patterns indicating exhaustion of the current trend.

**Double Top:**
- Forms an "M" on the chart
- Price rises, falls, rises again to same level and falls again
- Indicates buyers cannot break that level
- It's a BEARISH pattern
- Confirmation: break of "neckline" (the low between the two tops)

**Double Bottom:**
- Forms a "W" on the chart
- Price falls, rises, falls again to same level and rises again
- Indicates sellers cannot break that level
- It's a BULLISH pattern
- Confirmation: break of "neckline" (the high between the two bottoms)

**How to measure target:**
Distance from neckline to top/bottom, projected from breakout point.

**Common mistakes:**
- Entering before confirmation (neckline break)
- Not using stop loss
- Ignoring larger trend context`,
            keyPoints: [
              'Double top = M = bearish',
              'Double bottom = W = bullish',
              'Wait for neckline break to confirm',
              'Target is pattern height projected'
            ],
            diagram: DoublePatternSVG
          },
          {
            id: 'head-shoulders',
            title: 'Head and Shoulders',
            duration: '7 min',
            content: `The Head and Shoulders (H&S) pattern is one of the most reliable reversal patterns in technical analysis.

**Pattern structure:**
1. Left shoulder: first peak followed by a drop
2. Head: highest peak (the trend's maximum)
3. Right shoulder: peak similar to left shoulder
4. Neckline: line connecting the lows between shoulders

**Normal H&S (bearish):**
- Appears at the end of an uptrend
- Head is the highest point
- Neckline break confirms the pattern
- Target: head height projected downward

**Inverse H&S (bullish):**
- Appears at the end of a downtrend
- Head is the lowest point
- Upward neckline break confirms
- Target: head height projected upward

**Keys to trade:**
- DO NOT enter before neckline break
- Volume should increase on break
- Neckline re-test can be good entry
- Stop loss: behind right shoulder`,
            keyPoints: [
              'Three peaks where center is most extreme',
              'Neckline break confirms pattern',
              'Target is the head height',
              'One of the most reliable patterns'
            ],
            diagram: HeadShouldersSVG
          }
        ]
      },
      advanced: {
        title: 'Advanced Level',
        description: 'Order flow and institutional concepts',
        icon: Layers,
        color: 'purple',
        lessons: [
          {
            id: 'order-book',
            title: 'Order Book',
            duration: '10 min',
            content: `The order book shows you the real liquidity of the market: where buy and sell orders are waiting to be executed.

**Order Book Structure:**
- Buy side (Bids): buy orders waiting
- Sell side (Asks): sell orders waiting
- Spread: difference between best bid and best ask
- Depth: amount of orders at each level

**What you can see:**
- High liquidity zones (lots of accumulated volume)
- Imbalances between buyers and sellers
- Order walls (large amounts at one level)
- Orders appearing and disappearing (spoofing)

**How to use it in trading:**
1. Prices tend to move toward high liquidity zones
2. Order "walls" can act as support/resistance
3. Strong imbalance can predict direction
4. Large orders can be "traps" (spoofing)

**Order Flow:**
Analysis of order flow in real time:
- Delta: difference between aggressive buys and sells
- CVD (Cumulative Volume Delta): accumulated delta
- Footprint: volume map by price level

**Important:** The order book changes constantly. Big players can manipulate it by placing and canceling orders.`,
            keyPoints: [
              'Shows real market liquidity',
              'Price seeks liquidity zones',
              'Imbalances indicate directional pressure',
              'Beware of manipulation (spoofing)'
            ],
            diagram: OrderBookSVG
          },
          {
            id: 'accumulation-distribution',
            title: 'Accumulation and Distribution',
            duration: '12 min',
            content: `Accumulation and distribution concepts come from Wyckoff methodology and explain how big players (institutions, funds, banks) build and liquidate their positions.

**ACCUMULATION:**
Process where big players gradually buy:
- Occurs after a downtrend
- Price moves in a lateral range
- Volume is low (doesn't attract attention)
- Big players buy every time price drops to support
- Lasts weeks or months
- Ends with explosive bullish breakout

**DISTRIBUTION:**
Process where big players gradually sell:
- Occurs after an uptrend
- Price moves in a lateral range
- Volume is high (selling to excited public)
- Big players sell every time price rises to resistance
- Retail public buys thinking it will keep rising
- Ends with strong drop

**Wyckoff Phases:**
1. PS (Preliminary Support/Supply): first attempt to stop
2. SC/BC (Selling/Buying Climax): trend climax
3. AR (Automatic Rally/Reaction): automatic bounce
4. ST (Secondary Test): climax test
5. Spring/UTAD: final trap before the move

**How to identify them:**
- Accumulation: lows at support respected, low volume
- Distribution: highs at resistance stopped, high volume
- Range breakout confirms direction`,
            keyPoints: [
              'Big players need time to accumulate/distribute',
              'Accumulation = range + bullish breakout',
              'Distribution = range + bearish breakout',
              'Volume differentiates accumulation from distribution',
              'Spring/UTAD is the final trap'
            ],
            diagram: WyckoffSVG
          },
          {
            id: 'liquidity-concepts',
            title: 'Liquidity Zones',
            duration: '10 min',
            content: `Liquidity is where the money is. Big players need liquidity to enter and exit their positions without moving price too much.

**Where liquidity accumulates:**
1. Behind obvious highs and lows (where stop losses are)
2. At round numbers (100, 1000, 50000, etc.)
3. At previous day, week, month highs/lows
4. Behind obvious trend lines and support/resistance

**Stop Hunt Concept:**
- Big players know where retail places stops
- They move price to those zones to trigger stops
- This gives them liquidity for their large orders
- Then price moves in the real direction

**Order Blocks:**
- Zones where big players placed orders
- Identified by large body candles followed by strong move
- Price tends to return to these zones
- Good entry points

**Fair Value Gaps (FVG) / Imbalances:**
- Spaces where price moved so fast it left "gaps"
- Price tends to return to fill these gaps
- Zones of institutional interest

**How to trade with liquidity:**
1. Identify where obvious stops are
2. Wait for price to trigger them (the "fakeout")
3. Enter opposite direction when you see rejection
4. Your stop goes behind the taken liquidity zone`,
            keyPoints: [
              'Liquidity is behind obvious highs/lows',
              'Big players hunt retail stops',
              'Order Blocks are institutional entry zones',
              'FVG/imbalances tend to get filled',
              'Trade the "fakeout", not the obvious "breakout"'
            ],
            diagram: null
          }
        ]
      }
    }
  }
};

// =====================================================
// MAIN COMPONENT
// =====================================================

export default function TradingAcademy({ isOpen, onClose, userId }) {
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [loadingProgress, setLoadingProgress] = useState(true);

  const content = ACADEMY_CONTENT[language] || ACADEMY_CONTENT.es;
  const levels = content.levels;

  // Load progress from Firestore
  useEffect(() => {
    const loadProgress = async () => {
      if (!userId) {
        setLoadingProgress(false);
        return;
      }

      try {
        const progressRef = doc(db, 'academy_progress', userId);
        const progressDoc = await getDoc(progressRef);

        if (progressDoc.exists()) {
          setCompletedLessons(progressDoc.data().completedLessons || []);
        }
      } catch (error) {
        console.error('Error loading academy progress:', error);
      }
      setLoadingProgress(false);
    };

    if (isOpen) {
      loadProgress();
    }
  }, [userId, isOpen]);

  // Save progress to Firestore
  const saveProgress = async (lessons) => {
    if (!userId) return;

    try {
      const progressRef = doc(db, 'academy_progress', userId);
      await setDoc(progressRef, {
        completedLessons: lessons,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error saving academy progress:', error);
    }
  };

  const toggleLessonComplete = async (lessonId) => {
    let newCompleted;
    if (completedLessons.includes(lessonId)) {
      newCompleted = completedLessons.filter(id => id !== lessonId);
    } else {
      newCompleted = [...completedLessons, lessonId];
    }
    setCompletedLessons(newCompleted);
    await saveProgress(newCompleted);
  };

  const calculateProgress = (levelKey) => {
    const levelLessons = levels[levelKey].lessons;
    const completed = levelLessons.filter(l => completedLessons.includes(l.id)).length;
    return Math.round((completed / levelLessons.length) * 100);
  };

  const totalProgress = () => {
    const allLessons = Object.values(levels).flatMap(l => l.lessons);
    const completed = allLessons.filter(l => completedLessons.includes(l.id)).length;
    return Math.round((completed / allLessons.length) * 100);
  };

  const getNextLesson = () => {
    if (!selectedLesson || !selectedLevel) return null;
    const lessons = levels[selectedLevel].lessons;
    const currentIndex = lessons.findIndex(l => l.id === selectedLesson.id);
    return currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;
  };

  const getPrevLesson = () => {
    if (!selectedLesson || !selectedLevel) return null;
    const lessons = levels[selectedLevel].lessons;
    const currentIndex = lessons.findIndex(l => l.id === selectedLesson.id);
    return currentIndex > 0 ? lessons[currentIndex - 1] : null;
  };

  if (!isOpen) return null;

  const colorClasses = {
    emerald: {
      bg: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50',
      border: 'border-emerald-500/30',
      text: 'text-emerald-500',
      progressBg: 'bg-emerald-500'
    },
    blue: {
      bg: isDark ? 'bg-blue-500/10' : 'bg-blue-50',
      border: 'border-blue-500/30',
      text: 'text-blue-500',
      progressBg: 'bg-blue-500'
    },
    purple: {
      bg: isDark ? 'bg-purple-500/10' : 'bg-purple-50',
      border: 'border-purple-500/30',
      text: 'text-purple-500',
      progressBg: 'bg-purple-500'
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className={`relative w-full max-w-4xl max-h-[95vh] rounded-2xl shadow-2xl overflow-hidden ${
        isDark ? 'bg-slate-900' : 'bg-white'
      }`}>
        {/* Header */}
        <div className={`p-4 sm:p-6 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {(selectedLesson || selectedLevel) && (
                <button
                  onClick={() => {
                    if (selectedLesson) {
                      setSelectedLesson(null);
                    } else {
                      setSelectedLevel(null);
                    }
                  }}
                  className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
                >
                  <ArrowLeft size={20} className={isDark ? 'text-slate-400' : 'text-slate-600'} />
                </button>
              )}
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                  <GraduationCap size={22} className="text-white" />
                </div>
                <div>
                  <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    {selectedLesson ? selectedLesson.title : content.title}
                  </h2>
                  {!selectedLesson && (
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {content.subtitle}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Overall progress */}
              {!selectedLesson && (
                <div className="hidden sm:flex items-center gap-2">
                  <span className={`text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {content.progress}
                  </span>
                  <div className={`w-24 h-2 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all"
                      style={{ width: `${totalProgress()}%` }}
                    />
                  </div>
                  <span className={`text-xs font-bold ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                    {totalProgress()}%
                  </span>
                </div>
              )}

              <button
                onClick={onClose}
                className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
              >
                <X size={20} className={isDark ? 'text-slate-400' : 'text-slate-600'} />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-100px)] p-4 sm:p-6">
          {loadingProgress ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
            </div>
          ) : selectedLesson ? (
            // Lesson view
            <div className="space-y-6">
              {/* Lesson content */}
              <div className={`prose prose-sm max-w-none ${isDark ? 'prose-invert' : ''}`}>
                {selectedLesson.content.split('\n\n').map((paragraph, i) => (
                  <p key={i} className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {paragraph.split('**').map((part, j) =>
                      j % 2 === 1 ? <strong key={j} className={isDark ? 'text-white' : 'text-slate-800'}>{part}</strong> : part
                    )}
                  </p>
                ))}
              </div>

              {/* Diagram */}
              {selectedLesson.diagram && (
                <div className={`rounded-xl overflow-hidden border ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                  <selectedLesson.diagram isDark={isDark} />
                </div>
              )}

              {/* Key points */}
              {selectedLesson.keyPoints && (
                <div className={`p-4 rounded-xl ${isDark ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-amber-50 border border-amber-200'}`}>
                  <h4 className={`text-sm font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
                    <Zap size={16} />
                    {content.keyPoints}
                  </h4>
                  <ul className="space-y-2">
                    {selectedLesson.keyPoints.map((point, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 size={14} className={`mt-0.5 flex-shrink-0 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
                        <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Navigation and complete button */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-700/50">
                <div className="flex gap-2">
                  {getPrevLesson() && (
                    <button
                      onClick={() => setSelectedLesson(getPrevLesson())}
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium ${
                        isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <ChevronLeft size={16} />
                      {content.prevLesson}
                    </button>
                  )}
                  {getNextLesson() && (
                    <button
                      onClick={() => setSelectedLesson(getNextLesson())}
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium ${
                        isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {content.nextLesson}
                      <ChevronRight size={16} />
                    </button>
                  )}
                </div>

                <button
                  onClick={() => toggleLessonComplete(selectedLesson.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                    completedLessons.includes(selectedLesson.id)
                      ? 'bg-emerald-500 text-white'
                      : isDark
                        ? 'bg-slate-800 text-slate-300 hover:bg-emerald-500/20 hover:text-emerald-400'
                        : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600'
                  }`}
                >
                  {completedLessons.includes(selectedLesson.id) ? (
                    <>
                      <CheckCircle2 size={18} />
                      {content.completed}
                    </>
                  ) : (
                    <>
                      <Circle size={18} />
                      {content.markComplete}
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : selectedLevel ? (
            // Level lessons view
            <div className="space-y-3">
              {levels[selectedLevel].lessons.map((lesson, index) => {
                const isCompleted = completedLessons.includes(lesson.id);
                const colors = colorClasses[levels[selectedLevel].color];

                return (
                  <button
                    key={lesson.id}
                    onClick={() => setSelectedLesson(lesson)}
                    className={`w-full p-4 rounded-xl border text-left transition-all ${
                      isDark
                        ? `bg-slate-800/50 border-slate-700 hover:border-slate-600 ${isCompleted ? 'border-emerald-500/30' : ''}`
                        : `bg-white border-slate-200 hover:border-slate-300 ${isCompleted ? 'border-emerald-300' : ''}`
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isCompleted
                          ? 'bg-emerald-500 text-white'
                          : isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {isCompleted ? <CheckCircle2 size={20} /> : <span className="font-bold">{index + 1}</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>
                          {lesson.title}
                        </h4>
                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {lesson.duration}
                        </p>
                      </div>
                      <ChevronRight size={18} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            // Levels grid
            <div className="grid gap-4">
              {Object.entries(levels).map(([key, level]) => {
                const Icon = level.icon;
                const colors = colorClasses[level.color];
                const progress = calculateProgress(key);

                return (
                  <button
                    key={key}
                    onClick={() => setSelectedLevel(key)}
                    className={`p-5 rounded-2xl border text-left transition-all hover:scale-[1.01] ${colors.bg} ${colors.border}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${colors.text} ${
                        isDark ? 'bg-slate-800' : 'bg-white'
                      }`}>
                        <Icon size={28} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                            {level.title}
                          </h3>
                          <span className={`text-sm font-bold ${colors.text}`}>
                            {progress}%
                          </span>
                        </div>
                        <p className={`text-sm mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {level.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className={`flex-1 h-2 rounded-full mr-4 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                            <div
                              className={`h-full rounded-full transition-all ${colors.progressBg}`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                            {level.lessons.length} {language === 'es' ? 'lecciones' : 'lessons'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
