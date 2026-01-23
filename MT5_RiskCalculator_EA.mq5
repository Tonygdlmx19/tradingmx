//+------------------------------------------------------------------+
//|                                       RiskCalculator_Panel.mq5   |
//|                                    Trading Journal PRO - Risk Calc|
//|                                         Para MacBook Retina M4   |
//+------------------------------------------------------------------+
#property copyright "Trading Journal PRO"
#property link      ""
#property version   "2.5"
#property description "Calculadora de Riesgo - Panel Movible y Contraible"

#include <Trade\Trade.mqh>

//--- Input parameters
input double   InpRiskPercent = 2.0;        // Riesgo % por defecto
input double   InpPointValue = 2.0;         // Valor por punto ($)
input int      InpMagicNumber = 123456;     // Magic Number

//--- Panel settings
int SCALE = 1;  // Escala (1=normal)
int panelX = 50;
int panelY = 50;
int panelWidth = 500;
int panelHeight = 1050;  // Aumentado para TPs
int headerH = 50;
bool isDragging = false;
int dragOffsetX = 0;
int dragOffsetY = 0;
bool isCollapsed = false;  // Estado contraido

//--- Font sizes
int FONT_LARGE = 12;
int FONT_MEDIUM = 10;
int FONT_SMALL = 10;
int INPUT_H = 40;
int BTN_H = 50;
int PADDING = 20;
int ROW_H = 80;
int LABEL_OFFSET = 35;

//--- Colors
color CLR_BG = C'25,30,40';
color CLR_BG_DARK = C'18,22,30';
color CLR_HEADER = C'35,45,60';
color CLR_BLUE = C'30,120,220';
color CLR_GREEN = C'20,160,80';
color CLR_RED = C'200,50,60';
color CLR_ORANGE = C'220,140,30';
color CLR_TEXT = clrWhite;
color CLR_TEXT_DIM = C'140,145,160';
color CLR_INPUT_BG = C'45,50,65';
color CLR_BORDER = C'60,65,80';

//--- Global variables
CTrade trade;
string PREFIX = "RC_";

//--- Values
double g_entrada = 0;
double g_sl = 0;
double g_tp = 0;
double g_stopPts = 0;
double g_tpPts = 0;
double g_spread = 0;
double g_vpp = 0;
double g_riesgoPct = 0;
double g_riesgoUSD = 0;
double g_lotes = 0;
double g_ganancia = 0;
double g_ratio = 0;

//--- TP levels
double g_tp1_price = 0;
double g_tp2_price = 0;
double g_tp3_price = 0;
double g_tp1_profit = 0;
double g_tp2_profit = 0;
double g_tp3_profit = 0;
bool g_isLong = true;  // Direccion de la operacion

//+------------------------------------------------------------------+
//| Expert initialization                                              |
//+------------------------------------------------------------------+
int OnInit()
{
   //--- Initial values
   g_vpp = InpPointValue;
   g_riesgoPct = InpRiskPercent;
   g_riesgoUSD = AccountInfoDouble(ACCOUNT_BALANCE) * (g_riesgoPct / 100.0);
   g_spread = (double)SymbolInfoInteger(_Symbol, SYMBOL_SPREAD);

   //--- Setup trade
   trade.SetExpertMagicNumber(InpMagicNumber);
   trade.SetDeviationInPoints(50);  // Slippage permitido
   trade.SetTypeFilling(ORDER_FILLING_IOC);  // Tipo de llenado

   //--- Create panel
   CreatePanel();
   Calculate();

   //--- Enable chart events
   ChartSetInteger(0, CHART_EVENT_MOUSE_MOVE, true);

   return(INIT_SUCCEEDED);
}

//+------------------------------------------------------------------+
//| Expert deinitialization                                            |
//+------------------------------------------------------------------+
void OnDeinit(const int reason)
{
   ObjectsDeleteAll(0, PREFIX);
   ChartRedraw();
}

//+------------------------------------------------------------------+
//| Create panel                                                       |
//+------------------------------------------------------------------+
void CreatePanel()
{
   ObjectsDeleteAll(0, PREFIX);

   int x = panelX;
   int y = panelY;
   int w = panelWidth;
   int contentW = w - PADDING * 2;
   int halfW = (contentW - PADDING) / 2;
   int thirdW = (contentW - PADDING * 2) / 3;

   if(isCollapsed)
   {
      //--- Panel contraido - solo header
      CreateRect(PREFIX+"BG", x, y, w, headerH, CLR_BG);
      CreateRect(PREFIX+"Header", x, y, w, headerH, CLR_HEADER);
      CreateLabel(PREFIX+"Title", x + PADDING, y + 15, "RISK CALCULATOR", FONT_MEDIUM, CLR_BLUE);
      CreateLabel(PREFIX+"Symbol", x + w - 180, y + 15, _Symbol, FONT_SMALL, CLR_TEXT);
      CreateLabel(PREFIX+"BtnCollapse", x + w - 40, y + 12, "+", FONT_LARGE, CLR_TEXT);
      ChartRedraw();
      return;
   }

   //--- Panel expandido completo
   CreateRect(PREFIX+"BG", x, y, w, panelHeight, CLR_BG);

   //--- Header (draggable area)
   CreateRect(PREFIX+"Header", x, y, w, headerH, CLR_HEADER);
   CreateLabel(PREFIX+"Title", x + PADDING, y + 15, "RISK CALCULATOR", FONT_MEDIUM, CLR_BLUE);
   CreateLabel(PREFIX+"Symbol", x + w - 180, y + 15, _Symbol, FONT_SMALL, CLR_TEXT);
   CreateLabel(PREFIX+"BtnCollapse", x + w - 40, y + 12, "—", FONT_LARGE, CLR_TEXT);

   y += headerH + PADDING;

   //--- Entrada
   CreateLabel(PREFIX+"LblEntrada", x + PADDING, y, "Entrada", FONT_SMALL, CLR_TEXT_DIM);
   CreateEdit(PREFIX+"InpEntrada", x + PADDING, y + LABEL_OFFSET, contentW, INPUT_H, "");
   y += ROW_H;

   //--- SL y TP en misma fila
   CreateLabel(PREFIX+"LblSL", x + PADDING, y, "Stop Loss", FONT_SMALL, CLR_RED);
   CreateEdit(PREFIX+"InpSL", x + PADDING, y + LABEL_OFFSET, halfW, INPUT_H, "");

   CreateLabel(PREFIX+"LblTP", x + PADDING + halfW + PADDING, y, "Take Profit", FONT_SMALL, CLR_GREEN);
   CreateEdit(PREFIX+"InpTP", x + PADDING + halfW + PADDING, y + LABEL_OFFSET, halfW, INPUT_H, "");
   y += ROW_H;

   //--- Separator
   CreateRect(PREFIX+"Sep1", x + PADDING, y, contentW, 2, CLR_BORDER);
   y += PADDING;

   //--- Stop pts y TP pts
   CreateLabel(PREFIX+"LblStopPts", x + PADDING, y, "Stop (pts)", FONT_SMALL, CLR_RED);
   CreateEdit(PREFIX+"InpStopPts", x + PADDING, y + LABEL_OFFSET, halfW, INPUT_H, "0");

   CreateLabel(PREFIX+"LblTPPts", x + PADDING + halfW + PADDING, y, "TP (pts)", FONT_SMALL, CLR_GREEN);
   CreateEdit(PREFIX+"InpTPPts", x + PADDING + halfW + PADDING, y + LABEL_OFFSET, halfW, INPUT_H, "0");
   y += ROW_H;

   //--- Spread y VPP
   CreateLabel(PREFIX+"LblSpread", x + PADDING, y, "Spread", FONT_SMALL, CLR_ORANGE);
   CreateEdit(PREFIX+"InpSpread", x + PADDING, y + LABEL_OFFSET, halfW, INPUT_H, DoubleToString(g_spread, 0));

   CreateLabel(PREFIX+"LblVPP", x + PADDING + halfW + PADDING, y, "$ / punto", FONT_SMALL, CLR_TEXT_DIM);
   CreateEdit(PREFIX+"InpVPP", x + PADDING + halfW + PADDING, y + LABEL_OFFSET, halfW, INPUT_H, DoubleToString(g_vpp, 2));
   y += ROW_H;

   //--- Separator
   CreateRect(PREFIX+"Sep2", x + PADDING, y, contentW, 2, CLR_BORDER);
   y += PADDING;

   //--- Riesgo
   CreateLabel(PREFIX+"LblRiesgoPct", x + PADDING, y, "Riesgo %", FONT_SMALL, CLR_TEXT_DIM);
   CreateEdit(PREFIX+"InpRiesgoPct", x + PADDING, y + LABEL_OFFSET, halfW, INPUT_H, DoubleToString(g_riesgoPct, 1));

   CreateLabel(PREFIX+"LblRiesgoUSD", x + PADDING + halfW + PADDING, y, "Riesgo $", FONT_SMALL, CLR_TEXT_DIM);
   CreateEdit(PREFIX+"InpRiesgoUSD", x + PADDING + halfW + PADDING, y + LABEL_OFFSET, halfW, INPUT_H, DoubleToString(g_riesgoUSD, 2));
   y += ROW_H;

   //--- Result Box
   int resultH = 90;
   CreateRect(PREFIX+"ResultBG", x + PADDING, y, contentW, resultH, CLR_BLUE);
   CreateLabel(PREFIX+"LblLotesTitle", x + PADDING + 15, y + 12, "Lotes Sugeridos", FONT_SMALL, C'150,200,255');
   CreateLabel(PREFIX+"LblLotes", x + PADDING + 15, y + 45, "0.00", FONT_MEDIUM + 4, CLR_TEXT);

   CreateLabel(PREFIX+"LblRatioTitle", x + w - 130, y + 12, "RATIO", FONT_SMALL, C'150,200,255');
   CreateLabel(PREFIX+"LblRatio", x + w - 130, y + 45, "1:0", FONT_MEDIUM + 4, clrYellow);
   y += resultH + PADDING;

   //--- Risk vs Reward boxes
   int boxH = 65;
   CreateRect(PREFIX+"RiskBox", x + PADDING, y, halfW, boxH, CLR_RED);
   CreateLabel(PREFIX+"RiskTitle", x + PADDING + 12, y + 8, "RIESGO", FONT_SMALL, C'255,180,180');
   CreateLabel(PREFIX+"RiskVal", x + PADDING + 12, y + 32, "-$0", FONT_MEDIUM, CLR_TEXT);

   CreateRect(PREFIX+"RewardBox", x + PADDING + halfW + PADDING, y, halfW, boxH, CLR_GREEN);
   CreateLabel(PREFIX+"RewardTitle", x + PADDING + halfW + PADDING + 12, y + 8, "GANANCIA", FONT_SMALL, C'180,255,180');
   CreateLabel(PREFIX+"RewardVal", x + PADDING + halfW + PADDING + 12, y + 32, "+$0", FONT_MEDIUM, CLR_TEXT);
   y += boxH + PADDING;

   //--- Separator
   CreateRect(PREFIX+"Sep3", x + PADDING, y, contentW, 2, CLR_BORDER);
   y += PADDING;

   //--- TP Levels Section
   CreateLabel(PREFIX+"LblTPLevels", x + PADDING, y, "TAKE PROFITS SUGERIDOS", FONT_SMALL - 2, CLR_ORANGE);
   y += 25;

   //--- TP1 (1:1) - Break even
   int tpBoxH = 88;
   CreateRect(PREFIX+"TP1Box", x + PADDING, y, thirdW, tpBoxH, C'40,80,60');
   CreateLabel(PREFIX+"TP1Title", x + PADDING + 20, y + 6, "TP1 (1:1)", FONT_SMALL - 2, CLR_GREEN);
   CreateLabel(PREFIX+"TP1Price", x + PADDING + 40, y + 35, "0.00", FONT_SMALL - 2, CLR_TEXT);
   CreateLabel(PREFIX+"TP1Profit", x + PADDING + 20, y + 60, "+$0", FONT_SMALL - 2, C'150,255,150');

   //--- TP2 (2:1) - Doble ganancia
   CreateRect(PREFIX+"TP2Box", x + PADDING + thirdW + PADDING, y, thirdW, tpBoxH, C'40,80,60');
   CreateLabel(PREFIX+"TP2Title", x + PADDING + thirdW + PADDING + 20, y + 6, "TP2 (2:1)", FONT_SMALL - 2, CLR_GREEN);
   CreateLabel(PREFIX+"TP2Price", x + PADDING + thirdW + PADDING + 40, y + 35, "0.00", FONT_SMALL - 2, CLR_TEXT);
   CreateLabel(PREFIX+"TP2Profit", x + PADDING + thirdW + PADDING + 20, y + 60, "+$0", FONT_SMALL - 2, C'150,255,150');

   //--- TP3 (3:1) - Triple ganancia
   CreateRect(PREFIX+"TP3Box", x + PADDING + (thirdW + PADDING) * 2, y, thirdW, tpBoxH, C'40,80,60');
   CreateLabel(PREFIX+"TP3Title", x + PADDING + (thirdW + PADDING) * 2 + 20, y + 6, "TP3 (3:1)", FONT_SMALL - 2, CLR_GREEN);
   CreateLabel(PREFIX+"TP3Price", x + PADDING + (thirdW + PADDING) * 2 + 40, y + 35, "0.00", FONT_SMALL - 2, CLR_TEXT);
   CreateLabel(PREFIX+"TP3Profit", x + PADDING + (thirdW + PADDING) * 2 + 20, y + 60, "+$0", FONT_SMALL - 2, C'150,255,150');
   y += tpBoxH + PADDING;



   //--- Buttons
   CreateButton(PREFIX+"BtnCalc", x + PADDING, y, contentW, BTN_H, "CALCULAR", CLR_BLUE);
   y += BTN_H + 12;

   CreateButton(PREFIX+"BtnBuy", x + PADDING, y, halfW, BTN_H, "BUY", CLR_GREEN);
   CreateButton(PREFIX+"BtnSell", x + PADDING + halfW + PADDING, y, halfW, BTN_H, "SELL", CLR_RED);
   y += BTN_H + 12;

   CreateButton(PREFIX+"BtnClosePos", x + PADDING, y, contentW, 40, "CERRAR POSICIONES", C'80,80,90');

   ChartRedraw();
}

//+------------------------------------------------------------------+
//| Toggle collapse/expand                                             |
//+------------------------------------------------------------------+
void ToggleCollapse()
{
   isCollapsed = !isCollapsed;
   CreatePanel();
   if(!isCollapsed) Calculate();
}

//+------------------------------------------------------------------+
//| Move all panel objects                                             |
//+------------------------------------------------------------------+
void MovePanel(int newX, int newY)
{
   int deltaX = newX - panelX;
   int deltaY = newY - panelY;

   panelX = newX;
   panelY = newY;

   //--- Move all objects with prefix
   int total = ObjectsTotal(0, 0, -1);
   for(int i = 0; i < total; i++)
   {
      string name = ObjectName(0, i, 0, -1);
      if(StringFind(name, PREFIX) == 0)
      {
         int objX = (int)ObjectGetInteger(0, name, OBJPROP_XDISTANCE);
         int objY = (int)ObjectGetInteger(0, name, OBJPROP_YDISTANCE);
         ObjectSetInteger(0, name, OBJPROP_XDISTANCE, objX + deltaX);
         ObjectSetInteger(0, name, OBJPROP_YDISTANCE, objY + deltaY);
      }
   }
   ChartRedraw();
}

//+------------------------------------------------------------------+
//| Calculate everything                                               |
//+------------------------------------------------------------------+
void Calculate()
{
   if(isCollapsed) return;

   //--- Read inputs
   g_entrada = StringToDouble(ObjectGetString(0, PREFIX+"InpEntrada", OBJPROP_TEXT));
   g_sl = StringToDouble(ObjectGetString(0, PREFIX+"InpSL", OBJPROP_TEXT));
   g_tp = StringToDouble(ObjectGetString(0, PREFIX+"InpTP", OBJPROP_TEXT));
   g_spread = StringToDouble(ObjectGetString(0, PREFIX+"InpSpread", OBJPROP_TEXT));
   g_vpp = StringToDouble(ObjectGetString(0, PREFIX+"InpVPP", OBJPROP_TEXT));
   g_riesgoPct = StringToDouble(ObjectGetString(0, PREFIX+"InpRiesgoPct", OBJPROP_TEXT));

   //--- Calculate risk in USD from percentage
   double balance = AccountInfoDouble(ACCOUNT_BALANCE);
   g_riesgoUSD = balance * (g_riesgoPct / 100.0);
   ObjectSetString(0, PREFIX+"InpRiesgoUSD", OBJPROP_TEXT, DoubleToString(g_riesgoUSD, 2));

   //--- Determine direction (Long or Short) and calculate stop points
   if(g_entrada > 0 && g_sl > 0)
   {
      g_isLong = (g_entrada > g_sl);
      g_stopPts = MathAbs(g_entrada - g_sl);
      ObjectSetString(0, PREFIX+"InpStopPts", OBJPROP_TEXT, DoubleToString(g_stopPts, 2));
   }
   else
   {
      // Si no hay entrada/SL, intentar leer stop pts manual
      g_stopPts = StringToDouble(ObjectGetString(0, PREFIX+"InpStopPts", OBJPROP_TEXT));
   }

   //--- Auto-calculate TP points from prices
   if(g_entrada > 0 && g_tp > 0)
   {
      g_tpPts = MathAbs(g_tp - g_entrada);
      ObjectSetString(0, PREFIX+"InpTPPts", OBJPROP_TEXT, DoubleToString(g_tpPts, 2));
   }
   else
   {
      g_tpPts = StringToDouble(ObjectGetString(0, PREFIX+"InpTPPts", OBJPROP_TEXT));
   }

   //--- Calculate lots using symbol tick value
   g_lotes = 0;
   if(g_stopPts > 0 && g_riesgoUSD > 0)
   {
      double tickSize = SymbolInfoDouble(_Symbol, SYMBOL_TRADE_TICK_SIZE);
      double tickValue = SymbolInfoDouble(_Symbol, SYMBOL_TRADE_TICK_VALUE);
      double lotStep = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_STEP);
      double minLot = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MIN);
      double maxLot = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MAX);

      // Calcular distancia total del SL incluyendo spread
      double stopTotal = g_stopPts;
      if(g_spread > 0)
      {
         double point = SymbolInfoDouble(_Symbol, SYMBOL_POINT);
         stopTotal += g_spread * point;  // Spread en puntos convertido a precio
      }

      // Calcular valor monetario del SL por lote
      if(tickSize > 0 && tickValue > 0)
      {
         double slValuePerLot = (stopTotal / tickSize) * tickValue;

         if(slValuePerLot > 0)
         {
            g_lotes = g_riesgoUSD / slValuePerLot;

            // Redondear al step de lote
            if(lotStep > 0)
               g_lotes = MathFloor(g_lotes / lotStep) * lotStep;

            // Aplicar limites min/max
            if(g_lotes < minLot) g_lotes = minLot;
            if(g_lotes > maxLot) g_lotes = maxLot;

            // Redondear a 2 decimales
            g_lotes = NormalizeDouble(g_lotes, 2);
         }
      }
   }

   //--- Get symbol tick info for profit calculations
   double tickSize = SymbolInfoDouble(_Symbol, SYMBOL_TRADE_TICK_SIZE);
   double tickValue = SymbolInfoDouble(_Symbol, SYMBOL_TRADE_TICK_VALUE);

   //--- Calculate profit based on TP
   g_ganancia = 0;
   if(g_tpPts > 0 && g_lotes > 0 && tickSize > 0 && tickValue > 0)
   {
      g_ganancia = (g_tpPts / tickSize) * tickValue * g_lotes;
   }

   //--- Calculate ratio
   g_ratio = 0;
   if(g_stopPts > 0 && g_tpPts > 0)
   {
      g_ratio = g_tpPts / g_stopPts;
   }

   //--- Calculate TP levels based on R:B ratios (1:1, 2:1, 3:1)
   g_tp1_price = 0;
   g_tp2_price = 0;
   g_tp3_price = 0;
   g_tp1_profit = 0;
   g_tp2_profit = 0;
   g_tp3_profit = 0;

   if(g_entrada > 0 && g_stopPts > 0)
   {
      if(g_isLong)
      {
         // Long: TPs arriba del entry
         g_tp1_price = g_entrada + g_stopPts;       // 1:1 (1x distancia SL)
         g_tp2_price = g_entrada + (g_stopPts * 2); // 2:1 (2x distancia SL)
         g_tp3_price = g_entrada + (g_stopPts * 3); // 3:1 (3x distancia SL)
      }
      else
      {
         // Short: TPs abajo del entry
         g_tp1_price = g_entrada - g_stopPts;       // 1:1 (1x distancia SL)
         g_tp2_price = g_entrada - (g_stopPts * 2); // 2:1 (2x distancia SL)
         g_tp3_price = g_entrada - (g_stopPts * 3); // 3:1 (3x distancia SL)
      }

      // Calculate profits for each TP level using tick value
      if(g_lotes > 0 && tickSize > 0 && tickValue > 0)
      {
         g_tp1_profit = (g_stopPts / tickSize) * tickValue * g_lotes;       // 1:1
         g_tp2_profit = (g_stopPts * 2 / tickSize) * tickValue * g_lotes;   // 2:1
         g_tp3_profit = (g_stopPts * 3 / tickSize) * tickValue * g_lotes;   // 3:1
      }
   }

   //--- Update display
   ObjectSetString(0, PREFIX+"LblLotes", OBJPROP_TEXT, DoubleToString(g_lotes, 2));
   ObjectSetString(0, PREFIX+"RiskVal", OBJPROP_TEXT, "-$" + DoubleToString(g_riesgoUSD, 2));
   ObjectSetString(0, PREFIX+"RewardVal", OBJPROP_TEXT, "+$" + DoubleToString(g_ganancia, 2));

   //--- Update ratio with color
   ObjectSetString(0, PREFIX+"LblRatio", OBJPROP_TEXT, "1:" + DoubleToString(g_ratio, 1));
   color ratioClr = clrTomato;
   if(g_ratio >= 2) ratioClr = clrLime;
   else if(g_ratio >= 1) ratioClr = clrYellow;
   ObjectSetInteger(0, PREFIX+"LblRatio", OBJPROP_COLOR, ratioClr);

   //--- Update TP levels
   ObjectSetString(0, PREFIX+"TP1Price", OBJPROP_TEXT, DoubleToString(g_tp1_price, 2));
   ObjectSetString(0, PREFIX+"TP2Price", OBJPROP_TEXT, DoubleToString(g_tp2_price, 2));
   ObjectSetString(0, PREFIX+"TP3Price", OBJPROP_TEXT, DoubleToString(g_tp3_price, 2));

   ObjectSetString(0, PREFIX+"TP1Profit", OBJPROP_TEXT, "+$" + DoubleToString(g_tp1_profit, 2));
   ObjectSetString(0, PREFIX+"TP2Profit", OBJPROP_TEXT, "+$" + DoubleToString(g_tp2_profit, 2));
   ObjectSetString(0, PREFIX+"TP3Profit", OBJPROP_TEXT, "+$" + DoubleToString(g_tp3_profit, 2));

   ChartRedraw();
}

//+------------------------------------------------------------------+
//| Execute BUY                                                        |
//+------------------------------------------------------------------+
void ExecuteBuy()
{
   if(g_lotes <= 0)
   {
      Alert("Error: Calcula primero los lotes");
      return;
   }

   //--- Get current price
   double price = SymbolInfoDouble(_Symbol, SYMBOL_ASK);

   //--- Determine SL price
   double slPrice = 0;
   if(g_sl > 0)
   {
      slPrice = g_sl;  // Usar el SL ingresado directamente
   }
   else if(g_stopPts > 0)
   {
      slPrice = price - g_stopPts;  // Calcular desde puntos
   }

   //--- Determine TP price (usar TP2 como default si no hay TP ingresado)
   double tpPrice = 0;
   if(g_tp > 0)
   {
      tpPrice = g_tp;  // Usar el TP ingresado directamente
   }
   else if(g_tp2_price > 0)
   {
      tpPrice = g_tp2_price;  // Usar TP2 (1:2) como default
   }
   else if(g_tpPts > 0)
   {
      tpPrice = price + g_tpPts;
   }

   //--- Normalize prices
   int digits = (int)SymbolInfoInteger(_Symbol, SYMBOL_DIGITS);
   price = NormalizeDouble(price, digits);
   slPrice = NormalizeDouble(slPrice, digits);
   tpPrice = NormalizeDouble(tpPrice, digits);

   //--- Execute order
   if(trade.Buy(g_lotes, _Symbol, price, slPrice, tpPrice, "RiskCalc BUY"))
   {
      Alert("BUY Ejecutado: ", g_lotes, " lotes @ ", price, " | SL: ", slPrice, " | TP: ", tpPrice);
   }
   else
   {
      Alert("Error al ejecutar BUY: ", trade.ResultRetcode(), " - ", trade.ResultRetcodeDescription());
   }
}

//+------------------------------------------------------------------+
//| Execute SELL                                                       |
//+------------------------------------------------------------------+
void ExecuteSell()
{
   if(g_lotes <= 0)
   {
      Alert("Error: Calcula primero los lotes");
      return;
   }

   //--- Get current price
   double price = SymbolInfoDouble(_Symbol, SYMBOL_BID);

   //--- Determine SL price
   double slPrice = 0;
   if(g_sl > 0)
   {
      slPrice = g_sl;  // Usar el SL ingresado directamente
   }
   else if(g_stopPts > 0)
   {
      slPrice = price + g_stopPts;  // Calcular desde puntos
   }

   //--- Determine TP price (usar TP2 como default si no hay TP ingresado)
   double tpPrice = 0;
   if(g_tp > 0)
   {
      tpPrice = g_tp;  // Usar el TP ingresado directamente
   }
   else if(g_tp2_price > 0)
   {
      tpPrice = g_tp2_price;  // Usar TP2 (1:2) como default
   }
   else if(g_tpPts > 0)
   {
      tpPrice = price - g_tpPts;
   }

   //--- Normalize prices
   int digits = (int)SymbolInfoInteger(_Symbol, SYMBOL_DIGITS);
   price = NormalizeDouble(price, digits);
   slPrice = NormalizeDouble(slPrice, digits);
   tpPrice = NormalizeDouble(tpPrice, digits);

   //--- Execute order
   if(trade.Sell(g_lotes, _Symbol, price, slPrice, tpPrice, "RiskCalc SELL"))
   {
      Alert("SELL Ejecutado: ", g_lotes, " lotes @ ", price, " | SL: ", slPrice, " | TP: ", tpPrice);
   }
   else
   {
      Alert("Error al ejecutar SELL: ", trade.ResultRetcode(), " - ", trade.ResultRetcodeDescription());
   }
}

//+------------------------------------------------------------------+
//| Close all positions                                                |
//+------------------------------------------------------------------+
void CloseAll()
{
   int closed = 0;
   for(int i = PositionsTotal() - 1; i >= 0; i--)
   {
      ulong ticket = PositionGetTicket(i);
      if(PositionSelectByTicket(ticket))
      {
         if(PositionGetString(POSITION_SYMBOL) == _Symbol)
         {
            if(trade.PositionClose(ticket))
               closed++;
         }
      }
   }
   if(closed > 0)
      Alert("Cerradas ", closed, " posiciones en ", _Symbol);
   else
      Alert("No hay posiciones abiertas en ", _Symbol);
}

//+------------------------------------------------------------------+
//| Chart event handler                                                |
//+------------------------------------------------------------------+
void OnChartEvent(const int id, const long &lparam, const double &dparam, const string &sparam)
{
   //--- Mouse events for dragging
   if(id == CHARTEVENT_MOUSE_MOVE)
   {
      int mouseX = (int)lparam;
      int mouseY = (int)dparam;
      uint state = (uint)sparam;

      bool leftButton = (state & 1) == 1;

      if(leftButton)
      {
         //--- Check if clicking on header (but not on collapse button)
         if(!isDragging)
         {
            if(mouseX >= panelX && mouseX <= panelX + panelWidth - 50 &&
               mouseY >= panelY && mouseY <= panelY + headerH)
            {
               isDragging = true;
               dragOffsetX = mouseX - panelX;
               dragOffsetY = mouseY - panelY;
            }
         }
         else
         {
            //--- Move panel
            int newX = mouseX - dragOffsetX;
            int newY = mouseY - dragOffsetY;

            //--- Keep on screen
            if(newX < 0) newX = 0;
            if(newY < 0) newY = 0;

            MovePanel(newX, newY);
         }
      }
      else
      {
         isDragging = false;
      }
   }

   //--- Object clicks
   if(id == CHARTEVENT_OBJECT_CLICK)
   {
      //--- Collapse button
      if(sparam == PREFIX+"BtnCollapse")
      {
         ToggleCollapse();
         return;
      }

      //--- Other buttons
      if(sparam == PREFIX+"BtnCalc")
      {
         Calculate();
         ObjectSetInteger(0, sparam, OBJPROP_STATE, false);
      }
      else if(sparam == PREFIX+"BtnBuy")
      {
         ExecuteBuy();
         ObjectSetInteger(0, sparam, OBJPROP_STATE, false);
      }
      else if(sparam == PREFIX+"BtnSell")
      {
         ExecuteSell();
         ObjectSetInteger(0, sparam, OBJPROP_STATE, false);
      }
      else if(sparam == PREFIX+"BtnClosePos")
      {
         CloseAll();
         ObjectSetInteger(0, sparam, OBJPROP_STATE, false);
      }
   }

   //--- Auto-calculate when any edit field changes
   if(id == CHARTEVENT_OBJECT_ENDEDIT)
   {
      //--- Check if it's one of our input fields
      if(StringFind(sparam, PREFIX+"Inp") == 0)
      {
         Calculate();  // Auto-calculate on any input change
      }
   }
}

//+------------------------------------------------------------------+
//| Create rectangle                                                   |
//+------------------------------------------------------------------+
void CreateRect(string name, int x, int y, int w, int h, color clr)
{
   ObjectCreate(0, name, OBJ_RECTANGLE_LABEL, 0, 0, 0);
   ObjectSetInteger(0, name, OBJPROP_XDISTANCE, x);
   ObjectSetInteger(0, name, OBJPROP_YDISTANCE, y);
   ObjectSetInteger(0, name, OBJPROP_XSIZE, w);
   ObjectSetInteger(0, name, OBJPROP_YSIZE, h);
   ObjectSetInteger(0, name, OBJPROP_BGCOLOR, clr);
   ObjectSetInteger(0, name, OBJPROP_BORDER_TYPE, BORDER_FLAT);
   ObjectSetInteger(0, name, OBJPROP_CORNER, CORNER_LEFT_UPPER);
   ObjectSetInteger(0, name, OBJPROP_COLOR, clr);
   ObjectSetInteger(0, name, OBJPROP_BACK, false);
   ObjectSetInteger(0, name, OBJPROP_SELECTABLE, false);
}

//+------------------------------------------------------------------+
//| Create label                                                       |
//+------------------------------------------------------------------+
void CreateLabel(string name, int x, int y, string text, int size, color clr)
{
   ObjectCreate(0, name, OBJ_LABEL, 0, 0, 0);
   ObjectSetInteger(0, name, OBJPROP_XDISTANCE, x);
   ObjectSetInteger(0, name, OBJPROP_YDISTANCE, y);
   ObjectSetString(0, name, OBJPROP_TEXT, text);
   ObjectSetString(0, name, OBJPROP_FONT, "Arial Bold");
   ObjectSetInteger(0, name, OBJPROP_FONTSIZE, size);
   ObjectSetInteger(0, name, OBJPROP_COLOR, clr);
   ObjectSetInteger(0, name, OBJPROP_CORNER, CORNER_LEFT_UPPER);
   ObjectSetInteger(0, name, OBJPROP_BACK, false);
   ObjectSetInteger(0, name, OBJPROP_SELECTABLE, false);
}

//+------------------------------------------------------------------+
//| Create edit                                                        |
//+------------------------------------------------------------------+
void CreateEdit(string name, int x, int y, int w, int h, string text)
{
   ObjectCreate(0, name, OBJ_EDIT, 0, 0, 0);
   ObjectSetInteger(0, name, OBJPROP_XDISTANCE, x);
   ObjectSetInteger(0, name, OBJPROP_YDISTANCE, y);
   ObjectSetInteger(0, name, OBJPROP_XSIZE, w);
   ObjectSetInteger(0, name, OBJPROP_YSIZE, h);
   ObjectSetString(0, name, OBJPROP_TEXT, text);
   ObjectSetString(0, name, OBJPROP_FONT, "Arial");
   ObjectSetInteger(0, name, OBJPROP_FONTSIZE, FONT_MEDIUM);
   ObjectSetInteger(0, name, OBJPROP_COLOR, CLR_TEXT);
   ObjectSetInteger(0, name, OBJPROP_BGCOLOR, CLR_INPUT_BG);
   ObjectSetInteger(0, name, OBJPROP_BORDER_COLOR, CLR_BORDER);
   ObjectSetInteger(0, name, OBJPROP_CORNER, CORNER_LEFT_UPPER);
   ObjectSetInteger(0, name, OBJPROP_ALIGN, ALIGN_CENTER);
   ObjectSetInteger(0, name, OBJPROP_READONLY, false);
   ObjectSetInteger(0, name, OBJPROP_BACK, false);
   ObjectSetInteger(0, name, OBJPROP_SELECTABLE, false);
}

//+------------------------------------------------------------------+
//| Create button                                                      |
//+------------------------------------------------------------------+
void CreateButton(string name, int x, int y, int w, int h, string text, color clr)
{
   ObjectCreate(0, name, OBJ_BUTTON, 0, 0, 0);
   ObjectSetInteger(0, name, OBJPROP_XDISTANCE, x);
   ObjectSetInteger(0, name, OBJPROP_YDISTANCE, y);
   ObjectSetInteger(0, name, OBJPROP_XSIZE, w);
   ObjectSetInteger(0, name, OBJPROP_YSIZE, h);
   ObjectSetString(0, name, OBJPROP_TEXT, text);
   ObjectSetString(0, name, OBJPROP_FONT, "Arial Bold");
   ObjectSetInteger(0, name, OBJPROP_FONTSIZE, FONT_MEDIUM);
   ObjectSetInteger(0, name, OBJPROP_COLOR, CLR_TEXT);
   ObjectSetInteger(0, name, OBJPROP_BGCOLOR, clr);
   ObjectSetInteger(0, name, OBJPROP_BORDER_COLOR, clr);
   ObjectSetInteger(0, name, OBJPROP_CORNER, CORNER_LEFT_UPPER);
   ObjectSetInteger(0, name, OBJPROP_BACK, false);
   ObjectSetInteger(0, name, OBJPROP_SELECTABLE, false);
}

//+------------------------------------------------------------------+
//| OnTick - Update spread                                             |
//+------------------------------------------------------------------+
void OnTick()
{
   if(isCollapsed) return;
   double spread = (double)SymbolInfoInteger(_Symbol, SYMBOL_SPREAD);
   ObjectSetString(0, PREFIX+"InpSpread", OBJPROP_TEXT, DoubleToString(spread, 0));
}
//+------------------------------------------------------------------+
