// Marcador para cmegroup.com: descarga un CSV con volumen, open interest y (cuando
// CME los publica) OHLC/settle de las últimas 30 sesiones del producto elegido,
// listo para el importador del tracker. Se ejecuta en el navegador del usuario,
// en una página de cmegroup.com, porque CME bloquea a los servidores.
//
// Uso: arrastrar el enlace "CME → CSV" a la barra de marcadores; abrir cualquier
// página de cmegroup.com; hacer clic en el marcador; elegir el activo.

export const CME_PRODUCTS = {
  ES: 133, NQ: 146, YM: 318, RTY: 8314, CL: 425, GC: 437, SI: 458, NG: 444,
};

const source = `
(async () => {
  const P = ${JSON.stringify(CME_PRODUCTS)};
  if (!/cmegroup\\.com$/.test(location.hostname)) { alert('Abre este marcador en una pagina de cmegroup.com'); return; }
  const asset = (prompt('Activo (ES, NQ, YM, RTY, CL, GC, SI, NG):', 'NQ') || '').trim().toUpperCase();
  const pid = P[asset]; if (!pid) { alert('Activo no reconocido'); return; }
  const days = parseInt(prompt('Cuantas sesiones hacia atras (max 30):', '30') || '30', 10) || 30;
  const base = 'https://www.cmegroup.com/CmeWS/mvc/';
  const num = (v) => { const n = parseFloat(String(v).replace(/[^0-9.\\-]/g, '')); return isNaN(n) ? null : n; };
  const pad = (n) => String(n).padStart(2, '0');
  const rows = []; let d = new Date(); let tries = 0;
  const status = document.createElement('div');
  status.style.cssText = 'position:fixed;top:12px;right:12px;z-index:99999;background:#1d4ed8;color:#fff;padding:10px 14px;border-radius:8px;font:13px sans-serif';
  document.body.appendChild(status);
  while (rows.length < Math.min(days, 30) && tries < 50) {
    tries++; d.setDate(d.getDate() - 1);
    if (d.getDay() === 0 || d.getDay() === 6) continue;
    const y = d.getFullYear(), m = pad(d.getMonth() + 1), dd = pad(d.getDate());
    status.textContent = 'CME ' + asset + ': ' + y + '-' + m + '-' + dd + ' (' + rows.length + ' listas)';
    try {
      const v = await fetch(base + 'Volume/Details/F/' + pid + '/' + y + m + dd + '/P?tradeDate=' + y + m + dd, { credentials: 'include' }).then((r) => r.json());
      const tot = v && v.totals; if (!tot || !num(tot.totalVolume)) continue;
      const front = (v.monthData || []).slice().sort((a, b) => (num(b.totalVolume) || 0) - (num(a.totalVolume) || 0))[0];
      let o = '', h = '', l = '', c = '';
      try {
        const s = await fetch(base + 'Settlements/Futures/Settlements/' + pid + '/FUT?tradeDate=' + m + '/' + dd + '/' + y + '&strategy=DEFAULT&pageSize=50', { credentials: 'include' }).then((r) => r.json());
        const fs = (s.settlements || []).slice().sort((a, b) => (num(b.volume) || 0) - (num(a.volume) || 0))[0];
        if (fs && num(fs.settle)) { o = num(fs.open) ?? ''; h = num(fs.high) ?? ''; l = num(fs.low) ?? ''; c = num(fs.settle); }
      } catch (e) {}
      rows.push([y + '-' + m + '-' + dd, o, h, l, c, num(tot.totalVolume), num(tot.atClose) ?? '', front ? (num(front.atClose) ?? '') : ''].join(','));
    } catch (e) {}
    await new Promise((r) => setTimeout(r, 120));
  }
  status.remove();
  if (!rows.length) { alert('CME no devolvio datos'); return; }
  rows.sort();
  const csv = 'Date,Open,High,Low,Close,Volume,Open Interest,FOI\\n' + rows.join('\\n') + '\\n';
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  a.download = asset + '_CME_' + rows[0].slice(0, 10) + '_' + rows[rows.length - 1].slice(0, 10) + '.csv';
  document.body.appendChild(a); a.click(); a.remove();
})();
`;

export const CME_BOOKMARKLET_HREF = 'javascript:' + encodeURIComponent(source.replace(/\n\s*/g, ' '));
