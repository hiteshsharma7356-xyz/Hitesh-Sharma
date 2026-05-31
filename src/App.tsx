/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BudgetData, DebtItem } from './types';
import SavingsvsInvestment from './components/SavingsvsInvestment';
import BudgetPlanner from './components/BudgetPlanner';
import SIPCompounding from './components/SIPCompounding';
import AICoach from './components/AICoach';
import { ShieldCheck, TrendingUp, Sparkles, BookOpen, Calculator, CirclePlay } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'compare' | 'budget' | 'sip' | 'coach'>('compare');

  // Budget data state with local storage persistence
  const [budget, setBudget] = useState<BudgetData>(() => {
    const saved = localStorage.getItem('smart_money_budget');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return {
      monthlyIncome: 35000,
      rent: 6500,
      groceries: 4500,
      utilities: 2500,
      debtEmi: 3000,
      wants: 5500,
      existingInvestment: 3000,
    };
  });

  // Debts state with local storage persistence
  const [debts, setDebts] = useState<DebtItem[]>(() => {
    const saved = localStorage.getItem('smart_money_debts');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [];
  });

  // Save budget to localStorage whenever altered
  useEffect(() => {
    localStorage.setItem('smart_money_budget', JSON.stringify(budget));
  }, [budget]);

  // Save debts to localStorage whenever altered
  useEffect(() => {
    localStorage.setItem('smart_money_debts', JSON.stringify(debts));
  }, [debts]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Dynamic Header */}
      <header className="sticky top-0 z-50 bg-slate-900 text-white shadow-md border-b border-slate-800">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Title / Logo brand */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-tr from-emerald-500 to-indigo-600 rounded-xl flex items-center justify-center font-black text-white text-base shadow-lg shadow-emerald-500/20">
                ₹
              </div>
              <div>
                <h1 className="font-extrabold tracking-tight text-white text-sm sm:text-base flex items-center gap-1.5">
                  बचत से निवेश (Smart Money Coach)
                </h1>
                <p className="text-[10px] text-slate-400 font-medium">अपनी बचत को बढ़ाइए कल्पवृक्ष की तरह</p>
              </div>
            </div>

            {/* Quick stats on overall balance */}
            <div className="hidden sm:flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">मासिक बजट आय</span>
                <span className="text-sm font-bold text-emerald-400 font-mono">₹{budget.monthlyIncome.toLocaleString()}</span>
              </div>
              <div className="h-6 w-px bg-slate-800"></div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">नियोजित एसआईपी</span>
                <span className="text-sm font-bold text-indigo-400 font-mono">₹{budget.existingInvestment.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero script quote callout context */}
      <div className="bg-slate-900 text-slate-400 text-xs py-2 px-4 shadow-inner text-center border-b border-slate-800/60 overflow-x-auto whitespace-nowrap">
        <span className="inline-block bg-slate-800 text-amber-400 font-extrabold text-[10px] px-2 py-0.5 rounded-full mr-2 uppercase tracking-wide">
          लाइव सीख
        </span>
        "बचत वो है जो आपका पैसा सुरक्षित रखती है। निवेश वो है जो आपका पैसा बढ़ाता है।" <strong className="text-white">- वीडियो स्क्रिप्ट से</strong>
      </div>

      {/* Interactive Tabs selector */}
      <div className="border-b border-slate-200 bg-white sticky top-16 z-40 shadow-sm">
        <div className="w-full max-w-7xl mx-auto px-4">
          <nav className="flex space-x-1 py-1.5 overflow-x-auto whitespace-nowrap" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('compare')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all capitalize cursor-pointer select-none ${
                activeTab === 'compare'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/15'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="w-4 h-4 shrink-0" />
              बचत vs निवेश सिम्युलेटर
            </button>

            <button
              onClick={() => setActiveTab('budget')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all capitalize cursor-pointer select-none ${
                activeTab === 'budget'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/15'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Calculator className="w-4 h-4 shrink-0" />
              बजट और सुरक्षा रोडमैप
            </button>

            <button
              onClick={() => setActiveTab('sip')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all capitalize cursor-pointer select-none ${
                activeTab === 'sip'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/15'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              एसआईपी और कल्पवृक्ष
            </button>

            <button
              onClick={() => setActiveTab('coach')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all capitalize cursor-pointer select-none ${
                activeTab === 'coach'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/15'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              एआई कोच (AI Coach)
            </button>
          </nav>
        </div>
      </div>

      {/* Main Container Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative">
          {activeTab === 'compare' && <SavingsvsInvestment />}
          {activeTab === 'budget' && (
            <BudgetPlanner 
              budget={budget} 
              setBudget={setBudget} 
              debts={debts} 
              setDebts={setDebts} 
            />
          )}
          {activeTab === 'sip' && <SIPCompounding />}
          {activeTab === 'coach' && <AICoach budget={budget} debts={debts} />}
        </div>
      </main>

      {/* Minimal Aesthetic Footer */}
      <footer className="bg-white border-t border-slate-100 py-6 mt-12 text-center text-xs text-slate-400">
        <div className="w-full max-w-7xl mx-auto px-4 space-y-1">
          <p>© 2026 Smart Money Coach. सभी अधिकार सुरक्षित हैं।</p>
          <p className="text-[10px]">सीखते रहो, बढ़ते रहो, और अपनी बचत को निवेश में बदलना शुरू करो!</p>
        </div>
      </footer>
    </div>
  );
}
