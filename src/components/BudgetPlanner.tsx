/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BudgetData, DebtItem } from '../types';
import { Calculator, ShieldAlert, Plus, Trash2, TrendingDown, HelpCircle, CheckCircle2, RefreshCw } from 'lucide-react';

interface BudgetPlannerProps {
  budget: BudgetData;
  setBudget: React.Dispatch<React.SetStateAction<BudgetData>>;
  debts: DebtItem[];
  setDebts: React.Dispatch<React.SetStateAction<DebtItem[]>>;
}

export default function BudgetPlanner({ budget, setBudget, debts, setDebts }: BudgetPlannerProps) {
  // Local state for adding a new debt item
  const [newDebtName, setNewDebtName] = useState('');
  const [newDebtAmount, setNewDebtAmount] = useState<number | ''>('');
  const [newDebtRate, setNewDebtRate] = useState<number | ''>('');

  // Sane default debts from script (Credit Card)
  useEffect(() => {
    if (debts.length === 0) {
      setDebts([
        { id: '1', name: 'क्रेडिट कार्ड बकाया (Credit Card)', amount: 45000, interestRate: 36 },
      ]);
    }
  }, []);

  // Compute values
  const totalEssentials = budget.rent + budget.groceries + budget.utilities + budget.debtEmi;
  const totalWants = budget.wants;
  const currentInvestment = budget.existingInvestment;
  const totalExpenses = totalEssentials + totalWants + currentInvestment;
  const leftoverSavings = Math.max(0, budget.monthlyIncome - totalExpenses);
  const savingsRate = budget.monthlyIncome > 0 ? (leftoverSavings / budget.monthlyIncome) * 100 : 0;

  // Emergency Fund needs
  const fixedExpenses = budget.rent + budget.groceries + budget.utilities + (debts.length > 0 ? budget.debtEmi : 0);
  const emergencyFund3Months = fixedExpenses * 3;
  const emergencyFund6Months = fixedExpenses * 6;

  // Debt Logic Handlers
  const handleAddDebt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDebtName || !newDebtAmount || !newDebtRate) return;
    const item: DebtItem = {
      id: Date.now().toString(),
      name: newDebtName,
      amount: Number(newDebtAmount),
      interestRate: Number(newDebtRate),
    };
    setDebts([...debts, item]);
    setNewDebtName('');
    setNewDebtAmount('');
    setNewDebtRate('');
  };

  const handleRemoveDebt = (id: string) => {
    setDebts(debts.filter(d => d.id !== id));
  };

  // 50-30-20 Targets vs Actuals
  const targetEssentials = budget.monthlyIncome * 0.50;
  const targetWants = budget.monthlyIncome * 0.30;
  const targetInvestments = budget.monthlyIncome * 0.20;

  // High Interest Debt Check (CC rate is 36% vs SIP returns of 12%)
  const hasHighInterestDebt = debts.some(d => d.interestRate > 12);

  return (
    <div className="space-y-8">
      {/* STEPS TIMELINE OVERVIEW BAIT */}
      <div id="planner-timeline" className="bg-slate-50 border border-slate-100 rounded-2xl p-4 md:p-6">
        <div className="flex items-center gap-3">
          <Calculator className="w-6 h-6 text-emerald-600" />
          <div>
            <h2 className="font-extrabold text-slate-800 text-lg sm:text-xl">
              बजट और सुरक्षा नेट प्लानिंग (Budget & Safety Planning)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              यहाँ हम अपनी असली वित्तीय स्थिति देखेंगे, इमरजेंसी फंड बनाएंगे, कर्ज़ निपटायेंगे और 50-30-20 बजट नियम लगाएंगे।
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: STEP 1 - True Financial Picture Ledger */}
        <div id="step-1-ledger" className="lg:col-span-6 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[11px] font-bold rounded-md uppercase tracking-wider mb-2">
              स्टेप एक
            </div>
            <h3 className="font-bold text-slate-800 text-base">असली वित्तीय तस्वीर (Monthly Ledger Sheet)</h3>
            <p className="text-xs text-slate-400 mt-1">
              "पहला काम है एक कागज़ निकालो। लिखो—हर महीने कितना आता है, कितना खर्च होता है।"
            </p>
          </div>

          <div className="space-y-4 text-sm">
            {/* Monthly Income input */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 block">मासिक आय (Monthly Income)</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-400 font-bold">₹</span>
                <input 
                  type="number"
                  placeholder="30000"
                  value={budget.monthlyIncome || ''}
                  onChange={(e) => setBudget({ ...budget, monthlyIncome: Number(e.target.value) })}
                  className="w-full pl-7 pr-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>
            </div>

            {/* Expenses List Inputs grouped */}
            <div className="space-y-3 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              <span className="text-xs font-bold text-slate-500 block uppercase tracking-wider">जरूरी खर्चे (Essentials - Needs)</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-600 block">किराया / होम लोन EMI (Rent)</label>
                  <input 
                    type="number"
                    value={budget.rent || ''}
                    onChange={(e) => setBudget({ ...budget, rent: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 border border-slate-200 bg-white rounded-lg focus:outline-none focus:border-indigo-400 text-xs text-slate-800 font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-600 block">राशन / घरेलू सामान (Groceries)</label>
                  <input 
                    type="number"
                    value={budget.groceries || ''}
                    onChange={(e) => setBudget({ ...budget, groceries: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 border border-slate-200 bg-white rounded-lg focus:outline-none focus:border-indigo-400 text-xs text-slate-800 font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-600 block">बिजली, पानी, मोबाइल (Utilities)</label>
                  <input 
                    type="number"
                    value={budget.utilities || ''}
                    onChange={(e) => setBudget({ ...budget, utilities: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 border border-slate-200 bg-white rounded-lg focus:outline-none focus:border-indigo-400 text-xs text-slate-800 font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-600 block">सक्रिय कर्ज़ EMI (Debt EMI)</label>
                  <input 
                    type="number"
                    value={budget.debtEmi || ''}
                    onChange={(e) => setBudget({ ...budget, debtEmi: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 border border-slate-200 bg-white rounded-lg focus:outline-none focus:border-indigo-400 text-xs text-slate-800 font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Wants & active savings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 block text-xs">इच्छाएं (Wants / Lifestyle)</label>
                <input 
                  type="number"
                  placeholder="मनोरंजन, यात्रा आदि"
                  value={budget.wants || ''}
                  onChange={(e) => setBudget({ ...budget, wants: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 font-semibold text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 block text-xs">अन्य सक्रिय निवेश (Current SIP/Invest)</label>
                <input 
                  type="number"
                  placeholder="म्यूचुअल फंड, गोल्ड आदि"
                  value={budget.existingInvestment || ''}
                  onChange={(e) => setBudget({ ...budget, existingInvestment: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 font-semibold text-sm"
                />
              </div>
            </div>
          </div>

          {/* Ledger Calculation Dashboard output */}
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center text-xs text-slate-500">
              <span>कुल मासिक खर्च (Expenses Outlay):</span>
              <span className="font-bold text-slate-800">₹{totalExpenses.toLocaleString('en-IN')}</span>
            </div>
            
            <div className="border-t border-slate-100 pt-2.5 flex justify-between items-center">
              <span className="font-semibold text-slate-700 text-sm">मासिक उपलब्ध अतिरिक्त बचत:</span>
              <span className={`text-base font-extrabold ${leftoverSavings > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                ₹{leftoverSavings.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Savings Rate progress indicator */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-[11px] font-medium">
                <span className="text-slate-400">उपलब्ध बचत दर (Savings Rate):</span>
                <span className={savingsRate >= 20 ? 'text-emerald-600 font-bold' : 'text-amber-500 font-semibold'}>
                  {savingsRate.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${savingsRate >= 20 ? 'bg-emerald-500' : 'bg-amber-400'}`}
                  style={{ width: `${Math.min(100, savingsRate)}%` }}
                ></div>
              </div>
              {savingsRate < 20 && (
                <span className="text-[10px] text-amber-500 block leading-tight mt-1">
                  💡 <strong>सुझाव:</strong> कम से कम 20% बजट निवेश में जाना चाहिए। कृपया खर्चों को थोड़ा नियंत्रित करें।
                </span>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: STEP 2, 3, 6 CALCULATORS */}
        <div id="step-2-3-6-calculators" className="lg:col-span-6 space-y-6">
          {/* STEP 2: Emergency Fund safety nets */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-2.5">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-md uppercase tracking-wider mb-2">
                स्टेप दो
              </div>
              <h3 className="font-bold text-slate-800 text-base">इमरजेंसी फंड की गणना (Emergency Fund Plan)</h3>
              <p className="text-xs text-slate-400 mt-1">
                "जिंदगी में अचानक मेडिकल या नौकरी जाने की आपातकालीन स्थिति के लिए Safety Net आवश्यक है।"
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl">
                <span className="text-xs text-slate-400 block font-medium">Safe Zone (3 महीने का खर्च)</span>
                <span className="text-base font-bold text-slate-800 mt-1 block">
                  ₹{emergencyFund3Months.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">सीमित सुरक्षा</span>
              </div>

              <div className="bg-emerald-50/50 border border-emerald-100 p-3.5 rounded-xl">
                <span className="text-xs text-emerald-700 block font-semibold">Ultimate Zone (6 महीने का खर्च)</span>
                <span className="text-base font-extrabold text-emerald-600 mt-1 block">
                  ₹{emergencyFund6Months.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-emerald-500 mt-0.5 block">पूर्ण मानसिक शांति</span>
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-amber-800 text-[11px] leading-relaxed">
              👉 <strong>नियम:</strong> इस फंड को किसी हाई-इंटरेस्ट बचत खाते या लिक्विड म्यूचुअल फंड में रखें। गलती से भी शेयर मार्केट या अन्य रिस्की जगह पर न लगाएं, ताकि संकट के समय यह तुरंत निकल सके।
            </div>
          </div>

          {/* STEP 3: Debt Payoff Inspector (VERY IMPORTANT STEP!) */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-2.5 flex items-center justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-rose-50 text-rose-700 text-[11px] font-bold rounded-md uppercase tracking-wider mb-1.5">
                  स्टेप तीन (सबसे महत्वपूर्ण!)
                </div>
                <h3 className="font-bold text-slate-800 text-base">महंगे कर्ज़ से मुक्ति (Debt Payoff Rules)</h3>
              </div>
              {hasHighInterestDebt && (
                <span className="flex items-center gap-1 text-xs text-rose-600 font-bold bg-rose-50 px-2 py-1 rounded-lg">
                  <ShieldAlert className="w-3.5 h-3.5" /> एक्शन लें!
                </span>
              )}
            </div>

            <p className="text-xs text-slate-400">
              "पहले 36% वार्षिक ब्याज का क्रेडिट कार्ड चुकाएं, फिर 12% म्यूचुअल फंड में निवेश करें। कर्ज़ के रहते निवेश का गणित हार जाता है।"
            </p>

            {/* Active debt lists interactive */}
            <div className="space-y-3">
              {debts.map((item) => {
                const isHighRate = item.interestRate > 12;
                return (
                  <div key={item.id} className="flex justify-between items-center bg-slate-50 border border-slate-100 p-3 rounded-xl">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-800 block">{item.name}</span>
                      <div className="flex gap-3 text-[10px]">
                        <span className="text-slate-400">मूलधन: <strong className="text-slate-700">₹{item.amount.toLocaleString()}</strong></span>
                        <span className={`font-semibold ${isHighRate ? 'text-rose-500' : 'text-slate-500'}`}>
                          ब्याज दर: {item.interestRate}%
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleRemoveDebt(item.id)}
                      className="text-slate-400 hover:text-rose-500 p-1 rounded-lg hover:bg-slate-100 transition-colors"
                      title="हटाएं"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}

              {debts.length === 0 && (
                <div className="text-center py-4 text-xs text-slate-400 flex items-center justify-center gap-1 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> बहुत बढ़िया! आप पर वर्तमान में कोई कर्ज़ नहीं है।
                </div>
              )}
            </div>

            {/* Form to add debts */}
            <form onSubmit={handleAddDebt} className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
              <input 
                type="text" 
                placeholder="उदा. गृह ऋण" 
                value={newDebtName}
                onChange={(e) => setNewDebtName(e.target.value)}
                className="col-span-1 px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
              />
              <input 
                type="number" 
                placeholder="बकाया राशि (₹)" 
                value={newDebtAmount}
                onChange={(e) => setNewDebtAmount(e.target.value === '' ? '' : Number(e.target.value))}
                className="col-span-1 px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
              />
              <div className="col-span-1 flex gap-1">
                <input 
                  type="number" 
                  placeholder="ब्याज दर (%)" 
                  value={newDebtRate}
                  onChange={(e) => setNewDebtRate(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                />
                <button 
                  type="submit" 
                  className="bg-slate-800 hover:bg-slate-900 text-white font-bold p-1.5 rounded-lg shrink-0 text-xs flex items-center justify-center"
                  title="जोड़ें"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

          {/* STEP 6: 50-30-20 rule implementation (VERY IMPORTANT STEP!) */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-2.5">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-amber-50 text-amber-700 text-[11px] font-bold rounded-md uppercase tracking-wider mb-2">
                स्टेप छह (सबसे महत्वपूर्ण!)
              </div>
              <h3 className="font-bold text-slate-800 text-base">50-30-20 नियम विजुअलाइज़र (50-30-20 Formula)</h3>
              <p className="text-xs text-slate-400 mt-1">
                "आपकी कमाई का 50% जरूरी खर्चों पर, 30% इच्छाओं पर, और 20% अनिवार्य रूप से बचत/निवेश में जाना चाहिए।"
              </p>
            </div>

            {/* Income Raising Slider Test Simulation (Lifestyle Inflation test) */}
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">सैलरी बढ़ने पर क्या करेंगे? (Simulation)</span>
                <span className="font-extrabold text-indigo-600">₹{budget.monthlyIncome.toLocaleString()}</span>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-slate-400">
                  सैलरी बढ़ने पर लोग लाइफस्टाइल (महंगा फोन, बड़ा घर) बढ़ा लेते हैं, जिससे निवेश वही रहता है। सही तरीका है कि निवेश का अनुपात बढ़ाएं!
                </p>
                <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                  <span>जरूरी (Essentials limit): <strong className="text-slate-800">₹{(budget.monthlyIncome * 0.50).toLocaleString()}</strong></span>
                  <span>इच्छाएं (Wants limit): <strong className="text-slate-800">₹{(budget.monthlyIncome * 0.30).toLocaleString()}</strong></span>
                  <span>अपेक्षित न्यूनतम निवेश: <strong className="text-emerald-600">₹{(budget.monthlyIncome * 0.20).toLocaleString()}</strong></span>
                </div>
              </div>
            </div>

            {/* Dynamic Comparison Actuals VS Ideal Target Bars */}
            <div className="space-y-3 text-xs">
              <span className="font-bold text-slate-800 block">आपकी वर्तमान बजट स्थिति बनाम आदर्श लक्ष्य:</span>
              
              {/* Essentials Needs */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-600 font-medium">1. आवश्यक खर्चे (Essentials - Needs - 50%):</span>
                  <span className="text-slate-700">वर्तमान में ₹{totalEssentials.toLocaleString()} ({(totalEssentials / (budget.monthlyIncome || 1) * 100).toFixed(0)}%) / लक्ष्य: ₹{targetEssentials.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
                  <div className="bg-indigo-500 h-full" style={{ width: `${Math.min(100, (totalEssentials / (budget.monthlyIncome || 1)) * 100)}%` }}></div>
                </div>
              </div>

              {/* Wants */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-600 font-medium">2. व्यक्तिगत इच्छाएं (Wants / Leisure - 30%):</span>
                  <span className="text-slate-700">वर्तमान में ₹{totalWants.toLocaleString()} ({(totalWants / (budget.monthlyIncome || 1) * 100).toFixed(0)}%) / लक्ष्य: ₹{targetWants.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full" style={{ width: `${Math.min(100, (totalWants / (budget.monthlyIncome || 1)) * 100)}%` }}></div>
                </div>
              </div>

              {/* Investments */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-600 font-medium">3. कुल दीर्घकालिक निवेश (Investment - 20%):</span>
                  <span className="text-emerald-600 font-bold">वर्तमान में ₹{currentInvestment.toLocaleString()} ({(currentInvestment / (budget.monthlyIncome || 1) * 100).toFixed(0)}%) / लक्ष्य: ₹{targetInvestments.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full" style={{ width: `${Math.min(100, (currentInvestment / (budget.monthlyIncome || 1)) * 100)}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
