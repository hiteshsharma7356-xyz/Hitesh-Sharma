/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { BudgetData, DebtItem, ChatMessage } from '../types';
import { Send, Bot, User, Sparkles, Loader2, RefreshCcw, LayoutDashboard } from 'lucide-react';

interface AICoachProps {
  budget: BudgetData;
  debts: DebtItem[];
}

export default function AICoach({ budget, debts }: AICoachProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      content: 'नमस्ते! मैं आपका **AI स्मार्ट मनी कोच** हूँ। मैंने आपके बजट कैलकुलेटर और कर्ज़ वाली शीट का डेटा रिव्यू कर लिया है।\n\nआप अपनी बचत को असली निवेश में कैसे बदल सकते हैं, इस पर कोई भी सवाल पूछें! या नीचे दिए गए किसी ट्रिगर पर क्लिक करें:',
      timestamp: new Date().toLocaleTimeString(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Compute values for AI prompt payload
  const currentSavings = Math.max(0, budget.monthlyIncome - (budget.rent + budget.groceries + budget.utilities + budget.debtEmi + budget.wants + budget.existingInvestment));
  
  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    // Add user message
    const userMsg: ChatMessage = {
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/gemini/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          chatHistory: messages.map(m => ({ role: m.role, content: m.content })),
          financialContext: {
            income: budget.monthlyIncome,
            savings: currentSavings,
            expensesList: [
              { name: 'Rent', amount: budget.rent },
              { name: 'Groceries', amount: budget.groceries },
              { name: 'Utilities', amount: budget.utilities },
              { name: 'Debt EMI', amount: budget.debtEmi },
              { name: 'Wants', amount: budget.wants },
              { name: 'Existing Investment', amount: budget.existingInvestment }
            ],
            debts: debts.map(d => ({ name: d.name, amount: d.amount, rate: d.interestRate })),
            emergencyFund: budget.rent + budget.groceries + budget.utilities + budget.debtEmi,
            sipAmount: budget.existingInvestment
          }
        }),
      });

      const data = await response.json();
      if (response.ok) {
        const coachMsg: ChatMessage = {
          role: 'model',
          content: data.response || 'माफ़ कीजियेगा, मैं समझ नहीं पाया। कृपया दोबारा आज़माएं।',
          timestamp: new Date().toLocaleTimeString(),
        };
        setMessages(prev => [...prev, coachMsg]);
      } else {
        throw new Error(data.error || 'Server error');
      }
    } catch (error: any) {
      console.error(error);
      const errorMsg: ChatMessage = {
        role: 'model',
        content: `⚠️ त्रुटि: कोच से फ़िलहाल संपर्क नहीं हो सका। कृपया सुनिश्चित करें कि **Settings > Secrets** में आपका \`GEMINI_API_KEY\` सही है। \n\n*विवरण: ${error.message}*`,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  // Quick Action prompts triggers in Hindi matching the script keywords
  const promptSuggestions = [
    'मेरा बजट रिव्यू करके कस्टमाइज़्ड रिपोर्ट दें',
    'मुझे क्रेडिट कार्ड कर्ज़ पहले चुकाना चाहिए या निवेश शुरू करना चाहिए?',
    'इमरजेंसी फंड को कहाँ पार्क करना सबसे ज़्यादा सुरक्षित और सही है?',
    'मेरे बजट आधारित 50-30-20 नियम का विश्लेषण करें',
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-220px)] min-h-[500px]">
      {/* Sidebar - Context summary for AI */}
      <div className="lg:col-span-4 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between overflow-y-auto">
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <LayoutDashboard className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-800 text-sm">एआई कोच का डेटाबेस (Injected Context)</h3>
          </div>

          <p className="text-[11px] text-slate-400">
            आपका लाइव बजट डेटा कोच को स्वचालित रूप से भेज दिया गया है ताकि वह आपकी परिस्थिति के अनुकूल सटीक परामर्श दे सके।
          </p>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
              <span className="text-slate-500">मासिक आय (Income):</span>
              <span className="font-bold text-slate-800">₹{budget.monthlyIncome.toLocaleString()}</span>
            </div>

            <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
              <span className="text-slate-500">बचत दर (Savings Rate):</span>
              <span className="font-bold text-slate-800">
                {budget.monthlyIncome > 0 ? ((currentSavings / budget.monthlyIncome) * 100).toFixed(1) : 0}%
              </span>
            </div>

            <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
              <span className="text-slate-500">सक्रिय कर्ज़ की संख्या (Debts):</span>
              <span className="font-bold text-slate-800">{debts.length}</span>
            </div>

            <div className="flex justify-between p-2 bg-emerald-50 text-emerald-800 rounded-lg">
              <span className="font-medium">वर्त्तमान निवेश (SIP):</span>
              <span className="font-extrabold font-mono">₹{budget.existingInvestment.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Suggestion prompt boxes */}
        <div className="space-y-2 pt-4 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-400 uppercase block tracking-wider">त्वरित प्रश्न (Quick Questions):</span>
          <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1">
            {promptSuggestions.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => sendMessage(p)}
                disabled={loading}
                className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-emerald-50 border border-slate-100 hover:border-emerald-100 text-[11px] text-slate-600 hover:text-emerald-700 transition-all font-medium leading-relaxed block"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="lg:col-span-8 bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col h-full overflow-hidden">
        {/* Chat header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center text-white relative">
              <Bot className="w-5 h-5 animate-pulse" />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full"></span>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                AI स्मार्ट मनी सलाहकार <Sparkles className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              </h4>
              <p className="text-[10px] text-slate-400">विशेष रूप से बचत-टू-निवेश परिवर्तन हेतु प्रशिक्षित</p>
            </div>
          </div>
          
          <button 
            type="button"
            onClick={() => setMessages([messages[0]])}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 font-medium px-2.5 py-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <RefreshCcw className="w-3 h-3" /> चैट साफ़ करें
          </button>
        </div>

        {/* Message Thread scrolling container */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/20">
          {messages.map((m, idx) => {
            const isBot = m.role === 'model';
            return (
              <div 
                key={idx}
                className={`flex gap-3 max-w-[85%] ${isBot ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  isBot ? 'bg-emerald-50 border border-emerald-100 text-emerald-600' : 'bg-slate-800 text-white'
                }`}>
                  {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div className={`space-y-1 ${isBot ? 'text-left' : 'text-right'}`}>
                  <div className={`p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                    isBot 
                      ? 'bg-white border border-slate-100 text-slate-700 shadow-sm' 
                      : 'bg-emerald-600 text-white shadow-sm'
                  }`}>
                    {m.content}
                  </div>
                  <span className="text-[9px] text-slate-400 block px-1.5">{m.timestamp}</span>
                </div>
              </div>
            );
          })}
          
          {loading && (
            <div className="flex gap-3 max-w-[85%] mr-auto">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm text-xs text-slate-400 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                स्मार्ट मनी कोच विश्लेशण कर रहा है...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Text Input Footer bar */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(inputMessage);
          }}
          className="p-4 border-t border-slate-100 bg-white flex gap-2"
        >
          <input 
            type="text"
            placeholder="अपना सवाल हिंदी या हिंग्लिश में लिखो... (उदा. SIP कैसे शुरू करूँ?)"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={loading}
            className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 text-xs text-slate-800"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || loading}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-100 text-white disabled:text-slate-400 w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
