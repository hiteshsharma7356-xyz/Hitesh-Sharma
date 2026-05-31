/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Leaf, Calendar, Cpu, ArrowUpRight, CheckCircle, RefreshCcw } from 'lucide-react';

export default function SIPCompounding() {
  // SIP calculator states
  const [monthlySip, setMonthlySip] = useState<number>(3000);
  const [expectedReturn, setExpectedReturn] = useState<number>(12);
  const [sipYears, setSipYears] = useState<number>(15);

  // Pay self first strategy toggle
  const [saveFirst, setSaveFirst] = useState<boolean>(true);

  // Step 7 checklist state
  const [checks, setChecks] = useState({
    mandate: true,
    date: false,
    direct: false,
  });

  // Calculate SIP returns
  const results = useMemo(() => {
    const P = monthlySip;
    const r = expectedReturn / 12 / 100;
    const n = sipYears * 12;

    if (r === 0) {
      return {
        totalInvested: P * n,
        wealthGain: 0,
        totalValue: P * n,
      };
    }

    // Standard SIP compound interest formula: M * (( (1 + r)^n - 1 ) / r) * (1 + r)
    const totalValue = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const totalInvested = P * n;
    const wealthGain = Math.max(0, totalValue - totalInvested);

    return {
      totalInvested: Math.round(totalInvested),
      wealthGain: Math.round(wealthGain),
      totalValue: Math.round(totalValue),
    };
  }, [monthlySip, expectedReturn, sipYears]);

  // Helper for rupees
  const formatRupees = (val: number) => {
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)} लाख`;
    }
    return `₹${val.toLocaleString('en-IN')}`;
  };

  // Patience tree levels
  const treeLevel = useMemo(() => {
    if (sipYears <= 2) return 'seed';
    if (sipYears <= 5) return 'sapling';
    if (sipYears <= 12) return 'young-tree';
    return 'majestic-tree';
  }, [sipYears]);

  return (
    <div className="space-y-8">
      {/* STEP 4: Pay Yourself First Simulator */}
      <div id="step-4-pay-first" className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[11px] font-bold rounded-md uppercase tracking-wider mb-2">
            स्टेप चार
          </div>
          <h3 className="font-bold text-slate-800 text-base">पहले स्वयं को भुगतान करें (Pay Yourself First)</h3>
          <p className="text-xs text-slate-400 mt-1">
            "अमीर पहले निवेश करते हैं, फिर खर्च। गरीब पहले सब खर्च करते हैं, फिर अंत में जो ज़रा सा बचे उसे बचाते हैं।"
          </p>
        </div>

        {/* Comparison toggle animation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Middle/Poor style */}
          <div 
            onClick={() => setSaveFirst(false)}
            className={`cursor-pointer border p-4 rounded-xl transition-all ${
              !saveFirst ? 'border-rose-300 bg-rose-50/20 shadow-sm' : 'border-slate-100 hover:bg-slate-50'
            }`}
          >
            <span className="text-xs font-bold text-rose-600 block">पारंपरिक मानसिकता (Poor / Middle Class Flow)</span>
            <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-600">
              <span className="font-semibold text-slate-800">मासिक आय</span>
              <span>→</span>
              <span className="line-through text-slate-400">सभी खर्चे (Spend)</span>
              <span>→</span>
              <span className="font-bold text-rose-500">बचत (0 - ज़रा सी)</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2.5">
              जब पैसा अकाउंट में बचा ही नहीं, तो निवेश कैसे होगा? यह आदत पैसे का नियंत्रण आपके हाथ से छीन लेती है।
            </p>
          </div>

          {/* Wealthy style */}
          <div 
            onClick={() => setSaveFirst(true)}
            className={`cursor-pointer border p-4 rounded-xl transition-all ${
              saveFirst ? 'border-emerald-300 bg-emerald-50/20 shadow-sm' : 'border-slate-100 hover:bg-slate-50'
            }`}
          >
            <span className="text-xs font-bold text-emerald-600 block">अमीर माइंडसेट (Smart Wealth Mindset)</span>
            <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-600">
              <span className="font-semibold text-slate-800">मासिक आय</span>
              <span>→</span>
              <span className="font-bold text-emerald-500">पहले निवेश (SIP)</span>
              <span>→</span>
              <span className="text-slate-800">शेष का खर्च (Spend Rest)</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2.5">
              आय आते ही सबसे पहले निवेश हो जाता है। चाहे ₹500 हो या ₹5,000, यह आदत पूरी जिंदगी बदल देगी।
            </p>
          </div>
        </div>
      </div>

      {/* STEP 5: SIP Calculator & Compounding */}
      <div id="step-5-calculator" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-md uppercase tracking-wider mb-2">
              स्टेप पांच
            </div>
            <h3 className="font-bold text-slate-800 text-base">कंपाउंडिंग का जादू: SIP कैलकुलेटर</h3>
            <p className="text-xs text-slate-400 mt-1">
              "हर महीने एक छोटी रकम लंबे समय में करोड़ों का साम्राज्य खड़ा कर सकती है।"
            </p>
          </div>

          {/* Sliders for SIP */}
          <div className="space-y-4">
            {/* Monthly SIP Amount */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-slate-600">मासिक एसआईपी (Monthly Amount)</span>
                <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                  ₹{monthlySip.toLocaleString('en-IN')}
                </span>
              </div>
              <input 
                type="range"
                min="500"
                max="50000"
                step="500"
                value={monthlySip}
                onChange={(e) => setMonthlySip(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[9px] text-slate-400">
                <span>₹500</span>
                <span>₹25,000</span>
                <span>₹50,000</span>
              </div>
            </div>

            {/* Expected annual return */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-slate-600">अनुमानित लाभ (Estimated Return %):</span>
                <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  {expectedReturn}%
                </span>
              </div>
              <input 
                type="range"
                min="5"
                max="20"
                step="0.5"
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[9px] text-slate-400">
                <span>5%</span>
                <span>12%</span>
                <span>20%</span>
              </div>
            </div>

            {/* Duration years */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-slate-600">निवेश अवधि (Duration Years):</span>
                <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  {sipYears} साल
                </span>
              </div>
              <input 
                type="range"
                min="1"
                max="40"
                step="1"
                value={sipYears}
                onChange={(e) => setSipYears(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[9px] text-slate-400">
                <span>1 साल</span>
                <span>20 साल</span>
                <span>40 साल</span>
              </div>
            </div>
          </div>

          {/* Mathematical formula proof check block from script */}
          {monthlySip === 3000 && expectedReturn === 12 && sipYears === 15 && (
            <div className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-lg">
              <span className="text-[10px] font-bold text-emerald-700 block text-emerald-600 font-bold uppercase tracking-wider mb-1">
                📌 लाइव स्क्रिप्ट प्रमाण (Video Script verification. Complete match)
              </span>
              <p className="text-[11px] text-emerald-700 leading-snug">
                "अगर आप हर महीने <strong>₹3,000</strong> की एसआईपी <strong>15 साल</strong> तक करते हो, <strong>12% रिटर्न</strong> पर, तो आप लगाएंगे <strong>₹5.40 लाख</strong> और मिलेंगे लगभग <strong>₹15 लाख!</strong>"
              </p>
            </div>
          )}
        </div>

        {/* Display SIP Calculation output */}
        <div className="lg:col-span-7 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="border border-slate-100 bg-slate-50/50 p-4 rounded-xl">
              <span className="text-[10px] text-slate-500 block">कुल निवेशित राशि</span>
              <span className="text-base font-bold text-slate-700 block mt-1">
                {formatRupees(results.totalInvested)}
              </span>
              <span className="text-[9px] text-slate-400 mt-1 block">मूलधन (Principal)</span>
            </div>

            <div className="border border-emerald-100 bg-emerald-50/30 p-4 rounded-xl">
              <span className="text-[10px] text-emerald-700 block">अर्जित वेल्थ (Interest)</span>
              <span className="text-base font-extrabold text-emerald-600 block mt-1">
                {formatRupees(results.wealthGain)}
              </span>
              <span className="text-[9px] text-emerald-500 mt-1 block">कंपाउंडिंग से फायदा</span>
            </div>

            <div className="border border-indigo-100 bg-indigo-50/30 p-4 rounded-xl">
              <span className="text-[10px] text-indigo-700 block">कुल वेल्थ वैल्यू (Future Value)</span>
              <span className="text-base font-extrabold text-indigo-600 block mt-1">
                {formatRupees(results.totalValue)}
              </span>
              <span className="text-[9px] text-indigo-500 mt-1 block">परिपक्वता मूल्य (Total)</span>
            </div>
          </div>

          {/* Simple Visual horizontal Stacked Bar representing division */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-600 block">फंड विभाजन (Principal vs Gains Breakdown):</span>
            <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex">
              <div 
                className="bg-slate-400 h-full flex items-center justify-center text-[9px] text-white font-semibold"
                style={{ width: `${(results.totalInvested / results.totalValue) * 100}%` }}
              >
                {(results.totalInvested / results.totalValue * 100).toFixed(0)}%
              </div>
              <div 
                className="bg-emerald-500 h-full flex items-center justify-center text-[9px] text-white font-semibold"
                style={{ width: `${(results.wealthGain / results.totalValue) * 100}%` }}
              >
                {(results.wealthGain / results.totalValue * 100).toFixed(0)}% Gain
              </div>
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-400">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-slate-400 rounded-sm"></span> मूलधन निवेश (Principal)</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm"></span> संचित ब्याज लाभ (Gains)</span>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-start gap-2.5 text-xs text-slate-500 leading-normal">
            <Cpu className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
            <div>
              आपका खुद का पैसा मात्र <strong>{formatRupees(results.totalInvested)}</strong> है। बाकी बचा हुआ <strong>{formatRupees(results.wealthGain)}</strong> शुद्ध रूप से कंपाउंडिंग ब्याज का जादू है!
            </div>
          </div>
        </div>
      </div>

      {/* STEP 7: Auto-debit checklist */}
      <div id="step-7-auto-debit" className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="border-b border-slate-100 pb-2.5">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-amber-50 text-amber-700 text-[11px] font-bold rounded-md uppercase tracking-wider mb-2">
            स्टेप सात
          </div>
          <h3 className="font-bold text-slate-800 text-base">ऑटोमेट करें: खुद पर अत्यधिक भरोसा मत करो!</h3>
          <p className="text-xs text-slate-400 mt-1">
            "इंसानी दिमाग कमजोर है। खर्च टल नहीं पाता, पर निवेश टल जाता है। ऑटो-डेबिट लगाएं!"
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <label className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-100 cursor-pointer select-none">
            <input 
              type="checkbox"
              checked={checks.mandate}
              onChange={() => setChecks({...checks, mandate: !checks.mandate})}
              className="mt-0.5 w-4 h-4 text-emerald-600 rounded focus:ring-emerald-400 border-slate-200"
            />
            <div>
              <span className="text-xs font-bold text-slate-800 block">Auto-Debit सेट करें</span>
              <p className="text-[10px] text-slate-400 mt-0.5">SIP को सीधे बैंक खाते से लिंक करें</p>
            </div>
          </label>

          <label className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-100 cursor-pointer select-none">
            <input 
              type="checkbox"
              checked={checks.date}
              onChange={() => setChecks({...checks, date: !checks.date})}
              className="mt-0.5 w-4 h-4 text-emerald-600 rounded focus:ring-emerald-400 border-slate-200"
            />
            <div>
              <span className="text-xs font-bold text-slate-800 block">सैलरी के दिन डेबिट तारीख</span>
              <p className="text-[10px] text-slate-400 mt-0.5">सैलरी आते ही सबसे पहले कटे</p>
            </div>
          </label>

          <label className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-100 cursor-pointer select-none">
            <input 
              type="checkbox"
              checked={checks.direct}
              onChange={() => setChecks({...checks, direct: !checks.direct})}
              className="mt-0.5 w-4 h-4 text-emerald-600 rounded focus:ring-emerald-400 border-slate-200"
            />
            <div>
              <span className="text-xs font-bold text-slate-800 block">इच्छाशक्ति पर निर्भरता खत्म</span>
              <p className="text-[10px] text-slate-400 mt-0.5">बिना याद रखे निवेश नियमित रहेगा</p>
            </div>
          </label>
        </div>
      </div>

      {/* STEP 8: Patience Growth Tree Game (SENSATIONAL INTERACTIVE VISUAL GAME!) */}
      <div id="step-8-tree" className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-2.5">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-md uppercase tracking-wider mb-2">
            स्टेप आठ (धैर्य - Patience)
          </div>
          <h3 className="font-bold text-slate-800 text-base">सुरक्षित धैर्य का पेड़ (The Wealth Tree Growth Game)</h3>
          <p className="text-xs text-slate-400 mt-1">
            "निवेश एक पेड़ की तरह है। पहले साल में सिर्फ जड़ें मजबूत होती हैं। लेकिन धैर्य रखें, एक दिन यही पेड़ स्वर्णिम फल देगा।"
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Tree Graphics rendering based on sipYears state */}
          <div className="md:col-span-5 flex flex-col items-center justify-center bg-slate-50 border border-slate-100 rounded-2xl p-6 min-h-[220px]">
            {treeLevel === 'seed' && (
              <div className="text-center space-y-3">
                {/* Seedling graphics inside premium borders */}
                <div className="w-20 h-20 bg-amber-100 border-2 border-dashed border-amber-300 rounded-full flex items-center justify-center mx-auto animate-pulse">
                  <span className="text-2xl">🌱</span>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full">मिट्टी में नन्हा अंकुर (Seedling)</span>
                  <p className="text-[11px] text-slate-400 max-w-[200px] mx-auto text-center">
                    "पहला साल: जड़ें मजबूत हो रही हैं, दिखता कुछ नहीं। घबराकर पैसा मत निकालिए!"
                  </p>
                </div>
              </div>
            )}

            {treeLevel === 'sapling' && (
              <div className="text-center space-y-3">
                <div className="w-24 h-24 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto animate-pulse">
                  <span className="text-4xl">🪴</span>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">छोटा पौधा (Sapling - Year 3-5)</span>
                  <p className="text-[11px] text-slate-400 max-w-[200px] mx-auto text-center">
                    "पाँच साल बाद: पौधा छोटा पेड़ बन रहा है। फल तो नहीं, पर हरी पत्तियाँ दिखने लगी हैं।"
                  </p>
                </div>
              </div>
            )}

            {treeLevel === 'young-tree' && (
              <div className="text-center space-y-3">
                <div className="w-28 h-28 bg-emerald-50 border-2 border-emerald-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-5xl">🌳</span>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">फलदार पेड़ (Fruitful Tree - Year 10)</span>
                  <p className="text-[11px] text-slate-400 max-w-[200px] mx-auto text-center">
                    "दस साल बाद: पेड़ फल देने लगा है! कंपाउंडिंग का फल दिखने लगा है। धैर्य का सुंदर उत्तर!"
                  </p>
                </div>
              </div>
            )}

            {treeLevel === 'majestic-tree' && (
              <div className="text-center space-y-3">
                <div className="w-32 h-32 bg-emerald-500/10 border-2 border-emerald-400 rounded-full flex items-center justify-center mx-auto relative">
                  <span className="text-6xl animate-bounce">🌳</span>
                  <span className="absolute -top-1 -right-1 text-xl animate-pulse">✨</span>
                  <span className="absolute bottom-2 left-2 text-base">💰</span>
                  <span className="absolute bottom-2 right-2 text-base">💰</span>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-white bg-emerald-600 px-2.5 py-0.5 rounded-full">विशाल वेल्थ कल्पवृक्ष (Majestic Tree - Year 15+)</span>
                  <p className="text-[11px] text-slate-400 max-w-[200px] mx-auto text-center">
                    "पंद्रह साल+ इसकी घनी छांव में आपका पूरा परिवार बैठेगा! यही है असली फाइनेंशियल फ्रीडम।"
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Slider control explanation trigger */}
          <div className="md:col-span-7 space-y-3.5">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">समय और धैर्य परीक्षण (Time Trial Matrix)</span>
            <p className="text-xs text-slate-500 leading-relaxed">
              चक्रवृद्धि ब्याज (Compound Interest) को समय चाहिए। ऊपर दिए गए SIP duration स्लाइडर को खिसका कर <strong>कम उम्र या अधिक समय (1 साल से लेकर 40 साल)</strong> सेट करें और देखें कि आपका कल्पवृक्ष किस चरण में पहुँचता है।
            </p>
            <div className="border-l-4 border-emerald-400 pl-3 py-1 space-y-1">
              <span className="text-xs font-bold text-slate-800 block">पक्का करें कि:</span>
              <p className="text-[11px] text-slate-400">मार्केट के थोड़े गिरने पर डरकर कभी म्यूचुअल फंड से पैसा बाहर न निकालें; धैर्य ही सबसे महत्वपूर्ण निवेश है।</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
