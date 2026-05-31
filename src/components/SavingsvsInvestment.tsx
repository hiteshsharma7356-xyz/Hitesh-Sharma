/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { ShieldCheck, TrendingUp, AlertTriangle, HelpCircle, Flame, ArrowRight } from 'lucide-react';
import { DataPoint } from '../types';

export default function SavingsvsInvestment() {
  const [monthlySavings, setMonthlySavings] = useState<number>(5000);
  const [inflationRate, setInflationRate] = useState<number>(6.5);
  const [bankRate, setBankRate] = useState<number>(3.5);
  const [investRate, setInvestRate] = useState<number>(12);
  const [years, setYears] = useState<number>(15);

  // Compute values dynamically
  const simulationData = useMemo(() => {
    const data: DataPoint[] = [];
    const months = years * 12;
    
    const rBank = bankRate / 12 / 100;
    const rInvest = investRate / 12 / 100;
    const rInf = inflationRate / 12 / 100;

    for (let y = 1; y <= years; y++) {
      const mCount = y * 12;
      
      // Total Deposits
      const totalDeposits = monthlySavings * mCount;
      
      // Bank Savings with compound interest
      let bankSavings = 0;
      if (rBank > 0) {
        bankSavings = monthlySavings * ((Math.pow(1 + rBank, mCount) - 1) / rBank) * (1 + rBank);
      } else {
        bankSavings = totalDeposits;
      }

      // Inflation Adjusted purchasing power of nominal saving
      // How much the saved cash (plus bank interest) is worth in today's buying power
      const inflationAdjustedSavings = bankSavings / Math.pow(1 + inflationRate / 100, y);

      // Investment with compound interest (SIP)
      let investments = 0;
      if (rInvest > 0) {
        investments = monthlySavings * ((Math.pow(1 + rInvest, mCount) - 1) / rInvest) * (1 + rInvest);
      } else {
        investments = totalDeposits;
      }

      data.push({
        year: y,
        deposits: Math.round(totalDeposits),
        bankSavings: Math.round(bankSavings),
        inflationAdjustedSavings: Math.round(inflationAdjustedSavings),
        investments: Math.round(investments),
      });
    }
    return data;
  }, [monthlySavings, inflationRate, bankRate, investRate, years]);

  const finalYearData = simulationData[simulationData.length - 1] || {
    deposits: 0,
    bankSavings: 0,
    inflationAdjustedSavings: 0,
    investments: 0,
    year: years,
  };

  // SVG Chart Dimensions
  const chartWidth = 560;
  const chartHeight = 280;
  const paddingX = 60;
  const paddingY = 40;

  // Find max value in data for chart scaling
  const maxVal = useMemo(() => {
    return Math.max(...simulationData.map(d => d.investments), 10000);
  }, [simulationData]);

  // Map values to screen coordinates
  const points = useMemo(() => {
    return simulationData.map((d, idx) => {
      const x = paddingX + (idx / (simulationData.length - 1 || 1)) * (chartWidth - paddingX * 2);
      
      // Y fits between (chartHeight - paddingY) and paddingY
      const yDeposit = chartHeight - paddingY - (d.deposits / maxVal) * (chartHeight - paddingY * 2);
      const yBank = chartHeight - paddingY - (d.bankSavings / maxVal) * (chartHeight - paddingY * 2);
      const yReal = chartHeight - paddingY - (d.inflationAdjustedSavings / maxVal) * (chartHeight - paddingY * 2);
      const yInvest = chartHeight - paddingY - (d.investments / maxVal) * (chartHeight - paddingY * 2);

      return { x, yDeposit, yBank, yReal, yInvest, year: d.year };
    });
  }, [simulationData, maxVal]);

  const pathDeposits = points.map(p => `${p.x},${p.yDeposit}`).join(' ');
  const pathBank = points.map(p => `${p.x},${p.yBank}`).join(' ');
  const pathReal = points.map(p => `${p.x},${p.yReal}`).join(' ');
  const pathInvest = points.map(p => `${p.x},${p.yInvest}`).join(' ');

  // Helper to format rupees in Lakhs/Thousands
  const formatCurrency = (val: number) => {
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)} लाख`;
    }
    return `₹${val.toLocaleString('en-IN')}`;
  };

  // Savings Erosion Calculation Example
  const inflationLoss = finalYearData.bankSavings - finalYearData.inflationAdjustedSavings;
  const inflationLossPercent = finalYearData.bankSavings > 0 
    ? Math.round((inflationLoss / finalYearData.bankSavings) * 100) 
    : 0;

  return (
    <div className="space-y-8">
      {/* Script Lesson Intro Hero Banner */}
      <div id="intro-card" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute left-0 bottom-0 -translate-x-12 translate-y-12 w-64 h-64 bg-rose-500/10 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.y py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-full uppercase tracking-wider mb-2">
            एक कड़वा सच (The Hard Truth)
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight leading-tight md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400">
            आपकी बचत दरअसल आपको गरीब बना रही है!
          </h1>
          <p className="text-slate-300 md:text-lg max-w-3xl leading-relaxed">
            बैंक में रखी बचत आपको सुरक्षित महसूस कराती है, लेकिन पर्दे के पीछे <strong>महंगाई (Inflation)</strong> दीमक की तरह आपके पैसों की असली कीमत चुरा रही है। निवेश ही वह हथियार है जो पैसे की कीमत को बढ़ाता है।
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
            <div className="flex items-start gap-3 bg-slate-950/50 p-4 rounded-xl border border-slate-800">
              <ShieldCheck className="w-8 h-8 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-200">बचत (Savings) क्या है?</h4>
                <p className="text-sm text-slate-400 mt-1 leading-snug">पैसा सुरक्षित रखती है, लेकिन यह निष्क्रिय है। <strong>तुलना:</strong> बैंक आपको देता है <strong className="text-white">{bankRate}%</strong> ब्याज, लेकिन महंगाई बढ़ रही है <strong className="text-rose-400">{inflationRate}%</strong> की दर से।</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 bg-emerald-950/20 p-4 rounded-xl border border-emerald-900/30">
              <TrendingUp className="w-8 h-8 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-emerald-300">निवेश (Investment) क्या है?</h4>
                <p className="text-sm text-emerald-400 mt-1 leading-snug">पैसा काम पर लगाती है और इसे बढ़ाती है। लम्बे समय में व्यवस्थित तरीके से <strong className="text-white">{investRate}%</strong> या अधिक की दर से कंपाउंडिंग का जादू शुरू होता है।</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simulator Tools Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sliders Input Panel */}
        <div id="sim-sliders" className="lg:col-span-5 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
              सिम्युलेटर सेटिंग्स (Simulator Parameters)
            </h3>
            <p className="text-xs text-slate-400 mt-1">अपने अनुसार मूल्यों को सेट करके परिणाम देखें</p>
          </div>

          {/* Monthly Savings */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <label className="font-medium text-slate-700">मासिक बचत (Monthly Savings)</label>
              <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-xs">
                {monthlySavings.toLocaleString('en-IN')} रुपये
              </span>
            </div>
            <input 
              type="range" 
              min="500" 
              max="50000" 
              step="500" 
              value={monthlySavings}
              onChange={(e) => setMonthlySavings(Number(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>₹500</span>
              <span>₹25,000</span>
              <span>₹50,000</span>
            </div>
          </div>

          {/* Bank Saving Interest Rate */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <label className="font-medium text-slate-700 flex items-center gap-1">
                बैंक ब्याज दर (Savings Interest Rate)
              </label>
              <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-xs">
                {bankRate}% वार्षिक
              </span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="10" 
              step="0.5" 
              value={bankRate}
              onChange={(e) => setBankRate(Number(e.target.value))}
              className="w-full h-2 bg-indigo-50 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>1%</span>
              <span>5%</span>
              <span>10%</span>
            </div>
          </div>

          {/* Inflation Rate */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <label className="font-medium text-slate-700 flex items-center gap-1">
                महंगाई दर (Inflation Rate) <Flame className="w-3.5 h-3.5 text-rose-500" />
              </label>
              <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded text-xs">
                {inflationRate}% वार्षिक
              </span>
            </div>
            <input 
              type="range" 
              min="3" 
              max="12" 
              step="0.5" 
              value={inflationRate}
              onChange={(e) => setInflationRate(Number(e.target.value))}
              className="w-full h-2 bg-rose-50 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>3%</span>
              <span>7.5%</span>
              <span>12%</span>
            </div>
          </div>

          {/* Mutual Fund Investment Return */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <label className="font-medium text-slate-700">अनुमानित निवेश रिटर्न (Estimated Return)</label>
              <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-xs">
                {investRate}% वार्षिक (SIP)
              </span>
            </div>
            <input 
              type="range" 
              min="8" 
              max="18" 
              step="0.5" 
              value={investRate}
              onChange={(e) => setInvestRate(Number(e.target.value))}
              className="w-full h-2 bg-emerald-50 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>8%</span>
              <span>13%</span>
              <span>18%</span>
            </div>
          </div>

          {/* Tenure in Years */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <label className="font-medium text-slate-700">अवधि (Years Tenure)</label>
              <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded text-xs">
                {years} साल
              </span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="25" 
              step="1" 
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full h-2 bg-amber-50 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>1 साल</span>
              <span>13 साल</span>
              <span>25 साल</span>
            </div>
          </div>
        </div>

        {/* Chart and Results Panel */}
        <div id="sim-results" className="lg:col-span-7 space-y-6">
          {/* Main Comparison KPI metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
              <span className="text-xs text-slate-500 block">कुल जमा नकद (Deposits)</span>
              <span className="text-lg font-bold text-slate-800 mt-1 block">
                {formatCurrency(finalYearData.deposits)}
              </span>
              <span className="text-[10px] text-slate-400 block mt-1">₹{monthlySavings.toLocaleString()} × {years * 12} महीने</span>
            </div>

            <div className="bg-rose-50/50 border border-rose-100/40 rounded-xl p-4 relative overflow-hidden">
              <span className="text-xs text-rose-700 block flex items-center gap-1 font-medium">
                बचत की असली वैल्यू <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
              </span>
              <span className="text-lg font-extrabold text-rose-600 mt-1 block">
                {formatCurrency(finalYearData.inflationAdjustedSavings)}
              </span>
              <span className="text-[10px] text-rose-500 block mt-1">
                महंगाई के कारण <strong>{inflationLossPercent}%</strong> क्रय शक्ति खत्म!
              </span>
            </div>

            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
              <span className="text-xs text-emerald-700 block font-medium">निवेश वैल्यू (Investments)</span>
              <span className="text-lg font-extrabold text-emerald-600 mt-1 block">
                {formatCurrency(finalYearData.investments)}
              </span>
              <span className="text-[10px] text-emerald-500 block mt-1 font-semibold">
                कंपाउंडिंग ने बढ़ाया {((finalYearData.investments / finalYearData.deposits) * 100 - 100).toFixed(0)}% पैसा!
              </span>
            </div>
          </div>

          {/* Interactive Custom SVG Line Chart */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
              <div>
                <h4 className="font-bold text-slate-800 text-sm">वेल्थ चार्ट (Wealth Visualizer over {years} Years)</h4>
                <p className="text-xs text-slate-400">दिखाता है कि कैसे समय के साथ महंगाई बचत को खाती है और निवेश बढ़ता है</p>
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-medium">
                <span className="flex items-center gap-1"><span className="w-3 h-1 bg-emerald-500 rounded"></span> निवेश (SIP)</span>
                <span className="flex items-center gap-1"><span className="w-3 h-1 bg-indigo-500 rounded"></span> बैंक बचत</span>
                <span className="flex items-center gap-1"><span className="w-3 h-1 bg-rose-500 rounded text-rose-500 font-bold">---</span> असली कीमत (Inflation)</span>
                <span className="flex items-center gap-1"><span className="w-3 h-1 bg-slate-300 rounded"></span> नकद जमा</span>
              </div>
            </div>

            {/* SVG Visual graph */}
            <div className="relative">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto overflow-visible select-none">
                {/* Horizontal grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                  const y = paddingY + ratio * (chartHeight - paddingY * 2);
                  const lbl = Math.round(maxVal * (1 - ratio));
                  return (
                    <g key={idx} className="opacity-40">
                      <line 
                        x1={paddingX} 
                        y1={y} 
                        x2={chartWidth - paddingX} 
                        y2={y} 
                        stroke="#e2e8f0" 
                        strokeWidth="1" 
                        strokeDasharray="4,4" 
                      />
                      <text 
                        x={paddingX - 10} 
                        y={y + 4} 
                        textAnchor="end" 
                        fontSize="9" 
                        fill="#94a3b8" 
                        fontFamily="monospace"
                      >
                        {lbl >= 100000 ? `${(lbl / 100000).toFixed(1)}L` : `${lbl}`}
                      </text>
                    </g>
                  );
                })}

                {/* X Axis Years marks */}
                {points.filter((_, i) => i === 0 || i === Math.floor(points.length / 2) || i === points.length - 1).map((p, idx) => {
                  return (
                    <g key={idx}>
                      <line 
                        x1={p.x} 
                        y1={chartHeight - paddingY} 
                        x2={p.x} 
                        y2={chartHeight - paddingY + 5} 
                        stroke="#cbd5e1" 
                      />
                      <text 
                        x={p.x} 
                        y={chartHeight - paddingY + 18} 
                        textAnchor="middle" 
                        fontSize="10" 
                        fill="#64748b"
                        fontWeight="semibold"
                      >
                        Year {p.year}
                      </text>
                    </g>
                  );
                })}

                {/* Line coordinates paths */}
                <polyline fill="none" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="3,3" points={pathDeposits} />
                <polyline fill="none" stroke="#6366f1" strokeWidth="2.5" points={pathBank} />
                <polyline fill="none" stroke="#f43f5e" strokeWidth="2" strokeDasharray="6,4" points={pathReal} />
                <polyline fill="none" stroke="#10b981" strokeWidth="3.5" points={pathInvest} />

                {/* Highlight circles on final values */}
                {points.length > 0 && (
                  <>
                    {/* Deposits */}
                    <circle cx={points[points.length - 1].x} cy={points[points.length - 1].yDeposit} r="4" fill="#94a3b8" />
                    {/* Bank Savings */}
                    <circle cx={points[points.length - 1].x} cy={points[points.length - 1].yBank} r="4" fill="#6366f1" />
                    {/* Inflation Loss */}
                    <circle cx={points[points.length - 1].x} cy={points[points.length - 1].yReal} r="4.5" fill="#f43f5e" />
                    {/* Investments */}
                    <circle cx={points[points.length - 1].x} cy={points[points.length - 1].yInvest} r="5.5" fill="#10b981" />
                  </>
                )}
              </svg>
            </div>
            
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 mt-5">
              <span className="text-xs font-semibold text-slate-700 block">समीक्षा (Analysis Report)</span>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                यदि आप प्रति माह <strong>₹{monthlySavings.toLocaleString()}</strong> केवल सामान्य बचत खाते में जमा करते हैं, तो {years} साल में जमा होने वाली राशि का कुल मूल्य बैंक ब्याज के साथ ₹{finalYearData.bankSavings.toLocaleString()} होगा। लेकिन मात्र {inflationRate}% महंगाई की दर से आपके उस पैसे की असली खरीदने की क्षमता घट जाएगी और वो आज के मात्र <strong>₹{finalYearData.inflationAdjustedSavings.toLocaleString()}</strong> के बराबर ही खरीदेगी! 
                वहीं, यदि आप इसकी <strong> {investRate}% SIP म्यूचुअल फंड</strong> में निवेश करते हैं, तो आपका पैसा बढ़कर <strong>{formatCurrency(finalYearData.investments)}</strong> हो सकता है जो महंगाई दर को बहुत पीछे छोड़ देगा।
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actionable Transition Quote */}
      <div id="quote-card" className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-emerald-900">यह समझ गए? तो सवाल है कि बचत से निवेश की तरफ आगे कैसे बढ़ें?</h4>
          <p className="text-xs text-emerald-700">हम आपके सपनों को हकीकत बनाने के लिए step-by-step 8 चरणों की योजना तैयार कर रहे हैं।</p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl cursor-help transition-colors select-none shrink-0">
          चलो शुरुआत करें <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
}
